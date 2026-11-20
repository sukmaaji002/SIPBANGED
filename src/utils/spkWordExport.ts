import { SpkContract } from '../types';
import { formatTanggalIndo, formatRupiah } from './formatters';
import { LOGO_KAB_TEGAL_BASE64 } from './logoBase64';
import { parseRichTextToHtml } from './richText';

export function generateSpkWordDoc(spk: SpkContract): void {
  const tanggalSpkFormatted = spk.tanggalSpk ? formatTanggalIndo(spk.tanggalSpk) : '-';
  const tanggalSppbjFormatted = spk.tanggalSppbj ? formatTanggalIndo(spk.tanggalSppbj) : '-';
  const tanggalMulaiFormatted = spk.tanggalMulai ? formatTanggalIndo(spk.tanggalMulai) : '-';
  const tanggalSelesaiFormatted = spk.tanggalSelesai ? formatTanggalIndo(spk.tanggalSelesai) : '-';

  const jenisSpkJudul = 
    spk.spkType === 'fisik' 
      ? 'SURAT PERINTAH KERJA (SPK)<br/>PEKERJAAN KONSTRUKSI' 
      : spk.spkType === 'pengawas'
        ? 'SURAT PERINTAH KERJA (SPK)<br/>JASA KONSULTANSI PENGAWASAN TEKNIS'
        : 'SURAT PERINTAH KERJA (SPK)<br/>JASA KONSULTANSI PERENCANAAN TEKNIS (DED)';

  const jenisSpkKategori =
    spk.spkType === 'fisik'
      ? 'Pekerjaan Konstruksi'
      : spk.spkType === 'pengawas'
        ? 'Jasa Konsultansi Pengawasan'
        : 'Jasa Konsultansi Perencanaan';

  // Build Lingkup HTML
  const lingkupHtml = (spk.ruangLingkup || []).map((item, idx) => `
    <tr>
      <td style="width: 25pt; vertical-align: top; text-align: center; font-size: 10pt; padding: 2pt 4pt; border: 1px solid #000;">${idx + 1}.</td>
      <td style="vertical-align: top; font-size: 10pt; padding: 2pt 6pt; border: 1px solid #000;">${item}</td>
    </tr>
  `).join('');

  // Build Personel HTML
  const personelHtml = (spk.personelList || []).map((p, idx) => `
    <tr>
      <td style="width: 25pt; text-align: center; font-size: 10pt; padding: 2pt 4pt; border: 1px solid #000;">${idx + 1}.</td>
      <td style="font-size: 10pt; font-weight: bold; padding: 2pt 6pt; border: 1px solid #000;">${p.nama}</td>
      <td style="font-size: 10pt; padding: 2pt 6pt; border: 1px solid #000;">${p.posisi}</td>
      <td style="font-size: 10pt; padding: 2pt 6pt; border: 1px solid #000;">${p.kualifikasi}</td>
    </tr>
  `).join('');

  // Build Clauses HTML
  const clausesHtml = (spk.clauses || []).filter(c => c.isActive).map(c => `
    <div style="margin-top: 10pt; margin-bottom: 8pt;">
      <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin: 0 0 3pt 0; font-size: 10.5pt;">
        Pasal ${c.pasal}<br/>${c.judul}
      </p>
      <div style="text-align: justify; font-size: 10pt; line-height: 1.4;">
        ${parseRichTextToHtml(c.isi).replace(/\n/g, '<br/>')}
      </div>
    </div>
  `).join('');

  // Build Outputs HTML (for Pengawas & Perencana)
  let keluaranHtml = '';
  if (spk.keluaranHasil && spk.keluaranHasil.length > 0) {
    keluaranHtml = `
      <div style="margin-top: 12pt; margin-bottom: 8pt;">
        <p style="font-weight: bold; font-size: 10.5pt; margin-bottom: 4pt;">Dokumen / Laporan Hasil Pekerjaan yang Diserahkan:</p>
        <ol style="margin-top: 0; padding-left: 20pt; font-size: 10pt; line-height: 1.4;">
          ${spk.keluaranHasil.map(k => `<li>${k}</li>`).join('')}
        </ol>
      </div>
    `;
  }

  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>SPK - ${spk.namaPaket}</title>
  <style>
    @page Section1 {
      size: 21.0cm 29.7cm;
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-page-orientation: portrait;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10.5pt;
      line-height: 1.35;
      color: #000;
    }
    p { margin: 0 0 4pt 0; text-align: justify; }
    table { border-collapse: collapse; width: 100%; }
    .text-center { text-align: center; }
    .text-justify { text-align: justify; }
    .font-bold { font-weight: bold; }
  </style>
</head>
<body>
<div class="Section1">
  
  <!-- Kop Surat DPUPR Kab. Tegal -->
  <table style="width: 100%; border-bottom: 3px double #000; padding-bottom: 4pt; margin-bottom: 12pt;">
    <tr>
      <td style="width: 75pt; text-align: center; vertical-align: middle;">
        <img src="${LOGO_KAB_TEGAL_BASE64}" width="70" height="85" alt="Logo Kab Tegal" />
      </td>
      <td style="text-align: center; vertical-align: middle;">
        <p style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KABUPATEN TEGAL</p>
        <p style="margin: 0; font-size: 15pt; font-weight: bold; text-transform: uppercase;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG</p>
        <p style="margin: 1pt 0 0 0; font-size: 9pt;">Jl. Cut Nyak Dien No. 13 Kalisapu - Slawi, Kabupaten Tegal Kode Pos 52416</p>
        <p style="margin: 0; font-size: 9pt;">Telepon (0283) 491628, Fax (0283) 491628 | Email: dpupr@tegalkab.go.id</p>
      </td>
    </tr>
  </table>

  <!-- Judul Dokumen SPK -->
  <div style="text-align: center; margin-top: 10pt; margin-bottom: 12pt;">
    <p style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0; text-decoration: underline;">
      ${jenisSpkJudul}
    </p>
    <p style="font-size: 10.5pt; font-weight: bold; margin: 2pt 0 0 0;">
      Nomor : ${spk.nomorSpk}
    </p>
  </div>

  <p>
    Pada hari ini <strong>${spk.hariSpk || 'Senin'}</strong> tanggal <strong>${spk.tanggalTeksSpk || 'satu'}</strong> bulan <strong>${spk.bulanTeksSpk || 'Maret'}</strong> tahun <strong>${spk.tahunSpk || 2026}</strong> (<strong>${tanggalSpkFormatted}</strong>), bertempat di Slawi, berdasarkan Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) Nomor: <strong>${spk.nomorSppbj || '-'}</strong> tanggal <strong>${tanggalSppbjFormatted}</strong>, yang bertanda tangan di bawah ini:
  </p>

  <!-- Pihak I & II Box Table -->
  <table style="width: 100%; border: 1px solid #000; margin: 8pt 0 12pt 0;">
    <tr>
      <td style="width: 50%; vertical-align: top; padding: 6pt 8pt; border-right: 1px solid #000; background-color: #fafafa;">
        <p style="font-weight: bold; font-size: 10.5pt; text-align: center; text-decoration: underline; margin-bottom: 4pt;">
          PIHAK PERTAMA (PPK)
        </p>
        <table style="width: 100%; font-size: 10pt;">
          <tr>
            <td style="width: 75pt; font-weight: bold;">Nama</td>
            <td style="width: 10pt;">:</td>
            <td style="font-weight: bold;">${spk.ppkNama}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">NIP</td>
            <td>:</td>
            <td>${spk.ppkNip}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Jabatan</td>
            <td>:</td>
            <td>${spk.ppkJabatan}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Alamat</td>
            <td>:</td>
            <td>${spk.ppkAlamat}</td>
          </tr>
        </table>
        <p style="font-size: 9.5pt; margin-top: 4pt; font-style: italic;">
          Bertindak untuk dan atas nama Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal, selanjutnya disebut <strong>PIHAK PERTAMA</strong>.
        </p>
      </td>
      
      <td style="width: 50%; vertical-align: top; padding: 6pt 8pt; background-color: #fafafa;">
        <p style="font-weight: bold; font-size: 10.5pt; text-align: center; text-decoration: underline; margin-bottom: 4pt;">
          PIHAK KEDUA (PENYEDIA/KONSULTAN)
        </p>
        <table style="width: 100%; font-size: 10pt;">
          <tr>
            <td style="width: 75pt; font-weight: bold;">Nama</td>
            <td style="width: 10pt;">:</td>
            <td style="font-weight: bold;">${spk.penyediaNamaPimpinan}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Jabatan</td>
            <td>:</td>
            <td>${spk.penyediaJabatanPimpinan}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Badan Usaha</td>
            <td>:</td>
            <td style="font-weight: bold;">${spk.penyediaNamaBadanUsaha}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Alamat</td>
            <td>:</td>
            <td>${spk.penyediaAlamat}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">NPWP</td>
            <td>:</td>
            <td>${spk.penyediaNpwp}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Bank / Rek</td>
            <td>:</td>
            <td>${spk.penyediaBank} - Rek. ${spk.penyediaNomorRekening}</td>
          </tr>
        </table>
        <p style="font-size: 9.5pt; margin-top: 4pt; font-style: italic;">
          Bertindak untuk dan atas nama ${spk.penyediaNamaBadanUsaha}, selanjutnya disebut <strong>PIHAK KEDUA</strong>.
        </p>
      </td>
    </tr>
  </table>

  <!-- Ketentuan Pokok Perjanjian -->
  <p>
    PIHAK PERTAMA memerintahkan PIHAK KEDUA dan PIHAK KEDUA menyepakati untuk melaksanakan pekerjaan sebagaimana diatur dalam rincian SPK berikut:
  </p>

  <table style="width: 100%; border: 1px solid #000; margin: 6pt 0 12pt 0; font-size: 10pt;">
    <tr>
      <td style="width: 32%; padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">1. Nama Paket Pekerjaan</td>
      <td style="width: 68%; padding: 4pt 6pt; border: 1px solid #000; font-weight: bold;">${spk.namaPaket}</td>
    </tr>
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">2. Lokasi Pekerjaan</td>
      <td style="padding: 4pt 6pt; border: 1px solid #000;">${spk.lokasiPekerjaan}</td>
    </tr>
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">3. Nilai SPK (Termasuk PPN)</td>
      <td style="padding: 4pt 6pt; border: 1px solid #000;">
        <strong>${formatRupiah(spk.nilaiKontrak)}</strong><br/>
        <em>(${spk.nilaiKontrakTerbilang})</em>
      </td>
    </tr>
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">4. Sumber Dana / Rekening</td>
      <td style="padding: 4pt 6pt; border: 1px solid #000;">
        ${spk.sumberDana} Tahun Anggaran ${spk.tahunAnggaran}<br/>
        Kode Akun: ${spk.kodeRekeningKegiatan || '-'}
      </td>
    </tr>
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">5. Jangka Waktu Pelaksanaan</td>
      <td style="padding: 4pt 6pt; border: 1px solid #000;">
        <strong>${spk.jangkaWaktuHari} (${spk.jangkaWaktuHuruf || '-'})</strong> hari kalender<br/>
        Terhitung sejak ${tanggalMulaiFormatted} sampai dengan ${tanggalSelesaiFormatted}
      </td>
    </tr>
    ${spk.spkType === 'fisik' ? `
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">6. Masa Pemeliharaan</td>
      <td style="padding: 4pt 6pt; border: 1px solid #000;">
        <strong>${spk.masaPemeliharaanHari || 180} (${spk.masaPemeliharaanHuruf || 'Seratus Delapan Puluh'})</strong> hari kalender terhitung sejak PHO
      </td>
    </tr>
    ` : ''}
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">${spk.spkType === 'fisik' ? '7' : '6'}. Cara Pembayaran</td>
      <td style="padding: 4pt 6pt; border: 1px solid #000;">
        <strong>${spk.sistemPembayaran}</strong><br/>
        <span style="font-size: 9.5pt;">${spk.keteranganPembayaran}</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">${spk.spkType === 'fisik' ? '8' : '7'}. Denda Keterlambatan</td>
      <td style="padding: 4pt 6pt; border: 1px solid #000;">${spk.dendaKeterlambatan}</td>
    </tr>
  </table>

  <!-- Ruang Lingkup -->
  <div style="margin-top: 10pt; margin-bottom: 6pt;">
    <p style="font-weight: bold; font-size: 10.5pt; margin-bottom: 4pt;">Ruang Lingkup Pekerjaan / Layanan:</p>
    <table style="width: 100%; border: 1px solid #000;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="width: 25pt; padding: 3pt; border: 1px solid #000; font-size: 10pt;">No</th>
          <th style="padding: 3pt 6pt; border: 1px solid #000; font-size: 10pt; text-align: left;">Uraian Ruang Lingkup</th>
        </tr>
      </thead>
      <tbody>
        ${lingkupHtml}
      </tbody>
    </table>
  </div>

  <!-- Personel -->
  <div style="margin-top: 10pt; margin-bottom: 6pt;">
    <p style="font-weight: bold; font-size: 10.5pt; margin-bottom: 4pt;">Daftar Personel / Tenaga Ahli:</p>
    <table style="width: 100%; border: 1px solid #000;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="width: 25pt; padding: 3pt; border: 1px solid #000; font-size: 10pt;">No</th>
          <th style="padding: 3pt 6pt; border: 1px solid #000; font-size: 10pt; text-align: left;">Nama Personel</th>
          <th style="padding: 3pt 6pt; border: 1px solid #000; font-size: 10pt; text-align: left;">Posisi Penugasan</th>
          <th style="padding: 3pt 6pt; border: 1px solid #000; font-size: 10pt; text-align: left;">Kualifikasi & Sertifikat</th>
        </tr>
      </thead>
      <tbody>
        ${personelHtml}
      </tbody>
    </table>
  </div>

  ${keluaranHtml}

  <!-- Page Break for Syarat-Syarat SPK -->
  <div style="page-break-before: always; margin-top: 14pt;"></div>

  <!-- Heading Syarat-Syarat SPK -->
  <div style="text-align: center; margin-bottom: 12pt;">
    <p style="font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; text-decoration: underline;">
      SYARAT-SYARAT UMUM SURAT PERINTAH KERJA (SPK)
    </p>
    <p style="font-size: 9.5pt; color: #555; margin-top: 2pt;">
      Standar LKPP Perlem No. 12 Tahun 2021 & DPUPR Kabupaten Tegal
    </p>
  </div>

  <!-- Klausul-Klausul -->
  ${clausesHtml}

  <!-- Penutup & Tanda Tangan -->
  <div style="margin-top: 18pt;">
    <p>
      Demikian Surat Perintah Kerja (SPK) ini dibuat dan ditandatangani oleh Para Pihak dengan penuh tanggung jawab dalam 2 (dua) rangkap asli bermaterai cukup dan memiliki kekuatan hukum yang sama.
    </p>
  </div>

  <table style="width: 100%; margin-top: 20pt; text-align: center;">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <p style="font-weight: bold; margin: 0;">Untuk dan atas nama</p>
        <p style="font-weight: bold; margin: 0 0 45pt 0;">${spk.penyediaNamaBadanUsaha}</p>
        <div style="border: 1px dashed #999; width: 65pt; margin: 0 auto 5pt auto; padding: 2pt; font-size: 7.5pt; color: #666;">
          MATERAI<br/>Rp 10.000,-
        </div>
        <p style="font-weight: bold; text-decoration: underline; margin: 0;">${spk.penyediaNamaPimpinan}</p>
        <p style="margin: 0; font-size: 9.5pt;">${spk.penyediaJabatanPimpinan}</p>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <p style="font-weight: bold; margin: 0;">Untuk dan atas nama</p>
        <p style="font-weight: bold; margin: 0 0 45pt 0;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG<br/>KABUPATEN TEGAL</p>
        <div style="border: 1px dashed #999; width: 65pt; margin: 0 auto 5pt auto; padding: 2pt; font-size: 7.5pt; color: #666;">
          MATERAI<br/>Rp 10.000,-
        </div>
        <p style="font-weight: bold; text-decoration: underline; margin: 0;">${spk.ppkNama}</p>
        <p style="margin: 0; font-size: 9.5pt;">NIP. ${spk.ppkNip}</p>
      </td>
    </tr>
  </table>

</div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SPK_${spk.spkType.toUpperCase()}_${spk.namaPaket.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

