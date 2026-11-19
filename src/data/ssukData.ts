// DOKUMEN RESMI SSUK (SYARAT-SYARAT UMUM KONTRAK)
// DPUPR KABUPATEN TEGAL (Sesuai File Word Acuan: 7._SURAT_PERJANJIAN,_SSUK,_SSKK.docx)
// Berisi 8 Bagian (A-H), 79 Pasal, dan sistem penomoran hierarkis baku (1.1, 1.2, a, b, dst.)

export interface SSUKParagraph {
  prefix?: string;
  text: string;
  fullText: string;
}

export interface SSUKClause {
  id: string;
  pasal: number;
  subBab?: string;
  judul: string;
  nomorDanJudul: string;
  paragraphs: SSUKParagraph[];
}

export interface SSUKSection {
  id: string;
  huruf: string;
  judul: string;
  nomorDanJudul: string;
  clauses: SSUKClause[];
}

export interface SSUKItem {
  id: string;
  pasal: string;
  judul: string;
  kategori: string;
  uraian: string;
}

export const OFFICIAL_SSUK_SECTIONS: SSUKSection[] = [
  {
    "id": "ssuk-sec-a",
    "huruf": "A",
    "judul": "KETENTUAN UMUM",
    "nomorDanJudul": "A. KETENTUAN UMUM",
    "clauses": [
      {
        "id": "ssuk-1",
        "pasal": 1,
        "judul": "Definisi",
        "nomorDanJudul": "1. Definisi",
        "paragraphs": [
          {
            "text": "Istilah-istilah  yang  digunakan  dalam  Syarat-Syarat Umum Kontrak selanjutnya disebut SSUK harus mempunyai arti atau tafsiran seperti yang dimaksudkan sebagai berikut.",
            "fullText": "Istilah-istilah  yang  digunakan  dalam  Syarat-Syarat Umum Kontrak selanjutnya disebut SSUK harus mempunyai arti atau tafsiran seperti yang dimaksudkan sebagai berikut."
          },
          {
            "prefix": "1.1",
            "text": "Aparat Pengawas Intern Pemerintah yang selanjutnya disingkat APIP adalah aparat yang melakukan pengawasan melalui audit, reviu, pemantauan, evaluasi, dan kegiatan pengawasan lain terhadap penyelenggaraan tugas dan fungsi Pemerintah.",
            "fullText": "1.1 Aparat Pengawas Intern Pemerintah yang selanjutnya disingkat APIP adalah aparat yang melakukan pengawasan melalui audit, reviu, pemantauan, evaluasi, dan kegiatan pengawasan lain terhadap penyelenggaraan tugas dan fungsi Pemerintah."
          },
          {
            "prefix": "1.2",
            "text": "Bagian pekerjaan yang disubkontrakan adalah bagian pekerjaan utama atau bagian pekerjaan bukan utama yang pelaksanaanya diserahkan kepada Penyedia lain (subkontraktor) dan disetujui terlebih dahulu oleh Pejabat Penandatangan Kontrak.",
            "fullText": "1.2 Bagian pekerjaan yang disubkontrakan adalah bagian pekerjaan utama atau bagian pekerjaan bukan utama yang pelaksanaanya diserahkan kepada Penyedia lain (subkontraktor) dan disetujui terlebih dahulu oleh Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "1.3",
            "text": "Daftar Kuantitas dan Harga adalah daftar kuantitas yang telah diisi harga satuan dan jumlah biaya keseluruhannya yang merupakan bagian dari penawaran.",
            "fullText": "1.3 Daftar Kuantitas dan Harga adalah daftar kuantitas yang telah diisi harga satuan dan jumlah biaya keseluruhannya yang merupakan bagian dari penawaran."
          },
          {
            "prefix": "1.4",
            "text": "Direksi Lapangan adalah tenaga/tim pendukung yang dibentuk/ditetapkan oleh Pejabat Penandatangan Kontrak, terdiri dari 1 (satu) orang atau lebih, untuk mengelola administrasi Kontrak dan mengendalikan pelaksanaan pekerjaan.",
            "fullText": "1.4 Direksi Lapangan adalah tenaga/tim pendukung yang dibentuk/ditetapkan oleh Pejabat Penandatangan Kontrak, terdiri dari 1 (satu) orang atau lebih, untuk mengelola administrasi Kontrak dan mengendalikan pelaksanaan pekerjaan."
          },
          {
            "prefix": "1.5",
            "text": "Harga Kontrak adalah total harga pelaksanaan pekerjaan yang tercantum dalam Kontrak.",
            "fullText": "1.5 Harga Kontrak adalah total harga pelaksanaan pekerjaan yang tercantum dalam Kontrak."
          },
          {
            "prefix": "1.6",
            "text": "Harga Perkiraan Sendiri yang selanjutnya disingkat HPS adalah perkiraan harga barang/jasa yang ditetapkan oleh PPK",
            "fullText": "1.6 Harga Perkiraan Sendiri yang selanjutnya disingkat HPS adalah perkiraan harga barang/jasa yang ditetapkan oleh PPK"
          },
          {
            "prefix": "1.7",
            "text": "Harga Satuan Pekerjaan yang selanjutnya disingkat HSP adalah harga satu jenis pekerjaan tertentu per satu satuan tertentu.",
            "fullText": "1.7 Harga Satuan Pekerjaan yang selanjutnya disingkat HSP adalah harga satu jenis pekerjaan tertentu per satu satuan tertentu."
          },
          {
            "prefix": "1.8",
            "text": "Jadwal Pelaksanaan Pekerjaan adalah kerangka waktu yang sudah terinci berdasarkan Masa Pelaksanaan, setelah dilaksanakan pemeriksaan lapangan bersama dan disepakati dalam rapat persiapan pelaksanaan Kontrak.",
            "fullText": "1.8 Jadwal Pelaksanaan Pekerjaan adalah kerangka waktu yang sudah terinci berdasarkan Masa Pelaksanaan, setelah dilaksanakan pemeriksaan lapangan bersama dan disepakati dalam rapat persiapan pelaksanaan Kontrak."
          },
          {
            "prefix": "1.9",
            "text": "Katalog Elektronik adalah sistem informasi elektronik yang memuat daftar, merek, jenis, spesifikasi teknis, harga, dan jumlah ketersediaan Barang/Jasa tertentu dari berbagai Penyedia.",
            "fullText": "1.9 Katalog Elektronik adalah sistem informasi elektronik yang memuat daftar, merek, jenis, spesifikasi teknis, harga, dan jumlah ketersediaan Barang/Jasa tertentu dari berbagai Penyedia."
          },
          {
            "prefix": "1.10",
            "text": "Keadaan Kahar adalah suatu keadaan yang terjadi di luar kehendak para pihak dalam Kontrak dan tidak dapat diperkirakan sebelumnya, sehingga kewajiban yang ditentukan dalam Kontrak menjadi tidak dapat dipenuhi.",
            "fullText": "1.10 Keadaan Kahar adalah suatu keadaan yang terjadi di luar kehendak para pihak dalam Kontrak dan tidak dapat diperkirakan sebelumnya, sehingga kewajiban yang ditentukan dalam Kontrak menjadi tidak dapat dipenuhi."
          },
          {
            "prefix": "1.11",
            "text": "Kegagalan Bangunan adalah suatu keadaan keruntuhan bangunan dan/atau tidak berfungsinya bangunan setelah penyerahan akhir hasil Jasa Konstruksi.",
            "fullText": "1.11 Kegagalan Bangunan adalah suatu keadaan keruntuhan bangunan dan/atau tidak berfungsinya bangunan setelah penyerahan akhir hasil Jasa Konstruksi."
          },
          {
            "prefix": "1.12",
            "text": "Kontrak Kerja Konstruksi selanjutnya disebut Kontrak adalah keseluruhan dokumen yang mengatur hubungan hukum antara Pejabat Penandatangan Kontrak dengan Penyedia dalam pelaksanaan jasa konsultansi konstruksi atau pekerjaan konstruksi.",
            "fullText": "1.12 Kontrak Kerja Konstruksi selanjutnya disebut Kontrak adalah keseluruhan dokumen yang mengatur hubungan hukum antara Pejabat Penandatangan Kontrak dengan Penyedia dalam pelaksanaan jasa konsultansi konstruksi atau pekerjaan konstruksi."
          },
          {
            "prefix": "1.13",
            "text": "Kontrak Harga Satuan adalah Kontrak dengan harga satuan yang tetap untuk setiap satuan atau unsur pekerjaan dengan spesifikasi teknis tertentu atas penyelesaian seluruh pekerjaan dalam batas waktu yang telah ditetapkan, volume atau kuantitas pekerjaannya masih bersifat perkiraan pada saat Kontrak ditandatangani, pembayaran berdasarkan hasil pengukuran bersama atas realisasi volume pekerjaan dan nilai akhir Kontrak ditetapkan setelah seluruh pekerjaan diselesaikan.",
            "fullText": "1.13 Kontrak Harga Satuan adalah Kontrak dengan harga satuan yang tetap untuk setiap satuan atau unsur pekerjaan dengan spesifikasi teknis tertentu atas penyelesaian seluruh pekerjaan dalam batas waktu yang telah ditetapkan, volume atau kuantitas pekerjaannya masih bersifat perkiraan pada saat Kontrak ditandatangani, pembayaran berdasarkan hasil pengukuran bersama atas realisasi volume pekerjaan dan nilai akhir Kontrak ditetapkan setelah seluruh pekerjaan diselesaikan."
          },
          {
            "prefix": "1.14",
            "text": "Kuasa Pengguna Anggaran pada pelaksanaan APBN yang selanjutnya disingkat KPA adalah pejabat yang memperoleh kuasa dari PA untuk melaksanakan sebagian kewenangan dan tanggung jawab Penggunaan Anggaran pada Kementerian Negara/Lembaga yang bersangkutan.",
            "fullText": "1.14 Kuasa Pengguna Anggaran pada pelaksanaan APBN yang selanjutnya disingkat KPA adalah pejabat yang memperoleh kuasa dari PA untuk melaksanakan sebagian kewenangan dan tanggung jawab Penggunaan Anggaran pada Kementerian Negara/Lembaga yang bersangkutan."
          },
          {
            "prefix": "1.15",
            "text": "Masa Kontrak adalah jangka waktu berlakunya Kontrak ini terhitung sejak tanggal penandatanganan Kontrak sampai dengan Tanggal Penyerahan Akhir Pekerjaan.",
            "fullText": "1.15 Masa Kontrak adalah jangka waktu berlakunya Kontrak ini terhitung sejak tanggal penandatanganan Kontrak sampai dengan Tanggal Penyerahan Akhir Pekerjaan."
          },
          {
            "prefix": "1.16",
            "text": "Masa Pelaksanaan adalah jangka waktu untuk melaksanakan seluruh pekerjaan terhitung sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Pertama Pekerjaan.",
            "fullText": "1.16 Masa Pelaksanaan adalah jangka waktu untuk melaksanakan seluruh pekerjaan terhitung sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Pertama Pekerjaan."
          },
          {
            "prefix": "1.17",
            "text": "Masa Pemeliharaan adalah jangka waktu untuk melaksanakan kewajiban pemeliharaan oleh Penyedia, terhitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan.",
            "fullText": "1.17 Masa Pemeliharaan adalah jangka waktu untuk melaksanakan kewajiban pemeliharaan oleh Penyedia, terhitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan."
          },
          {
            "prefix": "1.18",
            "text": "Mata Pembayaran Utama adalah mata pembayaran yang pokok dan penting yang nilai bobot kumulatifnya minimal 80% (delapan puluh persen) dari seluruh nilai pekerjaan, dihitung mulai dari mata pembayaran yang nilai bobotnya terbesar.",
            "fullText": "1.18 Mata Pembayaran Utama adalah mata pembayaran yang pokok dan penting yang nilai bobot kumulatifnya minimal 80% (delapan puluh persen) dari seluruh nilai pekerjaan, dihitung mulai dari mata pembayaran yang nilai bobotnya terbesar."
          },
          {
            "prefix": "1.19",
            "text": "Metode Pelaksanaan Pekerjaan adalah metode yang menggambarkan penguasaan penyelesaian pekerjaan yang sistematis dari awal sampai akhir meliputi tahapan/urutan pekerjaan utama dan uraian/cara kerja dari masing-masing jenis kegiatan pekerjaan utama yang dapat dipertanggung jawabkan secara teknis.",
            "fullText": "1.19 Metode Pelaksanaan Pekerjaan adalah metode yang menggambarkan penguasaan penyelesaian pekerjaan yang sistematis dari awal sampai akhir meliputi tahapan/urutan pekerjaan utama dan uraian/cara kerja dari masing-masing jenis kegiatan pekerjaan utama yang dapat dipertanggung jawabkan secara teknis."
          },
          {
            "prefix": "1.20",
            "text": "Nilai Total Pagu Kompetisi adalah nilai dari HPS.",
            "fullText": "1.20 Nilai Total Pagu Kompetisi adalah nilai dari HPS."
          },
          {
            "prefix": "1.21",
            "text": "Pejabat Pembuat Komitmen yang selanjutnya disingkat PPK adalah pejabat yang diberi kewenangan oleh PA/KPA untuk mengambil keputusan dan/atau melakukan tindakan yang dapat mengakibatkan pengeluaran anggaran belanja negara.",
            "fullText": "1.21 Pejabat Pembuat Komitmen yang selanjutnya disingkat PPK adalah pejabat yang diberi kewenangan oleh PA/KPA untuk mengambil keputusan dan/atau melakukan tindakan yang dapat mengakibatkan pengeluaran anggaran belanja negara."
          },
          {
            "prefix": "1.22",
            "text": "Pekerjaan Konstruksi adalah keseluruhan atau sebagian kegiatan yang meliputi pembangunan, pengoperasian, pemeliharaan, pembongkaran, dan pembangunan kembali suatu bangunan.",
            "fullText": "1.22 Pekerjaan Konstruksi adalah keseluruhan atau sebagian kegiatan yang meliputi pembangunan, pengoperasian, pemeliharaan, pembongkaran, dan pembangunan kembali suatu bangunan."
          },
          {
            "prefix": "1.23",
            "text": "Pekerjaan Utama adalah rangkaian kegiatan dalam suatu penyelenggaraan pekerjaan konstruksi yang memiliki pengaruh terbesar dalam mengakibatkan terjadinya keterlambatan penyelesaian pekerjaan konstruksi dan secara langsung menunjang terwujudnya dan berfungsinya suatu konstruksi sesuai peruntukannya sebagaimana tercantum dalam rancangan kontrak.",
            "fullText": "1.23 Pekerjaan Utama adalah rangkaian kegiatan dalam suatu penyelenggaraan pekerjaan konstruksi yang memiliki pengaruh terbesar dalam mengakibatkan terjadinya keterlambatan penyelesaian pekerjaan konstruksi dan secara langsung menunjang terwujudnya dan berfungsinya suatu konstruksi sesuai peruntukannya sebagaimana tercantum dalam rancangan kontrak."
          },
          {
            "prefix": "1.24",
            "text": "Pelaku Usaha adalah badan usaha atau perseorangan yang melakukan usaha dan/atau kegiatan pada bidang tertentu.",
            "fullText": "1.24 Pelaku Usaha adalah badan usaha atau perseorangan yang melakukan usaha dan/atau kegiatan pada bidang tertentu."
          },
          {
            "prefix": "1.25",
            "text": "Pengawas Pekerjaan adalah tim pendukung/badan usaha  yang ditunjuk/ditetapkan oleh Pejabat Penandatangan Kontrak yang bertugas untuk mengawasi pelaksanaan pekerjaan.",
            "fullText": "1.25 Pengawas Pekerjaan adalah tim pendukung/badan usaha  yang ditunjuk/ditetapkan oleh Pejabat Penandatangan Kontrak yang bertugas untuk mengawasi pelaksanaan pekerjaan."
          },
          {
            "prefix": "1.26",
            "text": "Pengguna Anggaran yang selanjutnya disingkat PA adalah pejabat pemegang kewenangan penggunaan anggaran Kementerian Negara/Lembaga/Perangkat Daerah.",
            "fullText": "1.26 Pengguna Anggaran yang selanjutnya disingkat PA adalah pejabat pemegang kewenangan penggunaan anggaran Kementerian Negara/Lembaga/Perangkat Daerah."
          },
          {
            "prefix": "1.27",
            "text": "Pejabat yang berwenang untuk menandatangani kontrak yang selanjutnya disebut Pejabat Penandatangan Kontrak adalah pemilik atau pemberi pekerjaan yang menggunakan layanan Jasa Konstruksi yang dapat berupa Pengguna Anggaran, Kuasa Pengguna Anggaran, atau Pejabat Pembuat Komitmen.",
            "fullText": "1.27 Pejabat yang berwenang untuk menandatangani kontrak yang selanjutnya disebut Pejabat Penandatangan Kontrak adalah pemilik atau pemberi pekerjaan yang menggunakan layanan Jasa Konstruksi yang dapat berupa Pengguna Anggaran, Kuasa Pengguna Anggaran, atau Pejabat Pembuat Komitmen."
          },
          {
            "prefix": "1.28",
            "text": "Penyedia adalah Pelaku Usaha yang menyediakan barang/jasa berdasarkan Kontrak.",
            "fullText": "1.28 Penyedia adalah Pelaku Usaha yang menyediakan barang/jasa berdasarkan Kontrak."
          },
          {
            "prefix": "1.29",
            "text": "Personel Manajerial adalah tenaga ahli atau tenaga teknis yang ditempatkan sesuai penugasan pada organisasi pelaksanaan pekerjaan.",
            "fullText": "1.29 Personel Manajerial adalah tenaga ahli atau tenaga teknis yang ditempatkan sesuai penugasan pada organisasi pelaksanaan pekerjaan."
          },
          {
            "prefix": "1.30",
            "text": "Sanksi Daftar Hitam adalah sanksi yang diberikan kepada Peserta pemilihan/Penyedia berupa larangan mengikuti Pengadaan Barang/Jasa di seluruh Kementerian/Lembaga dalam jangka waktu tertentu.",
            "fullText": "1.30 Sanksi Daftar Hitam adalah sanksi yang diberikan kepada Peserta pemilihan/Penyedia berupa larangan mengikuti Pengadaan Barang/Jasa di seluruh Kementerian/Lembaga dalam jangka waktu tertentu."
          },
          {
            "prefix": "1.31",
            "text": "Subkontraktor adalah Penyedia yang mengadakan perjanjian kerja tertulis dengan Penyedia penanggung jawab Kontrak, untuk melaksanakan sebagian pekerjaan (subkontrak).",
            "fullText": "1.31 Subkontraktor adalah Penyedia yang mengadakan perjanjian kerja tertulis dengan Penyedia penanggung jawab Kontrak, untuk melaksanakan sebagian pekerjaan (subkontrak)."
          },
          {
            "prefix": "1.32",
            "text": "Surat Jaminan yang selanjutnya disebut Jaminan adalah jaminan tertulis yang dikeluarkan oleh Bank Umum/Perusahaan Penjaminan/ Perusahaan Asuransi/ lembaga keuangan khusus yang menjalankan usaha di bidang pembiayaan, penjaminan, dan asuransi untuk mendorong ekspor Indonesia.",
            "fullText": "1.32 Surat Jaminan yang selanjutnya disebut Jaminan adalah jaminan tertulis yang dikeluarkan oleh Bank Umum/Perusahaan Penjaminan/ Perusahaan Asuransi/ lembaga keuangan khusus yang menjalankan usaha di bidang pembiayaan, penjaminan, dan asuransi untuk mendorong ekspor Indonesia."
          },
          {
            "prefix": "1.33",
            "text": "Surat Perintah Mulai Kerja yang selanjutnya disingkat SPMK adalah surat yang diterbitkan oleh Pejabat Penandatangan Kontrak kepada Penyedia untuk memulai melaksanakan pekerjaan.",
            "fullText": "1.33 Surat Perintah Mulai Kerja yang selanjutnya disingkat SPMK adalah surat yang diterbitkan oleh Pejabat Penandatangan Kontrak kepada Penyedia untuk memulai melaksanakan pekerjaan."
          },
          {
            "prefix": "1.34",
            "text": "Tanggal Mulai Kerja adalah tanggal yang dinyatakan pada SPMK yang diterbitkan oleh Pejabat Penandatangan Kontrak untuk memulai melaksanakan pekerjaan.",
            "fullText": "1.34 Tanggal Mulai Kerja adalah tanggal yang dinyatakan pada SPMK yang diterbitkan oleh Pejabat Penandatangan Kontrak untuk memulai melaksanakan pekerjaan."
          },
          {
            "prefix": "1.35",
            "text": "Tanggal Penyerahan Pertama Pekerjaan adalah tanggal serah terima pertama pekerjaan selesai (Provisional Hand Over/PHO) dinyatakan dalam Berita Acara Serah Terima Pertama Pekerjaan yang diterbitkan oleh Pejabat Penandatangan Kontrak.",
            "fullText": "1.35 Tanggal Penyerahan Pertama Pekerjaan adalah tanggal serah terima pertama pekerjaan selesai (Provisional Hand Over/PHO) dinyatakan dalam Berita Acara Serah Terima Pertama Pekerjaan yang diterbitkan oleh Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "1.36",
            "text": "Tanggal Penyerahan Akhir Pekerjaan adalah tanggal serah terima akhir pekerjaan selesai  (Final Hand Over/FHO) dinyatakan dalam Berita Acara Serah Terima Akhir Pekerjaan yang diterbitkan oleh Pejabat Penandatangan Kontrak.",
            "fullText": "1.36 Tanggal Penyerahan Akhir Pekerjaan adalah tanggal serah terima akhir pekerjaan selesai  (Final Hand Over/FHO) dinyatakan dalam Berita Acara Serah Terima Akhir Pekerjaan yang diterbitkan oleh Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "1.37",
            "text": "Tenaga Kerja Konstruksi adalah tenaga kerja yang bekerja di sektor konstruksi yang meliputi ahli, teknisi atau analis, dan operator.",
            "fullText": "1.37 Tenaga Kerja Konstruksi adalah tenaga kerja yang bekerja di sektor konstruksi yang meliputi ahli, teknisi atau analis, dan operator."
          }
        ]
      },
      {
        "id": "ssuk-2",
        "pasal": 2,
        "judul": "Penerapan",
        "nomorDanJudul": "2. Penerapan",
        "paragraphs": [
          {
            "text": "SSUK diterapkan secara luas dalam pelaksanaan Pekerjaan Konstruksi ini tetapi tidak dapat bertentangan dengan ketentuan-ketentuan dalam Dokumen Kontrak lain yang lebih tinggi berdasarkan urutan hierarki dalam Surat Perjanjian.",
            "fullText": "SSUK diterapkan secara luas dalam pelaksanaan Pekerjaan Konstruksi ini tetapi tidak dapat bertentangan dengan ketentuan-ketentuan dalam Dokumen Kontrak lain yang lebih tinggi berdasarkan urutan hierarki dalam Surat Perjanjian."
          }
        ]
      },
      {
        "id": "ssuk-3",
        "pasal": 3,
        "judul": "Bahasa dan Hukum",
        "nomorDanJudul": "3. Bahasa dan Hukum",
        "paragraphs": [
          {
            "prefix": "3.1",
            "text": "Bahasa Kontrak harus dalam bahasa Indonesia.",
            "fullText": "3.1 Bahasa Kontrak harus dalam bahasa Indonesia."
          },
          {
            "prefix": "3.2",
            "text": "Hukum yang digunakan adalah hukum yang berlaku di Indonesia.",
            "fullText": "3.2 Hukum yang digunakan adalah hukum yang berlaku di Indonesia."
          }
        ]
      },
      {
        "id": "ssuk-4",
        "pasal": 4,
        "judul": "Korespondensi",
        "nomorDanJudul": "4. Korespondensi",
        "paragraphs": [
          {
            "prefix": "4.1",
            "text": "Semua korespondensi dapat berbentuk surat,  e-mail dan/atau faksimili dengan alamat tujuan para pihak yang tercantum dalam SSKK.",
            "fullText": "4.1 Semua korespondensi dapat berbentuk surat,  e-mail dan/atau faksimili dengan alamat tujuan para pihak yang tercantum dalam SSKK."
          },
          {
            "prefix": "4.2",
            "text": "Semua pemberitahuan, permohonan, atau persetujuan berdasarkan Kontrak ini harus dibuat secara tertulis dalam Bahasa Indonesia, dan dianggap telah diberitahukan jika telah disampaikan secara langsung kepada Wakil Sah Para Pihak dalam SSKK, atau jika disampaikan melalui surat tercatat dan/atau faksimili ditujukan ke alamat yang tercantum dalam SSKK.",
            "fullText": "4.2 Semua pemberitahuan, permohonan, atau persetujuan berdasarkan Kontrak ini harus dibuat secara tertulis dalam Bahasa Indonesia, dan dianggap telah diberitahukan jika telah disampaikan secara langsung kepada Wakil Sah Para Pihak dalam SSKK, atau jika disampaikan melalui surat tercatat dan/atau faksimili ditujukan ke alamat yang tercantum dalam SSKK."
          }
        ]
      },
      {
        "id": "ssuk-5",
        "pasal": 5,
        "judul": "Wakil Sah Para Pihak",
        "nomorDanJudul": "5. Wakil Sah Para Pihak",
        "paragraphs": [
          {
            "prefix": "5.1",
            "text": "Setiap tindakan yang disyaratkan atau diperbolehkan untuk dilakukan, dan setiap dokumen yang disyaratkan atau diperbolehkan untuk dibuat berdasarkan Kontrak ini oleh Pejabat Penandatangan Kontrak atau Penyedia hanya dapat dilakukan atau dibuat oleh Wakil Sah Para Pihak atau pejabat yang disebutkan dalam SSKK kecuali untuk melakukan perubahan kontrak.",
            "fullText": "5.1 Setiap tindakan yang disyaratkan atau diperbolehkan untuk dilakukan, dan setiap dokumen yang disyaratkan atau diperbolehkan untuk dibuat berdasarkan Kontrak ini oleh Pejabat Penandatangan Kontrak atau Penyedia hanya dapat dilakukan atau dibuat oleh Wakil Sah Para Pihak atau pejabat yang disebutkan dalam SSKK kecuali untuk melakukan perubahan kontrak."
          },
          {
            "prefix": "5.2",
            "text": "Kewenangan Wakil Sah Para Pihak diatur dalam Surat Keputusan dari Para Pihak dan harus disampaikan kepada masing-masing pihak.",
            "fullText": "5.2 Kewenangan Wakil Sah Para Pihak diatur dalam Surat Keputusan dari Para Pihak dan harus disampaikan kepada masing-masing pihak."
          },
          {
            "prefix": "5.3",
            "text": "Dalam hal Direksi Lapangan diangkat dan ditunjuk menjadi Wakil Sah Pejabat Penandatangan Kontrak,  maka selain melaksanakan pengelolaan administrasi kontrak dan pengendalian pelaksanaan pekerjaan, Direksi Lapangan juga melaksanakan pendelegasian sesuai dengan pelimpahan dari Pejabat Penandatangan Kontrak.",
            "fullText": "5.3 Dalam hal Direksi Lapangan diangkat dan ditunjuk menjadi Wakil Sah Pejabat Penandatangan Kontrak,  maka selain melaksanakan pengelolaan administrasi kontrak dan pengendalian pelaksanaan pekerjaan, Direksi Lapangan juga melaksanakan pendelegasian sesuai dengan pelimpahan dari Pejabat Penandatangan Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-6",
        "pasal": 6,
        "judul": "Larangan Korupsi, Kolusi dan/atau Nepotisme, Penyalahgunaan Wewenang serta Penipuan",
        "nomorDanJudul": "6. Larangan Korupsi, Kolusi dan/atau Nepotisme, Penyalahgunaan Wewenang serta Penipuan",
        "paragraphs": [
          {
            "prefix": "6.1",
            "text": "Berdasarkan etika pengadaan barang/jasa pemerintah, para pihak dilarang untuk :",
            "fullText": "6.1 Berdasarkan etika pengadaan barang/jasa pemerintah, para pihak dilarang untuk :"
          },
          {
            "prefix": "a.",
            "text": "menawarkan, menerima atau menjanjikan untuk memberi atau menerima hadiah atau imbalan berupa apa saja atau melakukan tindakan lainnya untuk mempengaruhi siapapun yang diketahui atau patut dapat diduga berkaitan dengan pengadaan ini;",
            "fullText": "a. menawarkan, menerima atau menjanjikan untuk memberi atau menerima hadiah atau imbalan berupa apa saja atau melakukan tindakan lainnya untuk mempengaruhi siapapun yang diketahui atau patut dapat diduga berkaitan dengan pengadaan ini;"
          },
          {
            "prefix": "b.",
            "text": "mendorong terjadinya persaingan tidak sehat; dan/atau",
            "fullText": "b. mendorong terjadinya persaingan tidak sehat; dan/atau"
          },
          {
            "prefix": "c.",
            "text": "membuat dan/atau menyampaikan secara tidak benar dokumen dan/atau keterangan lain yang disyaratkan untuk penyusunan dan pelaksanaan Kontrak ini.",
            "fullText": "c. membuat dan/atau menyampaikan secara tidak benar dokumen dan/atau keterangan lain yang disyaratkan untuk penyusunan dan pelaksanaan Kontrak ini."
          },
          {
            "prefix": "6.2",
            "text": "Penyedia menjamin bahwa yang bersangkutan termasuk semua subkontraktornya (jika ada) tidak pernah dan tidak akan melakukan tindakan yang dilarang pada Pasal 6.1 di atas.",
            "fullText": "6.2 Penyedia menjamin bahwa yang bersangkutan termasuk semua subkontraktornya (jika ada) tidak pernah dan tidak akan melakukan tindakan yang dilarang pada Pasal 6.1 di atas."
          },
          {
            "prefix": "6.3",
            "text": "Penyedia yang menurut penilaian Pejabat Penandatangan Kontrak terbukti melakukan larangan-larangan di atas dapat dikenakan sanksi-sanksi administratif oleh Pejabat Penandatangan Kontrak sebagai berikut:",
            "fullText": "6.3 Penyedia yang menurut penilaian Pejabat Penandatangan Kontrak terbukti melakukan larangan-larangan di atas dapat dikenakan sanksi-sanksi administratif oleh Pejabat Penandatangan Kontrak sebagai berikut:"
          },
          {
            "prefix": "a.",
            "text": "pemutusan Kontrak;",
            "fullText": "a. pemutusan Kontrak;"
          },
          {
            "prefix": "b.",
            "text": "Jaminan Pelaksanaan dicairkan dan disetorkan sebagaimana ditetapkan dalam SSKK;",
            "fullText": "b. Jaminan Pelaksanaan dicairkan dan disetorkan sebagaimana ditetapkan dalam SSKK;"
          },
          {
            "prefix": "c.",
            "text": "sisa uang muka harus dilunasi oleh Penyedia atau Jaminan Uang Muka dicairkan dan disetorkan sebagaimana ditetapkan dalam SSKK; dan",
            "fullText": "c. sisa uang muka harus dilunasi oleh Penyedia atau Jaminan Uang Muka dicairkan dan disetorkan sebagaimana ditetapkan dalam SSKK; dan"
          },
          {
            "prefix": "d.",
            "text": "pengenaan Sanksi Daftar Hitam.",
            "fullText": "d. pengenaan Sanksi Daftar Hitam."
          },
          {
            "prefix": "6.4",
            "text": "Pengenaan sanksi administratif di atas dilaporkan oleh Pejabat Penandatangan Kontrak kepada PA/KPA.",
            "fullText": "6.4 Pengenaan sanksi administratif di atas dilaporkan oleh Pejabat Penandatangan Kontrak kepada PA/KPA."
          },
          {
            "prefix": "6.5",
            "text": "Pejabat Penandatangan Kontrak yang terlibat dalam korupsi, kolusi, dan/atau nepotisme dan penipuan dikenakan sanksi berdasarkan ketentuan peraturan perundang-undangan.",
            "fullText": "6.5 Pejabat Penandatangan Kontrak yang terlibat dalam korupsi, kolusi, dan/atau nepotisme dan penipuan dikenakan sanksi berdasarkan ketentuan peraturan perundang-undangan."
          }
        ]
      },
      {
        "id": "ssuk-7",
        "pasal": 7,
        "judul": "Asal Material/Bahan",
        "nomorDanJudul": "7. Asal Material/Bahan",
        "paragraphs": [
          {
            "prefix": "7.1",
            "text": "Penyedia harus menyampaikan asal material/bahan yang terdiri dari rincian komponen dalam negeri dan komponen impor selama pelaksanaan pekerjaan kepada Pejabat Penandatangan Kontrak.",
            "fullText": "7.1 Penyedia harus menyampaikan asal material/bahan yang terdiri dari rincian komponen dalam negeri dan komponen impor selama pelaksanaan pekerjaan kepada Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "7.2",
            "text": "Asal material/bahan merupakan tempat material/bahan diperoleh, antara lain tempat material/bahan ditambang, tumbuh, atau diproduksi.",
            "fullText": "7.2 Asal material/bahan merupakan tempat material/bahan diperoleh, antara lain tempat material/bahan ditambang, tumbuh, atau diproduksi."
          },
          {
            "prefix": "7.3",
            "text": "Kendaraan yang digunakan untuk pengiriman dan pengangkutan material/bahan mematuhi peraturan perundangan terkait beban dan dimensi kendaraan.",
            "fullText": "7.3 Kendaraan yang digunakan untuk pengiriman dan pengangkutan material/bahan mematuhi peraturan perundangan terkait beban dan dimensi kendaraan."
          }
        ]
      },
      {
        "id": "ssuk-8",
        "pasal": 8,
        "judul": "Pembukuan",
        "nomorDanJudul": "8. Pembukuan",
        "paragraphs": [
          {
            "text": "Penyedia diharapkan untuk melakukan pencatatan keuangan yang akurat dan sistematis sehubungan dengan pelaksanaan pekerjaan ini berdasarkan standar akuntansi yang berlaku.",
            "fullText": "Penyedia diharapkan untuk melakukan pencatatan keuangan yang akurat dan sistematis sehubungan dengan pelaksanaan pekerjaan ini berdasarkan standar akuntansi yang berlaku."
          }
        ]
      },
      {
        "id": "ssuk-9",
        "pasal": 9,
        "judul": "Perpajakan",
        "nomorDanJudul": "9. Perpajakan",
        "paragraphs": [
          {
            "text": "Penyedia, Subkontraktor (jika ada), dan Tenaga Kerja Konstruksi yang bersangkutan berkewajiban untuk membayar semua pajak, bea, retribusi, dan pungutan lain yang dibebankan oleh peraturan perpajakan atas pelaksanaan Kontrak ini. Semua pengeluaran perpajakan ini dianggap telah termasuk dalam Harga Kontrak.",
            "fullText": "Penyedia, Subkontraktor (jika ada), dan Tenaga Kerja Konstruksi yang bersangkutan berkewajiban untuk membayar semua pajak, bea, retribusi, dan pungutan lain yang dibebankan oleh peraturan perpajakan atas pelaksanaan Kontrak ini. Semua pengeluaran perpajakan ini dianggap telah termasuk dalam Harga Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-10",
        "pasal": 10,
        "judul": "Pengalihan Seluruh Kontrak",
        "nomorDanJudul": "10. Pengalihan Seluruh Kontrak",
        "paragraphs": [
          {
            "prefix": "10.1",
            "text": "Pengalihan seluruh Kontrak hanya diperbolehkan dalam hal pergantian nama Penyedia, baik sebagai akibat peleburan (merger) maupun akibat lainnya.",
            "fullText": "10.1 Pengalihan seluruh Kontrak hanya diperbolehkan dalam hal pergantian nama Penyedia, baik sebagai akibat peleburan (merger) maupun akibat lainnya."
          },
          {
            "prefix": "10.2",
            "text": "Jika ketentuan di atas dilanggar maka Kontrak diputuskan sepihak oleh Pejabat Penandatangan Kontrak dan Penyedia dikenakan sanksi sebagaimana diatur dalam Pasal 43.2.",
            "fullText": "10.2 Jika ketentuan di atas dilanggar maka Kontrak diputuskan sepihak oleh Pejabat Penandatangan Kontrak dan Penyedia dikenakan sanksi sebagaimana diatur dalam Pasal 43.2."
          }
        ]
      },
      {
        "id": "ssuk-11",
        "pasal": 11,
        "judul": "Pengabaian",
        "nomorDanJudul": "11. Pengabaian",
        "paragraphs": [
          {
            "text": "Jika terjadi pengabaian oleh satu pihak terhadap pelanggaran ketentuan tertentu Kontrak oleh pihak yang lain maka pengabaian tersebut tidak menjadi pengabaian yang terus-menerus selama Masa Kontrak atau seketika menjadi pengabaian terhadap pelanggaran ketentuan yang lain. Pengabaian hanya dapat mengikat jika dapat dibuktikan secara tertulis dan ditandatangani oleh Wakil Sah Pihak yang melakukan pengabaian.",
            "fullText": "Jika terjadi pengabaian oleh satu pihak terhadap pelanggaran ketentuan tertentu Kontrak oleh pihak yang lain maka pengabaian tersebut tidak menjadi pengabaian yang terus-menerus selama Masa Kontrak atau seketika menjadi pengabaian terhadap pelanggaran ketentuan yang lain. Pengabaian hanya dapat mengikat jika dapat dibuktikan secara tertulis dan ditandatangani oleh Wakil Sah Pihak yang melakukan pengabaian."
          }
        ]
      },
      {
        "id": "ssuk-12",
        "pasal": 12,
        "judul": "Penyedia Mandiri",
        "nomorDanJudul": "12. Penyedia Mandiri",
        "paragraphs": [
          {
            "text": "Penyedia berdasarkan Kontrak ini bertanggung jawab penuh terhadap Tenaga Kerja Konstruksi dan subkontraktornya (jika ada) serta pekerjaan yang dilakukan oleh mereka.",
            "fullText": "Penyedia berdasarkan Kontrak ini bertanggung jawab penuh terhadap Tenaga Kerja Konstruksi dan subkontraktornya (jika ada) serta pekerjaan yang dilakukan oleh mereka."
          }
        ]
      },
      {
        "id": "ssuk-13",
        "pasal": 13,
        "judul": "Pengawasan Pelaksanaan Pekerjaan",
        "nomorDanJudul": "13. Pengawasan Pelaksanaan Pekerjaan",
        "paragraphs": [
          {
            "prefix": "13.1",
            "text": "Pejabat Penandatangan Kontrak menetapkan Pengawas Pekerjaan untuk melakukan pengawasan pelaksanaan pekerjaan sesuai Kontrak ini. Pengawas Pekerjaan dapat berasal dari personel Pejabat Penandatangan Kontrak (Direksi Teknis) atau Penyedia Jasa Pengawasan (Konsultan Pengawas).",
            "fullText": "13.1 Pejabat Penandatangan Kontrak menetapkan Pengawas Pekerjaan untuk melakukan pengawasan pelaksanaan pekerjaan sesuai Kontrak ini. Pengawas Pekerjaan dapat berasal dari personel Pejabat Penandatangan Kontrak (Direksi Teknis) atau Penyedia Jasa Pengawasan (Konsultan Pengawas)."
          },
          {
            "prefix": "13.2",
            "text": "Dalam melaksanakan kewajibannya, Pengawas Pekerjaan bertindak profesional. Jika tercantum dalam SSKK, Pengawas Pekerjaan yang berasal dari Personel Pejabat Penandatangan Kontrak dapat bertindak sebagai Wakil Sah Pejabat Penandatangan Kontrak.",
            "fullText": "13.2 Dalam melaksanakan kewajibannya, Pengawas Pekerjaan bertindak profesional. Jika tercantum dalam SSKK, Pengawas Pekerjaan yang berasal dari Personel Pejabat Penandatangan Kontrak dapat bertindak sebagai Wakil Sah Pejabat Penandatangan Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-14",
        "pasal": 14,
        "judul": "Tugas dan Wewenang Pengawas Pekerjaan",
        "nomorDanJudul": "14. Tugas dan Wewenang Pengawas Pekerjaan",
        "paragraphs": [
          {
            "prefix": "14.1",
            "text": "Semua gambar dan rencana kerja yang digunakan dalam pelaksanaan pekerjaan sesuai Kontrak, untuk pekerjaan permanen maupun pekerjaan sementara mendapatkan persetujuan dari Pengawas Pekerjaan sesuai pelimpahan wewenang dari Pejabat Penandatangan Kontrak.",
            "fullText": "14.1 Semua gambar dan rencana kerja yang digunakan dalam pelaksanaan pekerjaan sesuai Kontrak, untuk pekerjaan permanen maupun pekerjaan sementara mendapatkan persetujuan dari Pengawas Pekerjaan sesuai pelimpahan wewenang dari Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "14.2",
            "text": "Jika dalam pelaksanaan pekerjaan ini diperlukan terlebih dahulu ada pekerjaan sementara yang tidak tercantum dalam Daftar Kuantitas dan Harga di dalam Kontrak maka Penyedia berkewajiban untuk menyerahkan spesifikasi dan gambar usulan pekerjaan sementara tersebut untuk mendapatkan pernyataan tidak berkeberatan (no objection) untuk dilaksanakan dari Pengawas Pekerjaan.",
            "fullText": "14.2 Jika dalam pelaksanaan pekerjaan ini diperlukan terlebih dahulu ada pekerjaan sementara yang tidak tercantum dalam Daftar Kuantitas dan Harga di dalam Kontrak maka Penyedia berkewajiban untuk menyerahkan spesifikasi dan gambar usulan pekerjaan sementara tersebut untuk mendapatkan pernyataan tidak berkeberatan (no objection) untuk dilaksanakan dari Pengawas Pekerjaan."
          },
          {
            "text": "Pernyataan tidak berkeberatan atas rencana pekerjaan sementara ini tidak melepaskan Penyedia dari tanggung jawabnya sesuai Kontrak.",
            "fullText": "Pernyataan tidak berkeberatan atas rencana pekerjaan sementara ini tidak melepaskan Penyedia dari tanggung jawabnya sesuai Kontrak."
          },
          {
            "prefix": "14.3",
            "text": "Pengawas Pekerjaan melaksanakan tugas dan wewenang paling sedikit meliputi:",
            "fullText": "14.3 Pengawas Pekerjaan melaksanakan tugas dan wewenang paling sedikit meliputi:"
          },
          {
            "prefix": "a.",
            "text": "mengevaluasi dan menyetujui rencana mutu pekerjaan konstruksi Penyedia Jasa pelaksana konstruksi;",
            "fullText": "a. mengevaluasi dan menyetujui rencana mutu pekerjaan konstruksi Penyedia Jasa pelaksana konstruksi;"
          },
          {
            "prefix": "b.",
            "text": "memberikan ijin dimulainya setiap tahapan pekerjaan;",
            "fullText": "b. memberikan ijin dimulainya setiap tahapan pekerjaan;"
          },
          {
            "prefix": "c.",
            "text": "memeriksa dan menyetujui kemajuan pelaksanaan Pekerjaan Konstruksi sesuai dengan ketentuan dalam Kontrak;",
            "fullText": "c. memeriksa dan menyetujui kemajuan pelaksanaan Pekerjaan Konstruksi sesuai dengan ketentuan dalam Kontrak;"
          },
          {
            "prefix": "d.",
            "text": "memeriksa dan menilai mutu dan keselamatan konstruksi terhadap hasil akhir pekerjaan;",
            "fullText": "d. memeriksa dan menilai mutu dan keselamatan konstruksi terhadap hasil akhir pekerjaan;"
          },
          {
            "prefix": "e.",
            "text": "menghentikan setiap pekerjaan yang tidak memenuhi persyaratan;",
            "fullText": "e. menghentikan setiap pekerjaan yang tidak memenuhi persyaratan;"
          },
          {
            "prefix": "f.",
            "text": "bertanggungjawab terhadap hasil pelaksanaan Pekerjaan Konstruksi sesuai tugas dan tanggungjawabnya;",
            "fullText": "f. bertanggungjawab terhadap hasil pelaksanaan Pekerjaan Konstruksi sesuai tugas dan tanggungjawabnya;"
          },
          {
            "prefix": "g.",
            "text": "memberikan laporan secara periodik kepada Pejabat Penandatangan Kontrak sesuai dengan ketentuan dalam Kontrak.",
            "fullText": "g. memberikan laporan secara periodik kepada Pejabat Penandatangan Kontrak sesuai dengan ketentuan dalam Kontrak."
          },
          {
            "prefix": "14.4",
            "text": "Dalam hal Pengawas Pekerjaan melaksanakan tugas dan wewenang sebagaimana yang dimaksud pada Pasal 14.3 yang akan mempengaruhi ketentuan atau persyaratan dalam kontrak maka Pengawas Pekerjaan terlebih dahulu mendapatkan persetujuan dari Pejabat Penandatangan Kontrak.",
            "fullText": "14.4 Dalam hal Pengawas Pekerjaan melaksanakan tugas dan wewenang sebagaimana yang dimaksud pada Pasal 14.3 yang akan mempengaruhi ketentuan atau persyaratan dalam kontrak maka Pengawas Pekerjaan terlebih dahulu mendapatkan persetujuan dari Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "14.5",
            "text": "Penyedia berkewajiban untuk melaksanakan perintah Pengawas Pekerjaan yang sesuai dengan kewenangan Pengawas Pekerjaan dalam Kontrak ini.",
            "fullText": "14.5 Penyedia berkewajiban untuk melaksanakan perintah Pengawas Pekerjaan yang sesuai dengan kewenangan Pengawas Pekerjaan dalam Kontrak ini."
          }
        ]
      },
      {
        "id": "ssuk-15",
        "pasal": 15,
        "judul": "Penemuan-penemuan",
        "nomorDanJudul": "15. Penemuan-penemuan",
        "paragraphs": [
          {
            "text": "Penyedia wajib memberitahukan kepada Pejabat Penandatangan Kontrak dan kepada pihak yang berwenang semua penemuan benda/barang yang mempunyai nilai sejarah atau penemuan kekayaan di lokasi pekerjaan yang menurut peraturan perundang-undangan dikuasai oleh negara.",
            "fullText": "Penyedia wajib memberitahukan kepada Pejabat Penandatangan Kontrak dan kepada pihak yang berwenang semua penemuan benda/barang yang mempunyai nilai sejarah atau penemuan kekayaan di lokasi pekerjaan yang menurut peraturan perundang-undangan dikuasai oleh negara."
          }
        ]
      },
      {
        "id": "ssuk-16",
        "pasal": 16,
        "judul": "Akses ke Lokasi Kerja",
        "nomorDanJudul": "16. Akses ke Lokasi Kerja",
        "paragraphs": [
          {
            "prefix": "16.1",
            "text": "Penyedia berkewajiban untuk menjamin akses Pejabat Penandatangan Kontrak, Wakil Sah Pejabat Penandatangan Kontrak, Pengawas Pekerjaan dan/atau pihak yang mendapat izin dari Pejabat Penandatangan Kontrak ke lokasi kerja dan lokasi lainnya dimana pekerjaan ini sedang atau akan dilaksanakan.",
            "fullText": "16.1 Penyedia berkewajiban untuk menjamin akses Pejabat Penandatangan Kontrak, Wakil Sah Pejabat Penandatangan Kontrak, Pengawas Pekerjaan dan/atau pihak yang mendapat izin dari Pejabat Penandatangan Kontrak ke lokasi kerja dan lokasi lainnya dimana pekerjaan ini sedang atau akan dilaksanakan."
          },
          {
            "prefix": "16.2",
            "text": "Penyedia harus dianggap telah menerima kelayakan dan ketersediaan jalur akses menuju lapangan dan Penyedia harus berupaya menjaga setiap jalan atau jembatan dari kerusakan akibat penggunaan/lalu lintas Penyedia atau akibat personel Penyedia, maka:",
            "fullText": "16.2 Penyedia harus dianggap telah menerima kelayakan dan ketersediaan jalur akses menuju lapangan dan Penyedia harus berupaya menjaga setiap jalan atau jembatan dari kerusakan akibat penggunaan/lalu lintas Penyedia atau akibat personel Penyedia, maka:"
          },
          {
            "prefix": "a.",
            "text": "Penyedia harus bertanggung jawab atas pemeliharaan yang mungkin diperlukan akibat pengunaan jalur akses;",
            "fullText": "a. Penyedia harus bertanggung jawab atas pemeliharaan yang mungkin diperlukan akibat pengunaan jalur akses;"
          },
          {
            "prefix": "b.",
            "text": "Penyedia harus menyediakan rambu atau petunjuk sepanjang jalur akses, dan mendapatkan perizinan yang mungkin disyaratkan oleh otoritas terkait untuk penggunaan jalur, rambu, dan petunjuk;",
            "fullText": "b. Penyedia harus menyediakan rambu atau petunjuk sepanjang jalur akses, dan mendapatkan perizinan yang mungkin disyaratkan oleh otoritas terkait untuk penggunaan jalur, rambu, dan petunjuk;"
          },
          {
            "prefix": "c.",
            "text": "biaya karena ketidak layakan atau tidak tersedianya jalur akses untuk digunakan oleh Penyedia, harus ditanggung Penyedia; dan",
            "fullText": "c. biaya karena ketidak layakan atau tidak tersedianya jalur akses untuk digunakan oleh Penyedia, harus ditanggung Penyedia; dan"
          },
          {
            "prefix": "d.",
            "text": "Pejabat Penandatangan Kontrak  tidak bertanggung jawab atas klaim yang mungkin timbul akibat penggunaan jalur akses.",
            "fullText": "d. Pejabat Penandatangan Kontrak  tidak bertanggung jawab atas klaim yang mungkin timbul akibat penggunaan jalur akses."
          },
          {
            "prefix": "16.3",
            "text": "Dalam hal untuk menjamin ketersediaan jalan akses tersebut membutuhkan biaya  yang lebih besar dari biaya umum (overhead) dalam Penawaran Penyedia, maka Pejabat Penandatangan Kontrak dapat mengalokasikan biaya untuk penyediaan jalur akses tersebut di dalam Harga Kontrak.",
            "fullText": "16.3 Dalam hal untuk menjamin ketersediaan jalan akses tersebut membutuhkan biaya  yang lebih besar dari biaya umum (overhead) dalam Penawaran Penyedia, maka Pejabat Penandatangan Kontrak dapat mengalokasikan biaya untuk penyediaan jalur akses tersebut di dalam Harga Kontrak."
          },
          {
            "prefix": "16.4",
            "text": "Pejabat Penandatangan Kontrak tidak bertanggung jawab atas klaim yang mungkin timbul selain penggunaan jalur akses tersebut.",
            "fullText": "16.4 Pejabat Penandatangan Kontrak tidak bertanggung jawab atas klaim yang mungkin timbul selain penggunaan jalur akses tersebut."
          }
        ]
      }
    ]
  },
  {
    "id": "ssuk-sec-b",
    "huruf": "B",
    "judul": "PELAKSANAAN, PENYELESAIAN, ADENDUM DAN PEMUTUSAN KONTRAK",
    "nomorDanJudul": "B. PELAKSANAAN, PENYELESAIAN, ADENDUM DAN PEMUTUSAN KONTRAK",
    "clauses": [
      {
        "id": "ssuk-17",
        "pasal": 17,
        "judul": "Masa Kontrak",
        "nomorDanJudul": "17. Masa Kontrak",
        "paragraphs": [
          {
            "text": "Kontrak ini berlaku efektif sejak penandatangananan Surat Perjanjian oleh Para Pihak sampai dengan Tanggal Penyerahan Akhir Pekerjaan dan hak dan kewajiban Para Pihak yang terdapat dalam Kontrak sudah terpenuhi.",
            "fullText": "Kontrak ini berlaku efektif sejak penandatangananan Surat Perjanjian oleh Para Pihak sampai dengan Tanggal Penyerahan Akhir Pekerjaan dan hak dan kewajiban Para Pihak yang terdapat dalam Kontrak sudah terpenuhi."
          }
        ]
      },
      {
        "id": "ssuk-18",
        "pasal": 18,
        "subBab": "B.1 Pelaksanaan Pekerjaan",
        "judul": "Penyerahan Lokasi Kerja dan Personel",
        "nomorDanJudul": "18. Penyerahan Lokasi Kerja dan Personel",
        "paragraphs": [
          {
            "prefix": "18.1",
            "text": "Sebelum penyerahan lokasi kerja, dilakukan peninjauan lapangan bersama oleh para pihak.",
            "fullText": "18.1 Sebelum penyerahan lokasi kerja, dilakukan peninjauan lapangan bersama oleh para pihak."
          },
          {
            "prefix": "18.2",
            "text": "Pejabat Penandatangan Kontrak berkewajiban untuk menyerahkan lokasi kerja sesuai dengan kebutuhan Penyedia yang tercantum dalam rencana penyerahan lokasi kerja yang telah disepakati oleh para pihak dalam Rapat Persiapan Penandatanganan Kontrak, untuk melaksanakan pekerjaan tanpa ada hambatan kepada Penyedia sebelum SPMK diterbitkan.",
            "fullText": "18.2 Pejabat Penandatangan Kontrak berkewajiban untuk menyerahkan lokasi kerja sesuai dengan kebutuhan Penyedia yang tercantum dalam rencana penyerahan lokasi kerja yang telah disepakati oleh para pihak dalam Rapat Persiapan Penandatanganan Kontrak, untuk melaksanakan pekerjaan tanpa ada hambatan kepada Penyedia sebelum SPMK diterbitkan."
          },
          {
            "prefix": "18.3",
            "text": "Hasil peninjauan dan penyerahan dituangkan dalam Berita Acara Penyerahan Lokasi Kerja.",
            "fullText": "18.3 Hasil peninjauan dan penyerahan dituangkan dalam Berita Acara Penyerahan Lokasi Kerja."
          },
          {
            "prefix": "18.4",
            "text": "Jika dalam peninjauan lapangan bersama ditemukan hal-hal yang dapat mengakibatkan perubahan isi Kontrak maka perubahan tersebut harus dituangkan dalam Berita Acara Penyerahan Lokasi Kerja yang selanjutnya akan dituangkan dalam addendum kontrak.",
            "fullText": "18.4 Jika dalam peninjauan lapangan bersama ditemukan hal-hal yang dapat mengakibatkan perubahan isi Kontrak maka perubahan tersebut harus dituangkan dalam Berita Acara Penyerahan Lokasi Kerja yang selanjutnya akan dituangkan dalam addendum kontrak."
          },
          {
            "prefix": "18.5",
            "text": "Jika Pejabat Penandatangan Kontrak tidak dapat menyerahkan lokasi kerja sesuai kebutuhan Penyedia yang untuk mulai bekerja pada Tanggal Mulai Kerja untuk melaksanakan pekerjaan dan terbukti merupakan suatu hambatan yang disebabkan oleh Pejabat Penandatangan Kontrak, maka kondisi ini ditetapkan sebagai Peristiwa Kompensasi.",
            "fullText": "18.5 Jika Pejabat Penandatangan Kontrak tidak dapat menyerahkan lokasi kerja sesuai kebutuhan Penyedia yang untuk mulai bekerja pada Tanggal Mulai Kerja untuk melaksanakan pekerjaan dan terbukti merupakan suatu hambatan yang disebabkan oleh Pejabat Penandatangan Kontrak, maka kondisi ini ditetapkan sebagai Peristiwa Kompensasi."
          },
          {
            "prefix": "18.6",
            "text": "Penyedia menyerahkan Personel dengan memenuhi ketentuan sebagai berikut:",
            "fullText": "18.6 Penyedia menyerahkan Personel dengan memenuhi ketentuan sebagai berikut:"
          },
          {
            "prefix": "a.",
            "text": "bukti sertifikat kompetensi:",
            "fullText": "a. bukti sertifikat kompetensi:"
          },
          {
            "prefix": "1)",
            "text": "personel manajerial pada Pekerjaan Konstruksi; atau",
            "fullText": "1) personel manajerial pada Pekerjaan Konstruksi; atau"
          },
          {
            "prefix": "2)",
            "text": "personel inti pada Jasa Konsultansi Konstruksi;",
            "fullText": "2) personel inti pada Jasa Konsultansi Konstruksi;"
          },
          {
            "prefix": "b.",
            "text": "bukti sertifikat kompetensi sebagaimana dimaksud dalam huruf a dilaksanakan dengan menghadirkan personel yang bersangkutan;",
            "fullText": "b. bukti sertifikat kompetensi sebagaimana dimaksud dalam huruf a dilaksanakan dengan menghadirkan personel yang bersangkutan;"
          },
          {
            "prefix": "c.",
            "text": "melakukan sertifikasi bagi operator, teknisi, atau analis yang belum bersertifikat pada saat pelaksanaan pekerjaan; dan",
            "fullText": "c. melakukan sertifikasi bagi operator, teknisi, atau analis yang belum bersertifikat pada saat pelaksanaan pekerjaan; dan"
          },
          {
            "prefix": "d.",
            "text": "pelaksanaan alih pengalaman/keahlian bidang konstruksi melalui sistem kerja praktik/magang, membahas paling sedikit terkait jumlah peserta, durasi pelaksanaan, dan jenis keahlian.",
            "fullText": "d. pelaksanaan alih pengalaman/keahlian bidang konstruksi melalui sistem kerja praktik/magang, membahas paling sedikit terkait jumlah peserta, durasi pelaksanaan, dan jenis keahlian."
          },
          {
            "prefix": "18.7",
            "text": "Apabila Penyedia tidak dapat menunjukan bukti sertifikat maka Pejabat Penandatangan Kontrak meminta Penyedia untuk mengganti personel yang memenuhi persyaratan yang sudah ditentukan. Penggantian personel harus dilakukan dalam jangka waktu mobilisasi dan sesuai dengan kesepakatan.",
            "fullText": "18.7 Apabila Penyedia tidak dapat menunjukan bukti sertifikat maka Pejabat Penandatangan Kontrak meminta Penyedia untuk mengganti personel yang memenuhi persyaratan yang sudah ditentukan. Penggantian personel harus dilakukan dalam jangka waktu mobilisasi dan sesuai dengan kesepakatan."
          }
        ]
      },
      {
        "id": "ssuk-19",
        "pasal": 19,
        "judul": "Surat Perintah Mulai Kerja (SPMK)",
        "nomorDanJudul": "19. Surat Perintah Mulai Kerja (SPMK)",
        "paragraphs": [
          {
            "prefix": "19.1",
            "text": "Pejabat Penandatangan Kontrak menerbitkan SPMK paling lambat 14 (empat belas) hari kerja sejak tanggal penandatangananan Kontrak atau 14 (empat belas) hari kerja sejak penyerahan lokasi kerja pertama kali.",
            "fullText": "19.1 Pejabat Penandatangan Kontrak menerbitkan SPMK paling lambat 14 (empat belas) hari kerja sejak tanggal penandatangananan Kontrak atau 14 (empat belas) hari kerja sejak penyerahan lokasi kerja pertama kali."
          },
          {
            "prefix": "19.2",
            "text": "Dalam SPMK dicantumkan seluruh lingkup pekerjaan dan Tanggal Mulai Kerja.",
            "fullText": "19.2 Dalam SPMK dicantumkan seluruh lingkup pekerjaan dan Tanggal Mulai Kerja."
          }
        ]
      },
      {
        "id": "ssuk-20",
        "pasal": 20,
        "judul": "Rencana Mutu Pekerjaan Konstruksi (RMPK)",
        "nomorDanJudul": "20. Rencana Mutu Pekerjaan Konstruksi (RMPK)",
        "paragraphs": [
          {
            "prefix": "20.1",
            "text": "Penyedia berkewajiban untuk mempresentasikan dan menyerahkan RMPK sebagai penjaminan dan pengendalian mutu pelaksanaan pekerjaan pada rapat persiapan pelaksanaan Kontrak, kemudian dibahas dan disetujui oleh Pejabat Penandatangan Kontrak.",
            "fullText": "20.1 Penyedia berkewajiban untuk mempresentasikan dan menyerahkan RMPK sebagai penjaminan dan pengendalian mutu pelaksanaan pekerjaan pada rapat persiapan pelaksanaan Kontrak, kemudian dibahas dan disetujui oleh Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "20.2",
            "text": "RMPK disusun paling sedikit berisi:",
            "fullText": "20.2 RMPK disusun paling sedikit berisi:"
          },
          {
            "prefix": "a.",
            "text": "Rencana Pelaksanaan Pekerjaan (Work Method Statement);",
            "fullText": "a. Rencana Pelaksanaan Pekerjaan (Work Method Statement);"
          },
          {
            "prefix": "b.",
            "text": "Rencana Pemeriksaan dan Pengujian/Inspection and Test Plan (ITP);",
            "fullText": "b. Rencana Pemeriksaan dan Pengujian/Inspection and Test Plan (ITP);"
          },
          {
            "prefix": "c.",
            "text": "Pengendalian Subkontraktor dan Pemasok.",
            "fullText": "c. Pengendalian Subkontraktor dan Pemasok."
          },
          {
            "prefix": "20.3",
            "text": "Penyedia wajib menerapkan dan mengendalikan pelaksanaan RMPK secara konsisten untuk mencapai mutu yang dipersyaratkan pada pelaksanaan pekerjaan ini.",
            "fullText": "20.3 Penyedia wajib menerapkan dan mengendalikan pelaksanaan RMPK secara konsisten untuk mencapai mutu yang dipersyaratkan pada pelaksanaan pekerjaan ini."
          },
          {
            "prefix": "20.4",
            "text": "RMPK dapat direvisi sesuai dengan kondisi pekerjaan.",
            "fullText": "20.4 RMPK dapat direvisi sesuai dengan kondisi pekerjaan."
          },
          {
            "prefix": "20.5",
            "text": "Penyedia berkewajiban untuk memutakhirkan RMPK jika terjadi Adendum Kontrak dan/atau Peristiwa Kompensasi.",
            "fullText": "20.5 Penyedia berkewajiban untuk memutakhirkan RMPK jika terjadi Adendum Kontrak dan/atau Peristiwa Kompensasi."
          },
          {
            "prefix": "20.6",
            "text": "Pemutakhiran RMPK harus menunjukan perkembangan kemajuan setiap pekerjaan dan dampaknya terhadap penjadwalan sisa pekerjaan, termasuk perubahan terhadap urutan pekerjaan. Pemutakhiran RMPK harus mendapatkan persetujuan Pejabat Penandatangan Kontrak.",
            "fullText": "20.6 Pemutakhiran RMPK harus menunjukan perkembangan kemajuan setiap pekerjaan dan dampaknya terhadap penjadwalan sisa pekerjaan, termasuk perubahan terhadap urutan pekerjaan. Pemutakhiran RMPK harus mendapatkan persetujuan Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "20.7",
            "text": "Persetujuan Pejabat Penandatangan Kontrak terhadap RMPK tidak mengubah kewajiban kontraktual Penyedia.",
            "fullText": "20.7 Persetujuan Pejabat Penandatangan Kontrak terhadap RMPK tidak mengubah kewajiban kontraktual Penyedia."
          }
        ]
      },
      {
        "id": "ssuk-21",
        "pasal": 21,
        "judul": "Rencana Keselamatan Konstruksi (RKK)",
        "nomorDanJudul": "21. Rencana Keselamatan Konstruksi (RKK)",
        "paragraphs": [
          {
            "prefix": "21.1",
            "text": "Penyedia berkewajiban untuk mempresentasikan dan menyerahkan RKK pada saat rapat persiapan pelaksanaan Kontrak, kemudian pelaksanaan RKK dibahas dan disetujui oleh Pejabat Penandatangan Kontrak.",
            "fullText": "21.1 Penyedia berkewajiban untuk mempresentasikan dan menyerahkan RKK pada saat rapat persiapan pelaksanaan Kontrak, kemudian pelaksanaan RKK dibahas dan disetujui oleh Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "21.2",
            "text": "Para Pihak wajib menerapkan dan mengendalikan pelaksanaan RKK secara konsisten.",
            "fullText": "21.2 Para Pihak wajib menerapkan dan mengendalikan pelaksanaan RKK secara konsisten."
          },
          {
            "prefix": "21.3",
            "text": "RKK menjadi bagian dari Dokumen Kontrak.",
            "fullText": "21.3 RKK menjadi bagian dari Dokumen Kontrak."
          },
          {
            "prefix": "21.4",
            "text": "Penyedia berkewajiban untuk memutakhirkan RKK sesuai dengan kondisi pekerjaan, jika terjadi perubahan maka dituangkan dalam adendum Kontrak.",
            "fullText": "21.4 Penyedia berkewajiban untuk memutakhirkan RKK sesuai dengan kondisi pekerjaan, jika terjadi perubahan maka dituangkan dalam adendum Kontrak."
          },
          {
            "prefix": "21.5",
            "text": "Pemutakhiran RKK harus mendapat persetujuan Pejabat Penandatangan Kontrak.",
            "fullText": "21.5 Pemutakhiran RKK harus mendapat persetujuan Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "21.6",
            "text": "Persetujuan Pejabat Penandatangan Kontrak terhadap pelaksanaan RKK tidak mengubah kewajiban kontraktual Penyedia.",
            "fullText": "21.6 Persetujuan Pejabat Penandatangan Kontrak terhadap pelaksanaan RKK tidak mengubah kewajiban kontraktual Penyedia."
          }
        ]
      },
      {
        "id": "ssuk-22",
        "pasal": 22,
        "judul": "Rapat Persiapan Pelaksanaan Kontrak",
        "nomorDanJudul": "22. Rapat Persiapan Pelaksanaan Kontrak",
        "paragraphs": [
          {
            "prefix": "22.1",
            "text": "Paling lambat 7 (tujuh) hari kalender sejak diterbitkannya SPMK dan sebelum pelaksanaan pekerjaan, Pejabat Penandatangan Kontrak bersama dengan Penyedia, unsur perancangan, dan unsur pengawasan, harus sudah menyelenggarakan rapat persiapan pelaksanaan kontrak.",
            "fullText": "22.1 Paling lambat 7 (tujuh) hari kalender sejak diterbitkannya SPMK dan sebelum pelaksanaan pekerjaan, Pejabat Penandatangan Kontrak bersama dengan Penyedia, unsur perancangan, dan unsur pengawasan, harus sudah menyelenggarakan rapat persiapan pelaksanaan kontrak."
          },
          {
            "prefix": "22.2",
            "text": "Beberapa hal yang dibahas dan disepakati dalam rapat persiapan pelaksanaan kontrak meliputi:",
            "fullText": "22.2 Beberapa hal yang dibahas dan disepakati dalam rapat persiapan pelaksanaan kontrak meliputi:"
          },
          {
            "prefix": "a.",
            "text": "Penerapan SMKK:",
            "fullText": "a. Penerapan SMKK:"
          },
          {
            "prefix": "1)",
            "text": "RKK;",
            "fullText": "1) RKK;"
          },
          {
            "prefix": "2)",
            "text": "RMPK;",
            "fullText": "2) RMPK;"
          },
          {
            "prefix": "3)",
            "text": "Rencana Kerja Pengelolaan dan Pemantauan Lingkungan (RKPPL) (apabila ada); dan",
            "fullText": "3) Rencana Kerja Pengelolaan dan Pemantauan Lingkungan (RKPPL) (apabila ada); dan"
          },
          {
            "prefix": "4)",
            "text": "Rencana Manajemen Lalu Lintas (RMLL) (apabila ada);",
            "fullText": "4) Rencana Manajemen Lalu Lintas (RMLL) (apabila ada);"
          },
          {
            "prefix": "b.",
            "text": "Rencana Kerja;",
            "fullText": "b. Rencana Kerja;"
          },
          {
            "prefix": "c.",
            "text": "organisasi kerja;",
            "fullText": "c. organisasi kerja;"
          },
          {
            "prefix": "d.",
            "text": "tata cara pengaturan pelaksanaan pekerjaan termasuk permohonan persetujuan memulai pekerjaan;",
            "fullText": "d. tata cara pengaturan pelaksanaan pekerjaan termasuk permohonan persetujuan memulai pekerjaan;"
          },
          {
            "prefix": "e.",
            "text": "jadwal pelaksanaan pekerjaan, yang diikuti uraian tentang metode kerja yang memperhatikan Keselamatan Konstruksi;",
            "fullText": "e. jadwal pelaksanaan pekerjaan, yang diikuti uraian tentang metode kerja yang memperhatikan Keselamatan Konstruksi;"
          },
          {
            "prefix": "f.",
            "text": "jadwal pengadaan bahan/material, mobilisasi peralatan dan Tenaga Kerja Konstruksi;",
            "fullText": "f. jadwal pengadaan bahan/material, mobilisasi peralatan dan Tenaga Kerja Konstruksi;"
          },
          {
            "prefix": "g.",
            "text": "Subkontraktor yang akan melaksanakan bagian pekerjaan dengan ketentuan berdasarkan daftar pekerjaan yang disubkontrakkan dan subkontraktor dalam syarat-syarat khusus kontrak:",
            "fullText": "g. Subkontraktor yang akan melaksanakan bagian pekerjaan dengan ketentuan berdasarkan daftar pekerjaan yang disubkontrakkan dan subkontraktor dalam syarat-syarat khusus kontrak:"
          },
          {
            "prefix": "1)",
            "text": "Untuk pekerjaan utama, dilakukan klarifikasi terhadap kesesuaian pekerjaan yang disubkontrakkan dan subklasifikasi SBU subpenyedia jasa spesialis yang dinominasikan; dan/atau",
            "fullText": "1) Untuk pekerjaan utama, dilakukan klarifikasi terhadap kesesuaian pekerjaan yang disubkontrakkan dan subklasifikasi SBU subpenyedia jasa spesialis yang dinominasikan; dan/atau"
          },
          {
            "prefix": "2)",
            "text": "Untuk pekerjaan yang bukan pekerjaan utama, dilakukan klarifikasi terhadap kesesuaian pekerjaan yang disubkontrakkan, kesesuaian kualifikasi usaha, dan kesesuaian lokasi/domisili usaha subpenyedia jasa usaha kualifikasi kecil yang dinominasikan.",
            "fullText": "2) Untuk pekerjaan yang bukan pekerjaan utama, dilakukan klarifikasi terhadap kesesuaian pekerjaan yang disubkontrakkan, kesesuaian kualifikasi usaha, dan kesesuaian lokasi/domisili usaha subpenyedia jasa usaha kualifikasi kecil yang dinominasikan."
          },
          {
            "text": "Dalam hal dalam klarifikasi ditemukan ketidak sesuaian, Penyedia wajib mengganti subkontraktor dan/atau bagian pekerjaan yang di subkontrakkan dengan persetujuan Pejabat Penandatangan Kontrak;",
            "fullText": "Dalam hal dalam klarifikasi ditemukan ketidak sesuaian, Penyedia wajib mengganti subkontraktor dan/atau bagian pekerjaan yang di subkontrakkan dengan persetujuan Pejabat Penandatangan Kontrak;"
          },
          {
            "prefix": "h.",
            "text": "Penggunaan Sistem Informasi Kontrak dan Manajemen Pengendalian Pelaksanaan Kontrak (SIKOMPAK) dalam pelaksanaan dan pengendalian kontrak; dan",
            "fullText": "h. Penggunaan Sistem Informasi Kontrak dan Manajemen Pengendalian Pelaksanaan Kontrak (SIKOMPAK) dalam pelaksanaan dan pengendalian kontrak; dan"
          },
          {
            "prefix": "i.",
            "text": "hal-hal lain yang dianggap perlu.",
            "fullText": "i. hal-hal lain yang dianggap perlu."
          },
          {
            "prefix": "22.3",
            "text": "Hasil rapat persiapan pelaksanaan Kontrak dituangkan dalam Berita Acara Rapat Persiapan Pelaksanaan Kontrak. Apabila dalam rapat persiapan pelaksanaan kontrak mengakibatkan perubahan isi Kontrak, maka harus dituangkan dalam adendum Kontrak.",
            "fullText": "22.3 Hasil rapat persiapan pelaksanaan Kontrak dituangkan dalam Berita Acara Rapat Persiapan Pelaksanaan Kontrak. Apabila dalam rapat persiapan pelaksanaan kontrak mengakibatkan perubahan isi Kontrak, maka harus dituangkan dalam adendum Kontrak."
          },
          {
            "prefix": "22.4",
            "text": "Pada tahapan rapat persiapan pelaksanaan Kontrak, PA/KPA dapat membentuk Pejabat/Panitia Peneliti Pelaksanaan Kontrak.",
            "fullText": "22.4 Pada tahapan rapat persiapan pelaksanaan Kontrak, PA/KPA dapat membentuk Pejabat/Panitia Peneliti Pelaksanaan Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-23",
        "pasal": 23,
        "judul": "Mobilisasi",
        "nomorDanJudul": "23. Mobilisasi",
        "paragraphs": [
          {
            "prefix": "23.1",
            "text": "Mobilisasi paling lambat harus sudah mulai dilaksanakan dalam waktu 30 (tiga puluh) hari kalender sejak diterbitkan SPMK, atau sesuai kebutuhan dan Rencana Kerja yang disepakati saat Rapat Persiapan Pelaksanaan Kontrak.",
            "fullText": "23.1 Mobilisasi paling lambat harus sudah mulai dilaksanakan dalam waktu 30 (tiga puluh) hari kalender sejak diterbitkan SPMK, atau sesuai kebutuhan dan Rencana Kerja yang disepakati saat Rapat Persiapan Pelaksanaan Kontrak."
          },
          {
            "prefix": "23.2",
            "text": "Mobilisasi dilakukan sesuai dengan lingkup pekerjaan,  yaitu :",
            "fullText": "23.2 Mobilisasi dilakukan sesuai dengan lingkup pekerjaan,  yaitu :"
          },
          {
            "prefix": "a.",
            "text": "mendatangkan peralatan-peralatan terkait yang diperlukan dalam pelaksanaan pekerjaan, termasuk instalasi alat;",
            "fullText": "a. mendatangkan peralatan-peralatan terkait yang diperlukan dalam pelaksanaan pekerjaan, termasuk instalasi alat;"
          },
          {
            "prefix": "b.",
            "text": "mempersiapkan fasilitas seperti kantor, rumah, gedung laboratorium, bengkel, gudang, dan sebagainya; dan/atau",
            "fullText": "b. mempersiapkan fasilitas seperti kantor, rumah, gedung laboratorium, bengkel, gudang, dan sebagainya; dan/atau"
          },
          {
            "prefix": "c.",
            "text": "mendatangkan Tenaga Kerja Konstruksi.",
            "fullText": "c. mendatangkan Tenaga Kerja Konstruksi."
          },
          {
            "prefix": "23.3",
            "text": "Mobilisasi peralatan dan kendaraan yang digunakan mematuhi peraturan perundangan terkait beban dan dimensi kendaraan.",
            "fullText": "23.3 Mobilisasi peralatan dan kendaraan yang digunakan mematuhi peraturan perundangan terkait beban dan dimensi kendaraan."
          },
          {
            "prefix": "23.4",
            "text": "Mobilisasi peralatan dan Tenaga Kerja Konstruksi dapat dilakukan secara bertahap sesuai dengan kebutuhan.",
            "fullText": "23.4 Mobilisasi peralatan dan Tenaga Kerja Konstruksi dapat dilakukan secara bertahap sesuai dengan kebutuhan."
          }
        ]
      },
      {
        "id": "ssuk-24",
        "pasal": 24,
        "judul": "Pengukuran /Pemeriksaan Bersama",
        "nomorDanJudul": "24. Pengukuran /Pemeriksaan Bersama",
        "paragraphs": [
          {
            "prefix": "24.1",
            "text": "Pada tahap awal pelaksanaan Kontrak, Pejabat Penandatangan Kontrak dan Pengawas Pekerjaan bersama-sama dengan Penyedia melakukan pengukuran dan pemeriksaan detail terhadap kondisi lokasi pekerjaan untuk setiap rencana mata pembayaran, Tenaga Kerja Konstruksi, dan Peralatan Utama (Mutual Check 0%).",
            "fullText": "24.1 Pada tahap awal pelaksanaan Kontrak, Pejabat Penandatangan Kontrak dan Pengawas Pekerjaan bersama-sama dengan Penyedia melakukan pengukuran dan pemeriksaan detail terhadap kondisi lokasi pekerjaan untuk setiap rencana mata pembayaran, Tenaga Kerja Konstruksi, dan Peralatan Utama (Mutual Check 0%)."
          },
          {
            "prefix": "24.2",
            "text": "Hasil pemeriksaan bersama dituangkan dalam Berita Acara. Apabila dalam pengukuran/pemeriksaan bersama mengakibatkan perubahan isi Kontrak, maka harus dituangkan dalam adendum Kontrak.",
            "fullText": "24.2 Hasil pemeriksaan bersama dituangkan dalam Berita Acara. Apabila dalam pengukuran/pemeriksaan bersama mengakibatkan perubahan isi Kontrak, maka harus dituangkan dalam adendum Kontrak."
          },
          {
            "prefix": "24.3",
            "text": "Tindak lanjut hasil pemeriksaan bersama Tenaga Kerja Konstruksi dan/atau Peralatan Utama mengikuti ketentuan Pasal 66 dan Pasal 67.",
            "fullText": "24.3 Tindak lanjut hasil pemeriksaan bersama Tenaga Kerja Konstruksi dan/atau Peralatan Utama mengikuti ketentuan Pasal 66 dan Pasal 67."
          }
        ]
      },
      {
        "id": "ssuk-25",
        "pasal": 25,
        "judul": "Penggunaan Produksi Dalam Negeri",
        "nomorDanJudul": "25. Penggunaan Produksi Dalam Negeri",
        "paragraphs": [
          {
            "prefix": "25.1",
            "text": "Dalam pelaksanaan pekerjaan ini, Penyedia berkewajiban mengutamakan material/bahan produksi dalam negeri dan tenaga kerja Indonesia untuk pekerjaan yang dilaksanakan di Indonesia sesuai dengan yang disampaikan pada saat penawaran.",
            "fullText": "25.1 Dalam pelaksanaan pekerjaan ini, Penyedia berkewajiban mengutamakan material/bahan produksi dalam negeri dan tenaga kerja Indonesia untuk pekerjaan yang dilaksanakan di Indonesia sesuai dengan yang disampaikan pada saat penawaran."
          },
          {
            "prefix": "25.2",
            "text": "Dalam pelaksanaan Pekerjaan Konstruksi, bahan baku, Tenaga Kerja Konstruksi, dan perangkat lunak yang digunakan mengacu kepada dokumen:",
            "fullText": "25.2 Dalam pelaksanaan Pekerjaan Konstruksi, bahan baku, Tenaga Kerja Konstruksi, dan perangkat lunak yang digunakan mengacu kepada dokumen:"
          },
          {
            "prefix": "a.",
            "text": "formulir rekapitulasi perhitungan Tingkat Komponen Dalam Negeri (TKDN), untuk Penyedia yang mendapat preferensi harga;  dan",
            "fullText": "a. formulir rekapitulasi perhitungan Tingkat Komponen Dalam Negeri (TKDN), untuk Penyedia yang mendapat preferensi harga;  dan"
          },
          {
            "prefix": "b.",
            "text": "daftar barang yang diimpor, untuk barang yang diimpor.",
            "fullText": "b. daftar barang yang diimpor, untuk barang yang diimpor."
          },
          {
            "prefix": "25.3",
            "text": "Apabila dalam pelaksanaan pekerjaan ditemukan ketidaksesuaian dengan dokumen pada Pasal 25.2, maka akan dikenakan sanksi sesuai peraturan perundangan yang berlaku.",
            "fullText": "25.3 Apabila dalam pelaksanaan pekerjaan ditemukan ketidaksesuaian dengan dokumen pada Pasal 25.2, maka akan dikenakan sanksi sesuai peraturan perundangan yang berlaku."
          }
        ]
      },
      {
        "id": "ssuk-26",
        "pasal": 26,
        "subBab": "B.2 Pengendalian Waktu",
        "judul": "Masa Pelaksanaan",
        "nomorDanJudul": "26. Masa Pelaksanaan",
        "paragraphs": [
          {
            "prefix": "26.1",
            "text": "Kecuali Kontrak diputuskan lebih awal, Penyedia berkewajiban untuk memulai pelaksanaan pekerjaan pada Tanggal Mulai Kerja, dan melaksanakan pekerjaan sesuai dengan RMPK, serta menyelesaikan pekerjaan paling lambat selama Masa Pelaksanaan yang dinyatakan dalam SSKK.",
            "fullText": "26.1 Kecuali Kontrak diputuskan lebih awal, Penyedia berkewajiban untuk memulai pelaksanaan pekerjaan pada Tanggal Mulai Kerja, dan melaksanakan pekerjaan sesuai dengan RMPK, serta menyelesaikan pekerjaan paling lambat selama Masa Pelaksanaan yang dinyatakan dalam SSKK."
          },
          {
            "prefix": "26.2",
            "text": "Apabila Penyedia berpendapat tidak dapat menyelesaikan pekerjaan sesuai Masa Pelaksanaan karena di luar pengendaliannya yang dapat dibuktikan demikian, dan Penyedia telah melaporkan kejadian tersebut kepada Pejabat Penandatangan Kontrak, dengan disertai bukti-bukti yang dapat disetujui Pejabat Penandatangan Kontrak, maka Pejabat Penandatangan Kontrak dapat memberlakukan Peristiwa Kompensasi dan melakukan penjadwalan kembali pelaksanaan tugas Penyedia dengan membuat adendum Kontrak.",
            "fullText": "26.2 Apabila Penyedia berpendapat tidak dapat menyelesaikan pekerjaan sesuai Masa Pelaksanaan karena di luar pengendaliannya yang dapat dibuktikan demikian, dan Penyedia telah melaporkan kejadian tersebut kepada Pejabat Penandatangan Kontrak, dengan disertai bukti-bukti yang dapat disetujui Pejabat Penandatangan Kontrak, maka Pejabat Penandatangan Kontrak dapat memberlakukan Peristiwa Kompensasi dan melakukan penjadwalan kembali pelaksanaan tugas Penyedia dengan membuat adendum Kontrak."
          },
          {
            "prefix": "26.3",
            "text": "Jika pekerjaan tidak selesai sesuai Masa Pelaksanaan bukan akibat Keadaan Kahar atau Peristiwa Kompensasi atau karena kesalahan atau kelalaian Penyedia maka Penyedia dikenakan denda.",
            "fullText": "26.3 Jika pekerjaan tidak selesai sesuai Masa Pelaksanaan bukan akibat Keadaan Kahar atau Peristiwa Kompensasi atau karena kesalahan atau kelalaian Penyedia maka Penyedia dikenakan denda."
          },
          {
            "prefix": "26.4",
            "text": "Apabila diberlakukan serah terima sebagian pekerjaan (secara parsial), Masa Pelaksanaan dibuat berdasarkan bagian pekerjaan tersebut sesuai dengan SSKK.",
            "fullText": "26.4 Apabila diberlakukan serah terima sebagian pekerjaan (secara parsial), Masa Pelaksanaan dibuat berdasarkan bagian pekerjaan tersebut sesuai dengan SSKK."
          },
          {
            "prefix": "26.5",
            "text": "Bagian pekerjaan pada Pasal 26.4 adalah bagian pekerjaan yang telah ditetapkan dalam Dokumen Kompetisi untuk e-purchasing dengan metode Mini-Kompetisi.",
            "fullText": "26.5 Bagian pekerjaan pada Pasal 26.4 adalah bagian pekerjaan yang telah ditetapkan dalam Dokumen Kompetisi untuk e-purchasing dengan metode Mini-Kompetisi."
          }
        ]
      },
      {
        "id": "ssuk-27",
        "pasal": 27,
        "judul": "Penundaan Oleh Pegawas Pekerjaan",
        "nomorDanJudul": "27. Penundaan Oleh Pegawas Pekerjaan",
        "paragraphs": [
          {
            "text": "Pengawas Pekerjaan dapat memerintahkan secara tertulis Penyedia untuk menunda pelaksanaan pekerjaan. Setiap perintah penundaan ini harus mendapatkan persetujuan dari Pejabat Penandatangan Kontrak.",
            "fullText": "Pengawas Pekerjaan dapat memerintahkan secara tertulis Penyedia untuk menunda pelaksanaan pekerjaan. Setiap perintah penundaan ini harus mendapatkan persetujuan dari Pejabat Penandatangan Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-28",
        "pasal": 28,
        "judul": "Rapat Pemantauan",
        "nomorDanJudul": "28. Rapat Pemantauan",
        "paragraphs": [
          {
            "prefix": "28.1",
            "text": "Pengawas Pekerjaan atau Penyedia dapat menyelenggarakan rapat pemantauan, dan meminta satu sama lain untuk menghadiri rapat tersebut. Rapat pemantauan diselenggarakan untuk membahas perkembangan pekerjaan dan perencanaan atas sisa pekerjaan serta untuk menindaklanjuti peringatan dini.",
            "fullText": "28.1 Pengawas Pekerjaan atau Penyedia dapat menyelenggarakan rapat pemantauan, dan meminta satu sama lain untuk menghadiri rapat tersebut. Rapat pemantauan diselenggarakan untuk membahas perkembangan pekerjaan dan perencanaan atas sisa pekerjaan serta untuk menindaklanjuti peringatan dini."
          },
          {
            "prefix": "28.2",
            "text": "Hasil rapat pemantauan akan dituangkan oleh Pengawas Pekerjaan dalam berita acara rapat, dan rekamannya diserahkan kepada Pejabat Penandatangan Kontrak dan pihak-pihak yang menghadiri rapat.",
            "fullText": "28.2 Hasil rapat pemantauan akan dituangkan oleh Pengawas Pekerjaan dalam berita acara rapat, dan rekamannya diserahkan kepada Pejabat Penandatangan Kontrak dan pihak-pihak yang menghadiri rapat."
          },
          {
            "prefix": "28.3",
            "text": "Mengenai hal-hal dalam rapat yang perlu diputuskan, Pengawas Pekerjaan dapat memutuskan baik dalam rapat atau setelah rapat melalui pernyataan tertulis kepada semua pihak yang menghadiri rapat.",
            "fullText": "28.3 Mengenai hal-hal dalam rapat yang perlu diputuskan, Pengawas Pekerjaan dapat memutuskan baik dalam rapat atau setelah rapat melalui pernyataan tertulis kepada semua pihak yang menghadiri rapat."
          }
        ]
      },
      {
        "id": "ssuk-29",
        "pasal": 29,
        "judul": "Peringatan Dini",
        "nomorDanJudul": "29. Peringatan Dini",
        "paragraphs": [
          {
            "prefix": "29.1",
            "text": "Penyedia berkewajiban untuk memperingatkan sedini mungkin Pengawas Pekerjaan dengan tembusan kepada Pejabat Penandatangan Kontrak atas peristiwa atau kondisi tertentu yang dapat mempengaruhi mutu pekerjaan, menaikkan Harga Kontrak atau menunda penyelesaian pekerjaan. Pengawas Pekerjaan dapat memerintahkan Penyedia untuk menyampaikan secara tertulis perkiraan dampak peristiwa atau kondisi tersebut di atas terhadap Harga Kontrak dan Masa Pelaksanaan. Pernyataan perkiraan ini harus sesegera mungkin disampaikan oleh Penyedia.",
            "fullText": "29.1 Penyedia berkewajiban untuk memperingatkan sedini mungkin Pengawas Pekerjaan dengan tembusan kepada Pejabat Penandatangan Kontrak atas peristiwa atau kondisi tertentu yang dapat mempengaruhi mutu pekerjaan, menaikkan Harga Kontrak atau menunda penyelesaian pekerjaan. Pengawas Pekerjaan dapat memerintahkan Penyedia untuk menyampaikan secara tertulis perkiraan dampak peristiwa atau kondisi tersebut di atas terhadap Harga Kontrak dan Masa Pelaksanaan. Pernyataan perkiraan ini harus sesegera mungkin disampaikan oleh Penyedia."
          },
          {
            "prefix": "29.2",
            "text": "Penyedia berkewajiban untuk bekerja sama dengan Pengawas Pekerjaan untuk mencegah atau mengurangi dampak peristiwa atau kondisi tersebut.",
            "fullText": "29.2 Penyedia berkewajiban untuk bekerja sama dengan Pengawas Pekerjaan untuk mencegah atau mengurangi dampak peristiwa atau kondisi tersebut."
          }
        ]
      },
      {
        "id": "ssuk-30",
        "pasal": 30,
        "judul": "Keterlambatan Pelaksanaan Pekerjaan dan Kontrak Kritis",
        "nomorDanJudul": "30. Keterlambatan Pelaksanaan Pekerjaan dan Kontrak Kritis",
        "paragraphs": [
          {
            "prefix": "30.1",
            "text": "Apabila Penyedia terlambat melaksanakan pekerjaan sesuai jadwal, maka Pejabat Penandatangan Kontrak harus memberikan peringatan secara tertulis atau memberlakukan ketentuan kontrak kritis.",
            "fullText": "30.1 Apabila Penyedia terlambat melaksanakan pekerjaan sesuai jadwal, maka Pejabat Penandatangan Kontrak harus memberikan peringatan secara tertulis atau memberlakukan ketentuan kontrak kritis."
          },
          {
            "prefix": "30.2",
            "text": "Kontrak dinyatakan kritis apabila:",
            "fullText": "30.2 Kontrak dinyatakan kritis apabila:"
          },
          {
            "prefix": "a.",
            "text": "Dalam periode I (rencana fisik pelaksanaan 0% - 70% dari Kontrak), selisih keterlambatan antara realisasi fisik pelaksanaan dengan rencana lebih besar 10%",
            "fullText": "a. Dalam periode I (rencana fisik pelaksanaan 0% - 70% dari Kontrak), selisih keterlambatan antara realisasi fisik pelaksanaan dengan rencana lebih besar 10%"
          },
          {
            "prefix": "b.",
            "text": "Dalam periode II (rencana fisik pelaksanaan 70% - 100%  dari Kontrak), selisih keterlambatan antara realisasi fisik pelaksanaan dengan rencana lebih besar 5%;",
            "fullText": "b. Dalam periode II (rencana fisik pelaksanaan 70% - 100%  dari Kontrak), selisih keterlambatan antara realisasi fisik pelaksanaan dengan rencana lebih besar 5%;"
          },
          {
            "prefix": "c.",
            "text": "Dalam periode II (rencana fisik pelaksanaan 70% - 100% dari Kontrak), selisih keterlambatan antara realisasi fisik pelaksanaan dengan rencana pelaksanaan kurang dari 5% dan akan melampaui tahun anggaran berjalan.",
            "fullText": "c. Dalam periode II (rencana fisik pelaksanaan 70% - 100% dari Kontrak), selisih keterlambatan antara realisasi fisik pelaksanaan dengan rencana pelaksanaan kurang dari 5% dan akan melampaui tahun anggaran berjalan."
          },
          {
            "prefix": "30.3",
            "text": "Penanganan kontrak kritis dilakukan dengan rapat pembuktian (show cause meeting/SCM)",
            "fullText": "30.3 Penanganan kontrak kritis dilakukan dengan rapat pembuktian (show cause meeting/SCM)"
          },
          {
            "prefix": "a.",
            "text": "Pada saat Kontrak dinyatakan kritis, Pejabat Penandatangan Kontrak berdasarkan laporan dari Pengawas Pekerjaan memberikan peringatan secara tertulis kepada Penyedia dan selanjutnya Pejabat Penandatangan Kontrak menyelenggarakan Rapat Pembuktian (SCM) Tahap I.",
            "fullText": "a. Pada saat Kontrak dinyatakan kritis, Pejabat Penandatangan Kontrak berdasarkan laporan dari Pengawas Pekerjaan memberikan peringatan secara tertulis kepada Penyedia dan selanjutnya Pejabat Penandatangan Kontrak menyelenggarakan Rapat Pembuktian (SCM) Tahap I."
          },
          {
            "prefix": "b.",
            "text": "Dalam SCM Tahap I, Pejabat Penandatangan Kontrak, Pengawas Pekerjaan  dan Penyedia membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam periode waktu tertentu (uji coba pertama) yang dituangkan dalam Berita Acara SCM Tahap I.",
            "fullText": "b. Dalam SCM Tahap I, Pejabat Penandatangan Kontrak, Pengawas Pekerjaan  dan Penyedia membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam periode waktu tertentu (uji coba pertama) yang dituangkan dalam Berita Acara SCM Tahap I."
          },
          {
            "prefix": "c.",
            "text": "Apabila Penyedia gagal pada uji coba pertama, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis I dan harus diselenggarakan SCM Tahap II yang membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam waktu tertentu (uji coba kedua) yang dituangkan dalam Berita Acara SCM Tahap II.",
            "fullText": "c. Apabila Penyedia gagal pada uji coba pertama, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis I dan harus diselenggarakan SCM Tahap II yang membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam waktu tertentu (uji coba kedua) yang dituangkan dalam Berita Acara SCM Tahap II."
          },
          {
            "prefix": "d.",
            "text": "Apabila Penyedia gagal pada uji coba kedua, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis II dan harus diselenggarakan SCM Tahap III yang membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam waktu tertentu (uji coba ketiga) yang dituangkan dalam Berita Acara SCM Tahap III.",
            "fullText": "d. Apabila Penyedia gagal pada uji coba kedua, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis II dan harus diselenggarakan SCM Tahap III yang membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam waktu tertentu (uji coba ketiga) yang dituangkan dalam Berita Acara SCM Tahap III."
          },
          {
            "prefix": "e.",
            "text": "Apabila Penyedia gagal pada uji coba ketiga, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis III dan Pejabat Penandatangan Kontrak dapat melakukan pemutusan Kontrak secara sepihak dengan mengesampingkan Pasal 1266 dan 1267 Kitab Undang-Undang Hukum Perdata.",
            "fullText": "e. Apabila Penyedia gagal pada uji coba ketiga, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis III dan Pejabat Penandatangan Kontrak dapat melakukan pemutusan Kontrak secara sepihak dengan mengesampingkan Pasal 1266 dan 1267 Kitab Undang-Undang Hukum Perdata."
          },
          {
            "prefix": "30.4",
            "text": "Apabila uji coba berhasil, namun pada pelaksanaan pekerjaan selanjutnya Kontrak dinyatakan kritis lagi maka berlaku ketentuan SCM dari awal.",
            "fullText": "30.4 Apabila uji coba berhasil, namun pada pelaksanaan pekerjaan selanjutnya Kontrak dinyatakan kritis lagi maka berlaku ketentuan SCM dari awal."
          }
        ]
      },
      {
        "id": "ssuk-31",
        "pasal": 31,
        "judul": "Pemberian Kesempatan",
        "nomorDanJudul": "31. Pemberian Kesempatan",
        "paragraphs": [
          {
            "prefix": "31.1",
            "text": "Dalam hal diperkirakan Penyedia gagal menyelesaikan pekerjaan sampai Masa Pelaksanaan berakhir, namun Pejabat Penandatangan Kontrak menilai bahwa Penyedia mampu menyelesaikan pekerjaan, Pejabat Penandatangan Kontrak dapat memberikan kesempatan kepada Penyedia untuk menyelesaikan pekerjaan.",
            "fullText": "31.1 Dalam hal diperkirakan Penyedia gagal menyelesaikan pekerjaan sampai Masa Pelaksanaan berakhir, namun Pejabat Penandatangan Kontrak menilai bahwa Penyedia mampu menyelesaikan pekerjaan, Pejabat Penandatangan Kontrak dapat memberikan kesempatan kepada Penyedia untuk menyelesaikan pekerjaan."
          },
          {
            "prefix": "31.2",
            "text": "Hasil penilaian menjadi dasar bagi Pejabat Penandatangan Kontrak untuk:",
            "fullText": "31.2 Hasil penilaian menjadi dasar bagi Pejabat Penandatangan Kontrak untuk:"
          },
          {
            "prefix": "a.",
            "text": "Memberikan kesempatan kepada Penyedia untuk menyelesaikan pekerjaannya dengan ketentuan sebagai berikut:",
            "fullText": "a. Memberikan kesempatan kepada Penyedia untuk menyelesaikan pekerjaannya dengan ketentuan sebagai berikut:"
          },
          {
            "prefix": "1)",
            "text": "Pemberian kesempatan kepada Penyedia menyelesaikan pekerjaan sampai dengan 50 (lima  puluh) hari kalender.",
            "fullText": "1) Pemberian kesempatan kepada Penyedia menyelesaikan pekerjaan sampai dengan 50 (lima  puluh) hari kalender."
          },
          {
            "prefix": "2)",
            "text": "Dalam hal setelah diberikan kesempatan sebagaimana angka 1) diatas, Penyedia masih belum dapat menyelesaikan pekerjaan, Pejabat Penandatangan Kontrak dapat:",
            "fullText": "2) Dalam hal setelah diberikan kesempatan sebagaimana angka 1) diatas, Penyedia masih belum dapat menyelesaikan pekerjaan, Pejabat Penandatangan Kontrak dapat:"
          },
          {
            "prefix": "a)",
            "text": "Memberikan kesempatan kedua untuk penyelesaian sisa pekerjaan dengan jangka waktu sesuai kebutuhan; atau",
            "fullText": "a) Memberikan kesempatan kedua untuk penyelesaian sisa pekerjaan dengan jangka waktu sesuai kebutuhan; atau"
          },
          {
            "prefix": "b)",
            "text": "Melakukan pemutusan Kontrak dalam hal Penyedia dinilai tidak akan sanggup menyelesaikan pekerjaannya.",
            "fullText": "b) Melakukan pemutusan Kontrak dalam hal Penyedia dinilai tidak akan sanggup menyelesaikan pekerjaannya."
          },
          {
            "prefix": "3)",
            "text": "Pemberian kesempatan kepada Penyedia sebagaimana dimaksud pada angka 1) dan angka 2) huruf a), dituangkan dalam adendum kontrak yang di dalamnya mengatur pengenaan sanksi denda keterlambatan kepada Penyedia dan perpanjangan masa berlaku Jaminan Pelaksanaan (apabila ada).",
            "fullText": "3) Pemberian kesempatan kepada Penyedia sebagaimana dimaksud pada angka 1) dan angka 2) huruf a), dituangkan dalam adendum kontrak yang di dalamnya mengatur pengenaan sanksi denda keterlambatan kepada Penyedia dan perpanjangan masa berlaku Jaminan Pelaksanaan (apabila ada)."
          },
          {
            "prefix": "4)",
            "text": "Pemberian kesempatan kepada Penyedia untuk menyelesaikan pekerjaan dapat melampaui tahun anggaran.",
            "fullText": "4) Pemberian kesempatan kepada Penyedia untuk menyelesaikan pekerjaan dapat melampaui tahun anggaran."
          },
          {
            "prefix": "b.",
            "text": "Tidak memberikan kesempatan kepada Penyedia dan dilanjutkan dengan pemutusan kontrak serta pengenaan sanksi administratif dalam hal antara lain:",
            "fullText": "b. Tidak memberikan kesempatan kepada Penyedia dan dilanjutkan dengan pemutusan kontrak serta pengenaan sanksi administratif dalam hal antara lain:"
          },
          {
            "prefix": "1)",
            "text": "Penyedia dinilai tidak dapat menyelesaikan pekerjaan;",
            "fullText": "1) Penyedia dinilai tidak dapat menyelesaikan pekerjaan;"
          },
          {
            "prefix": "2)",
            "text": "Pekerjaan yang harus segera dipenuhi dan tidak dapat ditunda; atau",
            "fullText": "2) Pekerjaan yang harus segera dipenuhi dan tidak dapat ditunda; atau"
          },
          {
            "prefix": "3)",
            "text": "Penyedia menyatakan tidak sanggup menyelesaikan pekerjaan.",
            "fullText": "3) Penyedia menyatakan tidak sanggup menyelesaikan pekerjaan."
          },
          {
            "prefix": "31.3",
            "text": "Pemberian kesempatan kepada Penyedia untuk menyelesaikan pekerjaan dimuat dalam adendum Kontrak yang di dalamnya mengatur:",
            "fullText": "31.3 Pemberian kesempatan kepada Penyedia untuk menyelesaikan pekerjaan dimuat dalam adendum Kontrak yang di dalamnya mengatur:"
          },
          {
            "prefix": "a.",
            "text": "waktu pemberian kesempatan penyelesaian pekerjaan;",
            "fullText": "a. waktu pemberian kesempatan penyelesaian pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "pengenaan sanksi denda keterlambatan kepada Penyedia;",
            "fullText": "b. pengenaan sanksi denda keterlambatan kepada Penyedia;"
          },
          {
            "prefix": "c.",
            "text": "perpanjangan masa berlaku Jaminan Pelaksanaan; dan",
            "fullText": "c. perpanjangan masa berlaku Jaminan Pelaksanaan; dan"
          },
          {
            "prefix": "d.",
            "text": "sumber dana untuk membiayai penyelesaian sisa pekerjaan yang akan dilanjutkan ke Tahun Anggaran berikutnya dari DIPA Tahun Anggaran berikutnya, apabila pemberian kesempatan melampaui Tahun Anggaran.",
            "fullText": "d. sumber dana untuk membiayai penyelesaian sisa pekerjaan yang akan dilanjutkan ke Tahun Anggaran berikutnya dari DIPA Tahun Anggaran berikutnya, apabila pemberian kesempatan melampaui Tahun Anggaran."
          }
        ]
      },
      {
        "id": "ssuk-32",
        "pasal": 32,
        "subBab": "B.3 Penyelesaian Kontrak",
        "judul": "Serah Terima Pekerjaan",
        "nomorDanJudul": "32. Serah Terima Pekerjaan",
        "paragraphs": [
          {
            "prefix": "32.1",
            "text": "Setelah pekerjaan dan/atau bagian pekerjaan selesai, sesuai dengan ketentuan dalam Kontrak, Penyedia mengajukan permintaan secara tertulis kepada Pejabat Penandatangan Kontrak untuk serah terima pertama pekerjaan.",
            "fullText": "32.1 Setelah pekerjaan dan/atau bagian pekerjaan selesai, sesuai dengan ketentuan dalam Kontrak, Penyedia mengajukan permintaan secara tertulis kepada Pejabat Penandatangan Kontrak untuk serah terima pertama pekerjaan."
          },
          {
            "prefix": "32.2",
            "text": "Pejabat Penandatangan Kontrak memerintahkan Pengawas Pekerjaan untuk melakukan pemeriksaan dan/atau pengujian terhadap hasil pekerjaan.",
            "fullText": "32.2 Pejabat Penandatangan Kontrak memerintahkan Pengawas Pekerjaan untuk melakukan pemeriksaan dan/atau pengujian terhadap hasil pekerjaan."
          },
          {
            "prefix": "32.3",
            "text": "Pemeriksaan dan/atau pengujian dilakukan terhadap kesesuaian hasil pekerjaan terhadap kriteria/spesifikasi yang tercantum dalam Kontrak.",
            "fullText": "32.3 Pemeriksaan dan/atau pengujian dilakukan terhadap kesesuaian hasil pekerjaan terhadap kriteria/spesifikasi yang tercantum dalam Kontrak."
          },
          {
            "prefix": "32.4",
            "text": "Hasil pemeriksaan dan/atau pengujian dari Pengawas Pekerjaan disampaikan kepada Pejabat Penandatangan Kontrak, apabila dalam pemeriksaan hasil pekerjaan tidak sesuai dengan ketentuan yang tercantum dalam Kontrak dan/atau cacat hasil pekerjaan, Pejabat Penandatangan Kontrak memerintahkan Penyedia untuk memperbaiki dan/atau melengkapi kekurangan pekerjaan.",
            "fullText": "32.4 Hasil pemeriksaan dan/atau pengujian dari Pengawas Pekerjaan disampaikan kepada Pejabat Penandatangan Kontrak, apabila dalam pemeriksaan hasil pekerjaan tidak sesuai dengan ketentuan yang tercantum dalam Kontrak dan/atau cacat hasil pekerjaan, Pejabat Penandatangan Kontrak memerintahkan Penyedia untuk memperbaiki dan/atau melengkapi kekurangan pekerjaan."
          },
          {
            "prefix": "32.5",
            "text": "Apabila dalam pemeriksaan dan/atau pengujian hasil pekerjaan telah sesuai dengan ketentuan yang tercantum dalam Kontrak maka Pejabat Penandatangan Kontrak dan Penyedia menandatangani Berita Acara Serah Terima Pertama Pekerjaan.",
            "fullText": "32.5 Apabila dalam pemeriksaan dan/atau pengujian hasil pekerjaan telah sesuai dengan ketentuan yang tercantum dalam Kontrak maka Pejabat Penandatangan Kontrak dan Penyedia menandatangani Berita Acara Serah Terima Pertama Pekerjaan."
          },
          {
            "prefix": "32.6",
            "text": "Pembayaran dilakukan sebesar 95% (sembilan puluh lima persen) dari Harga Kontrak, sedangkan yang 5% (lima persen) merupakan retensi selama masa pemeliharaan, atau pembayaran dilakukan sebesar 100% (seratus persen) dari Harga Kontrak dan Penyedia harus menyerahkan Jaminan Pemeliharaan sebesar 5% (lima persen) dari Harga Kontrak.",
            "fullText": "32.6 Pembayaran dilakukan sebesar 95% (sembilan puluh lima persen) dari Harga Kontrak, sedangkan yang 5% (lima persen) merupakan retensi selama masa pemeliharaan, atau pembayaran dilakukan sebesar 100% (seratus persen) dari Harga Kontrak dan Penyedia harus menyerahkan Jaminan Pemeliharaan sebesar 5% (lima persen) dari Harga Kontrak."
          },
          {
            "prefix": "32.7",
            "text": "Penyedia wajib memelihara hasil pekerjaan selama Masa Pemeliharaan sehingga kondisi tetap seperti pada saat penyerahan pertama pekerjaan.",
            "fullText": "32.7 Penyedia wajib memelihara hasil pekerjaan selama Masa Pemeliharaan sehingga kondisi tetap seperti pada saat penyerahan pertama pekerjaan."
          },
          {
            "prefix": "32.8",
            "text": "Masa Pemeliharaan paling singkat untuk pekerjaan permanen selama 6 (enam) bulan, sedangkan untuk pekerjaan semi permanen selama 3 (tiga) bulan dan dapat melampaui Tahun Anggaran. Lamanya Masa Pemeliharaan ditetapkan dalam SSKK.",
            "fullText": "32.8 Masa Pemeliharaan paling singkat untuk pekerjaan permanen selama 6 (enam) bulan, sedangkan untuk pekerjaan semi permanen selama 3 (tiga) bulan dan dapat melampaui Tahun Anggaran. Lamanya Masa Pemeliharaan ditetapkan dalam SSKK."
          },
          {
            "prefix": "32.9",
            "text": "Setelah Masa Pemeliharaan berakhir, Penyedia mengajukan permintaan secara tertulis kepada Pejabat Penandatangan Kontrak untuk penyerahan akhir pekerjaan.",
            "fullText": "32.9 Setelah Masa Pemeliharaan berakhir, Penyedia mengajukan permintaan secara tertulis kepada Pejabat Penandatangan Kontrak untuk penyerahan akhir pekerjaan."
          },
          {
            "prefix": "32.10",
            "text": "Pejabat Penandatangan Kontrak setelah menerima pengajuan sebagaimana dimaksud pada Pasal 32.9 memerintahkan Pengawas Pekerjaan untuk melakukan pemeriksaan (dan pengujian apabila diperlukan) terhadap hasil pekerjaan.",
            "fullText": "32.10 Pejabat Penandatangan Kontrak setelah menerima pengajuan sebagaimana dimaksud pada Pasal 32.9 memerintahkan Pengawas Pekerjaan untuk melakukan pemeriksaan (dan pengujian apabila diperlukan) terhadap hasil pekerjaan."
          },
          {
            "prefix": "32.11",
            "text": "Apabila dalam pemeriksaan hasil pekerjaan, Penyedia telah melaksanakan semua kewajibannya selama Masa Pemeliharaan dengan baik dan telah sesuai dengan ketentuan yang tercantum dalam Kontrak maka Pejabat Penandatangan Kontrak dan Penyedia menandatangani Berita Acara Serah Terima Akhir Pekerjaan.",
            "fullText": "32.11 Apabila dalam pemeriksaan hasil pekerjaan, Penyedia telah melaksanakan semua kewajibannya selama Masa Pemeliharaan dengan baik dan telah sesuai dengan ketentuan yang tercantum dalam Kontrak maka Pejabat Penandatangan Kontrak dan Penyedia menandatangani Berita Acara Serah Terima Akhir Pekerjaan."
          },
          {
            "prefix": "32.12",
            "text": "Pejabat Penandatangan Kontrak wajib melakukan pembayaran sisa Harga Kontrak yang belum dibayar atau mengembalikan Jaminan Pemeliharaan.",
            "fullText": "32.12 Pejabat Penandatangan Kontrak wajib melakukan pembayaran sisa Harga Kontrak yang belum dibayar atau mengembalikan Jaminan Pemeliharaan."
          },
          {
            "prefix": "32.13",
            "text": "Apabila Penyedia tidak melaksanakan kewajiban pemeliharaan sebagaimana mestinya, maka Kontrak dapat diputuskan sepihak oleh Pejabat Penandatangan Kontrak dan Penyedia dikenakan sanksi sebagaimana diatur dalam Pasal 43.3.",
            "fullText": "32.13 Apabila Penyedia tidak melaksanakan kewajiban pemeliharaan sebagaimana mestinya, maka Kontrak dapat diputuskan sepihak oleh Pejabat Penandatangan Kontrak dan Penyedia dikenakan sanksi sebagaimana diatur dalam Pasal 43.3."
          },
          {
            "prefix": "32.14",
            "text": "Serah terima pekerjaan dapat dilakukan perbagian pekerjaan (secara parsial) yang ketentuannya ditetapkan dalam SSKK.",
            "fullText": "32.14 Serah terima pekerjaan dapat dilakukan perbagian pekerjaan (secara parsial) yang ketentuannya ditetapkan dalam SSKK."
          },
          {
            "prefix": "32.15",
            "text": "Bagian pekerjaan yang dapat dilakukan serah terima pekerjaan sebagian atau secara parsial yaitu:",
            "fullText": "32.15 Bagian pekerjaan yang dapat dilakukan serah terima pekerjaan sebagian atau secara parsial yaitu:"
          },
          {
            "prefix": "a.",
            "text": "bagian pekerjaan yang tidak tergantung satu sama lain; dan",
            "fullText": "a. bagian pekerjaan yang tidak tergantung satu sama lain; dan"
          },
          {
            "prefix": "b.",
            "text": "bagian pekerjaan yang fungsinya tidak terkait satu sama lain dalam pencapaian kinerja pekerjaan.",
            "fullText": "b. bagian pekerjaan yang fungsinya tidak terkait satu sama lain dalam pencapaian kinerja pekerjaan."
          },
          {
            "prefix": "32.16",
            "text": "Dalam hal dilakukan serah terima pekerjaan secara parsial, maka cara pembayaran, ketentuan denda dan kewajiban pemeliharaan tersebut di atas disesuaikan.",
            "fullText": "32.16 Dalam hal dilakukan serah terima pekerjaan secara parsial, maka cara pembayaran, ketentuan denda dan kewajiban pemeliharaan tersebut di atas disesuaikan."
          },
          {
            "prefix": "32.17",
            "text": "Kewajiban pemeliharaan diperhitungkan setelah serah terima pertama pekerjaan untuk bagian pekerjaan (PHO parsial) tersebut dilaksanakan sampai Masa Pemeliharaan bagian pekerjaan tersebut berakhir sebagaimana yang tercantum dalam SSKK.",
            "fullText": "32.17 Kewajiban pemeliharaan diperhitungkan setelah serah terima pertama pekerjaan untuk bagian pekerjaan (PHO parsial) tersebut dilaksanakan sampai Masa Pemeliharaan bagian pekerjaan tersebut berakhir sebagaimana yang tercantum dalam SSKK."
          },
          {
            "prefix": "32.18",
            "text": "Serah terima pertama pekerjaan untuk bagian pekerjaan  (PHO parsial) dituangkan dalam Berita Acara.",
            "fullText": "32.18 Serah terima pertama pekerjaan untuk bagian pekerjaan  (PHO parsial) dituangkan dalam Berita Acara."
          }
        ]
      },
      {
        "id": "ssuk-33",
        "pasal": 33,
        "judul": "Pengambilalihan",
        "nomorDanJudul": "33. Pengambilalihan",
        "paragraphs": [
          {
            "text": "Pejabat Penandatangan Kontrak akan mengambil alih lokasi dan hasil pekerjaan dalam jangka waktu tertentu setelah dikeluarkan surat keterangan selesai/pengakhiran pekerjaan.",
            "fullText": "Pejabat Penandatangan Kontrak akan mengambil alih lokasi dan hasil pekerjaan dalam jangka waktu tertentu setelah dikeluarkan surat keterangan selesai/pengakhiran pekerjaan."
          }
        ]
      },
      {
        "id": "ssuk-34",
        "pasal": 34,
        "judul": "Gambar As Built dan Pedoman Pengoperasian dan Perawatan/ Pemeliharaan",
        "nomorDanJudul": "34. Gambar As Built dan Pedoman Pengoperasian dan Perawatan/ Pemeliharaan",
        "paragraphs": [
          {
            "prefix": "34.1",
            "text": "Penyedia diwajibkan menyerahkan kepada Pejabat Penandatangan Kontrak Gambar As-built dan pedoman pengoperasian dan perawatan/pemeliharaan sesuai dengan SSKK.",
            "fullText": "34.1 Penyedia diwajibkan menyerahkan kepada Pejabat Penandatangan Kontrak Gambar As-built dan pedoman pengoperasian dan perawatan/pemeliharaan sesuai dengan SSKK."
          },
          {
            "prefix": "34.2",
            "text": "Apabila Penyedia tidak memberikan pedoman pengoperasian dan perawatan/pemeliharaan, Pejabat Penandatangan Kontrak berhak menahan uang retensi atau Jaminan Pemeliharaan.",
            "fullText": "34.2 Apabila Penyedia tidak memberikan pedoman pengoperasian dan perawatan/pemeliharaan, Pejabat Penandatangan Kontrak berhak menahan uang retensi atau Jaminan Pemeliharaan."
          }
        ]
      },
      {
        "id": "ssuk-35",
        "pasal": 35,
        "subBab": "B.4 Adendum",
        "judul": "Perubahan Kontrak",
        "nomorDanJudul": "35. Perubahan Kontrak",
        "paragraphs": [
          {
            "prefix": "35.1",
            "text": "Kontrak hanya dapat diubah melalui adendum Kontrak. Pejabat Penandatangan Kontrak perlu memastikan bahwa setiap perubahan kontrak dilakukan melalui adendum Kontrak dan telah diinput pada SIKOMPAK.",
            "fullText": "35.1 Kontrak hanya dapat diubah melalui adendum Kontrak. Pejabat Penandatangan Kontrak perlu memastikan bahwa setiap perubahan kontrak dilakukan melalui adendum Kontrak dan telah diinput pada SIKOMPAK."
          },
          {
            "prefix": "35.2",
            "text": "Seluruh bentuk perubahan Kontrak dilakukan melalui sistem Katalog Elektronik. Dalam hal belum tersedia dalam sistem, maka dilakukan di luar sistem Katalog Elektronik.",
            "fullText": "35.2 Seluruh bentuk perubahan Kontrak dilakukan melalui sistem Katalog Elektronik. Dalam hal belum tersedia dalam sistem, maka dilakukan di luar sistem Katalog Elektronik."
          },
          {
            "prefix": "35.3",
            "text": "Perubahan Kontrak dapat dilaksanakan apabila disetujui oleh para pihak, yang diakibatkan beberapa hal berikut meliputi:",
            "fullText": "35.3 Perubahan Kontrak dapat dilaksanakan apabila disetujui oleh para pihak, yang diakibatkan beberapa hal berikut meliputi:"
          },
          {
            "prefix": "a.",
            "text": "perubahan pekerjaan;",
            "fullText": "a. perubahan pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "perubahan Harga Kontrak;",
            "fullText": "b. perubahan Harga Kontrak;"
          },
          {
            "prefix": "c.",
            "text": "perubahan jadwal pelaksanaan pekerjaan dan/atau Masa Pelaksanaan;",
            "fullText": "c. perubahan jadwal pelaksanaan pekerjaan dan/atau Masa Pelaksanaan;"
          },
          {
            "prefix": "d.",
            "text": "perubahan personel manajerial dan/atau peralatan utama; dan/atau",
            "fullText": "d. perubahan personel manajerial dan/atau peralatan utama; dan/atau"
          },
          {
            "prefix": "e.",
            "text": "perubahan Kontrak yang disebabkan masalah administrasi.",
            "fullText": "e. perubahan Kontrak yang disebabkan masalah administrasi."
          },
          {
            "prefix": "35.4",
            "text": "Untuk kepentingan perubahan Kontrak, Pejabat Penandatangan Kontrak dapat meminta pertimbangan dari Pengawas Pekerjaan dan Pejabat/Panitia Peneliti Pelaksanaan Kontrak.",
            "fullText": "35.4 Untuk kepentingan perubahan Kontrak, Pejabat Penandatangan Kontrak dapat meminta pertimbangan dari Pengawas Pekerjaan dan Pejabat/Panitia Peneliti Pelaksanaan Kontrak."
          },
          {
            "prefix": "35.5",
            "text": "Pejabat/Panitia Peneliti Pelaksanaan Kontrak meneliti kelayakan perubahan kontrak",
            "fullText": "35.5 Pejabat/Panitia Peneliti Pelaksanaan Kontrak meneliti kelayakan perubahan kontrak"
          }
        ]
      },
      {
        "id": "ssuk-36",
        "pasal": 36,
        "judul": "Perubahan Pekerjaan",
        "nomorDanJudul": "36. Perubahan Pekerjaan",
        "paragraphs": [
          {
            "prefix": "36.1",
            "text": "Dalam hal terdapat perbedaan antara kondisi lapangan pada saat pelaksanaan dengan gambar dan/atau spesifikasi teknis yang ditentukan dalam dokumen Kontrak, Pejabat Penandatangan Kontrak bersama Penyedia dapat melakukan perubahan pekerjaan, yang meliputi:",
            "fullText": "36.1 Dalam hal terdapat perbedaan antara kondisi lapangan pada saat pelaksanaan dengan gambar dan/atau spesifikasi teknis yang ditentukan dalam dokumen Kontrak, Pejabat Penandatangan Kontrak bersama Penyedia dapat melakukan perubahan pekerjaan, yang meliputi:"
          },
          {
            "prefix": "a.",
            "text": "menambah atau mengurangi volume yang tercantum dalam Kontrak;",
            "fullText": "a. menambah atau mengurangi volume yang tercantum dalam Kontrak;"
          },
          {
            "prefix": "b.",
            "text": "menambah dan/atau mengurangi jenis kegiatan/pekerjaan;",
            "fullText": "b. menambah dan/atau mengurangi jenis kegiatan/pekerjaan;"
          },
          {
            "prefix": "c.",
            "text": "mengubah spesifikasi teknis dan/atau gambar pekerjaan; dan/atau",
            "fullText": "c. mengubah spesifikasi teknis dan/atau gambar pekerjaan; dan/atau"
          },
          {
            "prefix": "d.",
            "text": "mengubah jadwal pelaksanaan pekerjaan.",
            "fullText": "d. mengubah jadwal pelaksanaan pekerjaan."
          },
          {
            "prefix": "36.2",
            "text": "Dalam hal tidak terjadi perubahan kondisi lapangan seperti yang dimaksud pada Pasal 36.1 namun ada perintah perubahan dari Pejabat Penandatangan Kontrak, Pejabat Penandatangan Kontrak bersama Penyedia dapat menyepakati perubahan pekerjaan yang meliputi:",
            "fullText": "36.2 Dalam hal tidak terjadi perubahan kondisi lapangan seperti yang dimaksud pada Pasal 36.1 namun ada perintah perubahan dari Pejabat Penandatangan Kontrak, Pejabat Penandatangan Kontrak bersama Penyedia dapat menyepakati perubahan pekerjaan yang meliputi:"
          },
          {
            "prefix": "a.",
            "text": "menambah dan/atau mengurangi jenis kegiatan/pekerjaan;",
            "fullText": "a. menambah dan/atau mengurangi jenis kegiatan/pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "mengubah spesifikasi teknis dan/atau gambar pekerjaan; dan/atau",
            "fullText": "b. mengubah spesifikasi teknis dan/atau gambar pekerjaan; dan/atau"
          },
          {
            "prefix": "c.",
            "text": "mengubah jadwal pelaksanaan pekerjaan.",
            "fullText": "c. mengubah jadwal pelaksanaan pekerjaan."
          },
          {
            "prefix": "36.3",
            "text": "Perintah perubahan pekerjaan dibuat oleh Pejabat Penandatangan Kontrak secara tertulis kepada Penyedia kemudian dilanjutkan dengan negosiasi teknis dan harga dengan tetap mengacu pada ketentuan yang tercantum dalam Kontrak awal.",
            "fullText": "36.3 Perintah perubahan pekerjaan dibuat oleh Pejabat Penandatangan Kontrak secara tertulis kepada Penyedia kemudian dilanjutkan dengan negosiasi teknis dan harga dengan tetap mengacu pada ketentuan yang tercantum dalam Kontrak awal."
          },
          {
            "prefix": "36.4",
            "text": "Hasil negosiasi tersebut dituangkan dalam Berita Acara sebagai dasar penyusunan adendum Kontrak.",
            "fullText": "36.4 Hasil negosiasi tersebut dituangkan dalam Berita Acara sebagai dasar penyusunan adendum Kontrak."
          },
          {
            "prefix": "36.5",
            "text": "Dalam hal perubahan pekerjaan sebagaimana dimaksud pada Pasal 36.1 dan 36.2 mengakibatkan penambahan Harga Kontrak, perubahan Kontrak dilaksanakan dengan ketentuan penambahan Harga Kontrak akhir tidak melebihi 10% (sepuluh persen) dari harga yang tercantum dalam Kontrak awal dan tersedianya anggaran.",
            "fullText": "36.5 Dalam hal perubahan pekerjaan sebagaimana dimaksud pada Pasal 36.1 dan 36.2 mengakibatkan penambahan Harga Kontrak, perubahan Kontrak dilaksanakan dengan ketentuan penambahan Harga Kontrak akhir tidak melebihi 10% (sepuluh persen) dari harga yang tercantum dalam Kontrak awal dan tersedianya anggaran."
          }
        ]
      },
      {
        "id": "ssuk-37",
        "pasal": 37,
        "judul": "Perubahan Harga",
        "nomorDanJudul": "37. Perubahan Harga",
        "paragraphs": [
          {
            "prefix": "37.1",
            "text": "Perubahan Harga Kontrak dapat diakibatkan oleh:",
            "fullText": "37.1 Perubahan Harga Kontrak dapat diakibatkan oleh:"
          },
          {
            "prefix": "a.",
            "text": "perubahan pekerjaan;",
            "fullText": "a. perubahan pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "penyesuaian harga; dan/atau",
            "fullText": "b. penyesuaian harga; dan/atau"
          },
          {
            "prefix": "c.",
            "text": "Peristiwa Kompensasi.",
            "fullText": "c. Peristiwa Kompensasi."
          },
          {
            "prefix": "37.2",
            "text": "Apabila kuantitas mata pembayaran utama yang akan dilaksanakan  berubah akibat perubahan pekerjaan lebih dari 10% (sepuluh persen) dari kuantitas awal, maka pembayaran volume selanjutnya dengan menggunakan harga satuan yang disesuaikan dengan negosiasi.",
            "fullText": "37.2 Apabila kuantitas mata pembayaran utama yang akan dilaksanakan  berubah akibat perubahan pekerjaan lebih dari 10% (sepuluh persen) dari kuantitas awal, maka pembayaran volume selanjutnya dengan menggunakan harga satuan yang disesuaikan dengan negosiasi."
          },
          {
            "prefix": "37.3",
            "text": "Apabila dari hasil pemilihan calon pemenang (evaluasi penawaran) terdapat harga satuan timpang, maka harga satuan timpang tersebut hanya berlaku untuk kuantitas pekerjaan yang tercantum dalam Dokumen Kompetisi. Untuk kuantitas pekerjaan tambahan digunakan harga satuan berdasarkan hasil negosiasi.",
            "fullText": "37.3 Apabila dari hasil pemilihan calon pemenang (evaluasi penawaran) terdapat harga satuan timpang, maka harga satuan timpang tersebut hanya berlaku untuk kuantitas pekerjaan yang tercantum dalam Dokumen Kompetisi. Untuk kuantitas pekerjaan tambahan digunakan harga satuan berdasarkan hasil negosiasi."
          },
          {
            "prefix": "37.4",
            "text": "Apabila ada daftar mata pembayaran yang masuk kategori harga satuan timpang, maka dicantumkan pada lampiran A SSKK.",
            "fullText": "37.4 Apabila ada daftar mata pembayaran yang masuk kategori harga satuan timpang, maka dicantumkan pada lampiran A SSKK."
          },
          {
            "prefix": "37.5",
            "text": "Apabila diperlukan mata pembayaran baru, maka Penyedia jasa harus menyerahkan rincian harga satuannya kepada Pejabat Penandatangan Kontrak. Penentuan harga satuan mata pembayaran baru dilakukan dengan negosiasi.",
            "fullText": "37.5 Apabila diperlukan mata pembayaran baru, maka Penyedia jasa harus menyerahkan rincian harga satuannya kepada Pejabat Penandatangan Kontrak. Penentuan harga satuan mata pembayaran baru dilakukan dengan negosiasi."
          },
          {
            "prefix": "37.6",
            "text": "Ketentuan penggunaan rumusan penyesuaian harga adalah sebagai berikut:",
            "fullText": "37.6 Ketentuan penggunaan rumusan penyesuaian harga adalah sebagai berikut:"
          },
          {
            "prefix": "a.",
            "text": "harga yang tercantum dalam Kontrak dapat berubah akibat adanya penyesuaian harga sesuai dengan peraturan yang berlaku.",
            "fullText": "a. harga yang tercantum dalam Kontrak dapat berubah akibat adanya penyesuaian harga sesuai dengan peraturan yang berlaku."
          },
          {
            "prefix": "b.",
            "text": "penyesuaian harga diberlakukan pada Kontrak Tahun Jamak dengan  yang masa pelaksanaannya lebih dari 18 (delapan belas) bulan;",
            "fullText": "b. penyesuaian harga diberlakukan pada Kontrak Tahun Jamak dengan  yang masa pelaksanaannya lebih dari 18 (delapan belas) bulan;"
          },
          {
            "prefix": "c.",
            "text": "penyesuaian harga satuan diberlakukan mulai bulan ke-13 (tiga belas) sejak pelaksanaan pekerjaan;",
            "fullText": "c. penyesuaian harga satuan diberlakukan mulai bulan ke-13 (tiga belas) sejak pelaksanaan pekerjaan;"
          },
          {
            "prefix": "d.",
            "text": "penyesuaian harga satuan berlaku bagi seluruh kegiatan/mata pembayaran, kecuali komponen keuntungan, biaya tidak langsung (overhead cost) dan harga satuan timpang sebagiamana tercantum dalam penawaran;",
            "fullText": "d. penyesuaian harga satuan berlaku bagi seluruh kegiatan/mata pembayaran, kecuali komponen keuntungan, biaya tidak langsung (overhead cost) dan harga satuan timpang sebagiamana tercantum dalam penawaran;"
          },
          {
            "prefix": "e.",
            "text": "penyesuaian harga satuan diberlakukan sesuai dengan jadwal pelaksanaan yang tercantum dalam Kontrak awal/adendum Kontrak;",
            "fullText": "e. penyesuaian harga satuan diberlakukan sesuai dengan jadwal pelaksanaan yang tercantum dalam Kontrak awal/adendum Kontrak;"
          },
          {
            "prefix": "f.",
            "text": "penyesuaian harga satuan bagi komponen pekerjaan yang berasal dari luar negeri, menggunakan indeks penyesuaian harga dari negara asal barang tersebut;",
            "fullText": "f. penyesuaian harga satuan bagi komponen pekerjaan yang berasal dari luar negeri, menggunakan indeks penyesuaian harga dari negara asal barang tersebut;"
          },
          {
            "prefix": "g.",
            "text": "jenis pekerjaan baru dengan harga satuan baru sebagai akibat adanya adendum Kontrak dapat diberikan penyesuaian harga mulai bulan ke-13 (tiga belas) sejak adendum Kontrak tersebut ditandatangani;",
            "fullText": "g. jenis pekerjaan baru dengan harga satuan baru sebagai akibat adanya adendum Kontrak dapat diberikan penyesuaian harga mulai bulan ke-13 (tiga belas) sejak adendum Kontrak tersebut ditandatangani;"
          },
          {
            "prefix": "h.",
            "text": "indeks yang digunakan dalam pelaksanaan Kontrak terlambat disebabkan oleh kesalahan Penyedia adalah indeks terendah antara jadwal Kontrak dan realisasi pekerjaan;",
            "fullText": "h. indeks yang digunakan dalam pelaksanaan Kontrak terlambat disebabkan oleh kesalahan Penyedia adalah indeks terendah antara jadwal Kontrak dan realisasi pekerjaan;"
          },
          {
            "prefix": "i.",
            "text": "jenis pekerjaan yang lebih cepat pelaksanaannya diberlakukan penyesuaian harga berdasarkan indeks harga pada saat pelaksanaan.",
            "fullText": "i. jenis pekerjaan yang lebih cepat pelaksanaannya diberlakukan penyesuaian harga berdasarkan indeks harga pada saat pelaksanaan."
          },
          {
            "prefix": "37.7",
            "text": "Ketentuan lebih lanjut  terkait penyesuaian harga diatur dalam SSKK.",
            "fullText": "37.7 Ketentuan lebih lanjut  terkait penyesuaian harga diatur dalam SSKK."
          },
          {
            "prefix": "37.8",
            "text": "Ketentuan ganti rugi akibat Peristiwa Kompensasi mengacu pada Pasal 65.",
            "fullText": "37.8 Ketentuan ganti rugi akibat Peristiwa Kompensasi mengacu pada Pasal 65."
          }
        ]
      },
      {
        "id": "ssuk-38",
        "pasal": 38,
        "judul": "Perubahan Jadwal Pelaksanaan Pekerjaan dan/atau Masa Pelaksanaan",
        "nomorDanJudul": "38. Perubahan Jadwal Pelaksanaan Pekerjaan dan/atau Masa Pelaksanaan",
        "paragraphs": [
          {
            "prefix": "38.1",
            "text": "Perubahan jadwal pelaksanaan pekerjaan dapat diakibatkan oleh:",
            "fullText": "38.1 Perubahan jadwal pelaksanaan pekerjaan dapat diakibatkan oleh:"
          },
          {
            "prefix": "a.",
            "text": "perubahan pekerjaan;",
            "fullText": "a. perubahan pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "perpanjangan Masa Pelaksanaan; dan/atau",
            "fullText": "b. perpanjangan Masa Pelaksanaan; dan/atau"
          },
          {
            "prefix": "c.",
            "text": "Peristiwa Kompensasi.",
            "fullText": "c. Peristiwa Kompensasi."
          },
          {
            "prefix": "38.2",
            "text": "Perpanjangan Masa Pelaksanaan dapat diberikan oleh Pejabat Penandatangan Kontrak atas pertimbangan yang layak dan wajar untuk hal-hal sebagai berikut:",
            "fullText": "38.2 Perpanjangan Masa Pelaksanaan dapat diberikan oleh Pejabat Penandatangan Kontrak atas pertimbangan yang layak dan wajar untuk hal-hal sebagai berikut:"
          },
          {
            "prefix": "a.",
            "text": "perubahan pekerjaan;",
            "fullText": "a. perubahan pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "Peristiwa Kompensasi; dan/atau",
            "fullText": "b. Peristiwa Kompensasi; dan/atau"
          },
          {
            "prefix": "c.",
            "text": "Keadaan Kahar.",
            "fullText": "c. Keadaan Kahar."
          },
          {
            "prefix": "38.3",
            "text": "Masa Pelaksanaan dapat diperpanjang paling kurang sama dengan waktu terhentinya Kontrak akibat Keadaan Kahar atau waktu yang diperlukan untuk menyelesaikan pekerjaan akibat dari ketentuan pada Pasal 38.2 huruf a atau b.",
            "fullText": "38.3 Masa Pelaksanaan dapat diperpanjang paling kurang sama dengan waktu terhentinya Kontrak akibat Keadaan Kahar atau waktu yang diperlukan untuk menyelesaikan pekerjaan akibat dari ketentuan pada Pasal 38.2 huruf a atau b."
          },
          {
            "prefix": "38.4",
            "text": "Pejabat Penandatangan Kontrak dapat menyetujui perpanjangan Masa Pelaksanaan atas Kontrak setelah melakukan penelitian terhadap usulan tertulis yang diajukan oleh Penyedia dalam jangka waktu sesuai pertimbangan yang wajar setelah Penyedia meminta perpanjangan. Jika Penyedia lalai untuk memberikan peringatan dini atas keterlambatan atau tidak dapat bekerja sama untuk mencegah keterlambatan sesegera mungkin, maka keterlambatan seperti ini tidak dapat dijadikan alasan untuk memperpanjang Masa Pelaksanaan.",
            "fullText": "38.4 Pejabat Penandatangan Kontrak dapat menyetujui perpanjangan Masa Pelaksanaan atas Kontrak setelah melakukan penelitian terhadap usulan tertulis yang diajukan oleh Penyedia dalam jangka waktu sesuai pertimbangan yang wajar setelah Penyedia meminta perpanjangan. Jika Penyedia lalai untuk memberikan peringatan dini atas keterlambatan atau tidak dapat bekerja sama untuk mencegah keterlambatan sesegera mungkin, maka keterlambatan seperti ini tidak dapat dijadikan alasan untuk memperpanjang Masa Pelaksanaan."
          },
          {
            "prefix": "38.5",
            "text": "Pejabat Penandatangan Kontrak berdasarkan pertimbangan Pengawas Pekerjaan dan Panitia Peneliti Pelaksanaan Kontrak harus telah menetapkan ada tidaknya perpanjangan dan untuk berapa lama.",
            "fullText": "38.5 Pejabat Penandatangan Kontrak berdasarkan pertimbangan Pengawas Pekerjaan dan Panitia Peneliti Pelaksanaan Kontrak harus telah menetapkan ada tidaknya perpanjangan dan untuk berapa lama."
          },
          {
            "prefix": "38.6",
            "text": "Persetujuan perubahan jadwal pelaksanaan dan/atau perpanjangan Masa Pelaksanaan dituangkan dalam Adendum Kontrak.",
            "fullText": "38.6 Persetujuan perubahan jadwal pelaksanaan dan/atau perpanjangan Masa Pelaksanaan dituangkan dalam Adendum Kontrak."
          },
          {
            "prefix": "38.7",
            "text": "Jika terjadi Peristiwa Kompensasi sehingga penyelesaian pekerjaan akan melampaui Masa Pelaksanaan maka Penyedia berhak untuk meminta perpanjangan Masa Pelaksanaan berdasarkan data penunjang. Pejabat Penandatangan Kontrak berdasarkan pertimbangan Pengawas Pekerjaan memperpanjang Masa Pelaksanaan secara tertulis. Perpanjangan Masa Pelaksanaan harus dilakukan melalui adendum Kontrak.",
            "fullText": "38.7 Jika terjadi Peristiwa Kompensasi sehingga penyelesaian pekerjaan akan melampaui Masa Pelaksanaan maka Penyedia berhak untuk meminta perpanjangan Masa Pelaksanaan berdasarkan data penunjang. Pejabat Penandatangan Kontrak berdasarkan pertimbangan Pengawas Pekerjaan memperpanjang Masa Pelaksanaan secara tertulis. Perpanjangan Masa Pelaksanaan harus dilakukan melalui adendum Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-39",
        "pasal": 39,
        "judul": "Perubahan personel manajerial dan/atau peralatan utama",
        "nomorDanJudul": "39. Perubahan personel manajerial dan/atau peralatan utama",
        "paragraphs": [
          {
            "prefix": "39.1",
            "text": "Jika Pejabat Penandatangan Kontrak menilai bahwa Personel Manajerial :",
            "fullText": "39.1 Jika Pejabat Penandatangan Kontrak menilai bahwa Personel Manajerial :"
          },
          {
            "prefix": "a.",
            "text": "tidak mampu atau tidak dapat melakukan pekerjaan dengan baik;",
            "fullText": "a. tidak mampu atau tidak dapat melakukan pekerjaan dengan baik;"
          },
          {
            "prefix": "b.",
            "text": "tidak menerapkan prosedur SMKK; dan/atau",
            "fullText": "b. tidak menerapkan prosedur SMKK; dan/atau"
          },
          {
            "prefix": "c.",
            "text": "mengabaikan pekerjaan yang menjadi tugasnya;",
            "fullText": "c. mengabaikan pekerjaan yang menjadi tugasnya;"
          },
          {
            "text": "maka Penyedia berkewajiban untuk menyediakan pengganti dan menjamin Personel Manajerial tersebut meninggalkan lokasi kerja dalam waktu 7 (tujuh) hari kalender sejak diminta oleh Pejabat Penandatangan Kontrak.",
            "fullText": "maka Penyedia berkewajiban untuk menyediakan pengganti dan menjamin Personel Manajerial tersebut meninggalkan lokasi kerja dalam waktu 7 (tujuh) hari kalender sejak diminta oleh Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "39.2",
            "text": "Jika Pejabat Penandatangan Kontrak menilai bahwa Peralatan Utama :",
            "fullText": "39.2 Jika Pejabat Penandatangan Kontrak menilai bahwa Peralatan Utama :"
          },
          {
            "prefix": "a.",
            "text": "tidak dapat berfungsi sesuai dengan spesifikasi peralatan; dan/atau",
            "fullText": "a. tidak dapat berfungsi sesuai dengan spesifikasi peralatan; dan/atau"
          },
          {
            "prefix": "b.",
            "text": "tidak sesuai peraturan perundangan terkait beban dan dimensi kendaraan.",
            "fullText": "b. tidak sesuai peraturan perundangan terkait beban dan dimensi kendaraan."
          },
          {
            "text": "maka Penyedia berkewajiban untuk menyediakan pengganti dan menjamin peralatan utama tersebut meninggalkan lokasi kerja dalam waktu 7 (tujuh) hari kalender sejak diminta oleh Pejabat Penandatangan Kontrak",
            "fullText": "maka Penyedia berkewajiban untuk menyediakan pengganti dan menjamin peralatan utama tersebut meninggalkan lokasi kerja dalam waktu 7 (tujuh) hari kalender sejak diminta oleh Pejabat Penandatangan Kontrak"
          },
          {
            "prefix": "39.3",
            "text": "Dalam hal penggantian Personel Manajerial dan/atau Peralatan Utama perlu dilakukan, maka Penyedia berkewajiban untuk menyediakan pengganti dengan kualifikasi yang setara atau lebih baik dari tenaga kerja konstruksi dan/atau peralatan yang digantikan tanpa biaya tambahan apapun.",
            "fullText": "39.3 Dalam hal penggantian Personel Manajerial dan/atau Peralatan Utama perlu dilakukan, maka Penyedia berkewajiban untuk menyediakan pengganti dengan kualifikasi yang setara atau lebih baik dari tenaga kerja konstruksi dan/atau peralatan yang digantikan tanpa biaya tambahan apapun."
          },
          {
            "prefix": "39.4",
            "text": "Pejabat Penandatangan Kontrak dapat menyetujui penempatan/penggantian Personel Manajerial dan/atau Peralatan Utama menurut kualifikasi yang dibutuhkan setelah mendapat rekomendasi dari Pengawas Pekerjaan.",
            "fullText": "39.4 Pejabat Penandatangan Kontrak dapat menyetujui penempatan/penggantian Personel Manajerial dan/atau Peralatan Utama menurut kualifikasi yang dibutuhkan setelah mendapat rekomendasi dari Pengawas Pekerjaan."
          },
          {
            "prefix": "39.5",
            "text": "Perubahan Personel Manajerial dan/atau Peralatan Utama harus mendapat persetujuan terlebih dahulu dari Pejabat Penandatangan Kontrak dan dituangkan dalam adendum kontrak.",
            "fullText": "39.5 Perubahan Personel Manajerial dan/atau Peralatan Utama harus mendapat persetujuan terlebih dahulu dari Pejabat Penandatangan Kontrak dan dituangkan dalam adendum kontrak."
          },
          {
            "prefix": "39.6",
            "text": "Biaya mobilisasi/demobilisasi yang timbul akibat perubahan Personel Manajerial dan/atau Peralatan Utama menjadi tanggung jawab Penyedia.",
            "fullText": "39.6 Biaya mobilisasi/demobilisasi yang timbul akibat perubahan Personel Manajerial dan/atau Peralatan Utama menjadi tanggung jawab Penyedia."
          }
        ]
      },
      {
        "id": "ssuk-40",
        "pasal": 40,
        "subBab": "B.5 Keadaan Kahar",
        "judul": "Keadaan Kahar",
        "nomorDanJudul": "40. Keadaan Kahar",
        "paragraphs": [
          {
            "prefix": "40.1",
            "text": "Contoh Keadaan Kahar tidak terbatas pada: bencana alam, bencana non alam, bencana sosial, pemogokan, kebakaran, kondisi cuaca ekstrim, dan gangguan industri lainnya.",
            "fullText": "40.1 Contoh Keadaan Kahar tidak terbatas pada: bencana alam, bencana non alam, bencana sosial, pemogokan, kebakaran, kondisi cuaca ekstrim, dan gangguan industri lainnya."
          },
          {
            "prefix": "40.2",
            "text": "Tidak termasuk Keadaan Kahar adalah hal-hal merugikan yang disebabkan oleh perbuatan atau kelalaian para pihak.",
            "fullText": "40.2 Tidak termasuk Keadaan Kahar adalah hal-hal merugikan yang disebabkan oleh perbuatan atau kelalaian para pihak."
          },
          {
            "prefix": "40.3",
            "text": "Dalam hal terjadi keadaan kahar, Pejabat Penandatangan Kontrak atau Penyedia memberitahukan tentang terjadinya Keadaan Kahar kepada salah satu pihak secara tertulis dengan ketentuan :",
            "fullText": "40.3 Dalam hal terjadi keadaan kahar, Pejabat Penandatangan Kontrak atau Penyedia memberitahukan tentang terjadinya Keadaan Kahar kepada salah satu pihak secara tertulis dengan ketentuan :"
          },
          {
            "prefix": "a.",
            "text": "dalam waktu paling lambat 14 (empat belas) hari kalender sejak menyadari atau seharusnya menyadari atas kejadian atau terjadinya Keadaan Kahar",
            "fullText": "a. dalam waktu paling lambat 14 (empat belas) hari kalender sejak menyadari atau seharusnya menyadari atas kejadian atau terjadinya Keadaan Kahar"
          },
          {
            "prefix": "b.",
            "text": "menyertakan bukti keadaan kahar; dan",
            "fullText": "b. menyertakan bukti keadaan kahar; dan"
          },
          {
            "prefix": "c.",
            "text": "menyerahkan hasil identifikasi kewajiban dan kinerja pelaksanaan yang terhambat dan/atau akan terhambat akibat Keadaan Kahar tersebut.",
            "fullText": "c. menyerahkan hasil identifikasi kewajiban dan kinerja pelaksanaan yang terhambat dan/atau akan terhambat akibat Keadaan Kahar tersebut."
          },
          {
            "prefix": "40.4",
            "text": "Bukti Keadaan Kahar dapat berupa :",
            "fullText": "40.4 Bukti Keadaan Kahar dapat berupa :"
          },
          {
            "prefix": "a.",
            "text": "pernyataan yang diterbitkan oleh pihak/instansi yang berwenang sesuai ketentuan peraturan perundang-undangan; dan/atau",
            "fullText": "a. pernyataan yang diterbitkan oleh pihak/instansi yang berwenang sesuai ketentuan peraturan perundang-undangan; dan/atau"
          },
          {
            "prefix": "b.",
            "text": "foto/video dokumentasi Keadaan Kahar yang telah diverifikasi kebenarannya.",
            "fullText": "b. foto/video dokumentasi Keadaan Kahar yang telah diverifikasi kebenarannya."
          },
          {
            "prefix": "40.5",
            "text": "Hasil identifikasi kewajiban dan kinerja pelaksanaan dapat berupa:",
            "fullText": "40.5 Hasil identifikasi kewajiban dan kinerja pelaksanaan dapat berupa:"
          },
          {
            "prefix": "a.",
            "text": "Foto/video dokumentasi pekerjaan yang terdampak;",
            "fullText": "a. Foto/video dokumentasi pekerjaan yang terdampak;"
          },
          {
            "prefix": "b.",
            "text": "Kurva S pekerjaan; dan",
            "fullText": "b. Kurva S pekerjaan; dan"
          },
          {
            "prefix": "c.",
            "text": "Dokumen pendukung lainnya (apabila ada).",
            "fullText": "c. Dokumen pendukung lainnya (apabila ada)."
          },
          {
            "prefix": "40.6",
            "text": "Pejabat Penandatangan Kontrak meminta Pengawas Pekerjaan untuk melakukan penelitian terhadap penyampaian pemberitahuan Keadaan Kahar dan bukti serta hasil identifikasi sebagaimana dimaksud pada Pasal 40.4 dan Pasal 40.5",
            "fullText": "40.6 Pejabat Penandatangan Kontrak meminta Pengawas Pekerjaan untuk melakukan penelitian terhadap penyampaian pemberitahuan Keadaan Kahar dan bukti serta hasil identifikasi sebagaimana dimaksud pada Pasal 40.4 dan Pasal 40.5"
          },
          {
            "prefix": "40.7",
            "text": "Dalam hal Keadaan Kahar terbukti, kegagalan salah satu Pihak untuk memenuhi kewajibannya yang ditentukan dalam Kontrak bukan merupakan cedera janji atau wanprestasi apabila telah dilakukan sesuai pada Pasal 40.3. Kewajiban yang dimaksud adalah hanya kewajiban dan kinerja pelaksanaan terhadap pekerjaan/bagian pekerjaan yang terdampak dan/atau akan terdampak akibat dari Keadaan Kahar.",
            "fullText": "40.7 Dalam hal Keadaan Kahar terbukti, kegagalan salah satu Pihak untuk memenuhi kewajibannya yang ditentukan dalam Kontrak bukan merupakan cedera janji atau wanprestasi apabila telah dilakukan sesuai pada Pasal 40.3. Kewajiban yang dimaksud adalah hanya kewajiban dan kinerja pelaksanaan terhadap pekerjaan/bagian pekerjaan yang terdampak dan/atau akan terdampak akibat dari Keadaan Kahar."
          },
          {
            "prefix": "40.8",
            "text": "Dalam hal terjadi Keadaan Kahar, Pelaksanaan pekerjaan dapat dihentikan. Penghentian Pekerjaan karena Keadaan Kahar dapat bersifat",
            "fullText": "40.8 Dalam hal terjadi Keadaan Kahar, Pelaksanaan pekerjaan dapat dihentikan. Penghentian Pekerjaan karena Keadaan Kahar dapat bersifat"
          },
          {
            "prefix": "a.",
            "text": "sementara hingga Keadaan Kahar berakhir apabila akibat Keadaan Kahar masih memungkinkan dilanjutkan/diselesaikannya pekerjaan;",
            "fullText": "a. sementara hingga Keadaan Kahar berakhir apabila akibat Keadaan Kahar masih memungkinkan dilanjutkan/diselesaikannya pekerjaan;"
          },
          {
            "prefix": "c.",
            "text": "permanen apabila akibat Keadaan Kahar tidak memungkinkan dilanjutkan/diselesaikannya pekerjaan.",
            "fullText": "b. permanen apabila akibat Keadaan Kahar tidak memungkinkan dilanjutkan/diselesaikannya pekerjaan."
          },
          {
            "prefix": "c.",
            "text": "sebagian apabila Keadaan Kahar hanya berdampak pada bagian Pekerjaan; dan/atau",
            "fullText": "c. sebagian apabila Keadaan Kahar hanya berdampak pada bagian Pekerjaan; dan/atau"
          },
          {
            "prefix": "d.",
            "text": "seluruhnya apabila Keadaan Kahar berdampak terhadap keseluruhan Pekerjaan;",
            "fullText": "d. seluruhnya apabila Keadaan Kahar berdampak terhadap keseluruhan Pekerjaan;"
          },
          {
            "prefix": "40.9",
            "text": "Penghentian Pekerjaan akibat keadaan kahar sesuai Pasal 40.8 dilakukan secara tertulis oleh Pejabat Penandatangan Kontrak dengan disertai alasan penghentian pekerjaan dan dituangkan dalam perubahan Rencana Kerja Penyedia",
            "fullText": "40.9 Penghentian Pekerjaan akibat keadaan kahar sesuai Pasal 40.8 dilakukan secara tertulis oleh Pejabat Penandatangan Kontrak dengan disertai alasan penghentian pekerjaan dan dituangkan dalam perubahan Rencana Kerja Penyedia"
          },
          {
            "prefix": "40.10",
            "text": "Dalam hal penghentian pekerjaan mencakup seluruh pekerjaan (baik sementara ataupun permanen) karena Keadaan Kahar, maka:",
            "fullText": "40.10 Dalam hal penghentian pekerjaan mencakup seluruh pekerjaan (baik sementara ataupun permanen) karena Keadaan Kahar, maka:"
          },
          {
            "prefix": "a.",
            "text": "Kontrak dihentikan sementara hingga keadaan kahar berakhir; atau",
            "fullText": "a. Kontrak dihentikan sementara hingga keadaan kahar berakhir; atau"
          },
          {
            "prefix": "b.",
            "text": "Kontrak dihentikan permanen apabila akibat Keadaan Kahar tidak memungkinkan dilanjutkan/diselesaikannya pekerjaan.",
            "fullText": "b. Kontrak dihentikan permanen apabila akibat Keadaan Kahar tidak memungkinkan dilanjutkan/diselesaikannya pekerjaan."
          },
          {
            "prefix": "40.11",
            "text": "Penghentian kontrak sebagaimana dimaksud pada Pasal 40.10 dilakukan melalui perintah tertulis oleh Pejabat Penandatangan Kontrak dengan disertai alasan penghentian kontrak dan dituangkan dalam adendum kontrak.",
            "fullText": "40.11 Penghentian kontrak sebagaimana dimaksud pada Pasal 40.10 dilakukan melalui perintah tertulis oleh Pejabat Penandatangan Kontrak dengan disertai alasan penghentian kontrak dan dituangkan dalam adendum kontrak."
          },
          {
            "prefix": "40.12",
            "text": "Dalam hal pelaksanaan Kontrak dilanjutkan, para pihak dapat melakukan perubahan Kontrak. Masa Pelaksanaan dapat diperpanjang sekurang-kurangnya sama dengan jangka waktu terhentinya Kontrak akibat Keadan Kahar. Perpanjangan Masa Pelaksanaan dapat melewati Tahun Anggaran.",
            "fullText": "40.12 Dalam hal pelaksanaan Kontrak dilanjutkan, para pihak dapat melakukan perubahan Kontrak. Masa Pelaksanaan dapat diperpanjang sekurang-kurangnya sama dengan jangka waktu terhentinya Kontrak akibat Keadan Kahar. Perpanjangan Masa Pelaksanaan dapat melewati Tahun Anggaran."
          },
          {
            "prefix": "40.13",
            "text": "Selama masa Keadaan Kahar, jika Pejabat Penandatangan Kontrak memerintahkan secara tertulis kepada Penyedia untuk sedapat mungkin meneruskan pekerjaan, maka Penyedia berhak untuk menerima pembayaran sebagaimana ditentukan dalam Kontrak dan mendapat penggantian biaya yang wajar sesuai dengan kondisi yang telah dikeluarkan untuk bekerja dalam Keadaan Kahar. Penggantian biaya ini harus diatur dalam suatu adendum Kontrak.",
            "fullText": "40.13 Selama masa Keadaan Kahar, jika Pejabat Penandatangan Kontrak memerintahkan secara tertulis kepada Penyedia untuk sedapat mungkin meneruskan pekerjaan, maka Penyedia berhak untuk menerima pembayaran sebagaimana ditentukan dalam Kontrak dan mendapat penggantian biaya yang wajar sesuai dengan kondisi yang telah dikeluarkan untuk bekerja dalam Keadaan Kahar. Penggantian biaya ini harus diatur dalam suatu adendum Kontrak."
          },
          {
            "prefix": "40.14",
            "text": "Dalam hal pelaksanaan Kontrak dihentikan permanen, para pihak melakukan pengakhiran kontrak dan menyelesaikan hak dan kewajiban sesuai Kontrak. Penyedia berhak untuk menerima pembayaran sesuai dengan prestasi atau kemajuan hasil pekerjaan yang telah dicapai setelah dilakukan pengukuran/pemeriksaan bersama atau berdasarkan hasil audit.",
            "fullText": "40.14 Dalam hal pelaksanaan Kontrak dihentikan permanen, para pihak melakukan pengakhiran kontrak dan menyelesaikan hak dan kewajiban sesuai Kontrak. Penyedia berhak untuk menerima pembayaran sesuai dengan prestasi atau kemajuan hasil pekerjaan yang telah dicapai setelah dilakukan pengukuran/pemeriksaan bersama atau berdasarkan hasil audit."
          }
        ]
      },
      {
        "id": "ssuk-41",
        "pasal": 41,
        "subBab": "B.6 Penghentian, Pemutusan, dan Berakhirnya Kontrak",
        "judul": "Penghentian Kontrak",
        "nomorDanJudul": "41. Penghentian Kontrak",
        "paragraphs": [
          {
            "text": "Penghentian Kontrak dapat dilakukan karena terjadi Keadaan Kahar sebagaimana dimaksud pada Pasal 40.",
            "fullText": "Penghentian Kontrak dapat dilakukan karena terjadi Keadaan Kahar sebagaimana dimaksud pada Pasal 40."
          }
        ]
      },
      {
        "id": "ssuk-42",
        "pasal": 42,
        "judul": "Pemutusan Kontrak",
        "nomorDanJudul": "42. Pemutusan Kontrak",
        "paragraphs": [
          {
            "prefix": "42.1",
            "text": "Pemutusan Kontrak dapat dilakukan oleh Pejabat Penandatangan Kontrak atau Penyedia.",
            "fullText": "42.1 Pemutusan Kontrak dapat dilakukan oleh Pejabat Penandatangan Kontrak atau Penyedia."
          },
          {
            "prefix": "42.2",
            "text": "Pemutusan kontrak dilakukan dengan terlebih dahulu memberikan surat peringatan  dari salah satu pihak ke pihak yang lain yang melakukan tindakan wanprestasi kecuali telah ada putusan pidana.",
            "fullText": "42.2 Pemutusan kontrak dilakukan dengan terlebih dahulu memberikan surat peringatan  dari salah satu pihak ke pihak yang lain yang melakukan tindakan wanprestasi kecuali telah ada putusan pidana."
          },
          {
            "prefix": "42.3",
            "text": "Surat peringatan diberikan 3 (tiga) kali kecuali pelanggaran tersebut berdampak terhadap kerugian atas konstruksi, jiwa manusia, keselamatan publik, dan lingkungan  dan ditindaklanjuti dengan surat pernyataan wanprestasi dari pihak yang dirugikan",
            "fullText": "42.3 Surat peringatan diberikan 3 (tiga) kali kecuali pelanggaran tersebut berdampak terhadap kerugian atas konstruksi, jiwa manusia, keselamatan publik, dan lingkungan  dan ditindaklanjuti dengan surat pernyataan wanprestasi dari pihak yang dirugikan"
          },
          {
            "prefix": "42.4",
            "text": "Pemutusan kontrak dilakukan sekurang-kurangnya 14 (empat belas) hari kalender setelah Pejabat Penandatangan Kontrak/Penyedia menyampaikan pemberitahuan rencana Pemutusan Kontrak secara tertulis kepada Penyedia/Pejabat Penandatangan Kontrak.",
            "fullText": "42.4 Pemutusan kontrak dilakukan sekurang-kurangnya 14 (empat belas) hari kalender setelah Pejabat Penandatangan Kontrak/Penyedia menyampaikan pemberitahuan rencana Pemutusan Kontrak secara tertulis kepada Penyedia/Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "42.5",
            "text": "Dalam hal dilakukan pemutusan Kontrak oleh salah satu pihak maka Pejabat Penandatangan Kontrak membayar kepada Penyedia sesuai dengan pencapaian prestasi pekerjaan yang telah diterima oleh Pejabat Penandatangan Kontrak dikurangi denda yang harus dibayar Penyedia (apabila ada), serta Penyedia menyerahkan semua hasil pelaksanaan kepada Pejabat Penandatangan Kontrak dan selanjutnya menjadi hak milik Pejabat Penandatangan Kontrak.",
            "fullText": "42.5 Dalam hal dilakukan pemutusan Kontrak oleh salah satu pihak maka Pejabat Penandatangan Kontrak membayar kepada Penyedia sesuai dengan pencapaian prestasi pekerjaan yang telah diterima oleh Pejabat Penandatangan Kontrak dikurangi denda yang harus dibayar Penyedia (apabila ada), serta Penyedia menyerahkan semua hasil pelaksanaan kepada Pejabat Penandatangan Kontrak dan selanjutnya menjadi hak milik Pejabat Penandatangan Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-43",
        "pasal": 43,
        "judul": "Pemutusan Kontrak oleh Pejabat Penandatangan Kontrak",
        "nomorDanJudul": "43. Pemutusan Kontrak oleh Pejabat Penandatangan Kontrak",
        "paragraphs": [
          {
            "prefix": "43.1",
            "text": "Mengesampingkan Pasal 1266 dan 1267 Kitab Undang-Undang Hukum Perdata, Pejabat Penandatangan Kontrak dapat melakukan pemutusan Kontrak apabila:",
            "fullText": "43.1 Mengesampingkan Pasal 1266 dan 1267 Kitab Undang-Undang Hukum Perdata, Pejabat Penandatangan Kontrak dapat melakukan pemutusan Kontrak apabila:"
          },
          {
            "prefix": "a.",
            "text": "Penyedia terbukti melakukan KKN, kecurangan dan/atau pemalsuan dalam proses pengadaan yang diputuskan oleh Instansi yang berwenang;",
            "fullText": "a. Penyedia terbukti melakukan KKN, kecurangan dan/atau pemalsuan dalam proses pengadaan yang diputuskan oleh Instansi yang berwenang;"
          },
          {
            "prefix": "b.",
            "text": "pengaduan tentang penyimpangan prosedur, dugaan KKN dan/atau pelanggaran persaingan sehat dalam pelaksanaan Pengadaan Barang/Jasa dinyatakan benar oleh Instansi yang berwenang;",
            "fullText": "b. pengaduan tentang penyimpangan prosedur, dugaan KKN dan/atau pelanggaran persaingan sehat dalam pelaksanaan Pengadaan Barang/Jasa dinyatakan benar oleh Instansi yang berwenang;"
          },
          {
            "prefix": "c.",
            "text": "Penyedia berada dalam keadaan pailit yang diputuskan oleh pengadilan;",
            "fullText": "c. Penyedia berada dalam keadaan pailit yang diputuskan oleh pengadilan;"
          },
          {
            "prefix": "d.",
            "text": "Penyedia terbukti dikenakan Sanksi Daftar Hitam sebelum penandatanganan Kontrak;",
            "fullText": "d. Penyedia terbukti dikenakan Sanksi Daftar Hitam sebelum penandatanganan Kontrak;"
          },
          {
            "prefix": "e.",
            "text": "Penyedia gagal memperbaiki kinerja;",
            "fullText": "e. Penyedia gagal memperbaiki kinerja;"
          },
          {
            "prefix": "f.",
            "text": "Penyedia tidak mempertahankan berlakunya Jaminan Pelaksanaan;",
            "fullText": "f. Penyedia tidak mempertahankan berlakunya Jaminan Pelaksanaan;"
          },
          {
            "prefix": "g.",
            "text": "Penyedia lalai/cedera janji dalam melaksanakan kewajibannya dan tidak memperbaiki kelalaiannya dalam jangka waktu yang telah ditetapkan;",
            "fullText": "g. Penyedia lalai/cedera janji dalam melaksanakan kewajibannya dan tidak memperbaiki kelalaiannya dalam jangka waktu yang telah ditetapkan;"
          },
          {
            "prefix": "h.",
            "text": "berdasarkan penelitian Pejabat Penandatangan Kontrak, Penyedia tidak akan mampu menyelesaikan keseluruhan pekerjaan walaupun diberikan kesempatan sampai dengan 50 (lima puluh) hari kalender sejak masa berakhirnya pelaksanaan  pekerjaan;",
            "fullText": "h. berdasarkan penelitian Pejabat Penandatangan Kontrak, Penyedia tidak akan mampu menyelesaikan keseluruhan pekerjaan walaupun diberikan kesempatan sampai dengan 50 (lima puluh) hari kalender sejak masa berakhirnya pelaksanaan  pekerjaan;"
          },
          {
            "prefix": "i.",
            "text": "Setelah diberikan kesempatan menyelesaikan pekerjaan sampai dengan 50 (lima puluh) hari kalender sejak masa berakhirnya pelaksanaan pekerjaan, Penyedia tidak dapat menyelesaikan pekerjaan;",
            "fullText": "i. Setelah diberikan kesempatan menyelesaikan pekerjaan sampai dengan 50 (lima puluh) hari kalender sejak masa berakhirnya pelaksanaan pekerjaan, Penyedia tidak dapat menyelesaikan pekerjaan;"
          },
          {
            "prefix": "j.",
            "text": "Penyedia menghentikan pekerjaan selama 28 (dua puluh delapan) hari kalender dan penghentian ini tidak tercantum dalam jadwal pelaksanaan pekerjaan serta tanpa persetujuan pengawas pekerjaan; atau",
            "fullText": "j. Penyedia menghentikan pekerjaan selama 28 (dua puluh delapan) hari kalender dan penghentian ini tidak tercantum dalam jadwal pelaksanaan pekerjaan serta tanpa persetujuan pengawas pekerjaan; atau"
          },
          {
            "prefix": "k.",
            "text": "Penyedia mengalihkan seluruh Kontrak bukan dikarenakan pergantian nama Penyedia.",
            "fullText": "k. Penyedia mengalihkan seluruh Kontrak bukan dikarenakan pergantian nama Penyedia."
          },
          {
            "prefix": "43.2",
            "text": "Dalam hal pemutusan Kontrak dilakukan pada Masa Pelaksanaan karena kesalahan Penyedia, maka:",
            "fullText": "43.2 Dalam hal pemutusan Kontrak dilakukan pada Masa Pelaksanaan karena kesalahan Penyedia, maka:"
          },
          {
            "prefix": "a.",
            "text": "Jaminan Pelaksanaan terlebih dahulu dicairkan sebelum pemutusan kontrak;",
            "fullText": "a. Jaminan Pelaksanaan terlebih dahulu dicairkan sebelum pemutusan kontrak;"
          },
          {
            "prefix": "b.",
            "text": "sisa uang muka harus dilunasi oleh Penyedia atau Jaminan Uang Muka terlebih dahulu dicairkan (apabila diberikan);",
            "fullText": "b. sisa uang muka harus dilunasi oleh Penyedia atau Jaminan Uang Muka terlebih dahulu dicairkan (apabila diberikan);"
          },
          {
            "prefix": "c.",
            "text": "Penyedia membayar denda (apabila ada); dan",
            "fullText": "c. Penyedia membayar denda (apabila ada); dan"
          },
          {
            "prefix": "d.",
            "text": "Penyedia dikenakan Sanksi Daftar Hitam",
            "fullText": "d. Penyedia dikenakan Sanksi Daftar Hitam"
          },
          {
            "prefix": "43.3",
            "text": "Dalam hal pemutusan Kontrak dilakukan pada Masa Pemeliharaan karena kesalahan Penyedia, maka:",
            "fullText": "43.3 Dalam hal pemutusan Kontrak dilakukan pada Masa Pemeliharaan karena kesalahan Penyedia, maka:"
          },
          {
            "prefix": "a.",
            "text": "Pejabat Penandatangan Kontrak berhak untuk tidak membayar retensi atau terlebih dahulu mencairkan Jaminan Pemeliharaan sebelum pemutusan Kontrak untuk membiayai perbaikan/pemeliharaan; dan",
            "fullText": "a. Pejabat Penandatangan Kontrak berhak untuk tidak membayar retensi atau terlebih dahulu mencairkan Jaminan Pemeliharaan sebelum pemutusan Kontrak untuk membiayai perbaikan/pemeliharaan; dan"
          },
          {
            "prefix": "b.",
            "text": "Penyedia dikenakan sanksi Daftar Hitam.",
            "fullText": "b. Penyedia dikenakan sanksi Daftar Hitam."
          },
          {
            "prefix": "43.4",
            "text": "Dalam hal terdapat nilai sisa penggunaan uang retensi atau uang pencairan Jaminan Pemeliharaan untuk membiayai pembiayaan/pemeliharaan maka Pejabat Penandatangan Kontrak wajib menyetorkan sebagaimana ditetapkan dalam SSKK.",
            "fullText": "43.4 Dalam hal terdapat nilai sisa penggunaan uang retensi atau uang pencairan Jaminan Pemeliharaan untuk membiayai pembiayaan/pemeliharaan maka Pejabat Penandatangan Kontrak wajib menyetorkan sebagaimana ditetapkan dalam SSKK."
          },
          {
            "prefix": "43.5",
            "text": "Pencairan Jaminan sebagaimana dimaksud  Pasal 43.2 dan Pasal 43.4 disertai dengan:",
            "fullText": "43.5 Pencairan Jaminan sebagaimana dimaksud  Pasal 43.2 dan Pasal 43.4 disertai dengan:"
          },
          {
            "prefix": "a.",
            "text": "bukti kesalahan penyedia sesuai dengan ketentuan Kontrak; dan",
            "fullText": "a. bukti kesalahan penyedia sesuai dengan ketentuan Kontrak; dan"
          },
          {
            "prefix": "b.",
            "text": "dokumen pendukung.",
            "fullText": "b. dokumen pendukung."
          },
          {
            "prefix": "43.6",
            "text": "Pencairan jaminan sebagaimana dimaksud pada Pasal 43.2 di atas, dicairkan dan disetorkan sesuai ketentuan dalam SSKK",
            "fullText": "43.6 Pencairan jaminan sebagaimana dimaksud pada Pasal 43.2 di atas, dicairkan dan disetorkan sesuai ketentuan dalam SSKK"
          }
        ]
      },
      {
        "id": "ssuk-44",
        "pasal": 44,
        "judul": "Pemutusan Kontrak oleh Penyedia",
        "nomorDanJudul": "44. Pemutusan Kontrak oleh Penyedia",
        "paragraphs": [
          {
            "text": "Mengesampingkan Pasal 1266 dan 1267 Kitab Undang-Undang Hukum Perdata, Penyedia dapat melakukan pemutusan Kontrak apabila:",
            "fullText": "Mengesampingkan Pasal 1266 dan 1267 Kitab Undang-Undang Hukum Perdata, Penyedia dapat melakukan pemutusan Kontrak apabila:"
          },
          {
            "prefix": "a.",
            "text": "Pejabat Penandatangan Kontrak menyetujui Pengawas Pekerjaan untuk memerintahkan Penyedia menunda pelaksanaan pekerjaan yang bukan disebabkan oleh kesalahan Penyedia, dan perintah penundaan tersebut tidak ditarik selama 28 (dua puluh delapan) hari kalender;",
            "fullText": "a. Pejabat Penandatangan Kontrak menyetujui Pengawas Pekerjaan untuk memerintahkan Penyedia menunda pelaksanaan pekerjaan yang bukan disebabkan oleh kesalahan Penyedia, dan perintah penundaan tersebut tidak ditarik selama 28 (dua puluh delapan) hari kalender;"
          },
          {
            "prefix": "b.",
            "text": "Pejabat Penandatangan Kontrak tidak menerbitkan Surat Permintaan Pembayaran (SPP) untuk pembayaran tagihan angsuran sesuai dengan yang disepakati sebagaimana tercantum dalam SSKK.",
            "fullText": "b. Pejabat Penandatangan Kontrak tidak menerbitkan Surat Permintaan Pembayaran (SPP) untuk pembayaran tagihan angsuran sesuai dengan yang disepakati sebagaimana tercantum dalam SSKK."
          }
        ]
      },
      {
        "id": "ssuk-45",
        "pasal": 45,
        "judul": "Pengakhiran Pekerjaan",
        "nomorDanJudul": "45. Pengakhiran Pekerjaan",
        "paragraphs": [
          {
            "prefix": "45.1",
            "text": "Para Pihak dapat menyepakati pengakhiran pekerjaan dalam hal terjadi:",
            "fullText": "45.1 Para Pihak dapat menyepakati pengakhiran pekerjaan dalam hal terjadi:"
          },
          {
            "prefix": "a.",
            "text": "penyimpangan prosedur yang diakibatkan bukan oleh kesalahan para pihak;",
            "fullText": "a. penyimpangan prosedur yang diakibatkan bukan oleh kesalahan para pihak;"
          },
          {
            "prefix": "b.",
            "text": "pelaksanaan kontrak tidak dapat dilanjutkan akibat keadaan kahar; atau",
            "fullText": "b. pelaksanaan kontrak tidak dapat dilanjutkan akibat keadaan kahar; atau"
          },
          {
            "prefix": "c.",
            "text": "ruang lingkup kontrak sudah terwujud.",
            "fullText": "c. ruang lingkup kontrak sudah terwujud."
          },
          {
            "prefix": "45.2",
            "text": "Pengakhiran pekerjaan sesuai Pasal 45.1 dituangkan dalam addendum final yang berisi perubahan akhir dari Kontrak.",
            "fullText": "45.2 Pengakhiran pekerjaan sesuai Pasal 45.1 dituangkan dalam addendum final yang berisi perubahan akhir dari Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-46",
        "pasal": 46,
        "judul": "Berakhirnya Kontrak",
        "nomorDanJudul": "46. Berakhirnya Kontrak",
        "paragraphs": [
          {
            "prefix": "46.1",
            "text": "Pengakhiran pelaksanaan Kontrak dilakukan berdasarkan kesepakatan para pihak.",
            "fullText": "46.1 Pengakhiran pelaksanaan Kontrak dilakukan berdasarkan kesepakatan para pihak."
          },
          {
            "prefix": "46.2",
            "text": "Kontrak berakhir apabila telah dilakukan pengakhiran pekerjaan dan hak dan kewajiban para pihak yang terdapat dalam Kontrak sudah terpenuhi.",
            "fullText": "46.2 Kontrak berakhir apabila telah dilakukan pengakhiran pekerjaan dan hak dan kewajiban para pihak yang terdapat dalam Kontrak sudah terpenuhi."
          },
          {
            "prefix": "46.3",
            "text": "Terpenuhinya hak dan kewajiban para pihak sebagaimana dimaksud pada Pasal 46.2 adalah terkait dengan pembayaran yang seharusnya dilakukan akibat dari pelaksanaan kontrak.",
            "fullText": "46.3 Terpenuhinya hak dan kewajiban para pihak sebagaimana dimaksud pada Pasal 46.2 adalah terkait dengan pembayaran yang seharusnya dilakukan akibat dari pelaksanaan kontrak."
          }
        ]
      },
      {
        "id": "ssuk-47",
        "pasal": 47,
        "judul": "Peninggalan",
        "nomorDanJudul": "47. Peninggalan",
        "paragraphs": [
          {
            "text": "Semua bahan, perlengkapan, peralatan, hasil pekerjaan sementara yang masih berada di lokasi kerja setelah pemutusan Kontrak akibat kelalaian atau kesalahan Penyedia, dapat dimanfaatkan sepenuhnya oleh Pejabat Penandatangan Kontrak tanpa kewajiban perawatan/pemeliharaan. Pengambilan kembali semua peninggalan tersebut oleh Penyedia hanya dapat dilakukan setelah mempertimbangkan kepentingan Pejabat Penandatangan Kontrak.",
            "fullText": "Semua bahan, perlengkapan, peralatan, hasil pekerjaan sementara yang masih berada di lokasi kerja setelah pemutusan Kontrak akibat kelalaian atau kesalahan Penyedia, dapat dimanfaatkan sepenuhnya oleh Pejabat Penandatangan Kontrak tanpa kewajiban perawatan/pemeliharaan. Pengambilan kembali semua peninggalan tersebut oleh Penyedia hanya dapat dilakukan setelah mempertimbangkan kepentingan Pejabat Penandatangan Kontrak."
          }
        ]
      }
    ]
  },
  {
    "id": "ssuk-sec-c",
    "huruf": "C",
    "judul": "HAK DAN KEWAJIBAN PENYEDIA",
    "nomorDanJudul": "C. HAK DAN KEWAJIBAN PENYEDIA",
    "clauses": [
      {
        "id": "ssuk-48",
        "pasal": 48,
        "judul": "Hak dan Kewajiban Penyedia",
        "nomorDanJudul": "48. Hak dan Kewajiban Penyedia",
        "paragraphs": [
          {
            "text": "Hak-hak yang dimiliki serta kewajiban-kewajiban yang harus dilaksanakan oleh Penyedia dalam melaksanakan Kontrak, meliputi :",
            "fullText": "Hak-hak yang dimiliki serta kewajiban-kewajiban yang harus dilaksanakan oleh Penyedia dalam melaksanakan Kontrak, meliputi :"
          },
          {
            "prefix": "a.",
            "text": "menerima pembayaran untuk pelaksanaan pekerjaan sesuai dengan harga dan ketentuan yang telah ditetapkan dalam Kontrak;",
            "fullText": "a. menerima pembayaran untuk pelaksanaan pekerjaan sesuai dengan harga dan ketentuan yang telah ditetapkan dalam Kontrak;"
          },
          {
            "prefix": "b.",
            "text": "meminta fasilitas-fasilitas dalam bentuk sarana dan prasarana dari Pejabat Penandatangan Kontrak untuk kelancaran pelaksanaan pekerjaan sesuai ketentuan Kontrak;",
            "fullText": "b. meminta fasilitas-fasilitas dalam bentuk sarana dan prasarana dari Pejabat Penandatangan Kontrak untuk kelancaran pelaksanaan pekerjaan sesuai ketentuan Kontrak;"
          },
          {
            "prefix": "c.",
            "text": "melaporkan pelaksanaan pekerjaan secara periodik kepada Pejabat Penandatangan Kontrak;",
            "fullText": "c. melaporkan pelaksanaan pekerjaan secara periodik kepada Pejabat Penandatangan Kontrak;"
          },
          {
            "prefix": "d.",
            "text": "melaksanakan, menyelesaikan dan menyerahkan pekerjaan sesuai dengan jadwal pelaksanaan pekerjaan dan ketentuan yang telah ditetapkan dalam Kontrak;",
            "fullText": "d. melaksanakan, menyelesaikan dan menyerahkan pekerjaan sesuai dengan jadwal pelaksanaan pekerjaan dan ketentuan yang telah ditetapkan dalam Kontrak;"
          },
          {
            "prefix": "e.",
            "text": "melaksanakan dan menyelesaikan pekerjaan secara cermat, akurat dan penuh tanggung jawab dengan menyediakan tenaga kerja, bahan-bahan, peralatan, angkutan ke atau dari lapangan, dan segala pekerjaan permanen maupun sementara yang diperlukan untuk pelaksanaan, penyelesaian dan perbaikan pekerjaan yang dirinci dalam Kontrak;",
            "fullText": "e. melaksanakan dan menyelesaikan pekerjaan secara cermat, akurat dan penuh tanggung jawab dengan menyediakan tenaga kerja, bahan-bahan, peralatan, angkutan ke atau dari lapangan, dan segala pekerjaan permanen maupun sementara yang diperlukan untuk pelaksanaan, penyelesaian dan perbaikan pekerjaan yang dirinci dalam Kontrak;"
          },
          {
            "prefix": "f.",
            "text": "memberikan keterangan-keterangan yang diperlukan untuk pemeriksaan pelaksanaan yang dilakukan Pejabat Penandatangan Kontrak;",
            "fullText": "f. memberikan keterangan-keterangan yang diperlukan untuk pemeriksaan pelaksanaan yang dilakukan Pejabat Penandatangan Kontrak;"
          },
          {
            "prefix": "g.",
            "text": "mengambil langkah-langkah yang memadai dalam rangka memberi perlindungan kepada setiap orang yang berada di tempat kerja maupun masyarakat dan lingkungan sekitar yang berhubungan dengan pemindahan bahan baku, penggunaan peralatan kerja konstruksi dan proses produksi;",
            "fullText": "g. mengambil langkah-langkah yang memadai dalam rangka memberi perlindungan kepada setiap orang yang berada di tempat kerja maupun masyarakat dan lingkungan sekitar yang berhubungan dengan pemindahan bahan baku, penggunaan peralatan kerja konstruksi dan proses produksi;"
          },
          {
            "prefix": "h.",
            "text": "melaksanakan semua perintah Pengawas Pekerjaan yang sesuai dengan kewenangan Pengawas Pekerjaan dalam Kontrak ini;",
            "fullText": "h. melaksanakan semua perintah Pengawas Pekerjaan yang sesuai dengan kewenangan Pengawas Pekerjaan dalam Kontrak ini;"
          },
          {
            "prefix": "i.",
            "text": "Menggunakan Sistem Informasi Kontrak dan Manajemen Pengendalian Pelaksanaan Kontrak (SIKOMPAK) dalam pelaksanaan dan pengendalian kontrak; dan",
            "fullText": "i. Menggunakan Sistem Informasi Kontrak dan Manajemen Pengendalian Pelaksanaan Kontrak (SIKOMPAK) dalam pelaksanaan dan pengendalian kontrak; dan"
          },
          {
            "prefix": "j.",
            "text": "hak dan kewajiban lain yang timbul akibat lingkup pekerjaan ditentukan di SSKK.",
            "fullText": "j. hak dan kewajiban lain yang timbul akibat lingkup pekerjaan ditentukan di SSKK."
          }
        ]
      },
      {
        "id": "ssuk-49",
        "pasal": 49,
        "judul": "Penggunaan Dokumen-Dokumen Kontrak dan Informasi",
        "nomorDanJudul": "49. Penggunaan Dokumen-Dokumen Kontrak dan Informasi",
        "paragraphs": [
          {
            "text": "Penyedia tidak diperkenankan menggunakan dan menginformasikan dokumen Kontrak atau dokumen lainnya yang berhubungan dengan Kontrak untuk kepentingan pihak lain, misalnya spesifikasi teknis dan/atau gambar-gambar, serta informasi lain yang berkaitan dengan Kontrak, kecuali dengan izin tertulis dari Pejabat Penandatangan Kontrak sesuai ketentuan peraturan perundang-undangan.",
            "fullText": "Penyedia tidak diperkenankan menggunakan dan menginformasikan dokumen Kontrak atau dokumen lainnya yang berhubungan dengan Kontrak untuk kepentingan pihak lain, misalnya spesifikasi teknis dan/atau gambar-gambar, serta informasi lain yang berkaitan dengan Kontrak, kecuali dengan izin tertulis dari Pejabat Penandatangan Kontrak sesuai ketentuan peraturan perundang-undangan."
          }
        ]
      },
      {
        "id": "ssuk-50",
        "pasal": 50,
        "judul": "Hak Kekayaan Intelektual",
        "nomorDanJudul": "50. Hak Kekayaan Intelektual",
        "paragraphs": [
          {
            "text": "Penyedia wajib melindungi Pejabat Penandatangan Kontrak dari segala tuntutan atau klaim dari pihak ketiga yang disebabkan penggunaan atau atas pelanggaran Hak Kekayaan Intelektual oleh Penyedia.",
            "fullText": "Penyedia wajib melindungi Pejabat Penandatangan Kontrak dari segala tuntutan atau klaim dari pihak ketiga yang disebabkan penggunaan atau atas pelanggaran Hak Kekayaan Intelektual oleh Penyedia."
          }
        ]
      },
      {
        "id": "ssuk-51",
        "pasal": 51,
        "judul": "Penanggungan Risiko",
        "nomorDanJudul": "51. Penanggungan Risiko",
        "paragraphs": [
          {
            "prefix": "51.1",
            "text": "Penyedia berkewajiban untuk melindungi, membebaskan, dan menanggung tanpa batas Pejabat Penandatangan Kontrak beserta instansinya terhadap semua bentuk tuntutan, tanggung jawab, kewajiban, kehilangan, kerugian, denda, gugatan atau tuntutan hukum, proses pemeriksaan hukum, dan biaya yang dikenakan terhadap Pejabat Penandatangan Kontrak beserta instansinya (kecuali kerugian yang mendasari tuntutan tersebut disebabkan kesalahan atau kelalaian berat Pejabat Penandatangan Kontrak) sehubungan dengan klaim yang timbul dari hal-hal berikut terhitung sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan :",
            "fullText": "51.1 Penyedia berkewajiban untuk melindungi, membebaskan, dan menanggung tanpa batas Pejabat Penandatangan Kontrak beserta instansinya terhadap semua bentuk tuntutan, tanggung jawab, kewajiban, kehilangan, kerugian, denda, gugatan atau tuntutan hukum, proses pemeriksaan hukum, dan biaya yang dikenakan terhadap Pejabat Penandatangan Kontrak beserta instansinya (kecuali kerugian yang mendasari tuntutan tersebut disebabkan kesalahan atau kelalaian berat Pejabat Penandatangan Kontrak) sehubungan dengan klaim yang timbul dari hal-hal berikut terhitung sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan :"
          },
          {
            "prefix": "a.",
            "text": "kehilangan atau kerusakan peralatan dan harta benda Penyedia, Subkontraktor (jika ada), dan tenaga kerja konstruksi;",
            "fullText": "a. kehilangan atau kerusakan peralatan dan harta benda Penyedia, Subkontraktor (jika ada), dan tenaga kerja konstruksi;"
          },
          {
            "prefix": "b.",
            "text": "cedera tubuh, sakit atau kematian tenaga kerja konstruksi;",
            "fullText": "b. cedera tubuh, sakit atau kematian tenaga kerja konstruksi;"
          },
          {
            "prefix": "c.",
            "text": "kehilangan atau kerusakan harta benda, dan cedera tubuh, sakit atau kematian pihak ketiga.",
            "fullText": "c. kehilangan atau kerusakan harta benda, dan cedera tubuh, sakit atau kematian pihak ketiga."
          },
          {
            "prefix": "51.2",
            "text": "Terhitung sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan, semua risiko kehilangan atau kerusakan hasil pekerjaan ini, bahan dan perlengkapan merupakan risiko Penyedia, kecuali kerugian atau kerusakan tersebut diakibatkan oleh kesalahan atau kelalaian Pejabat Penandatangan Kontrak.",
            "fullText": "51.2 Terhitung sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan, semua risiko kehilangan atau kerusakan hasil pekerjaan ini, bahan dan perlengkapan merupakan risiko Penyedia, kecuali kerugian atau kerusakan tersebut diakibatkan oleh kesalahan atau kelalaian Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "51.3",
            "text": "Pertanggungan asuransi yang dimiliki oleh Penyedia tidak membatasi kewajiban penanggungan dalam pasal ini. Dalam hal pertanggungan asuransi tidak mencukupi maka biaya yang timbul dan/atau selisih biaya tetap ditanggung oleh Penyedia.",
            "fullText": "51.3 Pertanggungan asuransi yang dimiliki oleh Penyedia tidak membatasi kewajiban penanggungan dalam pasal ini. Dalam hal pertanggungan asuransi tidak mencukupi maka biaya yang timbul dan/atau selisih biaya tetap ditanggung oleh Penyedia."
          },
          {
            "prefix": "51.4",
            "text": "Kehilangan atau kerusakan terhadap hasil pekerjaan atau bahan yang menyatu dengan hasil pekerjaan sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan harus diganti atau diperbaiki oleh Penyedia atas tanggungannya sendiri jika kehilangan atau kerusakan tersebut terjadi akibat tindakan atau kelalaian Penyedia.",
            "fullText": "51.4 Kehilangan atau kerusakan terhadap hasil pekerjaan atau bahan yang menyatu dengan hasil pekerjaan sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan harus diganti atau diperbaiki oleh Penyedia atas tanggungannya sendiri jika kehilangan atau kerusakan tersebut terjadi akibat tindakan atau kelalaian Penyedia."
          }
        ]
      },
      {
        "id": "ssuk-52",
        "pasal": 52,
        "judul": "Perlindungan Tenaga Kerja",
        "nomorDanJudul": "52. Perlindungan Tenaga Kerja",
        "paragraphs": [
          {
            "prefix": "52.1",
            "text": "Penyedia dan Subkontraktor berkewajiban atas biaya sendiri untuk mengikutsertakan Tenaga Kerja Konstruksinya pada program Badan Penyelenggara Jaminan Sosial (BPJS) Ketenagakerjaan serta melunasi kewajiban pembayaran BPJS tersebut sebagaimana diatur dalam peraturan perundang-undangan.",
            "fullText": "52.1 Penyedia dan Subkontraktor berkewajiban atas biaya sendiri untuk mengikutsertakan Tenaga Kerja Konstruksinya pada program Badan Penyelenggara Jaminan Sosial (BPJS) Ketenagakerjaan serta melunasi kewajiban pembayaran BPJS tersebut sebagaimana diatur dalam peraturan perundang-undangan."
          },
          {
            "prefix": "52.2",
            "text": "Penyedia berkewajiban untuk mematuhi dan memerintahkan Tenaga Kerja Konstruksinya untuk mematuhi peraturan keselamatan konstruksi kerja. Pada waktu pelaksanaan pekerjaan, Penyedia beserta Tenaga Kerja Konstruksinya dianggap telah membaca dan memahami peraturan keselamatan konstruksi kerja tersebut.",
            "fullText": "52.2 Penyedia berkewajiban untuk mematuhi dan memerintahkan Tenaga Kerja Konstruksinya untuk mematuhi peraturan keselamatan konstruksi kerja. Pada waktu pelaksanaan pekerjaan, Penyedia beserta Tenaga Kerja Konstruksinya dianggap telah membaca dan memahami peraturan keselamatan konstruksi kerja tersebut."
          },
          {
            "prefix": "52.3",
            "text": "Penyedia berkewajiban untuk menyediakan kepada setiap Tenaga Kerja Konstruksinya (termasuk Tenaga Kerja Konstruksi Subkontraktor, jika ada) perlengkapan keselamatan kerja yang sesuai dan memadai.",
            "fullText": "52.3 Penyedia berkewajiban untuk menyediakan kepada setiap Tenaga Kerja Konstruksinya (termasuk Tenaga Kerja Konstruksi Subkontraktor, jika ada) perlengkapan keselamatan kerja yang sesuai dan memadai."
          },
          {
            "prefix": "52.4",
            "text": "Tanpa mengurangi kewajiban Penyedia untuk melaporkan kecelakaan berdasarkan hukum yang berlaku, Penyedia wajib melaporkan kepada Pejabat Penandatangan Kontrak mengenai setiap kecelakaan yang timbul sehubungan dengan pelaksanaan Kontrak ini dalam waktu 24 (dua puluh empat) jam setelah kejadian.",
            "fullText": "52.4 Tanpa mengurangi kewajiban Penyedia untuk melaporkan kecelakaan berdasarkan hukum yang berlaku, Penyedia wajib melaporkan kepada Pejabat Penandatangan Kontrak mengenai setiap kecelakaan yang timbul sehubungan dengan pelaksanaan Kontrak ini dalam waktu 24 (dua puluh empat) jam setelah kejadian."
          }
        ]
      },
      {
        "id": "ssuk-53",
        "pasal": 53,
        "judul": "Pemeliharaan Lingkungan",
        "nomorDanJudul": "53. Pemeliharaan Lingkungan",
        "paragraphs": [
          {
            "text": "Penyedia berkewajiban untuk mengambil langkah-langkah yang memadai untuk melindungi lingkungan baik di dalam maupun di luar tempat kerja dan membatasi gangguan lingkungan terhadap pihak ketiga dan harta bendanya sehubungan dengan pelaksanaan Kontrak ini, sesuai dengan ketentuan peraturan perundang-undangan yang mengatur mengenai pengelolaan lingkungan hidup.",
            "fullText": "Penyedia berkewajiban untuk mengambil langkah-langkah yang memadai untuk melindungi lingkungan baik di dalam maupun di luar tempat kerja dan membatasi gangguan lingkungan terhadap pihak ketiga dan harta bendanya sehubungan dengan pelaksanaan Kontrak ini, sesuai dengan ketentuan peraturan perundang-undangan yang mengatur mengenai pengelolaan lingkungan hidup."
          }
        ]
      },
      {
        "id": "ssuk-54",
        "pasal": 54,
        "judul": "Asuransi",
        "nomorDanJudul": "54. Asuransi",
        "paragraphs": [
          {
            "prefix": "54.1",
            "text": "Apabila disyaratkan, Penyedia wajib menyediakan asuransi sejak SPMK sampai dengan Tanggal Penyerahan Akhir Pekerjaan untuk pekerjaan/barang/peralatan yang mempunyai risiko tinggi terhadap:",
            "fullText": "54.1 Apabila disyaratkan, Penyedia wajib menyediakan asuransi sejak SPMK sampai dengan Tanggal Penyerahan Akhir Pekerjaan untuk pekerjaan/barang/peralatan yang mempunyai risiko tinggi terhadap:"
          },
          {
            "prefix": "a.",
            "text": "terjadinya kecelakaan dalam pelaksanaan pekerjaan atas:",
            "fullText": "a. terjadinya kecelakaan dalam pelaksanaan pekerjaan atas:"
          },
          {
            "prefix": "1)",
            "text": "segala risiko terhadap kecelakaan;",
            "fullText": "1) segala risiko terhadap kecelakaan;"
          },
          {
            "prefix": "2)",
            "text": "kerusakan akibat kecelakaan.",
            "fullText": "2) kerusakan akibat kecelakaan."
          },
          {
            "prefix": "b.",
            "text": "kehilangan; dan/atau",
            "fullText": "b. kehilangan; dan/atau"
          },
          {
            "prefix": "c.",
            "text": "serta risiko lain yang tidak dapat diduga.",
            "fullText": "c. serta risiko lain yang tidak dapat diduga."
          },
          {
            "prefix": "54.2",
            "text": "Penyedia wajib menyediakan asuransi bagi pihak ketiga sebagai akibat kecelakaan di lokasi kerja.",
            "fullText": "54.2 Penyedia wajib menyediakan asuransi bagi pihak ketiga sebagai akibat kecelakaan di lokasi kerja."
          },
          {
            "prefix": "54.3",
            "text": "Besarnya asuransi sudah diperhitungkan dalam penawaran dan termasuk dalam Harga Kontrak.",
            "fullText": "54.3 Besarnya asuransi sudah diperhitungkan dalam penawaran dan termasuk dalam Harga Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-55",
        "pasal": 55,
        "judul": "Tindakan Penyedia yang Mensyaratkan Persetujuan Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan",
        "nomorDanJudul": "55. Tindakan Penyedia yang Mensyaratkan Persetujuan Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan",
        "paragraphs": [
          {
            "prefix": "55.1",
            "text": "Penyedia berkewajiban untuk mendapatkan lebih dahulu persetujuan tertulis Pejabat Penandatangan Kontrak sebelum melakukan tindakan-tindakan berikut:",
            "fullText": "55.1 Penyedia berkewajiban untuk mendapatkan lebih dahulu persetujuan tertulis Pejabat Penandatangan Kontrak sebelum melakukan tindakan-tindakan berikut:"
          },
          {
            "prefix": "b.",
            "text": "mensubkontrakkan sebagian pekerjaan yang belum tercantum dalam Lampiran A SSKK;",
            "fullText": "a. mensubkontrakkan sebagian pekerjaan yang belum tercantum dalam Lampiran A SSKK;"
          },
          {
            "prefix": "c.",
            "text": "menunjuk Personel Manajerial yang namanya tidak tercantum dalam Lampiran A SSKK;",
            "fullText": "b. menunjuk Personel Manajerial yang namanya tidak tercantum dalam Lampiran A SSKK;"
          },
          {
            "prefix": "d.",
            "text": "mengubah atau memutakhirkan dokumen penerapan SMKK;",
            "fullText": "c. mengubah atau memutakhirkan dokumen penerapan SMKK;"
          },
          {
            "prefix": "a.",
            "text": "tindakan lain selain yang diatur dalam SSKK.",
            "fullText": "d. tindakan lain selain yang diatur dalam SSKK."
          },
          {
            "prefix": "55.2",
            "text": "Penyedia berkewajiban untuk mendapatkan lebih dahulu persetujuan tertulis Pengawas Pekerjaan sebelum melakukan tindakan-tindakan berikut:",
            "fullText": "55.2 Penyedia berkewajiban untuk mendapatkan lebih dahulu persetujuan tertulis Pengawas Pekerjaan sebelum melakukan tindakan-tindakan berikut:"
          },
          {
            "prefix": "b.",
            "text": "melaksanakan setiap tahapan pekerjaan berdasarkan rencana kerja dan metode kerja;",
            "fullText": "a. melaksanakan setiap tahapan pekerjaan berdasarkan rencana kerja dan metode kerja;"
          },
          {
            "prefix": "c.",
            "text": "mengubah syarat dan ketentuan polis asuransi;",
            "fullText": "b. mengubah syarat dan ketentuan polis asuransi;"
          },
          {
            "prefix": "d.",
            "text": "mengubah Personel Manajerial dan/atau Peralatan Utama;",
            "fullText": "c. mengubah Personel Manajerial dan/atau Peralatan Utama;"
          },
          {
            "prefix": "d.",
            "text": "tindakan lain selain yang diatur dalam SSKK.",
            "fullText": "d. tindakan lain selain yang diatur dalam SSKK."
          },
          {
            "prefix": "55.3",
            "text": "Tindakan lain dalam Pasal 55.1 huruf d dan 55.2 huruf d dituangkan dalam SSKK",
            "fullText": "55.3 Tindakan lain dalam Pasal 55.1 huruf d dan 55.2 huruf d dituangkan dalam SSKK"
          }
        ]
      },
      {
        "id": "ssuk-56",
        "pasal": 56,
        "judul": "Laporan Hasil Pekerjaan",
        "nomorDanJudul": "56. Laporan Hasil Pekerjaan",
        "paragraphs": [
          {
            "prefix": "56.1",
            "text": "Pemeriksaan pekerjaan dilakukan selama pelaksanaan Kontrak untuk menetapkan volume pekerjaan atau kegiatan yang telah dilaksanakan guna pembayaran hasil pekerjaan. Hasil pemeriksaan pekerjaan dituangkan dalam laporan kemajuan hasil pekerjaan.",
            "fullText": "56.1 Pemeriksaan pekerjaan dilakukan selama pelaksanaan Kontrak untuk menetapkan volume pekerjaan atau kegiatan yang telah dilaksanakan guna pembayaran hasil pekerjaan. Hasil pemeriksaan pekerjaan dituangkan dalam laporan kemajuan hasil pekerjaan."
          },
          {
            "prefix": "56.2",
            "text": "Untuk kepentingan pengendalian dan pengawasan pelaksanaan pekerjaan, seluruh aktivitas kegiatan pekerjaan di lokasi pekerjaan dicatat sebagai bahan laporan harian pekerjaan yang berisi rencana dan realisasi pekerjaan harian.",
            "fullText": "56.2 Untuk kepentingan pengendalian dan pengawasan pelaksanaan pekerjaan, seluruh aktivitas kegiatan pekerjaan di lokasi pekerjaan dicatat sebagai bahan laporan harian pekerjaan yang berisi rencana dan realisasi pekerjaan harian."
          },
          {
            "prefix": "56.3",
            "text": "Laporan harian berisi:",
            "fullText": "56.3 Laporan harian berisi:"
          },
          {
            "prefix": "a.",
            "text": "jenis dan kuantitas bahan yang berada di lokasi pekerjaan;",
            "fullText": "a. jenis dan kuantitas bahan yang berada di lokasi pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "penempatan tenaga kerja konstruksi untuk tiap macam tugasnya;",
            "fullText": "b. penempatan tenaga kerja konstruksi untuk tiap macam tugasnya;"
          },
          {
            "prefix": "c.",
            "text": "jenis, jumlah dan kondisi peralatan;",
            "fullText": "c. jenis, jumlah dan kondisi peralatan;"
          },
          {
            "prefix": "d.",
            "text": "jenis dan kuantitas pekerjaan yang dilaksanakan;",
            "fullText": "d. jenis dan kuantitas pekerjaan yang dilaksanakan;"
          },
          {
            "prefix": "e.",
            "text": "keadaan cuaca termasuk hujan, banjir dan peristiwa alam lainnya yang berpengaruh terhadap kelancaran pekerjaan; dan",
            "fullText": "e. keadaan cuaca termasuk hujan, banjir dan peristiwa alam lainnya yang berpengaruh terhadap kelancaran pekerjaan; dan"
          },
          {
            "prefix": "f.",
            "text": "catatan-catatan lain yang berkenaan dengan pelaksanaan pekerjaan.",
            "fullText": "f. catatan-catatan lain yang berkenaan dengan pelaksanaan pekerjaan."
          },
          {
            "prefix": "56.4",
            "text": "Laporan mingguan terdiri dari rangkuman laporan harian dan berisi hasil kemajuan fisik pekerjaan dalam periode satu minggu, serta hal-hal penting yang perlu ditonjolkan.",
            "fullText": "56.4 Laporan mingguan terdiri dari rangkuman laporan harian dan berisi hasil kemajuan fisik pekerjaan dalam periode satu minggu, serta hal-hal penting yang perlu ditonjolkan."
          },
          {
            "prefix": "56.5",
            "text": "Laporan bulanan terdiri dari rangkuman laporan mingguan dan berisi hasil kemajuan fisik pekerjaan dalam periode satu bulan, serta hal-hal penting yang perlu ditonjolkan.",
            "fullText": "56.5 Laporan bulanan terdiri dari rangkuman laporan mingguan dan berisi hasil kemajuan fisik pekerjaan dalam periode satu bulan, serta hal-hal penting yang perlu ditonjolkan."
          },
          {
            "prefix": "56.6",
            "text": "Untuk merekam kegiatan pelaksanaan pekerjaan konstruksi, Pejabat Penandatangan Kontrak dan Penyedia membuat foto-foto dokumentasi dan video pelaksanaan pekerjaan di lokasi pekerjaan sesuai kebutuhan.",
            "fullText": "56.6 Untuk merekam kegiatan pelaksanaan pekerjaan konstruksi, Pejabat Penandatangan Kontrak dan Penyedia membuat foto-foto dokumentasi dan video pelaksanaan pekerjaan di lokasi pekerjaan sesuai kebutuhan."
          },
          {
            "prefix": "56.7",
            "text": "Laporan hasil pekerjaan dibuat oleh Penyedia, diperiksa oleh Pengawas Pekerjaan, dan disetujui oleh Pejabat Penandatangan Kontrak.",
            "fullText": "56.7 Laporan hasil pekerjaan dibuat oleh Penyedia, diperiksa oleh Pengawas Pekerjaan, dan disetujui oleh Pejabat Penandatangan Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-57",
        "pasal": 57,
        "judul": "Kepemilikan Dokumen",
        "nomorDanJudul": "57. Kepemilikan Dokumen",
        "paragraphs": [
          {
            "text": "Semua rancangan, gambar, spesifikasi, desain, laporan, dan/atau dokumen-dokumen lain serta piranti lunak yang dipersiapkan oleh Penyedia berdasarkan Kontrak ini sepenuhnya merupakan hak milik Pejabat Penandatangan Kontrak. Penyedia paling lambat pada waktu pemutusan atau penghentian atau akhir Masa Kontrak berkewajiban untuk menyerahkan semua dokumen dan piranti lunak tersebut beserta daftar rinciannya kepada Pejabat Penandatangan Kontrak. Penyedia dapat menyimpan 1 (satu) buah salinan tiap dokumen dan piranti lunak tersebut. Pembatasan (jika ada) mengenai penggunaan dokumen dan piranti lunak tersebut di atas di kemudian hari diatur dalam SSKK.",
            "fullText": "Semua rancangan, gambar, spesifikasi, desain, laporan, dan/atau dokumen-dokumen lain serta piranti lunak yang dipersiapkan oleh Penyedia berdasarkan Kontrak ini sepenuhnya merupakan hak milik Pejabat Penandatangan Kontrak. Penyedia paling lambat pada waktu pemutusan atau penghentian atau akhir Masa Kontrak berkewajiban untuk menyerahkan semua dokumen dan piranti lunak tersebut beserta daftar rinciannya kepada Pejabat Penandatangan Kontrak. Penyedia dapat menyimpan 1 (satu) buah salinan tiap dokumen dan piranti lunak tersebut. Pembatasan (jika ada) mengenai penggunaan dokumen dan piranti lunak tersebut di atas di kemudian hari diatur dalam SSKK."
          }
        ]
      },
      {
        "id": "ssuk-58",
        "pasal": 58,
        "judul": "Kerjasama Antara Penyedia dan Subkontraktor",
        "nomorDanJudul": "58. Kerjasama Antara Penyedia dan Subkontraktor",
        "paragraphs": [
          {
            "prefix": "58.1",
            "text": "Persyaratan pekerjaan yang disubkontrakkan harus memperhatikan:",
            "fullText": "58.1 Persyaratan pekerjaan yang disubkontrakkan harus memperhatikan:"
          },
          {
            "prefix": "a.",
            "text": "Dalam hal nilai pagu anggaran di atas Rp25.000.000.000,00 (dua puluh lima miliar rupiah), jenis pekerjaan yang wajib disubkontrakkan dicantumkan dalam dokumen kompetisi berdasarkan penetapan Pejabat Penandatangan Kontrak dalam dokumen persiapan pengadaan; dan",
            "fullText": "a. Dalam hal nilai pagu anggaran di atas Rp25.000.000.000,00 (dua puluh lima miliar rupiah), jenis pekerjaan yang wajib disubkontrakkan dicantumkan dalam dokumen kompetisi berdasarkan penetapan Pejabat Penandatangan Kontrak dalam dokumen persiapan pengadaan; dan"
          },
          {
            "prefix": "b.",
            "text": "Bagian pekerjaan yang wajib disubkontrakkan yaitu:",
            "fullText": "b. Bagian pekerjaan yang wajib disubkontrakkan yaitu:"
          },
          {
            "prefix": "1)",
            "text": "Sebagian pekerjaan utama yang disubkontrakkan kepada penyedia jasa spesialis, dengan ketentuan:",
            "fullText": "1) Sebagian pekerjaan utama yang disubkontrakkan kepada penyedia jasa spesialis, dengan ketentuan:"
          },
          {
            "prefix": "a)",
            "text": "Paling banyak 2 (dua) pekerjaan;",
            "fullText": "a) Paling banyak 2 (dua) pekerjaan;"
          },
          {
            "prefix": "b)",
            "text": "Pekerjaan sebagaimana dimaksud pada huruf a) sesuai dengan subklasifikasi SBU;",
            "fullText": "b) Pekerjaan sebagaimana dimaksud pada huruf a) sesuai dengan subklasifikasi SBU;"
          },
          {
            "prefix": "2)",
            "text": "Sebagian pekerjaan yang bukan pekerjaan utama kepada sub penyedia jasa usaha kualifikasi kecil dengan ketentuan:",
            "fullText": "2) Sebagian pekerjaan yang bukan pekerjaan utama kepada sub penyedia jasa usaha kualifikasi kecil dengan ketentuan:"
          },
          {
            "prefix": "a)",
            "text": "Paling banyak 2 (dua) pekerjaan;",
            "fullText": "a) Paling banyak 2 (dua) pekerjaan;"
          },
          {
            "prefix": "b)",
            "text": "Pekerjaan sebagaimana dimaksud pada huruf a) tidak mensyaratkan subklasifikasi SBU.",
            "fullText": "b) Pekerjaan sebagaimana dimaksud pada huruf a) tidak mensyaratkan subklasifikasi SBU."
          },
          {
            "prefix": "58.2",
            "text": "Penyedia tetap bertanggung jawab atas bagian pekerjaan yang disubkontrakkan tersebut.",
            "fullText": "58.2 Penyedia tetap bertanggung jawab atas bagian pekerjaan yang disubkontrakkan tersebut."
          },
          {
            "prefix": "58.3",
            "text": "Subkontraktor dilarang mengalihkan atau mensubkontrakkan pekerjaan.",
            "fullText": "58.3 Subkontraktor dilarang mengalihkan atau mensubkontrakkan pekerjaan."
          },
          {
            "prefix": "58.4",
            "text": "Penyedia Usaha Kecil tidak boleh mensubkontrakkan pekerjaan kepada pihak lain.",
            "fullText": "58.4 Penyedia Usaha Kecil tidak boleh mensubkontrakkan pekerjaan kepada pihak lain."
          },
          {
            "prefix": "58.5",
            "text": "Penyedia Usaha Non Kecil yang melakukan kerjasama dengan Subkontraktor hanya boleh melaksanakan sesuai dengan daftar bagian pekerjaan yang disubkontrakkan (apabila ada) yang dituangkan dalam Lampiran A SSKK.",
            "fullText": "58.5 Penyedia Usaha Non Kecil yang melakukan kerjasama dengan Subkontraktor hanya boleh melaksanakan sesuai dengan daftar bagian pekerjaan yang disubkontrakkan (apabila ada) yang dituangkan dalam Lampiran A SSKK."
          },
          {
            "prefix": "58.6",
            "text": "Lampiran A SSKK (Daftar Pekerjaan yang Disubkontrakkan dan Subkontraktor) tidak boleh diubah kecuali atas persetujuan tertulis dari Pejabat Penandatangan Kontrak dan dituangkan dalam adendum Kontrak.",
            "fullText": "58.6 Lampiran A SSKK (Daftar Pekerjaan yang Disubkontrakkan dan Subkontraktor) tidak boleh diubah kecuali atas persetujuan tertulis dari Pejabat Penandatangan Kontrak dan dituangkan dalam adendum Kontrak."
          },
          {
            "prefix": "58.7",
            "text": "Pelaksanaan Kerjasama Antara Penyedia dan Subkontraktor diawasi oleh Pengawas Pekerjaan dan Penyedia  melaporkan secara periodik kepada Pejabat Penandatangan Kontrak.",
            "fullText": "58.7 Pelaksanaan Kerjasama Antara Penyedia dan Subkontraktor diawasi oleh Pengawas Pekerjaan dan Penyedia  melaporkan secara periodik kepada Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "58.8",
            "text": "Apabila Penyedia melanggar ketentuan sebagaimana diatur pada pasal 58.4 atau 58.5 maka akan dikenakan denda senilai pekerjaan yang disubkontrakkan tersebut.",
            "fullText": "58.8 Apabila Penyedia melanggar ketentuan sebagaimana diatur pada pasal 58.4 atau 58.5 maka akan dikenakan denda senilai pekerjaan yang disubkontrakkan tersebut."
          }
        ]
      },
      {
        "id": "ssuk-59",
        "pasal": 59,
        "judul": "Penyedia Lain",
        "nomorDanJudul": "59. Penyedia Lain",
        "paragraphs": [
          {
            "text": "Penyedia berkewajiban untuk bekerjasama dan menggunakan lokasi kerja termasuk jalan akses bersama-sama dengan Penyedia Lain (jika ada) dan pihak-pihak lainnya yang berkepentingan atas lokasi kerja. Jika dipandang perlu, Pejabat Penandatangan Kontrak dapat memberikan jadwal kerja Penyedia Lain di lokasi kerja.",
            "fullText": "Penyedia berkewajiban untuk bekerjasama dan menggunakan lokasi kerja termasuk jalan akses bersama-sama dengan Penyedia Lain (jika ada) dan pihak-pihak lainnya yang berkepentingan atas lokasi kerja. Jika dipandang perlu, Pejabat Penandatangan Kontrak dapat memberikan jadwal kerja Penyedia Lain di lokasi kerja."
          }
        ]
      },
      {
        "id": "ssuk-60",
        "pasal": 60,
        "judul": "Alih Pengalaman/Keahlian",
        "nomorDanJudul": "60. Alih Pengalaman/Keahlian",
        "paragraphs": [
          {
            "text": "Dalam hal pelaksanaan paket pekerjaan konstruksi dengan nilai pagu anggaran di atas Rp50.000.000.000,00 (lima puluh miliar rupiah), Penyedia memenuhi ketentuan alih pengalaman/keahlian bidang konstruksi melalui sistem kerja praktek/magang sesuai dengan jumlah Peserta, durasi pelaksanaan, dan jenis keahlian yang disepakati pada saat Rapat Persiapan Penandatanganan Kontrak.",
            "fullText": "Dalam hal pelaksanaan paket pekerjaan konstruksi dengan nilai pagu anggaran di atas Rp50.000.000.000,00 (lima puluh miliar rupiah), Penyedia memenuhi ketentuan alih pengalaman/keahlian bidang konstruksi melalui sistem kerja praktek/magang sesuai dengan jumlah Peserta, durasi pelaksanaan, dan jenis keahlian yang disepakati pada saat Rapat Persiapan Penandatanganan Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-61",
        "pasal": 61,
        "judul": "Pembayaran Denda",
        "nomorDanJudul": "61. Pembayaran Denda",
        "paragraphs": [
          {
            "text": "Penyedia berkewajiban untuk membayar sanksi finansial berupa denda sebagai akibat wanprestasi atau cedera janji terhadap kewajiban-kewajiban Penyedia dalam Kontrak ini. Pejabat Penandatangan Kontrak mengenakan denda dengan memotong angsuran pembayaran prestasi pekerjaan Penyedia. Pembayaran denda tidak mengurangi tanggung jawab kontraktual Penyedia.",
            "fullText": "Penyedia berkewajiban untuk membayar sanksi finansial berupa denda sebagai akibat wanprestasi atau cedera janji terhadap kewajiban-kewajiban Penyedia dalam Kontrak ini. Pejabat Penandatangan Kontrak mengenakan denda dengan memotong angsuran pembayaran prestasi pekerjaan Penyedia. Pembayaran denda tidak mengurangi tanggung jawab kontraktual Penyedia."
          }
        ]
      },
      {
        "id": "ssuk-62",
        "pasal": 62,
        "judul": "Jaminan",
        "nomorDanJudul": "62. Jaminan",
        "paragraphs": [
          {
            "prefix": "62.1",
            "text": "Jaminan yang digunakan dalam pelaksanaan Kontrak ini dapat berupa bank garansi atau surety bond. Jaminan bersifat tidak bersyarat, mudah dicairkan, dan harus dicairkan oleh penerbit jaminan paling lambat 14 (empat belas) hari kerja setelah surat perintah pencairan dari Pejabat Penandatangan Kontrak atau pihak yang diberi kuasa oleh  Pejabat Penandatangan Kontrak diterima.",
            "fullText": "62.1 Jaminan yang digunakan dalam pelaksanaan Kontrak ini dapat berupa bank garansi atau surety bond. Jaminan bersifat tidak bersyarat, mudah dicairkan, dan harus dicairkan oleh penerbit jaminan paling lambat 14 (empat belas) hari kerja setelah surat perintah pencairan dari Pejabat Penandatangan Kontrak atau pihak yang diberi kuasa oleh  Pejabat Penandatangan Kontrak diterima."
          },
          {
            "prefix": "62.2",
            "text": "Penerbit Jaminan selain Bank Umum harus telah ditetapkan/mendapat rekomendasi dari Otoritas Jasa Keuangan (OJK)",
            "fullText": "62.2 Penerbit Jaminan selain Bank Umum harus telah ditetapkan/mendapat rekomendasi dari Otoritas Jasa Keuangan (OJK)"
          },
          {
            "prefix": "62.3",
            "text": "Penggunaan Jaminan Pelaksanaan, Jaminan Uang Muka dan Jaminan Pemeliharaan sebagai berikut:",
            "fullText": "62.3 Penggunaan Jaminan Pelaksanaan, Jaminan Uang Muka dan Jaminan Pemeliharaan sebagai berikut:"
          },
          {
            "prefix": "a.",
            "text": "Bank Umum;",
            "fullText": "a. Bank Umum;"
          },
          {
            "prefix": "b.",
            "text": "Perusahaan Asuransi;",
            "fullText": "b. Perusahaan Asuransi;"
          },
          {
            "prefix": "c.",
            "text": "Perusahaan Penjaminan; atau",
            "fullText": "c. Perusahaan Penjaminan; atau"
          },
          {
            "prefix": "d.",
            "text": "lembaga keuangan khusus yang menjalankan usaha di bidang pembiayaan, penjaminan, dan asuransi untuk mendorong ekspor Indonesia sesuai dengan ketentuan peraturan perundang-undangan di bidang lembaga pembiayaan ekspor Indonesia.",
            "fullText": "d. lembaga keuangan khusus yang menjalankan usaha di bidang pembiayaan, penjaminan, dan asuransi untuk mendorong ekspor Indonesia sesuai dengan ketentuan peraturan perundang-undangan di bidang lembaga pembiayaan ekspor Indonesia."
          },
          {
            "prefix": "e.",
            "text": "Konsorsium perusahaan asuransi umum/ Konsorsium Lembaga penjaminan/ Konsorsium perusahaan penjaminan yang mempunyai program asuransi kerugian (suretyship).",
            "fullText": "e. Konsorsium perusahaan asuransi umum/ Konsorsium Lembaga penjaminan/ Konsorsium perusahaan penjaminan yang mempunyai program asuransi kerugian (suretyship)."
          },
          {
            "prefix": "62.4",
            "text": "Jaminan Pelaksanaan diberikan kepada Pejabat Penandatangan Kontrak setelah diterbitkannya Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) sebelum dilakukan Penandatanganan Kontrak dengan besar:",
            "fullText": "62.4 Jaminan Pelaksanaan diberikan kepada Pejabat Penandatangan Kontrak setelah diterbitkannya Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) sebelum dilakukan Penandatanganan Kontrak dengan besar:"
          },
          {
            "prefix": "a.",
            "text": "5% (lima persen) dari Harga Kontrak untuk harga penawaran antara 80% (delapan puluh persen) sampai dengan 100% (seratus persen) Nilai Total Pagu Kompetisi; atau",
            "fullText": "a. 5% (lima persen) dari Harga Kontrak untuk harga penawaran antara 80% (delapan puluh persen) sampai dengan 100% (seratus persen) Nilai Total Pagu Kompetisi; atau"
          },
          {
            "prefix": "b.",
            "text": "5% (lima persen) dari Nilai Total Pagu Kompetisi untuk harga penawaran di bawah 80% (delapan puluh persen) dari Nilai Total Pagu Kompetisi.",
            "fullText": "b. 5% (lima persen) dari Nilai Total Pagu Kompetisi untuk harga penawaran di bawah 80% (delapan puluh persen) dari Nilai Total Pagu Kompetisi."
          },
          {
            "prefix": "62.5",
            "text": "Masa berlakunya Jaminan Pelaksanaan paling kurang sejak tanggal penandatangananan Kontrak sampai dengan Tanggal Penyerahan Pertama Pekerjaan (Provisional Hand Over/PHO).",
            "fullText": "62.5 Masa berlakunya Jaminan Pelaksanaan paling kurang sejak tanggal penandatangananan Kontrak sampai dengan Tanggal Penyerahan Pertama Pekerjaan (Provisional Hand Over/PHO)."
          },
          {
            "prefix": "62.6",
            "text": "Jaminan Pelaksanaan dikembalikan setelah pekerjaan dinyatakan selesai 100% (seratus persen) dan diganti dengan Jaminan Pemeliharaan atau menahan uang retensi sebesar 5% (lima persen) dari Harga Kontrak;",
            "fullText": "62.6 Jaminan Pelaksanaan dikembalikan setelah pekerjaan dinyatakan selesai 100% (seratus persen) dan diganti dengan Jaminan Pemeliharaan atau menahan uang retensi sebesar 5% (lima persen) dari Harga Kontrak;"
          },
          {
            "prefix": "62.7",
            "text": "Jaminan  Uang  Muka  diberikan  kepada Pejabat Penandatangan Kontrak dalam  rangka  pengambilan  uang muka yang besarannya paling kurang sama dengan besarnya uang muka yang diterima Penyedia.",
            "fullText": "62.7 Jaminan  Uang  Muka  diberikan  kepada Pejabat Penandatangan Kontrak dalam  rangka  pengambilan  uang muka yang besarannya paling kurang sama dengan besarnya uang muka yang diterima Penyedia."
          },
          {
            "prefix": "62.8",
            "text": "Nilai Jaminan Uang Muka dapat dikurangi secara proporsional sesuai dengan sisa uang muka yang diterima.",
            "fullText": "62.8 Nilai Jaminan Uang Muka dapat dikurangi secara proporsional sesuai dengan sisa uang muka yang diterima."
          },
          {
            "prefix": "62.9",
            "text": "Masa berlakunya Jaminan Uang Muka paling kurang sejak tanggal persetujuan pemberian uang muka sampai dengan Tanggal Penyerahan Pertama Pekerjaan (PHO).",
            "fullText": "62.9 Masa berlakunya Jaminan Uang Muka paling kurang sejak tanggal persetujuan pemberian uang muka sampai dengan Tanggal Penyerahan Pertama Pekerjaan (PHO)."
          },
          {
            "prefix": "62.10",
            "text": "Jaminan Pemeliharaan diberikan kepada Pejabat Penandatangan Kontrak setelah pekerjaan dinyatakan selesai 100% (seratus persen).",
            "fullText": "62.10 Jaminan Pemeliharaan diberikan kepada Pejabat Penandatangan Kontrak setelah pekerjaan dinyatakan selesai 100% (seratus persen)."
          },
          {
            "prefix": "62.11",
            "text": "Pengembalian Jaminan Pemeliharaan dilakukan paling lambat 14 (empat belas) hari kerja setelah Masa Pemeliharaan selesai dan pekerjaan diterima dengan baik sesuai dengan ketentuan Kontrak.",
            "fullText": "62.11 Pengembalian Jaminan Pemeliharaan dilakukan paling lambat 14 (empat belas) hari kerja setelah Masa Pemeliharaan selesai dan pekerjaan diterima dengan baik sesuai dengan ketentuan Kontrak."
          },
          {
            "prefix": "62.12",
            "text": "Masa berlaku Jaminan Pemeliharaan paling kurang sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan (Final Hand Over/FHO).",
            "fullText": "62.12 Masa berlaku Jaminan Pemeliharaan paling kurang sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan (Final Hand Over/FHO)."
          }
        ]
      }
    ]
  },
  {
    "id": "ssuk-sec-d",
    "huruf": "D",
    "judul": "HAK DAN KEWAJIBAN PEJABAT PENANDATANGAN KONTRAK",
    "nomorDanJudul": "D. HAK DAN KEWAJIBAN PEJABAT PENANDATANGAN KONTRAK",
    "clauses": [
      {
        "id": "ssuk-63",
        "pasal": 63,
        "judul": "Hak dan Kewajiban Pejabat Penandatangan Kontrak",
        "nomorDanJudul": "63. Hak dan Kewajiban Pejabat Penandatangan Kontrak",
        "paragraphs": [
          {
            "text": "Hak-hak yang dimiliki serta kewajiban-kewajiban yang harus dilaksanakan oleh Pejabat Penandatangan Kontrak dalam melaksanakan Kontrak, meliputi :",
            "fullText": "Hak-hak yang dimiliki serta kewajiban-kewajiban yang harus dilaksanakan oleh Pejabat Penandatangan Kontrak dalam melaksanakan Kontrak, meliputi :"
          },
          {
            "prefix": "a.",
            "text": "mengawasi dan memeriksa pekerjaan yang dilaksanakan oleh Penyedia;",
            "fullText": "a. mengawasi dan memeriksa pekerjaan yang dilaksanakan oleh Penyedia;"
          },
          {
            "prefix": "b.",
            "text": "mendapat pekerjaan yang dilaksanakan dan diselesaikan secara cermat, akurat dan penuh tanggung jawab dengan menyediakan tenaga kerja, bahan-bahan, peralatan, angkutan ke atau dari lapangan, dan segala pekerjaan permanen maupun sementara yang diperlukan untuk pelaksanaan, penyelesaian dan perbaikan pekerjaan yang dirinci dalam Kontrak;",
            "fullText": "b. mendapat pekerjaan yang dilaksanakan dan diselesaikan secara cermat, akurat dan penuh tanggung jawab dengan menyediakan tenaga kerja, bahan-bahan, peralatan, angkutan ke atau dari lapangan, dan segala pekerjaan permanen maupun sementara yang diperlukan untuk pelaksanaan, penyelesaian dan perbaikan pekerjaan yang dirinci dalam Kontrak;"
          },
          {
            "prefix": "c.",
            "text": "menerima laporan-laporan secara periodik mengenai pelaksanaan pekerjaan yang dilaksanakan oleh Penyedia;",
            "fullText": "c. menerima laporan-laporan secara periodik mengenai pelaksanaan pekerjaan yang dilaksanakan oleh Penyedia;"
          },
          {
            "prefix": "d.",
            "text": "menerima hasil pekerjaan sesuai dengan jadwal penyerahan pekerjaan dan ketentuan yang telah ditetapkan dalam Kontrak.",
            "fullText": "d. menerima hasil pekerjaan sesuai dengan jadwal penyerahan pekerjaan dan ketentuan yang telah ditetapkan dalam Kontrak."
          },
          {
            "prefix": "e.",
            "text": "membayar pekerjaan sesuai dengan harga yang tercantum dalam Kontrak yang telah ditetapkan kepada Penyedia;",
            "fullText": "e. membayar pekerjaan sesuai dengan harga yang tercantum dalam Kontrak yang telah ditetapkan kepada Penyedia;"
          },
          {
            "prefix": "f.",
            "text": "memberikan fasilitas berupa sarana dan prasarana yang dibutuhkan oleh Penyedia untuk kelancaran pelaksanaan pekerjaan sesuai ketentuan Kontrak;",
            "fullText": "f. memberikan fasilitas berupa sarana dan prasarana yang dibutuhkan oleh Penyedia untuk kelancaran pelaksanaan pekerjaan sesuai ketentuan Kontrak;"
          },
          {
            "prefix": "g.",
            "text": "menilai kinerja Penyedia; dan",
            "fullText": "g. menilai kinerja Penyedia; dan"
          },
          {
            "prefix": "h.",
            "text": "Menggunakan Sistem Informasi Kontrak dan Manajemen Pengendalian Pelaksanaan Kontrak (SIKOMPAK) dalam pelaksanaan dan pengendalian kontrak.",
            "fullText": "h. Menggunakan Sistem Informasi Kontrak dan Manajemen Pengendalian Pelaksanaan Kontrak (SIKOMPAK) dalam pelaksanaan dan pengendalian kontrak."
          }
        ]
      },
      {
        "id": "ssuk-64",
        "pasal": 64,
        "judul": "Fasilitas",
        "nomorDanJudul": "64. Fasilitas",
        "paragraphs": [
          {
            "text": "Pejabat Penandatangan Kontrak dapat memberikan fasilitas berupa sarana dan prasarana atau kemudahan lainnya (jika ada) yang tercantum dalam SSKK untuk kelancaran pelaksanan pekerjaan ini.",
            "fullText": "Pejabat Penandatangan Kontrak dapat memberikan fasilitas berupa sarana dan prasarana atau kemudahan lainnya (jika ada) yang tercantum dalam SSKK untuk kelancaran pelaksanan pekerjaan ini."
          }
        ]
      },
      {
        "id": "ssuk-65",
        "pasal": 65,
        "judul": "Peristiwa Kompensasi",
        "nomorDanJudul": "65. Peristiwa Kompensasi",
        "paragraphs": [
          {
            "prefix": "65.1",
            "text": "Peristiwa Kompensasi dapat diberikan kepada Penyedia yaitu:",
            "fullText": "65.1 Peristiwa Kompensasi dapat diberikan kepada Penyedia yaitu:"
          },
          {
            "prefix": "a.",
            "text": "Pejabat Penandatangan Kontrak mengubah jadwal pekerjaan yang dapat mempengaruhi pelaksanaan pekerjaan;",
            "fullText": "a. Pejabat Penandatangan Kontrak mengubah jadwal pekerjaan yang dapat mempengaruhi pelaksanaan pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "keterlambatan pembayaran kepada Penyedia;",
            "fullText": "b. keterlambatan pembayaran kepada Penyedia;"
          },
          {
            "prefix": "c.",
            "text": "Pejabat Penandatangan Kontrak tidak memberikan gambar-gambar, spesifikasi dan/atau instruksi sesuai jadwal yang dibutuhkan;",
            "fullText": "c. Pejabat Penandatangan Kontrak tidak memberikan gambar-gambar, spesifikasi dan/atau instruksi sesuai jadwal yang dibutuhkan;"
          },
          {
            "prefix": "d.",
            "text": "Penyedia belum bisa masuk ke lokasi sesuai jadwal dalam kontrak;",
            "fullText": "d. Penyedia belum bisa masuk ke lokasi sesuai jadwal dalam kontrak;"
          },
          {
            "prefix": "e.",
            "text": "Pejabat Penandatangan Kontrak menginstruksikan kepada pihak Penyedia untuk melakukan pengujian tambahan yang setelah dilaksanakan pengujian ternyata tidak ditemukan kerusakan/kegagalan/penyimpangan;",
            "fullText": "e. Pejabat Penandatangan Kontrak menginstruksikan kepada pihak Penyedia untuk melakukan pengujian tambahan yang setelah dilaksanakan pengujian ternyata tidak ditemukan kerusakan/kegagalan/penyimpangan;"
          },
          {
            "prefix": "f.",
            "text": "Pejabat Penandatangan Kontrak memerintahkan penundaan pelaksanaan pekerjaan;",
            "fullText": "f. Pejabat Penandatangan Kontrak memerintahkan penundaan pelaksanaan pekerjaan;"
          },
          {
            "prefix": "g.",
            "text": "Pejabat Penandatangan Kontrak memerintahkan untuk mengatasi kondisi tertentu yang tidak dapat diduga sebelumnya yang disebabkan/tidak disebabkan oleh Pejabat Penandatangan Kontrak; atau",
            "fullText": "g. Pejabat Penandatangan Kontrak memerintahkan untuk mengatasi kondisi tertentu yang tidak dapat diduga sebelumnya yang disebabkan/tidak disebabkan oleh Pejabat Penandatangan Kontrak; atau"
          },
          {
            "prefix": "h.",
            "text": "ketentuan lain dalam SSKK.",
            "fullText": "h. ketentuan lain dalam SSKK."
          },
          {
            "prefix": "65.2",
            "text": "Jika Peristiwa Kompensasi mengakibatkan pengeluaran tambahan dan/atau keterlambatan penyelesaian pekerjaan maka Pejabat Penandatangan Kontrak berkewajiban untuk membayar ganti rugi dan/atau memberikan perpanjangan Masa Pelaksanaan.",
            "fullText": "65.2 Jika Peristiwa Kompensasi mengakibatkan pengeluaran tambahan dan/atau keterlambatan penyelesaian pekerjaan maka Pejabat Penandatangan Kontrak berkewajiban untuk membayar ganti rugi dan/atau memberikan perpanjangan Masa Pelaksanaan."
          },
          {
            "prefix": "65.3",
            "text": "Ganti rugi akibat Peristiwa Kompensasi hanya dapat dibayarkan jika berdasarkan data penunjang dan perhitungan kompensasi yang diajukan oleh Penyedia kepada Pejabat Penandatangan Kontrak, dapat dibuktikan kerugian nyata.",
            "fullText": "65.3 Ganti rugi akibat Peristiwa Kompensasi hanya dapat dibayarkan jika berdasarkan data penunjang dan perhitungan kompensasi yang diajukan oleh Penyedia kepada Pejabat Penandatangan Kontrak, dapat dibuktikan kerugian nyata."
          },
          {
            "prefix": "65.4",
            "text": "Perpanjangan Masa Pelaksanaan hanya dapat diberikan jika berdasarkan data penunjang dan perhitungan kompensasi yang diajukan oleh Penyedia kepada Pejabat Penandatangan Kontrak, dapat dibuktikan perlunya tambahan waktu akibat Peristiwa Kompensasi.",
            "fullText": "65.4 Perpanjangan Masa Pelaksanaan hanya dapat diberikan jika berdasarkan data penunjang dan perhitungan kompensasi yang diajukan oleh Penyedia kepada Pejabat Penandatangan Kontrak, dapat dibuktikan perlunya tambahan waktu akibat Peristiwa Kompensasi."
          },
          {
            "prefix": "65.5",
            "text": "Penyedia tidak berhak atas ganti rugi dan/atau perpanjangan Masa Pelaksanaan jika Penyedia gagal atau lalai untuk memberikan peringatan dini dalam mengantisipasi atau mengatasi dampak Peristiwa Kompensasi. Peringatan dini tersebut disampaikan kepada Pengawas Pekerjaan dengan tembusan kepada Pejabat Penandatangan Kontrak paling lambat 14 (empat belas) hari kalender sejak menyadari atau seharusnya menyadari atas kejadian atau terjadinya Peristiwa Kompensasi.",
            "fullText": "65.5 Penyedia tidak berhak atas ganti rugi dan/atau perpanjangan Masa Pelaksanaan jika Penyedia gagal atau lalai untuk memberikan peringatan dini dalam mengantisipasi atau mengatasi dampak Peristiwa Kompensasi. Peringatan dini tersebut disampaikan kepada Pengawas Pekerjaan dengan tembusan kepada Pejabat Penandatangan Kontrak paling lambat 14 (empat belas) hari kalender sejak menyadari atau seharusnya menyadari atas kejadian atau terjadinya Peristiwa Kompensasi."
          },
          {
            "prefix": "65.6",
            "text": "Batas waktu pengajuan ganti rugi dan/atau permintaan perpanjangan Masa Pelaksanaan disertai dengan data penunjang dan perhitungan kompensasi kepada Pejabat Penandatangan Kontrak paling lambat 28 (dua puluh delapan) hari kalender sejak Penyedia menyadari atau seharusnya menyadari atas kejadian atau terjadinya Peristiwa Kompensasi tersebut.",
            "fullText": "65.6 Batas waktu pengajuan ganti rugi dan/atau permintaan perpanjangan Masa Pelaksanaan disertai dengan data penunjang dan perhitungan kompensasi kepada Pejabat Penandatangan Kontrak paling lambat 28 (dua puluh delapan) hari kalender sejak Penyedia menyadari atau seharusnya menyadari atas kejadian atau terjadinya Peristiwa Kompensasi tersebut."
          },
          {
            "prefix": "65.7",
            "text": "Pejabat Penandatangan Kontrak meminta Pengawas Pekerjaan untuk melakukan penelitian terhadap penyampaian pengajuan ganti rugi dan/atau permintaan perpanjangan Masa Pelaksanaan disertai dengan data penunjang dan perhitungan kompensasi.",
            "fullText": "65.7 Pejabat Penandatangan Kontrak meminta Pengawas Pekerjaan untuk melakukan penelitian terhadap penyampaian pengajuan ganti rugi dan/atau permintaan perpanjangan Masa Pelaksanaan disertai dengan data penunjang dan perhitungan kompensasi."
          },
          {
            "prefix": "65.8",
            "text": "Dalam hal Peristiwa Kompensasi terbukti, maka ditindaklanjuti dengan:",
            "fullText": "65.8 Dalam hal Peristiwa Kompensasi terbukti, maka ditindaklanjuti dengan:"
          },
          {
            "prefix": "a.",
            "text": "Perpanjangan Masa Pelaksanaan sesuai dengan Pasal 38; dan/atau",
            "fullText": "a. Perpanjangan Masa Pelaksanaan sesuai dengan Pasal 38; dan/atau"
          },
          {
            "prefix": "b.",
            "text": "Pembayaran ganti rugi (jika ada) yang berhak diterima Penyedia menurut Kontrak sesuai Pasal 69.4.",
            "fullText": "b. Pembayaran ganti rugi (jika ada) yang berhak diterima Penyedia menurut Kontrak sesuai Pasal 69.4."
          }
        ]
      }
    ]
  },
  {
    "id": "ssuk-sec-e",
    "huruf": "E",
    "judul": "TENAGA KERJA KONSTRUKSI DAN/ATAU PERALATAN PENYEDIA",
    "nomorDanJudul": "E. TENAGA KERJA KONSTRUKSI DAN/ATAU PERALATAN PENYEDIA",
    "clauses": [
      {
        "id": "ssuk-66",
        "pasal": 66,
        "judul": "Tenaga Kerja Konstruksi",
        "nomorDanJudul": "66. Tenaga Kerja Konstruksi",
        "paragraphs": [
          {
            "prefix": "66.1",
            "text": "Setiap Tenaga Kerja Konstruksi yang bekerja pada pekerjaan ini wajib memiliki sertifikat kompetensi kerja.",
            "fullText": "66.1 Setiap Tenaga Kerja Konstruksi yang bekerja pada pekerjaan ini wajib memiliki sertifikat kompetensi kerja."
          },
          {
            "prefix": "66.2",
            "text": "Tenaga Kerja Konstruksi selain Personel Manajerial yang bekerja/akan bekerja pada pekerjaan ini dan belum memiliki sertifikat kompetensi kerja, maka Penyedia wajib memastikan dipenuhinya persyaratan sertifikat kompetensi kerja sepanjang Masa Pelaksanaan.",
            "fullText": "66.2 Tenaga Kerja Konstruksi selain Personel Manajerial yang bekerja/akan bekerja pada pekerjaan ini dan belum memiliki sertifikat kompetensi kerja, maka Penyedia wajib memastikan dipenuhinya persyaratan sertifikat kompetensi kerja sepanjang Masa Pelaksanaan."
          }
        ]
      },
      {
        "id": "ssuk-67",
        "pasal": 67,
        "judul": "Personel Manajerial dan/atau Peralatan Utama",
        "nomorDanJudul": "67. Personel Manajerial dan/atau Peralatan Utama",
        "paragraphs": [
          {
            "prefix": "67.1",
            "text": "Personel Manajerial yang ditempatkan dan dipekerjakan harus sesuai dengan yang tercantum dalam Lampiran A SSKK.",
            "fullText": "67.1 Personel Manajerial yang ditempatkan dan dipekerjakan harus sesuai dengan yang tercantum dalam Lampiran A SSKK."
          },
          {
            "prefix": "67.2",
            "text": "Peralatan Utama yang ditempatkan dan digunakan untuk pelaksanaan pekerjaan adalah peralatan yang laik dan harus sesuai dengan yang tercantum dalam Lampiran A SSKK.",
            "fullText": "67.2 Peralatan Utama yang ditempatkan dan digunakan untuk pelaksanaan pekerjaan adalah peralatan yang laik dan harus sesuai dengan yang tercantum dalam Lampiran A SSKK."
          },
          {
            "prefix": "67.3",
            "text": "Personel Manajerial berkewajiban untuk menjaga kerahasiaan pekerjaannya. Jika diperlukan oleh Pejabat Penandatangan Kontrak, Personel Manajerial dapat sewaktu-waktu disyaratkan untuk menjaga kerahasiaan pekerjaan di bawah sumpah.",
            "fullText": "67.3 Personel Manajerial berkewajiban untuk menjaga kerahasiaan pekerjaannya. Jika diperlukan oleh Pejabat Penandatangan Kontrak, Personel Manajerial dapat sewaktu-waktu disyaratkan untuk menjaga kerahasiaan pekerjaan di bawah sumpah."
          }
        ]
      }
    ]
  },
  {
    "id": "ssuk-sec-f",
    "huruf": "F",
    "judul": "PEMBAYARAN KEPADA PENYEDIA",
    "nomorDanJudul": "F. PEMBAYARAN KEPADA PENYEDIA",
    "clauses": [
      {
        "id": "ssuk-68",
        "pasal": 68,
        "judul": "Harga Kontrak",
        "nomorDanJudul": "68. Harga Kontrak",
        "paragraphs": [
          {
            "prefix": "68.1",
            "text": "Pejabat Penandatangan Kontrak membayar kepada Penyedia atas pelaksanaan pekerjaan dalam Kontrak sebesar Harga Kontrak.",
            "fullText": "68.1 Pejabat Penandatangan Kontrak membayar kepada Penyedia atas pelaksanaan pekerjaan dalam Kontrak sebesar Harga Kontrak."
          },
          {
            "prefix": "68.2",
            "text": "Harga Kontrak telah memperhitungkan meliputi:",
            "fullText": "68.2 Harga Kontrak telah memperhitungkan meliputi:"
          },
          {
            "prefix": "a.",
            "text": "beban pajak;",
            "fullText": "a. beban pajak;"
          },
          {
            "prefix": "b.",
            "text": "keuntungan dan biaya overhead (biaya umum);",
            "fullText": "b. keuntungan dan biaya overhead (biaya umum);"
          },
          {
            "prefix": "c.",
            "text": "biaya pelaksanaan pekerjaan; dan",
            "fullText": "c. biaya pelaksanaan pekerjaan; dan"
          },
          {
            "prefix": "d.",
            "text": "biaya penerapan SMKK.",
            "fullText": "d. biaya penerapan SMKK."
          },
          {
            "prefix": "68.3",
            "text": "Rincian Harga Kontrak sesuai dengan rincian yang tercantum dalam Daftar Kuantitas dan Harga.",
            "fullText": "68.3 Rincian Harga Kontrak sesuai dengan rincian yang tercantum dalam Daftar Kuantitas dan Harga."
          },
          {
            "prefix": "68.4",
            "text": "Besaran Harga Kontrak sesuai dengan penawaran yang sebagaimana yang telah diubah terakhir kali sesuai dengan ketentuan dalam Kontrak.",
            "fullText": "68.4 Besaran Harga Kontrak sesuai dengan penawaran yang sebagaimana yang telah diubah terakhir kali sesuai dengan ketentuan dalam Kontrak."
          }
        ]
      },
      {
        "id": "ssuk-69",
        "pasal": 69,
        "judul": "Pembayaran",
        "nomorDanJudul": "69. Pembayaran",
        "paragraphs": [
          {
            "prefix": "69.1",
            "text": "Uang Muka",
            "fullText": "69.1 Uang Muka"
          },
          {
            "prefix": "a.",
            "text": "Uang muka dibayar untuk membiayai mobilisasi peralatan/tenaga kerja konstruksi, pembayaran uang tanda jadi kepada pemasok bahan/material dan/atau untuk persiapan teknis lain.",
            "fullText": "a. Uang muka dibayar untuk membiayai mobilisasi peralatan/tenaga kerja konstruksi, pembayaran uang tanda jadi kepada pemasok bahan/material dan/atau untuk persiapan teknis lain."
          },
          {
            "prefix": "b.",
            "text": "Untuk usaha kecil, uang muka dapat diberikan paling tinggi 30% (tiga puluh perseratus) dari Harga Kontrak.",
            "fullText": "b. Untuk usaha kecil, uang muka dapat diberikan paling tinggi 30% (tiga puluh perseratus) dari Harga Kontrak."
          },
          {
            "prefix": "c.",
            "text": "Untuk usaha non kecil, uang muka dapat diberikan paling tinggi 20% (dua puluh persen) dari Harga Kontrak.",
            "fullText": "c. Untuk usaha non kecil, uang muka dapat diberikan paling tinggi 20% (dua puluh persen) dari Harga Kontrak."
          },
          {
            "prefix": "d.",
            "text": "Untuk Kontrak Tahun Jamak, uang muka dapat diberikan paling tinggi 15% (lima belas persen) dari Harga Kontrak.",
            "fullText": "d. Untuk Kontrak Tahun Jamak, uang muka dapat diberikan paling tinggi 15% (lima belas persen) dari Harga Kontrak."
          },
          {
            "prefix": "e.",
            "text": "Besaran uang muka ditentukan dalam SSKK dan dibayar setelah Penyedia menyerahkan Jaminan Uang Muka paling sedikit sebesar uang muka yang diterima.",
            "fullText": "e. Besaran uang muka ditentukan dalam SSKK dan dibayar setelah Penyedia menyerahkan Jaminan Uang Muka paling sedikit sebesar uang muka yang diterima."
          },
          {
            "prefix": "f.",
            "text": "Dalam hal diberikan uang muka, maka Penyedia harus mengajukan permohonan pengambilan uang muka secara tertulis kepada Pejabat Penandatangan Kontrak disertai dengan rencana penggunaan uang muka untuk melaksanakan pekerjaan sesuai Kontrak dan rencana pengembaliannya.",
            "fullText": "f. Dalam hal diberikan uang muka, maka Penyedia harus mengajukan permohonan pengambilan uang muka secara tertulis kepada Pejabat Penandatangan Kontrak disertai dengan rencana penggunaan uang muka untuk melaksanakan pekerjaan sesuai Kontrak dan rencana pengembaliannya."
          },
          {
            "prefix": "g.",
            "text": "Pejabat Penandatangan Kontrak harus mengajukan Surat Permintaan Pembayaran (SPP) kepada Pejabat Penandatangananan Surat Perintah Membayar (PPSPM) untuk permohonan tersebut pada huruf f, paling lambat 7 (tujuh) hari kerja setelah Jaminan Uang Muka diterima.",
            "fullText": "g. Pejabat Penandatangan Kontrak harus mengajukan Surat Permintaan Pembayaran (SPP) kepada Pejabat Penandatangananan Surat Perintah Membayar (PPSPM) untuk permohonan tersebut pada huruf f, paling lambat 7 (tujuh) hari kerja setelah Jaminan Uang Muka diterima."
          },
          {
            "prefix": "h.",
            "text": "Pengembalian uang muka harus diperhitungkan berangsur-angsur secara proporsional pada setiap pembayaran prestasi pekerjaan dan paling lambat harus lunas pada saat pekerjaan mencapai prestasi 100% (seratus persen).",
            "fullText": "h. Pengembalian uang muka harus diperhitungkan berangsur-angsur secara proporsional pada setiap pembayaran prestasi pekerjaan dan paling lambat harus lunas pada saat pekerjaan mencapai prestasi 100% (seratus persen)."
          },
          {
            "prefix": "69.2",
            "text": "Prestasi pekerjaan",
            "fullText": "69.2 Prestasi pekerjaan"
          },
          {
            "text": "Pembayaran prestasi hasil pekerjaan yang disepakati dilakukan oleh Pejabat Penandatangan Kontrak, dengan ketentuan:",
            "fullText": "Pembayaran prestasi hasil pekerjaan yang disepakati dilakukan oleh Pejabat Penandatangan Kontrak, dengan ketentuan:"
          },
          {
            "prefix": "a.",
            "text": "Penyedia telah mengajukan tagihan disertai laporan kemajuan hasil pekerjaan;",
            "fullText": "a. Penyedia telah mengajukan tagihan disertai laporan kemajuan hasil pekerjaan;"
          },
          {
            "prefix": "b.",
            "text": "pembayaran dilakukan tidak boleh melebihi kemajuan hasil pekerjaan yang telah dicapai dan diterima oleh Pejabat Penandatangan Kontrak;",
            "fullText": "b. pembayaran dilakukan tidak boleh melebihi kemajuan hasil pekerjaan yang telah dicapai dan diterima oleh Pejabat Penandatangan Kontrak;"
          },
          {
            "prefix": "c.",
            "text": "pembayaran dilakukan terhadap pekerjaan yang sudah terpasang;",
            "fullText": "c. pembayaran dilakukan terhadap pekerjaan yang sudah terpasang;"
          },
          {
            "prefix": "d.",
            "text": "pembayaran dilakukan dengan sistem bulanan atau sistem termin sesuai ketentuan dalam SSKK;",
            "fullText": "d. pembayaran dilakukan dengan sistem bulanan atau sistem termin sesuai ketentuan dalam SSKK;"
          },
          {
            "prefix": "e.",
            "text": "pembayaran harus memperhitungkan:",
            "fullText": "e. pembayaran harus memperhitungkan:"
          },
          {
            "prefix": "1)",
            "text": "angsuran uang muka;",
            "fullText": "1) angsuran uang muka;"
          },
          {
            "prefix": "2)",
            "text": "peralatan dan/atau bahan yang menjadi bagian permanen dari hasil pekerjaan  yang akan diserahterimakan (material on site) yang sudah dibayar sebelumnya;",
            "fullText": "2) peralatan dan/atau bahan yang menjadi bagian permanen dari hasil pekerjaan  yang akan diserahterimakan (material on site) yang sudah dibayar sebelumnya;"
          },
          {
            "prefix": "3)",
            "text": "denda (apabila ada);",
            "fullText": "3) denda (apabila ada);"
          },
          {
            "prefix": "4)",
            "text": "pajak; dan/atau",
            "fullText": "4) pajak; dan/atau"
          },
          {
            "prefix": "5)",
            "text": "uang retensi.",
            "fullText": "5) uang retensi."
          },
          {
            "prefix": "f.",
            "text": "untuk Kontrak yang mempunyai subkontrak, permintaan pembayaran harus dilengkapi bukti pembayaran kepada seluruh Subkontraktor sesuai dengan prestasi pekerjaan. Pembayaran kepada Subkontraktor dilakukan sesuai prestasi pekerjaan yang selesai dilaksanakan oleh Subkontraktor tanpa harus menunggu pembayaran terlebih dahulu dari Pejabat Penandatangan Kontrak;",
            "fullText": "f. untuk Kontrak yang mempunyai subkontrak, permintaan pembayaran harus dilengkapi bukti pembayaran kepada seluruh Subkontraktor sesuai dengan prestasi pekerjaan. Pembayaran kepada Subkontraktor dilakukan sesuai prestasi pekerjaan yang selesai dilaksanakan oleh Subkontraktor tanpa harus menunggu pembayaran terlebih dahulu dari Pejabat Penandatangan Kontrak;"
          },
          {
            "prefix": "h.",
            "text": "pembayaran terakhir hanya dilakukan setelah pekerjaan selesai 100% (seratus persen) dan Berita Acara Serah Terima Pertama Pekerjaan ditandatangani oleh Pejabat Penandatangan Kontrak dan Penyedia;",
            "fullText": "g. pembayaran terakhir hanya dilakukan setelah pekerjaan selesai 100% (seratus persen) dan Berita Acara Serah Terima Pertama Pekerjaan ditandatangani oleh Pejabat Penandatangan Kontrak dan Penyedia;"
          },
          {
            "prefix": "i.",
            "text": "Pejabat Penandatangan Kontrak dalam kurun waktu 7 (tujuh) hari kerja setelah pengajuan permintaan pembayaran dari Penyedia diterima harus sudah mengajukan Surat Permintaan Pembayaran kepada Pejabat Penandatanganan Surat Perintah Membayar (PPSPM);",
            "fullText": "h. Pejabat Penandatangan Kontrak dalam kurun waktu 7 (tujuh) hari kerja setelah pengajuan permintaan pembayaran dari Penyedia diterima harus sudah mengajukan Surat Permintaan Pembayaran kepada Pejabat Penandatanganan Surat Perintah Membayar (PPSPM);"
          },
          {
            "prefix": "a.",
            "text": "apabila terdapat ketidaksesuaian dalam perhitungan angsuran, tidak akan menjadi alasan untuk menunda pembayaran. Pejabat Penandatangan Kontrak dapat meminta Penyedia untuk menyampaikan perhitungan prestasi sementara dengan mengesampingkan hal-hal yang sedang menjadi perselisihan.",
            "fullText": "i. apabila terdapat ketidaksesuaian dalam perhitungan angsuran, tidak akan menjadi alasan untuk menunda pembayaran. Pejabat Penandatangan Kontrak dapat meminta Penyedia untuk menyampaikan perhitungan prestasi sementara dengan mengesampingkan hal-hal yang sedang menjadi perselisihan."
          },
          {
            "prefix": "69.3",
            "text": "Material on Site",
            "fullText": "69.3 Material on Site"
          },
          {
            "text": "Bahan dan/atau peralatan yang menjadi bagian dari hasil pekerjaan memenuhi ketentuan:",
            "fullText": "Bahan dan/atau peralatan yang menjadi bagian dari hasil pekerjaan memenuhi ketentuan:"
          },
          {
            "prefix": "b.",
            "text": "bahan dan/atau peralatan yang menjadi bagian permanen dari hasil pekerjaan",
            "fullText": "a. bahan dan/atau peralatan yang menjadi bagian permanen dari hasil pekerjaan"
          },
          {
            "prefix": "c.",
            "text": "bahan dan/atau peralatan yang belum dilakukan uji fungsi (commisioning), serta merupakan bagian dari pekerjaan utama harus memenuhi ketentuan sebagai berikut:",
            "fullText": "b. bahan dan/atau peralatan yang belum dilakukan uji fungsi (commisioning), serta merupakan bagian dari pekerjaan utama harus memenuhi ketentuan sebagai berikut:"
          },
          {
            "prefix": "1)",
            "text": "berada di lokasi pekerjaan sebagaimana tercantum dalam Kontrak dan perubahannya;",
            "fullText": "1) berada di lokasi pekerjaan sebagaimana tercantum dalam Kontrak dan perubahannya;"
          },
          {
            "prefix": "2)",
            "text": "memiliki sertifikat uji mutu dari pabrikan/produsen;",
            "fullText": "2) memiliki sertifikat uji mutu dari pabrikan/produsen;"
          },
          {
            "prefix": "3)",
            "text": "bersertifikat garansi dari produsen/agen resmi yang ditunjuk oleh produsen;",
            "fullText": "3) bersertifikat garansi dari produsen/agen resmi yang ditunjuk oleh produsen;"
          },
          {
            "prefix": "4)",
            "text": "disetujui oleh Pejabat Penandatangan Kontrak sesuai dengan capaian fisik yang diterima;",
            "fullText": "4) disetujui oleh Pejabat Penandatangan Kontrak sesuai dengan capaian fisik yang diterima;"
          },
          {
            "prefix": "5)",
            "text": "dilarang dipindahkan dari area lokasi pekerjaan dan/atau dipindah-tangankan oleh pihak manapun; dan",
            "fullText": "5) dilarang dipindahkan dari area lokasi pekerjaan dan/atau dipindah-tangankan oleh pihak manapun; dan"
          },
          {
            "prefix": "6)",
            "text": "keamanan penyimpanan dan risiko kerusakan sebelum diserahterimakan secara satu kesatuan fungsi merupakan tanggung jawab Penyedia.",
            "fullText": "6) keamanan penyimpanan dan risiko kerusakan sebelum diserahterimakan secara satu kesatuan fungsi merupakan tanggung jawab Penyedia."
          },
          {
            "prefix": "d.",
            "text": "sertifikat uji mutu dan sertifikat garansi tidak diperlukan dalam hal peralatan dan/atau bahan dibuat/dirakit oleh Penyedia;",
            "fullText": "c. sertifikat uji mutu dan sertifikat garansi tidak diperlukan dalam hal peralatan dan/atau bahan dibuat/dirakit oleh Penyedia;"
          },
          {
            "prefix": "e.",
            "text": "besaran yang akan dibayarkan dari material on site (maksimal sampai dengan 70%) dari Harga Satuan Pekerjaan (HSP);",
            "fullText": "d. besaran yang akan dibayarkan dari material on site (maksimal sampai dengan 70%) dari Harga Satuan Pekerjaan (HSP);"
          },
          {
            "prefix": "a.",
            "text": "besaran nilai pembayaran dan jenis material on site dicantumkan di dalam SSKK.",
            "fullText": "e. besaran nilai pembayaran dan jenis material on site dicantumkan di dalam SSKK."
          },
          {
            "prefix": "69.4",
            "text": "Denda dan Ganti Rugi",
            "fullText": "69.4 Denda dan Ganti Rugi"
          },
          {
            "prefix": "b.",
            "text": "Denda merupakan sanksi finansial yang dikenakan kepada Penyedia, antara lain: denda keterlambatan dalam penyelesaian pelaksanaan pekerjaan, denda keterlambatan dalam perbaikan Cacat Mutu, denda terkait pelanggaran ketentuan subkontrak.",
            "fullText": "a. Denda merupakan sanksi finansial yang dikenakan kepada Penyedia, antara lain: denda keterlambatan dalam penyelesaian pelaksanaan pekerjaan, denda keterlambatan dalam perbaikan Cacat Mutu, denda terkait pelanggaran ketentuan subkontrak."
          },
          {
            "prefix": "c.",
            "text": "Ganti rugi merupakan sanksi finansial yang dikenakan kepada Pejabat Penandatangan Kontrak maupun Penyedia karena terjadinya cedera janji/wanprestasi. Besarnya sanksi ganti rugi adalah sebesar nilai kerugian yang ditimbulkan.",
            "fullText": "b. Ganti rugi merupakan sanksi finansial yang dikenakan kepada Pejabat Penandatangan Kontrak maupun Penyedia karena terjadinya cedera janji/wanprestasi. Besarnya sanksi ganti rugi adalah sebesar nilai kerugian yang ditimbulkan."
          },
          {
            "prefix": "d.",
            "text": "Besarnya denda keterlambatan yang dikenakan kepada Penyedia atas keterlambatan penyelesaian pekerjaan adalah:",
            "fullText": "c. Besarnya denda keterlambatan yang dikenakan kepada Penyedia atas keterlambatan penyelesaian pekerjaan adalah:"
          },
          {
            "prefix": "1)",
            "text": "1‰ (satu perseribu) dari harga bagian Kontrak yang tercantum dalam Kontrak (sebelum PPN); atau",
            "fullText": "1) 1‰ (satu perseribu) dari harga bagian Kontrak yang tercantum dalam Kontrak (sebelum PPN); atau"
          },
          {
            "prefix": "2)",
            "text": "1‰ (satu perseribu) dari Harga Kontrak (sebelum PPN);",
            "fullText": "2) 1‰ (satu perseribu) dari Harga Kontrak (sebelum PPN);"
          },
          {
            "text": "sesuai yang ditetapkan dalam SSKK.",
            "fullText": "sesuai yang ditetapkan dalam SSKK."
          },
          {
            "prefix": "e.",
            "text": "Besaran denda cacat mutu sebesar 1‰ (satu perseribu) per hari keterlambatan perbaikan dari nilai biaya perbaikan pekerjaan yang ditemukan cacat mutu.",
            "fullText": "d. Besaran denda cacat mutu sebesar 1‰ (satu perseribu) per hari keterlambatan perbaikan dari nilai biaya perbaikan pekerjaan yang ditemukan cacat mutu."
          },
          {
            "prefix": "f.",
            "text": "Besaran denda pelanggaran subkontrak sebesar nilai pekerjaan subkontrak yang disubkontrakkan tidak sesuai ketentuan.",
            "fullText": "e. Besaran denda pelanggaran subkontrak sebesar nilai pekerjaan subkontrak yang disubkontrakkan tidak sesuai ketentuan."
          },
          {
            "prefix": "g.",
            "text": "Besarnya ganti rugi sebagai akibat Peristiwa Kompensasi yang dibayar oleh Pejabat Penandatangan Kontrak atas keterlambatan pembayaran adalah sebesar bunga dari nilai tagihan yang terlambat dibayar, berdasarkan tingkat suku bunga yang berlaku pada saat itu menurut ketetapan Bank Indonesia, sepanjang telah diputuskan oleh lembaga yang berwenang;",
            "fullText": "f. Besarnya ganti rugi sebagai akibat Peristiwa Kompensasi yang dibayar oleh Pejabat Penandatangan Kontrak atas keterlambatan pembayaran adalah sebesar bunga dari nilai tagihan yang terlambat dibayar, berdasarkan tingkat suku bunga yang berlaku pada saat itu menurut ketetapan Bank Indonesia, sepanjang telah diputuskan oleh lembaga yang berwenang;"
          },
          {
            "prefix": "h.",
            "text": "Pembayaran denda dan/atau ganti rugi diperhitungkan dalam pembayaran prestasi pekerjaan.",
            "fullText": "g. Pembayaran denda dan/atau ganti rugi diperhitungkan dalam pembayaran prestasi pekerjaan."
          },
          {
            "prefix": "i.",
            "text": "Ganti rugi kepada Penyedia dapat mengubah Harga Kontrak setelah dituangkan dalam adendum kontrak.",
            "fullText": "h. Ganti rugi kepada Penyedia dapat mengubah Harga Kontrak setelah dituangkan dalam adendum kontrak."
          },
          {
            "prefix": "i.",
            "text": "Pembayaran ganti rugi dilakukan oleh Pejabat Penandatangan Kontrak, apabila Penyedia telah mengajukan tagihan disertai perhitungan dan data-data.",
            "fullText": "i. Pembayaran ganti rugi dilakukan oleh Pejabat Penandatangan Kontrak, apabila Penyedia telah mengajukan tagihan disertai perhitungan dan data-data."
          }
        ]
      },
      {
        "id": "ssuk-70",
        "pasal": 70,
        "judul": "Hari Kerja",
        "nomorDanJudul": "70. Hari Kerja",
        "paragraphs": [
          {
            "prefix": "70.1",
            "text": "Orang hari standar atau satu hari orang bekerja adalah 8 (delapan) jam, terdiri atas 7 (tujuh) jam kerja (efektif) dan 1 (satu) jam istirahat.",
            "fullText": "70.1 Orang hari standar atau satu hari orang bekerja adalah 8 (delapan) jam, terdiri atas 7 (tujuh) jam kerja (efektif) dan 1 (satu) jam istirahat."
          },
          {
            "prefix": "70.2",
            "text": "Penyedia tidak diperkenankan melakukan pekerjaan apapun di lokasi kerja pada waktu yang secara ketentuan peraturan perundang-undangan dinyatakan sebagai hari libur atau di luar jam kerja normal, kecuali:",
            "fullText": "70.2 Penyedia tidak diperkenankan melakukan pekerjaan apapun di lokasi kerja pada waktu yang secara ketentuan peraturan perundang-undangan dinyatakan sebagai hari libur atau di luar jam kerja normal, kecuali:"
          },
          {
            "prefix": "a.",
            "text": "dinyatakan lain di dalam Kontrak;",
            "fullText": "a. dinyatakan lain di dalam Kontrak;"
          },
          {
            "prefix": "b.",
            "text": "Pejabat Penandatangan Kontrak memberikan izin; atau",
            "fullText": "b. Pejabat Penandatangan Kontrak memberikan izin; atau"
          },
          {
            "prefix": "c.",
            "text": "pekerjaan tidak dapat ditunda, atau untuk keselamatan/perlindungan masyarakat, dimana Penyedia harus segera memberitahukan urgensi pekerjaan tersebut kepada Pengawas Pekerjaan dan Pejabat Penandatangan Kontrak.",
            "fullText": "c. pekerjaan tidak dapat ditunda, atau untuk keselamatan/perlindungan masyarakat, dimana Penyedia harus segera memberitahukan urgensi pekerjaan tersebut kepada Pengawas Pekerjaan dan Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "70.3",
            "text": "Semua pekerja dibayar selama hari kerja dan datanya disimpan oleh Penyedia. Daftar pembayaran masing-masing pekerja dapat diperiksa oleh Pejabat Penandatangan Kontrak.",
            "fullText": "70.3 Semua pekerja dibayar selama hari kerja dan datanya disimpan oleh Penyedia. Daftar pembayaran masing-masing pekerja dapat diperiksa oleh Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "70.4",
            "text": "Untuk pekerjaan yang dilakukan di luar hari kerja efektif dan jam kerja normal harus mengikuti ketentuan Menteri yang membidangi ketenagakerjaan.",
            "fullText": "70.4 Untuk pekerjaan yang dilakukan di luar hari kerja efektif dan jam kerja normal harus mengikuti ketentuan Menteri yang membidangi ketenagakerjaan."
          },
          {
            "prefix": "70.5",
            "text": "Pelaksanaan pekerjaan di luar hari kerja efektif dan/atau jam kerja normal harus diawasi oleh Pengawas Pekerjaan.",
            "fullText": "70.5 Pelaksanaan pekerjaan di luar hari kerja efektif dan/atau jam kerja normal harus diawasi oleh Pengawas Pekerjaan."
          }
        ]
      },
      {
        "id": "ssuk-71",
        "pasal": 71,
        "judul": "Perhitungan Akhir",
        "nomorDanJudul": "71. Perhitungan Akhir",
        "paragraphs": [
          {
            "prefix": "71.1",
            "text": "Pembayaran angsuran prestasi pekerjaan terakhir dilakukan setelah pekerjaan selesai 100% (seratus persen) dan berita acara serah terima pertama pekerjaan telah ditandatangani oleh kedua pihak.",
            "fullText": "71.1 Pembayaran angsuran prestasi pekerjaan terakhir dilakukan setelah pekerjaan selesai 100% (seratus persen) dan berita acara serah terima pertama pekerjaan telah ditandatangani oleh kedua pihak."
          },
          {
            "prefix": "71.2",
            "text": "Sebelum pembayaran terakhir dilakukan, Penyedia berkewajiban untuk menyerahkan kepada Pengawas Pekerjaan rincian perhitungan nilai tagihan terakhir yang jatuh tempo. Pejabat Penandatangan Kontrak berdasarkan hasil  penelitian tagihan oleh Pengawas Pekerjaan berkewajiban untuk menerbitkan SPP untuk pembayaran tagihan angsuran terakhir paling lambat 7 (tujuh) hari kerja terhitung sejak tagihan dan dokumen penunjang dinyatakan lengkap dan diterima oleh Pengawas Pekerjaan.",
            "fullText": "71.2 Sebelum pembayaran terakhir dilakukan, Penyedia berkewajiban untuk menyerahkan kepada Pengawas Pekerjaan rincian perhitungan nilai tagihan terakhir yang jatuh tempo. Pejabat Penandatangan Kontrak berdasarkan hasil  penelitian tagihan oleh Pengawas Pekerjaan berkewajiban untuk menerbitkan SPP untuk pembayaran tagihan angsuran terakhir paling lambat 7 (tujuh) hari kerja terhitung sejak tagihan dan dokumen penunjang dinyatakan lengkap dan diterima oleh Pengawas Pekerjaan."
          }
        ]
      },
      {
        "id": "ssuk-72",
        "pasal": 72,
        "judul": "Penangguhan",
        "nomorDanJudul": "72. Penangguhan",
        "paragraphs": [
          {
            "prefix": "72.1",
            "text": "Pejabat Penandatangan Kontrak dapat menangguhkan pembayaran setiap angsuran prestasi pekerjaan Penyedia jika Penyedia gagal atau lalai memenuhi kewajiban kontraktualnya, termasuk penyerahan setiap Hasil Pekerjaan sesuai dengan waktu yang telah ditetapkan.",
            "fullText": "72.1 Pejabat Penandatangan Kontrak dapat menangguhkan pembayaran setiap angsuran prestasi pekerjaan Penyedia jika Penyedia gagal atau lalai memenuhi kewajiban kontraktualnya, termasuk penyerahan setiap Hasil Pekerjaan sesuai dengan waktu yang telah ditetapkan."
          },
          {
            "prefix": "72.2",
            "text": "Pejabat Penandatangan Kontrak secara tertulis memberitahukan kepada Penyedia tentang penangguhan hak pembayaran, disertai alasan-alasan yang jelas mengenai penangguhan tersebut. Penyedia diberi kesempatan untuk memperbaiki dalam jangka waktu tertentu.",
            "fullText": "72.2 Pejabat Penandatangan Kontrak secara tertulis memberitahukan kepada Penyedia tentang penangguhan hak pembayaran, disertai alasan-alasan yang jelas mengenai penangguhan tersebut. Penyedia diberi kesempatan untuk memperbaiki dalam jangka waktu tertentu."
          },
          {
            "prefix": "72.3",
            "text": "Pembayaran yang ditangguhkan harus disesuaikan dengan proporsi kegagalan atau kelalaian Penyedia.",
            "fullText": "72.3 Pembayaran yang ditangguhkan harus disesuaikan dengan proporsi kegagalan atau kelalaian Penyedia."
          },
          {
            "prefix": "72.4",
            "text": "Jika dipandang perlu oleh Pejabat Penandatangan Kontrak, penangguhan pembayaran akibat keterlambatan penyerahan pekerjaan dapat dilakukan bersamaan dengan pengenaan denda kepada Penyedia.",
            "fullText": "72.4 Jika dipandang perlu oleh Pejabat Penandatangan Kontrak, penangguhan pembayaran akibat keterlambatan penyerahan pekerjaan dapat dilakukan bersamaan dengan pengenaan denda kepada Penyedia."
          }
        ]
      }
    ]
  },
  {
    "id": "ssuk-sec-g",
    "huruf": "G",
    "judul": "PENGAWASAN MUTU",
    "nomorDanJudul": "G. PENGAWASAN MUTU",
    "clauses": [
      {
        "id": "ssuk-73",
        "pasal": 73,
        "judul": "Pengawasan dan Pemeriksaan",
        "nomorDanJudul": "73. Pengawasan dan Pemeriksaan",
        "paragraphs": [
          {
            "text": "Pejabat Penandatangan Kontrak berwenang melakukan pengawasan dan pemeriksaan terhadap pelaksanaan pekerjaan yang dilaksanakan oleh Penyedia. Pejabat Penandatangan Kontrak dapat memerintahkan kepada pihak ketiga untuk melakukan pengawasan dan pemeriksaan atas semua pelaksanaan pekerjaan yang dilaksanakan oleh Penyedia.",
            "fullText": "Pejabat Penandatangan Kontrak berwenang melakukan pengawasan dan pemeriksaan terhadap pelaksanaan pekerjaan yang dilaksanakan oleh Penyedia. Pejabat Penandatangan Kontrak dapat memerintahkan kepada pihak ketiga untuk melakukan pengawasan dan pemeriksaan atas semua pelaksanaan pekerjaan yang dilaksanakan oleh Penyedia."
          }
        ]
      },
      {
        "id": "ssuk-74",
        "pasal": 74,
        "judul": "Penilaian Pekerjaan Sementara oleh Pejabat Penandatangan Kontrak",
        "nomorDanJudul": "74. Penilaian Pekerjaan Sementara oleh Pejabat Penandatangan Kontrak",
        "paragraphs": [
          {
            "prefix": "74.1",
            "text": "Pejabat Penandatangan Kontrak dalam Masa Pelaksanaan pekerjaan dapat melakukan penilaian sementara atas hasil pekerjaan yang dilakukan oleh Penyedia.",
            "fullText": "74.1 Pejabat Penandatangan Kontrak dalam Masa Pelaksanaan pekerjaan dapat melakukan penilaian sementara atas hasil pekerjaan yang dilakukan oleh Penyedia."
          },
          {
            "prefix": "74.2",
            "text": "Penilaian atas hasil pekerjaan dilakukan terhadap mutu dan kemajuan fisik pekerjaan.",
            "fullText": "74.2 Penilaian atas hasil pekerjaan dilakukan terhadap mutu dan kemajuan fisik pekerjaan."
          }
        ]
      },
      {
        "id": "ssuk-75",
        "pasal": 75,
        "judul": "Pemeriksaan dan Pengujian Cacat Mutu",
        "nomorDanJudul": "75. Pemeriksaan dan Pengujian Cacat Mutu",
        "paragraphs": [
          {
            "prefix": "75.1",
            "text": "Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan akan memeriksa setiap hasil pekerjaan dan memberitahukan Penyedia secara tertulis atas setiap Cacat Mutu yang ditemukan. Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan dapat memerintahkan Penyedia untuk menemukan dan mengungkapkan Cacat Mutu , serta menguji hasil pekerjaan yang dianggap oleh Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan mengandung Cacat Mutu. Penyedia bertanggung jawab atas perbaikan Cacat Mutu selama Masa Kontrak.",
            "fullText": "75.1 Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan akan memeriksa setiap hasil pekerjaan dan memberitahukan Penyedia secara tertulis atas setiap Cacat Mutu yang ditemukan. Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan dapat memerintahkan Penyedia untuk menemukan dan mengungkapkan Cacat Mutu , serta menguji hasil pekerjaan yang dianggap oleh Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan mengandung Cacat Mutu. Penyedia bertanggung jawab atas perbaikan Cacat Mutu selama Masa Kontrak."
          },
          {
            "prefix": "75.2",
            "text": "Jika Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan memerintahkan Penyedia untuk melakukan pengujian Cacat Mutu yang tidak tercantum dalam Spesifikasi Teknis dan Gambar, dan hasil uji coba menunjukkan adanya cacat mutu maka Penyedia berkewajiban untuk menanggung biaya pengujian tersebut. Jika tidak ditemukan adanya Cacat Mutu maka uji coba tersebut dianggap sebagai Peristiwa Kompensasi.",
            "fullText": "75.2 Jika Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan memerintahkan Penyedia untuk melakukan pengujian Cacat Mutu yang tidak tercantum dalam Spesifikasi Teknis dan Gambar, dan hasil uji coba menunjukkan adanya cacat mutu maka Penyedia berkewajiban untuk menanggung biaya pengujian tersebut. Jika tidak ditemukan adanya Cacat Mutu maka uji coba tersebut dianggap sebagai Peristiwa Kompensasi."
          }
        ]
      },
      {
        "id": "ssuk-76",
        "pasal": 76,
        "judul": "Perbaikan Cacat Mutu",
        "nomorDanJudul": "76. Perbaikan Cacat Mutu",
        "paragraphs": [
          {
            "prefix": "76.1",
            "text": "Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan akan menyampaikan pemberitahuan Cacat Mutu kepada Penyedia segera setelah ditemukan Cacat Mutu tersebut. Penyedia bertanggung jawab atas Cacat Mutu selama Masa Kontrak.",
            "fullText": "76.1 Pejabat Penandatangan Kontrak atau Pengawas Pekerjaan akan menyampaikan pemberitahuan Cacat Mutu kepada Penyedia segera setelah ditemukan Cacat Mutu tersebut. Penyedia bertanggung jawab atas Cacat Mutu selama Masa Kontrak."
          },
          {
            "prefix": "76.2",
            "text": "Terhadap pemberitahuan Cacat Mutu tersebut, Penyedia berkewajiban untuk memperbaiki Cacat Mutu dalam jangka waktu yang ditetapkan dalam pemberitahuan.",
            "fullText": "76.2 Terhadap pemberitahuan Cacat Mutu tersebut, Penyedia berkewajiban untuk memperbaiki Cacat Mutu dalam jangka waktu yang ditetapkan dalam pemberitahuan."
          },
          {
            "prefix": "76.3",
            "text": "Jika Penyedia tidak memperbaiki Cacat Mutu dalam jangka waktu yang ditentukan maka Pejabat Penandatangan Kontrak, berdasarkan pertimbangan Pengawas Pekerjaan, berhak untuk secara langsung atau melalui pihak ketiga yang ditunjuk oleh Pejabat Penandatangan Kontrak melakukan perbaikan tersebut. Penyedia segera setelah menerima klaim Pejabat Penandatangan Kontrak  secara tertulis berkewajiban untuk mengganti biaya perbaikan tersebut. Pejabat Penandatangan Kontrak dapat memperoleh penggantian biaya dengan memotong pembayaran atas tagihan Penyedia yang jatuh tempo (jika ada) atau uang retensi atau pencairan Jaminan Pemeliharaan atau jika tidak ada maka biaya penggantian akan diperhitungkan sebagai utang Penyedia kepada Pejabat Penandatangan Kontrak yang telah jatuh tempo.",
            "fullText": "76.3 Jika Penyedia tidak memperbaiki Cacat Mutu dalam jangka waktu yang ditentukan maka Pejabat Penandatangan Kontrak, berdasarkan pertimbangan Pengawas Pekerjaan, berhak untuk secara langsung atau melalui pihak ketiga yang ditunjuk oleh Pejabat Penandatangan Kontrak melakukan perbaikan tersebut. Penyedia segera setelah menerima klaim Pejabat Penandatangan Kontrak  secara tertulis berkewajiban untuk mengganti biaya perbaikan tersebut. Pejabat Penandatangan Kontrak dapat memperoleh penggantian biaya dengan memotong pembayaran atas tagihan Penyedia yang jatuh tempo (jika ada) atau uang retensi atau pencairan Jaminan Pemeliharaan atau jika tidak ada maka biaya penggantian akan diperhitungkan sebagai utang Penyedia kepada Pejabat Penandatangan Kontrak yang telah jatuh tempo."
          },
          {
            "prefix": "76.4",
            "text": "Dalam hal cacat mutu ditemukan oleh Pejabat Penandatangan Kontrak selama masa pelaksanaan maka penyedia wajib memperbaiki cacat mutu tersebut dan Pejabat Penandatangan Kontrak tidak melakukan pembayaran pekerjaan sebelum cacat mutu tersebut selesai diperbaiki.",
            "fullText": "76.4 Dalam hal cacat mutu ditemukan oleh Pejabat Penandatangan Kontrak selama masa pelaksanaan maka penyedia wajib memperbaiki cacat mutu tersebut dan Pejabat Penandatangan Kontrak tidak melakukan pembayaran pekerjaan sebelum cacat mutu tersebut selesai diperbaiki."
          },
          {
            "prefix": "76.5",
            "text": "Dalam hal cacat mutu ditemukan oleh Pejabat Penandatangan Kontrak selama masa pemeliharaan maka penyedia wajib memperbaiki cacat mutu tersebut dalam jangka waktu yang ditentukan dan mengenakan denda keterlambatan untuk setiap keterlambatan perbaikan Cacat Mutu.",
            "fullText": "76.5 Dalam hal cacat mutu ditemukan oleh Pejabat Penandatangan Kontrak selama masa pemeliharaan maka penyedia wajib memperbaiki cacat mutu tersebut dalam jangka waktu yang ditentukan dan mengenakan denda keterlambatan untuk setiap keterlambatan perbaikan Cacat Mutu."
          },
          {
            "prefix": "76.6",
            "text": "Penyedia yang tidak melaksanakan perbaikan cacat mutu sewaktu masa pemeliharaan dapat diputus kontrak dan dikenakan sanksi daftar hitam.",
            "fullText": "76.6 Penyedia yang tidak melaksanakan perbaikan cacat mutu sewaktu masa pemeliharaan dapat diputus kontrak dan dikenakan sanksi daftar hitam."
          },
          {
            "prefix": "76.7",
            "text": "Jangka waktu perbaikan cacat mutu sesuai dengan perkiraan waktu yang diperlukan untuk perbaikan dan ditetapkan oleh Pejabat Penandatangan Kontrak.",
            "fullText": "76.7 Jangka waktu perbaikan cacat mutu sesuai dengan perkiraan waktu yang diperlukan untuk perbaikan dan ditetapkan oleh Pejabat Penandatangan Kontrak."
          },
          {
            "prefix": "76.8",
            "text": "Pejabat Penandatangan Kontrak dapat memperpanjang Masa Pemeliharaan dalam hal jangka waktu perbaikan cacat mutu akan melampaui Masa Pemeliharaan.",
            "fullText": "76.8 Pejabat Penandatangan Kontrak dapat memperpanjang Masa Pemeliharaan dalam hal jangka waktu perbaikan cacat mutu akan melampaui Masa Pemeliharaan."
          }
        ]
      },
      {
        "id": "ssuk-77",
        "pasal": 77,
        "judul": "Kegagalan Bangunan",
        "nomorDanJudul": "77. Kegagalan Bangunan",
        "paragraphs": [
          {
            "prefix": "77.1",
            "text": "Kegagalan Bangunan terhitung sejak Tanggal Penyerahan Akhir Pekerjaan",
            "fullText": "77.1 Kegagalan Bangunan terhitung sejak Tanggal Penyerahan Akhir Pekerjaan"
          },
          {
            "prefix": "77.2",
            "text": "Penyedia bertanggung jawab atas Kegagalan Bangunan selama Umur Konstruksi yang tercantum dalam SSKK tetapi tidak lebih dari 10 (sepuluh) tahun, dan dalam SSKK agar dicantumkan lama pertanggungan terhadap Kegagalan Bangunan yang ditetapkan apabila rencana Umur Konstruksi kurang dari 10 (sepuluh) tahun.",
            "fullText": "77.2 Penyedia bertanggung jawab atas Kegagalan Bangunan selama Umur Konstruksi yang tercantum dalam SSKK tetapi tidak lebih dari 10 (sepuluh) tahun, dan dalam SSKK agar dicantumkan lama pertanggungan terhadap Kegagalan Bangunan yang ditetapkan apabila rencana Umur Konstruksi kurang dari 10 (sepuluh) tahun."
          },
          {
            "prefix": "77.3",
            "text": "Pejabat Penandatangan Kontrak bertanggungjawab atas Kegagalan Bangunan yang terjadi setelah jangka waktu yang ditetapkan dalam SSKK.",
            "fullText": "77.3 Pejabat Penandatangan Kontrak bertanggungjawab atas Kegagalan Bangunan yang terjadi setelah jangka waktu yang ditetapkan dalam SSKK."
          },
          {
            "prefix": "77.4",
            "text": "Penyedia berkewajiban untuk melindungi, membebaskan, dan menanggung tanpa batas Pejabat Penandatangan Kontrak beserta instansinya terhadap semua bentuk tuntutan, tanggung jawab, kewajiban, kehilangan, kerugian, denda, gugatan atau tuntutan hukum, proses pemeriksaan hukum, dan biaya yang dikenakan terhadap Pejabat Penandatangan Kontrak beserta instansinya (kecuali kerugian yang mendasari tuntutan tersebut disebabkan kesalahan atau kelalaian Pejabat Penandatangan Kontrak) sehubungan dengan klaim kehilangan atau kerusakan harta benda, dan cedera tubuh, sakit atau kematian pihak ketiga yang timbul dari Kegagalan Bangunan.",
            "fullText": "77.4 Penyedia berkewajiban untuk melindungi, membebaskan, dan menanggung tanpa batas Pejabat Penandatangan Kontrak beserta instansinya terhadap semua bentuk tuntutan, tanggung jawab, kewajiban, kehilangan, kerugian, denda, gugatan atau tuntutan hukum, proses pemeriksaan hukum, dan biaya yang dikenakan terhadap Pejabat Penandatangan Kontrak beserta instansinya (kecuali kerugian yang mendasari tuntutan tersebut disebabkan kesalahan atau kelalaian Pejabat Penandatangan Kontrak) sehubungan dengan klaim kehilangan atau kerusakan harta benda, dan cedera tubuh, sakit atau kematian pihak ketiga yang timbul dari Kegagalan Bangunan."
          },
          {
            "prefix": "77.5",
            "text": "Pejabat Penandatangan Kontrak maupun Penyedia berkewajiban untuk menyimpan dan memelihara semua dokumen yang digunakan dan terkait dengan pelaksanaan ini selama Umur Konstruksi yang tercantum dalam SSKK tetapi tidak lebih dari 10 (sepuluh) tahun.",
            "fullText": "77.5 Pejabat Penandatangan Kontrak maupun Penyedia berkewajiban untuk menyimpan dan memelihara semua dokumen yang digunakan dan terkait dengan pelaksanaan ini selama Umur Konstruksi yang tercantum dalam SSKK tetapi tidak lebih dari 10 (sepuluh) tahun."
          }
        ]
      }
    ]
  },
  {
    "id": "ssuk-sec-h",
    "huruf": "H",
    "judul": "PENYELESAIAN PERSELISIHAN",
    "nomorDanJudul": "H. PENYELESAIAN PERSELISIHAN",
    "clauses": [
      {
        "id": "ssuk-78",
        "pasal": 78,
        "judul": "Penyelesaian Perselisihan/Sengketa",
        "nomorDanJudul": "78. Penyelesaian Perselisihan/Sengketa",
        "paragraphs": [
          {
            "prefix": "78.1",
            "text": "Para Pihak berkewajiban untuk berupaya sungguh-sungguh menyelesaikan secara damai semua perselisihan yang timbul dari atau berhubungan dengan Kontrak ini atau interpretasinya selama atau setelah pelaksanaan pekerjaan ini dengan prinsip dasar musyawarah untuk mencapai kemufakatan.",
            "fullText": "78.1 Para Pihak berkewajiban untuk berupaya sungguh-sungguh menyelesaikan secara damai semua perselisihan yang timbul dari atau berhubungan dengan Kontrak ini atau interpretasinya selama atau setelah pelaksanaan pekerjaan ini dengan prinsip dasar musyawarah untuk mencapai kemufakatan."
          },
          {
            "prefix": "78.2",
            "text": "Dalam hal musyawarah para pihak sebagaimana dimaksud pada Pasal 78.1 tidak dapat mencapai suatu kemufakatan, maka penyelesaian perselisihan atau sengketa antara para pihak ditempuh melalui tahapan mediasi, konsiliasi, dan arbitrase.",
            "fullText": "78.2 Dalam hal musyawarah para pihak sebagaimana dimaksud pada Pasal 78.1 tidak dapat mencapai suatu kemufakatan, maka penyelesaian perselisihan atau sengketa antara para pihak ditempuh melalui tahapan mediasi, konsiliasi, dan arbitrase."
          },
          {
            "prefix": "78.3",
            "text": "Selain ketentuan pada Pasal 78.2 penyelesaian perselisihan/sengketa para pihak dapat dilakukan melalui:",
            "fullText": "78.3 Selain ketentuan pada Pasal 78.2 penyelesaian perselisihan/sengketa para pihak dapat dilakukan melalui:"
          },
          {
            "prefix": "a.",
            "text": "layanan penyelesaian sengketa Kontrak;",
            "fullText": "a. layanan penyelesaian sengketa Kontrak;"
          },
          {
            "prefix": "b.",
            "text": "dewan sengketa konstruksi; atau",
            "fullText": "b. dewan sengketa konstruksi; atau"
          },
          {
            "prefix": "c.",
            "text": "Pengadilan.",
            "fullText": "c. Pengadilan."
          },
          {
            "text": "Pilihan penyelesaian sengketa tercantum dalam SSKK.",
            "fullText": "Pilihan penyelesaian sengketa tercantum dalam SSKK."
          },
          {
            "prefix": "78.4",
            "text": "Dalam hal pilihan yang digunakan dewan sengketa untuk menggantikan mediasi dan konsiliasi maka nama anggota dewan sengketa yang dipilih dan ditetapkan oleh para pihak sebelum penandatanganan kontrak.",
            "fullText": "78.4 Dalam hal pilihan yang digunakan dewan sengketa untuk menggantikan mediasi dan konsiliasi maka nama anggota dewan sengketa yang dipilih dan ditetapkan oleh para pihak sebelum penandatanganan kontrak."
          }
        ]
      },
      {
        "id": "ssuk-79",
        "pasal": 79,
        "judul": "Itikad Baik",
        "nomorDanJudul": "79. Itikad Baik",
        "paragraphs": [
          {
            "prefix": "79.1",
            "text": "Para pihak bertindak berdasarkan asas saling percaya yang disesuaikan dengan hak-hak yang terdapat dalam Kontrak.",
            "fullText": "79.1 Para pihak bertindak berdasarkan asas saling percaya yang disesuaikan dengan hak-hak yang terdapat dalam Kontrak."
          },
          {
            "prefix": "79.2",
            "text": "Para pihak setuju untuk melaksanakan perjanjian dengan jujur tanpa menonjolkan kepentingan masing-masing pihak. Apabila selama Kontrak, salah satu pihak merasa dirugikan, maka diupayakan tindakan yang terbaik untuk mengatasi keadaan tersebut.",
            "fullText": "79.2 Para pihak setuju untuk melaksanakan perjanjian dengan jujur tanpa menonjolkan kepentingan masing-masing pihak. Apabila selama Kontrak, salah satu pihak merasa dirugikan, maka diupayakan tindakan yang terbaik untuk mengatasi keadaan tersebut."
          }
        ]
      }
    ]
  }
];

// Flattened list of all 79 clauses with their full formatted text
export const OFFICIAL_SSUK_LIST: SSUKItem[] = OFFICIAL_SSUK_SECTIONS.flatMap(section => 
  section.clauses.map(clause => ({
    id: clause.id,
    pasal: String(clause.pasal),
    judul: clause.nomorDanJudul,
    kategori: section.nomorDanJudul,
    uraian: clause.paragraphs.map(p => p.fullText).join('\n')
  }))
);
