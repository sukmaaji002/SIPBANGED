import { useEffect, useRef } from 'react';
import { paragraph } from '../../utils/contractAddendumExport';

function initialHtml(value: string) {
  if (value.startsWith('<div data-rich-clause="1">')) return paragraph(value);
  const escaped = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<div data-rich-clause="1">' + escaped.replace(/\n/g, '<br>') + '</div>';
}

export function AddendumTextEditor({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  const editor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editor.current) editor.current.innerHTML = initialHtml(value);
  }, []);
  const update = () => {
    if (editor.current) onChange('<div data-rich-clause="1">' + editor.current.innerHTML + '</div>');
  };
  const command = (name: string, arg?: string) => {
    editor.current?.focus();
    document.execCommand(name, false, arg);
    update();
  };
  return (
    <div className="rounded-lg border border-slate-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2" role="toolbar" aria-label={'Format ' + label}>
        <select aria-label="Jenis huruf" defaultValue="" onChange={e => { if (e.target.value) command('fontName', e.target.value); }} className="rounded border p-1 text-xs">
          <option value="">Huruf</option><option>Arial</option><option>Times New Roman</option><option>Calibri</option>
        </select>
        <select aria-label="Ukuran huruf" defaultValue="" onChange={e => { if (e.target.value) command('fontSize', e.target.value); }} className="rounded border p-1 text-xs">
          <option value="">Ukuran</option><option value="2">10</option><option value="3">12</option><option value="4">14</option><option value="5">18</option>
        </select>
        {[
          ['bold', 'Tebal', 'B'], ['italic', 'Miring', 'I'], ['underline', 'Garis bawah', 'U'],
          ['justifyLeft', 'Rata kiri', 'Kiri'], ['justifyCenter', 'Rata tengah', 'Tengah'],
          ['justifyRight', 'Rata kanan', 'Kanan'], ['justifyFull', 'Rata kanan kiri', 'Rata'],
          ['outdent', 'Kurangi indent', '←'], ['indent', 'Tambah indent', '→'],
          ['insertUnorderedList', 'Daftar berpoin', '•'], ['insertOrderedList', 'Daftar bernomor', '1.'],
          ['undo', 'Urungkan', '↶'], ['redo', 'Ulangi', '↷'],
        ].map(([name, title, text]) => (
          <button key={name} type="button" title={title} aria-label={title} onMouseDown={e => e.preventDefault()} onClick={() => command(name)} className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100">{text}</button>
        ))}
      </div>
      <div aria-hidden="true" className="flex justify-between border-b border-slate-200 bg-slate-50 px-3 text-[10px] text-slate-500"><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>12</span><span>14</span><span>16 cm</span></div>
      <div ref={editor} role="textbox" aria-label={label} aria-multiline="true" contentEditable suppressContentEditableWarning onInput={update} className="min-h-32 whitespace-pre-wrap break-words p-3 text-sm focus:outline-2 focus:outline-emerald-700" />
    </div>
  );
}
