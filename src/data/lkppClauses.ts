import { ContractClause } from '../types';
import { OFFICIAL_SSUK_SECTIONS } from './ssukData';

export const DEFAULT_KONSIDERANS_CONTENT = `1. Kitab Undang-Undang Hukum Perdata (Buku III tentang Perikatan);
2. Undang-Undang Nomor 30 Tahun 2014 tentang Administrasi Pemerintahan sebagaimana telah diubah dengan Undang-Undang Nomor 6 Tahun 2023 Tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Republik Indonesia Nomor 2 Tahun 2022 Tentang Cipta Kerja;
3. Undang-Undang Nomor 2 Tahun 2017 tentang Jasa Konstruksi sebagaimana telah diubah dengan Undang-Undang Nomor 6 Tahun 2023 tentang Penetapan Peraturan Pemerintah Pengganti Undang- Undang Republik Indonesia Nomor 2 Tahun 2022 Tentang Cipta Kerja;
4. Peraturan Pemerintah Nomor 22 Tahun 2020 tentang Peraturan Pelaksanaan Undang - Undang Nomor 2 tahun 2017 tentang Jasa Konstruksi sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 14 Tahun 2021 tentang Perubahan Peraturan Pemerintah Nomor 22 Tahun 2020 tentang Peraturan Pelaksanaan Undang - Undang Nomor 2 tahun 2017 tentang Jasa Konstruksi;
5. Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah terakhir dengan Peraturan Presiden Nomor 46 Tahun 2025 tentang Perubahan Kedua atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah;
6. Peraturan Presiden Nomor 108 Tahun 2025 tentang Pengadaan Barang/Jasa Pemerintah dalam Rangka Percepatan Pembangunan di Papua;
7. Peraturan Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah Nomor 2 Tahun 2026 tentang Katalog Elektronik dalam Pengadaan Barang/Jasa Pemerintah;
8. Peraturan Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah Nomor 12 Tahun 2021 tentang Pedoman Pelaksanaan Pengadaan Barang/Jasa Pemerintah Melalui Penyedia sebagaimana telah diubah dengan Peraturan Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah Nomor 4 Tahun 2024 Tentang Perubahan atas Peraturan Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah Nomor 12 Tahun 2021 Tentang Pedoman Pelaksanaan Pengadaan Barang/Jasa Pemerintah Melalui Penyedia;
9. Keputusan Kepala Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah Nomor 93 Tahun 2025 tentang Pelaksanaan E-Purchasing Katalog Elektronik Melalui Metode Mini-Kompetisi.`;

export const DEFAULT_PREMIS_CONTENT = `(a) telah dilakukan proses pemilihan Penyedia melalui metode pemilihan {{METODE_PEMILIHAN}};
(b) Pejabat Penandatangan Kontrak telah menunjuk Penyedia menjadi pihak dalam Kontrak ini melalui Surat Penunjukan Penyediaan Barang/Jasa (SPPBJ) Nomor {{NOMOR_SPPBJ}} tanggal {{TANGGAL_SPPBJ}} untuk melaksanakan Pekerjaan {{NAMA_PAKET}} sebagaimana diterangkan dalam dokumen Kontrak ini selanjutnya disebut "Pekerjaan Konstruksi";
(c) Penyedia telah menyatakan kepada Pejabat Penandatangan Kontrak, memiliki keahlian profesional, tenaga kerja konstruksi, dan sumber daya teknis, serta telah menyetujui untuk melaksanakan Pekerjaan Konstruksi sesuai dengan persyaratan dan ketentuan dalam Kontrak ini;
(d) Pejabat Penandatangan Kontrak dan Penyedia menyatakan memiliki kewenangan untuk menandatangani Kontrak ini, dan mengikat pihak yang diwakili;
(e) Pejabat Penandatangan Kontrak dan Penyedia mengakui dan menyatakan bahwa sehubungan dengan penandatanganan Kontrak ini masing-masing pihak :
    1) telah dan senantiasa diberikan kesempatan untuk didampingi oleh advokat;
    2) menandatangani Kontrak ini setelah meneliti secara patut;
    3) telah membaca dan memahami secara penuh ketentuan Kontrak ini;
    4) telah mendapatkan kesempatan yang memadai untuk memeriksa dan mengkonfirmasikan semua ketentuan dalam Kontrak ini beserta semua fakta dan kondisi yang terkait.`;

