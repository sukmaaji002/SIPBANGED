import React from 'react';
import { ProjectContract } from '../../types';
import { KopSurat } from '../common/KopSurat';
import { parseKomponenTanggalKontrak, formatTanggalIndo, formatRupiah, angkaKeTerbilang, resolveContractPlaceholders } from '../../utils/formatters';
import { parseRuangLingkup } from '../../utils/ruangLingkupParser';
import { PrintDocWrapper } from './PrintDocWrapper';

interface Props {
  contract: ProjectContract;
}

export const SuratPerjanjianPrint: React.FC<Props> = ({ contract }) => {
  const konsideransClause = (contract.clauses || []).find(c => c.id === 'sp-konsiderans');
  const premisClause = (contract.clauses || []).find(c => c.id === 'sp-premis');
  const activePasalClauses = (contract.clauses || []).filter(
    c => c.isActive && c.kategori === 'Surat Perjanjian' && c.id !== 'sp-konsiderans' && c.id !== 'sp-premis'
  );

  const comp = parseKomponenTanggalKontrak(contract.tanggal);
  const hariSesuaiTanggal = contract.hari || comp.hari;
  const tanggalTeks = contract.tanggalTeks || comp.tanggalTeks;
  const bulanTeks = contract.bulanTeks || comp.bulanTeks;
  const tahunAngka = contract.tahunAngka || comp.tahunAngka;
  const tanggalBulanTahunAngka = contract.tanggalBulanTahunAngka || comp.tanggalBulanTahunAngka;

  const tanggalSPPBJFormatted = contract.tanggalSPPBJ ? formatTanggalIndo(contract.tanggalSPPBJ) : '-';

  return (
    <PrintDocWrapper>
      <KopSurat />

      {/* Judul Kontrak Sesuai Format Word DPUPR */}
      <div className="text-center my-6 space-y-1 font-serif">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
          SURAT PERJANJIAN
        </h2>
        <p className="text-xs font-bold">
          Kontrak {contract.jenisKontrak}
        </p>
        
        <div className="pt-2 pb-1 space-y-0.5">
          <p className="text-xs">
            Paket Pekerjaan Konstruksi
          </p>
          <p className="text-xs font-bold uppercase tracking-wide">
            {contract.namaPaket}
          </p>
        </div>

        <p className="text-xs font-bold">
          Nomor : {contract.nomorSurat}
        </p>
      </div>

      {/* Pembukaan Surat Perjanjian */}
      <div className="text-justify space-y-3">
        <p>
          SURAT PERJANJIAN ini berikut semua lampirannya adalah Kontrak Kerja Konstruksi {contract.jenisKontrak}, yang selanjutnya disebut “Kontrak” dibuat dan ditandatangani di Slawi pada hari <strong>{hariSesuaiTanggal}</strong> tanggal <strong>{tanggalTeks}</strong> bulan <strong>{bulanTeks}</strong> tahun <strong>{tahunAngka}</strong> (<strong>{tanggalBulanTahunAngka}</strong>), berdasarkan Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) Nomor <strong>{contract.nomorSPPBJ}</strong> tanggal <strong>{tanggalSPPBJFormatted}</strong> , antara:
        </p>

        <table className="w-full text-xs text-left mb-2 font-serif">
          <tbody>
            <tr>
              <td className="w-36 py-0.5 font-bold">Nama</td>
              <td className="w-4 py-0.5">:</td>
              <td className="py-0.5 font-bold">{contract.ppkNama}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">NIP</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.ppkNip}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Jabatan</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.ppkJabatan?.replace(/PPKom/g, 'PPK')}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Berkedudukan di</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.ppkKedudukan}</td>
            </tr>
          </tbody>
        </table>

        <p>
          yang bertindak untuk dan atas nama Pemerintah Kabupaten Tegal cq Dinas Pekerjaan Umum dan Penataan Ruang berdasarkan Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor {contract.ppkNomorSK} Tahun {contract.ppkTahunSK} tanggal {contract.ppkTanggalSK} tentang Penunjukan Pejabat Pembuat Komitmen (PPK) Pada Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Tahun Anggaran {contract.ppkTahunAnggaran} selanjutnya disebut <strong>“Pejabat Penandatangan Kontrak”</strong>, dengan:
        </p>

        <table className="w-full text-xs text-left mb-2 font-serif">
          <tbody>
            <tr>
              <td className="w-36 py-0.5 font-bold">Nama</td>
              <td className="w-4 py-0.5">:</td>
              <td className="py-0.5 font-bold">{contract.penyediaNamaDirektur}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Jabatan</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.penyediaJabatan}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Berkedudukan di</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.penyediaKedudukan}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Akta Notaris Nomor</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.penyediaAktaNomor}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Tanggal</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.penyediaAktaTanggal}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Notaris</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.penyediaAktaNotaris}</td>
            </tr>
          </tbody>
        </table>

        <p>
          yang bertindak untuk dan atas nama <strong>{contract.penyediaNamaBadanUsaha}</strong> selanjutnya disebut <strong>“Penyedia”</strong>.
        </p>

        {/* Konsiderans / Dasar Hukum (Dinamis dari Editor Klausul) */}
        {konsideransClause && konsideransClause.isActive && (
          <div className="pt-2 space-y-1">
            <p className="font-bold">
              Dan dengan memperhatikan:
            </p>
            <div className="pl-5 text-[11px] whitespace-pre-line leading-relaxed text-justify">
              {resolveContractPlaceholders(
                konsideransClause.kontenCustom !== undefined ? konsideransClause.kontenCustom : konsideransClause.kontenDefault,
                contract
              )}
            </div>
          </div>
        )}

        {/* Premis / Keterangan Para Pihak (Dinamis dari Editor Klausul & Terhubung ke Data Proyek) */}
        {premisClause && premisClause.isActive && (
          <div className="pt-3 space-y-1">
            <p className="pb-1 font-bold text-center uppercase tracking-wide">
              PARA PIHAK MENERANGKAN TERLEBIH DAHULU BAHWA:
            </p>
            <div className="space-y-1.5 text-[11px] text-justify leading-relaxed whitespace-pre-line">
              {resolveContractPlaceholders(
                premisClause.kontenCustom !== undefined ? premisClause.kontenCustom : premisClause.kontenDefault,
                contract
              )}
            </div>
          </div>
        )}

        <p className="pt-2">
          Maka oleh karena itu, Pejabat Penandatangan Kontrak dan Penyedia dengan ini bersepakat dan menyetujui untuk membuat perjanjian pelaksanaan paket Pekerjaan <strong>{contract.namaPaket}</strong> dengan syarat dan ketentuan sebagai berikut:
        </p>
      </div>

      {/* Pasal-Pasal Surat Perjanjian (Dinamis Sesuai Isian & Pilihan Klausul Proyek) */}
      <div className="mt-6 space-y-5 text-justify">
        {activePasalClauses.length > 0 ? (
          activePasalClauses.map((clause, idx) => {
            if (clause.id === 'sp-pasal-2') {
              const rawData = clause.kontenCustom !== undefined
                ? clause.kontenCustom
                : (contract.ruangLingkupUtama && contract.ruangLingkupUtama.length > 0
                  ? contract.ruangLingkupUtama
                  : ['Pekerjaan Persiapan & SMKK', 'Pekerjaan Pondasi & Struktur Beton', 'Pekerjaan Pasangan Dinding & Plesteran', 'Pekerjaan Penutup Lantai & Atap', 'Pekerjaan Mekanikal Elektrikal']);
              
              const parsedItems = parseRuangLingkup(rawData);

              return (
                <div key={clause.id} className="space-y-1">
                  <div className="text-center font-bold uppercase text-xs">
                    Pasal {idx + 1}<br/>{clause.judul}
                  </div>
                  <div className="pl-2 pt-1 font-serif text-justify text-xs leading-relaxed">
                    <p className="mb-1">Ruang lingkup pekerjaan utama terdiri dari:</p>
                    <div className="space-y-1">
                      {parsedItems.map((item, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="flex items-start gap-2">
                            <span className="w-5 shrink-0 font-medium">{i + 1}.</span>
                            <span className="flex-1 font-medium">{item.nama}</span>
                          </div>
                          {item.subItems && item.subItems.length > 0 && (
                            <div className="pl-6 space-y-0.5">
                              {item.subItems.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-start gap-2">
                                  <span className="w-5 shrink-0 font-medium">
                                    {String.fromCharCode(97 + (sIdx % 26))}.
                                  </span>
                                  <span className="flex-1">{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            let content = clause.kontenCustom !== undefined ? clause.kontenCustom : clause.kontenDefault;

            if (clause.id === 'sp-pasal-3') {
              content = `1. Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) yang diperoleh berdasarkan total harga penawaran sebagaimana tercantum dalam Daftar Kuantitas dan Harga adalah sebesar ${formatRupiah(contract.nilaiKontrakAngka)} (${angkaKeTerbilang(contract.nilaiKontrakAngka)}) dengan kode akun kegiatan ${contract.kodeAkunKegiatan};\n2. Kontrak ini dibiayai dari ${contract.sumberPembiayaan};\n3. Pembayaran untuk kontrak ini dilakukan ke ${contract.bankNamaDanCabang} rekening nomor ${contract.nomorRekeningPenyedia} atas nama Penyedia ${contract.namaRekeningPenyedia}.`;
            } else if (clause.id === 'sp-pasal-5') {
              content = `1. Masa Kontrak adalah jangka waktu berlakunya Kontrak ini terhitung sejak tanggal penandatanganan Kontrak sampai dengan Tanggal Penyerahan Akhir Pekerjaan (FHO);\n2. Masa Pelaksanaan ditentukan dalam Syarat-Syarat Khusus Kontrak, dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan selama ${contract.jangkaWaktuPelaksanaanHari} (${contract.jangkaWaktuPelaksanaanHuruf}) hari kalender;\n3. Masa Pemeliharaan ditentukan dalam Syarat-Syarat Khusus Kontrak dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan selama ${contract.jangkaWaktuPemeliharaanHari} (${contract.jangkaWaktuPemeliharaanHuruf}) hari kalender.`;
            }

            return (
              <div key={clause.id} className="space-y-1">
                <div className="text-center font-bold uppercase text-xs">
                  Pasal {idx + 1}<br/>{clause.judul}
                </div>
                <div className="whitespace-pre-line leading-relaxed pl-2 pt-1 font-serif">
                  {content}
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="space-y-1">
              <div className="text-center font-bold uppercase text-xs">
                Pasal 1<br/>ISTILAH DAN UNGKAPAN
              </div>
              <p className="pl-2">
                Peristilahan dan ungkapan dalam Surat Perjanjian ini memiliki arti dan makna yang sama seperti yang tercantum dalam lampiran Surat Perjanjian ini.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-center font-bold uppercase text-xs">
                Pasal 2<br/>RUANG LINGKUP PEKERJAAN UTAMA
              </div>
              <div className="pl-2 pt-1 font-serif text-justify text-xs leading-relaxed">
                <p className="mb-1">Ruang lingkup pekerjaan utama terdiri dari:</p>
                <div className="space-y-1">
                  {parseRuangLingkup(
                    contract.ruangLingkupUtama && contract.ruangLingkupUtama.length > 0
                      ? contract.ruangLingkupUtama
                      : ['Pekerjaan Persiapan', 'Pekerjaan Struktur', 'Pekerjaan Arsitektur']
                  ).map((item, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-start gap-2">
                        <span className="w-5 shrink-0 font-medium">{i + 1}.</span>
                        <span className="flex-1 font-medium">{item.nama}</span>
                      </div>
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="pl-6 space-y-0.5">
                          {item.subItems.map((sub, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2">
                              <span className="w-5 shrink-0 font-medium">
                                {String.fromCharCode(97 + (sIdx % 26))}.
                              </span>
                              <span className="flex-1">{sub}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-center font-bold uppercase text-xs">
                Pasal 3<br/>HARGA KONTRAK, SUMBER PEMBIAYAAN DAN PEMBAYARAN
              </div>
              <ol className="list-decimal pl-7 space-y-1">
                <li>
                  Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) yang diperoleh berdasarkan total harga penawaran sebagaimana tercantum dalam Daftar Kuantitas dan Harga adalah sebesar <strong>{formatRupiah(contract.nilaiKontrakAngka)}</strong> (<em>{angkaKeTerbilang(contract.nilaiKontrakAngka)}</em>) dengan kode akun kegiatan <strong>{contract.kodeAkunKegiatan}</strong>;
                </li>
                <li>
                  Kontrak ini dibiayai dari {contract.sumberPembiayaan};
                </li>
                <li>
                  Pembayaran untuk kontrak ini dilakukan ke {contract.bankNamaDanCabang} rekening nomor <strong>{contract.nomorRekeningPenyedia}</strong> atas nama Penyedia <strong>{contract.namaRekeningPenyedia}</strong>.
                </li>
              </ol>
            </div>

            <div className="space-y-1">
              <div className="text-center font-bold uppercase text-xs">
                Pasal 4<br/>DOKUMEN KONTRAK
              </div>
              <p className="pl-2 mb-1">
                Kelengkapan dokumen-dokumen berikut merupakan satu kesatuan dan bagian yang tidak terpisahkan dari Kontrak ini terdiri dari adendum Kontrak (apabila ada), Surat Perjanjian, Surat Pesanan, Daftar Kuantitas dan Harga, Syarat-Syarat Umum Kontrak, Syarat-Syarat Khusus Kontrak beserta lampirannya berupa lampiran A (daftar harga satuan timpang, subkontraktor, personel manajerial, dan peralatan utama), lampiran B (Rencana Keselamatan Konstruksi), spesifikasi teknis, gambar-gambar, dan dokumen lainnya seperti: Surat Penunjukan Penyedia Barang/Jasa, Jadwal Pelaksanaan Pekerjaan, jaminan-jaminan, Berita Acara Rapat Persiapan Penandatanganan Kontrak, Berita Acara Rapat Persiapan Pelaksanaan Kontrak.
              </p>
              <p className="pl-2 mb-1">
                Jika terjadi pertentangan antara ketentuan dalam suatu dokumen dengan ketentuan dalam dokumen yang lain maka yang berlaku adalah ketentuan dalam dokumen yang lebih tinggi berdasarkan urutan hierarki sebagai berikut:
              </p>
              <ol className="list-decimal pl-7 space-y-0.5">
                <li>adendum Kontrak (apabila ada);</li>
                <li>Surat Perjanjian;</li>
                <li>Daftar Kuantitas dan Harga;</li>
                <li>Surat Pesanan;</li>
                <li>Syarat-Syarat Khusus Kontrak;</li>
                <li>Syarat-Syarat Umum Kontrak;</li>
                <li>Spesifikasi teknis; dan</li>
                <li>Gambar.</li>
              </ol>
            </div>

            <div className="space-y-1">
              <div className="text-center font-bold uppercase text-xs">
                Pasal 5<br/>MASA KONTRAK
              </div>
              <ol className="list-decimal pl-7 space-y-1">
                <li>
                  Masa Kontrak adalah jangka waktu berlakunya Kontrak ini terhitung sejak tanggal penandatanganan Kontrak sampai dengan Tanggal Penyerahan Akhir Pekerjaan;
                </li>
                <li>
                  Masa Pelaksanaan ditentukan dalam Syarat-Syarat Khusus Kontrak, dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan selama <strong>{contract.jangkaWaktuPelaksanaanHari} ({contract.jangkaWaktuPelaksanaanHuruf})</strong> hari kalender;
                </li>
                <li>
                  Masa Pemeliharaan ditentukan dalam Syarat-Syarat Khusus Kontrak dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan selama <strong>{contract.jangkaWaktuPemeliharaanHari} ({contract.jangkaWaktuPemeliharaanHuruf})</strong> hari kalender.
                </li>
              </ol>
            </div>
          </>
        )}
      </div>

      {/* Penutup Surat Perjanjian & Kolom Tanda Tangan Sesuai Word Asli */}
      <div className="mt-8 space-y-6">
        <p className="text-xs text-justify leading-relaxed font-serif indent-0">
          Dengan demikian, Pejabat Penandatangan Kontrak dan Penyedia telah bersepakat untuk menandatangani Kontrak ini pada tanggal tersebut di atas dan melaksanakan Kontrak sesuai dengan ketentuan peraturan perundang-undangan di Republik Indonesia dan dibuat dalam 2 (dua) rangkap, masing-masing dibubuhi dengan meterai, mempunyai kekuatan hukum yang sama dan mengikat bagi para pihak, rangkap yang lain dapat diperbanyak sesuai kebutuhan tanpa dibubuhi meterai.
        </p>

        <table className="w-full text-xs text-center border-none border-collapse font-serif mt-6">
          <tbody>
            {/* Baris 1: Header Atas Nama (Sejajar Atas) */}
            <tr className="align-top border-none">
              <td className="w-1/2 px-4 py-1 border-none">
                <p className="font-serif">Untuk dan atas nama</p>
                <p className="font-bold uppercase mt-0.5">{contract.penyediaNamaBadanUsaha}</p>
              </td>
              <td className="w-1/2 px-4 py-1 border-none">
                <p className="font-serif">Untuk dan atas nama</p>
                <p className="font-bold uppercase mt-0.5">DINAS PUPR KABUPATEN TEGAL</p>
                <p className="text-[11px] font-medium text-slate-800">{(contract.ppkJabatan || 'Pejabat Pembuat Komitmen').replace(/PPKom/g, 'PPK')}</p>
                <p className="text-[11px] font-bold text-slate-900 mt-0.5">Selaku Pejabat Penandatangan Kontrak</p>
              </td>
            </tr>

            {/* Baris 2: Ruang Tanda Tangan & Materai Manual (Kosongan untuk basah & materai fisik) */}
            <tr className="align-middle border-none">
              <td className="w-1/2 px-4 h-28 border-none text-center">
                {/* Ruang kosong tanda tangan & materai manual */}
              </td>
              <td className="w-1/2 px-4 h-28 border-none text-center">
                {/* Ruang kosong tanda tangan manual PPK */}
              </td>
            </tr>

            {/* Baris 3: Nama Pejabat & Direktur (Sejajar Sempurna Secara Horizontal) */}
            <tr className="align-bottom border-none">
              <td className="w-1/2 px-4 py-1 border-none">
                <p className="font-bold underline text-sm tracking-wide">{contract.penyediaNamaDirektur}</p>
                <p className="text-[11px] mt-0.5 font-medium">{contract.penyediaJabatan}</p>
              </td>
              <td className="w-1/2 px-4 py-1 border-none">
                <p className="font-bold underline text-sm tracking-wide">{contract.ppkNama}</p>
                <p className="text-[11px] mt-0.5 font-medium">NIP. {contract.ppkNip}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Kotak Paraf Koordinasi Footer (Pejabat Penandatangan Kontrak & Penyedia) */}
      </div>
    </PrintDocWrapper>
  );
};
