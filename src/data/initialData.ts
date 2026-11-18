import { 
  User, 
  Project, 
  PlanningDocument, 
  WeeklyProgress, 
  SupervisionLog, 
  MaintenanceIssue, 
  ProjectContract, 
  BeritaAcara, 
  PaymentTerm,
  ScheduleAddendum,
  ProgressAttachment 
} from '../types';
import { DEFAULT_LKPP_CLAUSES } from './lkppClauses';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Administrator Bidang PBLTARU',
    email: 'admin@dpupr-tegal.go.id',
    role: 'admin',
    agency: 'DPUPR Kabupaten Tegal',
    nip: '19840215 200801 1 003',
    phone: '0812-2834-9988',
    status: 'active'
  },
  {
    id: 'user-kabid',
    name: 'Ir. H. Teguh Santoso, S.T., M.T.',
    email: 'kabid.pbltaru@dpupr-tegal.go.id',
    role: 'kabid',
    agency: 'DPUPR Kabupaten Tegal',
    nip: '19760412 200112 1 002',
    phone: '0813-9021-3445',
    status: 'active'
  },
  {
    id: 'user-ppk',
    name: 'Ahmad Fauzi, S.T., M.Eng.',
    email: 'ppk.gedung@dpupr-tegal.go.id',
    role: 'ppk',
    agency: 'DPUPR Kabupaten Tegal',
    nip: '19820719 200604 1 009',
    phone: '0857-4100-8822',
    status: 'active'
  },
  {
    id: 'user-kontraktor',
    name: 'Ir. Bambang Haryadi (Direktur)',
    email: 'kontraktor@wijayabangun.co.id',
    role: 'kontraktor',
    agency: 'PT Wijaya Bangun Tegal Perkasa',
    phone: '0811-2678-900',
    status: 'active'
  },
  {
    id: 'user-pengawas',
    name: 'Hendra Kusuma, S.T. (Team Leader)',
    email: 'pengawas@ciptamatra.co.id',
    role: 'pengawas',
    agency: 'PT Cipta Matra Mandiri',
    phone: '0818-0234-5561',
    status: 'active'
  },
  {
    id: 'user-perencana',
    name: 'Rahmat Hidayat, S.T., IAI',
    email: 'perencana@arsitekgraha.co.id',
    role: 'perencana',
    agency: 'CV Arsitek Graha Desain Slawi',
    phone: '0878-3011-4470',
    status: 'active'
  },
  {
    id: 'user-keuangan',
    name: 'Siti Nurul Aini, S.E.',
    email: 'keuangan@dpupr-tegal.go.id',
    role: 'keuangan',
    agency: 'Sub Bagian Keuangan DPUPR Kab. Tegal',
    nip: '19890520 201202 2 004',
    phone: '0821-3345-6677',
    status: 'active'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    kodePaket: 'PBG-2026-001',
    nama: 'Pembangunan Gedung Rawat Inap 4 Lantai RSUD Suradadi Tahap II',
    lokasi: 'Jl. Raya Tegal - Pemalang Km. 12, Kec. Suradadi, Kab. Tegal',
    tahunAnggaran: 2026,
    sumberDana: 'APBD Kab. Tegal',
    paguAnggaran: 14850000000,
    hps: 14620000000,
    nilaiKontrak: 13920000000,
    ppkNama: 'Ahmad Fauzi, S.T., M.Eng.',
    ppkNip: '19820719 200604 1 009',
    pptkNama: 'Danang Prasetyo, S.T.',
    kontraktorNama: 'PT Wijaya Bangun Tegal Perkasa',
    kontraktorDirektur: 'Ir. Bambang Haryadi',
    pengawasNama: 'PT Cipta Matra Mandiri',
    perencanaNama: 'CV Arsitek Graha Desain Slawi',
    tanggalMulai: '2026-03-01',
    tanggalSelesai: '2026-10-31',
    durasiHari: 245,
    masaPemeliharaanHari: 180,
    stage: 'pelaksanaan',
    progresFisikRencana: 66.2,
    progresFisikRealisasi: 68.5,
    progresKeuangan: 50.0,
    deskripsi: 'Pembangunan struktur utama beton bertulang 4 lantai, finishing arsitektur fasad modern, instalasi gas medik dan tata udara rumah sakit.',
    kategoriGedung: 'Fasilitas Kesehatan'
  },
  {
    id: 'proj-2',
    kodePaket: 'PBG-2026-002',
    nama: 'Rehabilitasi dan Penataan Gedung Kantor DPUPR Kabupaten Tegal',
    lokasi: 'Jl. Cut Nyak Dien No. 13, Kalisapu, Slawi, Kab. Tegal',
    tahunAnggaran: 2026,
    sumberDana: 'APBD Kab. Tegal',
    paguAnggaran: 2500000000,
    hps: 2450000000,
    nilaiKontrak: 2340000000,
    ppkNama: 'Ahmad Fauzi, S.T., M.Eng.',
    ppkNip: '19820719 200604 1 009',
    pptkNama: 'Eko Wibowo, S.T.',
    kontraktorNama: 'CV Bahari Jaya Sentosa Slawi',
    kontraktorDirektur: 'M. Syarifuddin',
    pengawasNama: 'CV Graha Cipta Engineering',
    perencanaNama: 'CV Studio Garis Rancangan',
    tanggalMulai: '2026-04-15',
    tanggalSelesai: '2026-09-15',
    durasiHari: 150,
    masaPemeliharaanHari: 180,
    stage: 'pelaksanaan',
    progresFisikRencana: 92.0,
    progresFisikRealisasi: 94.0,
    progresKeuangan: 70.0,
    deskripsi: 'Renovasi aula pertemuan, ruang pelayanan perizinan tata ruang dan gedung, penggantian atap rangka baja ringan, dan fasad ramah disabilitas.',
    kategoriGedung: 'Kantor Pemerintahan'
  },
  {
    id: 'proj-3',
    kodePaket: 'PBG-2025-008',
    nama: 'Pembangunan Gedung Layanan Perpustakaan Daerah Kabupaten Tegal',
    lokasi: 'Kawasan Perkantoran Pemkab Tegal, Slawi Kulon, Slawi',
    tahunAnggaran: 2025,
    sumberDana: 'DAK Fisik',
    paguAnggaran: 8200000000,
    hps: 8050000000,
    nilaiKontrak: 7750000000,
    ppkNama: 'Ahmad Fauzi, S.T., M.Eng.',
    ppkNip: '19820719 200604 1 009',
    pptkNama: 'Danang Prasetyo, S.T.',
    kontraktorNama: 'PT Karya Graha Pratama',
    kontraktorDirektur: 'Ir. Hendro Wijanarko',
    pengawasNama: 'PT Trimatra Dinamika',
    perencanaNama: 'PT Rekacipta Konsultan',
    tanggalMulai: '2025-05-01',
    tanggalSelesai: '2025-12-15',
    durasiHari: 225,
    masaPemeliharaanHari: 180,
    stage: 'pemeliharaan',
    progresFisikRencana: 100.0,
    progresFisikRealisasi: 100.0,
    progresKeuangan: 95.0,
    deskripsi: 'Gedung perpustakaan 2 lantai dengan fasilitas digital reading room, auditorium anak, dan akses difabel modern.',
    kategoriGedung: 'Pendidikan / Perpustakaan'
  },
  {
    id: 'proj-4',
    kodePaket: 'PBG-2026-004',
    nama: 'Pembangunan Sentra Promosi Produk Unggulan IKM Slawi Mandiri',
    lokasi: 'Jl. Ahmad Yani No. 45, Procot, Kec. Slawi, Kab. Tegal',
    tahunAnggaran: 2026,
    sumberDana: 'Banprov Jateng',
    paguAnggaran: 4100000000,
    hps: 4000000000,
    nilaiKontrak: 3880000000,
    ppkNama: 'Ahmad Fauzi, S.T., M.Eng.',
    ppkNip: '19820719 200604 1 009',
    pptkNama: 'Eko Wibowo, S.T.',
    kontraktorNama: 'Tahap Persiapan Tender',
    kontraktorDirektur: '-',
    pengawasNama: 'Tahap Pemilihan',
    perencanaNama: 'CV Arsitek Graha Desain Slawi',
    tanggalMulai: '2026-08-01',
    tanggalSelesai: '2026-12-20',
    durasiHari: 140,
    masaPemeliharaanHari: 180,
    stage: 'perencanaan',
    progresFisikRencana: 0.0,
    progresFisikRealisasi: 0.0,
    progresKeuangan: 0.0,
    deskripsi: 'Sentra etalase produk IKM logam Slawi, kerajinan tenun, kuliner teh poci khas Tegal, dilengkapi ruang workshop dan inkubator bisnis.',
    kategoriGedung: 'Komersial / IKM'
  }
];

