import React from 'react';
import { ProjectContract } from '../../types';
import { formatTanggalIndo } from '../../utils/formatters';
import { PrintDocWrapper } from './PrintDocWrapper';

interface Props {
  contract: ProjectContract;
}

export const LampiranBPrint: React.FC<Props> = ({ contract }) => {
  return (
    <PrintDocWrapper>
      <div className="text-center my-6">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
          LAMPIRAN B SYARAT-SYARAT KHUSUS KONTRAK
        </h2>
        <h3 className="text-sm font-bold uppercase mt-1">
          RENCANA KESELAMATAN KONSTRUKSI (RKK)
        </h3>
        <p className="text-xs font-semibold text-slate-700 mt-1">
          PAKET PEKERJAAN: {contract.namaPaket.toUpperCase()}
        </p>
      </div>

      {/* DAFTAR ISI RKK */}
      <div className="border border-black p-4 mb-6 bg-white">
        <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
          <span className="font-bold uppercase text-[11px]">{contract.penyediaNamaBadanUsaha}</span>
          <span className="font-bold uppercase text-[11px]">RENCANA KESELAMATAN KONSTRUKSI</span>
        </div>

        <h4 className="font-bold text-xs uppercase mb-2">DAFTAR ISI</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
          <div>
            <p className="font-bold">A. Kepemimpinan dan Partisipasi Pekerja dalam Keselamatan Konstruksi</p>
            <p className="pl-3">A.1. Kepedulian pimpinan terhadap Isu eksternal dan internal</p>
            <p className="pl-3">A.2. Komitmen Keselamatan Konstruksi</p>
            <p className="font-bold mt-1">B. Perencanaan Keselamatan Konstruksi</p>
            <p className="pl-3">B.1. Identifikasi bahaya, Penilaian risiko, Pengendalian dan Peluang (IBPRP)</p>
            <p className="pl-3">B.2. Rencana tindakan (sasaran & program khusus)</p>
            <p className="pl-3">B.3. Standar dan peraturan perundangan</p>
          </div>
          <div>
            <p className="font-bold">C. Dukungan Keselamatan Konstruksi</p>
            <p className="pl-3">C.1. Sumber Daya & Kompetensi</p>
            <p className="pl-3">C.2. Kepedulian, Komunikasi & Informasi Terdokumentasi</p>
            <p className="font-bold mt-1">D. Operasi Keselamatan Konstruksi</p>
            <p className="pl-3">D.1. Perencanaan dan Pengendalian Operasi</p>
            <p className="pl-3">D.2. Kesiapan dan tanggapan terhadap kondisi darurat (JSA)</p>
            <p className="font-bold mt-1">E. Evaluasi Kinerja Keselamatan Konstruksi</p>
            <p className="pl-3">E.1. Pemantauan, evaluasi, inspeksi dan audit</p>
            <p className="pl-3">E.2. Peningkatan kinerja keselamatan konstruksi</p>
          </div>
        </div>
      </div>

      {/* PAKTA KOMITMEN KESELAMATAN KONSTRUKSI */}
      <div className="border border-black p-5 mb-6 text-justify">
        <h4 className="font-bold text-center text-xs uppercase mb-3">
          PAKTA KOMITMEN KESELAMATAN KONSTRUKSI
        </h4>
        <p className="mb-2">Saya yang bertanda tangan di bawah ini:</p>
        <table className="w-full text-xs mb-3 font-serif">
          <tbody>
            <tr>
              <td className="w-32 py-0.5 font-bold">Nama</td>
              <td className="w-4 py-0.5">:</td>
              <td className="py-0.5 font-bold">{contract.penyediaNamaDirektur}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Jabatan</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5">{contract.penyediaJabatan}</td>
            </tr>
            <tr>
              <td className="py-0.5 font-bold">Bertindak untuk dan atas nama</td>
              <td className="py-0.5">:</td>
              <td className="py-0.5 font-bold">{contract.penyediaNamaBadanUsaha}</td>
            </tr>
          </tbody>
        </table>

        <p className="mb-2">
          dalam rangka pengadaan <strong>{contract.namaPaket}</strong> pada Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal berkomitmen melaksanakan konstruksi berkeselamatan demi terciptanya <strong>Zero Accident</strong>, dengan memastikan bahwa seluruh pelaksanaan konstruksi:
        </p>
        <ol className="list-decimal pl-5 space-y-0.5 text-[11px] mb-4">
          <li>Memenuhi ketentuan Keselamatan Konstruksi;</li>
          <li>Menggunakan tenaga kerja kompeten bersertifikat;</li>
          <li>Menggunakan peralatan yang memenuhi standar kelaikan;</li>
          <li>Menggunakan material yang memenuhi standar mutu;</li>
          <li>Menggunakan teknologi yang memenuhi standar kelaikan;</li>
          <li>Melaksanakan Standar Operasi dan Prosedur (SOP); dan</li>
          <li>Memenuhi 9 (Sembilan) komponen biaya penerapan SMKK.</li>
        </ol>

        <div className="text-right mt-6 pr-6">
          <p>Slawi, {formatTanggalIndo(contract.tanggal)}</p>
          <p className="font-bold uppercase mt-1">{contract.penyediaNamaBadanUsaha}</p>
          <div className="h-16 flex items-center justify-end">
            <span className="text-[10px] text-slate-400 italic">[Tanda Tangan & Cap]</span>
          </div>
          <p className="font-bold underline text-sm">{contract.penyediaNamaDirektur}</p>
          <p className="text-[11px]">{contract.penyediaJabatan}</p>
        </div>
      </div>

      {/* B.1. IDENTIFIKASI BAHAYA, PENILAIAN RISIKO & PELUANG (IBPRP) */}
      <div className="mb-6">
        <h4 className="font-bold text-xs uppercase mb-1">
          B.1. Identifikasi Bahaya, Penilaian Risiko, Pengendalian dan Peluang (IBPRP)
        </h4>
        <p className="text-[10px] text-slate-600 mb-2">
          Tabel 1. Identifikasi Bahaya, Penilaian Risiko, Penetapan Pengendalian Risiko K3
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[9.5px] border border-black border-collapse text-left font-serif">
            <thead>
              <tr className="bg-white border border-black text-center font-bold">
                <th className="border border-black p-1 w-6" rowSpan={2}>No</th>
                <th className="border border-black p-1" colSpan={3}>Deskripsi Risiko</th>
                <th className="border border-black p-1" rowSpan={2}>Persyaratan Pemenuhan</th>
                <th className="border border-black p-1" rowSpan={2}>Pengendalian Awal</th>
                <th className="border border-black p-1" colSpan={3}>Penilaian Tingkat Risiko</th>
                <th className="border border-black p-1" rowSpan={2}>Pengendalian Lanjutan</th>
                <th className="border border-black p-1" colSpan={3}>Penilaian Sisa Risiko</th>
                <th className="border border-black p-1" rowSpan={2}>Ket</th>
              </tr>
              <tr className="bg-white border border-black text-center font-bold">
                <th className="border border-black p-1">Uraian Pekerjaan</th>
                <th className="border border-black p-1">Identifikasi Bahaya</th>
                <th className="border border-black p-1">Jenis Bahaya</th>
                <th className="border border-black p-1">Kemung kinan (F)</th>
                <th className="border border-black p-1">Kepa rahan (A)</th>
                <th className="border border-black p-1">Tingkat Risiko</th>
                <th className="border border-black p-1">F</th>
                <th className="border border-black p-1">A</th>
                <th className="border border-black p-1">TR</th>
              </tr>
            </thead>
            <tbody>
              {(contract.rkkTabelIBPRP || []).map((ib, i) => (
                <tr key={ib.id || i} className="border border-black align-top">
                  <td className="border border-black p-1 text-center">{i + 1}</td>
                  <td className="border border-black p-1 font-bold">{ib.uraianPekerjaan}</td>
                  <td className="border border-black p-1">{ib.identifikasiBahaya}</td>
                  <td className="border border-black p-1">{ib.jenisBahaya}</td>
                  <td className="border border-black p-1">Permen PUPR No. 10/2021</td>
                  <td className="border border-black p-1">{ib.pengendalianAwal}</td>
                  <td className="border border-black p-1 text-center">3</td>
                  <td className="border border-black p-1 text-center">3</td>
                  <td className="border border-black p-1 text-center font-bold text-amber-700">{ib.tingkatRisiko}</td>
                  <td className="border border-black p-1">{ib.pengendalianLanjutan}</td>
                  <td className="border border-black p-1 text-center">1</td>
                  <td className="border border-black p-1 text-center">2</td>
                  <td className="border border-black p-1 text-center font-bold text-emerald-700">Kecil</td>
                  <td className="border border-black p-1 text-center">N/A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B.2. RENCANA TINDAKAN (SASARAN KHUSUS & PROGRAM KHUSUS) */}
      <div className="mb-6">
        <h4 className="font-bold text-xs uppercase mb-1">
          B.2. Rencana Tindakan (Sasaran Khusus & Program Khusus)
        </h4>
        <table className="w-full text-[9.5px] border border-black border-collapse text-left font-serif">
          <thead>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1 w-6" rowSpan={2}>No</th>
              <th className="border border-black p-1" rowSpan={2}>Pengendalian Risiko</th>
              <th className="border border-black p-1" colSpan={2}>Sasaran</th>
              <th className="border border-black p-1" colSpan={6}>Program</th>
            </tr>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1">Uraian</th>
              <th className="border border-black p-1">Tolok Ukur</th>
              <th className="border border-black p-1">Uraian Kegiatan</th>
              <th className="border border-black p-1">Sumber Daya</th>
              <th className="border border-black p-1">Jadwal</th>
              <th className="border border-black p-1">Bentuk Monitoring</th>
              <th className="border border-black p-1">Indikator</th>
              <th className="border border-black p-1">Penanggung Jawab</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-black align-top">
              <td className="border border-black p-1 text-center">1</td>
              <td className="border border-black p-1">Pemasangan Rambu & APD Lengkap di Area Berbahaya</td>
              <td className="border border-black p-1">Seluruh pekerja menggunakan helm, rompi & sepatu safety</td>
              <td className="border border-black p-1">100% kepatuhan APD harian</td>
              <td className="border border-black p-1">Pengadaan APD SNI dan inspeksi berkala</td>
              <td className="border border-black p-1">Helm, Rompi, Sepatu, Harness</td>
              <td className="border border-black p-1">Harian</td>
              <td className="border border-black p-1">Checklist Inspeksi K3</td>
              <td className="border border-black p-1 font-bold text-emerald-700">Zero Accident</td>
              <td className="border border-black p-1 font-bold">Petugas Keselamatan Konstruksi</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* DUKUNGAN KESELAMATAN KONSTRUKSI (JADWAL KOMUNIKASI) */}
      <div className="mb-6">
        <h4 className="font-bold text-xs uppercase mb-1">
          Dukungan Keselamatan Konstruksi — Jadwal Program Komunikasi
        </h4>
        <table className="w-full text-[10px] border border-black border-collapse text-left font-serif">
          <thead>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5">Jenis Komunikasi K3</th>
              <th className="border border-black p-1.5">Penanggung Jawab (PIC)</th>
              <th className="border border-black p-1.5">Waktu Pelaksanaan</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-black">
              <td className="border border-black p-1.5 text-center">1</td>
              <td className="border border-black p-1.5 font-bold">Induksi Keselamatan Konstruksi (Safety Induction)</td>
              <td className="border border-black p-1.5">Petugas K3 Konstruksi</td>
              <td className="border border-black p-1.5">Setiap pekerja baru / tamu yang masuk proyek</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1.5 text-center">2</td>
              <td className="border border-black p-1.5 font-bold">Pertemuan Pagi Hari (Safety Morning Talk)</td>
              <td className="border border-black p-1.5">Pelaksana Lapangan & K3</td>
              <td className="border border-black p-1.5">Setiap hari Senin pagi sebelum kerja dimulai</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1.5 text-center">3</td>
              <td className="border border-black p-1.5 font-bold">Pertemuan Kelompok Kerja (Toolbox Meeting)</td>
              <td className="border border-black p-1.5">Mandor / Kepala Tukang</td>
              <td className="border border-black p-1.5">Setiap sebelum mulai tahapan kerja berisiko tinggi</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1.5 text-center">4</td>
              <td className="border border-black p-1.5 font-bold">Rapat Keselamatan Konstruksi (Construction Safety Meeting)</td>
              <td className="border border-black p-1.5">Direksi Penyedia & Konsultan Pengawas</td>
              <td className="border border-black p-1.5">1 (satu) kali setiap bulan bersama PPK</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* OPERASI KESELAMATAN KONSTRUKSI (JSA & APD) */}
      <div className="mb-6">
        <h4 className="font-bold text-xs uppercase mb-1">
          Operasi Keselamatan Konstruksi — Analisis Keselamatan Pekerjaan (Job Safety Analysis / JSA)
        </h4>
        <div className="border border-black p-3 bg-white mb-2 text-[10px]">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>Nama Paket Pekerjaan: <strong>{contract.namaPaket}</strong></div>
            <div>Tanggal Pekerjaan: {formatTanggalIndo(contract.tanggal)} s/d Selesai</div>
          </div>
          <div className="font-bold mb-1">Alat Pelindung Diri (APD) yang Dipersyaratkan Wajib:</div>
          <div className="grid grid-cols-3 gap-2">
            <div>☑ 1. Helm Keselamatan (Safety Helmet)</div>
            <div>☑ 2. Sepatu Keselamatan (Safety Shoes)</div>
            <div>☑ 3. Sarung Tangan (Safety Gloves)</div>
            <div>☑ 4. Rompi Keselamatan (Safety Vest)</div>
            <div>☑ 5. Masker Pernafasan (Respiratory Mask)</div>
            <div>☑ 6. Tali Keselamatan (Full Body Harness)</div>
          </div>
        </div>

        <table className="w-full text-[10px] border border-black border-collapse text-left font-serif">
          <thead>
            <tr className="bg-white border border-black text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5">Urutan Langkah Pekerjaan</th>
              <th className="border border-black p-1.5">Identifikasi Bahaya</th>
              <th className="border border-black p-1.5">Pengendalian yang Diperlukan</th>
              <th className="border border-black p-1.5">Penanggung Jawab</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-black align-top">
              <td className="border border-black p-1.5 text-center">1</td>
              <td className="border border-black p-1.5 font-bold">Pekerjaan Pembongkaran & Galian Pondasi</td>
              <td className="border border-black p-1.5">Dinding tanah galian runtuh, terpeleset ke lubang pondasi</td>
              <td className="border border-black p-1.5">Pemasangan turap cerucuk penahan tanah, barikade batas lubang, pemakaian safety boots & helm</td>
              <td className="border border-black p-1.5 font-bold">Pelaksana Lapangan</td>
            </tr>
            <tr className="border border-black align-top">
              <td className="border border-black p-1.5 text-center">2</td>
              <td className="border border-black p-1.5 font-bold">Pemasangan Perancah Scaffolding & Cor Lantai Atas</td>
              <td className="border border-black p-1.5">Perancah miring/ambles, jatuh dari ketinggian, tertimpa adukan semen</td>
              <td className="border border-black p-1.5">Landasan perancah papan kayu tebal, pasang safety net di sekeliling lantai, wajib full body harness</td>
              <td className="border border-black p-1.5 font-bold">Petugas K3 Konstruksi</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* EVALUASI KESELAMATAN KONSTRUKSI (JADWAL INSPEKSI & AUDIT) */}
      <div>
        <h4 className="font-bold text-xs uppercase mb-1">
          E.1. Pemantauan dan Evaluasi — Jadwal Inspeksi dan Audit
        </h4>
        <table className="w-full text-[9px] border border-black border-collapse text-center font-serif">
          <thead>
            <tr className="bg-white border border-black font-bold">
              <th className="border border-black p-1 w-6" rowSpan={2}>No</th>
              <th className="border border-black p-1 text-left" rowSpan={2}>Kegiatan</th>
              <th className="border border-black p-1" rowSpan={2}>PIC</th>
              <th className="border border-black p-1" colSpan={12}>Bulan Ke-</th>
            </tr>
            <tr className="bg-white border border-black font-bold">
              <th className="border border-black p-0.5">1</th>
              <th className="border border-black p-0.5">2</th>
              <th className="border border-black p-0.5">3</th>
              <th className="border border-black p-0.5">4</th>
              <th className="border border-black p-0.5">5</th>
              <th className="border border-black p-0.5">6</th>
              <th className="border border-black p-0.5">7</th>
              <th className="border border-black p-0.5">8</th>
              <th className="border border-black p-0.5">9</th>
              <th className="border border-black p-0.5">10</th>
              <th className="border border-black p-0.5">11</th>
              <th className="border border-black p-0.5">12</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-black">
              <td className="border border-black p-1">1</td>
              <td className="border border-black p-1 text-left font-bold">Inspeksi Keselamatan Konstruksi Harian/Mingguan</td>
              <td className="border border-black p-1">Petugas K3</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1">2</td>
              <td className="border border-black p-1 text-left font-bold">Patroli Keselamatan Konstruksi Terpadu</td>
              <td className="border border-black p-1">Tim K3 & Pengawas</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">✓</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1">3</td>
              <td className="border border-black p-1 text-left font-bold">Audit Internal SMKK</td>
              <td className="border border-black p-1">Auditor K3 Dinas/Penyedia</td>
              <td className="border border-black p-0.5">-</td>
              <td className="border border-black p-0.5">-</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">-</td>
              <td className="border border-black p-0.5">-</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">-</td>
              <td className="border border-black p-0.5">-</td>
              <td className="border border-black p-0.5">✓</td>
              <td className="border border-black p-0.5">-</td>
              <td className="border border-black p-0.5">-</td>
              <td className="border border-black p-0.5">✓</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PrintDocWrapper>
  );
};

