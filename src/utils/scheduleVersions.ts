import type { ScheduleAddendum, WeeklyProgress } from '../types';
import { buildReportingWeeks, getReportingTarget, type ReportingWeek } from './reportingSchedule';

export interface VersionPeriod extends ReportingWeek {
  key: string;
  version?: ScheduleAddendum;
  endsAtTransition: boolean;
  weekStart: string;
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

export function buildScheduleTargetWeeks(
  versions: ScheduleAddendum[], version: ScheduleAddendum, start?: string, end?: string,
): ReportingWeek[] {
  const date = version.tanggalBerlaku || scheduleEffectiveDate(version) || version.tanggal;
  const inheritedEnd = isOriginalSchedule(version) ? undefined : scheduleTimeline(versions)
    .filter(entry => entry.date <= date && entry.version.id !== version.id && entry.version.tanggalSelesaiBaru)
    .at(-1)?.version.tanggalSelesaiBaru;
  return buildReportingWeeks(start, version.tanggalSelesaiBaru || inheritedEnd || end);
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
      return [{ number: week.number, start: periodStart, end: periodEnd, key: periodStart, version, weekStart: week.start, endsAtTransition: Boolean(nextStart) }];
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
  if (period.start !== period.weekStart) return { cumulative: target.cumulative, weight: undefined };
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
