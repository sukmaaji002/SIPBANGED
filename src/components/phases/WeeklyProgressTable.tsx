import type { WeeklyProgress } from '../../types';
import { formatTanggalSingkat } from '../../utils/formatters';
import { targetForPeriod, type VersionPeriod } from '../../utils/scheduleVersions';

interface ProgressRow {
  id: string;
  week: number | string;
  start: string;
  end: string;
  target?: number;
  actual?: number;
  deviation?: number;
  status: string;
  reported: boolean;
}

const percent = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });
const signed = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2, signDisplay: 'exceptZero' });

function formatPercent(value?: number) {
  return value === undefined || !Number.isFinite(value) ? '—' : percent.format(value) + '%';
}

function formatPeriodDate(date: string) {
  return date ? formatTanggalSingkat(/^\d{4}-\d{2}-\d{2}$/.test(date) ? date + 'T00:00:00' : date) : '—';
}

function reportRow(report: WeeklyProgress, status: string, week = report.mingguKe): ProgressRow {
  return {
    id: report.id, week, start: report.periodeMulai, end: report.periodeSelesai,
    target: report.kumulatifRencana, actual: report.kumulatifRealisasi, deviation: report.deviasi,
    status, reported: true,
  };
}

export function WeeklyProgressTable({ periods, reports }: { periods: VersionPeriod[]; reports: WeeklyProgress[] }) {
  const reportsByPeriod = new Map<string, WeeklyProgress>();
  for (const report of reports) {
    const key = report.periodeMulai + '/' + report.periodeSelesai;
    if (!reportsByPeriod.has(key)) reportsByPeriod.set(key, report);
  }

  const matchedReports = new Set<string>();
  const scheduledRows = periods.map(period => {
    const report = reportsByPeriod.get(period.start + '/' + period.end);
    if (report) {
      matchedReports.add(report.id);
      return reportRow(report, 'Sudah dilaporkan', period.number);
    }
    return {
      id: 'period-' + period.key, week: period.number, start: period.start, end: period.end,
      target: targetForPeriod(period).cumulative, status: 'Belum ada laporan', reported: false,
    };
  });
  // Keep historical numbers with the dates on which they were reported.
  const unmatchedReports = reports.filter(report => !matchedReports.has(report.id));
  for (const row of scheduledRows) {
    if (!row.reported && unmatchedReports.some(report =>
      report.periodeMulai && report.periodeSelesai && report.periodeMulai <= row.end && report.periodeSelesai >= row.start,
    )) row.status = 'Ada laporan dengan periode berbeda';
  }
  const rows = [...scheduledRows, ...unmatchedReports.map(report => reportRow(report, 'Periode laporan tersimpan'))]
    .sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));

  return (
    <section aria-labelledby="weekly-progress-heading" className="rounded-2xl border border-slate-200 bg-white">
      <div className="px-5 py-4">
        <h3 id="weekly-progress-heading" className="text-sm font-bold text-slate-900">Progres per Minggu</h3>
        <p className="mt-1 text-xs text-slate-600">Target dan realisasi adalah angka kumulatif. Deviasi adalah selisih keduanya dalam poin persentase (pp).</p>
      </div>
      {periods.length === 0 && (
        <p className="px-5 pb-4 text-sm text-slate-600">Lengkapi tanggal mulai dan selesai kontrak untuk menampilkan jadwal mingguan.</p>
      )}
      {rows.length > 0 && (
        <div role="region" aria-label="Tabel progres per minggu" tabIndex={0} className="max-h-[32rem] overflow-auto rounded-b-2xl border-t border-slate-200 focus-visible:outline-2 focus-visible:outline-emerald-700">
          <table aria-labelledby="weekly-progress-heading" className="w-full min-w-[700px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs text-slate-700 shadow-[0_1px_0_#e2e8f0]">
              <tr>
                {['Minggu', 'Tanggal Awal', 'Tanggal Akhir'].map(label => (
                  <th key={label} scope="col" className="px-4 py-3 font-semibold">{label}</th>
                ))}
                {['Target', 'Realisasi', 'Deviasi'].map(label => (
                  <th key={label} scope="col" className="px-4 py-3 text-right font-semibold">{label}</th>
                ))}
                <th scope="col" className="px-4 py-3 font-semibold">Status Laporan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <th scope="row" className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-900">{row.week}</th>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">{formatPeriodDate(row.start)}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">{formatPeriodDate(row.end)}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-800">{formatPercent(row.target)}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-800">{formatPercent(row.actual)}</td>
                  <td className={`whitespace-nowrap px-4 py-2.5 text-right font-semibold tabular-nums ${(row.deviation ?? 0) < 0 ? 'text-rose-700' : (row.deviation ?? 0) > 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {row.deviation === undefined || !Number.isFinite(row.deviation) ? '—' : signed.format(row.deviation) + ' pp'}
                  </td>
                  <td className={`px-4 py-2.5 text-xs ${row.reported ? 'font-medium text-slate-800' : 'text-slate-600'}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
