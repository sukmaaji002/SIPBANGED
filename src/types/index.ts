export type UserRole = 
  | 'master_admin' // Master Admin (Super Admin) - Akses tertinggi tanpa batas
  | 'admin'        // Admin Dinas DPUPR Kab Tegal
  | 'kabid'        // Kepala Bidang PBLTARU / KPA
  | 'ppk'          // PPK / PPTK Bidang Bangunan Gedung
  | 'perencana'    // Konsultan Perencana
  | 'kontraktor'   // Kontraktor Pelaksana Konstruksi
  | 'pengawas'     // Konsultan Pengawas / Tim Teknis
  | 'keuangan';    // Bendahara Pengeluaran / Staf Keuangan

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agency: string;
  nip?: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  avatar?: string;
}

export type ProjectStage = 'perencanaan' | 'pelaksanaan' | 'pengawasan' | 'pemeliharaan' | 'selesai';

export interface ProjectPackageDetail {
  isActive: boolean;
  namaPerusahaan: string;
  namaDirektur?: string;
  nilaiKontrak?: number;
  nomorKontrak?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  durasiHari?: number;
  usePpkAcuan: boolean;
  ppkNama?: string;
  ppkNip?: string;
  ppkJabatan?: string;
}

export interface Project {
  id: string;
  kodePaket: string;
  nama: string;
  lokasi: string;
  tahunAnggaran: number;
  sumberDana: 'APBD Kab. Tegal' | 'DAK Fisik' | 'Banprov Jateng' | 'BLUD';
  
  // Nilai Anggaran
  paguAnggaran: number;
  hps: number;
  nilaiKontrak: number;
  
  // Data Acuan PPK (Master Reference PPK)
  isPpkAcuan?: boolean; // Menandakan apakah data PPK ini dijadikan acuan proyek
  ppkNama: string;
  ppkNip: string;
  ppkJabatan?: string;
  pptkNama: string;
  
  // 1. Opsi & Data Paket Pekerjaan Fisik (Konstruksi)
  hasFisik?: boolean;
  paketFisik?: ProjectPackageDetail;
  kontraktorNama: string;
  kontraktorDirektur: string;
  nilaiKontrakFisik?: number;
  nomorKontrakFisik?: string;

  // 2. Opsi & Data Paket Konsultan Pengawas
  hasPengawas?: boolean;
  paketPengawas?: ProjectPackageDetail;
  pengawasNama: string;
  pengawasDirektur?: string;
  nilaiKontrakPengawas?: number;
  nomorKontrakPengawas?: string;

  // 3. Opsi & Data Paket Konsultan Perencana
  hasPerencana?: boolean;
  paketPerencana?: ProjectPackageDetail;
  perencanaNama: string;
  perencanaDirektur?: string;
  nilaiKontrakPerencana?: number;
  nomorKontrakPerencana?: string;
  
  // Waktu
  tanggalMulai: string;
  tanggalSelesai: string;
  durasiHari: number;
  masaPemeliharaanHari: number;
  
  stage: ProjectStage;
  progresFisikRencana: number;
  progresFisikRealisasi: number;
  progresKeuangan: number;
  
  deskripsi: string;
  kategoriGedung: 'Fasilitas Kesehatan' | 'Kantor Pemerintahan' | 'Pendidikan / Perpustakaan' | 'Komersial / IKM' | 'Ruang Terbuka Publik';
}

// 1. TAHAP PERENCANAAN
export interface PlanningDocument {
  id: string;
  projectId: string;
  title: string;
  category: 'DED' | 'RAB' | 'RKS' | 'KAK' | 'Spesifikasi Teknis' | 'Laporan Tanah / Sondir';
  fileUrl?: string;
  version: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'Draft' | 'Asistensi' | 'Disetujui PPK';
  notes: string;
}

