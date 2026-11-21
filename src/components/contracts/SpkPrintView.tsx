import React from 'react';
import { SpkContract } from '../../types';
import { KopSurat } from '../common/KopSurat';
import { PrintDocWrapper } from './PrintDocWrapper';
import { FormattedLegalText } from '../common/FormattedLegalText';
import { formatTanggalIndo, formatRupiah } from '../../utils/formatters';
import { ContractFooterParaf } from './ContractFooterParaf';

interface SpkPrintViewProps {
  spk: SpkContract;
}

export const SpkPrintView: React.FC<SpkPrintViewProps> = ({ spk }) => {
  const tanggalSpkFormatted = spk.tanggalSpk ? formatTanggalIndo(spk.tanggalSpk) : '-';
  const tanggalSppbjFormatted = spk.tanggalSppbj ? formatTanggalIndo(spk.tanggalSppbj) : '-';
  const tanggalMulaiFormatted = spk.tanggalMulai ? formatTanggalIndo(spk.tanggalMulai) : '-';
  const tanggalSelesaiFormatted = spk.tanggalSelesai ? formatTanggalIndo(spk.tanggalSelesai) : '-';

  // Format Fisik Baku DPUPR Kab. Tegal
  // Format Fisik Baku DPUPR Kab. Tegal
  if (spk.spkType === 'fisik') {
    const cleanPenyediaNama = (spk.penyediaNamaBadanUsaha || '').replace(/:\s*$/, '').trim();

    return (
      <div className="spk-fisik-container">
        {/* ======================================================== */}
        {/* LEMBAR 1: COVER / LEMBAR MUKA SPK FISIK (STANDALONE)     */}
        {/* Tidak memakai PrintDocWrapper agar bebas dari paraf box  */}
        {/* ======================================================== */}
        <div
          className="spk-page spk-cover-sheet font-serif text-black leading-relaxed bg-white p-4 sm:p-8 md:p-10 mb-8 max-w-[215mm] mx-auto text-xs flex flex-col justify-between min-h-[960px] shadow-sm"
          style={{ pageBreakAfter: 'always', breakAfter: 'page' }}
        >
          <div>
            <KopSurat />

            {/* Judul SPK */}
            <div className="text-center my-6 space-y-1">
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider underline">
                SURAT PERINTAH KERJA (SPK)
              </h2>
              <p className="text-xs font-normal">
                Nomor : {spk.nomorSpk || '000.3.2/PBLT/17.04/SPK/X/2026'}
              </p>
              <p className="text-xs font-normal">
                Tanggal {tanggalSpkFormatted}
              </p>
            </div>

            {/* Uraian Kegiatan & Paket Pekerjaan */}
            <div className="text-center my-6 space-y-2 uppercase font-bold text-xs max-w-2xl mx-auto px-4">
              <p className="leading-snug">
                {spk.kegiatan || 'KEGIATAN PENYELENGGARAAN BANGUNAN GEDUNG DI WILAYAH DAERAH KABUPATEN/KOTA, PEMBERIAN IZIN MENDIRIKAN BANGUNAN (IMB) DAN SERTIFIKAT LAIK FUNGSI BANGUNAN GEDUNG'}
              </p>
              <p className="leading-snug">
                PAKET PEKERJAAN {spk.namaPaket}
              </p>
              <p className="leading-snug">
                {spk.perubahanAnggaran || `PERUBAHAN ANGGARAN TAHUN ${spk.tahunAnggaran || 2026}`}
              </p>
            </div>

            {/* Ringkasan Data Kontrak Cover (Polos Tanpa Garis Tabel, Font Normal) */}
            <div className="my-6 max-w-2xl mx-auto">
              <table className="w-full text-xs border-collapse border-none">
                <tbody>
                  <tr>
                    <td className="w-44 py-1.5 font-normal align-top border-none text-black">Lokasi Pekerjaan</td>
                    <td className="w-5 py-1.5 text-center align-top border-none font-normal text-black">:</td>
                    <td className="py-1.5 align-top border-none text-black">{spk.lokasiPekerjaan}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-normal align-top border-none text-black">Sumber Dana</td>
                    <td className="py-1.5 text-center align-top border-none font-normal text-black">:</td>
                    <td className="py-1.5 align-top border-none text-black">{spk.sumberDana}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-normal align-top border-none text-black">Tahun Anggaran</td>
                    <td className="py-1.5 text-center align-top border-none font-normal text-black">:</td>
                    <td className="py-1.5 align-top border-none text-black">{spk.perubahanAnggaran || `Tahun Anggaran ${spk.tahunAnggaran || 2026}`}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-normal align-top border-none text-black">Nilai Kontrak</td>
                    <td className="py-1.5 text-center align-top border-none font-normal text-black">:</td>
                    <td className="py-1.5 align-top border-none text-black">
                      <span className="font-bold">{formatRupiah(spk.nilaiKontrak)}</span><br />
                      <span className="italic text-slate-800">({spk.nilaiKontrakTerbilang})</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-normal align-top border-none text-black">Masa pelaksanaan</td>
                    <td className="py-1.5 text-center align-top border-none font-normal text-black">:</td>
                    <td className="py-1.5 align-top border-none text-black">{spk.jangkaWaktuHari} ({spk.jangkaWaktuHuruf || '-'})</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-normal align-top border-none text-black">Mulai</td>
                    <td className="py-1.5 text-center align-top border-none font-normal text-black">:</td>
                    <td className="py-1.5 align-top border-none text-black">{tanggalMulaiFormatted}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-normal align-top border-none text-black">Sampai Dengan</td>
                    <td className="py-1.5 text-center align-top border-none font-normal text-black">:</td>
                    <td className="py-1.5 align-top border-none text-black">{tanggalSelesaiFormatted}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bagian Penyedia Cover (Di Bagian Bawah Tengah Halaman) */}
          <div className="text-center font-serif mt-auto pt-16 pb-4">
            <p className="font-normal tracking-wider uppercase text-xs mb-1">PENYEDIA :</p>
            <p className="font-bold text-sm uppercase">{cleanPenyediaNama}</p>
            <p className="text-xs text-slate-800 max-w-lg mx-auto mt-0.5">{spk.penyediaAlamat}</p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LEMBAR 2 & 3+: FORMULIR TABEL & SYARAT UMUM SPK DENGAN   */}
        {/* PARAF FOOTER RESMI OTOMATIS DARI PrintDocWrapper         */}
        {/* ======================================================== */}
        <PrintDocWrapper showFooterParaf={true}>
          {/* ======================================================== */}
          {/* LEMBAR 2: FORMULIR TABEL SPK UTUH (LKPP / DPUPR)         */}
          {/* ======================================================== */}
          <div
            className="spk-page spk-main-form font-serif text-black leading-relaxed flex flex-col justify-between pt-6"
            style={{ pageBreakAfter: 'always', breakAfter: 'page' }}
          >
            <div>
              <KopSurat />

              <div className="my-4">
                <table className="w-full border-collapse border border-black text-[11px] leading-snug">
                  <tbody>
                    {/* Baris 1: Header SPK & Dinas */}
                    <tr>
                      <td rowSpan={2} className="w-[32%] border border-black p-2.5 font-bold uppercase align-middle text-left leading-snug">
                        SURAT PERINTAH<br />KERJA (SPK)
                      </td>
                      <td className="w-[68%] border border-black p-2.5 font-bold uppercase text-center align-middle leading-snug">
                        DINAS PEKERJAAN UMUM DAN PENATAAN RUANG KABUPATEN<br />TEGAL
                      </td>
                    </tr>

                    {/* Baris 2: Nomor & Tanggal (hanya kolom kanan) */}
                    <tr>
                      <td className="border border-black p-2.5 align-top">
                        <div className="font-bold uppercase mb-1">NOMOR DAN TANGGAL SPK:</div>
                        <div className="grid grid-cols-[70px_10px_1fr] text-[11px]">
                          <div>Nomor</div>
                          <div>:</div>
                          <div>{spk.nomorSpk || '000.3.2/PBLT/17.04/SPK/X/2026'}</div>
                          <div>Tanggal</div>
                          <div>:</div>
                          <div>{tanggalSpkFormatted}</div>
                        </div>
                      </td>
                    </tr>

                    {/* Baris 3: Pejabat Penandatangan Kontrak */}
                    <tr>
                      <td className="border border-black p-2.5 font-bold uppercase align-top">
                        NAMA PEJABAT PENANDATANGAN KONTRAK
                      </td>
                      <td className="border border-black p-2.5 align-top">
                        <div className="grid grid-cols-[110px_10px_1fr] text-[11px] mb-2">
                          <div>Nama</div>
                          <div>:</div>
                          <div className="font-bold">{spk.ppkNama}</div>
                          <div>NIP</div>
                          <div>:</div>
                          <div>{spk.ppkNip}</div>
                          <div>Jabatan</div>
                          <div>:</div>
                          <div>{spk.ppkJabatan}</div>
                          <div>Berkedudukan di</div>
                          <div>:</div>
                          <div>{spk.ppkAlamat || 'Satuan Kerja Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal'}</div>
                        </div>
                        <p className="text-justify text-[10.5px] leading-relaxed">
                          yang bertindak untuk dan atas nama Pemerintah Indonesia c.q. Pemerintah Kabupaten Tegal c.q. Satuan Kerja Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal. berdasarkan {spk.ppkSkPengangkatanText || 'Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor 07 Tahun 2026 tanggal 12 Januari 2026 tentang Penunjukan Pejabat Pembuat Komitmen (PPKom) Pada Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal Tahun Anggaran 2026'} selanjutnya disebut “Pejabat Penandatangan Kontrak”, dengan:
                        </p>
                      </td>
                    </tr>

                    {/* Baris 4: Nama Penyedia */}
                    <tr>
                      <td className="border border-black p-2.5 font-bold uppercase align-top">
                        NAMA PENYEDIA
                      </td>
                      <td className="border border-black p-2.5 align-top">
                        <div className="grid grid-cols-[130px_10px_1fr] text-[11px] mb-2">
                          <div>Nama</div>
                          <div>:</div>
                          <div className="font-bold">{spk.penyediaNamaPimpinan}</div>
                          <div>Jabatan</div>
                          <div>:</div>
                          <div>{spk.penyediaJabatanPimpinan}</div>
                          <div>Berkedudukan di</div>
                          <div>:</div>
                          <div>{spk.penyediaAlamat}</div>
                          <div>Akta Notaris Nomor</div>
                          <div>:</div>
                          <div>{spk.penyediaAktaNotarisNomor || '4'}</div>
                          <div>Tanggal</div>
                          <div>:</div>
                          <div>{spk.penyediaAktaNotarisTanggal || '7 April 2022'}</div>
                          <div>Notaris</div>
                          <div>:</div>
                          <div>{spk.penyediaAktaNotarisNama || 'LAELI NURCHAMIDAH, SH. MKn'}</div>
                        </div>
                        <p className="text-justify text-[10.5px] leading-relaxed">
                          yang bertindak untuk dan atas nama <strong>{spk.penyediaNamaBadanUsaha}</strong> selanjutnya disebut “Penyedia”.
                        </p>
                      </td>
                    </tr>

                    {/* Baris 5: Wakil Sah */}
                    <tr>
                      <td className="border border-black p-2.5 font-bold uppercase align-top">
                        WAKIL SAH PEJABAT PENANDATANGAN KONTRAK
                      </td>
                      <td className="border border-black p-2.5 align-top">
                        <p className="font-bold mb-1">Wakil Sah Pejabat penandatangan kontrak</p>
                        <p>Untuk Pejabat penandatangan kontrak: {spk.wakilSahPpk || 'Tidak ada'}</p>
                      </td>
                    </tr>

                    {/* Baris 6: Paket Pengadaan */}
                    <tr>
                      <td className="border border-black p-2.5 font-bold uppercase align-top">
                        PAKET PENGADAAN: {spk.namaPaket.toUpperCase()}
                      </td>
                      <td className="border border-black p-2.5 align-top">
                        <div className="space-y-2">
                          <div>
                            <div className="font-bold uppercase text-[10px] text-slate-800">
                              NOMOR DAN TANGGAL UNDANGAN PENGADAAN LANGSUNG:
                            </div>
                            <div className="grid grid-cols-[70px_10px_1fr] text-[11px]">
                              <div>Nomor</div>
                              <div>:</div>
                              <div>{spk.nomorUndanganPengadaan || spk.nomorSppbj || '-'}</div>
                              <div>Tanggal</div>
                              <div>:</div>
                              <div>{spk.tanggalUndanganPengadaan ? formatTanggalIndo(spk.tanggalUndanganPengadaan) : tanggalSppbjFormatted}</div>
                            </div>
                          </div>

                          <div>
                            <div className="font-bold uppercase text-[10px] text-slate-800">
                              NOMOR DAN TANGGAL BERITA ACARA HASIL PENGADAAN LANGSUNG:
                            </div>
                            <div className="grid grid-cols-[70px_10px_1fr] text-[11px]">
                              <div>Nomor</div>
                              <div>:</div>
                              <div>{spk.nomorBahpl || '000.3.2/DPUPR/Rehab.Jaksa/PP/07/2026'}</div>
                              <div>Tanggal</div>
                              <div>:</div>
                              <div>{spk.tanggalBahpl ? formatTanggalIndo(spk.tanggalBahpl) : '12 Oktober 2026'}</div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Baris 7: Sumber Dana */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5 text-justify leading-relaxed">
                        <strong>SUMBER DANA:</strong> {spk.sumberDana} dibebankan atas DPPA Nomor {spk.dppaNomor || 'DPPA/A.3/1.03.0.00.0.00.01.0000/001/2026'} {spk.perubahanAnggaran || `Perubahan Anggaran Tahun ${spk.tahunAnggaran || 2026}`} untuk mata anggaran kegiatan {spk.mataAnggaran || spk.kegiatan || 'Penyelenggaraan Bangunan Gedung Di Wilayah Daerah Kabupaten/Kota, Pemberian Izin Mendirikan Bangunan (IMB) dan Sertifikat Laik Fungsi Bangunan Gedung'}
                      </td>
                    </tr>

                    {/* Baris 8: Masa Pelaksanaan & Pemeliharaan */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5 space-y-1.5 text-justify leading-relaxed">
                        <p>
                          <strong>MASA PELAKSANAAN PEKERJAAN:</strong> {spk.jangkaWaktuHari} ({spk.jangkaWaktuHuruf || '-'}) hari kalender dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan
                        </p>
                        <p>
                          <strong>MASA PEMELIHARAAN PEKERJAAN:</strong> {spk.masaPemeliharaanHari || 180} ({spk.masaPemeliharaanHuruf || 'seratus delapan puluh'}) hari Kalender dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan
                        </p>
                      </td>
                    </tr>

                    {/* Baris 9: Jenis Kontrak */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5">
                        <strong>JENIS KONTRAK:</strong> {spk.jenisKontrak || 'Harga Satuan'}
                      </td>
                    </tr>

                    {/* Baris 10: Dokumen Kontrak */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5 text-justify leading-relaxed">
                        <p className="font-bold mb-1">DOKUMEN KONTRAK</p>
                        <p className="mb-2">
                          Dokumen-dokumen berikut merupakan satu kesatuan dan jika terjadi pertentangan antara ketentuan dalam suatu dokumen dengan ketentuan dalam dokumen yang lain maka yang berlaku adalah ketentuan dalam dokumen yang lebih tinggi berdasarkan urutan hierarki sebagai berikut:
                        </p>
                        <ol className="list-decimal pl-6 space-y-0.5">
                          {(spk.dokumenKontrakHierarki || [
                            'Adendum Surat Perintah Kerja/SPK (apabila ada)',
                            'Surat Perintah Kerja',
                            'Surat Penawaran',
                            'Syarat-Syarat Umum SPK',
                            'Gambar-Gambar',
                            'Spesifikasi Teknis',
                            'Daftar Kuantitas dan Harga hasil negosiasi dan koreksi aritmatik',
                            'dokumen lainnya seperti: Surat Penunjukan Penyedia Barang/Jasa, Jadwal Pelaksanaan Pekerjaan, jaminan-jaminan, Berita Acara Rapat Persiapan Pelaksanaan Kontrak'
                          ]).map((doc, idx) => (
                            <li key={idx}>{doc};</li>
                          ))}
                        </ol>
                      </td>
                    </tr>

                    {/* Baris 11: Harga Kontrak */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5 text-justify">
                        <p className="font-bold mb-0.5">HARGA KONTRAK</p>
                        <p>
                          Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) adalah sebesar <strong>{formatRupiah(spk.nilaiKontrak)}</strong> ({spk.nilaiKontrakTerbilang})
                        </p>
                      </td>
                    </tr>

                    {/* Baris 12: Lingkup Pekerjaan */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5">
                        <p className="font-bold mb-1">LINGKUP PEKERJAAN</p>
                        <p className="mb-1">Ruang lingkup pekerjaan terdiri dari :</p>
                        <ul className="list-disc pl-6 space-y-0.5">
                          {(spk.ruangLingkup || []).map((rk, idx) => (
                            <li key={idx}>{rk}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>

                    {/* Baris 13: Sistem Pembayaran */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5 space-y-1">
                        <p className="font-bold mb-0.5">SISTEM PEMBAYARAN</p>
                        <p>
                          Pembayaran untuk kontrak ini dilakukan ke <strong>{spk.penyediaBank}</strong> rekening nomor : <strong>{spk.penyediaNomorRekening}</strong> atas nama <strong>{spk.penyediaNamaRekening}</strong>
                        </p>
                        <p>
                          Pembayaran prestasi pekerjaan dilakukan dengan cara : <strong>{spk.sistemPembayaran.includes('Sekaligus') ? 'Sekaligus' : spk.sistemPembayaran}</strong>
                        </p>
                      </td>
                    </tr>

                    {/* Baris 14: Besaran Uang Muka */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5">
                        <p className="font-bold mb-0.5">BESARAN UANG MUKA</p>
                        <p>{spk.besaranUangMuka || 'Kontrak ini tidak diberikan uang muka'}</p>
                      </td>
                    </tr>

                    {/* Baris 15: Fasilitas */}
                    <tr>
                      <td colSpan={2} className="border border-black p-2.5">
                        <p className="font-bold mb-0.5">FASILITAS</p>
                        <p>Pejabat penandatangan kontrak memberikan fasilitas berupa : {spk.fasilitas || 'tidak diberikan fasilitas'}</p>
                      </td>
                    </tr>

                    {/* Baris 16: Kolom Tanda Tangan Para Pihak (Rata Kanan dan Kiri 50% - 50%) */}
                    <tr>
                      <td colSpan={2} className="border border-black p-0">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr>
                              <td className="w-1/2 border-r border-black p-4 text-center align-top">
                                <p className="font-normal text-[11px]">Untuk dan atas nama</p>
                                <p className="font-normal text-[11px]">Dinas PUPR Kabupaten Tegal</p>
                                <p className="font-normal text-[10px] mb-1">{spk.ppkJabatan}</p>
                                <p className="font-bold italic text-[10.5px] mb-16">Selaku Pejabat Penandatangan Kontrak</p>
                                <p className="font-bold underline text-xs">{spk.ppkNama}</p>
                                <p className="font-normal text-[10px] mt-0.5">NIP. {spk.ppkNip}</p>
                              </td>
                              <td className="w-1/2 p-4 text-center align-top">
                                <p className="font-normal text-[11px]">Untuk dan atas nama Penyedia</p>
                                <p className="font-bold uppercase text-[11px] mb-1">{spk.penyediaNamaBadanUsaha}</p>
                                <div className="h-20" />
                                <p className="font-bold underline text-xs">{spk.penyediaNamaPimpinan}</p>
                                <p className="font-normal text-[10px] mt-0.5">{spk.penyediaJabatanPimpinan}</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4 pb-2 print:hidden">
              <ContractFooterParaf isFixedPrint={false} />
            </div>
          </div>

          {/* ======================================================== */}
          {/* LEMBAR 3+: SYARAT UMUM SURAT PERINTAH KERJA (SPK)        */}
          {/* ======================================================== */}
          <div className="spk-page spk-clauses-doc font-serif text-black leading-relaxed pt-6">
            <div className="text-center my-6 space-y-1">
              <h3 className="text-base font-bold uppercase tracking-wider underline">
                SYARAT UMUM
              </h3>
              <h3 className="text-base font-bold uppercase tracking-wider underline">
                SURAT PERINTAH KERJA (SPK)
              </h3>
            </div>

            <div className="space-y-3.5 text-xs font-serif">
              {(spk.clauses || []).filter(c => c.isActive).map((c) => (
                <div key={c.id} className="text-justify clause-item">
                  <div className="flex items-start text-justify mb-1" style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
                    <span className="shrink-0 w-7 font-bold text-left">{c.pasal}.</span>
                    <span className="flex-1 font-bold uppercase">{c.judul}</span>
                  </div>
                  <div className="pl-7">
                    <FormattedLegalText text={c.isi} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bagian Penutup SPK: Mengalir alami langsung di bawah poin klausul terakhir tanpa jeda kosong */}
            <div className="mt-6 pt-3 border-t border-slate-300 font-serif text-black leading-relaxed">
              <div className="text-xs text-justify leading-relaxed space-y-2">
                <p>
                  SPK untuk melaksanakan Pekerjaan {spk.namaPaket} ini, beserta lampiran-lampiranya merupakan bagian tak terpisahkan, dibuat dalam rangkap 3 (tiga) bermaterai untuk Pejabat Penandatangan Kontrak dan Penyedia serta masing-masing mempunyai kekuatan hukum yang sama.
                </p>
                <p>
                  SPK ini mulai berlaku efektif terhitung sejak tanggal yang ditetapkan dalam SPK dengan tanggal mulai dan penyelesaian keseluruhan pekerjaan sebagaimana diatur dalam SPMK.
                </p>
                <p>
                  Dengan demikian, Pejabat Penandatangan Kontrak dan Penyedia telah bersepakat untuk menandatangani SPK ini pada tanggal tersebut di atas dan melaksanakan SPK sesuai dengan ketentuan peraturan perundang-undangan di Republik Indonesia.
                </p>
              </div>
            </div>

            {/* Bagian Tanda Tangan SPK: Utuh tidak terpotong, dengan spacer print agar kotak paraf selalu berada di footer dasar kertas */}
            <div
              className="spk-signature-block font-serif text-black leading-relaxed"
              style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
            >
              <div className="grid grid-cols-2 gap-8 text-center pt-8 text-xs">
                <div>
                  <p className="font-normal text-[11px]">Untuk dan atas nama</p>
                  <p className="font-normal text-[11px]">Dinas PUPR Kabupaten Tegal</p>
                  <p className="text-[10px] font-normal mb-1">{spk.ppkJabatan}</p>
                  <p className="text-[10.5px] font-bold italic mb-16">Selaku Pejabat Penandatangan Kontrak</p>
                  <p className="font-bold underline text-xs">{spk.ppkNama}</p>
                  <p className="text-[10px] font-normal mt-0.5">NIP. {spk.ppkNip}</p>
                </div>

                <div>
                  <p className="text-[10px] mb-1 font-normal">Slawi, {tanggalSpkFormatted}</p>
                  <p className="text-[10px] italic font-normal mb-0.5">Menerima dan Menyetujui :</p>
                  <p className="font-normal text-[11px]">Untuk dan atas nama Penyedia</p>
                  <p className="font-bold uppercase text-[11px] mb-16">{spk.penyediaNamaBadanUsaha}</p>
                  <p className="font-bold underline text-xs">{spk.penyediaNamaPimpinan}</p>
                  <p className="text-[10px] font-normal mt-0.5">{spk.penyediaJabatanPimpinan}</p>
                </div>
              </div>

              {/* Spacer khusus print: memastikan kotak paraf tfoot terdorong ke posisi footer paling bawah halaman */}
              <div className="hidden print:block h-[185mm]" />
            </div>
          </div>

        </PrintDocWrapper>
      </div>
    );
  }

  // Format Konsultan Pengawas / Konsultan Perencana
  const jenisSpkJudul =
    spk.spkType === 'pengawas'
      ? 'JASA KONSULTANSI PENGAWASAN TEKNIS'
      : 'JASA KONSULTANSI PERENCANAAN TEKNIS (DED)';

  return (
    <PrintDocWrapper>
      <KopSurat />

      {/* Judul Dokumen SPK */}
      <div className="text-center my-6 space-y-1 font-serif">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
          SURAT PERINTAH KERJA (SPK)
        </h2>
        <p className="text-xs font-bold uppercase tracking-wide">
          {jenisSpkJudul}
        </p>
        <p className="text-xs font-bold pt-1">
          Nomor : {spk.nomorSpk}
        </p>
      </div>

      {/* Pembukaan SPK */}
      <div className="text-justify space-y-3 font-serif text-xs leading-relaxed">
        <p>
          Pada hari ini <strong>{spk.hariSpk || 'Senin'}</strong> tanggal <strong>{spk.tanggalTeksSpk || 'satu'}</strong> bulan <strong>{spk.bulanTeksSpk || 'Maret'}</strong> tahun <strong>{spk.tahunSpk || 2026}</strong> (<strong>{tanggalSpkFormatted}</strong>), bertempat di Slawi, berdasarkan Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) Nomor: <strong>{spk.nomorSppbj || '-'}</strong> tanggal <strong>{tanggalSppbjFormatted}</strong>, yang bertanda tangan di bawah ini:
        </p>

        {/* Tabel Komparasi Pihak I & II */}
        <div className="grid grid-cols-2 gap-4 border border-slate-900 p-3 my-2 bg-slate-50/50">
          {/* Pihak Pertama */}
          <div className="space-y-1.5 border-r border-slate-400 pr-3">
            <p className="font-bold text-center underline uppercase mb-2 text-slate-900">
              PIHAK PERTAMA (PPK)
            </p>
            <table className="w-full text-[11px]">
              <tbody>
                <tr>
                  <td className="w-20 font-bold align-top">Nama</td>
                  <td className="w-3 align-top">:</td>
                  <td className="font-bold align-top">{spk.ppkNama}</td>
                </tr>
                <tr>
                  <td className="font-bold align-top">NIP</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{spk.ppkNip}</td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Jabatan</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{spk.ppkJabatan}</td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Alamat</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{spk.ppkAlamat}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] italic pt-1 text-slate-700">
              Bertindak untuk dan atas nama Dinas Pekerjaan Umum dan Penataan Ruang Kab. Tegal, selanjutnya disebut <strong>PIHAK PERTAMA</strong>.
            </p>
          </div>

          {/* Pihak Kedua */}
          <div className="space-y-1.5 pl-1">
            <p className="font-bold text-center underline uppercase mb-2 text-slate-900">
              PIHAK KEDUA (PENYEDIA)
            </p>
            <table className="w-full text-[11px]">
              <tbody>
                <tr>
                  <td className="w-24 font-bold align-top">Nama</td>
                  <td className="w-3 align-top">:</td>
                  <td className="font-bold align-top">{spk.penyediaNamaPimpinan}</td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Jabatan</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{spk.penyediaJabatanPimpinan}</td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Badan Usaha</td>
                  <td className="align-top">:</td>
                  <td className="font-bold align-top">{spk.penyediaNamaBadanUsaha}</td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Alamat</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{spk.penyediaAlamat}</td>
                </tr>
                <tr>
                  <td className="font-bold align-top">NPWP</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{spk.penyediaNpwp}</td>
                </tr>
                <tr>
                  <td className="font-bold align-top">Rekening</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{spk.penyediaBank} ({spk.penyediaNomorRekening})</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] italic pt-1 text-slate-700">
              Bertindak untuk dan atas nama {spk.penyediaNamaBadanUsaha}, selanjutnya disebut <strong>PIHAK KEDUA</strong>.
            </p>
          </div>
        </div>

        <p>
          PIHAK PERTAMA memerintahkan PIHAK KEDUA dan PIHAK KEDUA menyepakati untuk melaksanakan pekerjaan sebagaimana diatur dalam rincian SPK berikut:
        </p>

        {/* Ringkasan Kontrak Pokok */}
        <table className="w-full border-collapse border border-slate-900 text-[11px] my-3">
          <tbody>
            <tr>
              <td className="w-1/3 border border-slate-900 p-2 font-bold bg-slate-100">1. Nama Paket Pekerjaan</td>
              <td className="w-2/3 border border-slate-900 p-2 font-bold">{spk.namaPaket}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">2. Lokasi Pekerjaan</td>
              <td className="border border-slate-900 p-2">{spk.lokasiPekerjaan}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">3. Nilai SPK (Termasuk PPN)</td>
              <td className="border border-slate-900 p-2">
                <span className="font-bold text-sm text-slate-900">{formatRupiah(spk.nilaiKontrak)}</span><br />
                <span className="italic">({spk.nilaiKontrakTerbilang})</span>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">4. Sumber Dana / Rekening</td>
              <td className="border border-slate-900 p-2">
                {spk.sumberDana} Tahun Anggaran {spk.tahunAnggaran}<br />
                Kode Akun: {spk.kodeRekeningKegiatan || '-'}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">5. Jangka Waktu Pelaksanaan</td>
              <td className="border border-slate-900 p-2">
                <strong>{spk.jangkaWaktuHari} ({spk.jangkaWaktuHuruf || '-'})</strong> hari kalender<br />
                Terhitung sejak {tanggalMulaiFormatted} s.d. {tanggalSelesaiFormatted}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">6. Cara Pembayaran</td>
              <td className="border border-slate-900 p-2">
                <strong>{spk.sistemPembayaran}</strong><br />
                <span className="text-[10px] text-slate-600">{spk.keteranganPembayaran}</span>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">7. Denda Keterlambatan</td>
              <td className="border border-slate-900 p-2">{spk.dendaKeterlambatan}</td>
            </tr>
          </tbody>
        </table>

        {/* Tabel Ruang Lingkup */}
        <div className="my-4">
          <p className="font-bold text-xs uppercase mb-1.5">
            Ruang Lingkup Pekerjaan / Layanan:
          </p>
          <table className="w-full border-collapse border border-slate-900 text-[11px]">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-10 border border-slate-900 p-1.5 text-center">No</th>
                <th className="border border-slate-900 p-1.5 text-left">Uraian Ruang Lingkup</th>
              </tr>
            </thead>
            <tbody>
              {(spk.ruangLingkup || []).map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-900 p-1.5 text-center">{idx + 1}.</td>
                  <td className="border border-slate-900 p-1.5">{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabel Personel */}
        <div className="my-4">
          <p className="font-bold text-xs uppercase mb-1.5">
            Daftar Personel / Tenaga Ahli:
          </p>
          <table className="w-full border-collapse border border-slate-900 text-[11px]">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-10 border border-slate-900 p-1.5 text-center">No</th>
                <th className="border border-slate-900 p-1.5 text-left">Nama Personel</th>
                <th className="border border-slate-900 p-1.5 text-left">Posisi Penugasan</th>
                <th className="border border-slate-900 p-1.5 text-left">Kualifikasi / Sertifikat</th>
              </tr>
            </thead>
            <tbody>
              {(spk.personelList || []).map((p, idx) => (
                <tr key={p.id || idx}>
                  <td className="border border-slate-900 p-1.5 text-center">{idx + 1}.</td>
                  <td className="border border-slate-900 p-1.5 font-bold">{p.nama}</td>
                  <td className="border border-slate-900 p-1.5">{p.posisi}</td>
                  <td className="border border-slate-900 p-1.5">{p.kualifikasi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Output Hasil Pekerjaan */}
        {spk.keluaranHasil && spk.keluaranHasil.length > 0 && (
          <div className="my-4">
            <p className="font-bold text-xs uppercase mb-1.5">
              Dokumen / Produk Keluaran yang Diserahkan:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-[11px]">
              {spk.keluaranHasil.map((kh, idx) => (
                <li key={idx}>{kh}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Syarat-Syarat SPK (Klausul) */}
        <div className="pt-6 border-t-2 border-slate-800 my-6">
          <div className="text-center mb-4">
            <h3 className="font-bold text-xs uppercase tracking-wider underline">
              SYARAT-SYARAT UMUM SURAT PERINTAH KERJA (SPK)
            </h3>
            <p className="text-[10px] text-slate-500">
              Standar LKPP Perlem No. 12 Tahun 2021 & Dinas PUPR Kabupaten Tegal
            </p>
          </div>

          <div className="space-y-4">
            {(spk.clauses || []).filter(c => c.isActive).map(c => (
              <div key={c.id} className="text-justify">
                <p className="font-bold text-center text-xs uppercase mb-1">
                  Pasal {c.pasal}<br />{c.judul}
                </p>
                <div className="text-[11px] leading-relaxed text-slate-800">
                  <FormattedLegalText text={c.isi} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Penutup & Tanda Tangan */}
        <div
          className="signature-section mt-6 pt-2 no-page-break"
          style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
        >
          <p className="text-xs text-justify leading-relaxed font-serif">
            Demikian Surat Perintah Kerja (SPK) ini dibuat dan ditandatangani oleh Para Pihak dengan penuh tanggung jawab dalam 2 (dua) rangkap asli bermaterai cukup dan memiliki kekuatan hukum yang sama.
          </p>

          <div
            className="grid grid-cols-2 gap-8 text-center pt-6"
            style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
          >
            <div>
              <p className="font-bold text-xs">Untuk dan atas nama</p>
              <p className="font-bold text-xs mb-14">{spk.penyediaNamaBadanUsaha}</p>
              <div className="border border-dashed border-slate-400 w-20 py-1 mx-auto mb-2 text-[9px] text-slate-500">
                MATERAI<br />Rp 10.000,-
              </div>
              <p className="font-bold underline text-xs">{spk.penyediaNamaPimpinan}</p>
              <p className="text-[10px]">{spk.penyediaJabatanPimpinan}</p>
            </div>

            <div>
              <p className="font-bold text-xs">Untuk dan atas nama</p>
              <p className="font-bold text-xs mb-14">
                DINAS PEKERJAAN UMUM DAN PENATAAN RUANG<br />KABUPATEN TEGAL
              </p>
              <div className="border border-dashed border-slate-400 w-20 py-1 mx-auto mb-2 text-[9px] text-slate-500">
                MATERAI<br />Rp 10.000,-
              </div>
              <p className="font-bold underline text-xs">{spk.ppkNama}</p>
              <p className="text-[10px]">NIP. {spk.ppkNip}</p>
            </div>
          </div>
        </div>

      </div>
    </PrintDocWrapper>
  );
};
