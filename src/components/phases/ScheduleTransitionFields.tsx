import type { ScheduleReconciliationItem, ScheduleTransitionDraft, WeeklyProgress } from '../../types';
import { formatTanggalSingkat } from '../../utils/formatters';
import { parseScheduleTransition } from '../../utils/scheduleVersions';

type ItemDraft = Record<keyof ScheduleReconciliationItem, string>;

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs';

const columns: { field: keyof ItemDraft; label: string }[] = [
  { field: 'pekerjaan', label: 'Item pekerjaan' },
  { field: 'volumeTerverifikasi', label: 'Volume terukur' },
  { field: 'volumeKontrakBaru', label: 'Volume kontrak baru' },
  { field: 'bobotBaru', label: 'Bobot baru (%)' },
];

export function ScheduleTransitionFields({ draft, onChange, suggested, previousLabel, earlierReports }: {
  draft: ScheduleTransitionDraft;
  onChange: (value: ScheduleTransitionDraft) => void;
  suggested?: number;
  previousLabel?: string;
  earlierReports: WeeklyProgress[];
}) {
  const result = parseScheduleTransition(draft, suggested, earlierReports);
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-semibold text-slate-900">Peralihan acuan dan rekonsiliasi</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-semibold">Tanggal mulai berlaku
          <input type="date" className={inputClass} value={draft.date} onChange={event => onChange({ ...draft, date: event.target.value })} />
        </label>
        <label className="grid gap-1 text-xs font-semibold">Dasar perhitungan realisasi
          <select aria-label="Dasar perhitungan realisasi" className={inputClass} value={draft.mode} onChange={event => onChange({ ...draft, mode: event.target.value as ScheduleTransitionDraft['mode'] })}>
            <option value="tetap">Volume dan bobot tetap</option>
            <option value="hitung-ulang">Hitung ulang dengan volume atau bobot baru</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold">Realisasi sebelum peralihan (%)
          <input aria-label="Realisasi sebelum peralihan (%)" type="number" min="0" max="100" step="0.01" className={inputClass} value={draft.before || suggested || (suggested === 0 ? '0' : '')}
            onChange={event => onChange({ ...draft, before: event.target.value })} />
          {previousLabel && <span className="font-normal text-slate-600">Usulan dari {previousLabel}. Sesuaikan dengan posisi saat peralihan.</span>}
        </label>
        <label className="grid gap-1 text-xs font-semibold">Target pada saat peralihan (%)
          <input aria-label="Target pada saat peralihan (%)" type="number" min="0" max="100" step="0.01" className={inputClass} value={draft.target}
            onChange={event => onChange({ ...draft, target: event.target.value })} />
          <span className="font-normal text-slate-600">Gunakan target kumulatif pada acuan baru di akhir hari sebelum berlaku.</span>
        </label>
        {draft.mode === 'hitung-ulang' && !draft.items.length && (
          <label className="grid gap-1 text-xs font-semibold">Realisasi hasil rekonsiliasi (%)
            <input type="number" min="0" max="100" step="0.01" className={inputClass} value={draft.after}
              onChange={event => onChange({ ...draft, after: event.target.value })} />
          </label>
        )}
        <label className="grid gap-1 text-xs font-semibold sm:col-span-2">Dasar rekonsiliasi atau nomor berita acara
          <textarea className={inputClass} rows={2} value={draft.basis} onChange={event => onChange({ ...draft, basis: event.target.value })} />
        </label>
      </div>
      {draft.mode === 'hitung-ulang' && (
        <div className="space-y-2">
          <p className="text-xs text-slate-600">Jika menghitung dari item, masukkan semua pekerjaan dengan total bobot 100%, termasuk item yang volume terukurnya nol.</p>
          {draft.items.map((item, index) => (
            <div key={index} className="grid gap-2 rounded-lg border border-slate-200 bg-white p-2 sm:grid-cols-2">
              {columns.map(({ field, label }) => (
                <label key={field} className="grid gap-1 text-xs">{label}
                  <input type={field === 'pekerjaan' ? 'text' : 'number'} min={field === 'pekerjaan' ? undefined : '0'} step="any" className={inputClass} value={item[field]}
                    onChange={event => onChange({ ...draft, items: draft.items.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: event.target.value } : row) })} />
                </label>
              ))}
              <button type="button" className="justify-self-start text-xs font-semibold text-rose-700" onClick={() => onChange({ ...draft, items: draft.items.filter((_, rowIndex) => rowIndex !== index) })}>Hapus baris</button>
            </div>
          ))}
          <button type="button" className="text-xs font-semibold text-blue-800" onClick={() => onChange({ ...draft, items: [...draft.items, { pekerjaan: '', volumeTerverifikasi: '', volumeKontrakBaru: '', bobotBaru: '' }] })}>Tambah item rekonsiliasi</button>
        </div>
      )}
      {draft.mode === 'hitung-ulang' && earlierReports.length > 0 && (
        <details className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
          <summary className="cursor-pointer text-xs font-semibold text-blue-800">Isi realisasi hitung ulang minggu sebelumnya</summary>
          <p className="text-xs text-slate-600">Isi hanya minggu yang sudah direkonsiliasi. Angka asli tetap tersedia pada laporan masing-masing.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {earlierReports.map(report => (
              <label key={report.id} className="grid gap-1 text-xs">
                Hingga {formatTanggalSingkat(report.periodeSelesai + 'T00:00:00')} · Laporan asli {report.kumulatifRealisasi}%
                <input type="number" min="0" max="100" step="0.01" className={inputClass} placeholder="Realisasi hitung ulang (%)"
                  value={draft.riwayatMingguan?.[report.id] ?? ''}
                  onChange={event => onChange({ ...draft, riwayatMingguan: { ...draft.riwayatMingguan, [report.id]: event.target.value } })} />
              </label>
            ))}
          </div>
        </details>
      )}
      {result && <p className="text-xs font-semibold text-emerald-800">Saldo awal realisasi pada acuan baru {result.realisasiSesudah}%</p>}
    </section>
  );
}
