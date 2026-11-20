import { SpkClauseItem, SpkContract, SpkType, Project } from '../types';
import { angkaKeTerbilang, parseKomponenTanggalKontrak } from '../utils/formatters';

export const DEFAULT_SPK_FISIK_CLAUSES: SpkClauseItem[] = [
  {
    id: 'spk-fsk-1',
    pasal: 1,
    judul: 'LINGKUP PEKERJAAN',
    isi: 'Penyedia yang ditunjuk berkewajiban untuk menyelesaikan pekerjaan dalam jangka waktu yang ditentukan sesuai dengan keluaran, gambar, spesifikasi teknis dan harga yang tercantum dalam SPK.',
    isActive: true
  },
  {
    id: 'spk-fsk-2',
    pasal: 2,
    judul: 'HUKUM YANG BERLAKU',
    isi: 'Keabsahan, interpretasi, dan pelaksanaan SPK ini didasarkan kepada hukum Republik Indonesia.',
    isActive: true
  },
  {
    id: 'spk-fsk-3',
    pasal: 3,
    judul: 'LARANGAN KORUPSI, KOLUSI DAN/ATAU NEPOTISME, PENYALAHGUNAAN WEWENANG SERTA PENIPUAN',
    isi: 'a. Berdasarkan etika pengadaan barang/jasa pemerintah, para pihak dilarang untuk:\n   1) menawarkan, menerima atau menjanjikan untuk memberi atau menerima hadiah atau imbalan berupa apa saja atau melakukan tindakan lainnya untuk mempengaruhi siapapun yang diketahui atau patut dapat diduga berkaitan dengan pengadaan ini;\n   2) mendorong terjadinya persaingan tidak sehat; dan/atau\n   3) membuat dan/atau menyampaikan secara tidak benar dokumen dan/atau keterangan lain yang disyaratkan untuk penyusunan dan pelaksanaan SPK ini;\nb. Penyedia menjamin bahwa yang bersangkutan termasuk semua anggota KSO (apabila berbentuk KSO) dan subkontraktornya (jika ada) tidak pernah dan tidak akan melakukan tindakan yang dilarang pada pasal di atas;\nc. Penyedia yang menurut penilaian Pejabat Penandatangan Kontrak terbukti melakukan larangan-larangan di atas dapat dikenakan sanksi-sanksi administratif oleh Pejabat Penandatangan Kontrak sesuai ketentuan peraturan-perundangan;\nd. Pejabat Penandatangan Kontrak yang terlibat dalam korupsi, kolusi, dan/atau nepotisme dan penipuan dikenakan sanksi berdasarkan ketentuan peraturan perundang-undangan.',
    isActive: true
  },
  {
    id: 'spk-fsk-4',
    pasal: 4,
    judul: 'HARGA KONTRAK',
    isi: 'a. Harga Kontrak telah memperhitungkan keuntungan, beban pajak, asuransi (apabila dipersyaratkan), biaya overhead, biaya pelaksanaan pekerjaan, dan biaya penerapan SMKK;\nb. Harga Kontrak sesuai dengan keluaran (output) yang tercantum dalam Daftar Keluaran dan Harga.',
    isActive: true
  },
  {
    id: 'spk-fsk-5',
    pasal: 5,
    judul: 'UANG MUKA',
    isi: 'a. Uang muka dibayar untuk membiayai mobilisasi peralatan/tenaga kerja konstruksi, pembayaran uang tanda jadi kepada pemasok bahan/material dan/atau untuk persiapan teknis lain;\nb. Untuk usaha kecil, uang muka dapat diberikan 50% (lima puluh perseratus) dari Harga Pekerjaan Konstruksi;\nc. Dalam hal diberikan uang muka, maka Penyedia harus mengajukan permohonan pengambilan uang muka secara tertulis kepada Pejabat Penandatangan Kontrak disertai dengan rencana penggunaan uang muka untuk melaksanakan pekerjaan sesuai SPK dan rencana pengembaliannya;\nd. Besaran uang muka ditentukan dalam SPK dan dibayar setelah Penyedia menyerahkan Jaminan Uang Muka paling sedikit sebesar uang muka yang diterima;\ne. Masa berlakunya Jaminan Uang Muka paling kurang sejak tanggal persetujuan pemberian uang muka sampai dengan Tanggal Penyerahan Pertama Pekerjaan (Provisional Hand Over/PHO);\nf. Pejabat Penandatangan Kontrak harus mengajukan Surat Permintaan Pembayaran (SPP) kepada Pejabat Penandatangananan Surat Perintah Membayar (PPSPM) untuk permohonan tersebut pada huruf d, paling lambat 7 (tujuh) hari kerja setelah Jaminan Uang Muka diterima;\ng. Pengembalian uang muka harus diperhitungkan berangsur-angsur secara proporsional pada setiap pembayaran prestasi pekerjaan dan paling lambat harus lunas pada saat pekerjaan mencapai prestasi 100% (seratus perseratus).',
    isActive: true
  },
  {
    id: 'spk-fsk-6',
    pasal: 6,
    judul: 'HAK DAN KEWAJIBAN PENYEDIA',
    isi: 'a. Penyedia berhak menerima pembayaran untuk pelaksanaan pekerjaan sesuai dengan harga dan ketentuan yang telah ditetapkan dalam SPK;\nb. Penyedia berhak meminta fasilitas-fasilitas dalam bentuk sarana dan prasarana dari Pejabat Penandatangan Kontrak untuk kelancaran pelaksanaan pekerjaan sesuai ketentuan SPK;\nc. Penyedia berkewajiban melaporkan pelaksanaan pekerjaan secara periodik kepada Pejabat Penandatangan Kontrak;\nd. Penyedia berkewajiban melaksanakan, menyelesaikan dan menyerahkan pekerjaan sesuai dengan jadwal pelaksanaan pekerjaan dan ketentuan yang telah ditetapkan dalam SPK;\ne. Penyedia berkewajiban melaksanakan dan menyelesaikan pekerjaan secara cermat, akurat dan penuh tanggung jawab dengan menyediakan tenaga kerja, bahan-bahan, peralatan, angkutan ke/atau dari lapangan, dan segala pekerjaan permanen maupun sementara yang diperlukan untuk pelaksanaan, penyelesaian dan perbaikan pekerjaan yang dirinci dalam SPK;\nf. Penyedia berkewajiban memberikan keterangan-keterangan yang diperlukan untuk pemeriksaan pelaksanaan yang dilakukan Pejabat Penandatangan Kontrak;\ng. Penyedia berkewajiban mengambil langkah-langkah yang memadai dalam rangka memberi perlindungan kepada setiap orang yang berada di tempat kerja maupun masyarakat dan lingkungan sekitar yang berhubungan dengan pemindahan bahan baku, penggunaan peralatan kerja konstruksi dan proses produksi;\nh. Penyedia berkewajiban melaksanakan semua perintah Wakil Sah Pejabat Penandatangan Kontrak /Pengawas Pekerjaan yang sesuai dengan kewenangan Wakil Sah Pejabat Penandatangan Kontrak /Pengawas Pekerjaan dalam SPK ini;\ni. Penyedia berkewajiban mengikutsertakan pekerjaannya dalam Perlindungan Jaminan Sosial Ketenagakerjaan dengan melakukan pembayaran perlindungan jaminan sosial berupa Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM);\nj. Penyedia berkewajiban menyerahkan bukti pembayaran JKK dan JKM paling lama 14 hari sejak kontrak/SPK kepada PA/KPA',
    isActive: true
  },
  {
    id: 'spk-fsk-7',
    pasal: 7,
    judul: 'HAK DAN KEWAJIBAN PEJABAT PENANDATANGAN KONTRAK',
    isi: 'a. Pejabat Penandatangan Kontrak berhak mengawasi dan memeriksa pekerjaan yang dilaksanakan oleh Penyedia;\nb. Pejabat Penandatangan Kontrak berhak menerima laporan-laporan secara periodik mengenai pelaksanaan pekerjaan yang dilaksanakan oleh Penyedia;\nc. Pejabat Penandatangan Kontrak berhak menerima hasil pekerjaan sesuai dengan jadwal penyerahan pekerjaan dan ketentuan yang telah ditetapkan dalam SPK;\nd. Pejabat Penandatangan Kontrak berkewajiban membayar pekerjaan sesuai dengan harga yang tercantum dalam SPK yang telah ditetapkan kepada Penyedia;\ne. Pejabat Penandatangan Kontrak berkewajiban memberikan fasilitas berupa sarana dan prasarana yang dibutuhkan oleh Penyedia untuk kelancaran pelaksanaan pekerjaan sesuai ketentuan SPK; dan\nf. Pejabat Penandatangan Kontrak berkewajiban menilai kinerja Penyedia.',
    isActive: true
  },
  {
    id: 'spk-fsk-8',
    pasal: 8,
    judul: 'WAKIL SAH PEJABAT PENANDATANGAN KONTRAK',
    isi: 'a. Setiap tindakan yang disyaratkan atau diperbolehkan untuk dilakukan, dan setiap dokumen yang disyaratkan atau diperbolehkan untuk dibuat berdasarkan SPK ini oleh Pejabat Penandatangan Kontrak hanya dapat dilakukan atau dibuat oleh Wakil Sah Pejabat Penandatangan Kontrak yang disebutkan dalam SPK;\nb. Kewenangan Wakil Sah Pejabat Penandatangan Kontrak diatur dalam Surat Keputusan dari Pejabat Penandatangan Kontrak dan harus disampaikan kepada Penyedia.',
    isActive: true
  },
  {
    id: 'spk-fsk-9',
    pasal: 9,
    judul: 'PERPAJAKAN',
    isi: 'Penyedia berkewajiban untuk membayar semua pajak, bea, retribusi, dan pungutan lain yang sah yang dibebankan oleh hukum yang berlaku atas pelaksanaan SPK. Semua pengeluaran perpajakan ini dianggap telah termasuk dalam harga kontrak.',
    isActive: true
  },
  {
    id: 'spk-fsk-10',
    pasal: 10,
    judul: 'PENGALIHAN DAN/ATAU SUBKONTRAK',
    isi: 'a. Penyedia dilarang untuk mengalihkan dan/atau mensubkontrakkan sebagian atau seluruh pekerjaan. Pengalihan seluruh pekerjaan hanya diperbolehkan dalam hal pergantian nama penyedia, baik sebagai akibat peleburan (merger) atau akibat lainnya;\nb. Jika ketentuan di atas dilanggar maka SPK diputuskan sepihak oleh Pejabat Penandatangan Kontrak dan Penyedia dikenakan sanksi.',
    isActive: true
  },
  {
    id: 'spk-fsk-11',
    pasal: 11,
    judul: 'MASA PELAKSANAAN KONTRAK',
    isi: 'a. SPK ini berlaku efektif pada tanggal penandatanganan oleh para pihak sampai dengan Tanggal Penyerahan Akhir Pekerjaan dan hak dan kewajiban Para Pihak yang terdapat dalam SPK sudah terpenuhi;\nb. Masa Pelaksanaan dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan;\nc. Masa Pemeliharaan dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan;\nd. Paling lambat 7 (tujuh) hari kalender sejak diterbitkannya SPMK dan sebelum pelaksanaan pekerjaan, Pejabat Penandatangan Kontrak bersama dengan Penyedia, unsur perancangan, dan unsur pengawasan, harus sudah menyelenggarakan rapat persiapan pelaksanaan kontrak;\ne. Hasil rapat persiapan pelaksanaan Kontrak dituangkan dalam Berita Acara Rapat Persiapan Pelaksanaan Kontrak;\nf. Pada tahap awal pelaksanaan kontrak, Pejabat Penandatangan Kontrak dan Pengawas Pekerjaan bersama-sama dengan Penyedia melakukan pengukuran dan pemeriksaan detail terhadap kondisi lokasi pekerjaan untuk setiap keluaran (output), Tenaga Kerja Konstruksi, dan Peralatan Utama (Mutual Check 0%);\ng. Hasil pemeriksaan bersama dituangkan dalam Berita Acara. Apabila dalam pengukuran/pemeriksaan bersama mengakibatkan perubahan isi kontrak, maka harus dituangkan dalam adendum SPK;\nh. Penyedia harus menyelesaikan pekerjaan sesuai jadwal yang ditentukan.;\ni. Apabila penyedia tidak dapat menyelesaikan pekerjaan sesuai jadwal karena keadaan diluar pengendaliannya dan penyedia telah melaporkan kejadian tersebut kepada Pejabat Penandatangan Kontrak, maka Pejabat Penandatangan Kontrak dapat melakukan penjadwalan kembali pelaksanaan tugas penyedia dengan adendum SPK.',
    isActive: true
  },
  {
    id: 'spk-fsk-12',
    pasal: 12,
    judul: 'PENGENDALIAN WAKTU',
    isi: 'a. Kecuali SPK diputuskan lebih awal, Penyedia berkewajiban untuk memulai pelaksanaan pekerjaan pada Tanggal Mulai Kerja, dan melaksanakan pekerjaan sesuai dengan jadwal yang telah disepakati sewaktu Rapat Persiapan Pelaksanaan Kontrak, serta menyelesaikan pekerjaan paling lambat selama Masa Pelaksanaan yang dinyatakan dalam SPK;\nb. Apabila Penyedia berpendapat tidak dapat menyelesaikan pekerjaan sesuai Masa Pelaksanaan karena di luar pengendaliannya yang dapat dibuktikan demikian, dan Penyedia telah melaporkan kejadian tersebut kepada Pejabat Penandatangan Kontrak, dengan disertai bukti-bukti yang dapat disetujui Pejabat Penandatangan Kontrak, maka Pejabat Penandatangan Kontrak dapat memberlakukan Peristiwa Kompensasi dan melakukan penjadwalan kembali pelaksanaan tugas Penyedia dengan membuat adendum SPK;\nc. Jika pekerjaan tidak selesai sesuai Masa Pelaksanaan bukan akibat Keadaan Kahar atau Peristiwa Kompensasi atau karena kesalahan atau kelalaian Penyedia maka Penyedia dikenakan denda.',
    isActive: true
  },
  {
    id: 'spk-fsk-13',
    pasal: 13,
    judul: 'KETERLAMBATAN PELAKSANAAN PEKERJAAN',
    isi: 'a. Apabila Penyedia terlambat melaksanakan pekerjaan sesuai jadwal, maka Pejabat Penandatangan Kontrak harus memberikan peringatan secara tertulis atau dikenakan ketentuan tentang kontrak kritis;\nb. Kontrak dinyatakan kritis apabila realisasi fisik pelaksanaan terlambat lebih besar 10% dari rencana;\nc. Penanganan kontrak terlambat dilakukan dengan rapat pembuktian (show cause meeting/SCM) sebagai berikut:\n   1) Pada saat Kontrak dinyatakan kritis, Pengawas Pekerjaan memberikan peringatan secara tertulis kepada Penyedia dan selanjutnya menyelenggarakan Rapat Pembuktian (SCM) Tahap I.\n   2) Dalam SCM Tahap I, Pejabat Penandatangan Kontrak , Pengawas Pekerjaan dan Penyedia membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam periode waktu tertentu (uji coba pertama) yang dituangkan dalam Berita Acara SCM Tahap I.\n   3) Apabila Penyedia gagal pada uji coba pertama, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis I dan harus diselenggarakan SCM Tahap II yang membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam waktu tertentu (uji coba kedua) yang dituangkan dalam Berita Acara SCM Tahap II.\n   4) Apabila Penyedia gagal pada uji coba kedua, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis II dan harus diselenggarakan SCM Tahap III yang membahas dan menyepakati besaran kemajuan fisik yang harus dicapai oleh Penyedia dalam waktu tertentu (uji coba ketiga) yang dituangkan dalam Berita Acara SCM Tahap III.\n   5) Apabila Penyedia gagal pada uji coba ketiga, maka Pejabat Penandatangan Kontrak menerbitkan Surat Peringatan Kontrak Kritis III dan Pejabat Penandatangan Kontrak dapat melakukan pemutusan Kontrak secara sepihak dengan mengesampingkan Pasal 1266 dan 1267 Kitab Undang-Undang Hukum Perdata.\n   6) Apabila uji coba berhasil, namun pada pelaksanaan pekerjaan selanjutnya Kontrak dinyatakan kritis lagi maka berlaku ketentuan SCM dari awal.',
    isActive: true
  },
  {
    id: 'spk-fsk-14',
    pasal: 14,
    judul: 'PEMBERIAN KESEMPATAN',
    isi: 'a. Dalam hal diperkirakan Penyedia gagal menyelesaikan pekerjaan sampai Masa Pelaksanaan berakhir, namun Pejabat Penandatangan Kontrak menilai bahwa Penyedia mampu menyelesaikan pekerjaan, Pejabat Penandatangan Kontrak dapat memberikan kesempatan kepada Penyedia untuk menyelesaikan pekerjaan;\nb. Pemberian kesempatan kepada Penyedia untuk menyelesaikan pekerjaan dimuat dalam adendum SPK yang didalamnya mengatur:\n   1) waktu pemberian kesempatan penyelesaian pekerjaan;\n   2) pengenaan sanksi denda keterlambatan kepada Penyedia;\nc. Pemberian kesempatan kepada Penyedia menyelesaikan pekerjaan dengan diikuti pengenaan denda keterlambatan;\nd. Pemberian kesempatan kepada Penyedia untuk menyelesaikan pekerjaan dilaksanakan dengan ketentuan:\n   1) tidak dapat melampaui Tahun Anggaran; dan\n   2) paling lama sama dengan Masa Pelaksanaan awal.',
    isActive: true
  },
  {
    id: 'spk-fsk-15',
    pasal: 15,
    judul: 'PERLINDUNGAN TENAGA KERJA',
    isi: 'a. Penyedia wajib menyediakan perlindungan bagi tenaga kerja konstruksinya, minimal berupa BPJS Ketenagakerjaan;\nb. Penyedia berkewajiban mengikutsertakan pekerjaannya dalam Perlindungan Jaminan Sosial Ketenagakerjaan dengan melakukan pembayaran perlindungan jaminan sosial berupa Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM);\nc. Penyedia berkewajiban menyerahkan bukti pembayaran JKK dan JKM paling lama 14 hari sejak kontrak/SPK kepada PA/KPA;\nd. Besarnya perlindungan bagi tenaga kerja sudah diperhitungkan dalam penawaran dan termasuk dalam harga Kontrak.',
    isActive: true
  },
  {
    id: 'spk-fsk-16',
    pasal: 16,
    judul: 'PENANGGUNGAN DAN RISIKO',
    isi: 'a. Penyedia berkewajiban untuk melindungi, membebaskan, dan menanggung tanpa batas Pejabat Penandatangan Kontrak beserta instansinya terhadap semua bentuk tuntutan, tanggung jawab, kewajiban, kehilangan, kerugian, denda, gugatan atau tuntutan hukum, proses pemeriksaan hukum, dan biaya yang dikenakan terhadap Pejabat Penandatangan Kontrak beserta instansinya (kecuali kerugian yang mendasari tuntutan tersebut disebabkan kesalahan atau kelalaian berat Pejabat Penandatangan Kontrak ) sehubungan dengan klaim yang timbul dari hal-hal berikut terhitung sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan :\n   1) kehilangan atau kerusakan peralatan dan harta benda Penyedia, dan tenaga kerja konstruksi;\n   2) cidera tubuh, sakit atau kematian tenaga kerja konstruksi;\n   3) kehilangan atau kerusakan harta benda, dan cidera tubuh, sakit atau kematian pihak ketiga.\nb. Terhitung sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan, semua risiko kehilangan atau kerusakan hasil pekerjaan ini, bahan dan perlengkapan merupakan risiko Penyedia, kecuali kerugian atau kerusakan tersebut diakibatkan oleh kesalahan atau kelalaian Pejabat Penandatangan Kontrak ;\nc. Pertanggungan asuransi yang dimiliki oleh Penyedia tidak membatasi kewajiban penanggungan dalam pasal ini;\nd. Kehilangan atau kerusakan terhadap hasil pekerjaan atau bahan yang menyatu dengan hasil pekerjaan sejak Tanggal Mulai Kerja sampai dengan Tanggal Penyerahan Akhir Pekerjaan harus diganti atau diperbaiki oleh Penyedia atas tanggungannya sendiri jika kehilangan atau kerusakan tersebut terjadi akibat tindakan atau kelalaian Penyedia.',
    isActive: true
  },
  {
    id: 'spk-fsk-17',
    pasal: 17,
    judul: 'PENGAWASAN DAN PEMERIKSAAN MUTU',
    isi: 'a. Pejabat Penandatangan Kontrak berwenang melakukan pengawasan dan pemeriksaan terhadap pelaksanaan pekerjaan yang dilaksanakan oleh penyedia. Apabila diperlukan, Pejabat Penandatangan Kontrak dapat memerintahkan kepada pihak ketiga untuk melakukan pengawasan dan pemeriksaan atas semua pelaksanaan pekerjaan yang dilaksanakan oleh penyedia;\nb. Pejabat Penandatangan Kontrak memberitahukan secara tertulis penyedia atas setiap cacat mutu yang ditemukan. Pejabat Penandatangan Kontrak dapat memerintahkan penyedia untuk menemukan dan mengungkapkan cacat mutu, serta menguji pekerjaan yang dianggap oleh Pejabat Penandatangan Kontrak mengandung cacat mutu. Penyedia bertanggung jawab atas cacat mutu selama Masa Kontrak;\nc. Terhadap pemberitahuan Cacat Mutu tersebut, Penyedia berkewajiban untuk memperbaiki Cacat Mutu dalam jangka waktu yang ditetapkan dalam pemberitahuan;\nd. Jika Penyedia tidak memperbaiki Cacat Mutu dalam jangka waktu yang ditentukan maka Pejabat Penandatangan Kontrak, berdasarkan pertimbangan Pengawas Pekerjaan, berhak untuk secara langsung atau melalui pihak ketiga yang ditunjuk oleh Pejabat Penandatangan Kontrak melakukan perbaikan tersebut. Penyedia segera setelah menerima klaim Pejabat Penandatangan Kontrak secara tertulis berkewajiban untuk mengganti biaya perbaikan tersebut. Pejabat Penandatangan Kontrak dapat memperoleh penggantian biaya dengan memotong pembayaran atas tagihan Penyedia yang jatuh tempo (jika ada) atau uang retensi atau pencairan Jaminan Pemeliharaan atau jika tidak ada maka biaya penggantian akan diperhitungkan sebagai utang Penyedia kepada Pejabat Penandatangan Kontrak yang telah jatuh tempo;\ne. Pejabat Penandatangan Kontrak mengenakan denda keterlambatan untuk setiap keterlambatan perbaikan Cacat Mutu dan mengenakan Sanksi Daftar Hitam kepada Penyedia jika tidak melaksanakan perbaikan cacat mutu;\nf. Jangka waktu perbaikan akibat Cacat Mutu paling lambat adalah 14 hari setelah diterimanya pemberitahuan cacat mutu oleh Penyedia.',
    isActive: true
  },
  {
    id: 'spk-fsk-18',
    pasal: 18,
    judul: 'LAPORAN HASIL PEKERJAAN',
    isi: 'a. Pemeriksaan pekerjaan dilakukan selama pelaksanaan kontrak untuk menetapkan volume pekerjaan atau kegiatan yang telah dilaksanakan guna pembayaran hasil pekerjaan. Hasil pemeriksaan pekerjaan dituangkan dalam laporan kemajuan hasil pekerjaan;\nb. Untuk kepentingan pengendalian dan pengawasan pelaksanaan pekerjaan, seluruh aktivitas kegiatan pekerjaan dilokasi pekerjaan dicatat dalam buku harian sebagai bahan laporan kemajuan hasil pekerjaan yang berisi rencana dan realisasi pekerjaan dan catatan-catatan lain yang berkenaan dengan pelaksanaan pekerjaan;\nc. Laporan kemajuan hasil pekerjaan dapat dibuat harian, mingguan atau bulanan sesuai dengan kebutuhan;\nd. Untuk merekam kegiatan pelaksanaan pekerjaan konstruksi, Pejabat Penandatangan Kontrak dan Penyedia membuat foto-foto dokumentasi pelaksanaan pekerjaan di lokasi pekerjaan sesuai kebutuhan;\ne. Laporan kemajuan hasil pekerjaan dibuat oleh Penyedia, diperiksa oleh Pengawas Pekerjaan, dan disetujui oleh Pejabat Penandatangan Kontrak / pihak Pejabat Penandatangan Kontrak .',
    isActive: true
  },
  {
    id: 'spk-fsk-19',
    pasal: 19,
    judul: 'SERAH TERIMA PEKERJAAN',
    isi: 'a. Setelah pekerjaan selesai, sesuai dengan ketentuan yang tertuang dalam SPK, Penyedia mengajukan permintaan secara tertulis kepada Pejabat Penandatangan Kontrak untuk serah terima pertama pekerjaan;\nb. Pejabat Penandatangan Kontrak memerintahkan Pengawas Pekerjaan untuk melakukan pemeriksaan terhadap hasil pekerjaan;\nc. Pemeriksaan dilakukan terhadap kesesuaian hasil pekerjaan terhadap kriteria/spesifikasi yang tercantum dalam SPK;\nd. Hasil pemeriksaan dari Pengawas Pekerjaan disampaikan kepada Pejabat Penandatangan Kontrak, apabila dalam pemeriksaan hasil pekerjaan tidak sesuai dengan ketentuan yang tercantum dalam SPK dan/atau cacat hasil pekerjaan, Pejabat Penandatangan Kontrak memerintahkan Penyedia untuk memperbaiki dan/atau melengkapi kekurangan pekerjaan;\ne. Apabila dalam pemeriksaan hasil pekerjaan telah sesuai dengan ketentuan yang tercantum dalam SPK maka Pejabat Penandatangan Kontrak dan Penyedia menandatangani Berita Acara Serah Terima Pertama Pekerjaan;\nf. Pembayaran dilakukan sebesar 95% (sembilan puluh lima persen) dari Harga Kontrak, sedangkan yang 5% (lima persen) merupakan retensi selama masa pemeliharaan, atau pembayaran dilakukan sebesar 100% (seratus persen) dari Harga Kontrak dan Penyedia harus menyerahkan Jaminan Pemeliharaan sebesar 5% (lima persen) dari Harga Kontrak.',
    isActive: true
  },
  {
    id: 'spk-fsk-20',
    pasal: 20,
    judul: 'MASA PEMELIHARAAN DAN SERAH TERIMA AKHIR PEKERJAAN',
    isi: 'a. Penyedia wajib memelihara hasil pekerjaan selama Masa Pemeliharaan sehingga kondisi tetap seperti pada saat penyerahan pertama pekerjaan;\nb. Lamanya Masa Pemeliharaan ditetapkan dalam SPK;\nc. Setelah Masa Pemeliharaan berakhir, Penyedia mengajukan permintaan secara tertulis kepada Pejabat Penandatangan Kontrak untuk penyerahan akhir pekerjaan;\nd. Apabila dalam pemeriksaan hasil pekerjaan, Penyedia telah melaksanakan semua kewajibannya selama Masa Pemeliharaan dengan baik dan telah sesuai dengan ketentuan yang tercantum dalam SPK maka Pejabat Penandatangan Kontrak dan Penyedia menandatangani Berita Acara Serah Terima Akhir Pekerjaan;\ne. Pejabat Penandatangan Kontrak wajib melakukan pembayaran sisa Harga Kontrak yang belum dibayar atau mengembalikan Jaminan Pemeliharaan;\nf. Apabila Penyedia tidak melaksanakan kewajiban pemeliharaan sebagaimana mestinya, maka SPK dapat diputuskan sepihak oleh Pejabat Penandatangan Kontrak dan Penyedia dikenakan sanksi sesuai ketentuan peraturan perundangan;\ng. Setelah penandatanganan Berita Acara Serah Terima Akhir Pekerjaan, Pejabat Penandatangan Kontrak menyerahkan hasil pekerjaan kepada PA/KPA.',
    isActive: true
  },
  {
    id: 'spk-fsk-21',
    pasal: 21,
    judul: 'PERUBAHAN SPK',
    isi: 'a. SPK hanya dapat diubah melalui adendum SPK;\nb. Perubahan SPK dapat dilaksanakan apabila disetujui oleh para pihak, yang diakibatkan beberapa hal berikut meliputi:\n   1) perubahan pekerjaan;\n   2) perubahan Harga Kontrak;\n   3) perubahan jadwal pelaksanaan pekerjaan dan/atau Masa Pelaksanaan;\n   4) perubahan SPK yang disebabkan masalah administrasi.\nc. Untuk kepentingan perubahan SPK, Pejabat Penandatangan Kontrak dapat meminta pertimbangan dari Pengawas Pekerjaan.',
    isActive: true
  },
  {
    id: 'spk-fsk-22',
    pasal: 22,
    judul: 'PERUBAHAN PEKERJAAN',
    isi: 'a. Dalam hal terdapat perbedaan antara kondisi lapangan pada saat pelaksanaan dengan gambar dan/atau spesifikasi teknis yang ditentukan dalam dokumen SPK, Pejabat Penandatangan Kontrak bersama Penyedia dapat melakukan perubahan pekerjaan, yang meliputi:\n   1) menambah dan/atau mengurangi jenis/jumlah keluaran;\n   2) mengubah spesifikasi teknis dan/atau gambar pekerjaan; dan/atau\n   3) mengubah jadwal pelaksanaan pekerjaan.\nb. Dalam hal tidak terjadi perubahan kondisi lapangan seperti yang dimaksud pada huruf a diatas namun ada perintah perubahan dari Pejabat Penandatangan Kontrak, Pejabat Penandatangan Kontrak dan Penyedia dapat menyepakati perubahan pekerjaan sebagaimana Pasal 22.a angka 1 sampai angka 3;\nc. Perintah perubahan pekerjaan dibuat oleh Pejabat Penandatangan Kontrak secara tertulis kepada Penyedia kemudian dilanjutkan dengan negosiasi teknis dan harga dengan tetap mengacu pada ketentuan yang tercantum dalam SPK awal;\nd. Hasil negosiasi tersebut dituangkan dalam Berita Acara sebagai dasar penyusunan adendum SPK;\ne. Dalam hal perubahan pekerjaan mengakibatkan penambahan Harga Kontrak, perubahan SPK dilaksanakan dengan ketentuan penambahan Harga Kontrak akhir tidak melebihi 10% (sepuluh persen) dari harga yang tercantum dalam SPK awal dan tersedianya anggaran.',
    isActive: true
  },
  {
    id: 'spk-fsk-23',
    pasal: 23,
    judul: 'PERUBAHAN HARGA',
    isi: 'a. Perubahan Harga Kontrak dapat diakibatkan oleh perubahan pekerjaan dan/atau Peristiwa Kompensasi;\nb. Apabila terdapat perubahan pekerjaan, maka penentuan harga baru dilakukan dengan negosiasi;\nc. Ketentuan ganti rugi akibat Peristiwa Kompensasi mengacu pada pasal Peristiwa Kompensasi;',
    isActive: true
  },
  {
    id: 'spk-fsk-24',
    pasal: 24,
    judul: 'PERUBAHAN JADWAL PELAKSANAAN PEKERJAAN DAN/ATAU MASA PELAKSANAAN',
    isi: 'a. Perubahan jadwal pelaksanaan pekerjaan dapat diakibatkan oleh:\n   1) perubahan pekerjaan;\n   2) perpanjangan Masa Pelaksanaan; dan/atau\n   3) Peristiwa Kompensasi.\nb. Perpanjangan Masa Pelaksanaan dapat diberikan oleh Pejabat Penandatangan Kontrak atas pertimbangan yang layak dan wajar untuk hal-hal sebagai berikut:\n   1) perubahan pekerjaan;\n   2) Peristiwa Kompensasi; dan/atau\n   3) Keadaan Kahar.\nc. Masa Pelaksanaan dapat diperpanjang paling kurang sama dengan waktu terhentinya SPK akibat Keadaan Kahar atau waktu yang diperlukan untuk menyelesaikan pekerjaan akibat dari ketentuan pada huruf b diatas;\nd. Pejabat Penandatangan Kontrak dapat menyetujui perpanjangan Masa Pelaksanaan atas SPK setelah melakukan penelitian terhadap usulan tertulis yang diajukan oleh Penyedia dalam jangka waktu sesuai pertimbangan yang wajar setelah Penyedia meminta perpanjangan. Jika Penyedia lalai untuk memberikan peringatan dini atas keterlambatan atau tidak dapat bekerja sama untuk mencegah keterlambatan sesegera mungkin, maka keterlambatan seperti ini tidak dapat dijadikan alasan untuk memperpanjang Masa Pelaksanaan;\ne. Pejabat Penandatangan Kontrak berdasarkan pertimbangan Pengawas Pekerjaan harus telah menetapkan ada tidaknya perpanjangan dan untuk berapa lama;\nf. Persetujuan perubahan jadwal pelaksanaan dan/atau perpanjangan Masa Pelaksanaan dituangkan dalam adendum SPK;\ng. Jika terjadi Peristiwa Kompensasi sehingga penyelesaian pekerjaan akan melampaui Masa Pelaksanaan maka Penyedia berhak untuk meminta perpanjangan Masa Pelaksanaan berdasarkan data penunjang. Pejabat Penandatangan Kontrak berdasarkan pertimbangan Pengawas Pekerjaan memperpanjang Masa Pelaksanaan secara tertulis. Perpanjangan Masa Pelaksanaan harus dilakukan melalui adendum SPK.',
    isActive: true
  },
  {
    id: 'spk-fsk-25',
    pasal: 25,
    judul: 'KEADAAN KAHAR',
    isi: 'a. Dalam hal terjadi keadaan kahar, Pejabat Penandatangan Kontrak atau Penyedia memberitahukan tentang terjadinya Keadaan Kahar kepada salah satu pihak secara tertulis dengan ketentuan :\n   1) dalam waktu paling lambat 14 (empat belas) hari kalender sejak menyadari atau seharusnya menyadari atas kejadian atau terjadinya Keadaan Kahar;\n   2) menyertakan bukti Keadaan Kahar; dan\n   3) menyerahkan hasil identifikasi kewajiban dan kinerja pelaksanaan yang terhambat dan/atau akan terhambat akibat Keadaan Kahar tersebut.\nb. Dalam Keadaan Kahar, kegagalan salah satu Pihak untuk memenuhi kewajibannya yang ditentukan dalam kontrak bukan merupakan cidera janji atau wanprestasi apabila telah dilakukan sesuai pada huruf a. Kewajiban yang dimaksud adalah hanya kewajiban dan kinerja pelaksanaan terhadap pekerjaan/bagian pekerjaan yang terdampak dan/atau akan terdampak akibat dari Keadaan Kahar.',
    isActive: true
  },
  {
    id: 'spk-fsk-26',
    pasal: 26,
    judul: 'PERISTIWA KOMPENSASI',
    isi: 'a. Peristiwa Kompensasi dapat diberikan kepada Penyedia yaitu:\n   1) Pejabat Penandatangan Kontrak mengubah jadwal pekerjaan yang dapat mempengaruhi pelaksanaan pekerjaan;\n   2) keterlambatan pembayaran kepada Penyedia;\n   3) Pejabat Penandatangan Kontrak tidak memberikan gambar-gambar, spesifikasi dan/atau instruksi sesuai jadwal yang dibutuhkan;\n   4) Penyedia belum bisa masuk ke lokasi sesuai jadwal dalam SPK;\n   5) Pejabat Penandatangan Kontrak memerintahkan penundaan pelaksanaan pekerjaan;\n   6) Pejabat Penandatangan Kontrak memerintahkan untuk mengatasi kondisi tertentu yang tidak dapat diduga sebelumnya yang disebabkan/tidak disebabkan oleh Pejabat Penandatangan Kontrak ; atau\nb. Jika Peristiwa Kompensasi mengakibatkan pengeluaran tambahan dan/atau keterlambatan penyelesaian pekerjaan maka Pejabat Penandatangan Kontrak berkewajiban untuk membayar ganti rugi dan/atau memberikan perpanjangan Masa Pelaksanaan;\nc. Ganti rugi akibat Peristiwa Kompensasi hanya dapat dibayarkan jika berdasarkan data penunjang dan perhitungan kompensasi yang diajukan oleh Penyedia kepada Pejabat Penandatangan Kontrak , dapat dibuktikan kerugian nyata;\nd. Perpanjangan Masa Pelaksanaan hanya dapat diberikan jika berdasarkan data penunjang danperhitungan kompensasi yang diajukan oleh Penyedia kepada Pejabat Penandatangan Kontrak , dapat dibuktikan perlunya tambahan waktu akibat Peristiwa Kompensasi;\ne. Penyedia tidak berhak atas ganti rugi dan/atau perpanjangan Masa Pelaksanaan jika Penyedia gagal atau lalai untuk memberikan peringatan dini dalam mengantisipasi atau mengatasi dampak Peristiwa Kompensasi.',
    isActive: true
  },
  {
    id: 'spk-fsk-27',
    pasal: 27,
    judul: 'PENGHENTIAN DAN PEMUTUSAN SPK',
    isi: 'a. Penghentian SPK dapat dilakukan karena terjadi Keadaan Kahar;\nb. Pemutusan SPK dilakukan dengan terlebih dahulu memberikan 3 (tiga) kali surat peringatan dari salah satu pihak ke pihak yang lain yang melakukan tindakan wanprestasi;\nc. Pemutusan SPK dapat dilakukan oleh Pejabat Penandatangan Kontrak atau Penyedia;\nd. Pemutusan SPK dilakukan sekurang- kurangnya 14 (empat belas) hari kalender setelah Pejabat Penandatangan Kontrak /Penyedia menyampaikan pemberitahuan rencana Pemutusan SPK secara tertulis kepada Penyedia/Pejabat Penandatangan Kontrak ;\ne. Dalam hal dilakukan pemutusan SPK oleh salah satu pihak maka Pejabat Penandatangan Kontrak membayar kepada Penyedia sesuai dengan pencapaian prestasi pekerjaan yang telah diterima oleh Pejabat Penandatangan Kontrak dikurangi denda yang harus dibayar Penyedia (apabila ada), serta Penyedia menyerahkan semua hasil pelaksanaan kepada Pejabat Penandatangan Kontrak dan selanjutnya menjadi hak milik Pejabat Penandatangan Kontrak ;\nf. Mengesampingkan Pasal 1266 dan 1267 Kitab Undang-Undang Hukum Perdata, Pejabat Penandatangan Kontrak atau Penyedia melalui pemberitahuan tertulis dapat melakukan pemutusan SPK apabila:\n   1) Pejabat Penandatangan Kontrak atau Penyedia terbukti melakukan korupsi, kolusi, dan/atau nepotisme, kecurangan dan/atau pemalsuan dalam proses pengadaan yang diputuskan oleh Instansi yang berwenang;\n   2) pengaduan tentang penyimpangan prosedur, dugaan korupsi, kolusi, dan/atau nepotisme dan/atau pelanggaran persaingan sehat dalam pelaksanaan Pengadaan Barang/Jasa dinyatakan benar oleh Instansi yang berwenang;\n   3) Penyedia berada dalam keadaan pailit yang diputuskan oleh pengadilan;\n   4) Penyedia terbukti dikenakan Sanksi Daftar Hitam sebelum penandatanganan SPK;\n   5) Penyedia gagal memperbaiki kinerja;\n   6) Penyedia lalai/cidera janji dalam melaksanakan kewajibannya dan tidak memperbaiki kelalaiannya dalam jangka waktu yang telah ditetapkan;\n   7) berdasarkan penelitian Pejabat Penandatangan Kontrak , Penyedia tidak akan mampu menyelesaikan keseluruhan pekerjaan walaupun diberikan kesempatan sejak masa berakhirnya pelaksanaan pekerjaan untuk menyelesaikan pekerjaan;\n   8) setelah diberikan kesempatan menyelesaikan pekerjaan sejak masa berakhirnya pelaksanaan pekerjaan, Penyedia tidak dapat menyelesaikan pekerjaan;\n   9) Penyedia menghentikan pekerjaan selama 28 (dua puluh delapan) hari kalender dan penghentian ini tidak tercantum dalam jadwal pelaksanaan pekerjaan serta tanpa persetujuan pengawas pekerjaan;\n   10) Penyedia mengalihkan seluruh kontrak bukan dikarenakan pergantian nama Penyedia;\n   11) setelah mendapatkan persetujuan Pejabat Penandatangan Kontrak, Pengawas Pekerjaan memerintahkan Penyedia untuk menunda pelaksanaan pekerjaan atau kelanjutan pekerjaan, dan perintah tersebut tidak ditarik selama 28 (dua puluh delapan) hari kalender; atau\n   12) Pejabat Penandatangan Kontrak tidak menerbitkan Surat Permintaan Pembayaran (SPP) untuk pembayaran tagihan angsuran sesuai dengan yang disepakati.\ng. Dalam hal pemutusan SPK dilakukan pada Masa Pelaksanaan karena kesalahan Penyedia maka:\n   1) Sisa uang muka harus dilunasi oleh Penyedia atau Jaminan Uang Muka dicairkan terlebih dahulu (apabila diberikan);\n   2) penyedia membayar denda (apabila ada); dan\n   3) penyedia dikenakan Sanksi Daftar Hitam.\nh. Dalam hal pemutusan SPK dilakukan pada Masa Pemeliharaan karena kesalahan Penyedia, maka:\n   1) Pejabat Penandatangan Kontrak berhak untuk tidak membayar retensi atau Jaminan Pemeliharaan dicairkan terlebih dahulu untuk membiayai perbaikan/pemeliharaan; dan\n   2) Penyedia dikenakan sanksi Daftar Hitam.\ni. Dalam hal pemutusan SPK dilakukan karena Pejabat Penandatangan Kontrak terlibat penyimpangan prosedur, melakukan korupsi, kolusi, dan/atau nepotisme dan/atau pelanggaran persaingan sehat dalam pelaksanaan pengadaan, maka Pejabat Penandatangan Kontrak dikenakan sanksi berdasarkan peraturan perundangundangan;\nj. Pencairan jaminan sebagaimana dimaksud di atas, dicairkan dan disetorkan ke kas Negara/Daerah;\nk. Dalam hal terdapat nilai sisa penggunaan uang retensi atau uang pencairan Jaminan Pemeliharaan untuk membiayai pembiayaan/pemeliharaan maka Pejabat Penandatangan Kontrak wajib menyetorkan ke kas Negara/Daerah.',
    isActive: true
  },
  {
    id: 'spk-fsk-28',
    pasal: 28,
    judul: 'PEMBAYARAN',
    isi: 'a. Pembayaran prestasi hasil pekerjaan yang disepakati dilakukan oleh Pejabat Penandatangan Kontrak, dengan ketentuan:\n   1) Penyedia telah mengajukan tagihan disertai laporan kemajuan hasil pekerjaan;\n   2) pembayaran dilakukan tidak boleh melebihi kemajuan hasil pekerjaan yang telah dicapai dan diterima oleh Pejabat Penandatangan Kontrak ;\n   3) pembayaran dilakukan terhadap pekerjaan yang sudah terpasang;\n   4) pembayaran dilakukan dengan sistem sekaligus sesuai ketentuan dalam SPK;\n   5) pembayaran harus memperhitungkan:\n      a) pengembalian uang muka (apabila ada);\n      b) denda dan/atau ganti rugi (apabila ada);\n      c) pajak; dan/atau\n      d) uang retensi.\n   6) pembayaran terakhir hanya dilakukan setelah pekerjaan selesai dan Berita Acara Serah Terima Pertama Pekerjaan ditandatangani oleh Pejabat Penandatangan Kontrak dan Penyedia;\nb. Sebelum pembayaran terakhir dilakukan, Penyedia berkewajiban untuk menyerahkan kepada Pengawas Pekerjaan rincian perhitungan nilai tagihan terakhir yang jatuh tempo. Pejabat Penandatangan Kontrak berdasarkan hasil penelitian tagihan oleh Pengawas Pekerjaan berkewajiban untuk menerbitkan SPP untuk pembayaran tagihan terakhir paling lambat 7 (tujuh) hari kerja terhitung sejak tagihan dan dokumen penunjang dinyatakan lengkap dan diterima oleh Pengawas Pekerjaan;\nc. Pejabat Penandatangan Kontrak dalam kurun waktu 7 (tujuh) hari kerja setelah pengajuan permintaan pembayaran dari Penyedia diterima harus sudah mengajukan Surat Permintaan Pembayaran kepada Pejabat Penandatanganan Surat Perintah Membayar (PPSPM);\nd. apabila terdapat ketidaksesuaian dalam perhitungan angsuran, tidak akan menjadi alasan untuk menunda pembayaran. Pejabat Penandatangan Kontrak dapat meminta Penyedia untuk menyampaikan perhitungan prestasi sementara dengan mengesampingkan hal-hal yang sedang menjadi perselisihan;\ne. Pejabat Penandatangan Kontrak dapat menangguhkan pembayaran setiap angsuran prestasi pekerjaan Penyedia jika Penyedia gagal atau lalai memenuhi kewajiban kontraktualnya, termasuk penyerahan setiap Hasil Pekerjaan sesuai dengan waktu yang telah ditetapkan melalui pemberitahuan tertulis.\nf. Terdapat dokumen penunjang yang dipersyaratkan untuk mengajukan tagihan pembayaran prestasi pekerjaan sebagai berikut:\n   1) Bukti lunas pembayaran perlindungan perlindungan Jaminan Sosial berupa Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM);\n   2) Besaran Iuran Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM) dihitung berdasarkan nominal proyek jasa konstruksi.',
    isActive: true
  },
  {
    id: 'spk-fsk-29',
    pasal: 29,
    judul: 'DENDA DAN GANTI RUGI',
    isi: 'a. Denda merupakan sanksi finansial yang dikenakan kepada Penyedia, antara lain: denda keterlambatan dalam penyelesaian pelaksanaan pekerjaan, denda keterlambatan dalam perbaikan Cacat Mutu;\nb. Ganti rugi merupakan sanksi finansial yang dikenakan kepada Pejabat Penandatangan Kontrak maupun Penyedia karena terjadinya cidera janji/wanprestasi. Besarnya sanksi ganti rugi adalah sebesar nilai kerugian yang ditimbulkan;\nc. Besarnya denda keterlambatan yang dikenakan kepada Penyedia atas keterlambatan penyelesaian pekerjaan adalah 1‰ (satu perseribu) dari Harga Kontrak (sebelum PPN);\nd. Besaran denda keterlambatan perbaikan akibat Cacat Mutu untuk setiap hari keterlambatan adalah 1/1000 (satu per seribu) dari biaya perbaikan cacat mutu;\ne. Besarnya ganti rugi sebagai akibat Peristiwa Kompensasi yang dibayar oleh Pejabat Penandatangan Kontrak atas keterlambatan pembayaran adalah sebesar bunga dari nilai tagihan yang terlambat dibayar, berdasarkan tingkat suku bunga yang berlaku pada saat itu menurut ketetapan Bank Indonesia, sepanjang telah diputuskan oleh lembaga yang berwenang;\nf. Ganti rugi kepada Penyedia dapat mengubah Harga Kontrak setelah dituangkan dalam adendum SPK;\ng. Pembayaran ganti rugi dilakukan oleh Pejabat Penandatangan Kontrak, apabila Penyedia telah mengajukan tagihan disertai perhitungan dan data-data.',
    isActive: true
  },
  {
    id: 'spk-fsk-30',
    pasal: 30,
    judul: 'JAMINAN',
    isi: 'a. Jaminan yang digunakan dalam pelaksanaan Kontrak ini dapat berupa bank garansi atau surety bond. Jaminan bersifat tidak bersyarat, mudah dicairkan, dan harus dicairkan oleh penerbit jaminan paling lambat 14 (empat belas) hari kerja setelah surat perintah pencairan dari Pejabat yang berwenang untuk menandatangani Kontrak atau pihak yang diberi kuasa oleh Pejabat yang berwenang untuk menandatangani Kontrak diterima;\nb. Penerbit Jaminan selain Bank Umum harus telah ditetapkan/mendapat rekomendasi dari Otoritas Jasa Keuangan (OJK);\nc. Penggunaan Jaminan Pelaksanaan, Jaminan Uang Muka dan Jaminan Pemeliharaan sebagai berikut:\n   1) Bank Umum;\n   2) Perusahaan Asuransi;\n   3) Perusahaan Penjaminan; atau\n   4) Lembaga keuangan khusus yang menjalankan usaha di bidang pembiayaan, penjaminan, dan asuransi untuk mendorong ekspor Indonesia sesuai dengan ketentuan peraturan perundang-undangan di bidang lembaga pembiayaan ekspor Indonesia.\nd. Jaminan Pelaksanaan diberikan kepada Pejabat yang berwenang untuk menandatangani Kontrak setelah diterbitkannya Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) sebelum dilakukan Penandatanganan Kontrak dengan besar:\n   1) 5% (lima persen) dari Harga Kontrak; atau\n   2) 5% (lima persen) dari nilai HPS untuk harga penawaran atau penawaran terkoreksi di bawah 80% (delapan puluh persen) nilai HPS.\ne. Masa berlakunya Jaminan Pelaksanaan paling kurang sejak tanggal penandatangananan Kontrak sampai dengan Tanggal Penyerahan Pertama Pekerjaan (Provisional Hand Over/PHO).\nf. Jaminan Pelaksanaan dikembalikan setelah pekerjaan dinyatakan selesai 100% (seratus persen) dan diganti dengan Jaminan Pemeliharaan atau menahan uang retensi sebesar 5% (lima persen) dari Harga Kontrak;\ng. Jaminan Uang Muka diberikan kepada Pejabat yang berwenang untuk menandatangani Kontrak dalam rangka pengambilan uang muka yang besarannya paling kurang sama dengan besarnya uang muka yang diterima Penyedia.\nh. Nilai Jaminan Uang Muka dapat dikurangi secara proporsional sesuai dengan sisa uang muka yang diterima.\ni. Jaminan Pemeliharaan diberikan kepada Pejabat yang berwenang untuk menandatangani Kontrak setelah pekerjaan dinyatakan selesai 100% (seratus persen).\nj. Pengembalian Jaminan Pemeliharan dilakukan paling lambat 14 (empat belas) hari kerja setelah Masa Pemeliharaan selesai dan pekerjaan diterima dengan baik sesuai dengan ketentuan Kontrak.\nk. Masa berlaku Jaminan Pemeliharaan paling kurang sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan (Final Hand Over/FHO).',
    isActive: true
  },
  {
    id: 'spk-fsk-31',
    pasal: 31,
    judul: 'PENYELESAIAN PERSELISIHAN',
    isi: 'Pejabat Penandatangan Kontrak dan penyedia berkewajiban untuk berupaya sungguh-sungguh menyelesaikan secara damai semua perselisihan yang timbul dari atau berhubungan dengan SPK ini atau interpretasinya selama atau setelah pelaksanaan pekerjaan. Jika perselisihan tidak dapat diselesaikan secara musyawarah maka perselisihan akan diselesaikan melalui Mediasi, Konsiliasi, atau arbitrase.',
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
      sistemPembayaran: 'Sekaligus (100% setelah selesai & PHO)',
      keteranganPembayaran: 'Pembayaran prestasi pekerjaan dilakukan dengan cara : Sekaligus',
      dendaKeterlambatan: '1‰ (satu perseribu) dari Harga Kontrak (sebelum PPN) untuk setiap hari keterlambatan.',
      ruangLingkup: [
        'Pekerjaan Persiapan',
        'Pekerjaan Pembongkaran',
        'Pekerjaan Pasangan',
        'Pekerjaan Beton (Termasuk Pengujian)',
        'Pekerjaan Penutup Dinding',
        'Pekerjaan Furniture',
        'Pekerjaan Pengecatan',
        'Pekerjaan Elektrikal'
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
      kegiatan: 'KEGIATAN PENYELENGGARAAN BANGUNAN GEDUNG DI WILAYAH DAERAH KABUPATEN/KOTA, PEMBERIAN IZIN MENDIRIKAN BANGUNAN (IMB) DAN SERTIFIKAT LAIK FUNGSI BANGUNAN GEDUNG',
      subKegiatan: 'Rehabilitasi Sedang/Berat Bangunan Gedung',
      perubahanAnggaran: 'PERUBAHAN ANGGARAN TAHUN 2026',
      ppkSkPengangkatanText: 'Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor 07 Tahun 2026 tanggal 12 Januari 2026 tentang Penunjukan Pejabat Pembuat Komitmen (PPKom) Pada Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal Tahun Anggaran 2026',
      penyediaAktaNotarisNomor: '4',
      penyediaAktaNotarisTanggal: '7 April 2022',
      penyediaAktaNotarisNama: 'LAELI NURCHAMIDAH, SH. MKn',
      wakilSahPpk: 'Tidak ada',
      nomorUndanganPengadaan: `000.3.2/DPUPR/REHAB.${project.kodePaket || '01'}/PP/04/2026`,
      tanggalUndanganPengadaan: '2026-10-08',
      nomorBahpl: `000.3.2/DPUPR/Rehab.${project.kodePaket || '01'}/PP/07/2026`,
      tanggalBahpl: '2026-10-12',
      dppaNomor: 'DPPA/A.3/1.03.0.00.0.00.01.0000/001/2026',
      mataAnggaran: 'Penyelenggaraan Bangunan Gedung Di Wilayah Daerah Kabupaten/Kota, Pemberian Izin Mendirikan Bangunan (IMB) dan Sertifikat Laik Fungsi Bangunan Gedung',
      jenisKontrak: 'Harga Satuan',
      besaranUangMuka: 'Kontrak ini tidak diberikan uang muka',
      fasilitas: 'tidak diberikan fasilitas',
      dokumenKontrakHierarki: [
        'Adendum Surat Perintah Kerja/SPK (apabila ada)',
        'Surat Perintah Kerja',
        'Surat Penawaran',
        'Syarat-Syarat Umum SPK',
        'Gambar-Gambar',
        'Spesifikasi Teknis',
        'Daftar Kuantitas dan Harga hasil negosiasi dan koreksi aritmatik',
        'dokumen lainnya seperti: Surat Penunjukan Penyedia Barang/Jasa, Jadwal Pelaksanaan Pekerjaan, jaminan-jaminan, Berita Acara Rapat Persiapan Pelaksanaan Kontrak'
      ],
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

