import React, { useState, useEffect } from 'react';
import { 
  parseRuangLingkup, 
  formatRuangLingkupToText, 
  RuangLingkupParsedItem 
} from '../../utils/ruangLingkupParser';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  FileText, 
  ListOrdered, 
  CheckCircle2, 
  HelpCircle,
  Eye
} from 'lucide-react';

interface RuangLingkupEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

export const RuangLingkupEditor: React.FC<RuangLingkupEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'text'>('hierarchy');
  const [items, setItems] = useState<RuangLingkupParsedItem[]>(() => parseRuangLingkup(value));

  // Sync internal structured state when external value changes
  useEffect(() => {
    const parsed = parseRuangLingkup(value);
    setItems(parsed);
  }, [value]);

  const updateItemsAndEmit = (newItems: RuangLingkupParsedItem[]) => {
    setItems(newItems);
    const newText = formatRuangLingkupToText(newItems);
    onChange(newText);
  };

  // Add new Main Item (Number: 1., 2., 3...)
  const handleAddMainItem = () => {
    const newItems = [
      ...items,
      {
        nama: `Pekerjaan Utama ${items.length + 1}`,
        subItems: []
      }
    ];
    updateItemsAndEmit(newItems);
  };

  // Update Main Item Name
  const handleUpdateMainItem = (idx: number, nama: string) => {
    const updated = [...items];
    updated[idx].nama = nama;
    updateItemsAndEmit(updated);
  };

  // Remove Main Item
  const handleRemoveMainItem = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    updateItemsAndEmit(updated);
  };

  // Move Main Item Up
  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...items];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    updateItemsAndEmit(updated);
  };

  // Move Main Item Down
  const handleMoveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const updated = [...items];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    updateItemsAndEmit(updated);
  };

  // Add Sub-Item (Letter: a., b., c...) under a Main Item
  const handleAddSubItem = (mainIdx: number) => {
    const updated = [...items];
    const nextLetter = String.fromCharCode(97 + (updated[mainIdx].subItems.length % 26));
    updated[mainIdx].subItems.push(`Sub-Pekerjaan ${nextLetter.toUpperCase()}`);
    updateItemsAndEmit(updated);
  };

  // Update Sub-Item Name
  const handleUpdateSubItem = (mainIdx: number, subIdx: number, text: string) => {
    const updated = [...items];
    updated[mainIdx].subItems[subIdx] = text;
    updateItemsAndEmit(updated);
  };

  // Remove Sub-Item
  const handleRemoveSubItem = (mainIdx: number, subIdx: number) => {
    const updated = [...items];
    updated[mainIdx].subItems = updated[mainIdx].subItems.filter((_, i) => i !== subIdx);
    updateItemsAndEmit(updated);
  };

  // Apply Sample Hierarchy Template (Matching DPUPR Kabupaten Tegal Word Document)
  const handleApplySample = () => {
    const sampleItems: RuangLingkupParsedItem[] = [
      {
        nama: 'Pekerjaan Persiapan',
        subItems: []
      },
      {
        nama: 'Pekerjaan Bongkaran',
        subItems: []
      },
      {
        nama: 'Pekerjaan Pagar',
        subItems: [
          'Pekerjaan Tanah',
          'Pekerjaan Pondasi',
          'Pekerjaan Beton',
          'Pekerjaan Pasangan Dinding',
          'Pekerjaan Plesteran',
          'Pekerjaan Penutup Dinding',
          'Pekerjaan Pengecatan',
          'Pekerjaan Lain-Lain'
        ]
      }
    ];
    updateItemsAndEmit(sampleItems);
  };

  // In Text Mode: Auto-reformat numbers and letters
  const handleAutoFormatText = () => {
    const parsed = parseRuangLingkup(value);
    const reformatted = formatRuangLingkupToText(parsed);
    onChange(reformatted);
  };

  const totalSubItems = items.reduce((acc, it) => acc + (it.subItems?.length || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div>
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ListOrdered className="w-4 h-4 text-purple-600" />
            Daftar Ruang Lingkup Pekerjaan Utama (Pasal 2 Kontrak)
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Mendukung penomoran berjenjang Angka (<strong>1, 2, 3...</strong>) dan Sub-Pekerjaan Huruf (<strong>a, b, c...</strong>).
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('hierarchy')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'hierarchy'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              Mode Form Hierarki
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'text'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Mode Teks Cepat
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: FORM HIERARKI (ANGKA & HURUF) */}
      {activeTab === 'hierarchy' ? (
        <div className="space-y-3">
          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-purple-50/60 p-2 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddMainItem}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Pekerjaan Utama ({items.length + 1})
              </button>

              <button
                type="button"
                onClick={handleApplySample}
                className="px-2.5 py-1.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Isi contoh sesuai file kontrak (1. Persiapan, 2. Bongkaran, 3. Pagar a-h)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Contoh Format Sesuai Word (Pagar a-h)
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-medium px-2 py-0.5 bg-white/80 rounded-md border border-purple-200/50">
              Total: <span className="font-bold text-slate-800">{items.length}</span> Pekerjaan Utama &bull; <span className="font-bold text-slate-800">{totalSubItems}</span> Sub-Pekerjaan
            </div>
          </div>

          {/* List of Main Items */}
          {items.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <ListOrdered className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Belum ada rincian ruang lingkup pekerjaan</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Klik tombol di bawah atau terapkan contoh standar</p>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleAddMainItem}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Item Pertama
                </button>
                <button
                  type="button"
                  onClick={handleApplySample}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Terapkan Contoh
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, mainIdx) => (
                <div 
                  key={mainIdx}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:border-purple-300 transition-all space-y-2.5"
                >
                  {/* Main Item Row */}
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border border-purple-200">
                      {mainIdx + 1}.
                    </span>

                    <input
                      type="text"
                      value={item.nama}
                      onChange={(e) => handleUpdateMainItem(mainIdx, e.target.value)}
                      placeholder="Nama Pekerjaan Utama (contoh: Pekerjaan Pagar)"
                      className="flex-1 px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    {/* Action Buttons for Main Item */}
                    <button
                      type="button"
                      onClick={() => handleAddSubItem(mainIdx)}
                      className="px-2 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                      title="Tambah Sub-Pekerjaan dengan huruf (a, b, c...)"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="hidden sm:inline">+ Sub (Huruf)</span>
                    </button>

                    <button
                      type="button"
                      disabled={mainIdx === 0}
                      onClick={() => handleMoveUp(mainIdx)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                      title="Geser ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={mainIdx === items.length - 1}
                      onClick={() => handleMoveDown(mainIdx)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                      title="Geser ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveMainItem(mainIdx)}
                      className="p-1.5 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="Hapus pekerjaan utama ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Sub-Items Nested List */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div className="ml-5 pl-4 border-l-2 border-purple-200 space-y-2 pt-1">
                      {item.subItems.map((sub, subIdx) => {
                        const letter = String.fromCharCode(97 + (subIdx % 26));
                        return (
                          <div key={subIdx} className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                              {letter}.
                            </span>

                            <input
                              type="text"
                              value={sub}
                              onChange={(e) => handleUpdateSubItem(mainIdx, subIdx, e.target.value)}
                              placeholder={`Sub-Pekerjaan ${letter.toUpperCase()} (contoh: Pekerjaan Tanah)`}
                              className="flex-1 px-2.5 py-1 text-xs text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveSubItem(mainIdx, subIdx)}
                              className="p-1 text-slate-300 hover:text-red-500 rounded hover:bg-slate-100"
                              title="Hapus sub-pekerjaan ini"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}

                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleAddSubItem(mainIdx)}
                          className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 hover:underline"
                        >
                          <Plus className="w-3 h-3" />
                          Tambah Sub-Pekerjaan ({String.fromCharCode(97 + (item.subItems.length % 26))}.)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleAddMainItem}
                  className="w-full py-2 border-2 border-dashed border-purple-300 hover:border-purple-500 text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Pekerjaan Utama ({items.length + 1})
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: MODE TEKS CEPAT */
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAutoFormatText}
                className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-[11px] font-semibold flex items-center gap-1 hover:bg-purple-100"
                title="Format otomatis nomor 1, 2, 3 dan huruf a, b, c"
              >
                <CheckCircle2 className="w-3 h-3 text-purple-600" /> Rapikan Nomor & Huruf Otomatis
              </button>
              <button
                type="button"
                onClick={handleApplySample}
                className="px-2.5 py-1 bg-white text-slate-700 border border-slate-300 rounded-md text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-50"
              >
                <Sparkles className="w-3 h-3 text-amber-500" /> Contoh Format Standar
              </button>
            </div>
            <span className="text-[11px] text-slate-500">
              Gunakan 3 spasi atau ketik <code>a.</code> di awal baris untuk membuat sub-pekerjaan
            </span>
          </div>

          <textarea
            rows={8}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`1. Pekerjaan Persiapan\n2. Pekerjaan Bongkaran\n3. Pekerjaan Pagar\n   a. Pekerjaan Tanah\n   b. Pekerjaan Pondasi\n   c. Pekerjaan Beton`}
            className="w-full p-3 text-xs font-mono border border-slate-300 rounded-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
          />
        </div>
      )}

      {/* LIVE PREVIEW BOX (Sesuai Tampilan Print & Word) */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-4 shadow-sm border border-slate-800 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Pratinjau Hasil Dokumen Kontrak (Pasal 2 & Word)
          </span>
          <span className="text-[10px] text-slate-400">Rata kiri & berinden sesuai template Word</span>
        </div>

        <div className="font-serif text-xs leading-relaxed space-y-1 pt-1 text-slate-200">
          <p className="font-medium text-slate-300">Ruang lingkup pekerjaan utama terdiri dari:</p>
          {items.length === 0 ? (
            <p className="italic text-slate-500 text-[11px] pl-4">- Belum ada ruang lingkup pekerjaan -</p>
          ) : (
            <div className="space-y-0.5">
              {items.map((it, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-start gap-2">
                    <span className="w-5 shrink-0 text-slate-400 font-medium">{idx + 1}.</span>
                    <span className="flex-1 font-medium">{it.nama}</span>
                  </div>
                  {it.subItems && it.subItems.length > 0 && (
                    <div className="pl-6 space-y-0.5">
                      {it.subItems.map((sub, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2">
                          <span className="w-5 shrink-0 text-purple-300 font-medium">
                            {String.fromCharCode(97 + (sIdx % 26))}.
                          </span>
                          <span className="flex-1 text-slate-300">{sub}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

