import React from 'react';
import { useApp } from '../../context/AppContext';
import { MasterPpk } from '../../types';
import { UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface PpkSelectorDropdownProps {
  onSelectPpk: (ppk: MasterPpk) => void;
  selectedPpkNama?: string;
  selectedPpkNip?: string;
  label?: string;
  helperText?: string;
  compact?: boolean;
}

export const PpkSelectorDropdown: React.FC<PpkSelectorDropdownProps> = ({
  onSelectPpk,
  selectedPpkNama,
  selectedPpkNip,
  label = 'Pilih & Tarik Data dari Master PPK',
  helperText = 'Pilih nama PPK di bawah ini untuk mengisi seluruh isian data PPK secara otomatis.',
  compact = false
}) => {
  const { masterPpkList } = useApp();

  // Ambil hanya PPK yang aktif (atau yang saat ini sedang dipilih meskipun nonaktif)
  const availablePpk = masterPpkList.filter(
    p => p.status === 'aktif' || (selectedPpkNip && p.nip === selectedPpkNip)
  );

  const matchedPpk = masterPpkList.find(
    p => (selectedPpkNip && p.nip === selectedPpkNip) || (selectedPpkNama && p.nama === selectedPpkNama)
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ppkId = e.target.value;
    if (!ppkId) return;
    const found = masterPpkList.find(p => p.id === ppkId);
    if (found) {
      onSelectPpk(found);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={matchedPpk?.id || ''}
            onChange={handleChange}
            className="w-full text-xs font-semibold py-1.5 pl-8 pr-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">-- Pilih PPK dari Master Data --</option>
            {availablePpk.map(ppk => (
              <option key={ppk.id} value={ppk.id}>
                {ppk.nama} (NIP: {ppk.nip})
              </option>
            ))}
          </select>
          <UserCheck className="w-4 h-4 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-2xl shadow-2xs space-y-2 mb-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{label}</span>
        </label>
        {matchedPpk && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            Tersinkron: {matchedPpk.nama}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={matchedPpk?.id || ''}
          onChange={handleChange}
          className="w-full text-xs font-semibold py-2 pl-9 pr-3 bg-white border border-emerald-300 rounded-xl text-slate-800 shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
        >
          <option value="">-- Klik untuk memilih PPK (Semua data otomatis terisi) --</option>
          {availablePpk.map(ppk => (
            <option key={ppk.id} value={ppk.id}>
              {ppk.nama} — {ppk.jabatan} (NIP: {ppk.nip})
            </option>
          ))}
        </select>
        <UserCheck className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500 leading-tight">
          {helperText}
        </p>
      )}
    </div>
  );
};

