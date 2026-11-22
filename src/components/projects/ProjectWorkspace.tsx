import { useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ClipboardCheck, DraftingCompass, HardHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ConsultantSpkType, ConsultantStage, Project, SpkType } from '../../types';
import { formatRupiah, formatTanggalIndo } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';
import { getProjectPackage, projectPackageLabels } from '../../utils/projectPackages';
import { BeritaAcaraList } from '../beritaAcara/BeritaAcaraList';
import { KontrakModularContainer } from '../contracts/KontrakModularContainer';
import { SpkBuilder } from '../contracts/SpkBuilder';
import { ExecutionPhase } from '../phases/ExecutionPhase';
import { PlanningPhase } from '../phases/PlanningPhase';
import { SupervisionPhase } from '../phases/SupervisionPhase';
import { ProjectDocumentTabs } from './ProjectDocumentTabs';

export type ProjectPage = 'detail' | 'kategori' | SpkType;

const categories = [
  { type: 'perencana', icon: DraftingCompass },
  { type: 'fisik', icon: HardHat },
  { type: 'pengawas', icon: ClipboardCheck },
] as const;

const consultantStages: { value: ConsultantStage; label: string }[] = [
  { value: 'pengadaan', label: 'Proses pengadaan' },
  { value: 'kontrak', label: 'Kontrak' },
  { value: 'penyusunan', label: 'Proses penyusunan' },
  { value: 'serah-terima', label: 'Serah terima' },
  { value: 'pembayaran', label: 'Proses pembayaran' },
  { value: 'selesai', label: 'Selesai' },
];

const panelClass = 'min-w-0 space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5';
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900';
const buttonClass = 'rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50';

