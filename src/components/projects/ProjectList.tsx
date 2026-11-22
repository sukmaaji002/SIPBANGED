import { useState } from 'react';
import { ArrowRight, Building2, MapPin, Plus, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ProjectStage, WeeklyProgress } from '../../types';
import { formatRupiah, formatTanggalSingkat } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';
import { getProjectPackage } from '../../utils/projectPackages';
import { NewProjectModal } from './NewProjectModal';

interface ProjectListProps {
  onOpenProject: (projectId: string) => void;
}

const stages: Record<ProjectStage, { label: string; color: string }> = {
  perencanaan: { label: 'Perencanaan', color: 'bg-indigo-50 text-indigo-800' },
  pelaksanaan: { label: 'Pelaksanaan', color: 'bg-amber-50 text-amber-800' },
  pengawasan: { label: 'Pengawasan', color: 'bg-teal-50 text-teal-800' },
  pemeliharaan: { label: 'Pemeliharaan', color: 'bg-cyan-50 text-cyan-800' },
  selesai: { label: 'Selesai / FHO', color: 'bg-emerald-50 text-emerald-800' },
};

const fieldClass = 'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus-visible:outline-2 focus-visible:outline-emerald-600';
const contractPriority = ['fisik', 'pengawas', 'perencana'] as const;

function reportPeriodEnd(report: WeeklyProgress): string {
  return report.periodeSelesai || report.periodeMulai || report.tanggalLaporan || '';
}

function formatReportWeek(report?: WeeklyProgress): string {
  const label = report?.labelMinggu?.trim() || String(report?.mingguKe ?? '').trim();
  if (!label) return 'Belum ada laporan mingguan';

  const week = label.match(/^(?:(?:minggu(?:\s*ke)?|m)[\s-]*)?(\d+(?:[.,]\d+)?)$/i)?.[1];
  return week ? `Minggu ke-${week}` : label;
}