// Surat Perjanjian Clauses (Konsiderans, Premis, dan Pasal 1 s.d. 5)
export const SURAT_PERJANJIAN_CLAUSES: ContractClause[] = [
  {
    id: 'sp-konsiderans',
    pasal: 'KONSIDERANS',
    judul: 'DAN DENGAN MEMPERHATIKAN (DASAR HUKUM PERATURAN)',
    kategori: 'Surat Perjanjian',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'Konsiderans Dasar Hukum & Peraturan Perundang-Undangan Terkait Kontrak Kerja Konstruksi',
    kontenDefault: DEFAULT_KONSIDERANS_CONTENT
  },
  {
    id: 'sp-premis',
    pasal: 'PREMIS',
    judul: 'PARA PIHAK MENERANGKAN TERLEBIH DAHULU BAHWA (LATAR BELAKANG)',
    kategori: 'Surat Perjanjian',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'Premis Kesepakatan (Taut Otomatis ke Data Kontrak, SPPBJ, dan SSKK)',
    kontenDefault: DEFAULT_PREMIS_CONTENT
  },
  {
    id: 'sp-pasal-1',
    pasal: 1,
    judul: 'ISTILAH DAN UNGKAPAN',
    kategori: 'Surat Perjanjian',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'Surat Perjanjian Kontrak Konstruksi Harga Satuan',
    kontenDefault: 'Peristilahan dan ungkapan dalam Surat Perjanjian ini memiliki arti dan makna yang sama seperti yang tercantum dalam lampiran Surat Perjanjian ini.'
  },
  {
    id: 'sp-pasal-2',
    pasal: 2,
    judul: 'RUANG LINGKUP PEKERJAAN UTAMA',
    kategori: 'Surat Perjanjian',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'Surat Perjanjian Kontrak Konstruksi Harga Satuan',
    kontenDefault: `Ruang lingkup pekerjaan utama terdiri dari:
1. Pekerjaan Persiapan
2. Pekerjaan Bongkaran
3. Pekerjaan Pagar
4. Pekerjaan Tanah
5. Pekerjaan Pondasi
6. Pekerjaan Beton
7. Pekerjaan Pasangan Dinding
8. Pekerjaan Plesteran
9. Pekerjaan Penutup Dinding
10. Pekerjaan Pengecatan
11. Pekerjaan Lain-Lain`
  },
  {
    id: 'sp-pasal-3',
    pasal: 3,
    judul: 'HARGA KONTRAK, SUMBER PEMBIAYAAN DAN PEMBAYARAN',
    kategori: 'Surat Perjanjian',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'Surat Perjanjian Kontrak Konstruksi Harga Satuan',
    kontenDefault: `1. Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) yang diperoleh berdasarkan total harga penawaran sebagaimana tercantum dalam Daftar Kuantitas dan Harga adalah sebesar harga kontrak dengan kode akun kegiatan yang ditetapkan.
2. Kontrak ini dibiayai dari APBD Kabupaten Tegal Tahun Anggaran berjalan.
3. Pembayaran untuk kontrak ini dilakukan ke rekening Penyedia pada Bank Umum yang ditunjuk.`
  },
  {
    id: 'sp-pasal-4',
    pasal: 4,
    judul: 'DOKUMEN KONTRAK DAN HIERARKI KEKUATAN HUKUM',
    kategori: 'Surat Perjanjian',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'Surat Perjanjian Kontrak Konstruksi Harga Satuan',
    kontenDefault: `Kelengkapan dokumen-dokumen berikut merupakan satu kesatuan dan bagian yang tidak terpisahkan dari Kontrak ini terdiri dari adendum Kontrak (apabila ada), Surat Perjanjian, Surat Pesanan, Daftar Kuantitas dan Harga, Syarat-Syarat Umum Kontrak, Syarat-Syarat Khusus Kontrak beserta lampirannya berupa lampiran A (daftar harga satuan timpang, subkontraktor, personel manajerial, dan peralatan utama), lampiran B (Rencana Keselamatan Konstruksi), spesifikasi teknis, gambar-gambar, dan dokumen lainnya seperti: Surat Penunjukan Penyedia Barang/Jasa, Jadwal Pelaksanaan Pekerjaan, jaminan-jaminan, Berita Acara Rapat Persiapan Penandatanganan Kontrak, Berita Acara Rapat Persiapan Pelaksanaan Kontrak.
Jika terjadi pertentangan antara ketentuan dalam suatu dokumen dengan ketentuan dalam dokumen yang lain maka yang berlaku adalah ketentuan dalam dokumen yang lebih tinggi berdasarkan urutan hierarki sebagai berikut:
1. Adendum Kontrak (apabila ada);
2. Surat Perjanjian;
3. Daftar Kuantitas dan Harga;
4. Surat Pesanan;
5. Syarat-Syarat Khusus Kontrak;
6. Syarat-Syarat Umum Kontrak;
7. Spesifikasi teknis; dan
8. Gambar.`
  },
  {
    id: 'sp-pasal-5',
    pasal: 5,
    judul: 'MASA KONTRAK',
    kategori: 'Surat Perjanjian',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'Surat Perjanjian Kontrak Konstruksi Harga Satuan',
    kontenDefault: `1. Masa Kontrak adalah jangka waktu berlakunya Kontrak ini terhitung sejak tanggal penandatanganan Kontrak sampai dengan Tanggal Penyerahan Akhir Pekerjaan.
2. Masa Pelaksanaan ditentukan dalam Syarat-Syarat Khusus Kontrak, dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan (PHO).
3. Masa Pemeliharaan ditentukan dalam Syarat-Syarat Khusus Kontrak dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan (FHO).`
  }
];

