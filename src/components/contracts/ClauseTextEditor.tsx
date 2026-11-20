import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Indent, 
  Outdent, 
  ListOrdered, 
  List, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Type,
  RemoveFormatting,
  CaseSensitive,
  HelpCircle
} from 'lucide-react';
import { RichSpan } from '../../utils/richText';

interface VariableOption {
  label: string;
  tag: string;
}

interface ClauseTextEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  variables?: VariableOption[];
  onInsertVariable?: (tag: string) => void;
  previewResolvedText?: string;
  minRows?: number;
  placeholder?: string;
  className?: string;
}

// Special symbols commonly used in Indonesian legal / engineering contracts
const LEGAL_SYMBOLS = [
  { char: '§', label: 'Pasal / Seksi' },
  { char: '¶', label: 'Paragraf' },
  { char: '№', label: 'Nomor' },
  { char: '°', label: 'Derajat' },
  { char: '±', label: 'Plus-Minus' },
  { char: '²', label: 'Persegi (m²)' },
  { char: '³', label: 'Kubik (m³)' },
  { char: '‰', label: 'Permil' },
  { char: '×', label: 'Perkalian' },
  { char: '÷', label: 'Pembagian' },
  { char: '≤', label: 'Kurang atau sama dengan' },
  { char: '≥', label: 'Lebih atau sama dengan' },
  { char: '•', label: 'Bullet' },
  { char: '—', label: 'Em-dash' },
  { char: '–', label: 'En-dash' },
  { char: '✓', label: 'Centang' },
  { char: '“', label: 'Kutip Buka' },
  { char: '”', label: 'Kutip Tutup' },
  { char: '©', label: 'Hak Cipta' },
  { char: '®', label: 'Registered' },
  { char: '™', label: 'Trademark' },
];

