import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useApp } from '../../context/AppContext';
import type { ContractAddendumDocument, Project, ScheduleAddendum, SpkType } from '../../types';
import { sourceFromAddendum, sourceFromAgreement, sourceFromSpk } from '../../utils/contractAddendum';
import { contractAddendumHtml, downloadContractAddendum } from '../../utils/contractAddendumExport';
import { formatTanggalIndo } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';
import { isOriginalSchedule } from '../../utils/scheduleVersions';

const panel = 'space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5';
const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900';
const action = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50';
const primary = 'rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50';

function AddendumPreview({ document }: { document: ContractAddendumDocument }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const section = useRef<HTMLElement>(null);
  const html = useMemo(() => contractAddendumHtml(document), [document]);
  useEffect(() => {
    section.current?.focus({ preventScroll: true });
    section.current?.scrollIntoView({ block: 'start' });
  }, [document]);
  return (
    <section ref={section} tabIndex={-1} aria-label="Pratinjau addendum" className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">Pratinjau addendum</h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={action} onClick={() => downloadContractAddendum(document, html)}>Unduh Word (.doc)</button>
          <button type="button" className={action} onClick={() => frame.current?.contentWindow?.print()}>Cetak addendum</button>
        </div>
      </div>
      <iframe ref={frame} title="Naskah addendum" srcDoc={html} sandbox="allow-same-origin allow-modals" className="h-[65vh] w-full rounded-lg border border-slate-200 bg-white" />
    </section>
  );
}