function InfoFields({ fields }: { fields: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-sm text-slate-600">{label}</dt>
          <dd className="mt-1 break-words text-sm font-semibold text-slate-900">{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectInfo({ project }: { project: Project }) {
  return (
    <section className={panelClass}>
      <h3 className="font-semibold text-slate-900">Informasi proyek</h3>
      {project.deskripsi && <p className="text-sm leading-relaxed text-slate-700">{project.deskripsi}</p>}
      <InfoFields fields={[
        ['Kode paket', project.kodePaket],
        ['Lokasi', project.lokasi],
        ['Kategori gedung', project.kategoriGedung],
        ['Tahun anggaran', project.tahunAnggaran],
        ['Sumber dana', project.sumberDana],
        ['PPK', project.ppkNama],
        ['Pagu anggaran', formatRupiah(project.paguAnggaran)],
        ['Nilai kontrak proyek', formatRupiah(project.nilaiKontrak)],
      ]} />
    </section>
  );
}

function ConsultantProgressPanel({ project, category }: { project: Project; category: ConsultantSpkType }) {
  const { currentUser, updateProject, spkContracts, planningDocs, supervisionLogs } = useApp();
  const work = project.progresKonsultan?.[category];
  const contract = spkContracts.find(item => item.projectId === project.id && item.spkType === category);
  const hasReport = (category === 'perencana' ? planningDocs : supervisionLogs).some(item => item.projectId === project.id);
  const recordedStage = work?.tahap ?? (hasReport ? 'penyusunan' : contract ? 'kontrak' : undefined);
  const currentStage = consultantStages.findIndex(stage => stage.value === recordedStage);
  const [draftStage, setDraftStage] = useState<ConsultantStage | ''>('');
  const canEdit = hasPermission(currentUser?.role, 'edit_project');

  return (
    <div className="space-y-4">
      <section className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900">Progres pekerjaan konsultansi</h3>
          {currentStage < 0 && <p className="text-sm text-slate-600">Tahap belum dicatat.</p>}
        </div>
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {consultantStages.map(({ value, label }, index) => (
            <li key={value} aria-current={index === currentStage ? 'step' : undefined} className={`flex items-center gap-2.5 rounded-lg border p-3 text-sm ${index === currentStage ? 'border-emerald-300 bg-emerald-50 font-semibold text-emerald-900' : 'border-slate-200 text-slate-700'}`}>
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold">{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        {canEdit && (
          <form className="flex flex-wrap items-end gap-2 border-t border-slate-100 pt-4" onSubmit={event => {
            event.preventDefault();
            if (!draftStage) return;
            updateProject({
              ...project,
              progresKonsultan: { ...project.progresKonsultan, [category]: { ...work, tahap: draftStage } },
            });
            setDraftStage('');
          }}>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              <span className="block">Tahap pekerjaan</span>
              <select className={inputClass} value={draftStage || recordedStage || ''} onChange={event => setDraftStage(event.target.value as ConsultantStage)}>
                <option value="" disabled>Pilih tahap</option>
                {consultantStages.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <button type="submit" className={buttonClass} disabled={!draftStage}>Simpan tahap</button>
          </form>
        )}
      </section>
      {category === 'perencana' ? <PlanningPhase /> : <SupervisionPhase />}
    </div>
  );
}

function ConsultantAddendums({ project, category }: { project: Project; category: ConsultantSpkType }) {
  const { currentUser, updateProject } = useApp();
  const work = project.progresKonsultan?.[category];
  const addendums = work?.addendums ?? [];
  const canEdit = hasPermission(currentUser?.role, 'edit_contract');

  return (
    <section className={panelClass + " no-print"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900">Addendum kontrak</h3>
        {!canEdit && <p className="text-sm text-slate-600">Peran Anda tidak memiliki izin membuat addendum.</p>}
      </div>
      {addendums.length === 0 ? (
        <p className="text-sm text-slate-600">Belum ada addendum untuk kategori ini.</p>
      ) : (
        <ul className="divide-y divide-slate-100 text-sm">
          {addendums.map(addendum => (
            <li key={addendum.id} className="space-y-1 py-2">
              <p className="font-semibold text-slate-900">{addendum.nomor} · {formatTanggalIndo(addendum.tanggal)}</p>
              <p className="whitespace-pre-wrap break-words text-slate-600">{addendum.uraian}</p>
            </li>
          ))}
        </ul>
      )}
      {canEdit && (
        <form className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2" onSubmit={event => {
          event.preventDefault();
          const fields = new FormData(event.currentTarget);
          const nomor = String(fields.get('nomor') ?? '').trim();
          const tanggal = String(fields.get('tanggal') ?? '');
          const uraian = String(fields.get('uraian') ?? '').trim();
          if (!nomor || !tanggal || !uraian) return;
          updateProject({
            ...project,
            progresKonsultan: {
              ...project.progresKonsultan,
              [category]: { ...work, addendums: [{ id: crypto.randomUUID(), nomor, tanggal, uraian }, ...addendums] },
            },
          });
          event.currentTarget.reset();
        }}>
          <label className="text-sm font-medium text-slate-700">Nomor addendum<input required name="nomor" className={inputClass} /></label>
          <label className="text-sm font-medium text-slate-700">Tanggal<input required type="date" name="tanggal" className={inputClass} /></label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">Uraian<textarea required name="uraian" rows={2} className={inputClass} /></label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className={buttonClass}>Simpan addendum</button>
          </div>
        </form>
      )}
    </section>
  );
}

interface ProjectWorkspaceProps {
  project: Project;
  page: ProjectPage;
  onPageChange: (page: ProjectPage | null) => void;
}

export function ProjectWorkspace({ project, page, onPageChange }: ProjectWorkspaceProps) {
  const [tab, setTab] = useState<'info' | 'kategori' | 'progres' | 'kontrak' | 'berita-acara'>(page === 'kategori' ? 'kategori' : 'info');
  const category = page === 'detail' || page === 'kategori' ? null : page;
  const pack = category ? getProjectPackage(project, category) : null;
  const tabs = category ? [
    { id: 'info', label: 'Informasi proyek' },
    { id: 'progres', label: category === 'fisik' ? 'Progres proyek' : 'Progres pekerjaan' },
    { id: 'kontrak', label: 'Kontrak dan addendum' },
    { id: 'berita-acara', label: 'Berita acara' },
  ] as const : [
    { id: 'info', label: 'Informasi proyek' },
    { id: 'kategori', label: 'Kategori proyek' },
  ] as const;

  return (
    <section className="space-y-4">
      <header className="space-y-2 no-print">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <button type="button" onClick={() => onPageChange(null)} className="inline-flex items-center gap-1.5 font-medium text-emerald-800 hover:underline">
            <ArrowLeft aria-hidden="true" className="size-4" /> Daftar proyek
          </button>
          {category && <button type="button" onClick={() => onPageChange('kategori')} className="font-medium text-emerald-800 hover:underline">Detail proyek</button>}
        </div>
        <h2 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{category ? projectPackageLabels[category] : project.nama}</h2>
        <p className="text-sm text-slate-600">{category ? project.nama : `${project.kodePaket} · ${project.tahunAnggaran}`}</p>
      </header>

      <nav aria-label={category ? 'Bagian kategori proyek' : 'Bagian detail proyek'} className="flex flex-wrap gap-1 border-b border-slate-200 no-print">
        {tabs.map(({ id, label }) => (
          <button key={id} type="button" aria-current={tab === id ? 'page' : undefined} onClick={() => category ? setTab(id) : onPageChange(id === 'kategori' ? 'kategori' : 'detail')}
            className={`rounded-t-md border-b-2 px-3 py-2.5 text-sm font-semibold ${tab === id ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}>
            {label}
          </button>
        ))}
      </nav>

      {!category && tab === 'info' && <ProjectInfo project={project} />}
      {!category && tab === 'kategori' && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map(({ type, icon: Icon }) => {
            const item = getProjectPackage(project, type);
            return (
              <button key={type} type="button" onClick={() => onPageChange(type)} className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-emerald-400 hover:bg-emerald-50/50">
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                <span className="min-w-0 flex-1">
                  <strong className="block text-slate-900">{projectPackageLabels[type]}</strong>
                  <span className="mt-1 block break-words text-sm text-slate-600">{item.active ? item.company || 'Penyedia belum tercatat' : 'Belum ada paket'}</span>
                </span>
                <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-slate-400" />
              </button>
            );
          })}
        </div>
      )}

      {category && pack && (tab === 'info' ? (
        <>
          <section className={panelClass}>
            <h3 className="font-semibold text-slate-900">Informasi paket {projectPackageLabels[category].toLowerCase()}</h3>
            {pack.active ? <InfoFields fields={[
              ['Penyedia', pack.company], ['Direktur atau pimpinan', pack.director], ['PPK', pack.ppk],
              ['Nomor kontrak', pack.number],
              ['Nilai kontrak paket', pack.value == null ? undefined : formatRupiah(pack.value)],
              ['Tanggal mulai', pack.start && formatTanggalIndo(pack.start)],
              ['Tanggal selesai', pack.end && formatTanggalIndo(pack.end)],
            ]} /> : <p className="text-sm text-slate-600">Belum ada paket untuk kategori ini.</p>}
          </section>
          <ProjectInfo project={project} />
        </>
      ) : !pack.active ? (
        <p className={`${panelClass} text-sm text-slate-600`}>Belum ada paket untuk kategori ini.</p>
      ) : tab === 'progres' ? (
        category === 'fisik' ? <ExecutionPhase /> : <ConsultantProgressPanel project={project} category={category} />
      ) : tab === 'kontrak' ? (
        <ProjectDocumentTabs
          key="kontrak"
          scope={{ projectId: project.id, category, group: 'kontrak' }}
          renderCreateDocument={() => category === 'fisik'
            ? <KontrakModularContainer fixedSpkType="fisik" />
            : <SpkBuilder currentSpkType={category} lockSpkType />}
          createAddendum={category === 'fisik'
            ? <ExecutionPhase mode="addendum" />
            : <ConsultantAddendums project={project} category={category} />}
        />
      ) : tab === 'berita-acara' ? (
        <ProjectDocumentTabs
          key="berita-acara"
          scope={{ projectId: project.id, category, group: 'berita-acara' }}
          renderCreateDocument={onCreated => <BeritaAcaraList packageType={category} view="create" onCreated={onCreated} />}
          savedDocuments={<BeritaAcaraList packageType={category} view="records" />}
        />
      ) : null)}
    </section>
  );
}
