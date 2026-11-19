import { SpkClauseItem, SpkContract, SpkType, Project } from '../types';
import { angkaKeTerbilang, parseKomponenTanggalKontrak } from '../utils/formatters';

export const DEFAULT_SPK_FISIK_CLAUSES: SpkClauseItem[] = [
  {
    id: 'spk-fsk-1',
    pasal: 1,
    judul: 'LINGKUP PEKERJAAN',
    isi: 'Penyedia berkewajiban melaksanakan dan menyelesaikan Pekerjaan Konstruksi secara lengkap dan sempurna sesuai Gambar Kerja, Spesifikasi Teknis, dan Rincian Biaya (RAB) penawaran yang telah disepakati.',
    isActive: true
  },
  {
    id: 'spk-fsk-2',
    pasal: 2,
    judul: 'HUKUM YANG BERLAKU DAN STANDAR KETEKNIKAN',
    isi: 'SPK ini tunduk pada hukum Republik Indonesia, peraturan perundang-undangan di bidang Pengadaan Barang/Jasa Pemerintah (Perpres No. 16/2018 jo Perpres No. 12/2021 beserta perubahannya), Peraturan LKPP No. 12 Tahun 2021, UU No. 2 Tahun 2017 tentang Jasa Konstruksi, dan Norma Standar Pedoman Kriteria (NSPK) Kementerian PUPR.',
    isActive: true
  },
  {
    id: 'spk-fsk-3',
    pasal: 3,
    judul: 'HAK DAN KEWAJIBAN PPK',
    isi: '1. Mengawasi dan memeriksa pelaksanaan pekerjaan yang dilaksanakan oleh Penyedia;\n2. Meminta laporan-laporan secara periodik mengenai pelaksanaan pekerjaan;\n3. Melakukan pembayaran atas hasil pekerjaan sesuai dengan ketentuan yang tercantum dalam SPK ini;\n4. Mengenakan denda atau sanksi administratif apabila Penyedia lalai atau cidera janji.',
    isActive: true
  },
  {
    id: 'spk-fsk-4',
    pasal: 4,
    judul: 'HAK DAN KEWAJIBAN PENYEDIA',
    isi: '1. Melaksanakan dan menyelesaikan pekerjaan sesuai dengan jadwal pelaksanaan dan spesifikasi teknis yang telah ditetapkan;\n2. Menyediakan tenaga kerja yang kompeten, bahan/material bermutu baik, serta peralatan kerja yang layak;\n3. Menerapkan Sistem Manajemen Keselamatan Konstruksi (SMKK) dan menjamin keselamatan kerja di lapangan;\n4. Menerima pembayaran atas prestasi pekerjaan yang telah diperiksa dan disetujui oleh PPK dan Tim Pengawas Teknis.',
    isActive: true
  },
  {
    id: 'spk-fsk-5',
    pasal: 5,
    judul: 'WAKTU PELAKSANAAN DAN JADWAL KERJA',
    isi: '1. Pekerjaan harus diselesaikan dalam jangka waktu yang telah ditetapkan dalam SPK ini terhitung sejak tanggal Surat Perintah Mulai Kerja (SPMK);\n2. Penyedia wajib menyusun jadwal pelaksanaan rinci (Kurva S) dan menyerahkannya kepada PPK pada saat Rapat Persiapan Pelaksanaan Kontrak (Pre-Construction Meeting/PCM).',
    isActive: true
  },
  {
    id: 'spk-fsk-6',
    pasal: 6,
    judul: 'PENGAWASAN DAN PENGUJIAN MUTU',
    isi: '1. Pemeriksaan dan pengawasan pekerjaan dilakukan oleh PPK dibantu oleh Konsultan Pengawas dan Tim Teknis DPUPR Kabupaten Tegal;\n2. PPK atau Pengawas berhak memerintahkan pengujian mutu bahan/material (uji tekan beton, uji tarik besi beton, dan pengujian laboratorium lainnya) atas biaya Penyedia;\n3. Pekerjaan atau bahan yang tidak memenuhi syarat spesifikasi wajib dibongkar dan diganti oleh Penyedia atas biaya sendiri.',
    isActive: true
  },
  {
    id: 'spk-fsk-7',
    pasal: 7,
    judul: 'PEMBAYARAN PRESTASI PEKERJAAN',
    isi: '1. Pembayaran dilakukan berdasarkan prestasi fisik pekerjaan yang telah diperiksa bersama dan dituangkan dalam Berita Acara Pemeriksaan Kemajuan Pekerjaan (BAP);\n2. Pembayaran dapat berupa pembayaran sekaligus setelah pekerjaan selesai 100% atau bertahap (termin) sesuai kesepakatan dalam SPK ini;\n3. Pembayaran dipotong pajak sesuai peraturan perpajakan yang berlaku (PPN & PPh Final Jasa Konstruksi).',
    isActive: true
  },
  {
    id: 'spk-fsk-8',
    pasal: 8,
    judul: 'PERUBAHAN PEKERJAAN (ADDENDUM / CCO)',
    isi: '1. Perubahan terhadap lingkup pekerjaan, jadwal pelaksanaan, dan/atau nilai SPK hanya dapat dilakukan melalui Addendum SPK tertulis yang disepakati kedua belah pihak;\n2. Perubahan pekerjaan tambah/kurang (Contract Change Order/CCO) tidak boleh melebihi 10% (sepuluh persen) dari nilai kontrak awal dan harus didukung Berita Acara Justifikasi Teknis.',
    isActive: true
  },
  {
    id: 'spk-fsk-9',
    pasal: 9,
    judul: 'DENDA KETERLAMBATAN DAN SANKSI',
    isi: '1. Apabila Penyedia terlambat menyelesaikan pekerjaan sesuai jangka waktu yang ditetapkan, Penyedia dikenakan denda keterlambatan sebesar 1/1000 (satu perseribu) dari nilai SPK (sebelum PPN) untuk setiap hari keterlambatan;\n2. Besaran total denda keterlambatan maksimal sebesar 5% (lima persen) dari nilai SPK;\n3. Keterlambatan melebihi batas toleransi dapat mengakibatkan pemutusan SPK dan pencantuman dalam Daftar Hitam (Blacklist).',
    isActive: true
  },
  {
    id: 'spk-fsk-10',
    pasal: 10,
    judul: 'SERAH TERIMA PERTAMA (PHO) DAN MASA PEMELIHARAAN',
    isi: '1. Setelah pekerjaan selesai 100%, Penyedia mengajukan permohonan tertulis Serah Terima Pertama Pekerjaan (Provisional Hand Over/PHO) kepada PPK;\n2. Dilakukan pemeriksaan bersama oleh Panitia/Tim Penerima Hasil Pekerjaan untuk menerbitkan Berita Acara Serah Terima Pertama (BAST-1);\n3. Masa Pemeliharaan berlaku selama jangka waktu yang ditetapkan (minimal 180 hari kalender). Selama masa ini Penyedia wajib memperbaiki segala kerusakan atau cacat mutu atas biaya sendiri.',
    isActive: true
  },
  {
    id: 'spk-fsk-11',
    pasal: 11,
    judul: 'SERAH TERIMA AKHIR (FHO)',
    isi: 'Setelah masa pemeliharaan berakhir dan seluruh kewajiban perbaikan cacat mutu telah dipenuhi dengan baik oleh Penyedia, dilakukan pemeriksaan akhir untuk penerbitan Berita Acara Serah Terima Akhir Pekerjaan (Final Hand Over/FHO).',
    isActive: true
  },
  {
    id: 'spk-fsk-12',
    pasal: 12,
    judul: 'PENYELESAIAN PERSELISIHAN',
    isi: '1. Perselisihan antara kedua belah pihak diselesaikan terlebih dahulu melalui musyawarah untuk mufakat;\n2. Apabila musyawarah tidak mencapai mufakat, para pihak sepakat memilih penyelesaian melalui Pengadilan Negeri Slawi Kabupaten Tegal.',
    isActive: true
  }
];