// 2. TAHAP PELAKSANAAN
export interface WeeklyProgress {
  id: string;
  projectId: string;
  mingguKe: number | string;
  labelMinggu?: string;
  periodeMulai: string;
  periodeSelesai: string;
  tanggalLaporan?: string;
  bobotRencana: number;
  bobotRealisasi: number;
  kumulatifRencana: number;
  kumulatifRealisasi: number;
  deviasi: number;
  kondisiCuaca: 'Cerah Mayoritas' | 'Hujan Ringan' | 'Hujan Lebat / Banjir' | 'Bervariasi';
  jumlahTenagaKerja: number;
  materialMasuk: string;
  alatBeratDigunakan: string;
  kendalaLapangan: string;
  solusiTindakan: string;
  addendumId?: string;
  targetKontrakAwal?: number;
  lampiranDokumen?: ProgressAttachment[];
  fotoDokumentasi: {
    caption: string;
    stage: '0%' | '25%' | '50%' | '75%' | '100%';
    url: string;
    tanggal: string;
  }[];
}

export interface ProgressAttachment {
  id: string;
  namaFile: string;
  tipe: 'excel' | 'pdf' | 'gambar' | 'lainnya';
  ukuranBytes?: number;
  ukuranFormatted?: string;
  fileData?: string; // Data URL Base64 untuk preview dan download langsung
  fileUrl?: string;
  kategori: 'Kurva S & Jadwal (Excel)' | 'Laporan Fisik Mingguan (PDF)' | 'Opname Bersama & BAP' | 'Dokumentasi Lapangan' | 'Hasil Uji Lab & Mutu' | 'Lainnya';
  uploadDate: string;
  keterangan?: string;
}

export interface ScheduleAddendumPoint {
  mingguKe: number | string;
  targetKumulatif: number;
  bobotTarget?: number;
  tanggalMulai?: string;
  tanggalSelesai?: string;
}

export interface ScheduleAddendum {
  id: string;
  projectId: string;
  nomorAddendum: string; // Misal: "Kontrak Awal", "Addendum 01", "Addendum 02"
  judul: string; // Misal: "Perpanjangan Waktu Pelaksanaan 14 Hari & CCO Penataan Struktur"
  tanggal: string; // Tanggal penetapan adendum
  jenisPerubahan: 'Kontrak Awal' | 'Perpanjangan Waktu' | 'Pekerjaan Tambah Kurang (CCO)' | 'Perubahan Desain' | 'Waktu dan Biaya';
  nomorSurat: string;
  durasiHariBaru?: number;
  tanggalSelesaiBaru?: string;
  nilaiKontrakBaru?: number;
  alasan: string;
  warnaGaris: string; // Hex color code untuk kurva S pada chart
  isAktif: boolean; // Apakah menjadi jadwal acuan aktif saat ini
  isKontrakAwal?: boolean; // Penanda kurva S awal / baseline original
  targetMingguan: ScheduleAddendumPoint[];
}

// 3. TAHAP PENGAWASAN
export interface SupervisionLog {
  id: string;
  projectId: string;
  tanggal: string;
  pengawasNama: string;
  catatanTeknis: string;
  instruksiLapangan?: string;
  hasilUjiMutu?: {
    item: string;
    standar: string;
    hasilUji: string;
    status: 'Memenuhi Syarat' | 'Tidak Memenuhi Syarat';
  }[];
  peringatanSCM?: 'Normal' | 'SCM 1 (Kritis Ringan)' | 'SCM 2 (Kritis Sedang)' | 'SCM 3 (Ancaman Putus Kontrak)';
  statusApproval: 'Disetujui Pengawas' | 'Perlu Perbaikan Kontraktor' | 'Pending';
}

// 4. TAHAP PEMELIHARAAN
export interface MaintenanceIssue {
  id: string;
  projectId: string;
  tanggalLapor: string;
  deskripsiKerusakan: string;
  lokasiSpesifik: string;
  kategori: 'Struktural' | 'Arsitektural' | 'Mekanikal/Elektrikal' | 'Sanitasi';
  fotoKerusakan?: string;
  status: 'Menunggu Perbaikan' | 'Sedang Dikerjakan' | 'Selesai Diperbaiki' | 'Terverifikasi Tim Teknis';
  tenggatWaktu: string;
  tanggalSelesai?: string;
}

