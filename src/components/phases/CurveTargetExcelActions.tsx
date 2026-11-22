import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import type { ScheduleAddendumPoint } from '../../types';
import type { ReportingWeek } from '../../utils/reportingSchedule';
import { createScheduleTargetTemplate, importScheduleTargets } from '../../utils/importScheduleTargets';

export function CurveTargetExcelActions({ weeks, versionName, onImport }: {
  weeks: ReportingWeek[];
  versionName: string;
  onImport?: (points: ScheduleAddendumPoint[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean }>();

  useEffect(() => () => { request.current += 1; }, []);

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file || busy || !onImport) return;
    const current = ++request.current;
    setBusy(true);
    setMessage(undefined);
    try {
      const points = await importScheduleTargets(file, weeks);
      if (request.current !== current) return;
      onImport(points);
      setMessage({ text: `${points.length} minggu dimasukkan ke tabel. Periksa hasilnya sebelum menyimpan Kurva S.` });
    } catch (error) {
      if (request.current === current) setMessage({ text: error instanceof Error ? error.message : 'Impor Excel gagal.', error: true });
    } finally {
      if (request.current === current) setBusy(false);
    }
  };

  const downloadTemplate = async () => {
    const current = ++request.current;
    setBusy(true);
    setMessage(undefined);
    try {
      const blob = await createScheduleTargetTemplate(weeks);
      if (request.current !== current) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = versionName.trim().replace(/[^a-z0-9]+/gi, '-');
      link.download = 'template-target-kurva-s-' + filename + '.xlsx';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      if (request.current === current) setMessage({ text: 'Template Excel gagal dibuat. Coba unduh kembali.', error: true });
    } finally {
      if (request.current === current) setBusy(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        {onImport && <>
        <input ref={input} type="file" accept=".xlsx" hidden onChange={importFile} aria-label="Pilih berkas Excel target mingguan" />
        <button type="button" disabled={busy || !weeks.length} onClick={() => input.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
          <FileSpreadsheet className="size-4" aria-hidden="true" /> Impor Excel
        </button>
        </>}
        <button type="button" disabled={busy || !weeks.length} onClick={downloadTemplate} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50">
          <Download className="size-4" aria-hidden="true" /> Unduh Template Excel
        </button>
      </div>
      {onImport && <p className="text-xs text-slate-600">Isi target dan bobot pada template. Impor mengganti isian tabel. Baris tanpa target dan bobot dilewati.</p>}
      {message && <p role={message.error ? 'alert' : 'status'} className={`text-xs font-medium ${message.error ? 'text-rose-700' : 'text-emerald-800'}`}>{message.text}</p>}
    </div>
  );
}
