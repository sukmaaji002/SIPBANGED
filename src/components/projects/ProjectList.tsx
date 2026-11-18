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
  ArrowRight
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

                {/* Location & Stakeholder */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{p.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="truncate">
                      Penyedia: <strong className="text-slate-800">{p.kontraktorNama}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                    <span className="truncate">
                      Pengawas: {p.pengawasNama}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      Jangka Waktu: {formatTanggalIndo(p.tanggalMulai)} s/d {formatTanggalIndo(p.tanggalSelesai)} ({p.durasiHari} Hari)
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold block">Nilai Kontrak</span>
                    <span className="font-extrabold text-slate-800 text-xs">
                      {formatRupiah(p.nilaiKontrak)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
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

