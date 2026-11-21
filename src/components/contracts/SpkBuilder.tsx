import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SpkContract, SpkType, SpkPersonelItem, SpkClauseItem } from '../../types';
import { createDefaultSpkForProject, DEFAULT_SPK_FISIK_CLAUSES, DEFAULT_SPK_PENGAWAS_CLAUSES, DEFAULT_SPK_PERENCANA_CLAUSES } from '../../data/spkData';
import { hasPermission } from '../../utils/permissions';
import { formatRupiah, formatRibuan, parseRibuanKeAngka, angkaKeTerbilang, parseKomponenTanggalKontrak } from '../../utils/formatters';
import { SpkPrintView } from './SpkPrintView';
import { generateSpkWordDoc } from '../../utils/spkWordExport';
import { ClauseTextEditor } from './ClauseTextEditor';
import { PpkSelectorDropdown } from '../common/PpkSelectorDropdown';
import { 
  FileText, 
  HardHat, 
  ClipboardCheck, 
  Compass, 
  Save, 
  Download, 
  Printer, 
  Sliders, 
  CheckSquare, 
  Eye, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Building,
  UserCheck,
  Calendar,
  DollarSign,
  RotateCcw
} from 'lucide-react';

interface SpkBuilderProps {
  currentSpkType?: SpkType;
  onSpkTypeChange?: (type: SpkType) => void;
}

