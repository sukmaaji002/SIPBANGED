import React from 'react';
import { SpkContract } from '../../types';
import { KopSurat } from '../common/KopSurat';
import { PrintDocWrapper } from './PrintDocWrapper';
import { FormattedLegalText } from '../common/FormattedLegalText';
import { formatTanggalIndo, formatRupiah } from '../../utils/formatters';

interface SpkPrintViewProps {
  spk: SpkContract;
}

export const SpkPrintView: React.FC<SpkPrintViewProps> = ({ spk }) => {
  const tanggalSpkFormatted = spk.tanggalSpk ? formatTanggalIndo(spk.tanggalSpk) : '-';
  const tanggalSppbjFormatted = spk.tanggalSppbj ? formatTanggalIndo(spk.tanggalSppbj) : '-';
  const tanggalMulaiFormatted = spk.tanggalMulai ? formatTanggalIndo(spk.tanggalMulai) : '-';
  const tanggalSelesaiFormatted = spk.tanggalSelesai ? formatTanggalIndo(spk.tanggalSelesai) : '-';

  const jenisSpkJudul = 
    spk.spkType === 'fisik' 
      ? 'PEKERJAAN KONSTRUKSI (FISIK)' 
      : spk.spkType === 'pengawas'
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
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">3. Nilai SPK (Termasuk PPN 11%)</td>
              <td className="border border-slate-900 p-2">
                <span className="font-bold text-sm text-slate-900">{formatRupiah(spk.nilaiKontrak)}</span><br/>
                <span className="italic">({spk.nilaiKontrakTerbilang})</span>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">4. Sumber Dana / Rekening</td>
              <td className="border border-slate-900 p-2">
                {spk.sumberDana} Tahun Anggaran {spk.tahunAnggaran}<br/>
                Kode Akun: {spk.kodeRekeningKegiatan || '-'}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">5. Jangka Waktu Pelaksanaan</td>
              <td className="border border-slate-900 p-2">
                <strong>{spk.jangkaWaktuHari} ({spk.jangkaWaktuHuruf || '-'})</strong> hari kalender<br/>
                Terhitung sejak {tanggalMulaiFormatted} s.d. {tanggalSelesaiFormatted}
              </td>
            </tr>
            {spk.spkType === 'fisik' && (
              <tr>
                <td className="border border-slate-900 p-2 font-bold bg-slate-100">6. Masa Pemeliharaan</td>
                <td className="border border-slate-900 p-2">
                  <strong>{spk.masaPemeliharaanHari || 180} ({spk.masaPemeliharaanHuruf || 'Seratus Delapan Puluh'})</strong> hari kalender terhitung sejak PHO
                </td>
              </tr>
            )}
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">{spk.spkType === 'fisik' ? '7' : '6'}. Cara Pembayaran</td>
              <td className="border border-slate-900 p-2">
                <strong>{spk.sistemPembayaran}</strong><br/>
                <span className="text-[10px] text-slate-600">{spk.keteranganPembayaran}</span>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-100">{spk.spkType === 'fisik' ? '8' : '7'}. Denda Keterlambatan</td>
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

        {/* Output Hasil Pekerjaan (Khusus Pengawas & Perencana) */}
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

        {/* Penutup & Tanda Tangan (Anti-Potong Halaman) */}
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