export const DEFAULT_SPK_PENGAWAS_CLAUSES: SpkClauseItem[] = [
  {
    id: 'spk-pws-1',
    pasal: 1,
    judul: 'LINGKUP LAYANAN PENGAWASAN TEKNIS',
    isi: 'Konsultan Pengawas bertugas membantu PPK dalam melakukan pengawasan umum, teknis, dan administratif terhadap pelaksanaan konstruksi fisik di lapangan agar tercapai sasaran mutu, waktu pelaksanaan, volume, dan biaya sesuai gambar perencanaan (DED), RKS, dan kontrak konstruksi.',
    isActive: true
  },
  {
    id: 'spk-pws-2',
    pasal: 2,
    judul: 'TUGAS DAN KEWAJIBAN KONSULTAN PENGAWAS',
    isi: '1. Memeriksa dan menyetujui jadwal kerja (Kurva S), metode pelaksanaan, dan gambar kerja (Shop Drawings) kontraktor pelaksana;\n2. Mengawasi mutu bahan/material yang digunakan dan memverifikasi sertifikat uji laboratorium;\n3. Mengawasi ketepatan pengukuran lapangan, elevasi, pembesian, dan struktur konstruksi;\n4. Memeriksa dan menandatangani Berita Acara Pemeriksaan Kemajuan Fisik (BAP) serta opname lapangan mingguan/bulanan;\n5. Mengawasi pelaksanaan K3 Konstruksi (SMKK) di area kerja proyek;\n6. Menyelenggarakan rapat koordinasi lapangan rutin mingguan dan menyusun risalah rapat;\n7. Menghadiri Rapat Pembuktian Keterlambatan (Show Cause Meeting / SCM) dan memberikan saran teknis perbaikan;\n8. Memeriksa dan memvalidasi Gambar Terlaksana (As-Built Drawings) serta dokumen serah terima pertama (PHO).',
    isActive: true
  },
  {
    id: 'spk-pws-3',
    pasal: 3,
    judul: 'HAK DAN KEWAJIBAN PPK',
    isi: '1. Memberikan akses lokasi kerja dan data teknis yang diperlukan kepada Konsultan Pengawas;\n2. Menginstruksikan tindak lanjut atas rekomendasi teknis yang disampaikan oleh Konsultan Pengawas;\n3. Melakukan pembayaran imbalan jasa konsultansi pengawasan sesuai termin atau prestasi yang disepakati.',
    isActive: true
  },
  {
    id: 'spk-pws-4',
    pasal: 4,
    judul: 'JANGKA WAKTU PENUGASAN',
    isi: '1. Jangka waktu pengawasan berlaku selama masa pelaksanaan pekerjaan konstruksi fisik ditambah waktu evaluasi akhir dan penyusunan laporan akhir pengawasan;\n2. Apabila masa pelaksanaan konstruksi fisik mengalami perpanjangan waktu yang sah (Addendum), masa penugasan pengawas disesuaikan melalui Addendum SPK Pengawasan.',
    isActive: true
  },
  {
    id: 'spk-pws-5',
    pasal: 5,
    judul: 'PERSONEL TENAGA AHLI',
    isi: '1. Konsultan Pengawas wajib menugaskan tenaga ahli dan pengawas lapangan yang berkualifikasi dan memiliki Sertifikat Keahlian (SKK Konstruksi) sesuai usulan teknis;\n2. Penggantian tenaga ahli hanya dapat dilakukan atas persetujuan tertulis PPK dengan kualifikasi tenaga pengganti yang setara atau lebih tinggi.',
    isActive: true
  },
  {
    id: 'spk-pws-6',
    pasal: 6,
    judul: 'DOKUMEN KELUARAN DAN LAPORAN',
    isi: 'Konsultan Pengawas wajib menyerahkan hasil layanan berupa:\n1. Laporan Pendahuluan (Inception Report);\n2. Laporan Mingguan dan Bulanan disertai foto dokumentasi progres fisik;\n3. Buku Harian Pengawasan dan Laporan Hasil Uji Lab Bahan;\n4. Laporan Akhir Pengawasan Teknis (Final Supervision Report) dan Rekomendasi PHO.',
    isActive: true
  },
  {
    id: 'spk-pws-7',
    pasal: 7,
    judul: 'INDEPENDENSI DAN INTEGRITAS',
    isi: 'Konsultan Pengawas wajib menjaga independensi profesional, dilarang berafiliasi atau menerima imbalan dalam bentuk apa pun dari kontraktor pelaksana fisik, dan bertanggung jawab penuh atas kebenaran laporan teknis yang disampaikan kepada PPK.',
    isActive: true
  },
  {
    id: 'spk-pws-8',
    pasal: 8,
    judul: 'SANKSI DAN DENDA KETERLAMBATAN',
    isi: '1. Keterlambatan penyerahan laporan atau kelalaian pengawasan yang merugikan mutu pekerjaan dikenakan sanksi peringatan tertulis;\n2. Keterlambatan penyerahan produk laporan akhir dikenakan denda sebesar 1/1000 dari nilai SPK per hari keterlambatan.',
    isActive: true
  },
  {
    id: 'spk-pws-9',
    pasal: 9,
    judul: 'PENYELESAIAN PERSELISIHAN',
    isi: 'Segala perselisihan yang timbul dari pelaksanaan SPK ini diselesaikan secara musyawarah untuk mufakat, atau melalui Pengadilan Negeri Slawi Kabupaten Tegal.',
    isActive: true
  }
];