// KONTRAK LKPP DPUPR KABUPATEN TEGAL (Lengkap Per Proyek)
export interface ContractClause {
  id: string;
  pasal: number | string;
  judul: string;
  kategori: 'Surat Perjanjian' | 'SSUK (Syarat Umum)' | 'SSKK (Syarat Khusus)' | 'Lampiran A' | 'Lampiran B (RKK)';
  kontenDefault: string;
  kontenCustom?: string;
  isActive: boolean; // Dapat dipilih / centang
  isEditable: boolean;
  keteranganPerlem: string;
}

export interface PersonelManajerialItem {
  id: string;
  nama: string;
  jabatan: string;
  pendidikan: string;
  pengalamanTahun: number;
  sertifikatKompetensi: string;
  keterangan: string;
}

export interface PeralatanUtamaItem {
  id: string;
  nama: string;
  merekTipe: string;
  kapasitas: string;
  jumlah: string;
  kondisi: string;
  statusKepemilikan: string;
  keterangan: string;
}

export interface SubkontraktorItem {
  id: string;
  bagianPekerjaan: string;
  namaSubkon: string;
  alamatSubkon: string;
  kualifikasiSubkon: string;
  keterangan: string;
}

export interface HargaSatuanTimpangItem {
  id: string;
  mataPembayaran: string;
  satuanUkuran: string;
  kuantitas: string;
  hpsRp: number;
  penawaranRp: number;
  persenTerhadapHps: string;
  keterangan: string;
}

export interface IBPRPItem {
  id: string;
  uraianPekerjaan: string;
  identifikasiBahaya: string;
  jenisBahaya: string;
  pengendalianAwal: string;
  tingkatRisiko: 'Kecil' | 'Sedang' | 'Besar';
  pengendalianLanjutan: string;
}

export interface ProjectContract {
  id: string;
  projectId: string;
  
  // 1. SURAT PERJANJIAN
  namaPaket: string;
  nomorSurat: string;
  hari: string;
  tanggal: string; // YYYY-MM-DD
  tanggalTeks?: string; // misal "dua puluh" atau "20"
  bulanTeks?: string; // misal "Februari"
  tahunAngka?: number | string; // misal 2026
  tanggalBulanTahunAngka?: string; // misal "20-02-2026"
  nomorSPPBJ: string;
  tanggalSPPBJ: string;
  metodePemilihan?: string;
  jenisKontrak: 'Harga Satuan' | 'Lumsum' | 'Gabungan Lumsum dan Harga Satuan';
  
  // Pejabat Penandatangan Kontrak (PPK)
  ppkNama: string;
  ppkNip: string;
  ppkJabatan: string;
  ppkKedudukan: string;
  ppkNomorSK: string;
  ppkTahunSK: number;
  ppkTanggalSK: string;
  ppkTahunAnggaran: number;
  
  // Penyedia Jasa Konstruksi
  penyediaNamaDirektur: string;
  penyediaJabatan: string;
  penyediaNamaBadanUsaha: string;
  penyediaKedudukan: string;
  penyediaAktaNomor: string;
  penyediaAktaTanggal: string;
  penyediaAktaNotaris: string;
  
  // Harga Kontrak & Pembayaran
  nilaiKontrakAngka: number;
  nilaiKontrakTerbilang: string;
  kodeAkunKegiatan: string;
  sumberPembiayaan: string;
  bankNamaDanCabang: string;
  nomorRekeningPenyedia: string;
  namaRekeningPenyedia: string;
  
  // Ruang Lingkup Utama
  ruangLingkupUtama: string[];
  
