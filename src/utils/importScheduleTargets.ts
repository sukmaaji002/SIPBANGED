import type { Cell, CellValue, Worksheet } from 'exceljs';
import type { ScheduleAddendumPoint } from '../types';
import { reportingWeekNumber, type ReportingWeek } from './reportingSchedule';

const sheetName = 'Target Mingguan';
const requiredHeaders = ['minggu', 'target kumulatif (%)'] as const;
const maxFileSize = 5 * 1024 * 1024;

function headerColumn(sheet: Worksheet, label: string): number | undefined {
  const header = sheet.getRow(1);
  let column: number | undefined;
  header.eachCell((cell, index) => {
    if (column === undefined && cell.text.trim().toLowerCase().replace(/\s+/g, ' ') === label) column = index;
  });
  return column;
}

function valueOf(cell: Cell): CellValue {
  const value = cell.value;
  return value && typeof value === 'object' && ('formula' in value || 'sharedFormula' in value)
    ? value.result ?? undefined
    : value;
}

function isBlank(cell: Cell): boolean {
  return cell.value == null || (typeof cell.value === 'string' && !cell.value.trim());
}

function percent(cell: Cell): number {
  const value = valueOf(cell);
  if (typeof value === 'number') {
    const formattedAsPercent = cell.numFmt?.replace(/"[^"]*"|\\./g, '').includes('%');
    return formattedAsPercent ? value * 100 : value;
  }
  if (typeof value !== 'string' || !/^\d+(?:[.,]\d+)?\s*%?$/.test(value.trim())) return NaN;
  return Number(value.trim().replace('%', '').replace(',', '.'));
}

export async function importScheduleTargets(file: File, weeks: ReportingWeek[]): Promise<ScheduleAddendumPoint[]> {
  if (!/\.xlsx$/i.test(file.name)) throw new Error('Pilih berkas Excel berformat .xlsx.');
  if (!file.size || file.size > maxFileSize) throw new Error('Pilih berkas Excel yang berisi data dengan ukuran hingga 5 MB.');

  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(await file.arrayBuffer());
  } catch {
    throw new Error('Berkas Excel tidak dapat dibaca. Simpan ulang sebagai .xlsx atau gunakan template.');
  }

  const sheet = workbook.getWorksheet(sheetName) ?? workbook.worksheets.find(candidate =>
    requiredHeaders.every(header => headerColumn(candidate, header) !== undefined),
  );
  const weekColumn = sheet && headerColumn(sheet, requiredHeaders[0]);
  const targetColumn = sheet && headerColumn(sheet, requiredHeaders[1]);
  if (!sheet || !weekColumn || !targetColumn) {
    throw new Error('Baris pertama harus berisi kolom Minggu dan Target Kumulatif (%). Gunakan template untuk format yang sesuai.');
  }
  const weightColumn = headerColumn(sheet, 'bobot (%)');
  const calendar = new Map(weeks.map(week => [week.number, week]));
  const points = new Map<number, ScheduleAddendumPoint>();
  const errors: string[] = [];
  sheet.eachRow((row, index) => {
    if (index === 1) return;
    const weekCell = row.getCell(weekColumn);
    const targetCell = row.getCell(targetColumn);
    const weightCell = weightColumn ? row.getCell(weightColumn) : undefined;
    if (isBlank(targetCell) && (!weightCell || isBlank(weightCell))) return;

    const weekValue = valueOf(weekCell);
    const week = typeof weekValue === 'string' || typeof weekValue === 'number' ? reportingWeekNumber(weekValue) : undefined;
    const period = week === undefined ? undefined : calendar.get(week);
    const target = percent(targetCell);
    const weight = weightCell && !isBlank(weightCell) ? percent(weightCell) : undefined;
    if (week === undefined) errors.push(`Baris ${index}. Minggu harus berupa nomor seperti 1 atau M-1.`);
    else if (!period) errors.push(`Baris ${index}. Minggu ke-${week} di luar jadwal yang dipilih.`);
    else if (points.has(week)) errors.push(`Baris ${index}. Minggu ke-${week} tercatat lebih dari sekali.`);
    else if (!Number.isFinite(target) || target < 0 || target > 100) {
      errors.push(`Baris ${index}. Target kumulatif harus berisi angka 0 sampai 100%.`);
    } else if (weight !== undefined && (!Number.isFinite(weight) || weight < 0 || weight > 100)) {
      errors.push(`Baris ${index}. Bobot harus kosong atau berisi angka 0 sampai 100%.`);
    } else {
      points.set(week, {
        tanggalMulai: period.start,
        tanggalSelesai: period.end,
        mingguKe: `M-${week}`,
        targetKumulatif: Number(target.toFixed(2)),
        bobotTarget: weight === undefined ? undefined : Number(weight.toFixed(2)),
      });
    }
  });
  if (errors.length) {
    const more = errors.length > 3 ? ` Ada ${errors.length - 3} baris lain yang perlu diperiksa.` : '';
    throw new Error(errors.slice(0, 3).join(' ') + more);
  }
  if (!points.size) throw new Error('Belum ada target mingguan. Isi data mulai baris kedua, lalu impor kembali.');
  return [...points.entries()].sort(([a], [b]) => a - b).map(([, point]) => point);
}

export async function createScheduleTargetTemplate(weeks: ReportingWeek[]): Promise<Blob> {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName, { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.columns = [
    { header: 'Minggu', width: 12 },
    { header: 'Tanggal Awal', width: 17, style: { numFmt: 'dd/mm/yyyy' } },
    { header: 'Tanggal Akhir', width: 17, style: { numFmt: 'dd/mm/yyyy' } },
    { header: 'Target Kumulatif (%)', width: 23 },
    { header: 'Bobot (%)', width: 15 },
  ];
  sheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF065F46' } };
  });
  for (const week of weeks) {
    sheet.addRow([
      week.number,
      new Date(week.start + 'T00:00:00Z'),
      new Date(week.end + 'T00:00:00Z'),
    ]);
  }
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([new Uint8Array(buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