export function ContractAddendumBuilder({ project, category, recordsOnly = false }: {
  project: Project;
  category: SpkType;
  recordsOnly?: boolean;
}) {
  const { currentUser, getContractByProject, getSpkContractByProjectAndType, scheduleAddendums, saveScheduleAddendum, saveConsultantAddendum, completeContractAddendum } = useApp();
  const canEdit = hasPermission(currentUser?.role, 'edit_contract');
  const schedules = scheduleAddendums.filter(item => item.projectId === project.id && !isOriginalSchedule(item));
  const records = category === 'fisik'
    ? schedules.map(item => ({ id: item.id, nomor: item.nomorSurat || item.nomorAddendum, tanggal: item.tanggal, uraian: item.judul || item.alasan, dokumenKontrak: item.dokumenKontrak }))
    : project.progresKonsultan?.[category]?.addendums ?? [];
  const agreement = category === 'fisik' ? getContractByProject(project.id) : undefined;
  const spk = getSpkContractByProjectAndType(project.id, category);

  const [completingId, setCompletingId] = useState<string>();
  const completing = records.find(record => record.id === completingId);
  const editor = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!completingId) return;
    editor.current?.focus({ preventScroll: true });
    editor.current?.scrollIntoView({ block: 'start' });
  }, [completingId]);

  const sources = [
    ...(agreement ? [sourceFromAgreement(agreement)] : []),
    ...(spk ? [sourceFromSpk(spk)] : []),
    ...records.flatMap(item => item.dokumenKontrak &&
      (!completing?.tanggal || item.dokumenKontrak.tanggal <= completing.tanggal)
      ? [sourceFromAddendum(item.id, item.dokumenKontrak)] : []),
  ];
  const [sourceId, setSourceId] = useState('');
  const source = completing?.dokumenKontrak ? completing.dokumenKontrak.sumber : sources.find(item => item.id === sourceId) ?? sources[0];
  const [edits, setEdits] = useState<Record<string, string | undefined>>({});
  const [preview, setPreview] = useState<ContractAddendumDocument>();
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const [status, setStatus] = useState<{ error?: boolean; text: string }>();

  const selectRecord = (id?: string) => {
    if (Object.values(edits).some(value => value?.trim()) &&
        !window.confirm('Buang isian perubahan pasal yang belum disimpan?')) return;
    setCompletingId(id);
    setSourceId('');
    const selected = records.find(record => record.id === id);
    setEdits(Object.fromEntries((selected?.dokumenKontrak?.sumber.pasal ?? []).map(item => [item.id, item.perubahan])));
    setPreview(undefined);
    setStatus(undefined);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!source || !canEdit || pending.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const value = (key: string) => String(fields.get(key) ?? '').trim();
    const nomor = (completing?.nomor || value('nomor')).trim();
    const tanggal = completing?.tanggal || value('tanggal');
    const uraian = (completing?.uraian || value('uraian')).trim();
    if (!nomor || !tanggal || !uraian || source.pasal.some(item => edits[item.id] !== undefined && !edits[item.id]?.trim())) {
      setStatus({ error: true, text: 'Lengkapi nomor, tanggal, uraian, dan semua klausul yang ditandai Berubah.' });
      return;
    }
    if (!completing && records.some(item => item.nomor.trim().toLowerCase() === nomor.toLowerCase() ||
        item.dokumenKontrak?.nomor.trim().toLowerCase() === nomor.toLowerCase())) {
      setStatus({ error: true, text: 'Nomor addendum sudah digunakan di kategori ini.' });
      return;
    }
    const document: ContractAddendumDocument = {
      nomor, tanggal, uraian,
      sumber: { ...source, pasal: source.pasal.map(item => ({ ...item, perubahan: edits[item.id]?.trim() })) },
    };
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    if (submitter instanceof HTMLButtonElement && submitter.value === 'preview') {
      setStatus(undefined);
      setPreview(document);
      return;
    }

    pending.current = true;
    setSaving(true);
    setStatus(undefined);
    try {
      const id = completing?.id ?? crypto.randomUUID();
      const saved = completing ? await completeContractAddendum(project.id, category, id, document) : category === 'fisik'
        ? await saveScheduleAddendum({
          id, projectId: project.id, nomorAddendum: nomor, nomorSurat: nomor, tanggal, judul: uraian, alasan: uraian,
          tanggalBerlaku: value('berlaku') || undefined,
          tanggalSelesaiBaru: value('selesai') || undefined,
          durasiHariBaru: value('durasi') ? Number(value('durasi')) : undefined,
          nilaiKontrakBaru: value('nilai') ? Number(value('nilai')) : undefined,
          jenisPerubahan: value('jenis') as ScheduleAddendum['jenisPerubahan'],
          warnaGaris: '#2563eb', isAktif: false, targetMingguan: [], dokumenKontrak: document,
        })
        : await saveConsultantAddendum(project.id, category, { id, nomor, tanggal, uraian, dokumenKontrak: document });
      if (!saved) {
        setStatus({ error: true, text: 'Addendum gagal disimpan ke Supabase. Isian masih tersedia untuk dicoba lagi.' });
        return;
      }
      form.reset();
      setCompletingId(undefined);
      setEdits({});
      setPreview(document);
      setStatus({ text: 'Addendum tersimpan dan tersedia sebagai sumber untuk addendum berikutnya.' });
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };

  const sortedRecords = [...records].sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  return (
    <div className="space-y-4">
      <section className={panel}>
        <h3 className="text-base font-semibold text-slate-900">Riwayat naskah addendum</h3>
        {sortedRecords.length === 0 ? <p className="text-sm text-slate-600">Belum ada naskah addendum tersimpan.</p> : (
          <ul className="divide-y divide-slate-200">
            {sortedRecords.map(record => (
              <li key={record.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div><p className="font-semibold text-slate-900">{record.nomor} · {formatTanggalIndo(record.tanggal)}</p>
                  <p className="whitespace-pre-wrap break-words text-slate-600">{record.uraian}</p></div>
                {record.dokumenKontrak ? (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={action} onClick={() => setPreview(record.dokumenKontrak)}>Lihat naskah {record.nomor}</button>
                    {canEdit && <button type="button" disabled={saving} className={action} onClick={() => selectRecord(record.id)}>Edit Naskah</button>}
                  </div>
                ) : canEdit && (
                  <button type="button" disabled={saving} className={action} onClick={() => selectRecord(record.id)}>Lengkapi Naskah</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      {(!recordsOnly || completing) && (
        <section ref={editor} tabIndex={-1} className={panel}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900">{completing ? (completing.dokumenKontrak ? 'Edit naskah addendum ' : 'Lengkapi naskah addendum ') + completing.nomor : 'Buat naskah addendum'}</h3>
            {completing && <button type="button" disabled={saving} className={action} onClick={() => selectRecord()}>Batal melengkapi</button>}
          </div>
          {!canEdit ? <p className="text-sm text-slate-600">Peran Anda tidak memiliki izin membuat addendum.</p> :
            !source ? <p className="text-sm text-slate-600">Simpan kontrak awal di tab Buat kontrak agar bisa dipilih sebagai sumber.</p> : (
            <form key={completing?.id ?? "new"} className="space-y-4" onSubmit={submit}>
              <fieldset disabled={saving} className="min-w-0 space-y-4">
                <label className="grid max-w-xl gap-1 text-sm font-semibold text-slate-800">
                  Dokumen sumber
                  <select disabled={Boolean(completing?.dokumenKontrak)} className={field} value={source.id} onChange={event => {
                    if (Object.values(edits).some(value => value?.trim()) && !window.confirm('Ganti sumber dan kosongkan isian perubahan pasal?')) return;
                    setSourceId(event.target.value);
                    setEdits({});
                    setPreview(undefined);
                    setStatus(undefined);
                  }}>
                    {completing?.dokumenKontrak && <option value={source.id}>Sumber tersimpan · {source.nomor}</option>}
                    {!completing?.dokumenKontrak && sources.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.id.startsWith('addendum:') ? 'Addendum' : 'Kontrak awal'} · {item.jenis === 'spk' ? 'SPK' : 'Surat Perjanjian'} · {item.nomor || 'Nomor belum diisi'}
                      </option>
                    ))}
                  </select>
                </label>
                {completing && <p className="text-xs text-slate-600">{completing.dokumenKontrak ? 'Isi sumber tersimpan digunakan untuk koreksi naskah ini.' : 'Pilih kontrak awal atau addendum yang mendahului catatan ini, kemudian isi pasal yang berubah.'}</p>}
                <dl className="grid gap-3 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-3">
                  <div><dt className="text-slate-600">Paket pekerjaan</dt><dd className="font-medium text-slate-900">{source.namaPaket || '—'}</dd></div>
                  <div><dt className="text-slate-600">Pejabat penandatangan kontrak</dt><dd className="font-medium text-slate-900">{source.ppk || '—'}</dd></div>
                  <div><dt className="text-slate-600">Penyedia</dt><dd className="font-medium text-slate-900">{source.penyedia || '—'}</dd></div>
                </dl>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm font-medium text-slate-800">Nomor addendum<input name="nomor" required defaultValue={completing?.nomor} readOnly={Boolean(completing?.nomor)} className={field} /></label>
                  <label className="grid gap-1 text-sm font-medium text-slate-800">Tanggal addendum<input name="tanggal" required type="date" defaultValue={completing?.tanggal} readOnly={Boolean(completing?.tanggal)} className={field} /></label>
                  <div className="grid gap-1 text-sm font-medium text-slate-800 sm:col-span-2">
                    <label htmlFor="contract-addendum-description">Uraian addendum</label>
                    <textarea id="contract-addendum-description" name="uraian" rows={2} required defaultValue={completing?.uraian} readOnly={Boolean(completing?.uraian)} className={field} />
                  </div>
                </div>
                {category === 'fisik' && !completing && (
                  <details className="rounded-lg border border-slate-200 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-800">Data jadwal dan nilai kontrak fisik</summary>
                    <p className="mt-2 text-xs text-slate-600">Isi tanggal berlaku untuk penetapan Kurva S. Isi nilai, durasi, atau tanggal selesai baru jika ada perubahan.</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-sm">Jenis perubahan<select name="jenis" className={field} defaultValue="Pekerjaan Tambah Kurang (CCO)">
                        <option>Perpanjangan Waktu</option><option>Pekerjaan Tambah Kurang (CCO)</option><option>Perubahan Desain</option><option>Waktu dan Biaya</option>
                      </select></label>
                      <label className="grid gap-1 text-sm">Tanggal mulai berlaku<input type="date" name="berlaku" className={field} /></label>
                      <label className="grid gap-1 text-sm">Tanggal selesai baru<input type="date" name="selesai" className={field} /></label>
                      <label className="grid gap-1 text-sm">Durasi baru (hari)<input type="number" name="durasi" min="1" step="1" className={field} /></label>
                      <label className="grid gap-1 text-sm">Nilai kontrak baru (Rp)<input type="number" name="nilai" min="0" step="1" className={field} /></label>
                    </div>
                  </details>
                )}
                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">Isi pasal dan ketentuan</h4>
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {source.pasal.map(item => {
                      const changed = edits[item.id] !== undefined;
                      const title = item.label + ' · ' + item.judul;
                      return (
                        <li key={item.id} className="space-y-2 p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h5 className="text-sm font-semibold text-slate-900">{title}</h5>
                            <div role="group" aria-label={title} className="flex gap-1">
                              <button type="button" aria-pressed={!changed} className={action + ' aria-pressed:border-emerald-600 aria-pressed:bg-emerald-50'} onClick={() => setEdits(current => ({ ...current, [item.id]: undefined }))}>Sama</button>
                              <button type="button" aria-pressed={changed} className={action + ' aria-pressed:border-emerald-600 aria-pressed:bg-emerald-50'} onClick={() => setEdits(current => ({ ...current, [item.id]: current[item.id] ?? '' }))}>Berubah</button>
                            </div>
                          </div>
                          {changed ? <>
                            <div className="grid gap-1 text-sm text-slate-800">
                              <strong>Klausul sebelumnya</strong>
                              <div className="whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3">{item.sebelumnya || '—'}</div>
                            </div>
                            <label className="grid gap-1 text-sm font-medium text-slate-800">
                              Klausul perubahan
                              <textarea aria-label={'Klausul perubahan ' + title} value={edits[item.id]} onChange={event => setEdits(current => ({ ...current, [item.id]: event.target.value }))} rows={4} required className={field} />
                            </label>
                          </> : (
                            <details className="text-sm text-slate-600">
                              <summary className="cursor-pointer">Lihat isi sumber</summary>
                              <div className="mt-1 whitespace-pre-wrap break-words">{item.sebelumnya || '—'}</div>
                            </details>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="submit" value="preview" className={action}>Pratinjau naskah</button>
                  <button type="submit" value="save" className={primary}>{saving ? 'Menyimpan…' : completing ? 'Simpan naskah' : 'Simpan addendum'}</button>
                </div>
              </fieldset>
            </form>
          )}
        </section>
      )}
      {status && <p role={status.error ? 'alert' : 'status'} className={status.error ? 'text-sm text-rose-700' : 'text-sm text-emerald-800'}>{status.text}</p>}
      {preview && <AddendumPreview document={preview} />}
    </div>
  );
}
