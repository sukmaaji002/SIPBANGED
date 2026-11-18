import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  Building2, 
  TrendingUp, 
  Coins, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar';

interface ExecutiveSummaryProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ onNavigate }) => {
  const { projects, payments, currentUser, setSelectedProjectId } = useApp();

  const totalPagu = projects.reduce((acc, p) => acc + p.paguAnggaran, 0);
  const totalKontrak = projects.reduce((acc, p) => acc + p.nilaiKontrak, 0);
  const totalEfisiensi = totalPagu - totalKontrak; // Sisa Tender / Efisiensi Anggaran
  const avgProgresFisik = projects.length > 0 
    ? (projects.reduce((acc, p) => acc + p.progresFisikRealisasi, 0) / projects.length).toFixed(1)
    : '0';

  // Total Realisasi Keuangan Cair (SP2D)
  const totalCair = payments
    .filter(p => p.status === 'SP2D Cair')
    .reduce((acc, p) => acc + p.nilaiBersihDibayar, 0);

  const serapanPersen = totalKontrak > 0 ? ((totalCair / totalKontrak) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      
      {/* Top Banner DPUPR Kab Tegal */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Sistem Informasi Penyelenggaraan Bangunan Gedung (SIPBANGED)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Monitoring Penyelenggaraan Bangunan Gedung Kab. Tegal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Bidang Penataan Bangunan dan Lingkungan, Tata Ruang (PBLTARU) Dinas Pekerjaan Umum dan Penataan Ruang. Pengelolaan siklus proyek: Perencanaan (DED/RAB), Pelaksanaan, Pengawasan, Pemeliharaan, Kontrak LKPP Perlem 12/2021, Berita Acara, serta Keuangan Kas Proyek.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('projects')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Lihat Semua Proyek
            </button>
            <button
              onClick={() => onNavigate('kontrak')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all border border-white/20 flex items-center gap-2 backdrop-blur-xs"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              Kontrak Modular LKPP
            </button>
            <button
              onClick={() => onNavigate('keuangan')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all border border-white/20 flex items-center gap-2 backdrop-blur-xs"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              Arus Kas & SP2D
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pagu Anggaran
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-800 mt-2">
            {formatRupiah(totalPagu)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Nilai Kontrak:</span>
            <span className="font-semibold text-slate-700">{formatRupiah(totalKontrak)}</span>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            Efisiensi Tender: {formatRupiah(totalEfisiensi)}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Rata-rata Fisik Riil
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {avgProgresFisik}%
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${avgProgresFisik}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Dari {projects.length} paket pekerjaan aktif
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Serapan Kas SP2D
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-800 mt-2">
            {formatRupiah(totalCair)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Rasio Serapan:</span>
            <span className="font-bold text-amber-600">{serapanPersen}%</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            Terverifikasi BPKAD Kab. Tegal
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Status Siklus Gedung
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-50 p-1.5 rounded-lg text-center">
              <div className="text-xs font-bold text-indigo-700">
                {projects.filter(p => p.stage === 'perencanaan').length}
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Perencanaan</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg text-center">
              <div className="text-xs font-bold text-amber-700">
                {projects.filter(p => p.stage === 'pelaksanaan').length}
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Pelaksanaan</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg text-center">
              <div className="text-xs font-bold text-cyan-700">
                {projects.filter(p => p.stage === 'pemeliharaan').length}
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Pemeliharaan</div>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg text-center">
              <div className="text-xs font-bold text-emerald-700">
                {projects.filter(p => p.stage === 'selesai').length}
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Selesai/FHO</div>
            </div>
          </div>
        </div>

      </div>

      {/* Projects Highlights Table & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Project Progress Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Ringkasan Paket Pekerjaan Bangunan Gedung
              </h2>
              <p className="text-xs text-slate-400">
                Klik salah satu paket untuk membuka detail teknis & keuangan
              </p>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Lihat Detail <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => {
              const deviasi = proj.progresFisikRealisasi - proj.progresFisikRencana;
              const isAhead = deviasi >= 0;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    onNavigate('pelaksanaan');
                  }}
                  className="p-4 rounded-xl border border-slate-200/70 hover:border-emerald-500/50 hover:bg-slate-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {proj.kodePaket}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          proj.stage === 'pelaksanaan' ? 'bg-amber-100 text-amber-800' :
                          proj.stage === 'pemeliharaan' ? 'bg-cyan-100 text-cyan-800' :
                          proj.stage === 'perencanaan' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          Tahap {proj.stage.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm mt-1.5 group-hover:text-emerald-600 transition-colors">
                        {proj.nama}
                      </h3>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Penyedia: <strong className="text-slate-700">{proj.kontraktorNama}</strong></span>
                        <span>•</span>
                        <span>{proj.lokasi}</span>
                      </div>
                    </div>

                    <div className="text-right sm:min-w-[140px]">
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-xs text-slate-400">Fisik:</span>
                        <span className="text-base font-extrabold text-slate-900">
                          {proj.progresFisikRealisasi}%
                        </span>
                      </div>
                      <div className="text-[10px] flex items-center justify-end gap-1">
                        <span className="text-slate-400">Deviasi:</span>
                        <span className={`font-bold ${isAhead ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isAhead ? `+${deviasi.toFixed(1)}%` : `${deviasi.toFixed(1)}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAhead ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, proj.progresFisikRealisasi)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quick Feature Navigation & RBAC Notice */}
        <div className="space-y-4">
          
          {/* User Session Info Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              STATUS LOGIN & AKSES
            </div>
            <div className="font-bold text-sm text-white">
              {currentUser?.name || 'Tamu / Belum Login'}
            </div>
            <div className="text-xs text-emerald-300 font-medium">
              Peran: {currentUser ? currentUser.role.toUpperCase() : '-'}
            </div>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              Anda dapat menguji pembatasan hak akses setiap aktor (Admin, Kabid, PPK, Kontraktor, Pengawas, Perencana, Keuangan) lewat menu drop-down di pojok kanan atas.
            </p>
            <button
              onClick={() => onNavigate('rbac-matrix')}
              className="mt-3 w-full py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors"
            >
              Cek Matriks Hak Akses (RBAC)
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              Akses Cepat Modul
            </h3>

            <button
              onClick={() => onNavigate('kontrak')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-blue-600">
                    Kontrak LKPP Modular
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Pilih klausul, edit teks, cetak PDF
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => onNavigate('berita-acara')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-purple-600">
                    Generator Berita Acara
                  </div>
                  <div className="text-[10px] text-slate-400">
                    SPMK, MC-0, BAP, PHO, FHO
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            <button
              onClick={() => onNavigate('keuangan')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-600">
                    Pengelolaan Keuangan
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Uang muka, termin, retensi, SP2D
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

