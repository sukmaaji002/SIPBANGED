import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ScheduleAddendum, WeeklyProgress } from '../../types';
import { formatTanggalSingkat } from '../../utils/formatters';
import { buildReportingWeeks, reportingWeekNumber } from '../../utils/reportingSchedule';
import { dayBefore, isOriginalSchedule, isReportInVersion, scheduleEffectiveDate, scheduleTimeline } from '../../utils/scheduleVersions';

function shortDate(date: string) {
  return formatTanggalSingkat(/^\d{4}-\d{2}-\d{2}$/.test(date) ? date + 'T00:00:00' : date);
}

export function ScheduleReconciliationSummary({ version }: { version: ScheduleAddendum }) {
  const result = version.rekonsiliasi;
  if (!result) return null;
  return (
    <div className="space-y-2 text-sm text-slate-700">
      <p>Realisasi saat peralihan <strong>{result.realisasiSebelum}%</strong> pada acuan sebelumnya dan <strong>{result.realisasiSesudah}%</strong> pada {version.nomorAddendum}.</p>
      {result.targetPeralihan !== undefined && <p>Target pada titik peralihan <strong>{result.targetPeralihan}%</strong>.</p>}
      <p className="break-words">Dasar rekonsiliasi <strong>{result.dasar}</strong></p>
      {Boolean(result.riwayatMingguan?.length) && (
        <details>
          <summary className="cursor-pointer font-semibold text-blue-800">Realisasi mingguan hasil hitung ulang</summary>
          <ul className="mt-1 space-y-1 text-xs">
            {result.riwayatMingguan?.map(report => <li key={report.laporanId}>{shortDate(report.tanggalAkhir)} · {report.realisasi}%</li>)}
          </ul>
        </details>
      )}
      {result.items.length > 0 && (
        <details>
          <summary className="cursor-pointer font-semibold text-blue-800">Rincian volume dan bobot</summary>
          <div className="overflow-x-auto">
            <table className="mt-2 w-full text-left text-xs">
              <thead><tr><th className="p-2">Item pekerjaan</th><th className="p-2">Volume terukur</th><th className="p-2">Volume kontrak baru</th><th className="p-2">Bobot baru</th></tr></thead>
              <tbody>{result.items.map((item, i) => (
                <tr key={i} className="border-t border-slate-200"><td className="p-2">{item.pekerjaan}</td><td className="p-2">{item.volumeTerverifikasi}</td><td className="p-2">{item.volumeKontrakBaru}</td><td className="p-2">{item.bobotBaru}%</td></tr>
              ))}</tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

interface ChartProps {
  versions: ScheduleAddendum[];
  active?: ScheduleAddendum;
  reports: WeeklyProgress[];
  start?: string;
  end?: string;
}

export function ScheduleVersionChart({ versions, active, reports, start, end }: ChartProps) {
  const [history, setHistory] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const version = history ? versions.find(item => item.id === selectedId) ?? active : active;
  const original = versions.find(isOriginalSchedule);
  const effective = version && scheduleEffectiveDate(version);
  const baselineDate = effective && version?.rekonsiliasi ? dayBefore(effective) : undefined;
  const rows = new Map<string, { date: string; week?: number; target?: number; original?: number; actual?: number; opening?: number; recalculated?: number }>();
  function row(date: string) {
    if (!rows.has(date)) rows.set(date, { date });
    return rows.get(date)!;
  }
  for (const [schedule, field] of [[version, 'target'], [history && original?.id !== version?.id ? original : undefined, 'original']] as const) {
    if (!schedule) continue;
    const cutoff = scheduleEffectiveDate(schedule);
    const inheritedEnd = cutoff
      ? scheduleTimeline(versions).filter(entry => entry.date <= cutoff && entry.version.tanggalSelesaiBaru).at(-1)?.version.tanggalSelesaiBaru
      : undefined;
    const weeks = buildReportingWeeks(start, schedule.tanggalSelesaiBaru || inheritedEnd || end);
    schedule.targetMingguan.forEach(point => {
      const number = reportingWeekNumber(point.mingguKe);
      const date = point.tanggalSelesai || (number ? weeks[number - 1]?.end : undefined);
      if (date) Object.assign(row(date), { week: number, [field]: point.targetKumulatif });
    });
  }
  if (version) {
    for (const report of [...reports].reverse()) {
      if (report.periodeSelesai && isReportInVersion(report, version, versions)) {
        Object.assign(row(report.periodeSelesai), { week: reportingWeekNumber(report.mingguKe), actual: report.kumulatifRealisasi });
      }
    }
  }
  if (history && version?.rekonsiliasi) {
    for (const report of version.rekonsiliasi.riwayatMingguan ?? []) row(report.tanggalAkhir).recalculated = report.realisasi;
  }
  if (baselineDate && version?.rekonsiliasi) {
    const point = row(baselineDate);
    point.opening = version.rekonsiliasi.realisasiSesudah;
    if (version.rekonsiliasi.targetPeralihan !== undefined) point.target = version.rekonsiliasi.targetPeralihan;
  }
  const data = [...rows.values()].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Kurva S per versi</h3>
          <p className="text-xs text-slate-600">Acuan berlaku {active?.nomorAddendum ?? 'Kontrak Awal'}</p>
        </div>
        <nav aria-label="Tampilan Kurva S" className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button type="button" aria-pressed={!history} onClick={() => setHistory(false)} className="rounded px-2.5 py-1.5 text-xs font-semibold aria-pressed:bg-white">Acuan Berlaku</button>
          <button type="button" aria-pressed={history} onClick={() => setHistory(true)} className="rounded px-2.5 py-1.5 text-xs font-semibold aria-pressed:bg-white">Riwayat & Perbandingan</button>
        </nav>
      </div>
      {history && (
        <label className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">Versi Kurva S
          <select aria-label="Versi Kurva S" value={version?.id ?? ''} onChange={event => setSelectedId(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5">
            {versions.map(item => <option key={item.id} value={item.id}>{item.nomorAddendum}{!isOriginalSchedule(item) && !scheduleEffectiveDate(item) ? ' (Draf atau riwayat lama)' : ''}</option>)}
          </select>
        </label>
      )}
      {effective && <p className="text-xs font-semibold text-slate-700">Berlaku mulai {shortDate(effective)}</p>}
      {version && <ScheduleReconciliationSummary version={version} />}
      {data.length === 0 ? <p className="text-sm text-slate-600">Belum ada titik target atau realisasi untuk versi ini.</p> : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={date => String(date).slice(5).split('-').reverse().join('/')} tick={{ fontSize: 10 }} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip labelFormatter={date => shortDate(String(date))} formatter={value => String(value) + '%'} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              {data.some(item => item.original !== undefined) && <Line type="linear" connectNulls dataKey="original" name="Target Kontrak Awal" stroke="#64748b" strokeDasharray="4 4" />}
              <Line type="linear" connectNulls dataKey="target" name={'Target ' + (version?.nomorAddendum ?? 'acuan')} stroke="#2563eb" strokeWidth={2} />
              <Line type="linear" connectNulls dataKey="actual" name="Realisasi pada versi ini" stroke="#059669" strokeWidth={2} />
              {history && Boolean(version?.rekonsiliasi?.riwayatMingguan?.length) && <Line type="linear" connectNulls dataKey="recalculated" name="Realisasi historis hasil hitung ulang" stroke="#7c3aed" strokeDasharray="4 4" />}
              {baselineDate && <ReferenceLine x={baselineDate} stroke="#a16207" strokeDasharray="3 3" />}
              {baselineDate && <Line dataKey="opening" name="Saldo awal hasil rekonsiliasi" stroke="#a16207" dot={{ r: 5 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {history && <p className="text-xs text-slate-600">Angka asli, tanggal periode, dan deviasi setiap laporan tersedia di daftar Laporan Progres Mingguan di bawah.</p>}
    </section>
  );
}