export const ClauseTextEditor: React.FC<ClauseTextEditorProps> = ({
  value,
  onChange,
  variables = [],
  previewResolvedText,
  minRows = 8,
  placeholder = 'Ketik isi klausul di sini...',
  className = ''
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [fontSize, setFontSize] = useState<'10pt' | '11pt' | '12pt' | '14pt'>('11pt');
  const [showSymbols, setShowSymbols] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helper to wrap or insert text at cursor position
  const wrapSelection = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let replacement = '';
    let newCursorPos = start + before.length;

    if (selectedText.length > 0) {
      // Check if already wrapped
      if (selectedText.startsWith(before) && selectedText.endsWith(after)) {
        replacement = selectedText.slice(before.length, selectedText.length - after.length);
        newCursorPos = start + replacement.length;
      } else {
        replacement = before + selectedText + after;
        newCursorPos = start + replacement.length;
      }
    } else {
      replacement = before + after;
      newCursorPos = start + before.length;
    }

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  // Insert a string or symbol at cursor
  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = value.substring(0, start) + textToInsert + value.substring(end);
    onChange(updated);

    const newPos = start + textToInsert.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  // Indent selected lines or current line
  const handleIndent = (isOutdent = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Find start of first line and end of last line in selection
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const lines = value.substring(lineStart, lineEnd).split('\n');
    const modifiedLines = lines.map(line => {
      if (isOutdent) {
        if (line.startsWith('    ')) return line.substring(4);
        if (line.startsWith('\t')) return line.substring(1);
        if (line.startsWith('  ')) return line.substring(2);
        return line;
      } else {
        return '    ' + line;
      }
    });

    const replaced = modifiedLines.join('\n');
    const updated = value.substring(0, lineStart) + replaced + value.substring(lineEnd);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart, lineStart + replaced.length);
    }, 10);
  };

  // Quick prefix for sub-items (e.g. '1. ', 'a. ', '1) ')
  const handlePrefixSubItem = (type: 'number' | 'alpha' | 'parenNum' | 'parenAlpha') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start) === -1 ? value.length : value.indexOf('\n', start);
    const currentLine = value.substring(lineStart, lineEnd);

    let prefix = '';
    if (type === 'number') prefix = '1. ';
    else if (type === 'alpha') prefix = 'a. ';
    else if (type === 'parenNum') prefix = '1) ';
    else if (type === 'parenAlpha') prefix = '(a) ';

    // If already starts with a prefix, replace it, else prepend
    const cleanedLine = currentLine.replace(/^(\d+\.|\([a-zA-Z0-9]+\)|[a-zA-Z]\.|\d+\)|[a-zA-Z]\))\s*/, '');
    const newLine = prefix + cleanedLine;

    const updated = value.substring(0, lineStart) + newLine + value.substring(lineEnd);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + newLine.length);
    }, 10);
  };

  // Case transforms
  const transformCase = (type: 'upper' | 'lower' | 'title') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    if (!selected) return;

    let res = selected;
    if (type === 'upper') {
      res = selected.toUpperCase();
    } else if (type === 'lower') {
      res = selected.toLowerCase();
    } else if (type === 'title') {
      res = selected.replace(/\b\w/g, c => c.toUpperCase());
    }

    const updated = value.substring(0, start) + res + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + res.length);
    }, 10);
  };

  // Clear formatting tags from selection
  const clearFormatting = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    if (!selected) return;

    const cleaned = selected
      .replace(/<\/?(b|i|u|s|strong|em|span|p|div)[^>]*>/gi, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/~~(.*?)~~/g, '$1');

    const updated = value.substring(0, start) + cleaned + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + cleaned.length);
    }, 10);
  };

  // Keyboard shortcut listener on textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab & Shift+Tab indent
    if (e.key === 'Tab') {
      e.preventDefault();
      handleIndent(e.shiftKey);
      return;
    }

    // Ctrl+B: Bold
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      wrapSelection('<b>', '</b>');
      return;
    }

    // Ctrl+I: Italic
    if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      wrapSelection('<i>', '</i>');
      return;
    }

    // Ctrl+U: Underline
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      wrapSelection('<u>', '</u>');
      return;
    }
  };

  // Font family css mapping
  const fontFamilyClass = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  }[fontFamily];

  // Font size css mapping
  const fontSizeStyle = {
    '10pt': '13px',
    '11pt': '14.5px',
    '12pt': '16px',
    '14pt': '18.5px'
  }[fontSize];

  // Live text stats
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const lineCount = value.split('\n').length;

  return (
    <div className={`border border-slate-300 rounded-2xl bg-white shadow-xs overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 flex flex-col bg-white shadow-2xl' : ''} ${className}`}>
      
      {/* 1. TOP TOOLBAR */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-1.5 select-none text-xs">
        
        {/* Left Toolbar Items */}
        <div className="flex items-center flex-wrap gap-1">
          
          {/* Font Family Selector */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
            <Type className="w-3.5 h-3.5 ml-2 text-slate-400" />
            <select
              value={fontFamily}
              onChange={e => setFontFamily(e.target.value as any)}
              className="py-1 px-1.5 text-[11px] font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              title="Pilih Jenis Font Dokumen"
            >
              <option value="serif">Serif (Times New Roman)</option>
              <option value="sans">Sans-Serif (Arial / Modern)</option>
              <option value="mono">Monospace (Courier)</option>
            </select>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
            <select
              value={fontSize}
              onChange={e => setFontSize(e.target.value as any)}
              className="py-1 px-2 text-[11px] font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              title="Pilih Ukuran Font"
            >
              <option value="10pt">10 pt (Kecil)</option>
              <option value="11pt">11 pt (Standar Dokumen)</option>
              <option value="12pt">12 pt (Sedang)</option>
              <option value="14pt">14 pt (Besar)</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-300 mx-0.5" />

          {/* Text Styling: Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => wrapSelection('<b>', '</b>')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
              title="Huruf Tebal (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('<i>', '</i>')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
              title="Huruf Miring (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('<u>', '</u>')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
              title="Garis Bawah (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('<s>', '</s>')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
              title="Coretan (Strikethrough)"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 mx-0.5" />

          {/* Indent & Outdent */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => handleIndent(true)}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
              title="Kurangi Indent (Shift+Tab)"
            >
              <Outdent className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleIndent(false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
              title="Tambah Indent (Tab)"
            >
              <Indent className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Sub-Item / Numbering Hierarchy */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs gap-0.5">
            <button
              type="button"
              onClick={() => handlePrefixSubItem('number')}
              className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 transition-colors"
              title="Format Indent Angka: 1."
            >
              1.
            </button>
            <button
              type="button"
              onClick={() => handlePrefixSubItem('alpha')}
              className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 transition-colors"
              title="Format Indent Huruf: a."
            >
              a.
            </button>
            <button
              type="button"
              onClick={() => handlePrefixSubItem('parenNum')}
              className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 transition-colors"
              title="Format Sub-Indent Kurung: 1)"
            >
              1)
            </button>
            <button
              type="button"
              onClick={() => handlePrefixSubItem('parenAlpha')}
              className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 transition-colors"
              title="Format Sub-Indent Huruf Kurung: (a)"
            >
              (a)
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 mx-0.5" />

          {/* Insert Symbol Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSymbols(!showSymbols)}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all ${
                showSymbols 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
              title="Sisipkan Simbol Khusus (Pasal, Derajat, Kuadrat, dsb.)"
            >
              <span>§ Simbol</span>
            </button>

            {/* Symbols Popup Dropdown */}
            {showSymbols && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-300 rounded-xl shadow-xl p-2.5 z-40 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-[11px] text-slate-800">Simbol Resmi Dokumen</span>
                  <button 
                    type="button" 
                    onClick={() => setShowSymbols(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {LEGAL_SYMBOLS.map(s => (
                    <button
                      key={s.char}
                      type="button"
                      onClick={() => {
                        insertAtCursor(s.char);
                        setShowSymbols(false);
                      }}
                      className="p-1.5 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-center text-sm font-semibold transition-colors"
                      title={s.label}
                    >
                      {s.char}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Case Transformer */}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => transformCase('upper')}
              className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 transition-colors"
              title="Ubah ke HURUF BESAR (UPPERCASE)"
            >
              AA
            </button>
            <button
              type="button"
              onClick={() => transformCase('lower')}
              className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 transition-colors"
              title="Ubah ke huruf kecil (lowercase)"
            >
              aa
            </button>
            <button
              type="button"
              onClick={() => transformCase('title')}
              className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 transition-colors"
              title="Ubah Huruf Besar Awal Kata (Title Case)"
            >
              Aa
            </button>
          </div>

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={clearFormatting}
            className="p-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 shadow-2xs transition-colors"
            title="Hapus Format / Tag dari Teks Terpilih"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Toolbar Items */}
        <div className="flex items-center gap-1.5 text-slate-500">
          
          {/* Toggle Visual Ruler */}
          <button
            type="button"
            onClick={() => setShowRuler(!showRuler)}
            className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-colors ${
              showRuler 
                ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold' 
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Tampilkan / Sembunyikan Penggaris (Ruler)"
          >
            <span>📏 Ruler</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 shadow-2xs transition-colors"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh Editor'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. VISUAL RULER (PENGGARIS KERTAS RESMI A4 - 16 CM LEBAR TEKS) */}
      {showRuler && (
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-1 flex items-center select-none overflow-x-auto text-[9px] font-mono text-slate-500">
          <div className="relative w-full min-w-[620px] h-6 bg-slate-50 border border-slate-300 rounded flex items-end">
            
            {/* Left Margin Indicator */}
            <div 
              className="absolute top-0 left-0 text-[10px] text-blue-600 font-bold -translate-x-1" 
              title="Batas Margin Kiri (0 cm)"
            >
              ▼
            </div>

            {/* First-Line Indent Stop Indicator (1.25 cm) */}
            <div 
              className="absolute top-0 left-[7.8%] text-[10px] text-emerald-600 font-bold -translate-x-1" 
              title="Indent Awal Paragraf (1.25 cm)"
            >
              ▼
            </div>

            {/* Hanging Indent / Tab Stop Indicator (2.2 cm) */}
            <div 
              className="absolute bottom-0 left-[13.7%] text-[10px] text-amber-600 font-bold -translate-x-1" 
              title="Indent Huruf / Tab Stop (2.2 cm)"
            >
              ▲
            </div>

            {/* Right Margin Stop Indicator (16 cm) */}
            <div 
              className="absolute top-0 right-0 text-[10px] text-blue-600 font-bold translate-x-1" 
              title="Batas Margin Kanan (16 cm)"
            >
              ▼
            </div>

            {/* 16 Centimeter Divisions */}
            <div className="w-full flex justify-between px-0.5 pb-0.5 text-[8.5px]">
              {Array.from({ length: 17 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="leading-none text-[8px] text-slate-400">{i}</span>
                  <div className={`w-px bg-slate-400 ${i % 2 === 0 ? 'h-2.5' : 'h-1.5'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. VARIABLES HELPER ROW (IF PROVIDED) */}
      {variables && variables.length > 0 && (
        <div className="bg-emerald-50/50 border-b border-slate-200 p-2 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span className="flex items-center gap-1 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Variabel Otomatis (Klik untuk menyisipkan ke teks):
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Data otomatis diambil dari data kontrak</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {variables.map(v => (
              <button
                key={v.tag}
                type="button"
                onClick={() => insertAtCursor(` ${v.tag} `)}
                className="px-2 py-0.5 bg-white hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 rounded text-[10.5px] font-mono text-slate-700 transition-colors shadow-2xs"
                title={`Sisipkan variabel ${v.tag}`}
              >
                + {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN TEXTAREA */}
      <div className={`p-2.5 ${isFullscreen ? 'flex-1 overflow-auto' : ''}`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={isFullscreen ? 24 : Math.min(20, Math.max(minRows, value.split('\n').length + 1))}
          placeholder={placeholder}
          style={{ fontSize: fontSizeStyle }}
          className={`w-full p-3.5 border border-slate-200 rounded-xl leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all ${fontFamilyClass} bg-white text-slate-800`}
        />
      </div>

      {/* 5. BOTTOM STATUS BAR & LIVE STATS */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-1.5 flex items-center justify-between text-[10.5px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>Karakter: <strong>{charCount}</strong></span>
          <span>Kata: <strong>{wordCount}</strong></span>
          <span>Baris: <strong>{lineCount}</strong></span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline font-mono">Font: {fontFamily.toUpperCase()} ({fontSize})</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>Gunakan <strong>Tab</strong> untuk indent, <strong>Ctrl+B</strong> tebal, <strong>Ctrl+I</strong> miring</span>
        </div>
      </div>

      {/* 6. LIVE RENDER PREVIEW (IF AVAILABLE) */}
      {previewResolvedText !== undefined && (
        <div className="border-t border-slate-200 p-3 bg-emerald-50/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <span>👁️</span> Pratinjau Tampilan Cetak Resmi:
            </span>
            <span className="text-[10px] text-slate-400">Format bold, italic, dan variabel terisi otomatis</span>
          </div>
          <div className="p-3 bg-white border border-emerald-200/80 rounded-xl text-slate-800 text-[11px] font-serif leading-relaxed text-justify whitespace-pre-line shadow-2xs">
            <RichSpan text={previewResolvedText} />
          </div>
        </div>
      )}
    </div>
  );
};