  // Masa Kontrak
  jangkaWaktuPelaksanaanHari: number;
  jangkaWaktuPelaksanaanHuruf: string;
  jangkaWaktuPemeliharaanHari: number;
  jangkaWaktuPemeliharaanHuruf: string;
  
  // 2. PARAMETER SSKK
  sskkEmailPPK: string;
  sskkEmailPenyedia: string;
  sskkWhatsappPenyedia: string;
  sskkFaksimiliPenyedia: string;
  sskkWakilSahPPK: string;
  sskkWakilSahPenyedia: string;
  sskkPencairanJaminan: string;
  sskkUangMukaKetentuan: string;
  sskkPembayaranCara: string;
  sskkTermin1Fisik: number; // 30%
  sskkTermin1Bayar: number; // 25%
  sskkTermin2Fisik: number; // 55%
  sskkTermin2Bayar: number; // 25%
  sskkTermin3Fisik: number; // 80%
  sskkTermin3Bayar: number; // 25%
  sskkTermin4Fisik: number; // 100%
  sskkTermin4Bayar: number; // 25%
  sskkDendaKeterlambatan: string;
  sskkUmurKonstruksiTahun: number; // 50
  sskkPertanggunganKegagalanTahun: number; // 10
  sskkPenyelesaianSengketa: string;
  
  // 3. LAMPIRAN A SSKK
  hargaSatuanTimpang: HargaSatuanTimpangItem[];
  subkontraktorUtama: SubkontraktorItem[];
  subkontraktorNonUtama: SubkontraktorItem[];
  personelManajerial: PersonelManajerialItem[];
  peralatanUtama: PeralatanUtamaItem[];
  
  // 4. LAMPIRAN B SSKK (RKK & K3)
  rkkNamaWakilSah: string;
  rkkJabatanWakilSah: string;
  rkkTanggalKomitmen: string;
  rkkTabelIBPRP: IBPRPItem[];

  // 5. KLAUSUL MODULAR PER PROYEK
  clauses: ContractClause[];
  status: 'Draft' | 'Review Legal' | 'Ditandatangani PPK & Penyedia';
}

// BERITA ACARA
export type BAType = 
  | 'BAPLK'      // Berita Acara Penyerahan Lokasi Kerja
  | 'SPMK'       // Surat Perintah Mulai Kerja
  | 'PCM'        // Pre-Construction Meeting
  | 'MC-0'       // Mutual Check 0%
  | 'OPNAME'     // Pemeriksaan Kemajuan Pekerjaan Fisik
  | 'BAP-TERMIN' // Berita Acara Pembayaran Termin / Uang Muka
  | 'PHO'        // Serah Terima Pertama (Provisional Hand Over)
  | 'CACAT-MUTU' // Berita Acara Pemeriksaan Cacat Mutu
  | 'FHO';       // Serah Terima Akhir (Final Hand Over)

export interface BeritaAcara {
  id: string;
  projectId: string;
  tipe: BAType;
  nomorSurat: string;
  judul: string;
  tanggal: string;
  tempat: string;
  deskripsiPekerjaan: string;
  
  // Data spesifik
  progresFisikPersen?: number;
  nilaiPembayaran?: number;
  terminKe?: number;
  catatanHasilPemeriksaan: string[];
  rekomendasi: string;
  
  // Pihak yang bertanda tangan
  pihakPertama: {
    nama: string;
    jabatan: string;
    nip?: string;
    instansi: string;
  };
  pihakKedua: {
    nama: string;
    jabatan: string;
    perusahaan: string;
  };
  timPemeriksa?: {
    nama: string;
    jabatan: string;
    peran: string;
  }[];
  
  status: 'Draft' | 'Ditinjau Pengawas' | 'Disahkan PPK' | 'Final';
}