export const INITIAL_PLANNING_DOCS: PlanningDocument[] = [
  {
    id: 'plan-1',
    projectId: 'proj-1',
    title: 'Gambar Detail Engineering Design (DED) Arsitektur & Struktur Lantai 1-4',
    category: 'DED',
    version: 'Rev-02 Final',
    uploadedBy: 'CV Arsitek Graha Desain Slawi',
    uploadDate: '2026-02-10',
    status: 'Disetujui PPK',
    notes: 'Sudah disesuaikan dengan hasil rekomendasi Tim Ahli Bangunan Gedung (TABG) Kab. Tegal.'
  },
  {
    id: 'plan-2',
    projectId: 'proj-1',
    title: 'Rencana Anggaran Biaya (RAB) Hasil Perhitungan Kebutuhan Volume Riil',
    category: 'RAB',
    version: 'Final Nilai HPS',
    uploadedBy: 'CV Arsitek Graha Desain Slawi',
    uploadDate: '2026-02-14',
    status: 'Disetujui PPK',
    notes: 'Mengacu pada Standar Harga Satuan (SHS) Kabupaten Tegal Tahun Anggaran 2026.'
  },
  {
    id: 'plan-3',
    projectId: 'proj-1',
    title: 'Rencana Kerja dan Syarat-Syarat (RKS) & Spesifikasi Teknis Material',
    category: 'RKS',
    version: 'v1.0',
    uploadedBy: 'CV Arsitek Graha Desain Slawi',
    uploadDate: '2026-02-15',
    status: 'Disetujui PPK',
    notes: 'Ketentuan uji mutu beton Ready Mix fc 25 MPa dan baja tulangan SNI BjTS 420B.'
  },
  {
    id: 'plan-4',
    projectId: 'proj-4',
    title: 'Draft Konsep DED Desain Fasad Sentra IKM Slawi Bernuansa Kearifan Lokal',
    category: 'DED',
    version: 'Draft 1',
    uploadedBy: 'CV Arsitek Graha Desain Slawi',
    uploadDate: '2026-07-02',
    status: 'Asistensi',
    notes: 'Menunggu asistensi lanjutan bersama Kepala Bidang PBLTARU dan Disperinkop Kab. Tegal.'
  }
];