// SSUK Clauses: 79 Pasal Lengkap dari Bab A sampai Bab H Sesuai Naskah Asli Word DPUPR Kab. Tegal
export const OFFICIAL_SSUK_CLAUSES: ContractClause[] = OFFICIAL_SSUK_SECTIONS.flatMap((section) =>
  section.clauses.map((clause) => ({
    id: clause.id,
    pasal: clause.pasal,
    judul: clause.judul.toUpperCase(),
    kategori: 'SSUK (Syarat Umum)' as const,
    isActive: true,
    isEditable: true,
    keteranganPerlem: `SSUK ${section.nomorDanJudul}`,
    kontenDefault: clause.paragraphs.map((p) => p.fullText).join('\n\n')
  }))
);

// SSKK Clauses (Klausul Pokok Syarat-Syarat Khusus Kontrak)
export const OFFICIAL_SSKK_CLAUSES: ContractClause[] = [
  {
    id: 'sskk-pasal-1',
    pasal: 'SSKK-1',
    judul: 'KORESPONDENSI, WAKIL SAH & PENCAIRAN JAMINAN',
    kategori: 'SSKK (Syarat Khusus)',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'SSUK 4.1, 4.2, 5.1, 6.3 & 43.4',
    kontenDefault: `1. Alamat Satker PPK: Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal, Jl. Cut Nyak Dien, Kalisapu, Slawi. Pos-el: dpupr@tegalkab.go.id.
2. Alamat Penyedia: Sesuai data identitas badan usaha dan kontak WhatsApp yang tercantum dalam SSKK.
3. Jaminan dicairkan dan disetorkan pada Kas Daerah Pemerintah Kabupaten Tegal.`
  },
  {
    id: 'sskk-pasal-2',
    pasal: 'SSKK-2',
    judul: 'ASAL MATERIAL / BAHAN & PENGAWASAN PEKERJAAN',
    kategori: 'SSKK (Syarat Khusus)',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'SSUK 7.2 & 13.1',
    kontenDefault: `1. Material/bahan yang digunakan harus berasal dari sumber, produsen, pabrik, pemasok, dan/atau lokasi pengambilan material yang sah serta memenuhi ketentuan perizinan berusaha yang dipersyaratkan. Penyedia wajib menunjukkan bukti asal/legalitas material.
2. Pengawas Pekerjaan berasal dari Penyedia Jasa Pengawasan (Konsultan Pengawas) yang ditetapkan oleh Pejabat Penandatangan Kontrak.`
  },
  {
    id: 'sskk-pasal-3',
    pasal: 'SSKK-3',
    judul: 'MASA PELAKSANAAN, PEMELIHARAAN & GAMBAR AS-BUILT',
    kategori: 'SSKK (Syarat Khusus)',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'SSUK 26.1, 32.8, 33, 34.1',
    kontenDefault: `1. Masa Pelaksanaan dihitung sejak Tanggal Mulai Kerja dalam SPMK sampai PHO.
2. Masa Pemeliharaan berlaku selama hari kalender yang disepakati terhitung sejak Tanggal Berita Acara PHO.
3. Jangka waktu pengambilalihan lokasi paling lambat 14 hari kalender setelah surat keterangan selesai.
4. Gambar As-Built dan pedoman O&M diserahkan paling lambat 14 hari kalender setelah tanggal PHO.`
  },
  {
    id: 'sskk-pasal-4',
    pasal: 'SSKK-4',
    judul: 'KETENTUAN PEMBAYARAN TERMIN & JAMINAN PEMELIHARAAN DPUPR',
    kategori: 'SSKK (Syarat Khusus)',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'SSUK 62, 69.1, 69.2',
    kontenDefault: `1. Besaran Uang Muka: Tidak diberikan uang muka.
2. Pembayaran prestasi pekerjaan dilakukan dengan cara Termin dengan tahapan:
   a. Termin I sebesar 25% setelah prestasi fisik mencapai 30%;
   b. Termin II sebesar 25% setelah prestasi fisik mencapai 55%;
   c. Termin III sebesar 25% setelah prestasi fisik mencapai 80%;
   d. Termin IV sebesar 25% (pelunasan) setelah fisik mencapai 100% dengan menyerahkan Jaminan Pemeliharaan 5% dari Harga Kontrak.
3. Jaminan Pemeliharaan berupa Bank Garansi dengan bukti slip setoran tunai atau pemblokiran dana atas SP2D pekerjaan sebesar 5% oleh Bank.`
  },
  {
    id: 'sskk-pasal-5',
    pasal: 'SSKK-5',
    judul: 'DENDA KETERLAMBATAN, UMUR KONSTRUKSI & SENGKETA',
    kategori: 'SSKK (Syarat Khusus)',
    isActive: true,
    isEditable: true,
    keteranganPerlem: 'SSUK 69.4, 77.2, 78.3',
    kontenDefault: `1. Denda keterlambatan ditetapkan 1/1000 (satu perseribu) dari Harga Kontrak (sebelum PPN) per hari keterlambatan.
2. Bangunan gedung hasil pekerjaan memiliki Umur Konstruksi selama 50 (lima puluh) tahun. Jangka waktu pertanggungan Penyedia terhadap Kegagalan Bangunan ditetapkan selama 10 (sepuluh) tahun sejak tanggal FHO.
3. Penyelesaian perselisihan/sengketa para pihak dilakukan melalui Layanan Penyelesaian Sengketa Pengadaan Barang/Jasa Pemerintah LKPP.`
  }
];

export const OFFICIAL_DPUPR_TEGAL_CLAUSES: ContractClause[] = [
  ...SURAT_PERJANJIAN_CLAUSES,
  ...OFFICIAL_SSUK_CLAUSES,
  ...OFFICIAL_SSKK_CLAUSES
];

export const DEFAULT_LKPP_CLAUSES = OFFICIAL_DPUPR_TEGAL_CLAUSES;