export const DEFAULT_SPK_PERENCANA_CLAUSES: SpkClauseItem[] = [
  {
    id: 'spk-prc-1',
    pasal: 1,
    judul: 'LINGKUP LAYANAN PERENCANAAN TEKNIS',
    isi: 'Konsultan Perencana bertugas menyusun perencanaan teknis bangunan gedung (Detail Engineering Design/DED, RAB, dan RKS) yang andal, fungsional, memenuhi kaidah keselamatan struktur, efisien, ramah lingkungan, serta sesuai Peraturan Bangunan Gedung (UU No. 28/2002 jo UU Cipta Kerja).',
    isActive: true
  },
  {
    id: 'spk-prc-2',
    pasal: 2,
    judul: 'TAHAPAN DAN LINGKUP PEKERJAAN',
    isi: '1. Survey lokasi, pengukuran topografi batas lahan, dan penyelidikan tanah (Sondir/Soil Test);\n2. Penyusunan Pra-Rencana Desain (Konsep Arsitektur dan Skematik Layout Ruang);\n3. Pengembangan Rancangan dan Penyusunan Gambar Detail Engineering Design (DED) lengkap: Arsitektur, Struktur Bawah/Atas, Mekanikal, Elektrikal, dan Plumbing (MEP);\n4. Perhitungan analisis struktur dan beban gempa gedung sesuai SNI Gedung terbaru;\n5. Penyusunan Rencana Anggaran Biaya (RAB/EE) lengkap dengan Analisis Harga Satuan Pekerjaan (AHSP);\n6. Penyusunan Rencana Kerja dan Syarat-Syarat (RKS) serta Spesifikasi Teknis Material;\n7. Memberikan penjelasan teknis (Aanwijzing) saat tender konstruksi fisik;\n8. Memberikan pengawasan berkala (Periodic Supervision) saat pelaksanaan konstruksi fisik.',
    isActive: true
  },
  {
    id: 'spk-prc-3',
    pasal: 3,
    judul: 'DOKUMEN KELUARAN YANG WAJIB DISERAHKAN',
    isi: '1. Album Gambar DED Format Cetak A3 yang ditandatangani Ahli Perencana Berlisensi;\n2. Buku Dokumen Rencana Anggaran Biaya (RAB) dan Bill of Quantity (BQ);\n3. Buku Dokumen RKS / Spesifikasi Teknis dan Metode Pelaksanaan;\n4. Laporan Penyelidikan Tanah (Soil Test) dan Nota Perhitungan Struktur Bangunan Gedung;\n5. Softcopy lengkap dalam Flashdisk (CAD .dwg, Excel RAB, Word Dokumen Spesifikasi, dan PDF).',
    isActive: true
  },
  {
    id: 'spk-prc-4',
    pasal: 4,
    judul: 'HAK DAN KEWAJIBAN PPK',
    isi: '1. Menyediakan data Kerangka Acuan Kerja (KAK) dan memfasilitasi koordinasi lintas instansi pengguna gedung;\n2. Melakukan review, asistensi, dan pengesahan terhadap produk dokumen perencanaan;\n3. Melakukan pembayaran imbalan jasa konsultansi perencanaan sesuai tahapan yang disepakati.',
    isActive: true
  },
  {
    id: 'spk-prc-5',
    pasal: 5,
    judul: 'TANGGUNG JAWAB ATAS KEGAGALAN BANGUNAN',
    isi: 'Konsultan Perencana bertanggung jawab secara hukum dan profesi atas hasil perancangan. Apabila terjadi kegagalan bangunan yang terbukti disebabkan oleh cacat perencanaan, Konsultan Perencana wajib bertanggung jawab sesuai UU Jasa Konstruksi No. 2 Tahun 2017.',
    isActive: true
  },
  {
    id: 'spk-prc-6',
    pasal: 6,
    judul: 'HAK CIPTA DAN KEPEMILIKAN DOKUMEN',
    isi: 'Hak cipta dan kepemilikan atas seluruh dokumen perencanaan, gambar kerja, dan laporan yang dihasilkan menjadi milik Pemerintah Kabupaten Tegal c.q. Dinas PUPR Kabupaten Tegal.',
    isActive: true
  },
  {
    id: 'spk-prc-7',
    pasal: 7,
    judul: 'DENDA KETERLAMBATAN',
    isi: 'Keterlambatan penyerahan produk akhir perencanaan dikenakan denda sebesar 1/1000 (satu perseribu) dari nilai SPK per hari keterlambatan.',
    isActive: true
  },
  {
    id: 'spk-prc-8',
    pasal: 8,
    judul: 'PENYELESAIAN PERSELISIHAN',
    isi: 'Perselisihan yang timbul dari pelaksanaan SPK ini diselesaikan secara musyawarah untuk mufakat, atau melalui Pengadilan Negeri Slawi Kabupaten Tegal.',
    isActive: true
  }
];

