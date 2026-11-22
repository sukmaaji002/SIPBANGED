import type { ScheduleAddendum, ScheduleReconciliation, ScheduleReconciliationItem, ScheduleTransitionDraft, WeeklyProgress } from '../types';
import { buildReportingWeeks, getReportingTarget, type ReportingWeek } from './reportingSchedule';

export interface VersionPeriod extends ReportingWeek {
  key: string;
  version?: ScheduleAddendum;
  endsAtTransition: boolean;
}

export function isOriginalSchedule(version: ScheduleAddendum) {
  return version.isKontrakAwal || version.jenisPerubahan === 'Kontrak Awal';
}

export function scheduleEffectiveDate(version: ScheduleAddendum): string | undefined {
  if (isOriginalSchedule(version)) return undefined;
  if (version.disahkanPada) return version.tanggalBerlaku;
  if (!version.tanggalBerlaku && version.isAktif) return version.tanggal || undefined;
  return undefined;
}

export function scheduleTimeline(versions: ScheduleAddendum[]) {
  return versions
    .flatMap(version => {
      const date = scheduleEffectiveDate(version);
      return date ? [{ date, version }] : [];
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.version.id.localeCompare(b.version.id));
}

export function scheduleForDate(versions: ScheduleAddendum[], date: string) {
  return scheduleTimeline(versions).filter(entry => entry.date <= date).at(-1)?.version
    ?? versions.find(isOriginalSchedule);
}

export function dayBefore(date: string) {
  const day = new Date(date + 'T00:00:00Z');
  day.setUTCDate(day.getUTCDate() - 1);
  return day.toISOString().slice(0, 10);
}

export function buildVersionPeriods(versions: ScheduleAddendum[], start?: string, end?: string): VersionPeriod[] {
  if (!start || !end) return [];
  const baseline = versions.find(isOriginalSchedule);
  const timeline = scheduleTimeline(versions);
  const finalEnd = [end, ...timeline.map(entry => entry.version.tanggalSelesaiBaru ?? '')].sort().at(-1);
  if (!finalEnd) return [];
  return buildReportingWeeks(start, finalEnd).flatMap(week => {
    const starts = [week.start, ...new Set(timeline
      .filter(entry => week.start < entry.date && entry.date <= week.end)
      .map(entry => entry.date))];
    return starts.flatMap((periodStart, index) => {
      const applicable = timeline.filter(entry => entry.date <= periodStart);
      const version = applicable.at(-1)?.version ?? baseline;
      const effectiveEnd = applicable.map(entry => entry.version.tanggalSelesaiBaru).filter(Boolean).at(-1) || end;
      const nextStart = starts[index + 1];
      const periodEnd = [effectiveEnd, nextStart ? dayBefore(nextStart) : week.end].sort()[0];
      if (periodEnd < periodStart) return [];
      return [{ number: week.number, start: periodStart, end: periodEnd, key: periodStart, version, endsAtTransition: Boolean(nextStart) }];
    });
  });
}

export function targetForPeriod(period?: VersionPeriod) {
  if (!period || period.endsAtTransition) return {};
  const target = getReportingTarget(period.version?.targetMingguan ?? [], period.number);
  const transitionTarget = period.version?.rekonsiliasi?.targetPeralihan;
  if (period.version && target.cumulative !== undefined && transitionTarget !== undefined &&
      scheduleEffectiveDate(period.version) === period.start) {
    return { ...target, weight: Number((target.cumulative - transitionTarget).toFixed(2)) };
  }
  return target;
}

export function reportedScheduleId(report: WeeklyProgress) {
  return report.acuanLaporan?.id || report.addendumId;
}

export function isReportInVersion(report: WeeklyProgress, version: ScheduleAddendum, versions: ScheduleAddendum[]) {
  const id = reportedScheduleId(report);
  return id ? id === version.id
    : isOriginalSchedule(version) && isOriginalSchedule(scheduleForDate(versions, report.periodeMulai) ?? version);
}

export function reconciliationActual(items: ScheduleReconciliationItem[]) {
  return Number(items.reduce((sum, item) => sum + item.volumeTerverifikasi / item.volumeKontrakBaru * item.bobotBaru, 0).toFixed(2));
}

export function transitionDraft(date = '', data?: ScheduleReconciliation): ScheduleTransitionDraft {
  return {
    date, mode: data?.metode ?? 'tetap', before: String(data?.realisasiSebelum ?? ''),
    after: String(data?.realisasiSesudah ?? ''), basis: data?.dasar ?? '',
    target: String(data?.targetPeralihan ?? ''),
    riwayatMingguan: Object.fromEntries((data?.riwayatMingguan ?? []).map(report => [report.laporanId, String(report.realisasi)])),
    items: (data?.items ?? []).map(item => ({
      pekerjaan: item.pekerjaan, volumeTerverifikasi: String(item.volumeTerverifikasi),
      volumeKontrakBaru: String(item.volumeKontrakBaru), bobotBaru: String(item.bobotBaru),
    })),
  };
}

const numberFrom = (value: string) => value.trim() ? Number(value) : NaN;
const percent = (value: number) => Number.isFinite(value) && value >= 0 && value <= 100;

export function parseScheduleTransition(draft: ScheduleTransitionDraft, suggested?: number, earlierReports: WeeklyProgress[] = []): ScheduleReconciliation | undefined {
  const before = draft.before.trim() ? numberFrom(draft.before) : suggested;
  const items = draft.mode === 'hitung-ulang' ? draft.items.map(item => ({
    pekerjaan: item.pekerjaan.trim(), volumeTerverifikasi: numberFrom(item.volumeTerverifikasi),
    volumeKontrakBaru: numberFrom(item.volumeKontrakBaru), bobotBaru: numberFrom(item.bobotBaru),
  })) : [];
  if (items.some(item => !item.pekerjaan || !Number.isFinite(item.volumeKontrakBaru) || item.volumeKontrakBaru <= 0 ||
      !Number.isFinite(item.volumeTerverifikasi) || item.volumeTerverifikasi < 0 ||
      item.volumeTerverifikasi > item.volumeKontrakBaru || !percent(item.bobotBaru))) return undefined;
  if (items.length && Math.abs(items.reduce((sum, item) => sum + item.bobotBaru, 0) - 100) > 0.01) return undefined;
  const after = draft.mode === 'tetap' ? before : items.length ? reconciliationActual(items) : numberFrom(draft.after);
  const target = draft.target.trim() ? numberFrom(draft.target) : undefined;
  const history = draft.mode === 'hitung-ulang' ? earlierReports.flatMap(report => {
    const value = draft.riwayatMingguan?.[report.id]?.trim();
    return value ? [{ laporanId: report.id, tanggalAkhir: report.periodeSelesai, realisasi: numberFrom(value) }] : [];
  }) : [];
  if (before === undefined || after === undefined || !percent(before) || !percent(after) ||
      !draft.basis.trim() || history.some(report => !percent(report.realisasi)) || (target !== undefined && !percent(target))) return undefined;
  return { metode: draft.mode, realisasiSebelum: before, realisasiSesudah: after, dasar: draft.basis.trim(), targetPeralihan: target, items, riwayatMingguan: history.length ? history : undefined };
}
