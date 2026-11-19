import React from 'react';
import { ProjectContract } from '../../types';
import { PrintDocWrapper } from './PrintDocWrapper';

interface Props {
  contract: ProjectContract;
}

export const LampiranAPrint: React.FC<Props> = ({ contract }) => {
  return (
    <PrintDocWrapper>
      <div className="text-center my-6">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
          LAMPIRAN A SYARAT-SYARAT KHUSUS KONTRAK
        </h2>
        <p className="text-xs font-semibold text-slate-700 mt-1">
          PAKET PEKERJAAN: {contract.namaPaket.toUpperCase()}
        </p>
      </div>

      {/* 1. DAFTAR HARGA SATUAN TIMPANG */}
      <div className="mb-6">
        <h3 className="font-bold text-xs uppercase mb-2">
          DAFTAR HARGA SATUAN TIMPANG*)
        </h3>
        <table className="w-full text-[10px] border border-black border-collapse text-left font-serif">
          <thead>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5">Mata Pembayaran</th>
              <th className="border border-black p-1.5">Satuan Ukuran</th>
              <th className="border border-black p-1.5">Kuantitas</th>
              <th className="border border-black p-1.5">Harga Satuan HPS (Rp)</th>
              <th className="border border-black p-1.5">Harga Satuan Penawaran (Rp)</th>
              <th className="border border-black p-1.5">% Terhadap HPS</th>
              <th className="border border-black p-1.5">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {(contract.hargaSatuanTimpang && contract.hargaSatuanTimpang.length > 0) ? (
              contract.hargaSatuanTimpang.map((h, i) => (
                <tr key={h.id || i} className="border border-black text-center">
                  <td className="border border-black p-1.5">{i + 1}</td>
                  <td className="border border-black p-1.5 font-medium">{h.mataPembayaran}</td>
                  <td className="border border-black p-1.5">{h.satuanUkuran}</td>
                  <td className="border border-black p-1.5">{h.kuantitas}</td>
                  <td className="border border-black p-1.5">{h.hpsRp ? h.hpsRp.toLocaleString('id-ID') : 'Tidak Ada'}</td>
                  <td className="border border-black p-1.5">{h.penawaranRp ? h.penawaranRp.toLocaleString('id-ID') : 'Tidak Ada'}</td>
                  <td className="border border-black p-1.5">{h.persenTerhadapHps}</td>
                  <td className="border border-black p-1.5">{h.keterangan}</td>
                </tr>
              ))
            ) : (
              <tr className="border border-black text-center">
                <td className="border border-black p-1.5">1</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 2. DAFTAR PEKERJAAN YANG DISUBKONTRAKKAN DAN SUBKONTRAKTOR */}
      <div className="mb-6">
        <h3 className="font-bold text-xs uppercase mb-1">
          DAFTAR PEKERJAAN YANG DISUBKONTRAKKAN DAN SUBKONTRAKTOR (apabila ada)
        </h3>
        
        <p className="font-bold text-[11px] mt-2 mb-1">Pekerjaan Utama</p>
        <table className="w-full text-[10px] border border-black border-collapse text-left font-serif mb-3">
          <thead>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5">Bagian Pekerjaan yang Disubkontrakkan</th>
              <th className="border border-black p-1.5">Nama Subkontraktor</th>
              <th className="border border-black p-1.5">Alamat Subkontraktor</th>
              <th className="border border-black p-1.5">Kualifikasi Subkontraktor</th>
              <th className="border border-black p-1.5">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {(contract.subkontraktorUtama && contract.subkontraktorUtama.length > 0) ? (
              contract.subkontraktorUtama.map((sub, i) => (
                <tr key={sub.id || i} className="border border-black text-center">
                  <td className="border border-black p-1.5">{i + 1}</td>
                  <td className="border border-black p-1.5">{sub.bagianPekerjaan}</td>
                  <td className="border border-black p-1.5 font-bold">{sub.namaSubkon}</td>
                  <td className="border border-black p-1.5">{sub.alamatSubkon}</td>
                  <td className="border border-black p-1.5">{sub.kualifikasiSubkon}</td>
                  <td className="border border-black p-1.5">{sub.keterangan}</td>
                </tr>
              ))
            ) : (
              <tr className="border border-black text-center">
                <td className="border border-black p-1.5">1</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
              </tr>
            )}
          </tbody>
        </table>

        <p className="font-bold text-[11px] mt-2 mb-1">Pekerjaan bukan Pekerjaan Utama</p>
        <table className="w-full text-[10px] border border-black border-collapse text-left font-serif">
          <thead>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5">Bagian Pekerjaan yang Disubkontrakkan</th>
              <th className="border border-black p-1.5">Nama Subkontraktor</th>
              <th className="border border-black p-1.5">Alamat Subkontraktor</th>
              <th className="border border-black p-1.5">Kualifikasi Subkontraktor</th>
              <th className="border border-black p-1.5">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {(contract.subkontraktorNonUtama && contract.subkontraktorNonUtama.length > 0) ? (
              contract.subkontraktorNonUtama.map((sub, i) => (
                <tr key={sub.id || i} className="border border-black text-center">
                  <td className="border border-black p-1.5">{i + 1}</td>
                  <td className="border border-black p-1.5">{sub.bagianPekerjaan}</td>
                  <td className="border border-black p-1.5 font-bold">{sub.namaSubkon}</td>
                  <td className="border border-black p-1.5">{sub.alamatSubkon}</td>
                  <td className="border border-black p-1.5">{sub.kualifikasiSubkon}</td>
                  <td className="border border-black p-1.5">{sub.keterangan}</td>
                </tr>
              ))
            ) : (
              <tr className="border border-black text-center">
                <td className="border border-black p-1.5">1</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
                <td className="border border-black p-1.5">Tidak Ada</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. DAFTAR PERSONEL MANAJERIAL */}
      <div className="mb-6">
        <h3 className="font-bold text-xs uppercase mb-2">
          DAFTAR PERSONEL MANAJERIAL
        </h3>
        <table className="w-full text-[10px] border border-black border-collapse text-left font-serif">
          <thead>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5">Nama Personel Manajerial</th>
              <th className="border border-black p-1.5">Jabatan dalam Pekerjaan ini</th>
              <th className="border border-black p-1.5">Tingkat Pendidikan / Ijazah</th>
              <th className="border border-black p-1.5">Pengalaman Kerja (Tahun)</th>
              <th className="border border-black p-1.5">Sertifikat Kompetensi Kerja</th>
              <th className="border border-black p-1.5">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {(contract.personelManajerial || []).map((p, i) => (
              <tr key={p.id || i} className="border border-black">
                <td className="border border-black p-1.5 text-center">{i + 1}</td>
                <td className="border border-black p-1.5 font-bold uppercase">{p.nama}</td>
                <td className="border border-black p-1.5">{p.jabatan}</td>
                <td className="border border-black p-1.5 text-center">{p.pendidikan}</td>
                <td className="border border-black p-1.5 text-center">{p.pengalamanTahun}</td>
                <td className="border border-black p-1.5">{p.sertifikatKompetensi}</td>
                <td className="border border-black p-1.5 text-center">{p.keterangan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. DAFTAR PERALATAN UTAMA */}
      <div>
        <h3 className="font-bold text-xs uppercase mb-2">
          DAFTAR PERALATAN UTAMA
        </h3>
        <table className="w-full text-[10px] border border-black border-collapse text-left font-serif">
          <thead>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5">Nama Peralatan Utama</th>
              <th className="border border-black p-1.5">Merek dan Tipe</th>
              <th className="border border-black p-1.5">Kapasitas</th>
              <th className="border border-black p-1.5">Jumlah</th>
              <th className="border border-black p-1.5">Kondisi</th>
              <th className="border border-black p-1.5">Status Kepemilikan</th>
              <th className="border border-black p-1.5">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {(contract.peralatanUtama || []).map((a, i) => (
              <tr key={a.id || i} className="border border-black">
                <td className="border border-black p-1.5 text-center">{i + 1}</td>
                <td className="border border-black p-1.5 font-bold">{a.nama}</td>
                <td className="border border-black p-1.5">{a.merekTipe}</td>
                <td className="border border-black p-1.5">{a.kapasitas}</td>
                <td className="border border-black p-1.5 text-center">{a.jumlah}</td>
                <td className="border border-black p-1.5 text-center">{a.kondisi}</td>
                <td className="border border-black p-1.5">{a.statusKepemilikan}</td>
                <td className="border border-black p-1.5 text-center">{a.keterangan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrintDocWrapper>
  );
};
