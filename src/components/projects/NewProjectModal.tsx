import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStage, ProjectPackageDetail } from '../../types';
import { X, Building2, Plus, HardHat, ClipboardCheck, Compass, UserCheck } from 'lucide-react';
import { formatRibuan, parseRibuanKeAngka, formatRupiah } from '../../utils/formatters';
import { PpkSelectorDropdown } from '../common/PpkSelectorDropdown';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject } = useApp();

  // 1. Informasi Umum Proyek
  const [nama, setNama] = useState('');
  const [kodePaket, setKodePaket] = useState(`PBG-2026-00${Math.floor(Math.random() * 90) + 10}`);
  const [lokasi, setLokasi] = useState('');
  const [sumberDana, setSumberDana] = useState<'APBD Kab. Tegal' | 'DAK Fisik' | 'Banprov Jateng' | 'BLUD'>('APBD Kab. Tegal');
  const [tahunAnggaran, setTahunAnggaran] = useState<number>(2026);
  const [paguAnggaran, setPaguAnggaran] = useState<number>(3500000000);
  const [hps, setHps] = useState<number>(3400000000);
  const [stage, setStage] = useState<ProjectStage>('pelaksanaan');
  const [kategoriGedung, setKategoriGedung] = useState<Project['kategoriGedung']>('Fasilitas Kesehatan');
  const [deskripsi, setDeskripsi] = useState('');

  // 2. Data Acuan PPK
  const [isPpkAcuan, setIsPpkAcuan] = useState<boolean>(true);
  const [ppkNama, setPpkNama] = useState('Ahmad Fauzi, S.T., M.Eng.');
  const [ppkNip, setPpkNip] = useState('19820719 200604 1 009');
  const [ppkJabatan, setPpkJabatan] = useState('PPK Bidang Bangunan Gedung dan Permukiman');
  const [pptkNama, setPptkNama] = useState('Danang Prasetyo, S.T.');

  // 3. Paket Pekerjaan Fisik (Konstruksi)
  const [hasFisik, setHasFisik] = useState<boolean>(true);
  const [kontraktorNama, setKontraktorNama] = useState('');
  const [kontraktorDirektur, setKontraktorDirektur] = useState('');
  const [nilaiKontrakFisik, setNilaiKontrakFisik] = useState<number>(3250000000);
  const [nomorKontrakFisik, setNomorKontrakFisik] = useState('602.1/SP-FSK/05/DPUPR/2026');
  const [tanggalMulaiFisik, setTanggalMulaiFisik] = useState('2026-05-01');
  const [tanggalSelesaiFisik, setTanggalSelesaiFisik] = useState('2026-11-30');
  const [usePpkAcuanFisik, setUsePpkAcuanFisik] = useState<boolean>(true);
  const [customPpkNamaFisik, setCustomPpkNamaFisik] = useState('');
  const [customPpkNipFisik, setCustomPpkNipFisik] = useState('');
  const [customPpkJabatanFisik, setCustomPpkJabatanFisik] = useState('');

  // 4. Paket Konsultan Pengawas
  const [hasPengawas, setHasPengawas] = useState<boolean>(true);
  const [pengawasNama, setPengawasNama] = useState('');
  const [pengawasDirektur, setPengawasDirektur] = useState('');
  const [nilaiKontrakPengawas, setNilaiKontrakPengawas] = useState<number>(120000000);
  const [nomorKontrakPengawas, setNomorKontrakPengawas] = useState('602.1/SPK-PWS/05/DPUPR/2026');
  const [tanggalMulaiPengawas, setTanggalMulaiPengawas] = useState('2026-05-01');
  const [tanggalSelesaiPengawas, setTanggalSelesaiPengawas] = useState('2026-11-30');
  const [usePpkAcuanPengawas, setUsePpkAcuanPengawas] = useState<boolean>(true);
  const [customPpkNamaPengawas, setCustomPpkNamaPengawas] = useState('');
  const [customPpkNipPengawas, setCustomPpkNipPengawas] = useState('');
  const [customPpkJabatanPengawas, setCustomPpkJabatanPengawas] = useState('');

  // 5. Paket Konsultan Perencana
  const [hasPerencana, setHasPerencana] = useState<boolean>(false);
  const [perencanaNama, setPerencanaNama] = useState('');
  const [perencanaDirektur, setPerencanaDirektur] = useState('');
  const [nilaiKontrakPerencana, setNilaiKontrakPerencana] = useState<number>(95000000);
  const [nomorKontrakPerencana, setNomorKontrakPerencana] = useState('602.1/SPK-PRC/05/DPUPR/2026');
  const [tanggalMulaiPerencana, setTanggalMulaiPerencana] = useState('2026-03-01');
  const [tanggalSelesaiPerencana, setTanggalSelesaiPerencana] = useState('2026-04-15');
  const [usePpkAcuanPerencana, setUsePpkAcuanPerencana] = useState<boolean>(true);
  const [customPpkNamaPerencana, setCustomPpkNamaPerencana] = useState('');
  const [customPpkNipPerencana, setCustomPpkNipPerencana] = useState('');
  const [customPpkJabatanPerencana, setCustomPpkJabatanPerencana] = useState('');

  if (!isOpen) return null;

  // Total Nilai Kontrak Gabungan Paket yang Aktif
  const totalNilaiKontrak = 
    (hasFisik ? (nilaiKontrakFisik || 0) : 0) +
    (hasPengawas ? (nilaiKontrakPengawas || 0) : 0) +
    (hasPerencana ? (nilaiKontrakPerencana || 0) : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      alert('Mohon isi nama paket proyek.');
      return;
    }
    if (!lokasi.trim()) {
      alert('Mohon isi lokasi proyek.');
      return;
    }
    if (!hasFisik && !hasPengawas && !hasPerencana) {
      alert('Pilih minimal salah satu paket kontrak (Pekerjaan Fisik, Konsultan Pengawas, atau Konsultan Perencana).');
      return;
    }
    if (hasFisik && !kontraktorNama.trim()) {
      alert('Nama Kontraktor Pelaksana Fisik harus diisi karena paket fisik diaktifkan.');
      return;
    }
    if (hasPengawas && !pengawasNama.trim()) {
      alert('Nama Konsultan Pengawas harus diisi karena paket pengawasan diaktifkan.');
      return;
    }
    if (hasPerencana && !perencanaNama.trim()) {
      alert('Nama Konsultan Perencana harus diisi karena paket perencanaan diaktifkan.');
      return;
    }

    // Detail Paket Fisik
    const paketFisikDetail: ProjectPackageDetail | undefined = hasFisik ? {
      isActive: true,
      namaPerusahaan: kontraktorNama,
      namaDirektur: kontraktorDirektur,
      nilaiKontrak: Number(nilaiKontrakFisik),
      nomorKontrak: nomorKontrakFisik,
      tanggalMulai: tanggalMulaiFisik,
      tanggalSelesai: tanggalSelesaiFisik,
      durasiHari: 214,
      usePpkAcuan: usePpkAcuanFisik,
      ppkNama: usePpkAcuanFisik ? ppkNama : customPpkNamaFisik,
      ppkNip: usePpkAcuanFisik ? ppkNip : customPpkNipFisik,
      ppkJabatan: usePpkAcuanFisik ? ppkJabatan : customPpkJabatanFisik
    } : undefined;

    // Detail Paket Pengawas
    const paketPengawasDetail: ProjectPackageDetail | undefined = hasPengawas ? {
      isActive: true,
      namaPerusahaan: pengawasNama,
      namaDirektur: pengawasDirektur,
      nilaiKontrak: Number(nilaiKontrakPengawas),
      nomorKontrak: nomorKontrakPengawas,
      tanggalMulai: tanggalMulaiPengawas,
      tanggalSelesai: tanggalSelesaiPengawas,
      durasiHari: 214,
      usePpkAcuan: usePpkAcuanPengawas,
      ppkNama: usePpkAcuanPengawas ? ppkNama : customPpkNamaPengawas,
      ppkNip: usePpkAcuanPengawas ? ppkNip : customPpkNipPengawas,
      ppkJabatan: usePpkAcuanPengawas ? ppkJabatan : customPpkJabatanPengawas
    } : undefined;

    // Detail Paket Perencana
    const paketPerencanaDetail: ProjectPackageDetail | undefined = hasPerencana ? {
      isActive: true,
      namaPerusahaan: perencanaNama,
      namaDirektur: perencanaDirektur,
      nilaiKontrak: Number(nilaiKontrakPerencana),
      nomorKontrak: nomorKontrakPerencana,
      tanggalMulai: tanggalMulaiPerencana,
      tanggalSelesai: tanggalSelesaiPerencana,
      durasiHari: 45,
      usePpkAcuan: usePpkAcuanPerencana,
      ppkNama: usePpkAcuanPerencana ? ppkNama : customPpkNamaPerencana,
      ppkNip: usePpkAcuanPerencana ? ppkNip : customPpkNipPerencana,
      ppkJabatan: usePpkAcuanPerencana ? ppkJabatan : customPpkJabatanPerencana
    } : undefined;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      kodePaket,
      nama,
      lokasi,
      tahunAnggaran,
      sumberDana,
      paguAnggaran: Number(paguAnggaran),
      hps: Number(hps),
      nilaiKontrak: totalNilaiKontrak,
      isPpkAcuan,
      ppkNama,
      ppkNip,
      ppkJabatan,
      pptkNama,
      // Paket Fisik
      hasFisik,
      paketFisik: paketFisikDetail,
      kontraktorNama: hasFisik ? kontraktorNama : '-',
      kontraktorDirektur: hasFisik ? kontraktorDirektur : '-',
      nilaiKontrakFisik: hasFisik ? Number(nilaiKontrakFisik) : 0,
      nomorKontrakFisik: hasFisik ? nomorKontrakFisik : '-',
      // Paket Pengawas
      hasPengawas,
      paketPengawas: paketPengawasDetail,
      pengawasNama: hasPengawas ? pengawasNama : '-',
      pengawasDirektur: hasPengawas ? pengawasDirektur : '-',
      nilaiKontrakPengawas: hasPengawas ? Number(nilaiKontrakPengawas) : 0,
      nomorKontrakPengawas: hasPengawas ? nomorKontrakPengawas : '-',
      // Paket Perencana
      hasPerencana,
      paketPerencana: paketPerencanaDetail,
      perencanaNama: hasPerencana ? perencanaNama : '-',
      perencanaDirektur: hasPerencana ? perencanaDirektur : '-',
      nilaiKontrakPerencana: hasPerencana ? Number(nilaiKontrakPerencana) : 0,
      nomorKontrakPerencana: hasPerencana ? nomorKontrakPerencana : '-',
      // Waktu Proyek
      tanggalMulai: hasFisik ? tanggalMulaiFisik : (hasPengawas ? tanggalMulaiPengawas : tanggalMulaiPerencana),
      tanggalSelesai: hasFisik ? tanggalSelesaiFisik : (hasPengawas ? tanggalSelesaiPengawas : tanggalSelesaiPerencana),
      durasiHari: 214,
      masaPemeliharaanHari: 180,
      stage,
      progresFisikRencana: 0,
      progresFisikRealisasi: 0,
      progresKeuangan: 0,
      deskripsi: deskripsi || `Proyek pekerjaan gedung ${nama} di Kabupaten Tegal.`,
      kategoriGedung
    };

    addProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Tambah Paket Proyek Bangunan Gedung</h3>
              <p className="text-xs text-emerald-100">
                Struktur Modular: Paket Fisik, Konsultan Pengawas, & Konsultan Perencana
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* SECTION 1: INFORMASI UMUM PROYEK */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 font-bold text-slate-800 text-sm">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>1. Informasi Pokok Proyek Bangunan Gedung</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Paket</label>
                <input
                  type="text"
                  required
                  value={kodePaket}
                  onChange={e => setKodePaket(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Anggaran</label>
                <input
                  type="number"
                  value={tahunAnggaran}
                  onChange={e => setTahunAnggaran(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sumber Pembiayaan</label>
                <select
                  value={sumberDana}
                  onChange={e => setSumberDana(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="APBD Kab. Tegal">APBD Kab. Tegal</option>
                  <option value="DAK Fisik">DAK Fisik</option>
                  <option value="Banprov Jateng">Banprov Jateng</option>
                  <option value="BLUD">BLUD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Paket Proyek *</label>
              <input
                type="text"
                required
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Contoh: Pembangunan Gedung Rawat Inap 4 Lantai RSUD Suradadi"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Lokasi Proyek di Kab. Tegal *</label>
                <input
                  type="text"
                  required
                  value={lokasi}
                  onChange={e => setLokasi(e.target.value)}
                  placeholder="Jl. Raya Tegal - Pemalang Km. 12, Kec. Suradadi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Gedung</label>
                <select
                  value={kategoriGedung}
                  onChange={e => setKategoriGedung(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Fasilitas Kesehatan">Fasilitas Kesehatan</option>
                  <option value="Kantor Pemerintahan">Kantor Pemerintahan</option>
                  <option value="Pendidikan / Perpustakaan">Pendidikan / Perpustakaan</option>
                  <option value="Komersial / IKM">Komersial / IKM</option>
                  <option value="Ruang Terbuka Publik">Ruang Terbuka Publik</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pagu Anggaran Total (Rp)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={paguAnggaran ? formatRibuan(paguAnggaran) : ''}
                  onChange={e => setPaguAnggaran(parseRibuanKeAngka(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nilai HPS Total (Rp)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={hps ? formatRibuan(hps) : ''}
                  onChange={e => setHps(parseRibuanKeAngka(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tahap Siklus Proyek</label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-semibold capitalize"
                >
                  <option value="perencanaan">Perencanaan (DED / RAB)</option>
                  <option value="pelaksanaan">Pelaksanaan Fisik</option>
                  <option value="pemeliharaan">Pemeliharaan (Retensi / FHO)</option>
                  <option value="selesai">Selesai / Terverifikasi</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: DATA ACUAN PPK */}
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>2. Data Acuan Pejabat Pembuat Komitmen (PPK) Proyek</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-blue-300 shadow-2xs">
                <input
                  type="checkbox"
                  checked={isPpkAcuan}
                  onChange={e => setIsPpkAcuan(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>Jadikan Acuan Default untuk Seluruh Kontrak</span>
              </label>
            </div>

            <p className="text-[11px] text-slate-500">
              Data ini dapat ditarik secara otomatis sebagai PPK acuan ke paket Fisik, Pengawas, maupun Perencana, atau dapat diubah khusus per paket jika diperlukan.
            </p>

            {/* Quick Picker Master PPK */}
            <PpkSelectorDropdown
              selectedPpkNama={ppkNama}
              selectedPpkNip={ppkNip}
              onSelectPpk={(ppk) => {
                setPpkNama(ppk.nama);
                setPpkNip(ppk.nip);
                setPpkJabatan(ppk.jabatan);
              }}
              label="Tarik Data dari Master PPK DPUPR"
              helperText="Pilih nama PPK dari Master Data untuk mengisi Nama, NIP, dan Jabatan acuan proyek secara otomatis."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Lengkap PPK</label>
                <input
                  type="text"
                  value={ppkNama}
                  onChange={e => setPpkNama(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIP PPK</label>
                <input
                  type="text"
                  value={ppkNip}
                  onChange={e => setPpkNip(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Jabatan PPK</label>
                <input
                  type="text"
                  value={ppkJabatan}
                  onChange={e => setPpkJabatan(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama PPTK</label>
                <input
                  type="text"
                  value={pptkNama}
                  onChange={e => setPptkNama(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: 3 PILIHAN PAKET KONTRAK MODULAR */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">
                3. Komponen Paket Kontrak dalam Proyek Ini
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Centang paket yang diadakan pada proyek ini. Tidak harus diisi semua bila proyek ini hanya memiliki salah satu jenis kontrak.
              </p>
            </div>

            {/* CARD A: PEKERJAAN FISIK (KONSTRUKSI) */}
            <div className={`rounded-2xl border transition-all p-4 ${
              hasFisik ? 'border-emerald-300 bg-white shadow-sm' : 'border-slate-200 bg-slate-50/60 opacity-75'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFisik}
                    onChange={e => setHasFisik(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      A. Paket Pekerjaan Fisik / Pelaksanaan Konstruksi
                    </span>
                  </div>
                </label>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  hasFisik ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  {hasFisik ? 'Aktif dalam Proyek' : 'Tidak Ada Paket Fisik'}
                </span>
              </div>

              {hasFisik && (
                <div className="space-y-3 pt-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Penyedia Jasa Konstruksi (Kontraktor Pelaksana) *
                      </label>
                      <input
                        type="text"
                        required={hasFisik}
                        value={kontraktorNama}
                        onChange={e => setKontraktorNama(e.target.value)}
                        placeholder="Contoh: PT Wijaya Bangun Tegal Perkasa"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Direktur / Pimpinan Kontraktor
                      </label>
                      <input
                        type="text"
                        value={kontraktorDirektur}
                        onChange={e => setKontraktorDirektur(e.target.value)}
                        placeholder="Ir. Bambang Haryadi"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nilai Kontrak Fisik (Rp)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={nilaiKontrakFisik ? formatRibuan(nilaiKontrakFisik) : ''}
                        onChange={e => setNilaiKontrakFisik(parseRibuanKeAngka(e.target.value))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nomor Kontrak / SPK Fisik
                      </label>
                      <input
                        type="text"
                        value={nomorKontrakFisik}
                        onChange={e => setNomorKontrakFisik(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tgl Mulai</label>
                        <input
                          type="date"
                          value={tanggalMulaiFisik}
                          onChange={e => setTanggalMulaiFisik(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tgl Selesai</label>
                        <input
                          type="date"
                          value={tanggalSelesaiFisik}
                          onChange={e => setTanggalSelesaiFisik(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opsi PPK untuk Paket Fisik */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-600">Pejabat Pembuat Komitmen (PPK):</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                        <input
                          type="radio"
                          name="ppkFisikChoice"
                          checked={usePpkAcuanFisik}
                          onChange={() => setUsePpkAcuanFisik(true)}
                          className="text-emerald-600"
                        />
                        <span>Gunakan PPK Acuan Proyek ({ppkNama})</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                        <input
                          type="radio"
                          name="ppkFisikChoice"
                          checked={!usePpkAcuanFisik}
                          onChange={() => setUsePpkAcuanFisik(false)}
                          className="text-emerald-600"
                        />
                        <span>Isi PPK Sendiri (Kustom)</span>
                      </label>
                    </div>
                  </div>

                  {!usePpkAcuanFisik && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama PPK Khusus Fisik</label>
                        <input
                          type="text"
                          value={customPpkNamaFisik}
                          onChange={e => setCustomPpkNamaFisik(e.target.value)}
                          placeholder="Nama PPK kustom untuk fisik"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIP PPK Khusus Fisik</label>
                        <input
                          type="text"
                          value={customPpkNipFisik}
                          onChange={e => setCustomPpkNipFisik(e.target.value)}
                          placeholder="NIP kustom"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CARD B: KONSULTAN PENGAWAS */}
            <div className={`rounded-2xl border transition-all p-4 ${
              hasPengawas ? 'border-teal-300 bg-white shadow-sm' : 'border-slate-200 bg-slate-50/60 opacity-75'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPengawas}
                    onChange={e => setHasPengawas(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      B. Paket Jasa Konsultansi Pengawasan (Konsultan Pengawas)
                    </span>
                  </div>
                </label>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  hasPengawas ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  {hasPengawas ? 'Aktif dalam Proyek' : 'Tidak Ada Paket Pengawas'}
                </span>
              </div>

              {hasPengawas && (
                <div className="space-y-3 pt-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Konsultan Pengawas (PT / CV) *
                      </label>
                      <input
                        type="text"
                        required={hasPengawas}
                        value={pengawasNama}
                        onChange={e => setPengawasNama(e.target.value)}
                        placeholder="Contoh: PT Cipta Matra Mandiri"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Direktur / Team Leader Pengawas
                      </label>
                      <input
                        type="text"
                        value={pengawasDirektur}
                        onChange={e => setPengawasDirektur(e.target.value)}
                        placeholder="Hendra Kusuma, S.T."
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nilai Kontrak Pengawasan (Rp)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={nilaiKontrakPengawas ? formatRibuan(nilaiKontrakPengawas) : ''}
                        onChange={e => setNilaiKontrakPengawas(parseRibuanKeAngka(e.target.value))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-teal-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nomor Kontrak / SPK Pengawas
                      </label>
                      <input
                        type="text"
                        value={nomorKontrakPengawas}
                        onChange={e => setNomorKontrakPengawas(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tgl Mulai</label>
                        <input
                          type="date"
                          value={tanggalMulaiPengawas}
                          onChange={e => setTanggalMulaiPengawas(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tgl Selesai</label>
                        <input
                          type="date"
                          value={tanggalSelesaiPengawas}
                          onChange={e => setTanggalSelesaiPengawas(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opsi PPK untuk Pengawas */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-600">Pejabat Pembuat Komitmen (PPK):</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                        <input
                          type="radio"
                          name="ppkPengawasChoice"
                          checked={usePpkAcuanPengawas}
                          onChange={() => setUsePpkAcuanPengawas(true)}
                          className="text-teal-600"
                        />
                        <span>Gunakan PPK Acuan Proyek ({ppkNama})</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                        <input
                          type="radio"
                          name="ppkPengawasChoice"
                          checked={!usePpkAcuanPengawas}
                          onChange={() => setUsePpkAcuanPengawas(false)}
                          className="text-teal-600"
                        />
                        <span>Isi PPK Sendiri (Kustom)</span>
                      </label>
                    </div>
                  </div>

                  {!usePpkAcuanPengawas && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama PPK Khusus Pengawas</label>
                        <input
                          type="text"
                          value={customPpkNamaPengawas}
                          onChange={e => setCustomPpkNamaPengawas(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIP PPK Khusus Pengawas</label>
                        <input
                          type="text"
                          value={customPpkNipPengawas}
                          onChange={e => setCustomPpkNipPengawas(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CARD C: KONSULTAN PERENCANA */}
            <div className={`rounded-2xl border transition-all p-4 ${
              hasPerencana ? 'border-indigo-300 bg-white shadow-sm' : 'border-slate-200 bg-slate-50/60 opacity-75'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPerencana}
                    onChange={e => setHasPerencana(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      C. Paket Jasa Konsultansi Perencanaan (Konsultan Perencana DED)
                    </span>
                  </div>
                </label>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  hasPerencana ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  {hasPerencana ? 'Aktif dalam Proyek' : 'Tidak Ada Paket Perencana'}
                </span>
              </div>

              {hasPerencana && (
                <div className="space-y-3 pt-3 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Konsultan Perencana (PT / CV) *
                      </label>
                      <input
                        type="text"
                        required={hasPerencana}
                        value={perencanaNama}
                        onChange={e => setPerencanaNama(e.target.value)}
                        placeholder="Contoh: CV Arsitek Graha Desain Slawi"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Direktur / Team Leader Perencana
                      </label>
                      <input
                        type="text"
                        value={perencanaDirektur}
                        onChange={e => setPerencanaDirektur(e.target.value)}
                        placeholder="Aris Munandar, S.T., IAI"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nilai Kontrak Perencanaan (Rp)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={nilaiKontrakPerencana ? formatRibuan(nilaiKontrakPerencana) : ''}
                        onChange={e => setNilaiKontrakPerencana(parseRibuanKeAngka(e.target.value))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-indigo-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nomor Kontrak / SPK Perencana
                      </label>
                      <input
                        type="text"
                        value={nomorKontrakPerencana}
                        onChange={e => setNomorKontrakPerencana(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tgl Mulai</label>
                        <input
                          type="date"
                          value={tanggalMulaiPerencana}
                          onChange={e => setTanggalMulaiPerencana(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tgl Selesai</label>
                        <input
                          type="date"
                          value={tanggalSelesaiPerencana}
                          onChange={e => setTanggalSelesaiPerencana(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opsi PPK untuk Perencana */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-600">Pejabat Pembuat Komitmen (PPK):</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                        <input
                          type="radio"
                          name="ppkPerencanaChoice"
                          checked={usePpkAcuanPerencana}
                          onChange={() => setUsePpkAcuanPerencana(true)}
                          className="text-indigo-600"
                        />
                        <span>Gunakan PPK Acuan Proyek ({ppkNama})</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                        <input
                          type="radio"
                          name="ppkPerencanaChoice"
                          checked={!usePpkAcuanPerencana}
                          onChange={() => setUsePpkAcuanPerencana(false)}
                          className="text-indigo-600"
                        />
                        <span>Isi PPK Sendiri (Kustom)</span>
                      </label>
                    </div>
                  </div>

                  {!usePpkAcuanPerencana && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama PPK Khusus Perencana</label>
                        <input
                          type="text"
                          value={customPpkNamaPerencana}
                          onChange={e => setCustomPpkNamaPerencana(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIP PPK Khusus Perencana</label>
                        <input
                          type="text"
                          value={customPpkNipPerencana}
                          onChange={e => setCustomPpkNipPerencana(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* TOTAL KONTRAK SUMMARY */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Nilai Kontrak Seluruh Paket Terpilih:
              </span>
              <div className="text-lg font-black text-emerald-400">
                {formatRupiah(totalNilaiKontrak)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 text-right">
              <div>Fisik: {hasFisik ? formatRupiah(nilaiKontrakFisik || 0) : 'Tidak ada'}</div>
              <div>Pengawas: {hasPengawas ? formatRupiah(nilaiKontrakPengawas || 0) : 'Tidak ada'} | Perencana: {hasPerencana ? formatRupiah(nilaiKontrakPerencana || 0) : 'Tidak ada'}</div>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Simpan Paket Proyek
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