// PENGELOLAAN KEUANGAN
export interface PaymentTerm {
  id: string;
  projectId: string;
  tahapPembayaran: 'Uang Muka' | 'Termin 1' | 'Termin 2' | 'Termin 3' | 'Termin 4' | 'Pelunasan 100%' | 'Retensi 5%';
  terminKe?: number;
  syaratProgresFisik: number;
  progresFisikAktual: number;
  
  nilaiTagihanKotor: number;
  potonganUangMuka: number;
  potonganRetensi: number;
  potonganPPN: number;
  potonganPPh: number;
  potonganDenda?: number;
  nilaiBersihDibayar: number;
  
  nomorSPP?: string;
  tanggalSPP?: string;
  nomorSPM?: string;
  tanggalSPM?: string;
  nomorSP2D?: string;
  tanggalSP2D?: string;
  
  status: 'Pengajuan' | 'Verifikasi Dokumen' | 'SPM Terbit' | 'SP2D Cair';
  keterangan: string;
}

// SPK (SURAT PERINTAH KERJA) MODULAR
export type ContractDocType = 'perjanjian' | 'spk';
export type SpkType = 'fisik' | 'pengawas' | 'perencana';

export interface SpkPersonelItem {
  id: string;
  nama: string;
  posisi: string;
  kualifikasi: string;
  sertifikat?: string;
}

export interface SpkClauseItem {
  id: string;
  pasal: number | string;
  judul: string;
  isi: string;
  isActive: boolean;
}

export interface SpkContract {
  id: string;
  projectId: string;
  spkType: SpkType;
  
  // Header SPK
  nomorSpk: string;
  tanggalSpk: string; // YYYY-MM-DD
  hariSpk?: string;
  tanggalTeksSpk?: string;
  bulanTeksSpk?: string;
  tahunSpk?: number | string;
  
  // Dasar Pengadaan
  nomorSppbj?: string;
  tanggalSppbj?: string;
  metodePengadaan: 'Pengadaan Langsung' | 'E-Purchasing' | 'Tender / Seleksi' | 'Penunjukan Langsung';
  
  // PPK
  ppkNama: string;
  ppkNip: string;
  ppkJabatan: string;
  ppkAlamat: string;
  ppkNomorSk?: string;
  ppkTahunAnggaran: number;
  
  // Penyedia / Konsultan
  penyediaNamaBadanUsaha: string;
  penyediaBentukUsaha: 'PT' | 'CV' | 'Perseorangan' | 'Koperasi';
  penyediaNamaPimpinan: string;
  penyediaJabatanPimpinan: string;
  penyediaAlamat: string;
  penyediaNpwp: string;
  penyediaBank: string;
  penyediaNomorRekening: string;
  penyediaNamaRekening: string;
  
  // Paket Pengadaan
  namaPaket: string;
  lokasiPekerjaan: string;
  tahunAnggaran: number;
  sumberDana: string;
  kodeRekeningKegiatan: string;
  
  // Nilai & Waktu
  nilaiKontrak: number;
  nilaiKontrakTerbilang: string;
  termasukPpn: boolean;
  jangkaWaktuHari: number;
  jangkaWaktuHuruf?: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  masaPemeliharaanHari?: number; // Terutama untuk Fisik
  masaPemeliharaanHuruf?: string;
  
  // Sistem Pembayaran & Sanksi
  sistemPembayaran: 'Sekaligus (100% setelah selesai & PHO)' | 'Termin / Prestasi Kerja' | 'Bulanan (Monthly Certificate)';
  keteranganPembayaran: string;
  dendaKeterlambatan: string;
  
  // Ruang Lingkup
  ruangLingkup: string[];
  
  // Personel / Tenaga Ahli
  personelList: SpkPersonelItem[];
  
  // Dokumen Keluaran / Laporan (Khusus Pengawas & Perencana)
  keluaranHasil?: string[];
  
  // Klausul Syarat-Syarat SPK
  clauses: SpkClauseItem[];
  
  status: 'Draft' | 'Review Legal' | 'Ditandatangani PPK & Penyedia';
}

