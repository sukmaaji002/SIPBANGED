import React from 'react';
import { ProjectContract } from '../../types';
import { PrintDocWrapper } from './PrintDocWrapper';

interface Props {
  contract: ProjectContract;
}

export const SSKKPrint: React.FC<Props> = ({ contract }) => {
  return (
    <PrintDocWrapper>
      <div className="text-center my-6">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
          SYARAT-SYARAT KHUSUS KONTRAK (SSKK)
        </h2>
        <p className="text-xs font-semibold text-slate-700 mt-1">
          PAKET PEKERJAAN KONSTRUKSI: {contract.namaPaket.toUpperCase()}
        </p>
      </div>

      <table className="w-full text-[11px] border border-black border-collapse text-left font-serif">
        <thead>
          <tr className="bg-slate-100 border border-black font-bold text-center">
            <th className="border border-black p-2 w-28 uppercase">Pasal dalam SSUK</th>
            <th className="border border-black p-2 w-48 uppercase">Ketentuan</th>
            <th className="border border-black p-2 uppercase">Data</th>
          </tr>
        </thead>
        <tbody className="align-top divide-y divide-black">
          {/* 4.1 & 4.2 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">4.1 & 4.2</td>
            <td className="border border-black p-2 font-bold">Korespondensi</td>
            <td className="border border-black p-2">
              <p className="font-bold mb-1">Alamat Para Pihak sebagai berikut:</p>
              <p className="font-bold text-[10.5px]">Satuan Kerja Pejabat Penandatangan Kontrak:</p>
              <div className="pl-3 mb-2 space-y-0.5">
                <div>Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal</div>
                <div>Nama: <strong>{contract.ppkNama}</strong></div>
                <div>Alamat: Jl. Cut Nyak Dien, Kalisapu, Slawi, Kabupaten Tegal</div>
                <div>E-mail: {contract.sskkEmailPPK}</div>
                <div>Faksimili: -</div>
              </div>

              <p className="font-bold text-[10.5px]">Penyedia:</p>
              <div className="pl-3 space-y-0.5">
                <div>Badan Usaha: <strong>{contract.penyediaNamaBadanUsaha}</strong></div>
                <div>Nama Direktur: <strong>{contract.penyediaNamaDirektur}</strong></div>
                <div>Alamat: {contract.penyediaKedudukan}</div>
                <div>E-mail: {contract.sskkEmailPenyedia}</div>
                <div>No. Whatsapp: {contract.sskkWhatsappPenyedia}</div>
                <div>Faksimili: {contract.sskkFaksimiliPenyedia}</div>
              </div>
            </td>
          </tr>

          {/* 4.2 & 5.1 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">4.2 & 5.1</td>
            <td className="border border-black p-2 font-bold">Wakil Sah Para Pihak</td>
            <td className="border border-black p-2">
              <p>Wakil Sah Para Pihak sebagai berikut:</p>
              <div className="pl-3 mt-1">
                <div>Untuk Pejabat Penandatangan Kontrak: <strong>{contract.sskkWakilSahPPK}</strong></div>
                <div>Untuk Penyedia: <strong>{contract.sskkWakilSahPenyedia}</strong></div>
              </div>
            </td>
          </tr>

          {/* 6.3 & 43 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">6.3.b & 6.3.c<br/>43.4 & 43.6</td>
            <td className="border border-black p-2 font-bold">Pencairan Jaminan</td>
            <td className="border border-black p-2">
              Jaminan dicairkan dan disetorkan pada <strong>{contract.sskkPencairanJaminan}</strong>.
            </td>
          </tr>

          {/* 7.2 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">7.2</td>
            <td className="border border-black p-2 font-bold">Asal Material / Bahan</td>
            <td className="border border-black p-2 space-y-1 text-justify">
              <p>Material/bahan yang digunakan harus berasal dari sumber, produsen, pabrik, pemasok, dan/atau lokasi pengambilan material yang sah serta memenuhi ketentuan perizinan berusaha yang dipersyaratkan sesuai jenis material dan ketentuan peraturan perundang-undangan. Penyedia wajib menunjukkan bukti asal dan/atau legalitas material apabila diminta oleh Pejabat Penandatangan Kontrak/Pengawas Pekerjaan.</p>
              <p>Setiap material/bahan yang digunakan wajib memenuhi spesifikasi teknis dan persyaratan mutu dalam Kontrak. Ketidaksesuaian penggunaan material/bahan menjadi tanggung jawab Penyedia dan wajib diperbaiki, diganti, dan/atau ditindaklanjuti sesuai perintah Pengawas Pekerjaan tanpa menimbulkan tambahan biaya bagi Pejabat Penandatangan Kontrak.</p>
              <p>Perjanjian pengadaan material/bahan antara Penyedia dengan produsen, pabrik, pemasok, dan/atau pemilik sumber material sepenuhnya menjadi tanggung jawab Penyedia. Setiap sengketa atau tuntutan yang timbul dari hubungan hukum tersebut menjadi tanggung jawab Penyedia dan tidak menimbulkan hubungan kontraktual maupun kewajiban pembayaran bagi Pejabat Penandatangan Kontrak dan/atau Pemerintah Kabupaten Tegal.</p>
            </td>
          </tr>

          {/* 13.1 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">13.1</td>
            <td className="border border-black p-2 font-bold">Pengawasan Pelaksanaan Pekerjaan</td>
            <td className="border border-black p-2">
              Pengawas Pekerjaan berasal dari Penyedia Jasa Pengawasan (Konsultan Pengawas) yang ditetapkan oleh Pejabat Penandatangan Kontrak.
            </td>
          </tr>

          {/* 26.1 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">26.1</td>
            <td className="border border-black p-2 font-bold">Masa Pelaksanaan</td>
            <td className="border border-black p-2">
              Masa Pelaksanaan selama <strong>{contract.jangkaWaktuPelaksanaanHari} ({contract.jangkaWaktuPelaksanaanHuruf})</strong> hari kalender terhitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK.
            </td>
          </tr>

          {/* 26.4 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">26.4</td>
            <td className="border border-black p-2 font-bold">Masa Pelaksanaan untuk Serah Terima Sebagian Pekerjaan (Bagian Kontrak)</td>
            <td className="border border-black p-2">Tidak Ada</td>
          </tr>

          {/* 32.8 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">32.8</td>
            <td className="border border-black p-2 font-bold">Masa Pemeliharaan</td>
            <td className="border border-black p-2">
              Masa Pemeliharaan berlaku selama <strong>{contract.jangkaWaktuPemeliharaanHari} ({contract.jangkaWaktuPemeliharaanHuruf})</strong> hari kalender terhitung sejak Tanggal Penyerahan Pertama Pekerjaan (PHO).
            </td>
          </tr>

          {/* 32.14 & 32.17 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">32.14 & 32.17</td>
            <td className="border border-black p-2 font-bold">Serah Terima Sebagian Pekerjaan (Bagian Kontrak)</td>
            <td className="border border-black p-2">Tidak Ada</td>
          </tr>

          {/* 33 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">33</td>
            <td className="border border-black p-2 font-bold">Pengambilalihan</td>
            <td className="border border-black p-2">
              Jangka waktu pengambilalihan lokasi dan hasil pekerjaan paling lambat 14 (empat belas) hari kalender setelah dikeluarkan surat keterangan selesai/pengakhiran pekerjaan.
            </td>
          </tr>

          {/* 34.1 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">34.1</td>
            <td className="border border-black p-2 font-bold">Gambar As Built dan Pedoman Pengoperasian dan Perawatan/ Pemeliharaan</td>
            <td className="border border-black p-2">
              Gambar ”As built” dan/atau pedoman pengoperasian dan perawatan/pemeliharaan harus diserahkan paling lambat 14 (empat belas) hari kalender setelah Tanggal Penyerahan Pertama Pekerjaan (PHO).
            </td>
          </tr>

          {/* 37.7 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">37.7</td>
            <td className="border border-black p-2 font-bold">Penyesuaian Harga</td>
            <td className="border border-black p-2">Penyesuaian harga tidak diberikan.</td>
          </tr>

          {/* 44.b */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">44.b</td>
            <td className="border border-black p-2 font-bold">Pembayaran Tagihan</td>
            <td className="border border-black p-2">
              Batas akhir waktu yang disepakati untuk penerbitan SPP oleh Pejabat Penandatangan Kontrak untuk pembayaran tagihan angsuran adalah 14 (empat belas) hari kerja terhitung sejak tagihan dan kelengkapan dokumen penunjang yang tidak diperselisihkan diterima oleh Pejabat Penandatangan Kontrak.
            </td>
          </tr>

          {/* 48.j */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">48.j</td>
            <td className="border border-black p-2 font-bold">Hak dan Kewajiban Penyedia</td>
            <td className="border border-black p-2 space-y-1 text-justify">
              <p>Hak dan kewajiban Penyedia:</p>
              <ol className="list-decimal pl-4 space-y-0.5">
                <li>tidak membuat dan/atau menyampaikan dokumen dan/atau keterangan yang tidak benar untuk memenuhi persyaratan Katalog Elektronik dan/atau dalam penyusunan dan pelaksanaan Surat Pesanan/Kontrak;</li>
                <li>menjamin bahwa harga Barang/Jasa yang tercantum dalam Katalog Elektronik merupakan harga terbaik bagi Pemerintah dan tidak menjual Barang/Jasa melalui Katalog Elektronik dengan harga lebih mahal daripada harga Barang/Jasa yang dijual selain melalui Katalog Elektronik pada periode penjualan, volume, tempat (kabupaten/kota), dan spesifikasi teknis yang sama; dan</li>
                <li>menindaklanjuti hasil audit/pemeriksaan oleh lembaga atau aparat yang berwenang sesuai ketentuan peraturan perundang-undangan, termasuk mengembalikan kelebihan pembayaran dan/atau mengganti kerugian negara/daerah apabila berdasarkan hasil audit/pemeriksaan yang berwenang ditetapkan adanya kerugian yang menjadi tanggung jawab Penyedia.</li>
              </ol>
            </td>
          </tr>

          {/* 55.1 & 55.3 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">55.1 & 55.3</td>
            <td className="border border-black p-2 font-bold">Tindakan Penyedia yang Mensyaratkan Persetujuan Pejabat Penandatangan Kontrak</td>
            <td className="border border-black p-2">
              Tindakan lain oleh Penyedia yang memerlukan persetujuan Pejabat Penandatangan Kontrak adalah penyampaian kepada pihak luar atas informasi dan/atau dokumen pelaksanaan pekerjaan yang bersifat terbatas atau bukan merupakan informasi publik, kecuali diwajibkan berdasarkan ketentuan peraturan perundang-undangan atau diminta oleh instansi yang berwenang.
            </td>
          </tr>

          {/* 55.2 & 55.3 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">55.2 & 55.3</td>
            <td className="border border-black p-2 font-bold">Tindakan Penyedia yang Mensyaratkan Persetujuan Pengawas Pekerjaan</td>
            <td className="border border-black p-2">
              Penyedia diperbolehkan menggunakan salinan dokumen dan piranti lunak yang dihasilkan dari Pekerjaan Konstruksi ini dengan pembatasan untuk penelitian/riset setelah mendapat persetujuan tertulis dari Pejabat Penandatangan Kontrak.
            </td>
          </tr>

          {/* 57 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">57</td>
            <td className="border border-black p-2 font-bold">Kepemilikan Dokumen</td>
            <td className="border border-black p-2">
              Penyedia diperbolehkan menggunakan salinan dokumen dan piranti lunak yang dihasilkan dari Pekerjaan Konstruksi ini dengan pembatasan untuk penelitian/riset setelah mendapat persetujuan tertulis dari Pejabat Penandatangan Kontrak.
            </td>
          </tr>

          {/* 61 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">61</td>
            <td className="border border-black p-2 font-bold">Pembayaran Denda</td>
            <td className="border border-black p-2">
              Penyedia menyetorkan denda ke kas daerah sebelum pembayaran tahapan penyelesaian pekerjaan.
            </td>
          </tr>

          {/* 62 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">62</td>
            <td className="border border-black p-2 font-bold">Jaminan</td>
            <td className="border border-black p-2 space-y-1">
              <p>Jaminan pelaksanaan dan jaminan uang muka dalam pelaksanaan kontrak ini dapat berupa bank garansi atau surety bond (Bank Umum, Perusahaan Asuransi, Perusahaan Penjaminan, Lembaga Pembiayaan Ekspor Indonesia).</p>
              <p>Jaminan pemeliharaan dalam pelaksanaan kontrak ini berupa:</p>
              <ol className="list-alpha pl-4 space-y-0.5">
                <li>Bank Garansi dengan dilampiri/disertai bukti slip setoran tunai senilai nilai jaminan dari pihak penjamin yang menerbitkan, atau;</li>
                <li>Bank garansi dengan cara pemblokiran/penahanan dana oleh Bank atas SP2D pekerjaan sebesar 5% (lima perseratus) dari Harga Kontrak untuk keperluan Jaminan Pemeliharaan terhadap pembayaran pekerjaan;</li>
                <li>Pemblokiran/penahanan dana sebagaimana point b. dapat dicairkan setelah Pejabat yang berwenang untuk menandatangani Kontrak menerbitkan Surat Pencairan Jaminan Pemeliharaan.</li>
              </ol>
            </td>
          </tr>

          {/* 64 & 65.1.h */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">64 & 65.1.h</td>
            <td className="border border-black p-2 font-bold">Fasilitas & Peristiwa Kompensasi</td>
            <td className="border border-black p-2">
              Fasilitas: Tidak Ada. Peristiwa Kompensasi: sesuai ketentuan SSUK.
            </td>
          </tr>

          {/* 69.1.e */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">69.1.e</td>
            <td className="border border-black p-2 font-bold">Besaran Uang Muka</td>
            <td className="border border-black p-2">
              <strong>{contract.sskkUangMukaKetentuan}</strong>
            </td>
          </tr>

          {/* 69.2.d */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">69.2.d</td>
            <td className="border border-black p-2 font-bold">Pembayaran Prestasi Pekerjaan</td>
            <td className="border border-black p-2 space-y-1.5 text-justify">
              <p>Pembayaran prestasi pekerjaan dilakukan dengan cara <strong>{contract.sskkPembayaranCara}</strong> dengan ketentuan tahapan pembayaran sebagai berikut:</p>
              <ol className="list-alpha pl-4 space-y-1">
                <li>Pelaksanaan pembayaran termin ke I (satu) sebesar <strong>{contract.sskkTermin1Bayar}%</strong> dari nilai kontrak setelah prestasi pekerjaan fisik mencapai <strong>{contract.sskkTermin1Fisik}%</strong> atas dasar berita acara pemeriksaan prestasi pekerjaan yang telah disetujui oleh Pejabat Penandatangan Kontrak;</li>
                <li>Pelaksanaan pembayaran termin ke II (dua) sebesar <strong>{contract.sskkTermin2Bayar}%</strong> dari nilai kontrak setelah prestasi pekerjaan fisik mencapai <strong>{contract.sskkTermin2Fisik}%</strong> atas dasar berita acara pemeriksaan prestasi pekerjaan yang telah disetujui oleh Pejabat Penandatangan Kontrak;</li>
                <li>Pelaksanaan pembayaran termin ke III (tiga) sebesar <strong>{contract.sskkTermin3Bayar}%</strong> dari nilai kontrak setelah prestasi pekerjaan fisik mencapai <strong>{contract.sskkTermin3Fisik}%</strong> atas dasar berita acara pemeriksaan prestasi pekerjaan yang telah disetujui oleh Pejabat Penandatangan Kontrak;</li>
                <li>Pelaksanaan pembayaran termin ke IV (empat) dengan membayarkan keseluruhan sisa pembayaran dari Harga Kontrak setelah prestasi pekerjaan fisik mencapai <strong>{contract.sskkTermin4Fisik}%</strong> dengan ketentuan Penyedia harus menyerahkan Jaminan Pemeliharaan sebesar 5% (lima persen) dari Harga Kontrak atas dasar berita acara pemeriksaan prestasi pekerjaan yang telah disetujui Pejabat Penandatangan Kontrak, serta dilampiri bukti pembayaran denda (apabila ada);</li>
                <li>Apabila Penyedia tidak dapat menyelesaikan prestasi pekerjaan mencapai 100% sampai batas akhir masa pelaksanaan berakhir atau prestasi pekerjaan tidak disetujui 100%, maka nilai pembayaran yang berhak diterima pihak Penyedia Jasa adalah sebesar progres pekerjaan yang telah terpasang dan disetujui Pejabat Penandatangan Kontrak;</li>
                <li>Dalam hal Penyedia tidak mengajukan pembayaran pada suatu tahapan termin, pembayaran dapat diakumulasikan pada termin berikutnya sepanjang prestasi pekerjaan yang menjadi dasar pembayaran telah diperiksa dan diterima;</li>
                <li>Terhadap volume atau item pekerjaan yang sudah terpasang/dikerjakan tetapi tidak bisa dibayarkan menjadi milik Pemerintah Daerah Kabupaten Tegal;</li>
                <li>Dokumen penunjang yang dipersyaratkan untuk pengajuan tagihan pembayaran prestasi pekerjaan sekurang-kurangnya meliputi:
                  <ol className="list-decimal pl-4 pt-1 space-y-0.5">
                    <li>Surat permohonan pembayaran / tagihan;</li>
                    <li>Laporan kemajuan prestasi pekerjaan;</li>
                    <li>Berita Acara Pemeriksaan Prestasi Pekerjaan;</li>
                    <li>Rekapitulasi dan perhitungan volume/prestasi pekerjaan;</li>
                    <li>Dokumen pendukung hasil pengukuran/opname pekerjaan;</li>
                    <li>Foto/dokumentasi pelaksanaan pekerjaan;</li>
                    <li>Addendum Kontrak, apabila ada;</li>
                    <li>Jaminan Pemeliharaan untuk pembayaran 100%, apabila dipersyaratkan; dan</li>
                    <li>Dokumen lainnya sesuai ketentuan penatausahaan keuangan Pemerintah Kabupaten Tegal.</li>
                  </ol>
                </li>
              </ol>
            </td>
          </tr>

          {/* 69.3.e */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">69.3.e</td>
            <td className="border border-black p-2 font-bold">Pembayaran Bahan dan/atau Peralatan</td>
            <td className="border border-black p-2">
              Penentuan dan besaran pembayaran untuk bahan dan/atau peralatan yang menjadi bagian permanen dari pekerjaan utama (material on site) tidak dibayar.
            </td>
          </tr>

          {/* 69.4.c */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">69.4.c</td>
            <td className="border border-black p-2 font-bold">Denda akibat Keterlambatan</td>
            <td className="border border-black p-2">
              Untuk pekerjaan ini besar denda keterlambatan untuk setiap hari keterlambatan adalah <strong>{contract.sskkDendaKeterlambatan}</strong>.
            </td>
          </tr>

          {/* 77.2 & 77.3 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">77.2 & 77.3</td>
            <td className="border border-black p-2 font-bold">Umur Konstruksi dan Pertanggungan terhadap Kegagalan Bangunan</td>
            <td className="border border-black p-2 space-y-1">
              <p>Bangunan hasil pekerjaan memiliki Umur Konstruksi selama <strong>{contract.sskkUmurKonstruksiTahun} (lima puluh) tahun</strong> sesuai dengan rencana umur konstruksi yang ditetapkan dalam dokumen perancangan, terhitung sejak Tanggal Penyerahan Akhir Pekerjaan (FHO).</p>
              <p>Jangka waktu pertanggungjawaban Penyedia terhadap Kegagalan Bangunan ditetapkan selama <strong>{contract.sskkPertanggunganKegagalanTahun} (sepuluh) tahun</strong> terhitung sejak Tanggal Penyerahan Akhir Pekerjaan.</p>
              <p>Pada saat penyerahan pekerjaan, Penyedia wajib menyerahkan surat penjaminan atas Kegagalan Bangunan Gedung yang disusun bersama Penyedia Jasa Pengawasan Konstruksi atau Manajemen Konstruksi sesuai dengan ketentuan peraturan perundang-undangan.</p>
            </td>
          </tr>

          {/* 78.3 */}
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold text-center">78.3</td>
            <td className="border border-black p-2 font-bold">Penyelesaian Perselisihan / Sengketa</td>
            <td className="border border-black p-2">
              Penyelesaian perselisihan/sengketa para pihak dilakukan melalui <strong>{contract.sskkPenyelesaianSengketa}</strong>.
            </td>
          </tr>
        </tbody>
      </table>
    </PrintDocWrapper>
  );
};