export const INITIAL_PROGRESS: WeeklyProgress[] = [
  {
    id: 'prog-1',
    projectId: 'proj-1',
    mingguKe: 20,
    periodeMulai: '2026-07-15',
    periodeSelesai: '2026-07-21',
    bobotRencana: 3.2,
    bobotRealisasi: 3.5,
    kumulatifRencana: 66.2,
    kumulatifRealisasi: 68.5,
    deviasi: 2.3,
    kondisiCuaca: 'Cerah Mayoritas',
    jumlahTenagaKerja: 48,
    materialMasuk: 'Ready Mix K-300 volume 45 m3, Pasir Pasang 6 dump truck, Bata Ringan 32 m3',
    alatBeratDigunakan: 'Tower Crane 1 unit, Concrete Pump 1 unit, Bar Bender & Cutter 2 set',
    kendalaLapangan: 'Keterlambatan suplai pipa instalasi sanitasi selama 1 hari kerja, telah diatasi dengan lembur pada hari Sabtu.',
    solusiTindakan: 'Penambahan regu kerja malam untuk pekerjaan plesteran dan instalasi pipa.',
    fotoDokumentasi: [
      {
        caption: 'Pengecoran Balok dan Plat Lantai 3 Sisi Utara',
        stage: '50%',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        tanggal: '2026-07-18'
      },
      {
        caption: 'Pemasangan Dinding Bata Ringan dan Kusen Aluminium',
        stage: '75%',
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
        tanggal: '2026-07-20'
      }
    ],
    lampiranDokumen: [
      {
        id: 'att-1-1',
        namaFile: 'Rekap_Kurva_S_Opname_M20.xlsx',
        tipe: 'excel',
        ukuranBytes: 1468006,
        ukuranFormatted: '1.4 MB',
        kategori: 'Kurva S & Jadwal (Excel)',
        uploadDate: '2026-07-21',
        keterangan: 'Lembar perhitungan opname volume bobot fisik minggu ke-20'
      },
      {
        id: 'att-1-2',
        namaFile: 'Laporan_Mingguan_M20_RSUD_Soeselo.pdf',
        tipe: 'pdf',
        ukuranBytes: 3355443,
        ukuranFormatted: '3.2 MB',
        kategori: 'Laporan Fisik Mingguan (PDF)',
        uploadDate: '2026-07-21',
        keterangan: 'Laporan mingguan resmi bertanda tangan Konsultan Supervisi & Kontraktor'
      },
      {
        id: 'att-1-3',
        namaFile: 'Foto_Opname_Pengecoran_Plat_L3.jpg',
        tipe: 'gambar',
        ukuranBytes: 2202009,
        ukuranFormatted: '2.1 MB',
        fileUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1200&q=80',
        kategori: 'Dokumentasi Lapangan',
        uploadDate: '2026-07-20',
        keterangan: 'Dokumentasi pengecoran plat lantai 3 zona A'
      }
    ]
  },
  {
    id: 'prog-2',
    projectId: 'proj-1',
    mingguKe: 19,
    periodeMulai: '2026-07-08',
    periodeSelesai: '2026-07-14',
    bobotRencana: 3.1,
    bobotRealisasi: 3.4,
    kumulatifRencana: 63.0,
    kumulatifRealisasi: 65.0,
    deviasi: 2.0,
    kondisiCuaca: 'Cerah Mayoritas',
    jumlahTenagaKerja: 45,
    materialMasuk: 'Besi Beton Ulir 16 mm dan 13 mm total 12 ton, Semen Gresik 250 zak',
    alatBeratDigunakan: 'Tower Crane 1 unit, Hoist lift bahan',
    kendalaLapangan: 'Nihil',
    solusiTindakan: 'Pekerjaan berjalan lancar sesuai master schedule.',
    fotoDokumentasi: [
      {
        caption: 'Perakitan Pembesian Kolom Praktis Lantai 3',
        stage: '50%',
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
        tanggal: '2026-07-11'
      }
    ],
    lampiranDokumen: [
      {
        id: 'att-2-1',
        namaFile: 'Laporan_Mingguan_M19_RSUD_Soeselo.pdf',
        tipe: 'pdf',
        ukuranBytes: 2936012,
        ukuranFormatted: '2.8 MB',
        kategori: 'Laporan Fisik Mingguan (PDF)',
        uploadDate: '2026-07-14',
        keterangan: 'Laporan mingguan ke-19 diverifikasi PPTK DPUPR'
      },
      {
        id: 'att-2-2',
        namaFile: 'Kurva_S_Target_Realisasi_M19.xlsx',
        tipe: 'excel',
        ukuranBytes: 1258291,
        ukuranFormatted: '1.2 MB',
        kategori: 'Kurva S & Jadwal (Excel)',
        uploadDate: '2026-07-14',
        keterangan: 'Sheet kurva S progres minggu ke-19'
      }
    ]
  }
];

