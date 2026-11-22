import type { ScheduleAddendumPoint } from '../types';

export interface ReportingWeek {
  number: number;
  start: string;
  end: string;
}

const day = 86_400_000;

function dateOnly(value?: string): number {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const instant = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(instant) && new Date(instant).toISOString().slice(0, 10) === value ? instant : NaN;
}

export function buildReportingWeeks(contractStart?: string, contractEnd?: string): ReportingWeek[] {
  const start = dateOnly(contractStart);
  const end = dateOnly(contractEnd);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return [];

  const weeks: ReportingWeek[] = [];
  for (let first = start; first <= end;) {
    const daysToSunday = (7 - new Date(first).getUTCDay()) % 7;
    const last = Math.min(end, first + daysToSunday * day);
    weeks.push({
      number: weeks.length + 1,
      start: new Date(first).toISOString().slice(0, 10),
      end: new Date(last).toISOString().slice(0, 10),
    });
    first = last + day;
  }
  return weeks;
}

export function reportingWeekNumber(value: string | number): number | undefined {
  const match = String(value).trim().match(/^(?:(?:minggu(?:\s*ke)?|m)[\s-]*)?(\d+)$/i);
  const week = Number(match?.[1]);
  return Number.isSafeInteger(week) && week > 0 ? week : undefined;
}

export function getReportingTarget(points: ScheduleAddendumPoint[], week?: number) {
  if (week === undefined) return {};
  const current = points.find(point => reportingWeekNumber(point.mingguKe) === week);
  if (!current || !Number.isFinite(current.targetKumulatif)) return {};

  const previous = week === 1
    ? 0
    : points.find(point => reportingWeekNumber(point.mingguKe) === week - 1)?.targetKumulatif;
  const calculatedWeight = previous == null ? undefined : Number((current.targetKumulatif - previous).toFixed(2));
  return { cumulative: current.targetKumulatif, weight: current.bobotTarget ?? calculatedWeight };
}
