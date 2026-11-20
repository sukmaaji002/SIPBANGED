import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MasterPpk } from '../../types';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Crown, 
  Building2, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  X, 
  Save, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

export const MasterPpkPage: React.FC = () => {
  const { 
    currentUser, 
    masterPpkList, 
    addMasterPpk, 
    updateMasterPpk, 
    deleteMasterPpk 
  } = useApp();

  const isMasterAdmin = currentUser?.role === 'master_admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'nonaktif'>('all');
  const [tahunFilter, setTahunFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPpk, setEditingPpk] = useState<MasterPpk | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // New PPK Form State
  const defaultNewPpk: Omit<MasterPpk, 'id'> = {
    nama: '',
    nip: '',
    jabatan: '',
    instansi: 'Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal',
    alamat: 'Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal – Kode Pos 52416',
    nomorSk: '07 Tahun 2026',
    tanggalSk: '2026-01-02',
    uraianSk: 'Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor 07 Tahun 2026 tentang Penetapan Pejabat Pembuat Komitmen di Lingkungan Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Tahun Anggaran 2026',
    tahunAnggaran: 2026,
    status: 'aktif',
    telepon: '',
    email: '',
    catatan: ''
  };

  const [newPpkData, setNewPpkData] = useState<Omit<MasterPpk, 'id'>>(defaultNewPpk);

  const showAlert = (msg: string) => {
    setAlertSuccess(msg);
    setTimeout(() => setAlertSuccess(null), 3500);
  };

  // Guard: Hanya Super Admin yang boleh akses
  if (!isMasterAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-rose-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Akses Terbatas: Super Admin Sahaja</h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Halaman pengelolaan <strong>Master Data PPK</strong> ini dilindungi dan hanya dapat dilihat serta diedit oleh akun dengan peran <strong>Super Administrator (Master Admin)</strong>. Pengguna lain hanya dapat memilih PPK yang telah terdaftar saat membuat Proyek, Kontrak, atau SPK.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
          <span>Peran Akun Anda Saat Ini:</span>
          <span className="capitalize px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
            {currentUser?.role || 'Guest'}
          </span>
        </div>
      </div>
    );
  }

  // Filter Data
  const filteredList = masterPpkList.filter(item => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorSk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.catatan && item.catatan.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesTahun = tahunFilter === 'all' || item.tahunAnggaran.toString() === tahunFilter;

    return matchesSearch && matchesStatus && matchesTahun;
  });

  const totalAktif = masterPpkList.filter(p => p.status === 'aktif').length;
  const totalNonaktif = masterPpkList.filter(p => p.status === 'nonaktif').length;

  const handleToggleStatus = (ppk: MasterPpk) => {
    const newStatus = ppk.status === 'aktif' ? 'nonaktif' : 'aktif';
    updateMasterPpk({ ...ppk, status: newStatus });
    showAlert(`Status PPK "${ppk.nama}" diubah menjadi ${newStatus === 'aktif' ? 'Aktif' : 'Non-Aktif'}.`);
  };

  const handleDelete = (ppk: MasterPpk) => {
    if (window.confirm(`Hapus permanen data PPK "${ppk.nama}" (NIP: ${ppk.nip}) dari Master Data?`)) {
      deleteMasterPpk(ppk.id);
      showAlert(`Data PPK "${ppk.nama}" berhasil dihapus.`);
    }
  };

  const handleCreatePpk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPpkData.nama.trim() || !newPpkData.nip.trim()) {
      alert('Nama lengkap dan NIP PPK wajib diisi.');
      return;
    }
    addMasterPpk(newPpkData);
    showAlert(`PPK baru "${newPpkData.nama}" berhasil ditambahkan ke Master Data!`);
    setIsAddModalOpen(false);
    setNewPpkData(defaultNewPpk);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPpk) return;
    if (!editingPpk.nama.trim() || !editingPpk.nip.trim()) {
      alert('Nama lengkap dan NIP PPK wajib diisi.');
      return;
    }
    updateMasterPpk(editingPpk);
    showAlert(`Data PPK "${editingPpk.nama}" berhasil diperbarui!`);
    setEditingPpk(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Banner */}
      {alertSuccess && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-2xl shadow-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950 uppercase tracking-wider shadow-xs">
                <Crown className="w-3.5 h-3.5" />
                Hak Akses Khusus: MASTER ADMIN
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">
                Pusat Master Data Pejabat Penandatangan Kontrak (PPK)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <UserCheck className="w-7 h-7 text-emerald-400" />
              <span>Master Data PPK DPUPR Kab. Tegal</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Kelola daftar resmi Pejabat Pembuat Komitmen (PPK). Data ini otomatis menjadi sumber tarik data satu-klik pada formulir Proyek Baru, Surat Perjanjian Kontrak, dan SPK Fisik/Pengawas/Perencana.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah PPK Baru</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Terdaftar</div>
            <div className="text-xl font-black text-white mt-0.5">{masterPpkList.length} Pejabat</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Status Aktif</div>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{totalAktif} PPK</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Non-Aktif / Arsip</div>
            <div className="text-xl font-black text-slate-300 mt-0.5">{totalNonaktif} PPK</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">Tahun Anggaran</div>
            <div className="text-xl font-black text-cyan-300 mt-0.5">TA 2026</div>
          </div>
        </div>
      </div>

      {/* Info Card Penggunaan */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 space-y-1">
          <p className="font-bold">Otomatisasi Tarik Data PPK:</p>
          <p className="text-blue-700 leading-relaxed">
            Data PPK berstatus <strong>Aktif</strong> yang Anda daftarkan di sini langsung tersedia pada dropdown pemilih cepat di menu <strong>Tambah Proyek Baru</strong>, <strong>Form Surat Perjanjian Kontrak (Bagian B)</strong>, dan <strong>Form SPK Fisik/Pengawas/Perencana (Pihak Pertama)</strong>. Pengguna lain tidak perlu mengetik ulang NIP, Jabatan, Nomor SK, maupun Redaksi SK pengangkatan.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama PPK, NIP, jabatan, SK..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Reset
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif Saja</option>
            <option value="nonaktif">Non-Aktif Saja</option>
          </select>

          <select
            value={tahunFilter}
            onChange={(e) => setTahunFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">Semua TA</option>
            <option value="2026">TA 2026</option>
            <option value="2025">TA 2025</option>
          </select>
        </div>
      </div>

      {/* Table / List PPK */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Daftar Resmi PPK DPUPR ({filteredList.length} Data)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Klik tombol aksi untuk edit data atau ubah status keaktifan
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada data PPK ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau bersihkan filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 min-w-[220px]">Nama Pejabat & NIP</th>
                  <th className="py-3 px-4 min-w-[260px]">Jabatan & Instansi</th>
                  <th className="py-3 px-4 min-w-[220px]">Dasar SK Pengangkatan</th>
                  <th className="py-3 px-4 min-w-[180px]">Alamat & Kontak</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((ppk, idx) => (
                  <tr key={ppk.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* No */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Nama & NIP */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-[13px] flex items-center gap-1.5">
                        <span>{ppk.nama}</span>
                        {ppk.id === 'ppk-1' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase">
                            Utama
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                        <span className="text-slate-400">NIP:</span>
                        <span>{ppk.nip}</span>
                      </div>
                      {ppk.catatan && (
                        <div className="text-[10px] text-slate-400 italic mt-1 max-w-xs line-clamp-1">
                          Catatan: {ppk.catatan}
                        </div>
                      )}
                    </td>

                    {/* Jabatan & Instansi */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 leading-snug">
                        {ppk.jabatan}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="line-clamp-1">{ppk.instansi}</span>
                      </div>
                    </td>

                    {/* Dasar SK */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50/60 px-2 py-0.5 rounded-md inline-block">
                        SK No: {ppk.nomorSk}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>Tgl: {ppk.tanggalSk} (TA {ppk.tahunAnggaran})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-tight" title={ppk.uraianSk}>
                        {ppk.uraianSk}
                      </div>
                    </td>

                    {/* Alamat & Kontak */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-600 flex items-start gap-1 line-clamp-2" title={ppk.alamat}>
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>{ppk.alamat}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 mt-1.5 text-[10px] text-slate-500">
                        {ppk.telepon && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {ppk.telepon}
                          </span>
                        )}
                        {ppk.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {ppk.email}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(ppk)}
                        title={`Klik untuk ubah status ke ${ppk.status === 'aktif' ? 'Non-Aktif' : 'Aktif'}`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          ppk.status === 'aktif' 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {ppk.status === 'aktif' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-500" />
                            <span>Non-Aktif</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditingPpk(ppk)}
                          title="Edit Lengkap PPK"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ppk)}
                          title="Hapus Data PPK"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL: TAMBAH PPK BARU
         ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tambah Pejabat PPK Baru</h3>
                  <p className="text-xs text-slate-500">Daftarkan data PPK resmi untuk digunakan di seluruh modul kontrak</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePpk} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap PPK beserta Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPpkData.nama}
                    onChange={(e) => setNewPpkData({ ...newPpkData, nama: e.target.value })}
                    placeholder="Contoh: Eko Karyanto, ST, MT."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP PPK (18 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPpkData.nip}
                    onChange={(e) => setNewPpkData({ ...newPpkData, nip: e.target.value })}
                    placeholder="19710620 199903 1 009"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan Kedinasan & Penugasan PPK *
                </label>
                <input
                  type="text"
                  required
                  value={newPpkData.jabatan}
                  onChange={(e) => setNewPpkData({ ...newPpkData, jabatan: e.target.value })}
                  placeholder="Plt. Kepala Bidang Penataan Bangunan, Lingkungan, dan Tata Ruang selaku Pejabat Pembuat Komitmen (PPK)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instansi / Dinas
                  </label>
                  <input
                    type="text"
                    value={newPpkData.instansi}
                    onChange={(e) => setNewPpkData({ ...newPpkData, instansi: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Anggaran & Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newPpkData.tahunAnggaran}
                      onChange={(e) => setNewPpkData({ ...newPpkData, tahunAnggaran: parseInt(e.target.value) || 2026 })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                    <select
                      value={newPpkData.status}
                      onChange={(e) => setNewPpkData({ ...newPpkData, status: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Kantor Kedudukan PPK
                </label>
                <input
                  type="text"
                  value={newPpkData.alamat}
                  onChange={(e) => setNewPpkData({ ...newPpkData, alamat: e.target.value })}
                  placeholder="Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal – Kode Pos 52416"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor SK Pengangkatan Kepala Dinas
                  </label>
                  <input
                    type="text"
                    value={newPpkData.nomorSk}
                    onChange={(e) => setNewPpkData({ ...newPpkData, nomorSk: e.target.value })}
                    placeholder="07 Tahun 2026 atau 800.1.2/015"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal SK Penetapan
                  </label>
                  <input
                    type="date"
                    value={newPpkData.tanggalSk}
                    onChange={(e) => setNewPpkData({ ...newPpkData, tanggalSk: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dasar SK Pengangkatan PPK (Redaksi Lengkap)
                </label>
                <textarea
                  rows={2}
                  value={newPpkData.uraianSk}
                  onChange={(e) => setNewPpkData({ ...newPpkData, uraianSk: e.target.value })}
                  placeholder="Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor 07 Tahun 2026 tentang Penetapan Pejabat Pembuat Komitmen di Lingkungan Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Tahun Anggaran 2026"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Kontak / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newPpkData.telepon || ''}
                    onChange={(e) => setNewPpkData({ ...newPpkData, telepon: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email Kedinasan
                  </label>
                  <input
                    type="email"
                    value={newPpkData.email || ''}
                    onChange={(e) => setNewPpkData({ ...newPpkData, email: e.target.value })}
                    placeholder="nama.ppk@dpupr-tegal.go.id"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  value={newPpkData.catatan || ''}
                  onChange={(e) => setNewPpkData({ ...newPpkData, catatan: e.target.value })}
                  placeholder="Contoh: PPK Proyek Gedung Kesehatan dan RSUD"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan ke Master Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT PPK
         ======================================================== */}
      {editingPpk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit Data PPK: {editingPpk.nama}</h3>
                  <p className="text-xs text-slate-500">Perbarui profil dan data legalitas SK pejabat pembuat komitmen</p>
                </div>
              </div>
              <button
                onClick={() => setEditingPpk(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap PPK beserta Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPpk.nama}
                    onChange={(e) => setEditingPpk({ ...editingPpk, nama: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP PPK *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPpk.nip}
                    onChange={(e) => setEditingPpk({ ...editingPpk, nip: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan Kedinasan & Penugasan PPK *
                </label>
                <input
                  type="text"
                  required
                  value={editingPpk.jabatan}
                  onChange={(e) => setEditingPpk({ ...editingPpk, jabatan: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instansi / Dinas
                  </label>
                  <input
                    type="text"
                    value={editingPpk.instansi}
                    onChange={(e) => setEditingPpk({ ...editingPpk, instansi: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Anggaran & Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editingPpk.tahunAnggaran}
                      onChange={(e) => setEditingPpk({ ...editingPpk, tahunAnggaran: parseInt(e.target.value) || 2026 })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                    <select
                      value={editingPpk.status}
                      onChange={(e) => setEditingPpk({ ...editingPpk, status: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Kantor Kedudukan PPK
                </label>
                <input
                  type="text"
                  value={editingPpk.alamat}
                  onChange={(e) => setEditingPpk({ ...editingPpk, alamat: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor SK Pengangkatan Kepala Dinas
                  </label>
                  <input
                    type="text"
                    value={editingPpk.nomorSk}
                    onChange={(e) => setEditingPpk({ ...editingPpk, nomorSk: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal SK Penetapan
                  </label>
                  <input
                    type="date"
                    value={editingPpk.tanggalSk}
                    onChange={(e) => setEditingPpk({ ...editingPpk, tanggalSk: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dasar SK Pengangkatan PPK (Redaksi Lengkap)
                </label>
                <textarea
                  rows={2}
                  value={editingPpk.uraianSk}
                  onChange={(e) => setEditingPpk({ ...editingPpk, uraianSk: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Kontak / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingPpk.telepon || ''}
                    onChange={(e) => setEditingPpk({ ...editingPpk, telepon: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email Kedinasan
                  </label>
                  <input
                    type="email"
                    value={editingPpk.email || ''}
                    onChange={(e) => setEditingPpk({ ...editingPpk, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  value={editingPpk.catatan || ''}
                  onChange={(e) => setEditingPpk({ ...editingPpk, catatan: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPpk(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