export const INITIAL_SCHEDULE_ADDENDUMS: ScheduleAddendum[] = [
  {
    id: 'add-orig-proj-1',
    projectId: 'proj-1',
    nomorAddendum: 'Kontrak Awal',
    judul: 'Kurva S Rencana Pelaksanaan Original (Baseline Master)',
    tanggal: '2026-03-01',
    jenisPerubahan: 'Kontrak Awal',
    nomorSurat: '600.2/01/SP-KTR/RSUD-SLW/2026',
    alasan: 'Jadwal rencana pelaksanaan kontrak awal 214 hari kalender.',
    warnaGaris: '#94a3b8', // Abu-abu
    isAktif: false,
    isKontrakAwal: true,
    targetMingguan: [
      { mingguKe: 'M-1', targetKumulatif: 2.0, bobotTarget: 2.0 },
      { mingguKe: 'M-4', targetKumulatif: 10.5, bobotTarget: 8.5 },
      { mingguKe: 'M-8', targetKumulatif: 24.0, bobotTarget: 13.5 },
      { mingguKe: 'M-12', targetKumulatif: 40.0, bobotTarget: 16.0 },
      { mingguKe: 'M-16', targetKumulatif: 54.0, bobotTarget: 14.0 },
      { mingguKe: 'M-19', targetKumulatif: 63.0, bobotTarget: 9.0 },
      { mingguKe: 'M-20', targetKumulatif: 66.2, bobotTarget: 3.2 },
      { mingguKe: 'M-24', targetKumulatif: 80.0, bobotTarget: 13.8 },
      { mingguKe: 'M-28', targetKumulatif: 92.0, bobotTarget: 12.0 },
      { mingguKe: 'M-30', targetKumulatif: 100.0, bobotTarget: 8.0 },
    ]
  },
  {
    id: 'add-01-proj-1',
    projectId: 'proj-1',
    nomorAddendum: 'Addendum 01',
    judul: 'CCO-1 Perkuatan Plat Basement & Perpanjangan Waktu Pelaksanaan 14 Hari',
    tanggal: '2026-06-15',
    jenisPerubahan: 'Waktu dan Biaya',
    nomorSurat: '600.2/ADD-01/RSUD-SLW/2026',
    durasiHariBaru: 228,
    tanggalSelesaiBaru: '2026-12-14',
    nilaiKontrakBaru: 3320000000,
    alasan: 'Penyesuaian elevasi muka air tanah tinggi serta penambahan pekerjaan tulangan plat lantai 2 berdasarkan BAP Rapat Lapangan No. 600/BA-04/2026.',
    warnaGaris: '#3b82f6', // Biru
    isAktif: true,
    isKontrakAwal: false,
    targetMingguan: [
      { mingguKe: 'M-1', targetKumulatif: 2.0, bobotTarget: 2.0 },
      { mingguKe: 'M-4', targetKumulatif: 9.8, bobotTarget: 7.8 },
      { mingguKe: 'M-8', targetKumulatif: 22.5, bobotTarget: 12.7 },
      { mingguKe: 'M-12', targetKumulatif: 38.0, bobotTarget: 15.5 },
      { mingguKe: 'M-16', targetKumulatif: 52.0, bobotTarget: 14.0 },
      { mingguKe: 'M-19', targetKumulatif: 61.5, bobotTarget: 9.5 },
      { mingguKe: 'M-20', targetKumulatif: 65.0, bobotTarget: 3.5 },
      { mingguKe: 'M-21', targetKumulatif: 69.7, bobotTarget: 4.7 },
      { mingguKe: 'M-24', targetKumulatif: 77.0, bobotTarget: 7.3 },
      { mingguKe: 'M-28', targetKumulatif: 88.0, bobotTarget: 11.0 },
      { mingguKe: 'M-32', targetKumulatif: 100.0, bobotTarget: 12.0 },
    ]
  }
];

