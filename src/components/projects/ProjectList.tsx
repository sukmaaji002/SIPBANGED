import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatTanggalIndo } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Shield, 
  TrendingUp, 
  Coins,
  ArrowRight,
  HardHat,
  ClipboardCheck,
  Compass
} from 'lucide-react';
import { NewProjectModal } from './NewProjectModal';
import { ActiveTab } from '../layout/Sidebar';

interface ProjectListProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onNavigate }) => {
  const { projects, selectedProjectId, setSelectedProjectId, currentUser } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const canCreateProject = hasPermission(currentUser?.role, 'create_project');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kodePaket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kontraktorNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || p.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Katalog Proyek Bangunan Gedung Kab. Tegal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data paket pekerjaan konstruksi Bidang Penataan Bangunan dan Lingkungan, Tata Ruang (PBLTARU)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCreateProject ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Tambah Paket Proyek
            </button>
          ) : (
            <div 
              className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
              title="Hanya PPK / Admin yang berwenang menambah paket proyek"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Tambah Proyek (Perlu Akses PPK/Admin)</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama gedung, nomor paket, kontraktor, atau kecamatan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Siklus:</span>
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700"
          >
            <option value="all">Semua Tahapan ({projects.length})</option>
            <option value="perencanaan">Perencanaan</option>
            <option value="pelaksanaan">Pelaksanaan</option>
            <option value="pemeliharaan">Pemeliharaan</option>
            <option value="selesai">Selesai / FHO</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((p) => {
          const isSelected = p.id === selectedProjectId;
          const deviasi = p.progresFisikRealisasi - p.progresFisikRencana;
          const isAhead = deviasi >= 0;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                      {p.kodePaket}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {p.sumberDana} • {p.tahunAnggaran}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    p.stage === 'pelaksanaan' ? 'bg-amber-100 text-amber-800' :
                    p.stage === 'pemeliharaan' ? 'bg-cyan-100 text-cyan-800' :
                    p.stage === 'perencanaan' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    Tahap {p.stage}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-slate-900 text-sm mt-3 leading-snug">
                  {p.nama}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {p.deskripsi}
                </p>

                {/* Lokasi & PPK Acuan */}
                <div className="mt-3 flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[55%]">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{p.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 truncate">
                    <UserCheck className="w-3 h-3 flex-shrink-0 text-blue-600" />
                    <span className="truncate font-semibold">PPK: {p.ppkNama?.split(',')[0]}</span>
                  </div>
                </div>

                {/* 3 Komponen Paket Kontrak dalam Proyek (Fisik, Pengawas, Perencana) */}
                <div className="mt-2.5 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Paket Kontrak Proyek:
                  </div>

                  {/* 1. Paket Fisik */}
                  <div className={`p-2 rounded-xl border text-xs transition-all ${
                    p.hasFisik !== false && p.kontraktorNama && p.kontraktorNama !== '-'
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200/80 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 font-bold truncate">
                        <HardHat className={`w-3.5 h-3.5 flex-shrink-0 ${p.hasFisik !== false && p.kontraktorNama && p.kontraktorNama !== '-' ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-[11px] text-slate-700">Fisik:</span>
                        <span className="text-[11px] truncate font-extrabold text-slate-900">
                          {p.hasFisik !== false && p.kontraktorNama && p.kontraktorNama !== '-' ? p.kontraktorNama : 'Tidak Ada Paket Fisik'}
                        </span>
                      </div>
                      {p.hasFisik !== false && p.kontraktorNama && p.kontraktorNama !== '-' ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                          {formatRupiah(p.nilaiKontrakFisik || p.nilaiKontrak)}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded flex-shrink-0">Nonaktif</span>
                      )}
                    </div>
                  </div>

                  {/* 2. Konsultan Pengawas */}
                  <div className={`p-2 rounded-xl border text-xs transition-all ${
                    p.hasPengawas !== false && p.pengawasNama && p.pengawasNama !== '-'
                      ? 'bg-teal-50/50 border-teal-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200/80 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 font-bold truncate">
                        <ClipboardCheck className={`w-3.5 h-3.5 flex-shrink-0 ${p.hasPengawas !== false && p.pengawasNama && p.pengawasNama !== '-' ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span className="text-[11px] text-slate-700">Pengawas:</span>
                        <span className="text-[11px] truncate font-extrabold text-slate-900">
                          {p.hasPengawas !== false && p.pengawasNama && p.pengawasNama !== '-' ? p.pengawasNama : 'Tidak Ada Paket Pengawas'}
                        </span>
                      </div>
                      {p.hasPengawas !== false && p.pengawasNama && p.pengawasNama !== '-' ? (
                        <span className="text-[10px] font-mono font-bold text-teal-700 bg-white px-1.5 py-0.5 rounded border border-teal-200 flex-shrink-0">
                          {formatRupiah(p.nilaiKontrakPengawas || Math.round(p.nilaiKontrak * 0.035))}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded flex-shrink-0">Nonaktif</span>
                      )}
                    </div>
                  </div>

                  {/* 3. Konsultan Perencana */}
                  <div className={`p-2 rounded-xl border text-xs transition-all ${
                    p.hasPerencana !== false && p.perencanaNama && p.perencanaNama !== '-'
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200/80 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 font-bold truncate">
                        <Compass className={`w-3.5 h-3.5 flex-shrink-0 ${p.hasPerencana !== false && p.perencanaNama && p.perencanaNama !== '-' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-[11px] text-slate-700">Perencana:</span>
                        <span className="text-[11px] truncate font-extrabold text-slate-900">
                          {p.hasPerencana !== false && p.perencanaNama && p.perencanaNama !== '-' ? p.perencanaNama : 'Tidak Ada Paket Perencana'}
                        </span>
                      </div>
                      {p.hasPerencana !== false && p.perencanaNama && p.perencanaNama !== '-' ? (
                        <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200 flex-shrink-0">
                          {formatRupiah(p.nilaiKontrakPerencana || Math.round(p.nilaiKontrak * 0.045))}
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded flex-shrink-0">Nonaktif</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Total Kontrak Proyek</span>
                    <span className="font-extrabold text-emerald-700 text-xs">
                      {formatRupiah(p.nilaiKontrak)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Pagu Anggaran</span>
                    <span className="font-bold text-slate-600 text-xs">
                      {formatRupiah(p.paguAnggaran)}
                    </span>
                  </div>
                </div>

                {/* Progress Fisik */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Progres Fisik: {p.progresFisikRealisasi}%</span>
                    </div>
                    <span className={`text-[10px] font-bold ${isAhead ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Deviasi: {isAhead ? `+${deviasi.toFixed(1)}%` : `${deviasi.toFixed(1)}%`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAhead ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, p.progresFisikRealisasi)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedProjectId(p.id);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? '✓ Proyek Terpilih' : 'Pilih Proyek Ini'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      onNavigate('kontrak');
                    }}
                    className="text-xs px-2.5 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold rounded-lg transition-colors"
                    title="Lihat & Edit Kontrak LKPP"
                  >
                    Kontrak
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      onNavigate('berita-acara');
                    }}
                    className="text-xs px-2.5 py-1.5 text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold rounded-lg transition-colors"
                    title="Lihat & Buat Berita Acara"
                  >
                    Berita Acara
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      onNavigate('pelaksanaan');
                    }}
                    className="text-xs px-2.5 py-1.5 text-white bg-slate-800 hover:bg-slate-900 font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    Detail <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};