function ContractDate({ date }: { date?: string }) {
  if (!date) return <span>—</span>;
  const localDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00` : date;
  return <time dateTime={date}>{formatTanggalSingkat(localDate)}</time>;
}

export function ProjectList({ onOpenProject }: ProjectListProps) {
  const { projects, selectedProjectId, currentUser, weeklyProgressList } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const canCreateProject = hasPermission(currentUser?.role, 'create_project');
  const years = [...new Set(projects.map(project => Number(project.tahunAnggaran)))]
    .filter(year => Number.isInteger(year) && year > 0)
    .sort((a, b) => b - a);
  const selectedYear = years.includes(Number(yearFilter)) ? yearFilter : '';
  const query = searchTerm.trim().toLowerCase();
  const hasFilters = Boolean(query || stageFilter || selectedYear);
  const filteredProjects = projects.filter(project =>
    (!query || [project.nama, project.kodePaket, project.kontraktorNama, project.lokasi]
      .some(value => value?.toLowerCase().includes(query))) &&
    (!stageFilter || project.stage === stageFilter) &&
    (!selectedYear || Number(project.tahunAnggaran) === Number(selectedYear)),
  );
  const latestReports = new Map<string, WeeklyProgress>();
  for (const report of weeklyProgressList) {
    const previous = latestReports.get(report.projectId);
    if (!previous || reportPeriodEnd(report) > reportPeriodEnd(previous)) {
      latestReports.set(report.projectId, report);
    }
  }

  const resetFilters = () => {
    setSearchTerm('');
    setStageFilter('');
    setYearFilter('');
  };

  return (
    <section className="@container space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Daftar Paket Proyek</h2>
          <p className="text-sm text-slate-600">Katalog proyek bangunan gedung Kabupaten Tegal</p>
        </div>
        {canCreateProject ? (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-700 px-3.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <Plus aria-hidden="true" className="size-4" />
            Tambah Paket Proyek
          </button>
        ) : (
          <p className="self-center text-xs text-slate-600">Penambahan proyek memerlukan akses PPK atau Admin.</p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-3.5 @min-[37rem]:grid-cols-[minmax(0,1fr)_9.5rem_10rem]">
        <label className="col-span-2 flex min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-700 @min-[37rem]:col-span-1">
          Cari proyek
          <span className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Nama, kode, kontraktor, atau lokasi"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              className={`${fieldClass} pl-9`}
            />
          </span>
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-700">
          Tahun anggaran
          <select value={selectedYear} onChange={event => setYearFilter(event.target.value)} className={fieldClass}>
            <option value="">Semua tahun</option>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-700">
          Tahapan
          <select value={stageFilter} onChange={event => setStageFilter(event.target.value)} className={fieldClass}>
            <option value="">Semua tahapan</option>
            {Object.entries(stages).map(([stage, { label }]) => <option key={stage} value={stage}>{label}</option>)}
          </select>
        </label>
      </div>

      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <p role="status" className="text-sm text-slate-600">
          {hasFilters ? `${filteredProjects.length} dari ${projects.length} proyek` : `${projects.length} proyek`}
        </p>
        {hasFilters && (
          <button type="button" onClick={resetFilters} className="rounded px-2 py-1 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
            Reset filter
          </button>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
          <Building2 aria-hidden="true" className="mx-auto mb-3 size-6 text-slate-400" />
          <h3 className="font-semibold text-slate-900">{hasFilters ? 'Tidak ada proyek yang cocok' : 'Belum ada proyek'}</h3>
          {hasFilters && <p className="mt-1 text-sm text-slate-600">Ubah kata kunci atau filter untuk melihat proyek lain.</p>}
        </div>
      ) : (
        <div className="grid items-start gap-4 @min-[48rem]:grid-cols-2">
          {filteredProjects.map(project => {
            const isSelected = project.id === selectedProjectId;
            const stage = stages[project.stage];
            const deviation = project.progresFisikRealisasi - project.progresFisikRencana;
            const isAhead = deviation >= 0;
            const progress = Math.max(0, Math.min(100, project.progresFisikRealisasi));
            const contract = contractPriority.map(type => getProjectPackage(project, type)).find(pack => pack.active);

            return (
              <article
                key={project.id}
                className={`min-w-0 overflow-hidden rounded-xl border bg-white ${isSelected ? 'border-emerald-500' : 'border-slate-200'}`}
              >
                <div className="space-y-4 p-4 sm:p-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium text-slate-600">
                        {project.kodePaket} <span aria-hidden="true" className="px-0.5 text-slate-400">·</span> {project.tahunAnggaran}
                      </p>
                      {stage && <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stage.color}`}>{stage.label}</span>}
                    </div>
                    <h3 className="break-words text-base font-bold leading-snug text-slate-900">{project.nama}</h3>
                    {project.lokasi && (
                      <p className="flex items-start gap-1.5 text-sm leading-snug text-slate-600">
                        <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
                        <span className="min-w-0 break-words">{project.lokasi}</span>
                      </p>
                    )}
                    {project.sumberDana && <p className="text-xs text-slate-600">{project.sumberDana}</p>}
                  </div>

                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg bg-slate-50 px-3 py-2.5">
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-600">Total kontrak</dt>
                      <dd className="mt-0.5 break-words text-sm font-semibold tabular-nums text-slate-900">{formatRupiah(project.nilaiKontrak)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-600">Pagu anggaran</dt>
                      <dd className="mt-0.5 break-words text-sm font-semibold tabular-nums text-slate-900">{formatRupiah(project.paguAnggaran)}</dd>
                    </div>
                  </dl>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
                      <span className="font-medium text-slate-700">Progres fisik <strong className="ml-1 text-sm tabular-nums text-slate-900">{project.progresFisikRealisasi}%</strong></span>
                      <span className={`font-medium tabular-nums ${isAhead ? 'text-emerald-700' : 'text-rose-700'}`}>
                        Deviasi {isAhead ? '+' : ''}{deviation.toFixed(1)}%
                      </span>
                    </div>
                    <div role="progressbar" aria-label={`Progres fisik ${project.nama}`} aria-valuenow={progress} className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${isAhead ? 'bg-emerald-600' : 'bg-rose-500'}`} style={{ width: `${progress}%` }} />
                    </div>
                    <p className="pt-0.5 text-xs font-medium text-slate-600">{formatReportWeek(latestReports.get(project.id))}</p>
                    <dl className="grid grid-cols-2 gap-x-3 pt-1.5 text-xs">
                      <div>
                        <dt className="text-slate-600">Awal kontrak</dt>
                        <dd className="mt-0.5 font-semibold text-slate-800"><ContractDate date={contract?.start} /></dd>
                      </div>
                      <div>
                        <dt className="text-slate-600">Akhir kontrak</dt>
                        <dd className="mt-0.5 font-semibold text-slate-800"><ContractDate date={contract?.end} /></dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 px-4 py-3 sm:px-5">
                  <button
                    type="button"
                    onClick={() => onOpenProject(project.id)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                  >
                    Detail <ArrowRight aria-hidden="true" className="size-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