export const INITIAL_SUPERVISION_LOGS: SupervisionLog[] = [
  {
    id: 'sup-1',
    projectId: 'proj-1',
    tanggal: '2026-07-19',
    pengawasNama: 'Hendra Kusuma, S.T. (PT Cipta Matra Mandiri)',
    catatanTeknis: 'Pengecoran plat lantai 3 berjalan sesuai metode kerja. Seluruh bekisting telah diperiksa ketegakannya dan terpasang beton decking dengan tebal selimut 2.5 cm.',
    instruksiLapangan: 'Kontraktor diwajibkan melakukan curing (perawatan beton) dengan pembasahan berkala minimal 7 hari berturut-turut.',
    hasilUjiMutu: [
      {
        item: 'Slump Test Beton Ready Mix',
        standar: '12 ± 2 cm',
        hasilUji: '11.5 cm',
        status: 'Memenuhi Syarat'
      },
      {
        item: 'Uji Kuat Tekan Beton Silinder Umur 7 Hari',
        standar: 'min 65% fc 25 MPa (16.25 MPa)',
        hasilUji: '18.4 MPa',
        status: 'Memenuhi Syarat'
      }
    ],
    peringatanSCM: 'Normal',
    statusApproval: 'Disetujui Pengawas'
  }
];

export const INITIAL_MAINTENANCE_ISSUES: MaintenanceIssue[] = [
  {
    id: 'maint-1',
    projectId: 'proj-3',
    tanggalLapor: '2026-02-15',
    deskripsiKerusakan: 'Ditemukan retak rambut pada plesteran dinding ruang baca anak lantai 1 dan 1 unit stop kontak tidak menyala.',
    lokasiSpesifik: 'Ruang Baca Anak Sayap Barat, Lantai 1',
    kategori: 'Arsitektural',
    status: 'Selesai Diperbaiki',
    tenggatWaktu: '2026-02-28',
    tanggalSelesai: '2026-02-25'
  },
  {
    id: 'maint-2',
    projectId: 'proj-3',
    tanggalLapor: '2026-04-10',
    deskripsiKerusakan: 'Rembesan air kecil pada talang jurai atap ketika hujan deras mengguyur area Slawi.',
    lokasiSpesifik: 'Atap Skylight Bagian Tengah',
    kategori: 'Arsitektural',
    status: 'Terverifikasi Tim Teknis',
    tenggatWaktu: '2026-04-24',
    tanggalSelesai: '2026-04-20'
  }
];

