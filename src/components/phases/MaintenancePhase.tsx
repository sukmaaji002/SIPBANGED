import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaintenanceIssue } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';
import { 
  Wrench, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  FileCheck, 
  Layers, 
  Building,
  HelpCircle
} from 'lucide-react';

export const MaintenancePhase: React.FC = () => {
  const { selectedProject, maintenanceIssues, addMaintenanceIssue, updateMaintenanceIssue, currentUser } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [deskripsiKerusakan, setDeskripsiKerusakan] = useState('');
  const [lokasiSpesifik, setLokasiSpesifik] = useState('');
  const [kategori, setKategori] = useState<MaintenanceIssue['kategori']>('Arsitektural');
  const [tenggatWaktu, setTenggatWaktu] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  if (!selectedProject) {
    return <div className="p-8 text-center text-slate-500">Pilih proyek terlebih dahulu.</div>;
  }

  const projectIssues = maintenanceIssues.filter(m => m.projectId === selectedProject.id);

  const canAddIssue = hasPermission(currentUser?.role, 'add_maintenance_issue');

  const nilaiRetensi = selectedProject.nilaiKontrak * 0.05;

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskripsiKerusakan || !lokasiSpesifik) return;

    const newIssue: MaintenanceIssue = {
      id: `maint-${Date.now()}`,
      projectId: selectedProject.id,
      tanggalLapor: new Date().toISOString().split('T')[0],
      deskripsiKerusakan,
      lokasiSpesifik,
      kategori,
      status: 'Menunggu Perbaikan',
      tenggatWaktu
    };

    addMaintenanceIssue(newIssue);
    setShowModal(false);
    setDeskripsiKerusakan('');
    setLokasiSpesifik('');
  };

  const handleStatusChange = (issue: MaintenanceIssue, newStatus: MaintenanceIssue['status']) => {
    updateMaintenanceIssue({
      ...issue,
      status: newStatus,
      tanggalSelesai: newStatus === 'Selesai Diperbaiki' || newStatus === 'Terverifikasi Tim Teknis' 
        ? new Date().toISOString().split('T')[0] 
        : undefined
    });
  };

  // SLF Checkpoints
  const slfItems = [
    { kriteria: 'Struktur Bangunan Gedung Bebas Lendutan & Retak Struktur Berbahaya', status: 'Lulus Uji Teknis' },
    { kriteria: 'Sistem Proteksi Kebakaran Aktif (Hydrant & APAR Siap Fungsi)', status: 'Lulus Uji Teknis' },
    { kriteria: 'Instalasi Penyalur Petir Teruji Tahanan Pembumian (< 5 Ohm)', status: 'Lulus Uji Teknis' },
    { kriteria: 'Kelayakan Sanitasi & Instalasi Pengolahan Air Limbah (IPAL)', status: 'Lulus Uji Teknis' },
    { kriteria: 'Fasilitas Aksesibilitas Ramah Disabilitas (Ramp & Toilet Khusus)', status: 'Sesuai Permen PUPR' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Phase Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 uppercase">
              Tahap 4: Pascakonstruksi & Pemeliharaan
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Defect Liability Period Menuju FHO
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Masa Pemeliharaan Bangunan Gedung (180 Hari)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paket: <strong className="text-slate-800">{selectedProject.nama}</strong> • Nilai Retensi Ditahan (5%): <strong className="text-emerald-700">{formatRupiah(nilaiRetensi)}</strong>
          </p>
        </div>

        <div>
          {canAddIssue ? (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Lapor Temuan Cacat Mutu
            </button>
          ) : (
            <div 
              className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
              title="Akses terbatas"
            >
              <Wrench className="w-3.5 h-3.5" />
              Lapor Cacat (Pengawas/PPK/Kontraktor)
            </div>
          )}
        </div>
      </div>

      {/* Info Cards: Retensi & Masa Pemeliharaan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span>Masa Pemeliharaan</span>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2">
            180 <span className="text-sm font-semibold text-slate-500">Hari Kalender</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Terhitung sejak penandatanganan Berita Acara PHO
          </p>
          <div className="mt-3 text-[10px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded inline-block">
            Sisa Waktu: ± 64 Hari Menuju FHO
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Uang Retensi Ditahan (5%)</span>
          </div>
          <div className="text-xl font-black text-emerald-600 mt-2">
            {formatRupiah(nilaiRetensi)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Dicairkan setelah Serah Terima Akhir Pekerjaan (FHO)
          </p>
          <div className="mt-3 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            Jaminan Pemeliharaan Bank Jateng Sah
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Sertifikat Laik Fungsi (SLF)</span>
          </div>
          <div className="text-base font-extrabold text-blue-900 mt-2">
            Siap Penerbitan SLF
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Pemeriksaan keandalan teknis oleh Tim Ahli Bangunan Gedung (TABG)
          </p>
          <div className="mt-3 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
            5 / 5 Parameter Terpenuhi
          </div>
        </div>

      </div>

      {/* Checklist Cacat Mutu Lapangan */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Daftar Temuan Cacat Mutu (Defect List) & Status Perbaikan
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {projectIssues.length} Temuan Terdaftar
          </span>
        </div>

        {projectIssues.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-400 opacity-60" />
            <p className="text-xs font-medium text-slate-600">Nihil temuan cacat mutu.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Seluruh bagian bangunan gedung dalam kondisi prima.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projectIssues.map((issue) => (
              <div key={issue.id} className="p-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {issue.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Dilaporkan: {issue.tanggalLapor}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      issue.status === 'Terverifikasi Tim Teknis' ? 'bg-emerald-100 text-emerald-800' :
                      issue.status === 'Selesai Diperbaiki' ? 'bg-teal-100 text-teal-800' :
                      issue.status === 'Sedang Dikerjakan' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {issue.deskripsiKerusakan}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Lokasi: <strong className="text-slate-700">{issue.lokasiSpesifik}</strong> • Tenggat Perbaikan: {issue.tenggatWaktu}
                  </p>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {issue.status !== 'Terverifikasi Tim Teknis' && (
                    <select
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue, e.target.value as any)}
                      className="text-xs font-semibold px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Menunggu Perbaikan">Menunggu Perbaikan</option>
                      <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                      <option value="Selesai Diperbaiki">Selesai Diperbaiki</option>
                      <option value="Terverifikasi Tim Teknis">Terverifikasi Tim Teknis</option>
                    </select>
                  )}
                  {issue.status === 'Terverifikasi Tim Teknis' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Selesai Tuntas
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Kelaikan Fungsi Bangunan Gedung (SLF) Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Checklist Kelaikan Fungsi Bangunan Gedung (SLF) - DPUPR Kab. Tegal
            </h3>
            <p className="text-xs text-slate-400">
              Persyaratan administratif dan teknis sebelum penyerahan aset gedung negara ke instansi pengguna
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
          {slfItems.map((item, idx) => (
            <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs hover:bg-slate-50">
              <span className="text-slate-800 font-medium">{item.kriteria}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lapor Cacat Mutu */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Lapor Temuan Cacat Mutu Lapangan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instruksi perbaikan kepada penyedia selama masa pemeliharaan 180 hari
            </p>

            <form onSubmit={handleAddIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Kerusakan *</label>
                <textarea
                  rows={2}
                  required
                  value={deskripsiKerusakan}
                  onChange={e => setDeskripsiKerusakan(e.target.value)}
                  placeholder="Contoh: Plafon gypsum rembes air pada sambungan jurai..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Spesifik Ruangan *</label>
                <input
                  type="text"
                  required
                  value={lokasiSpesifik}
                  onChange={e => setLokasiSpesifik(e.target.value)}
                  placeholder="Lantai 2 Koridor Timur Ruang ICU"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={e => setKategori(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Arsitektural">Arsitektural</option>
                    <option value="Struktural">Struktural</option>
                    <option value="Mekanikal/Elektrikal">Mekanikal/Elektrikal</option>
                    <option value="Sanitasi">Sanitasi / Plumbing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tenggat Perbaikan</label>
                  <input
                    type="date"
                    required
                    value={tenggatWaktu}
                    onChange={e => setTenggatWaktu(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg"
                >
                  Kirim Perintah Perbaikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