export function createDefaultSpkForProject(project: Project, spkType: SpkType): SpkContract {
  const comp = parseKomponenTanggalKontrak(project.tanggalMulai || '2026-03-01');

  if (spkType === 'fisik') {
    const isCustomPpk = project.paketFisik?.usePpkAcuan === false && !!project.paketFisik?.ppkNama;
    const finalPpkNama = isCustomPpk ? project.paketFisik!.ppkNama! : (project.ppkNama || 'Ahmad Fauzi, S.T., M.Eng.');
    const finalPpkNip = isCustomPpk ? project.paketFisik!.ppkNip! : (project.ppkNip || '19820719 200604 1 009');
    const finalPpkJabatan = isCustomPpk ? (project.paketFisik!.ppkJabatan || 'PPK Pekerjaan Fisik') : (project.ppkJabatan || 'Pejabat Pembuat Komitmen (PPK) Bidang Bangunan Gedung dan Permukiman');

    const penyediaNama = project.paketFisik?.namaPerusahaan || (project.kontraktorNama && project.kontraktorNama !== '-' ? project.kontraktorNama : 'PT Wijaya Bangun Tegal Perkasa');
    const pimpinanNama = project.paketFisik?.namaDirektur || (project.kontraktorDirektur && project.kontraktorDirektur !== '-' ? project.kontraktorDirektur : 'Ir. Bambang Haryadi');
    const nilaiKontrakVal = project.paketFisik?.nilaiKontrak || project.nilaiKontrakFisik || (project.nilaiKontrak && project.nilaiKontrak > 0 ? project.nilaiKontrak : 185000000);
    const nomorSpkVal = project.paketFisik?.nomorKontrak || project.nomorKontrakFisik || `602.1/SPK-FSK/${project.kodePaket || '01'}/DPUPR/2026`;

    return {
      id: `spk-fsk-${project.id}`,
      projectId: project.id,
      spkType: 'fisik',
      nomorSpk: nomorSpkVal,
      tanggalSpk: project.tanggalMulai || '2026-03-01',
      hariSpk: comp.hari,
      tanggalTeksSpk: comp.tanggalTeks,
      bulanTeksSpk: comp.bulanTeks,
      tahunSpk: comp.tahunAngka,
      nomorSppbj: `602.1/SPPBJ/${project.kodePaket || '01'}/DPUPR/2026`,
      tanggalSppbj: '2026-02-25',
      metodePengadaan: 'Pengadaan Langsung',
      ppkNama: finalPpkNama,
      ppkNip: finalPpkNip,
      ppkJabatan: finalPpkJabatan,
      ppkAlamat: 'Jl. Cut Nyak Dien No. 13, Kalisapu, Slawi, Kabupaten Tegal',
      ppkNomorSk: '800.1.3/045/DPUPR/2026',
      ppkTahunAnggaran: project.tahunAnggaran || 2026,
      penyediaNamaBadanUsaha: penyediaNama,
      penyediaBentukUsaha: penyediaNama.startsWith('CV') ? 'CV' : 'PT',
      penyediaNamaPimpinan: pimpinanNama,
      penyediaJabatanPimpinan: 'Direktur',
      penyediaAlamat: 'Jl. Pemuda No. 88, Slawi, Kabupaten Tegal',
      penyediaNpwp: '01.234.567.8-501.000',
      penyediaBank: 'Bank Jateng Cabang Slawi',
      penyediaNomorRekening: '1-023-45678-9',
      penyediaNamaRekening: penyediaNama,
      namaPaket: project.nama,
      lokasiPekerjaan: project.lokasi,
      tahunAnggaran: project.tahunAnggaran || 2026,
      sumberDana: project.sumberDana || 'APBD Kab. Tegal',
      kodeRekeningKegiatan: '1.03.02.2.01.0005.5.2.03.01.01.0001',
      nilaiKontrak: nilaiKontrakVal,
      nilaiKontrakTerbilang: angkaKeTerbilang(nilaiKontrakVal),
      termasukPpn: true,
      jangkaWaktuHari: project.durasiHari || 120,
      jangkaWaktuHuruf: angkaKeTerbilang(project.durasiHari || 120).replace('rupiah', '').trim(),
      tanggalMulai: project.tanggalMulai || '2026-03-01',
      tanggalSelesai: project.tanggalSelesai || '2026-06-30',
      masaPemeliharaanHari: project.masaPemeliharaanHari || 180,
      masaPemeliharaanHuruf: 'Seratus Delapan Puluh',
      sistemPembayaran: 'Termin / Prestasi Kerja',
      keteranganPembayaran: 'Pembayaran dilakukan berdasarkan Berita Acara Pemeriksaan Kemajuan Pekerjaan Fisik dengan memperhitungkan potongan pajak.',
      dendaKeterlambatan: '1/1000 (satu perseribu) dari nilai SPK (sebelum PPN) per hari keterlambatan.',
      ruangLingkup: [
        'Pekerjaan Persiapan, Pengukuran & Penerapan SMKK',
        'Pekerjaan Pondasi dan Struktur Beton Bertulang',
        'Pekerjaan Pasangan Dinding, Plesteran dan Acian',
        'Pekerjaan Kusen, Pintu, dan Jendela Kaca',
        'Pekerjaan Penutup Lantai Granit Tile 60x60',
        'Pekerjaan Instalasi Mekanikal, Elektrikal & Plumbing (MEP)',
        'Pekerjaan Pengecatan Interior dan Eksterior',
        'Pembersihan Akhir dan Perapihan Lokasi Pekerjaan'
      ],
      personelList: [
        {
          id: 'prs-1',
          nama: 'Budi Santoso, S.T.',
          posisi: 'Pelaksana Lapangan Gedung',
          kualifikasi: 'S1 Teknik Sipil (SKK Jenjang 6)',
          sertifikat: 'SKK No. 92837/SIPIL/2024'
        },
        {
          id: 'prs-2',
          nama: 'Agus Riyadi, A.Md.',
          posisi: 'Petugas Keselamatan Konstruksi (K3)',
          kualifikasi: 'D3 Teknik / Ahli K3 Konstruksi',
          sertifikat: 'Sertifikat K3 Konstruksi BNSP'
        }
      ],
      clauses: DEFAULT_SPK_FISIK_CLAUSES,
      status: 'Review Legal'
    };
  }

  if (spkType === 'pengawas') {
    const isCustomPpk = project.paketPengawas?.usePpkAcuan === false && !!project.paketPengawas?.ppkNama;
    const finalPpkNama = isCustomPpk ? project.paketPengawas!.ppkNama! : (project.ppkNama || 'Ahmad Fauzi, S.T., M.Eng.');
    const finalPpkNip = isCustomPpk ? project.paketPengawas!.ppkNip! : (project.ppkNip || '19820719 200604 1 009');
    const finalPpkJabatan = isCustomPpk ? (project.paketPengawas!.ppkJabatan || 'PPK Pengawasan') : (project.ppkJabatan || 'Pejabat Pembuat Komitmen (PPK) Bidang Bangunan Gedung dan Permukiman');

    const pengawasNama = project.paketPengawas?.namaPerusahaan || (project.pengawasNama && project.pengawasNama !== '-' ? project.pengawasNama : 'PT Cipta Matra Mandiri');
    const pengawasPimpinan = project.paketPengawas?.namaDirektur || project.pengawasDirektur || 'Hendra Kusuma, S.T.';
    const nilaiPengawasan = project.paketPengawas?.nilaiKontrak || project.nilaiKontrakPengawas || Math.min(95000000, Math.round((project.nilaiKontrak || 2000000000) * 0.035));
    const nomorSpkVal = project.paketPengawas?.nomorKontrak || project.nomorKontrakPengawas || `602.1/SPK-PWS/${project.kodePaket || '01'}/DPUPR/2026`;

    return {
      id: `spk-pws-${project.id}`,
      projectId: project.id,
      spkType: 'pengawas',
      nomorSpk: nomorSpkVal,
      tanggalSpk: project.tanggalMulai || '2026-03-01',
      hariSpk: comp.hari,
      tanggalTeksSpk: comp.tanggalTeks,
      bulanTeksSpk: comp.bulanTeks,
      tahunSpk: comp.tahunAngka,
      nomorSppbj: `602.1/SPPBJ-PWS/${project.kodePaket || '01'}/DPUPR/2026`,
      tanggalSppbj: '2026-02-24',
      metodePengadaan: 'Pengadaan Langsung',
      ppkNama: finalPpkNama,
      ppkNip: finalPpkNip,
      ppkJabatan: finalPpkJabatan,
      ppkAlamat: 'Jl. Cut Nyak Dien No. 13, Kalisapu, Slawi, Kabupaten Tegal',
      ppkNomorSk: '800.1.3/045/DPUPR/2026',
      ppkTahunAnggaran: project.tahunAnggaran || 2026,
      penyediaNamaBadanUsaha: pengawasNama,
      penyediaBentukUsaha: pengawasNama.startsWith('CV') ? 'CV' : 'PT',
      penyediaNamaPimpinan: pengawasPimpinan,
      penyediaJabatanPimpinan: 'Direktur / Team Leader',
      penyediaAlamat: 'Jl. Kolonel Sugiono No. 24, Slawi, Kabupaten Tegal',
      penyediaNpwp: '02.456.789.1-501.000',
      penyediaBank: 'Bank Jateng Cabang Slawi',
      penyediaNomorRekening: '1-023-99887-1',
      penyediaNamaRekening: pengawasNama,
      namaPaket: `Pengawasan Teknis ${project.nama}`,
      lokasiPekerjaan: project.lokasi,
      tahunAnggaran: project.tahunAnggaran || 2026,
      sumberDana: project.sumberDana || 'APBD Kab. Tegal',
      kodeRekeningKegiatan: '1.03.02.2.01.0005.5.2.03.02.01.0002',
      nilaiKontrak: nilaiPengawasan,
      nilaiKontrakTerbilang: angkaKeTerbilang(nilaiPengawasan),
      termasukPpn: true,
      jangkaWaktuHari: project.durasiHari || 120,
      jangkaWaktuHuruf: angkaKeTerbilang(project.durasiHari || 120).replace('rupiah', '').trim(),
      tanggalMulai: project.tanggalMulai || '2026-03-01',
      tanggalSelesai: project.tanggalSelesai || '2026-06-30',
      sistemPembayaran: 'Bulanan (Monthly Certificate)',
      keteranganPembayaran: 'Pembayaran dilakukan bertahap secara bulanan berdasarkan laporan prestasi pengawasan teknis dan kehadiran personel di lapangan.',
      dendaKeterlambatan: '1/1000 (satu perseribu) dari nilai SPK Pengawasan per hari keterlambatan penyerahan produk laporan.',
      ruangLingkup: [
        'Pemeriksaan gambar rencana, RKS, dan jadwal pelaksanaan kerja (Kurva S)',
        'Pengawasan mutu bahan, peralatan kerja, dan metode kerja di lapangan',
        'Pengawasan pengujian laboratorium (uji tekan beton dan uji tarik baja)',
        'Pemeriksaan dan persetujuan Gambar Kerja (Shop Drawings) kontraktor',
        'Pengukuran volume dan opname bersama progres fisik mingguan',
        'Pengawasan pelaksanaan Sistem Manajemen Keselamatan Konstruksi (SMKK)',
        'Penyelenggaraan rapat koordinasi rutin lapangan dan risalah rapat',
        'Pemeriksaan Gambar Terlaksana (As-Built Drawings) dan pendampingan PHO'
      ],
      personelList: [
        {
          id: 'prs-pws-1',
          nama: pengawasPimpinan,
          posisi: 'Site Engineer / Team Leader',
          kualifikasi: 'S1 Teknik Sipil (Ahli Madya Pengawasan Gedung)',
          sertifikat: 'SKK No. 44321/PENGAWASAN/2024'
        },
        {
          id: 'prs-pws-2',
          nama: 'Wahyu Nugroho, S.T.',
          posisi: 'Inspector Teknis / Quality & Quantity',
          kualifikasi: 'S1 Teknik Sipil / Pengawasan Lapangan',
          sertifikat: 'SKK No. 32155/INSPECTOR/2025'
        }
      ],
      keluaranHasil: [
        'Buku Laporan Pendahuluan (Inception Report)',
        'Buku Laporan Mingguan & Rekapitulasi Kurva S Fisik',
        'Buku Laporan Bulanan & Dokumentasi Foto Pelaksanaan',
        'Buku Laporan Hasil Uji Mutu Bahan Konstruksi',
        'Buku Laporan Akhir Pengawasan Teknis dan Rekomendasi PHO'
      ],
      clauses: DEFAULT_SPK_PENGAWAS_CLAUSES,
      status: 'Review Legal'
    };
  }

  // spkType === 'perencana'
  const isCustomPpk = project.paketPerencana?.usePpkAcuan === false && !!project.paketPerencana?.ppkNama;
  const finalPpkNama = isCustomPpk ? project.paketPerencana!.ppkNama! : (project.ppkNama || 'Ahmad Fauzi, S.T., M.Eng.');
  const finalPpkNip = isCustomPpk ? project.paketPerencana!.ppkNip! : (project.ppkNip || '19820719 200604 1 009');
  const finalPpkJabatan = isCustomPpk ? (project.paketPerencana!.ppkJabatan || 'PPK Perencanaan') : (project.ppkJabatan || 'Pejabat Pembuat Komitmen (PPK) Bidang Bangunan Gedung dan Permukiman');

  const perencanaNama = project.paketPerencana?.namaPerusahaan || (project.perencanaNama && project.perencanaNama !== '-' ? project.perencanaNama : 'CV Arsitek Graha Desain Slawi');
  const perencanaPimpinan = project.paketPerencana?.namaDirektur || project.perencanaDirektur || 'Aris Munandar, S.T., IAI';
  const nilaiPerencanaan = project.paketPerencana?.nilaiKontrak || project.nilaiKontrakPerencana || Math.min(98000000, Math.round((project.nilaiKontrak || 2000000000) * 0.045));
  const nomorSpkVal = project.paketPerencana?.nomorKontrak || project.nomorKontrakPerencana || `602.1/SPK-PRC/${project.kodePaket || '01'}/DPUPR/2026`;

  return {
    id: `spk-prc-${project.id}`,
    projectId: project.id,
    spkType: 'perencana',
    nomorSpk: nomorSpkVal,
    tanggalSpk: '2026-01-15',
    hariSpk: 'Kamis',
    tanggalTeksSpk: 'lima belas',
    bulanTeksSpk: 'Januari',
    tahunSpk: 2026,
    nomorSppbj: `602.1/SPPBJ-PRC/${project.kodePaket || '01'}/DPUPR/2026`,
    tanggalSppbj: '2026-01-10',
    metodePengadaan: 'Pengadaan Langsung',
    ppkNama: finalPpkNama,
    ppkNip: finalPpkNip,
    ppkJabatan: finalPpkJabatan,
    ppkAlamat: 'Jl. Cut Nyak Dien No. 13, Kalisapu, Slawi, Kabupaten Tegal',
    ppkNomorSk: '800.1.3/045/DPUPR/2026',
    ppkTahunAnggaran: project.tahunAnggaran || 2026,
    penyediaNamaBadanUsaha: perencanaNama,
    penyediaBentukUsaha: perencanaNama.startsWith('CV') ? 'CV' : 'PT',
    penyediaNamaPimpinan: perencanaPimpinan,
    penyediaJabatanPimpinan: 'Direktur / Team Leader',
    penyediaAlamat: 'Jl. Dr. Soetomo No. 12, Kalisapu, Slawi, Kabupaten Tegal',
    penyediaNpwp: '03.789.123.4-501.000',
    penyediaBank: 'Bank Jateng Cabang Slawi',
    penyediaNomorRekening: '1-023-77665-2',
    penyediaNamaRekening: perencanaNama,
    namaPaket: `Perencanaan Teknis (DED & RAB) ${project.nama}`,
    lokasiPekerjaan: project.lokasi,
    tahunAnggaran: project.tahunAnggaran || 2026,
    sumberDana: project.sumberDana || 'APBD Kab. Tegal',
    kodeRekeningKegiatan: '1.03.02.2.01.0005.5.2.03.02.01.0001',
    nilaiKontrak: nilaiPerencanaan,
    nilaiKontrakTerbilang: angkaKeTerbilang(nilaiPerencanaan),
    termasukPpn: true,
    jangkaWaktuHari: 45,
    jangkaWaktuHuruf: 'Empat Puluh Lima',
    tanggalMulai: '2026-01-15',
    tanggalSelesai: '2026-02-28',
    sistemPembayaran: 'Termin / Prestasi Kerja',
    keteranganPembayaran: 'Termin 1 (30%): Setelah penyerahan Laporan Antara & Konsep Desain disetujui. Termin 2 (70%): Setelah penyerahan seluruh produk DED, RAB, RKS dan berkas lelang lengkap.',
    dendaKeterlambatan: '1/1000 (satu perseribu) dari nilai SPK Perencanaan per hari keterlambatan.',
    ruangLingkup: [
      'Survey lapangan, pengukuran topografi lahan & penyelidikan tanah (Sondir/Soil Test)',
      'Penyusunan Konsep Rancangan Arsitektur dan Pra-Rencana Skematik',
      'Penyusunan Gambar Detail Engineering Design (DED): Arsitektur, Struktur, MEP & Lansekap',
      'Analisis perhitungan struktur gedung tahan gempa sesuai SNI Bangunan Gedung',
      'Penyusunan Rencana Anggaran Biaya (RAB / EE) dan Bill of Quantity (BQ)',
      'Penyusunan Rencana Kerja dan Syarat-Syarat (RKS) serta Spesifikasi Teknis Bahan',
      'Penyusunan Rancangan Konseptual Sistem Manajemen Keselamatan Konstruksi (SMKK)',
      'Pemberian penjelasan teknis (Aanwijzing) saat proses pengadaan kontraktor pelaksana',
      'Pengawasan berkala selama tahap pelaksanaan konstruksi fisik berlangsung'
    ],
    personelList: [
      {
        id: 'prs-prc-1',
        nama: perencanaPimpinan,
        posisi: 'Team Leader / Ahli Arsitektur',
        kualifikasi: 'S1 Arsitektur (Ahli Madya Perancang Bangunan Gedung)',
        sertifikat: 'STRA / SKK No. 12984/ARSITEK/2024'
      },
      {
        id: 'prs-prc-2',
        nama: 'Dodi Prasetya, S.T., M.T.',
        posisi: 'Ahli Struktur Bangunan Gedung',
        kualifikasi: 'S2 Teknik Sipil Struktur (Ahli Madya Struktur)',
        sertifikat: 'SKK No. 98112/STRUKTUR/2024'
      },
      {
        id: 'prs-prc-3',
        nama: 'Farhan Maulana, S.T.',
        posisi: 'Ahli Mekanikal & Elektrikal (MEP)',
        kualifikasi: 'S1 Teknik Elektro / Mesin',
        sertifikat: 'SKK No. 55621/MEP/2025'
      },
      {
        id: 'prs-prc-4',
        nama: 'Tri Wahyudi, A.Md.',
        posisi: 'Estimator Biaya / Quantity Surveyor (QS)',
        kualifikasi: 'D3 Teknik Sipil (Ahli Estimasi Biaya Bangunan)',
        sertifikat: 'SKK No. 33214/QS/2024'
      }
    ],
    keluaranHasil: [
      'Buku Album Gambar DED Lengkap Ukuran A3 (Arsitektur, Struktur, MEP)',
      'Buku Dokumen Rencana Anggaran Biaya (RAB / EE) dan BQ (Volume Pekerjaan)',
      'Buku Dokumen Rencana Kerja dan Syarat-Syarat (RKS) & Spesifikasi Teknis',
      'Buku Laporan Penyelidikan Tanah (Soil Test) & Laporan Analisis Perhitungan Struktur',
      'Flashdisk Softcopy Dokumen CAD (.dwg), Excel RAB, Word Dokumen Spesifikasi, dan PDF'
    ],
    clauses: DEFAULT_SPK_PERENCANA_CLAUSES,
    status: 'Ditandatangani PPK & Penyedia'
  };
}

export function generateInitialSpkContracts(projects: Project[]): SpkContract[] {
  const result: SpkContract[] = [];
  projects.forEach(project => {
    result.push(createDefaultSpkForProject(project, 'fisik'));
    result.push(createDefaultSpkForProject(project, 'pengawas'));
    result.push(createDefaultSpkForProject(project, 'perencana'));
  });
  return result;
}