export const INITIAL_CONTRACTS: ProjectContract[] = [
  {
    id: 'ct-1',
    projectId: 'proj-1',
    namaPaket: 'Pembangunan Gedung Rawat Inap 4 Lantai RSUD Suradadi Tahap II',
    nomorSurat: '600.1.1/045/KTR-PBG/PBLTARU/DPUPR/2026',
    hari: 'Jumat',
    tanggal: '2026-02-28',
    nomorSPPBJ: '600.1.1/038/SPPBJ/PBLTARU/2026',
    tanggalSPPBJ: '2026-02-20',
    jenisKontrak: 'Harga Satuan',
    ppkNama: 'Ahmad Fauzi, S.T., M.Eng.',
    ppkNip: '19820719 200604 1 009',
    ppkJabatan: 'Pejabat Pembuat Komitmen (PPK) Bidang Penataan Bangunan dan Lingkungan, Tata Ruang',
    ppkKedudukan: 'Jl. Cut Nyak Dien, Kalisapu, Slawi, Kab. Tegal',
    ppkNomorSK: '800.1.2/015',
    ppkTahunSK: 2026,
    ppkTanggalSK: '2026-01-05',
    ppkTahunAnggaran: 2026,
    penyediaNamaDirektur: 'Ir. Bambang Haryadi',
    penyediaJabatan: 'Direktur Utama',
    penyediaNamaBadanUsaha: 'PT Wijaya Bangun Tegal Perkasa',
    penyediaKedudukan: 'Jl. Raya Procot No. 88, Slawi, Kab. Tegal',
    penyediaAktaNomor: 'AHU-0012456.AH.01.02.Tahun 2020',
    penyediaAktaTanggal: '2020-04-12',
    penyediaAktaNotaris: 'Siti Rahmawati, S.H., M.Kn.',
    nilaiKontrakAngka: 13920000000,
    nilaiKontrakTerbilang: 'Tiga Belas Miliar Sembilan Ratus Dua Puluh Juta Rupiah',
    kodeAkunKegiatan: '1.03.02.2.01.0005',
    sumberPembiayaan: 'APBD Kabupaten Tegal Tahun Anggaran 2026',
    bankNamaDanCabang: 'Bank Jateng Cabang Slawi',
    nomorRekeningPenyedia: '1012-0045-8890',
    namaRekeningPenyedia: 'PT Wijaya Bangun Tegal Perkasa',
    ruangLingkupUtama: [
      '1. Pekerjaan Persiapan',
      '2. Pekerjaan Bongkaran',
      '3. Pekerjaan Pagar',
      '   a. Pekerjaan Tanah',
      '   b. Pekerjaan Pondasi',
      '   c. Pekerjaan Beton',
      '   d. Pekerjaan Pasangan Dinding',
      '   e. Pekerjaan Plesteran',
      '   f. Pekerjaan Penutup Dinding',
      '   g. Pekerjaan Pengecatan',
      '   h. Pekerjaan Lain-Lain'
    ],
    jangkaWaktuPelaksanaanHari: 245,
    jangkaWaktuPelaksanaanHuruf: 'Dua Ratus Empat Puluh Lima',
    jangkaWaktuPemeliharaanHari: 180,
    jangkaWaktuPemeliharaanHuruf: 'Seratus Delapan Puluh',
    sskkEmailPPK: 'dpupr@tegalkab.go.id',
    sskkEmailPenyedia: 'kontraktor@wijayabangun.co.id',
    sskkWhatsappPenyedia: '0811-2678-900',
    sskkFaksimiliPenyedia: '-',
    sskkWakilSahPPK: '- tidak ada -',
    sskkWakilSahPenyedia: '- tidak ada -',
    sskkPencairanJaminan: 'Kas Daerah Pemerintah Kabupaten Tegal',
    sskkUangMukaKetentuan: 'Tidak diberikan Uang muka',
    sskkPembayaranCara: 'Termin',
    sskkTermin1Fisik: 30,
    sskkTermin1Bayar: 25,
    sskkTermin2Fisik: 55,
    sskkTermin2Bayar: 25,
    sskkTermin3Fisik: 80,
    sskkTermin3Bayar: 25,
    sskkTermin4Fisik: 100,
    sskkTermin4Bayar: 25,
    sskkDendaKeterlambatan: '1/1000 (satu perseribu) dari Harga Kontrak (sebelum PPN)',
    sskkUmurKonstruksiTahun: 50,
    sskkPertanggunganKegagalanTahun: 10,
    sskkPenyelesaianSengketa: 'Layanan Penyelesaian Sengketa Pengadaan Barang/Jasa Pemerintah LKPP',
    hargaSatuanTimpang: [
      { id: 'hst-1', mataPembayaran: 'Tidak Ada', satuanUkuran: 'Tidak Ada', kuantitas: 'Tidak Ada', hpsRp: 0, penawaranRp: 0, persenTerhadapHps: '-', keterangan: 'Tidak Ada' }
    ],
    subkontraktorUtama: [
      { id: 'sub-1', bagianPekerjaan: 'Tidak Ada', namaSubkon: 'Tidak Ada', alamatSubkon: 'Tidak Ada', kualifikasiSubkon: 'Tidak Ada', keterangan: 'Tidak Ada' }
    ],
    subkontraktorNonUtama: [
      { id: 'sub-2', bagianPekerjaan: 'Tidak Ada', namaSubkon: 'Tidak Ada', alamatSubkon: 'Tidak Ada', kualifikasiSubkon: 'Tidak Ada', keterangan: 'Tidak Ada' }
    ],
    personelManajerial: [
      { id: 'pers-1', nama: 'ERY SUGIANTO', jabatan: 'Pelaksana Lapangan Pekerjaan Gedung', pendidikan: 'SMK', pengalamanTahun: 1, sertifikatKompetensi: 'Pelaksana Lapangan Pekerjaan Gedung Jenjang 4', keterangan: '-' },
      { id: 'pers-2', nama: 'NOVEL SAPUTRA DWIFUADDILLAH', jabatan: 'Petugas Keselamatan Konstruksi', pendidikan: 'S1', pengalamanTahun: 0, sertifikatKompetensi: 'Ahli Madya K3 Konstruksi Jenjang 8', keterangan: '-' }
    ],
    peralatanUtama: [
      { id: 'alat-1', nama: 'Mesin Las Listrik', merekTipe: 'Mailthank', kapasitas: 'Arus min. 120A elektroda Ø2,6-3,2 mm', jumlah: '1 Unit', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' },
      { id: 'alat-2', nama: 'Concrete Mixer / Molen Beton', merekTipe: 'Tigon', kapasitas: 'Kapasitas drum min. 250 liter', jumlah: '1 Unit', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' },
      { id: 'alat-3', nama: 'Scaffolding', merekTipe: 'Tubular Steel Frame', kapasitas: 'Beban kerja 250 kg/m2', jumlah: '3 Set', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' }
    ],
    rkkNamaWakilSah: 'Ir. Bambang Haryadi',
    rkkJabatanWakilSah: 'Direktur Utama PT Wijaya Bangun Tegal Perkasa',
    rkkTanggalKomitmen: '2026-02-28',
    rkkTabelIBPRP: [
      { id: 'ibprp-1', uraianPekerjaan: 'Pekerjaan Pondasi Bore Pile & Pile Cap', identifikasiBahaya: 'Tertimbun tanah galian, getaran mesin bor', jenisBahaya: 'Luka fraktur, tertimpa material', pengendalianAwal: 'Pemasangan barikade dan safety helmet', tingkatRisiko: 'Sedang', pengendalianLanjutan: 'Pengawasan Ahli K3 dan izin kerja panas/galian' },
      { id: 'ibprp-2', uraianPekerjaan: 'Pengecoran Balok & Plat Lantai 3', identifikasiBahaya: 'Jatuh dari ketinggian, ambruk bekisting', jenisBahaya: 'Cedera fatalitas jatuh ketinggian', pengendalianAwal: 'Safety harness, safety net, pengecekan perancah', tingkatRisiko: 'Besar', pengendalianLanjutan: 'Inspeksi rutin perancah scaffolding sebelum cor' }
    ],
    clauses: DEFAULT_LKPP_CLAUSES,
    status: 'Ditandatangani PPK & Penyedia'
  }
];

export const INITIAL_BERITA_ACARA: BeritaAcara[] = [
  {
    id: 'ba-1',
    projectId: 'proj-1',
    tipe: 'SPMK',
    nomorSurat: '600.1.1/048/SPMK-PBG/PBLTARU/DPUPR/2026',
    judul: 'SURAT PERINTAH MULAI KERJA (SPMK)',
    tanggal: '2026-03-01',
    tempat: 'Kantor DPUPR Kabupaten Tegal, Slawi',
    deskripsiPekerjaan: 'Memerintahkan Penyedia PT Wijaya Bangun Tegal Perkasa untuk segera memulai pelaksanaan pekerjaan Pembangunan Gedung Rawat Inap RSUD Suradadi Tahap II paling lambat 7 hari kalender sejak SPMK diterbitkan.',
    catatanHasilPemeriksaan: [
      'Jaminan Pelaksanaan telah diserahkan dan dinyatakan sah sebesar 5% dari nilai kontrak.',
      'Rencana Keselamatan Konstruksi (RKK) telah disetujui PPK.',
      'Lokasi kerja telah diserahkan dalam keadaan siap dikerjakan.'
    ],
    rekomendasi: 'Penyedia segera melaksanakan PCM dan MC-0 bersama tim teknis dan konsultan pengawas.',
    pihakPertama: {
      nama: 'Ahmad Fauzi, S.T., M.Eng.',
      jabatan: 'Pejabat Pembuat Komitmen (PPK) Bidang PBLTARU',
      nip: '19820719 200604 1 009',
      instansi: 'DPUPR Kabupaten Tegal'
    },
    pihakKedua: {
      nama: 'Ir. Bambang Haryadi',
      jabatan: 'Direktur Utama',
      perusahaan: 'PT Wijaya Bangun Tegal Perkasa'
    },
    status: 'Final'
  },
  {
    id: 'ba-2',
    projectId: 'proj-1',
    tipe: 'MC-0',
    nomorSurat: '600.1.1/059/BA-MC0/PBLTARU/DPUPR/2026',
    judul: 'BERITA ACARA MUTUAL CHECK AWAL (MC-0%)',
    tanggal: '2026-03-12',
    tempat: 'Lokasi Proyek RSUD Suradadi, Kec. Suradadi',
    deskripsiPekerjaan: 'Pemeriksaan dan pengukuran bersama elevasi titik nol, batas-batas lahan, dan verifikasi volume pekerjaan awal.',
    progresFisikPersen: 0,
    catatanHasilPemeriksaan: [
      'Elevasi peil lantai 1 ditetapkan +0.70 m dari muka aspal jalan propinsi.',
      'Daya dukung tanah sesuai hasil uji sondir pada kedalaman -12.00 m.',
      'Terdapat penyesuaian volume galian pondasi bore pile sebanyak 4.2% tanpa mengubah nilai kontrak.'
    ],
    rekomendasi: 'Diterbitkan Shop Drawings yang telah ditandatangani bersama untuk acuan konstruksi.',
    pihakPertama: {
      nama: 'Ahmad Fauzi, S.T., M.Eng.',
      jabatan: 'Pejabat Pembuat Komitmen (PPK)',
      nip: '19820719 200604 1 009',
      instansi: 'DPUPR Kabupaten Tegal'
    },
    pihakKedua: {
      nama: 'Ir. Bambang Haryadi',
      jabatan: 'Direktur Utama',
      perusahaan: 'PT Wijaya Bangun Tegal Perkasa'
    },
    status: 'Final'
  },
  {
    id: 'ba-3',
    projectId: 'proj-1',
    tipe: 'BAP-TERMIN',
    nomorSurat: '600.1.1/120/BAP-TERM-1/PBLTARU/2026',
    judul: 'BERITA ACARA PEMBAYARAN TERMIN KE-1 (FISIK 30%)',
    tanggal: '2026-05-20',
    tempat: 'Slawi, Kabupaten Tegal',
    deskripsiPekerjaan: 'Pembayaran prestasi pekerjaan fisik yang telah mencapai progres 35.40% (memenuhi syarat termin 30%).',
    progresFisikPersen: 35.4,
    nilaiPembayaran: 4176000000,
    terminKe: 1,
    catatanHasilPemeriksaan: [
      'Pekerjaan struktur lantai 1 dan kolom lantai 2 telah selesai dikerjakan dengan mutu baik.',
      'Diproses potongan angsuran pengembalian uang muka sebesar 20% proporsional.',
      'Diproses potongan jaminan pemeliharaan retensi 5%.'
    ],
    rekomendasi: 'Dapat diproses pengajuan Surat Permintaan Pembayaran (SPP) ke Subbag Keuangan.',
    pihakPertama: {
      nama: 'Ahmad Fauzi, S.T., M.Eng.',
      jabatan: 'Pejabat Pembuat Komitmen (PPK)',
      nip: '19820719 200604 1 009',
      instansi: 'DPUPR Kabupaten Tegal'
    },
    pihakKedua: {
      nama: 'Ir. Bambang Haryadi',
      jabatan: 'Direktur Utama',
      perusahaan: 'PT Wijaya Bangun Tegal Perkasa'
    },
    status: 'Final'
  },
  {
    id: 'ba-4',
    projectId: 'proj-3',
    tipe: 'PHO',
    nomorSurat: '600.1.1/312/BA-PHO/PBLTARU/DPUPR/2025',
    judul: 'BERITA ACARA SERAH TERIMA PERTAMA PEKERJAAN (PHO)',
    tanggal: '2025-12-15',
    tempat: 'Gedung Perpustakaan Daerah Kab. Tegal, Slawi',
    deskripsiPekerjaan: 'Pemeriksaan akhir fisik konstruksi 100% dan penyerahan pertama pekerjaan dari Penyedia kepada PPK.',
    progresFisikPersen: 100,
    catatanHasilPemeriksaan: [
      'Pekerjaan struktur, arsitektur, MEP, dan lansekap telah selesai 100% dan berfungsi baik.',
      'Uji coba fungsi genset, lift difabel, dan sistem proteksi kebakaran (hydrant & sprinkle) telah lulus uji kelayakan.',
      'Masa Pemeliharaan berlaku selama 180 (seratus delapan puluh) hari kalender terhitung tanggal 16 Desember 2025 sampai dengan 14 Juni 2026.'
    ],
    rekomendasi: 'Penyedia berhak menerima pembayaran prestasi 100% dengan penahanan retensi 5% atau penyerahan Jaminan Pemeliharaan.',
    pihakPertama: {
      nama: 'Ahmad Fauzi, S.T., M.Eng.',
      jabatan: 'Pejabat Pembuat Komitmen (PPK)',
      nip: '19820719 200604 1 009',
      instansi: 'DPUPR Kabupaten Tegal'
    },
    pihakKedua: {
      nama: 'Ir. Hendro Wijanarko',
      jabatan: 'Direktur',
      perusahaan: 'PT Karya Graha Pratama'
    },
    status: 'Final'
  }
];

export const INITIAL_PAYMENTS: PaymentTerm[] = [
  {
    id: 'pay-1',
    projectId: 'proj-1',
    tahapPembayaran: 'Uang Muka',
    syaratProgresFisik: 0,
    progresFisikAktual: 0,
    nilaiTagihanKotor: 2784000000, // 20% dari 13.92 M
    potonganUangMuka: 0,
    potonganRetensi: 0,
    potonganPPN: 0, // Ditanggung/dipungut kas daerah
    potonganPPh: 73776000, // 2.65% jasa konstruksi
    nilaiBersihDibayar: 2710224000,
    nomorSPP: '900/012/SPP-LS/DPUPR/2026',
    tanggalSPP: '2026-03-05',
    nomorSPM: '900/014/SPM-LS/DPUPR/2026',
    tanggalSPM: '2026-03-07',
    nomorSP2D: '00321/SP2D-LS/BPKAD/2026',
    tanggalSP2D: '2026-03-09',
    status: 'SP2D Cair',
    keterangan: 'Pencairan uang muka 20% didukung Jaminan Uang Muka Bank Jateng Cabang Slawi No. BG/JTG/2026/089.'
  },
  {
    id: 'pay-2',
    projectId: 'proj-1',
    tahapPembayaran: 'Termin 1',
    terminKe: 1,
    syaratProgresFisik: 30,
    progresFisikAktual: 35.4,
    nilaiTagihanKotor: 4176000000, // 30% dari kontrak
    potonganUangMuka: 835200000,  // angsuran uang muka 20%
    potonganRetensi: 208800000,   // retensi 5%
    potonganPPN: 0,
    potonganPPh: 82956000,
    nilaiBersihDibayar: 3049044000,
    nomorSPP: '900/045/SPP-LS/DPUPR/2026',
    tanggalSPP: '2026-05-22',
    nomorSPM: '900/048/SPM-LS/DPUPR/2026',
    tanggalSPM: '2026-05-25',
    nomorSP2D: '01452/SP2D-LS/BPKAD/2026',
    tanggalSP2D: '2026-05-28',
    status: 'SP2D Cair',
    keterangan: 'Pencairan termin 1 prestasi fisik 35.40%, pengembalian uang muka tahap 1 dipotong.'
  },
  {
    id: 'pay-3',
    projectId: 'proj-1',
    tahapPembayaran: 'Termin 2',
    terminKe: 2,
    syaratProgresFisik: 65,
    progresFisikAktual: 68.5,
    nilaiTagihanKotor: 4872000000, // 35% dari kontrak
    potonganUangMuka: 974400000,
    potonganRetensi: 243600000,
    potonganPPN: 0,
    potonganPPh: 96783000,
    nilaiBersihDibayar: 3557217000,
    nomorSPP: '900/088/SPP-LS/DPUPR/2026',
    tanggalSPP: '2026-07-22',
    nomorSPM: '900/091/SPM-LS/DPUPR/2026',
    tanggalSPM: '2026-07-24',
    status: 'SPM Terbit',
    keterangan: 'Menunggu penerbitan SP2D dari BPKAD Kabupaten Tegal.'
  }
];