export const SpkBuilder: React.FC<SpkBuilderProps> = ({ 
  currentSpkType: controlledSpkType, 
  onSpkTypeChange 
}) => {
  const { selectedProject, spkContracts, updateSpkContract, currentUser, spkDocType, setSpkDocType } = useApp();

  const activeSpkType: SpkType = controlledSpkType || spkDocType || 'fisik';
  const handleSelectSpkType = (type: SpkType) => {
    if (onSpkTypeChange) {
      onSpkTypeChange(type);
    }
    setSpkDocType(type);
  };

  const [activeTabMode, setActiveTabMode] = useState<'form' | 'klausul' | 'preview'>('form');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  if (!selectedProject) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        Silakan pilih proyek terlebih dahulu pada menu navigasi.
      </div>
    );
  }

  // Get or initialize SPK for current project & type
  const existingSpk = spkContracts?.find(
    s => s.projectId === selectedProject.id && s.spkType === activeSpkType
  );

  const [spkData, setSpkData] = useState<SpkContract>(() => {
    return existingSpk || createDefaultSpkForProject(selectedProject, activeSpkType);
  });

  // Keep local state in sync when project or activeSpkType changes
  useEffect(() => {
    const found = spkContracts?.find(
      s => s.projectId === selectedProject.id && s.spkType === activeSpkType
    );
    if (found) {
      if (found.spkType === 'fisik') {
        const currentCount = (found.clauses || []).length;
        const totalLines = (found.clauses || []).reduce((acc, c) => acc + (c.isi ? c.isi.split('\n').length : 0), 0);
        const hasOldPasal3 = (found.clauses || []).some(cl => cl.id === 'spk-fsk-3' && cl.isi && cl.isi.includes('1) menawarkan'));
        if (currentCount < 31 || totalLines < 230 || hasOldPasal3) {
          const activeMap = new Map((found.clauses || []).map(cl => [cl.id, cl.isActive]));
          const customMap = new Map((found.clauses || []).filter(cl => cl.isi).map(cl => [cl.id, cl.isi]));
          const updatedClauses = DEFAULT_SPK_FISIK_CLAUSES.map(defaultClause => {
            const existingText = customMap.get(defaultClause.id);
            const isOutdated = !existingText || existingText.split('\n').length < defaultClause.isi.split('\n').length || (defaultClause.id === 'spk-fsk-3' && hasOldPasal3);
            return {
              ...defaultClause,
              isi: isOutdated ? defaultClause.isi : (existingText || defaultClause.isi),
              isActive: activeMap.has(defaultClause.id) ? (activeMap.get(defaultClause.id) ?? true) : true
            };
          });
          const migratedFound = { ...found, clauses: updatedClauses };
          setSpkData(migratedFound);
          updateSpkContract(migratedFound);
          return;
        }
      }
      if (found.spkType === 'perencana') {
        const currentCount = (found.clauses || []).length;
        const needsUpdate = currentCount < 27
          || !(found.clauses?.find(c => c.pasal === 9)?.isi.includes('• Tahap Perencanaan Teknis'))
          || !(found.clauses?.find(c => c.pasal === 23)?.isi.includes('Pembayaran terakhir'));
        if (needsUpdate) {
          const activeMap = new Map((found.clauses || []).map(cl => [cl.id, cl.isActive]));
          const updatedClauses = DEFAULT_SPK_PERENCANA_CLAUSES.map(defaultClause => {
            return {
              ...defaultClause,
              isActive: activeMap.has(defaultClause.id) ? (activeMap.get(defaultClause.id) ?? true) : true
            };
          });
          const migratedFound = { 
            ...found, 
            clauses: updatedClauses,
            jenisKontrak: found.jenisKontrak || 'Lumpsum',
            sistemPembayaran: found.sistemPembayaran || 'Sekaligus (100% setelah selesai & PHO)',
            dendaKeterlambatan: found.dendaKeterlambatan || '1/1000 (satu permil) dari nilai SPK (tidak termasuk PPN) untuk setiap hari keterlambatan pada masa Perencanaan Teknis.'
          };
          setSpkData(migratedFound);
          updateSpkContract(migratedFound);
          return;
        }
      }
      setSpkData(found);
    } else {
      const defaultSpk = createDefaultSpkForProject(selectedProject, activeSpkType);
      setSpkData(defaultSpk);
      updateSpkContract(defaultSpk);
    }
  }, [selectedProject.id, activeSpkType, spkContracts, updateSpkContract]);

  const canEdit = currentUser ? hasPermission(currentUser.role, 'edit_contract') : true;

  const isFisikInProject = selectedProject.hasFisik !== false && !!selectedProject.kontraktorNama && selectedProject.kontraktorNama !== '-';
  const isPengawasInProject = selectedProject.hasPengawas !== false && !!selectedProject.pengawasNama && selectedProject.pengawasNama !== '-';
  const isPerencanaInProject = selectedProject.hasPerencana !== false && !!selectedProject.perencanaNama && selectedProject.perencanaNama !== '-';

  // Handlers for Form State
  const handleFieldChange = (field: keyof SpkContract, value: any) => {
    setSpkData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (val: string) => {
    const comp = parseKomponenTanggalKontrak(val);
    setSpkData(prev => ({
      ...prev,
      tanggalSpk: val,
      hariSpk: comp.hari,
      tanggalTeksSpk: comp.tanggalTeks,
      bulanTeksSpk: comp.bulanTeks,
      tahunSpk: comp.tahunAngka
    }));
  };

  const handleNilaiChange = (val: number) => {
    setSpkData(prev => ({
      ...prev,
      nilaiKontrak: val,
      nilaiKontrakTerbilang: angkaKeTerbilang(val)
    }));
  };

  const handleDurasiChange = (val: number) => {
    setSpkData(prev => ({
      ...prev,
      jangkaWaktuHari: val,
      jangkaWaktuHuruf: angkaKeTerbilang(val).replace('rupiah', '').trim()
    }));
  };

  // Lingkup Handlers
  const [newScopeText, setNewScopeText] = useState('');
  const handleAddScope = () => {
    if (!newScopeText.trim()) return;
    setSpkData(prev => ({
      ...prev,
      ruangLingkup: [...(prev.ruangLingkup || []), newScopeText.trim()]
    }));
    setNewScopeText('');
  };

  const handleDeleteScope = (idx: number) => {
    setSpkData(prev => ({
      ...prev,
      ruangLingkup: (prev.ruangLingkup || []).filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateScope = (idx: number, text: string) => {
    setSpkData(prev => {
      const updated = [...(prev.ruangLingkup || [])];
      updated[idx] = text;
      return { ...prev, ruangLingkup: updated };
    });
  };

  // Personel Handlers
  const handleAddPersonel = () => {
    const newPerson: SpkPersonelItem = {
      id: `pers-${Date.now()}`,
      nama: 'Nama Tenaga Ahli Baru',
      posisi: activeSpkType === 'fisik' ? 'Pelaksana Lapangan' : activeSpkType === 'pengawas' ? 'Pengawas Teknis' : 'Tenaga Ahli Perencana',
      kualifikasi: 'S1 Teknik Sipil / Arsitektur',
      sertifikat: 'SKK Jenjang 6'
    };
    setSpkData(prev => ({
      ...prev,
      personelList: [...(prev.personelList || []), newPerson]
    }));
  };

  const handleDeletePersonel = (id: string) => {
    setSpkData(prev => ({
      ...prev,
      personelList: (prev.personelList || []).filter(p => p.id !== id)
    }));
  };

  const handleUpdatePersonel = (id: string, field: keyof SpkPersonelItem, val: string) => {
    setSpkData(prev => ({
      ...prev,
      personelList: (prev.personelList || []).map(p => p.id === id ? { ...p, [field]: val } : p)
    }));
  };

  // Klausul Handlers
  const handleToggleClause = (id: string) => {
    setSpkData(prev => ({
      ...prev,
      clauses: (prev.clauses || []).map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    }));
  };

  const handleUpdateClauseText = (id: string, text: string) => {
    setSpkData(prev => ({
      ...prev,
      clauses: (prev.clauses || []).map(c => c.id === id ? { ...c, isi: text } : c)
    }));
  };

  const handleResetToDefaultClauses = () => {
    const defaultClauses = activeSpkType === 'fisik'
      ? DEFAULT_SPK_FISIK_CLAUSES
      : (activeSpkType === 'pengawas' ? DEFAULT_SPK_PENGAWAS_CLAUSES : DEFAULT_SPK_PERENCANA_CLAUSES);
    
    const count = defaultClauses.length;
    if (window.confirm(`Muat ulang seluruh ${count} pasal Syarat Umum SPK ke template baku resmi DPUPR Kab. Tegal? Seluruh pasal dan sub-poin akan dikembalikan ke format standar.`)) {
      const updated = { ...spkData, clauses: JSON.parse(JSON.stringify(defaultClauses)) };
      setSpkData(updated);
      updateSpkContract(updated);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    }
  };

  // Save Handler
  const handleSaveSpk = () => {
    updateSpkContract(spkData);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    generateSpkWordDoc(spkData);
  };

  return (
    <div className="space-y-6">
      
      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-xs no-print animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Data SPK berhasil disimpan ke database lokal proyek!</span>
          </div>
          <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded font-mono">Tersimpan</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase font-mono tracking-wider border border-amber-200">
              Perlem LKPP No. 12/2021 & Standar DPUPR
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Proyek: <strong className="text-slate-900">{selectedProject.nama}</strong>
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Surat Perintah Kerja (SPK) Modular
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih jenis SPK (Fisik, Konsultan Pengawas, atau Konsultan Perencana), lengkapi isian data, klausul dan pratinjau dokumen cetak resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <button
              onClick={handleSaveSpk}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan SPK Proyek Ini
            </button>
          )}

          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download Dokumen SPK dalam format Word (.doc)"
          >
            <Download className="w-4 h-4" />
            Export Word (.doc)
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Dokumen Resmi
          </button>
        </div>
      </div>

      {/* 3 Jenis SPK Selector Tabs (Fisik, Pengawas, Perencana) */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-2 no-print">
        <button
          onClick={() => handleSelectSpkType('fisik')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeSpkType === 'fisik'
              ? 'bg-white text-emerald-800 shadow-sm border border-emerald-300 ring-2 ring-emerald-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <HardHat className={`w-4 h-4 shrink-0 ${activeSpkType === 'fisik' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5 font-bold flex-wrap">
              <span>1. SPK Fisik / Konstruksi</span>
              {isFisikInProject ? (
                <span className="text-[9px] px-1.5 py-0.5 font-semibold bg-emerald-100 text-emerald-700 rounded border border-emerald-200">
                  Ada di Proyek
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 font-semibold bg-slate-200 text-slate-500 rounded">
                  Nonaktif / Kosong
                </span>
              )}
            </div>
            <div className="text-[10px] font-normal text-slate-500 truncate">Pekerjaan Pelaksanaan Lapangan</div>
          </div>
          {activeSpkType === 'fisik' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-auto shrink-0 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => handleSelectSpkType('pengawas')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeSpkType === 'pengawas'
              ? 'bg-white text-teal-800 shadow-sm border border-teal-300 ring-2 ring-teal-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ClipboardCheck className={`w-4 h-4 shrink-0 ${activeSpkType === 'pengawas' ? 'text-teal-600' : 'text-slate-400'}`} />
          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5 font-bold flex-wrap">
              <span>2. SPK Konsultan Pengawas</span>
              {isPengawasInProject ? (
                <span className="text-[9px] px-1.5 py-0.5 font-semibold bg-teal-100 text-teal-700 rounded border border-teal-200">
                  Ada di Proyek
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 font-semibold bg-slate-200 text-slate-500 rounded">
                  Nonaktif / Kosong
                </span>
              )}
            </div>
            <div className="text-[10px] font-normal text-slate-500 truncate">Pengawasan Teknis & Mutu</div>
          </div>
          {activeSpkType === 'pengawas' && (
            <span className="w-2 h-2 rounded-full bg-teal-500 ml-auto shrink-0 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => handleSelectSpkType('perencana')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeSpkType === 'perencana'
              ? 'bg-white text-indigo-800 shadow-sm border border-indigo-300 ring-2 ring-indigo-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Compass className={`w-4 h-4 shrink-0 ${activeSpkType === 'perencana' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5 font-bold flex-wrap">
              <span>3. SPK Konsultan Perencana</span>
              {isPerencanaInProject ? (
                <span className="text-[9px] px-1.5 py-0.5 font-semibold bg-indigo-100 text-indigo-700 rounded border border-indigo-200">
                  Ada di Proyek
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 font-semibold bg-slate-200 text-slate-500 rounded">
                  Nonaktif / Kosong
                </span>
              )}
            </div>
            <div className="text-[10px] font-normal text-slate-500 truncate">Perencanaan Teknis DED & RAB</div>
          </div>
          {activeSpkType === 'perencana' && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 ml-auto shrink-0 animate-pulse" />
          )}
        </button>
      </div>

      {/* 3 Sub-Modes (Form, Klausul, Preview) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 no-print overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTabMode('form')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTabMode === 'form'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          1. Form Isian SPK ({activeSpkType.toUpperCase()})
        </button>

        <button
          onClick={() => setActiveTabMode('klausul')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTabMode === 'klausul'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          2. Syarat-Syarat SPK ({(spkData.clauses || []).filter(c => c.isActive).length} Aktif)
        </button>

        <button
          onClick={() => setActiveTabMode('preview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTabMode === 'preview'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          3. Pratinjau Cetak Dokumen Resmi
        </button>
      </div>

      {/* MODE 1: FORM ISIAN SPK */}
      {activeTabMode === 'form' && (
        <div className="space-y-6">

          {/* Section 1: Dasar & Nomor SPK */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>1. Nomor Dokumen & Tanggal SPK</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor SPK
                </label>
                <input
                  type="text"
                  value={spkData.nomorSpk || ''}
                  onChange={(e) => handleFieldChange('nomorSpk', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="000.3.2/PBLT/17.04/SPK/X/2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal SPK (Pilih dari Kalender)
                </label>
                <input
                  type="date"
                  value={spkData.tanggalSpk || ''}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Metode Pengadaan
                </label>
                <select
                  value={spkData.metodePengadaan || 'Pengadaan Langsung'}
                  onChange={(e) => handleFieldChange('metodePengadaan', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Pengadaan Langsung">Pengadaan Langsung</option>
                  <option value="E-Purchasing">E-Purchasing</option>
                  <option value="Tender / Seleksi">Tender / Seleksi</option>
                  <option value="Penunjukan Langsung">Penunjukan Langsung</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Paket Pengadaan / Pekerjaan
                </label>
                <input
                  type="text"
                  value={spkData.namaPaket || ''}
                  onChange={(e) => handleFieldChange('namaPaket', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold uppercase"
                  placeholder="JASA KONSULTANSI PERENCANAAN..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi Pekerjaan
                </label>
                <input
                  type="text"
                  value={spkData.lokasiPekerjaan || ''}
                  onChange={(e) => handleFieldChange('lokasiPekerjaan', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="Kecamatan Slawi Kab. Tegal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Undangan Pengadaan Langsung / SPPBJ
                </label>
                <input
                  type="text"
                  value={spkData.nomorUndanganPengadaan || spkData.nomorSppbj || ''}
                  onChange={(e) => {
                    handleFieldChange('nomorUndanganPengadaan', e.target.value);
                    handleFieldChange('nomorSppbj', e.target.value);
                  }}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="000.3.2/DPUPR/REHAB.JAKSA/PP/04/2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Undangan Pengadaan Langsung
                </label>
                <input
                  type="date"
                  value={spkData.tanggalUndanganPengadaan || spkData.tanggalSppbj || ''}
                  onChange={(e) => {
                    handleFieldChange('tanggalUndanganPengadaan', e.target.value);
                    handleFieldChange('tanggalSppbj', e.target.value);
                  }}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Anggaran
                </label>
                <input
                  type="number"
                  value={spkData.tahunAnggaran || 2026}
                  onChange={(e) => handleFieldChange('tahunAnggaran', Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Berita Acara Hasil Pengadaan Langsung (BAHPL)
                </label>
                <input
                  type="text"
                  value={spkData.nomorBahpl || ''}
                  onChange={(e) => handleFieldChange('nomorBahpl', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="000.3.2/DPUPR/Rehab.Jaksa/PP/07/2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal BAHPL
                </label>
                <input
                  type="date"
                  value={spkData.tanggalBahpl || ''}
                  onChange={(e) => handleFieldChange('tanggalBahpl', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Anggaran (Cover Dokumen)
                </label>
                <input
                  type="text"
                  value={spkData.perubahanAnggaran || ''}
                  onChange={(e) => handleFieldChange('perubahanAnggaran', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                  placeholder="PERUBAHAN ANGGARAN TAHUN 2026"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian Kegiatan (Sesuai Cover & Formulir SPK)
                </label>
                <input
                  type="text"
                  value={spkData.kegiatan || ''}
                  onChange={(e) => handleFieldChange('kegiatan', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="KEGIATAN PENYELENGGARAAN BANGUNAN GEDUNG..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor DPPA / DPA
                </label>
                <input
                  type="text"
                  value={spkData.dppaNomor || ''}
                  onChange={(e) => handleFieldChange('dppaNomor', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="DPPA/A.3/1.03.0.00.0.00.01.0000/001/2026"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pihak Pertama (PPK) & Pihak Kedua (Penyedia) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* PPK Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Pihak Pertama (Pejabat Pembuat Komitmen - PPK)</span>
              </div>

              {/* Tarik Data Cepat dari Master Data PPK */}
              <PpkSelectorDropdown
                selectedPpkNama={spkData.ppkNama}
                selectedPpkNip={spkData.ppkNip}
                onSelectPpk={(ppk) => {
                  handleFieldChange('ppkNama', ppk.nama);
                  handleFieldChange('ppkNip', ppk.nip);
                  handleFieldChange('ppkJabatan', ppk.jabatan);
                  if (ppk.alamat) handleFieldChange('ppkAlamat', ppk.alamat);
                  if (ppk.nomorSk) handleFieldChange('ppkNomorSk', ppk.nomorSk);
                  if (ppk.uraianSk) handleFieldChange('ppkSkPengangkatanText', ppk.uraianSk);
                }}
                label="Tarik Data dari Master PPK DPUPR"
                helperText="Pilih nama PPK terdaftar untuk otomatis mengisi Nama, NIP, Jabatan, Alamat Kantor, Nomor SK, dan Redaksi SK Pengangkatan."
              />

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap PPK</label>
                  <input
                    type="text"
                    value={spkData.ppkNama || ''}
                    onChange={(e) => handleFieldChange('ppkNama', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NIP PPK</label>
                    <input
                      type="text"
                      value={spkData.ppkNip || ''}
                      onChange={(e) => handleFieldChange('ppkNip', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor SK Pengangkatan</label>
                    <input
                      type="text"
                      value={spkData.ppkNomorSk || ''}
                      onChange={(e) => handleFieldChange('ppkNomorSk', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan PPK</label>
                  <input
                    type="text"
                    value={spkData.ppkJabatan || ''}
                    onChange={(e) => handleFieldChange('ppkJabatan', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Kedudukan Kantor</label>
                  <input
                    type="text"
                    value={spkData.ppkAlamat || ''}
                    onChange={(e) => handleFieldChange('ppkAlamat', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dasar SK Pengangkatan PPK (Redaksi Lengkap)</label>
                  <textarea
                    rows={2}
                    value={spkData.ppkSkPengangkatanText || ''}
                    onChange={(e) => handleFieldChange('ppkSkPengangkatanText', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor 07 Tahun 2026..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Wakil Sah Pejabat Penandatangan Kontrak</label>
                  <input
                    type="text"
                    value={spkData.wakilSahPpk || 'Tidak ada'}
                    onChange={(e) => handleFieldChange('wakilSahPpk', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Tidak ada"
                  />
                </div>
              </div>
            </div>

            {/* Penyedia / Konsultan Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>
                  Pihak Kedua ({activeSpkType === 'fisik' ? 'Penyedia Jasa Konstruksi' : 'Penyedia Jasa Konsultansi'})
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Perusahaan / Badan Usaha</label>
                    <input
                      type="text"
                      value={spkData.penyediaNamaBadanUsaha || ''}
                      onChange={(e) => handleFieldChange('penyediaNamaBadanUsaha', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bentuk Badan</label>
                    <select
                      value={spkData.penyediaBentukUsaha || 'PT'}
                      onChange={(e) => handleFieldChange('penyediaBentukUsaha', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="PT">PT</option>
                      <option value="CV">CV</option>
                      <option value="Perseorangan">Perseorangan</option>
                      <option value="Koperasi">Koperasi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Direktur / Pimpinan</label>
                    <input
                      type="text"
                      value={spkData.penyediaNamaPimpinan || ''}
                      onChange={(e) => handleFieldChange('penyediaNamaPimpinan', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Pimpinan</label>
                    <input
                      type="text"
                      value={spkData.penyediaJabatanPimpinan || ''}
                      onChange={(e) => handleFieldChange('penyediaJabatanPimpinan', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Kantor Penyedia</label>
                  <input
                    type="text"
                    value={spkData.penyediaAlamat || ''}
                    onChange={(e) => handleFieldChange('penyediaAlamat', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Akta Notaris No.</label>
                    <input
                      type="text"
                      value={spkData.penyediaAktaNotarisNomor || ''}
                      onChange={(e) => handleFieldChange('penyediaAktaNotarisNomor', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      placeholder="4"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Akta</label>
                    <input
                      type="text"
                      value={spkData.penyediaAktaNotarisTanggal || ''}
                      onChange={(e) => handleFieldChange('penyediaAktaNotarisTanggal', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      placeholder="7 April 2022"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Notaris</label>
                    <input
                      type="text"
                      value={spkData.penyediaAktaNotarisNama || ''}
                      onChange={(e) => handleFieldChange('penyediaAktaNotarisNama', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      placeholder="LAELI NURCHAMIDAH, SH. MKn"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NPWP Perusahaan</label>
                    <input
                      type="text"
                      value={spkData.penyediaNpwp || ''}
                      onChange={(e) => handleFieldChange('penyediaNpwp', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Bank Pembayaran</label>
                    <input
                      type="text"
                      value={spkData.penyediaBank || ''}
                      onChange={(e) => handleFieldChange('penyediaBank', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      placeholder="Bank Jateng Cabang Slawi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Rekening Bank</label>
                    <input
                      type="text"
                      value={spkData.penyediaNomorRekening || ''}
                      onChange={(e) => handleFieldChange('penyediaNomorRekening', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                      placeholder="1035-01626-7"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      value={spkData.penyediaNamaRekening || ''}
                      onChange={(e) => handleFieldChange('penyediaNamaRekening', e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      placeholder="CV. TITIAN SEJAHTERA KONSULTAN"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: Nilai, Waktu & Ketentuan Pembayaran */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>3. Nilai Kontrak SPK, Waktu Pelaksanaan & Sistem Pembayaran</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nilai Kontrak SPK (Rp)
                </label>
                <input
                  type="text"
                  value={formatRibuan(spkData.nilaiKontrak || 0)}
                  onChange={(e) => handleNilaiChange(parseRibuanKeAngka(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                />
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  Terbilang: {spkData.nilaiKontrakTerbilang}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jangka Waktu Pelaksanaan (Hari Kalender)
                </label>
                <input
                  type="number"
                  value={spkData.jangkaWaktuHari || 0}
                  onChange={(e) => handleDurasiChange(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                />
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  Huruf: {spkData.jangkaWaktuHuruf} hari kalender
                </p>
              </div>

              {activeSpkType === 'fisik' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Masa Pemeliharaan (Hari Kalender)
                  </label>
                  <input
                    type="number"
                    value={spkData.masaPemeliharaanHari || 180}
                    onChange={(e) => handleFieldChange('masaPemeliharaanHari', Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 italic">
                    Standar gedung: 180 hari kalender
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sumber Pembiayaan
                  </label>
                  <input
                    type="text"
                    value={spkData.sumberDana || ''}
                    onChange={(e) => handleFieldChange('sumberDana', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Mulai Kerja
                </label>
                <input
                  type="date"
                  value={spkData.tanggalMulai || ''}
                  onChange={(e) => handleFieldChange('tanggalMulai', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Selesai Pekerjaan
                </label>
                <input
                  type="date"
                  value={spkData.tanggalSelesai || ''}
                  onChange={(e) => handleFieldChange('tanggalSelesai', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sistem / Cara Pembayaran
                </label>
                <select
                  value={spkData.sistemPembayaran || 'Termin / Prestasi Kerja'}
                  onChange={(e) => handleFieldChange('sistemPembayaran', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Sekaligus (100% setelah selesai & PHO)">Sekaligus (100% setelah selesai & PHO)</option>
                  <option value="Termin / Prestasi Kerja">Termin / Prestasi Kerja</option>
                  <option value="Bulanan (Monthly Certificate)">Bulanan (Monthly Certificate)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan & Tata Cara Pembayaran
                </label>
                <input
                  type="text"
                  value={spkData.keteranganPembayaran || ''}
                  onChange={(e) => handleFieldChange('keteranganPembayaran', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ketentuan Denda Keterlambatan
                </label>
                <input
                  type="text"
                  value={spkData.dendaKeterlambatan || ''}
                  onChange={(e) => handleFieldChange('dendaKeterlambatan', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kontrak
                </label>
                <input
                  type="text"
                  value={spkData.jenisKontrak || (activeSpkType === 'perencana' || activeSpkType === 'pengawas' ? 'Lumpsum' : 'Harga Satuan')}
                  onChange={(e) => handleFieldChange('jenisKontrak', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                  placeholder={activeSpkType === 'perencana' || activeSpkType === 'pengawas' ? 'Lumpsum' : 'Harga Satuan'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Besaran Uang Muka
                </label>
                <input
                  type="text"
                  value={spkData.besaranUangMuka || 'Kontrak ini tidak diberikan uang muka'}
                  onChange={(e) => handleFieldChange('besaranUangMuka', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="Kontrak ini tidak diberikan uang muka"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fasilitas yang Diberikan
                </label>
                <input
                  type="text"
                  value={spkData.fasilitas || 'tidak diberikan fasilitas'}
                  onChange={(e) => handleFieldChange('fasilitas', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="tidak diberikan fasilitas"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Ruang Lingkup Pekerjaan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>4. Butir-Butir Ruang Lingkup Pekerjaan / Layanan</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {(spkData.ruangLingkup || []).length} Butir Lingkup
              </span>
            </div>

            <div className="space-y-2">
              {(spkData.ruangLingkup || []).map((scope, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-bold text-slate-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={scope}
                    onChange={(e) => handleUpdateScope(idx, e.target.value)}
                    className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  {canEdit && (
                    <button
                      onClick={() => handleDeleteScope(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus butir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {canEdit && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={newScopeText}
                  onChange={(e) => setNewScopeText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddScope(); }}
                  placeholder="Ketik uraian ruang lingkup baru lalu tekan Tambah..."
                  className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleAddScope}
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Butir
                </button>
              </div>
            )}
          </div>

          {/* Section 5: Personel / Tenaga Ahli */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>5. Daftar Personel / Tenaga Ahli yang Ditugaskan</span>
              </div>
              {canEdit && (
                <button
                  onClick={handleAddPersonel}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Personel
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-200 rounded-xl">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-left border-b border-slate-200">
                    <th className="p-2.5 w-10 text-center">No</th>
                    <th className="p-2.5">Nama Lengkap</th>
                    <th className="p-2.5">Posisi Penugasan</th>
                    <th className="p-2.5">Kualifikasi Pendidikan</th>
                    <th className="p-2.5">Sertifikat / SKK</th>
                    {canEdit && <th className="p-2.5 w-12 text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(spkData.personelList || []).map((pers, idx) => (
                    <tr key={pers.id} className="hover:bg-slate-50/60">
                      <td className="p-2.5 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={pers.nama}
                          onChange={(e) => handleUpdatePersonel(pers.id, 'nama', e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={pers.posisi}
                          onChange={(e) => handleUpdatePersonel(pers.id, 'posisi', e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={pers.kualifikasi}
                          onChange={(e) => handleUpdatePersonel(pers.id, 'kualifikasi', e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={pers.sertifikat || ''}
                          onChange={(e) => handleUpdatePersonel(pers.id, 'sertifikat', e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      {canEdit && (
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => handleDeletePersonel(pers.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Hapus personel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: KLAUSUL SYARAT-SYARAT SPK */}
      {activeTabMode === 'klausul' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Klausul Syarat-Syarat SPK ({activeSpkType.toUpperCase()})
              </h3>
              <p className="text-xs text-slate-500">
                Pilih atau sesuaikan pasal-pasal syarat umum/khusus SPK yang berlaku untuk kontrak pengadaan ini
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToDefaultClauses}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Muat ulang seluruh klausul ke standar baku resmi DPUPR Kab. Tegal"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Reset ke Format Baku ({activeSpkType === 'fisik' ? '31 Pasal' : `${(spkData.clauses || []).length} Pasal`})</span>
              </button>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {(spkData.clauses || []).filter(c => c.isActive).length}/{(spkData.clauses || []).length} Pasal Aktif
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {(spkData.clauses || []).map((clause) => (
              <div 
                key={clause.id} 
                className={`p-4 rounded-xl border transition-all ${
                  clause.isActive 
                    ? 'border-slate-300 bg-white shadow-2xs' 
                    : 'border-slate-200 bg-slate-50/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id={`chk-${clause.id}`}
                      checked={clause.isActive}
                      onChange={() => handleToggleClause(clause.id)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor={`chk-${clause.id}`} className="font-bold text-xs text-slate-800 cursor-pointer uppercase">
                      Pasal {clause.pasal}: {clause.judul}
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    clause.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {clause.isActive ? 'Digunakan' : 'Dinonaktifkan'}
                  </span>
                </div>

                {clause.isActive && (
                  <div className="mt-2">
                    <ClauseTextEditor
                      value={clause.isi}
                      onChange={(newVal) => handleUpdateClauseText(clause.id, newVal)}
                      minRows={4}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Informasi Penutup & Pengesahan Dokumen */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-xs text-blue-900 space-y-2 mt-4">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <FileText className="w-4 h-4 text-blue-700" />
              <span>Ketentuan Penutup & Pengesahan Tanda Tangan SPK (Standar DPUPR)</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-justify">
              Bagian Penutup Surat Perintah Kerja (meliputi pembuatan rangkap 3 bermaterai bagi Pejabat Penandatangan Kontrak dan Penyedia, masa berlaku efektif sesuai SPMK, kesepakatan tertulis Para Pihak, serta blok pengesahan tanda tangan ganda) secara otomatis disertakan pada bagian akhir dokumen pratinjau cetak dan ekspor Word (.doc) sesuai format dokumen fisik resmi DPUPR Kab. Tegal.
            </p>
          </div>
        </div>
      )}

      {/* MODE 3: PRATINJAU CETAK DOKUMEN RESMI */}
      {activeTabMode === 'preview' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs no-print">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Pratinjau berikut menampilkan format persis sesuai cetakan resmi kedinasan DPUPR Kabupaten Tegal.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportWord}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Download Dokumen SPK dalam format Word (.doc)"
              >
                <Download className="w-3.5 h-3.5" />
                Export Word (.doc)
              </button>
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Sekarang
              </button>
            </div>
          </div>

          <div className="bg-white p-0 rounded-none shadow-none border-0 w-full overflow-x-auto pb-4">
            <SpkPrintView spk={spkData} />
          </div>
        </div>
      )}

    </div>
  );
};
