import { SpkContract } from '../types';
import { formatTanggalIndo, formatRupiah } from './formatters';
import { LOGO_KAB_TEGAL_BASE64 } from './logoBase64';
import { parseRichTextToHtml } from './richText';

function formatCustomClauseForWord(rawText: string): string {
  if (!rawText) return '';
  const lines = rawText.split('\n');
  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '<div style="height: 3pt;"></div>';

    const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0;

    // 1. Roman numerals: i., ii., iii., iv., v. (gambar 2)
    // Aligns with first letter of 1) / 2) -> margin-left 92pt, text-indent -18pt (marker at 74pt)
    const romanMatch = trimmed.match(/^(i{1,3}|iv|v|vi{0,3}|ix|x)\.\s+(.*)$/i);
    if (romanMatch) {
      return `<p style="margin: 0 0 3pt 92pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${romanMatch[1].toLowerCase()}.&nbsp;&nbsp;${parseRichTextToHtml(romanMatch[2])}</p>`;
    }

    // 2. Bullet points: •, -, * (gambar 1)
    // Aligns bullet with first letter of letter item a., b., c. -> margin-left 52pt, text-indent -14pt (bullet at 38pt)
    const bulletMatch = trimmed.match(/^([•\-\*])\s+(.*)$/);
    if (bulletMatch) {
      return `<p style="margin: 0 0 3pt 52pt; text-indent: -14pt; font-size: 10pt; line-height: 1.35; text-align: justify;">&bull;&nbsp;&nbsp;${parseRichTextToHtml(bulletMatch[2])}</p>`;
    }

    // 3. Sub-paren like 1), 2), a), b)
    const parenMatch = trimmed.match(/^(\d+|[a-zA-Z])\)\s+(.*)$/);
    if (parenMatch) {
      const marginPt = leadingSpaces >= 6 ? 74 : 56;
      return `<p style="margin: 0 0 3pt ${marginPt}pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${parenMatch[1]})&nbsp;&nbsp;${parseRichTextToHtml(parenMatch[2])}</p>`;
    }

    // 4. (1), (a)
    const fullParenMatch = trimmed.match(/^\(([a-zA-Z0-9]+)\)\s+(.*)$/);
    if (fullParenMatch) {
      const marginPt = leadingSpaces >= 6 ? 74 : 56;
      return `<p style="margin: 0 0 3pt ${marginPt}pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">(${fullParenMatch[1]})&nbsp;&nbsp;${parseRichTextToHtml(fullParenMatch[2])}</p>`;
    }

    // 5. Letter with dot like a., b., c.
    const letterDotMatch = trimmed.match(/^([a-zA-Z])\.\s+(.*)$/);
    if (letterDotMatch) {
      const marginPt = leadingSpaces >= 2 ? 56 : 38;
      return `<p style="margin: 0 0 3pt ${marginPt}pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${letterDotMatch[1]}.&nbsp;&nbsp;${parseRichTextToHtml(letterDotMatch[2])}</p>`;
    }

    // 6. Numbered with dot like 1., 2., 3. (gambar 3)
    const numDotMatch = trimmed.match(/^(\d+(?:\.\d+)*)\.\s+(.*)$/);
    if (numDotMatch) {
      const marginPt = leadingSpaces >= 2 ? 56 : 38;
      return `<p style="margin: 0 0 3pt ${marginPt}pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${numDotMatch[1]}.&nbsp;&nbsp;${parseRichTextToHtml(numDotMatch[2])}</p>`;
    }

    // 7. Standard paragraph / continuation text
    const marginPt = leadingSpaces >= 2 ? 38 : 20;
    return `<p style="margin: 0 0 3pt ${marginPt}pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${parseRichTextToHtml(trimmed)}</p>`;
  }).join('');
}

export function generateSpkWordDoc(spk: SpkContract): void {
  const tanggalSpkFormatted = spk.tanggalSpk ? formatTanggalIndo(spk.tanggalSpk) : '-';
  const tanggalSppbjFormatted = spk.tanggalSppbj ? formatTanggalIndo(spk.tanggalSppbj) : '-';
  const tanggalMulaiFormatted = spk.tanggalMulai ? formatTanggalIndo(spk.tanggalMulai) : '-';
  const tanggalSelesaiFormatted = spk.tanggalSelesai ? formatTanggalIndo(spk.tanggalSelesai) : '-';

  const safeDocName = (spk.nomorSpk || spk.namaPaket || 'SPK_DRAFT').replace(/[/\\?%*:|"<>]/g, '_');

  // =========================================================================
  // EXPORT SPK FISIK (FORMAT PERSIS DOKUMEN FISIK DPUPR KAB. TEGAL)
  // =========================================================================
  if (spk.spkType === 'fisik') {
    const cleanPenyediaNama = (spk.penyediaNamaBadanUsaha || '').replace(/:\s*$/, '').trim();

    const clausesHtml = (spk.clauses || []).filter(c => c.isActive).map(c => `
      <div style="margin-top: 8pt; margin-bottom: 6pt;">
        <p style="margin: 8pt 0 2pt 20pt; text-indent: -20pt; font-weight: bold; font-size: 10pt; text-transform: uppercase; text-align: justify; line-height: 1.35;">
          ${c.pasal}.&nbsp;&nbsp;${c.judul}
        </p>
        <div>
          ${formatCustomClauseForWord(c.isi)}
        </div>
      </div>
    `).join('');

    const lingkupListHtml = (spk.ruangLingkup || []).map(r => `
      <li style="margin-bottom: 2pt;">${r}</li>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>SPK FISIK - ${spk.namaPaket}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 21.5cm 33.0cm;
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-page-orientation: portrait;
      mso-header-margin: 1.0cm;
      mso-footer-margin: 1.0cm;
      mso-title-page: yes;
      mso-footer: f1;
      mso-first-footer: f0;
    }
    div.Section1 { page: Section1; }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #000000;
    }
    p { margin: 0 0 4pt 0; text-align: justify; }
    table { border-collapse: collapse; width: 100%; }
    td, th { vertical-align: top; }
    .page-break { page-break-after: always; mso-special-character: line-break; }
  </style>
</head>
<body>
<div class="Section1">

  <!-- ========================================== -->
  <!-- HALAMAN 1: COVER / LEMBAR MUKA SPK FISIK   -->
  <!-- ========================================== -->
  
  <!-- Kop Surat DPUPR Kab. Tegal -->
  <table style="width: 100%; border-bottom: 3px double #000000; padding-bottom: 4pt; margin-bottom: 12pt;">
    <tr>
      <td style="width: 70pt; text-align: center; vertical-align: middle;">
        <img src="${LOGO_KAB_TEGAL_BASE64}" width="65" height="80" alt="Logo Kab Tegal" />
      </td>
      <td style="text-align: center; vertical-align: middle;">
        <p style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; text-align: center;">PEMERINTAH KABUPATEN TEGAL</p>
        <p style="margin: 0; font-size: 13.5pt; font-weight: bold; text-transform: uppercase; white-space: nowrap; text-align: center;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG (DPUPR)</p>
        <p style="margin: 1pt 0 0 0; font-size: 8.5pt; text-align: center;">Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal &ndash; Kode Pos 52416</p>
        <p style="margin: 0; font-size: 8.5pt; text-align: center;">Telepon (0283) 6197673 &ndash; Email: dpupr@tegalkab.go.id</p>
      </td>
    </tr>
  </table>

  <!-- Judul Dokumen SPK -->
  <div style="text-align: center; margin: 12pt 0 10pt 0;">
    <p style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center; text-decoration: underline;">
      SURAT PERINTAH KERJA (SPK)
    </p>
    <p style="font-size: 10pt; font-weight: normal; margin: 2pt 0 0 0; text-align: center;">
      Nomor : ${spk.nomorSpk || '000.3.2/PBLT/17.04/SPK/X/2026'}
    </p>
    <p style="font-size: 10pt; font-weight: normal; margin: 2pt 0 0 0; text-align: center;">
      Tanggal ${tanggalSpkFormatted}
    </p>
  </div>

  <!-- Uraian Kegiatan & Paket -->
  <div style="text-align: center; margin: 10pt 0 12pt 0;">
    <p style="font-size: 9.5pt; font-weight: bold; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center; line-height: 1.25;">
      ${spk.kegiatan || 'KEGIATAN PENYELENGGARAAN BANGUNAN GEDUNG DI WILAYAH DAERAH KABUPATEN/KOTA, PEMBERIAN IZIN MENDIRIKAN BANGUNAN (IMB) DAN SERTIFIKAT LAIK FUNGSI BANGUNAN GEDUNG'}
    </p>
    <p style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center;">
      PAKET PEKERJAAN ${spk.namaPaket}
    </p>
    <p style="font-size: 9.5pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center;">
      ${spk.perubahanAnggaran || `PERUBAHAN ANGGARAN TAHUN ${spk.tahunAnggaran || 2026}`}
    </p>
  </div>

  <!-- Ringkasan Cover Polosan Tanpa Garis Tabel (Font Normal) -->
  <table style="width: 100%; border-collapse: collapse; border: none; font-size: 10pt; margin: 12pt 0 16pt 0;">
    <tr>
      <td style="width: 140pt; border: none; padding: 3pt 0; font-weight: normal; vertical-align: top;">Lokasi Pekerjaan</td>
      <td style="width: 15pt; border: none; padding: 3pt 0; text-align: center; font-weight: normal; vertical-align: top;">:</td>
      <td style="border: none; padding: 3pt 0; vertical-align: top;">${spk.lokasiPekerjaan}</td>
    </tr>
    <tr>
      <td style="border: none; padding: 3pt 0; font-weight: normal; vertical-align: top;">Sumber Dana</td>
      <td style="border: none; padding: 3pt 0; text-align: center; font-weight: normal; vertical-align: top;">:</td>
      <td style="border: none; padding: 3pt 0; vertical-align: top;">${spk.sumberDana}</td>
    </tr>
    <tr>
      <td style="border: none; padding: 3pt 0; font-weight: normal; vertical-align: top;">Tahun Anggaran</td>
      <td style="border: none; padding: 3pt 0; text-align: center; font-weight: normal; vertical-align: top;">:</td>
      <td style="border: none; padding: 3pt 0; vertical-align: top;">${spk.perubahanAnggaran || `Tahun Anggaran ${spk.tahunAnggaran || 2026}`}</td>
    </tr>
    <tr>
      <td style="border: none; padding: 3pt 0; font-weight: normal; vertical-align: top;">Nilai Kontrak</td>
      <td style="border: none; padding: 3pt 0; text-align: center; font-weight: normal; vertical-align: top;">:</td>
      <td style="border: none; padding: 3pt 0; vertical-align: top;">
        <strong>${formatRupiah(spk.nilaiKontrak)}</strong><br/>
        <em>(${spk.nilaiKontrakTerbilang})</em>
      </td>
    </tr>
    <tr>
      <td style="border: none; padding: 3pt 0; font-weight: normal; vertical-align: top;">Masa pelaksanaan</td>
      <td style="border: none; padding: 3pt 0; text-align: center; font-weight: normal; vertical-align: top;">:</td>
      <td style="border: none; padding: 3pt 0; vertical-align: top;">${spk.jangkaWaktuHari} (${spk.jangkaWaktuHuruf || '-'})</td>
    </tr>
    <tr>
      <td style="border: none; padding: 3pt 0; font-weight: normal; vertical-align: top;">Mulai</td>
      <td style="border: none; padding: 3pt 0; text-align: center; font-weight: normal; vertical-align: top;">:</td>
      <td style="border: none; padding: 3pt 0; vertical-align: top;">${tanggalMulaiFormatted}</td>
    </tr>
    <tr>
      <td style="border: none; padding: 3pt 0; font-weight: normal; vertical-align: top;">Sampai Dengan</td>
      <td style="border: none; padding: 3pt 0; text-align: center; font-weight: normal; vertical-align: top;">:</td>
      <td style="border: none; padding: 3pt 0; vertical-align: top;">${tanggalSelesaiFormatted}</td>
    </tr>
  </table>

  <!-- Spacer to push Penyedia to bottom of page in Word -->
  <div style="height: 150pt; line-height: 150pt; font-size: 1pt;">&nbsp;</div>

  <!-- Penyedia Cover (Di Bagian Bawah Tengah Halaman) -->
  <div style="text-align: center; margin: 0 auto 20pt auto;">
    <p style="font-weight: normal; margin: 0 0 3pt 0; font-size: 10pt; text-transform: uppercase; text-align: center;">PENYEDIA :</p>
    <p style="font-weight: bold; font-size: 11pt; margin: 0 0 3pt 0; text-transform: uppercase; text-align: center;">${cleanPenyediaNama}</p>
    <p style="font-size: 9.5pt; margin: 0; text-align: center;">${spk.penyediaAlamat}</p>
  </div>

  <div style="page-break-before: always; mso-break-type: section-break;"></div>

  <!-- ========================================== -->
  <!-- HALAMAN 2: LEMBAR TABEL FORMULIR SPK UTUH  -->
  <!-- ========================================== -->

  <!-- Kop Surat DPUPR Kab. Tegal -->
  <table style="width: 100%; border-bottom: 3px double #000000; padding-bottom: 4pt; margin-bottom: 12pt;">
    <tr>
      <td style="width: 70pt; text-align: center; vertical-align: middle;">
        <img src="${LOGO_KAB_TEGAL_BASE64}" width="65" height="80" alt="Logo Kab Tegal" />
      </td>
      <td style="text-align: center; vertical-align: middle;">
        <p style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; text-align: center;">PEMERINTAH KABUPATEN TEGAL</p>
        <p style="margin: 0; font-size: 13.5pt; font-weight: bold; text-transform: uppercase; white-space: nowrap; text-align: center;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG (DPUPR)</p>
        <p style="margin: 1pt 0 0 0; font-size: 8.5pt; text-align: center;">Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal &ndash; Kode Pos 52416</p>
        <p style="margin: 0; font-size: 8.5pt; text-align: center;">Telepon (0283) 6197673 &ndash; Email: dpupr@tegalkab.go.id</p>
      </td>
    </tr>
  </table>

  <!-- Tabel Formulir Berbingkai LKPP/DPUPR -->
  <table style="width: 100%; border: 1px solid #000000; font-size: 9.5pt; line-height: 1.25; margin-bottom: 14pt;">
    <tr>
      <td rowspan="2" style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-align: center; vertical-align: top;">
        SURAT PERINTAH<br/>KERJA (SPK)
      </td>
      <td style="width: 68%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-align: center; vertical-align: middle;">
        DINAS PEKERJAAN UMUM DAN PENATAAN RUANG KABUPATEN<br/>TEGAL
      </td>
    </tr>

    <tr>
      <td style="border: 1px solid #000000; padding: 4pt 6pt; vertical-align: top;">
        <strong>NOMOR DAN TANGGAL SPK:</strong><br/>
        <table style="width: 100%; font-size: 9.5pt; margin-top: 2pt;">
          <tr>
            <td style="width: 55pt;">Nomor</td>
            <td style="width: 10pt;">:</td>
            <td>${spk.nomorSpk || '000.3.2/PBLT/17.04/SPK/X/2026'}</td>
          </tr>
          <tr>
            <td>Tanggal</td>
            <td>:</td>
            <td>${tanggalSpkFormatted}</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        NAMA PEJABAT PENANDATANGAN KONTRAK
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt;">
        <table style="width: 100%; font-size: 9.5pt; margin-bottom: 3pt;">
          <tr>
            <td style="width: 85pt;">Nama</td>
            <td style="width: 10pt;">:</td>
            <td><strong>${spk.ppkNama}</strong></td>
          </tr>
          <tr>
            <td>NIP</td>
            <td>:</td>
            <td>${spk.ppkNip}</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>${spk.ppkJabatan}</td>
          </tr>
          <tr>
            <td>Berkedudukan di</td>
            <td>:</td>
            <td>${spk.ppkAlamat || 'Satuan Kerja Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal'}</td>
          </tr>
        </table>
        <p style="font-size: 9pt; margin: 0; text-align: justify;">
          yang bertindak untuk dan atas nama Pemerintah Indonesia c.q. Pemerintah Kabupaten Tegal c.q. Satuan Kerja Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal. berdasarkan ${spk.ppkSkPengangkatanText || 'Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor 07 Tahun 2026 tanggal 12 Januari 2026 tentang Penunjukan Pejabat Pembuat Komitmen (PPKom) Pada Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal Tahun Anggaran 2026'} selanjutnya disebut &ldquo;Pejabat Penandatangan Kontrak&rdquo;, dengan:
        </p>
      </td>
    </tr>

    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        NAMA PENYEDIA
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt;">
        <table style="width: 100%; font-size: 9.5pt; margin-bottom: 3pt;">
          <tr>
            <td style="width: 95pt;">Nama</td>
            <td style="width: 10pt;">:</td>
            <td><strong>${spk.penyediaNamaPimpinan}</strong></td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>${spk.penyediaJabatanPimpinan}</td>
          </tr>
          <tr>
            <td>Berkedudukan di</td>
            <td>:</td>
            <td>${spk.penyediaAlamat}</td>
          </tr>
          <tr>
            <td>Akta Notaris Nomor</td>
            <td>:</td>
            <td>${spk.penyediaAktaNotarisNomor || '4'}</td>
          </tr>
          <tr>
            <td>Tanggal</td>
            <td>:</td>
            <td>${spk.penyediaAktaNotarisTanggal || '7 April 2022'}</td>
          </tr>
          <tr>
            <td>Notaris</td>
            <td>:</td>
            <td>${spk.penyediaAktaNotarisNama || 'LAELI NURCHAMIDAH, SH. MKn'}</td>
          </tr>
        </table>
        <p style="font-size: 9pt; margin: 0; text-align: justify;">
          yang bertindak untuk dan atas nama <strong>${spk.penyediaNamaBadanUsaha}</strong> selanjutnya disebut &ldquo;Penyedia&rdquo;.
        </p>
      </td>
    </tr>

    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        WAKIL SAH PEJABAT PENANDATANGAN KONTRAK
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt;">
        <strong>Wakil Sah Pejabat penandatangan kontrak</strong><br/>
        Untuk Pejabat penandatangan kontrak: ${spk.wakilSahPpk || 'Tidak ada'}
      </td>
    </tr>

    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        PAKET PENGADAAN: ${spk.namaPaket.toUpperCase()}
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt;">
        <strong style="text-transform: uppercase; font-size: 8.5pt;">NOMOR DAN TANGGAL UNDANGAN PENGADAAN LANGSUNG:</strong><br/>
        <table style="width: 100%; font-size: 9pt; margin-bottom: 3pt;">
          <tr>
            <td style="width: 55pt;">Nomor</td>
            <td style="width: 10pt;">:</td>
            <td>${spk.nomorUndanganPengadaan || spk.nomorSppbj || '-'}</td>
          </tr>
          <tr>
            <td>Tanggal</td>
            <td>:</td>
            <td>${spk.tanggalUndanganPengadaan ? formatTanggalIndo(spk.tanggalUndanganPengadaan) : tanggalSppbjFormatted}</td>
          </tr>
        </table>

        <strong style="text-transform: uppercase; font-size: 8.5pt;">NOMOR DAN TANGGAL BERITA ACARA HASIL PENGADAAN LANGSUNG:</strong><br/>
        <table style="width: 100%; font-size: 9pt;">
          <tr>
            <td style="width: 55pt;">Nomor</td>
            <td style="width: 10pt;">:</td>
            <td>${spk.nomorBahpl || '000.3.2/DPUPR/Rehab.Jaksa/PP/07/2026'}</td>
          </tr>
          <tr>
            <td>Tanggal</td>
            <td>:</td>
            <td>${spk.tanggalBahpl ? formatTanggalIndo(spk.tanggalBahpl) : '12 Oktober 2026'}</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt; text-align: justify;">
        <strong>SUMBER DANA:</strong> ${spk.sumberDana} dibebankan atas DPPA Nomor ${spk.dppaNomor || 'DPPA/A.3/1.03.0.00.0.00.01.0000/001/2026'} ${spk.perubahanAnggaran || `Perubahan Anggaran Tahun ${spk.tahunAnggaran || 2026}`} untuk mata anggaran kegiatan ${spk.mataAnggaran || spk.kegiatan || 'Penyelenggaraan Bangunan Gedung Di Wilayah Daerah Kabupaten/Kota, Pemberian Izin Mendirikan Bangunan (IMB) dan Sertifikat Laik Fungsi Bangunan Gedung'}
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt; text-align: justify;">
        <p style="margin: 0 0 2pt 0;">
          <strong>MASA PELAKSANAAN PEKERJAAN:</strong> ${spk.jangkaWaktuHari} (${spk.jangkaWaktuHuruf || '-'}) hari kalender dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan
        </p>
        <p style="margin: 0;">
          <strong>MASA PEMELIHARAAN PEKERJAAN:</strong> ${spk.masaPemeliharaanHari || 180} (${spk.masaPemeliharaanHuruf || 'seratus delapan puluh'}) hari Kalender dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan
        </p>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt;">
        <strong>JENIS KONTRAK:</strong> ${spk.jenisKontrak || 'Harga Satuan'}
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt; text-align: justify;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">DOKUMEN KONTRAK</p>
        <p style="margin: 0 0 3pt 0;">
          Dokumen-dokumen berikut merupakan satu kesatuan dan jika terjadi pertentangan antara ketentuan dalam suatu dokumen dengan ketentuan dalam dokumen yang lain maka yang berlaku adalah ketentuan dalam dokumen yang lebih tinggi berdasarkan urutan hierarki sebagai berikut:
        </p>
        <ol style="margin: 0; padding-left: 18pt;">
          ${(spk.dokumenKontrakHierarki || [
            'Adendum Surat Perintah Kerja/SPK (apabila ada)',
            'Surat Perintah Kerja',
            'Surat Penawaran',
            'Syarat-Syarat Umum SPK',
            'Gambar-Gambar',
            'Spesifikasi Teknis',
            'Daftar Kuantitas dan Harga hasil negosiasi dan koreksi aritmatik',
            'dokumen lainnya seperti: Surat Penunjukan Penyedia Barang/Jasa, Jadwal Pelaksanaan Pekerjaan, jaminan-jaminan, Berita Acara Rapat Persiapan Pelaksanaan Kontrak'
          ]).map(doc => `<li>${doc};</li>`).join('')}
        </ol>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt; text-align: justify;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">HARGA KONTRAK</p>
        <p style="margin: 0;">
          Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) adalah sebesar <strong>${formatRupiah(spk.nilaiKontrak)}</strong> (${spk.nilaiKontrakTerbilang})
        </p>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">LINGKUP PEKERJAAN</p>
        <p style="margin: 0 0 2pt 0;">Ruang lingkup pekerjaan terdiri dari :</p>
        <ul style="margin: 0; padding-left: 16pt;">
          ${lingkupListHtml}
        </ul>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">SISTEM PEMBAYARAN</p>
        <p style="margin: 0 0 2pt 0;">
          Pembayaran untuk kontrak ini dilakukan ke <strong>${spk.penyediaBank}</strong> rekening nomor : <strong>${spk.penyediaNomorRekening}</strong> atas nama <strong>${spk.penyediaNamaRekening}</strong>
        </p>
        <p style="margin: 0;">
          Pembayaran prestasi pekerjaan dilakukan dengan cara : <strong>${spk.sistemPembayaran.includes('Sekaligus') ? 'Sekaligus' : spk.sistemPembayaran}</strong>
        </p>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">BESARAN UANG MUKA</p>
        <p style="margin: 0;">${spk.besaranUangMuka || 'Kontrak ini tidak diberikan uang muka'}</p>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">FASILITAS</p>
        <p style="margin: 0;">Pejabat penandatangan kontrak memberikan fasilitas berupa : ${spk.fasilitas || 'tidak diberikan fasilitas'}</p>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 0;">
        <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
          <tr>
            <td style="width: 50%; border-right: 1px solid #000000; padding: 8pt 6pt; text-align: center; vertical-align: top;">
              <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Untuk dan atas nama</p>
              <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Dinas PUPR Kabupaten Tegal</p>
              <p style="font-weight: normal; font-size: 8.5pt; margin: 0 0 2pt 0; text-align: center;">${spk.ppkJabatan}</p>
              <p style="font-weight: bold; font-style: italic; font-size: 8.5pt; margin: 0 0 42pt 0; text-align: center;">Selaku Pejabat Penandatangan Kontrak</p>
              <p style="font-weight: bold; text-decoration: underline; margin: 0; text-align: center;">${spk.ppkNama}</p>
              <p style="font-weight: normal; font-size: 8.5pt; margin: 2pt 0 0 0; text-align: center;">NIP. ${spk.ppkNip}</p>
            </td>
            <td style="width: 50%; padding: 8pt 6pt; text-align: center; vertical-align: top;">
              <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Untuk dan atas nama Penyedia</p>
              <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 54pt 0; text-align: center;">${spk.penyediaNamaBadanUsaha}</p>
              <p style="font-weight: bold; text-decoration: underline; margin: 0; text-align: center;">${spk.penyediaNamaPimpinan}</p>
              <p style="font-weight: normal; font-size: 8.5pt; margin: 2pt 0 0 0; text-align: center;">${spk.penyediaJabatanPimpinan}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <div style="page-break-before: always; mso-break-type: section-break;"></div>

  <!-- ========================================== -->
  <!-- HALAMAN 3+: SYARAT UMUM SPK (31 PASAL)     -->
  <!-- ========================================== -->
  <div style="text-align: center; margin: 10pt 0 14pt 0;">
    <p style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0; text-decoration: underline; text-align: center;">
      SYARAT UMUM
    </p>
    <p style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0; text-decoration: underline; text-align: center;">
      SURAT PERINTAH KERJA (SPK)
    </p>
  </div>

  ${clausesHtml}

  <!-- Penutup & Tanda Tangan SPK (Satu Kesatuan Utuh di Word, Tidak Terpisah) -->
  <div style="page-break-inside: avoid; mso-pagination: widow-orphan; margin-top: 14pt; padding-top: 0; border: none;">
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 4pt; page-break-after: avoid;">
      SPK untuk melaksanakan Pekerjaan ${spk.namaPaket} ini, beserta lampiran-lampiranya merupakan bagian tak terpisahkan, dibuat dalam rangkap 3 (tiga) bermaterai untuk Pejabat Penandatangan Kontrak dan Penyedia serta masing-masing mempunyai kekuatan hukum yang sama.
    </p>
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 4pt; page-break-after: avoid;">
      SPK ini mulai berlaku efektif terhitung sejak tanggal yang ditetapkan dalam SPK dengan tanggal mulai dan penyelesaian keseluruhan pekerjaan sebagaimana diatur dalam SPMK.
    </p>
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 6pt; page-break-after: avoid;">
      Dengan demikian, Pejabat Penandatangan Kontrak dan Penyedia telah bersepakat untuk menandatangani SPK ini pada tanggal tersebut di atas dan melaksanakan SPK sesuai dengan ketentuan peraturan perundang-undangan di Republik Indonesia.
    </p>

    <!-- Tanda Tangan Penutup -->
    <table style="width: 100%; margin-top: 14pt; font-size: 10pt; text-align: center; page-break-inside: avoid;">
      <tr>
        <td style="width: 50%; vertical-align: top; text-align: center;">
          <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Untuk dan atas nama</p>
          <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Dinas PUPR Kabupaten Tegal</p>
          <p style="font-weight: normal; font-size: 8.5pt; margin: 0 0 2pt 0; text-align: center;">${spk.ppkJabatan}</p>
          <p style="font-weight: bold; font-style: italic; font-size: 8.5pt; margin: 0 0 45pt 0; text-align: center;">Selaku Pejabat Penandatangan Kontrak</p>
          <p style="font-weight: bold; text-decoration: underline; margin: 0; text-align: center;">${spk.ppkNama}</p>
          <p style="font-weight: normal; font-size: 8.5pt; margin: 2pt 0 0 0; text-align: center;">NIP. ${spk.ppkNip}</p>
        </td>
        <td style="width: 50%; vertical-align: top; text-align: center;">
          <p style="font-size: 8.5pt; margin: 0 0 2pt 0; text-align: center;">Slawi, ${tanggalSpkFormatted}</p>
          <p style="font-size: 8.5pt; font-style: italic; margin: 0 0 2pt 0; text-align: center;">Menerima dan Menyetujui :</p>
          <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Untuk dan atas nama Penyedia</p>
          <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 45pt 0; text-align: center;">${spk.penyediaNamaBadanUsaha}</p>
          <p style="font-weight: bold; text-decoration: underline; margin: 0; text-align: center;">${spk.penyediaNamaPimpinan}</p>
          <p style="font-weight: normal; font-size: 8.5pt; margin: 2pt 0 0 0; text-align: center;">${spk.penyediaJabatanPimpinan}</p>
        </td>
      </tr>
    </table>
  </div>
</div>

  <!-- Running Footer Word Kotak Paraf Koordinasi (Cover Halaman 1 Kosong, Halaman 2+ Muncul) -->
  <div style="mso-element:footer" id="f0">
    <p class="MsoFooter" style="margin: 0;"></p>
  </div>
  <div style="mso-element:footer" id="f1">
    <p class="MsoFooter" style="margin: 0; text-align: right;">
      <table align="right" style="width: 170pt; border-collapse: collapse; border: 1px solid #000000; font-family: 'Times New Roman', serif; font-size: 8.5pt;">
        <tr>
          <td style="border: 1px solid #000000; padding: 2pt 5pt; font-weight: bold; width: 130pt; text-align: left; background-color: #ffffff;">
            Pejabat Penandatangan Kontrak
          </td>
          <td style="border: 1px solid #000000; width: 40pt; height: 16pt; background-color: #ffffff;">&nbsp;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000000; padding: 2pt 5pt; font-weight: bold; width: 130pt; text-align: left; background-color: #ffffff;">
            Penyedia
          </td>
          <td style="border: 1px solid #000000; width: 40pt; height: 16pt; background-color: #ffffff;">&nbsp;</td>
        </tr>
      </table>
    </p>
  </div>

</body>
</html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SPK_FISIK_${safeDocName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  // =========================================================================
  // EXPORT SPK KONSULTAN PERENCANA (FORMAT BAKU DPUPR KAB. TEGAL)
  // =========================================================================
  if (spk.spkType === 'perencana') {
    const cleanPenyediaNama = (spk.penyediaNamaBadanUsaha || '').replace(/:\s*$/, '').trim();

    const clausesHtml = (spk.clauses || []).filter(c => c.isActive).map(c => `
      <div style="margin-top: 8pt; margin-bottom: 6pt;">
        <p style="margin: 8pt 0 2pt 20pt; text-indent: -20pt; font-weight: bold; font-size: 10pt; text-transform: uppercase; text-align: justify; line-height: 1.35;">
          ${c.pasal}.&nbsp;&nbsp;${c.judul}
        </p>
        <div>
          ${formatCustomClauseForWord(c.isi)}
        </div>
      </div>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>SPK KONSULTAN PERENCANA - ${spk.namaPaket}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 21.5cm 33.0cm;
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-page-orientation: portrait;
      mso-header-margin: 1.0cm;
      mso-footer-margin: 1.0cm;
      mso-title-page: yes;
      mso-footer: f1;
      mso-first-footer: f0;
    }
    div.Section1 { page: Section1; }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #000000;
    }
    p { margin: 0 0 4pt 0; text-align: justify; }
    table { border-collapse: collapse; width: 100%; }
    td, th { vertical-align: top; }
  </style>
</head>
<body>
<div class="Section1">

  <!-- ======================================================= -->
  <!-- HALAMAN 1: COVER / LEMBAR MUKA SPK KONSULTAN PERENCANA  -->
  <!-- ======================================================= -->
  
  <!-- Kop Surat DPUPR Kab. Tegal -->
  <table style="width: 100%; border-bottom: 3px double #000000; padding-bottom: 4pt; margin-bottom: 12pt;">
    <tr>
      <td style="width: 70pt; text-align: center; vertical-align: middle;">
        <img src="${LOGO_KAB_TEGAL_BASE64}" width="65" height="80" alt="Logo Kab Tegal" />
      </td>
      <td style="text-align: center; vertical-align: middle;">
        <p style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; text-align: center;">PEMERINTAH KABUPATEN TEGAL</p>
        <p style="margin: 0; font-size: 13.5pt; font-weight: bold; text-transform: uppercase; white-space: nowrap; text-align: center;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG (DPUPR)</p>
        <p style="margin: 1pt 0 0 0; font-size: 8.5pt; text-align: center;">Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal &ndash; Kode Pos 52416</p>
        <p style="margin: 0; font-size: 8.5pt; text-align: center;">Telepon (0283) 6197673 &ndash; Email: dpupr@tegalkab.go.id</p>
      </td>
    </tr>
  </table>

  <!-- Judul Dokumen SPK -->
  <div style="text-align: center; margin: 16pt 0 12pt 0;">
    <p style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center; text-decoration: underline;">
      SURAT PERINTAH KERJA
    </p>
    <p style="font-size: 10pt; font-weight: normal; margin: 2pt 0 0 0; text-align: center;">
      Nomor : ${spk.nomorSpk || '000.3.2/PBLT/05.03/SPK/VI/2026'}
    </p>
    <p style="font-size: 10pt; font-weight: normal; margin: 2pt 0 0 0; text-align: center;">
      Tanggal ${tanggalSpkFormatted}
    </p>
  </div>

  <!-- Uraian Kegiatan & Paket Pekerjaan -->
  <div style="text-align: center; margin: 16pt auto; font-size: 10pt; font-weight: bold; text-transform: uppercase; line-height: 1.35; max-width: 480pt;">
    <p style="margin: 0 0 4pt 0; text-align: center;">
      ${spk.kegiatan || 'KEGIATAN PENYELENGGARAAN BANGUNAN GEDUNG DI WILAYAH DAERAH KABUPATEN/KOTA, PEMBERIAN IZIN MENDIRIKAN BANGUNAN (IMB) DAN SERTIFIKAT LAIK FUNGSI BANGUNAN GEDUNG'}
    </p>
    <p style="margin: 0 0 4pt 0; text-align: center;">
      PAKET PEKERJAAN ${spk.namaPaket.toUpperCase()}
    </p>
    <p style="margin: 0; text-align: center;">
      ${spk.perubahanAnggaran || `TAHUN ANGGARAN ${spk.tahunAnggaran || 2026}`}
    </p>
  </div>

  <!-- Ringkasan Data Kontrak Cover -->
  <div style="margin: 18pt 0 18pt 10pt;">
    <table style="width: 100%; font-size: 10pt; border-collapse: collapse; border: none;">
      <tr>
        <td style="width: 140pt; padding: 2.5pt 0; vertical-align: top; border: none;">Lokasi Pekerjaan</td>
        <td style="width: 12pt; padding: 2.5pt 0; text-align: center; vertical-align: top; border: none;">:</td>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">${spk.lokasiPekerjaan}</td>
      </tr>
      <tr>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">Sumber Dana</td>
        <td style="padding: 2.5pt 0; text-align: center; vertical-align: top; border: none;">:</td>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">${spk.sumberDana || 'APBD DAU Kabupaten Tegal'}</td>
      </tr>
      <tr>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">Tahun Anggaran</td>
        <td style="padding: 2.5pt 0; text-align: center; vertical-align: top; border: none;">:</td>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">${spk.tahunAnggaran || 2026}</td>
      </tr>
      <tr>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">Nilai Kontrak</td>
        <td style="padding: 2.5pt 0; text-align: center; vertical-align: top; border: none;">:</td>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">
          <strong>${formatRupiah(spk.nilaiKontrak)}</strong><br />
          <span style="font-style: italic;">(${spk.nilaiKontrakTerbilang})</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">Masa pelaksanaan</td>
        <td style="padding: 2.5pt 0; text-align: center; vertical-align: top; border: none;">:</td>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">${spk.jangkaWaktuHari} (${spk.jangkaWaktuHuruf || '-'}) Hari Kalender</td>
      </tr>
      <tr>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">Mulai</td>
        <td style="padding: 2.5pt 0; text-align: center; vertical-align: top; border: none;">:</td>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">${tanggalMulaiFormatted}</td>
      </tr>
      <tr>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">Sampai Dengan</td>
        <td style="padding: 2.5pt 0; text-align: center; vertical-align: top; border: none;">:</td>
        <td style="padding: 2.5pt 0; vertical-align: top; border: none;">${tanggalSelesaiFormatted}</td>
      </tr>
    </table>
  </div>

  <!-- Garis Pembatas & Bagian Penyedia Cover -->
  <div style="margin-top: 40pt; border-top: 2px solid #000000; padding-top: 20pt; text-align: center;">
    <p style="font-size: 10pt; letter-spacing: 1pt; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center;">PENYEDIA :</p>
    <p style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center;">${cleanPenyediaNama}</p>
    <p style="font-size: 9.5pt; margin: 0; text-align: center;">${spk.penyediaAlamat}</p>
  </div>

  <div style="page-break-before: always; mso-break-type: section-break;"></div>

  <!-- ======================================================== -->
  <!-- HALAMAN 2: FORMULIR TABEL SPK KONSULTAN PERENCANA        -->
  <!-- ======================================================== -->

  <!-- Kop Surat DPUPR Kab. Tegal -->
  <table style="width: 100%; border-bottom: 3px double #000000; padding-bottom: 4pt; margin-bottom: 10pt;">
    <tr>
      <td style="width: 70pt; text-align: center; vertical-align: middle;">
        <img src="${LOGO_KAB_TEGAL_BASE64}" width="65" height="80" alt="Logo Kab Tegal" />
      </td>
      <td style="text-align: center; vertical-align: middle;">
        <p style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; text-align: center;">PEMERINTAH KABUPATEN TEGAL</p>
        <p style="margin: 0; font-size: 13.5pt; font-weight: bold; text-transform: uppercase; white-space: nowrap; text-align: center;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG (DPUPR)</p>
        <p style="margin: 1pt 0 0 0; font-size: 8.5pt; text-align: center;">Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal &ndash; Kode Pos 52416</p>
        <p style="margin: 0; font-size: 8.5pt; text-align: center;">Telepon (0283) 6197673 &ndash; Email: dpupr@tegalkab.go.id</p>
      </td>
    </tr>
  </table>

  <!-- Formulir Tabel SPK Utuh -->
  <table style="width: 100%; border: 1px solid #000000; font-size: 9pt; border-collapse: collapse; margin-bottom: 8pt;">
    <tr>
      <td rowspan="2" style="width: 32%; border: 1px solid #000000; padding: 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        SURAT PERINTAH KERJA<br />(SPK)
      </td>
      <td style="width: 68%; border: 1px solid #000000; padding: 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: middle;">
        DINAS PEKERJAAN UMUM DAN PENATAAN RUANG KABUPATEN TEGAL
      </td>
    </tr>
    <tr>
      <td style="border: 1px solid #000000; padding: 6pt;">
        <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 2pt 0;">NOMOR DAN TANGGAL SPK:</p>
        <table style="border: none; margin: 0; padding: 0; font-size: 9pt; width: 100%;">
          <tr>
            <td style="width: 55pt; border: none; padding: 1pt 0;">Nomor</td>
            <td style="width: 8pt; border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.nomorSpk || '000.3.2/PBLT/05.03/SPK/VI/2026'}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Tanggal</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${tanggalSpkFormatted}</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        NAMA PEJABAT PENANDATANGAN KONTRAK
      </td>
      <td style="border: 1px solid #000000; padding: 6pt;">
        <table style="border: none; margin: 0 0 4pt 0; padding: 0; font-size: 9pt; width: 100%;">
          <tr>
            <td style="width: 90pt; border: none; padding: 1pt 0;">Nama</td>
            <td style="width: 8pt; border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0; font-weight: bold;">${spk.ppkNama}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">NIP</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.ppkNip}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Jabatan</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.ppkJabatan}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Berkedudukan di</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.ppkAlamat || 'Jl. Cut Nyak Dien Slawi'}</td>
          </tr>
        </table>
        <p style="text-align: justify; margin: 0; font-size: 8.5pt; line-height: 1.35;">
          yang bertindak untuk dan atas nama*) Pemerintah Indonesia c.q. Pemerintah Kabupaten Tegal c.q. Satuan Kerja Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal. berdasarkan ${spk.ppkSkPengangkatanText || 'Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor 07 Tahun 2026 tanggal 12 Januari 2026 tentang Penunjukan Pejabat Pembuat Komitmen (PPKom) Pada Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal Tahun Anggaran 2026'} selanjutnya disebut &ldquo;Pejabat Penandatangan Kontrak&rdquo;, dengan:
        </p>
      </td>
    </tr>

    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        NAMA PENYEDIA
      </td>
      <td style="border: 1px solid #000000; padding: 6pt;">
        <table style="border: none; margin: 0 0 4pt 0; padding: 0; font-size: 9pt; width: 100%;">
          <tr>
            <td style="width: 105pt; border: none; padding: 1pt 0;">Nama</td>
            <td style="width: 8pt; border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0; font-weight: bold;">${spk.penyediaNamaPimpinan}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Jabatan</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.penyediaJabatanPimpinan}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Berkedudukan di</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.penyediaAlamat}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Akta Notaris Nomor</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.penyediaAktaNotarisNomor || '25'}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Tanggal</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.penyediaAktaNotarisTanggal || '31 Agustus 2021'}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Notaris</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.penyediaAktaNotarisNama || 'UNTUNG DWIKORIANTO, SH., SpN'}</td>
          </tr>
        </table>
        <p style="text-align: justify; margin: 0; font-size: 8.5pt;">
          yang bertindak untuk dan atas nama <strong>${cleanPenyediaNama}</strong> selanjutnya disebut &ldquo;Penyedia&rdquo;.
        </p>
      </td>
    </tr>

    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        WAKIL SAH PEJABAT PENANDATANGAN KONTRAK
      </td>
      <td style="border: 1px solid #000000; padding: 6pt;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">Wakil Sah Pejabat Penandatangan Kontrak</p>
        <p style="margin: 0;">Untuk Pejabat Penandatangan Kontrak: <strong>${spk.wakilSahPpk || 'Tidak ada'}</strong></p>
      </td>
    </tr>

    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        PAKET PENGADAAN: ${spk.namaPaket.toUpperCase()}
      </td>
      <td style="border: 1px solid #000000; padding: 6pt;">
        <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 2pt 0; font-size: 8.5pt;">NOMOR DAN TANGGAL SURAT UNDANGAN PENGADAAN LANGSUNG:</p>
        <table style="border: none; margin: 0 0 4pt 0; padding: 0; font-size: 9pt; width: 100%;">
          <tr>
            <td style="width: 55pt; border: none; padding: 1pt 0;">Nomor</td>
            <td style="width: 8pt; border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.nomorUndanganPengadaan || '003.2/DPUPR/Prc.Brigif/PP/03/2026'}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Tanggal</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.tanggalUndanganPengadaan ? formatTanggalIndo(spk.tanggalUndanganPengadaan) : '11 Juni 2026'}</td>
          </tr>
        </table>

        <p style="font-weight: bold; text-transform: uppercase; margin: 4pt 0 2pt 0; font-size: 8.5pt;">NOMOR DAN TANGGAL BERITA ACARA HASIL PEMILIHAN:</p>
        <table style="border: none; margin: 0; padding: 0; font-size: 9pt; width: 100%;">
          <tr>
            <td style="width: 55pt; border: none; padding: 1pt 0;">Nomor</td>
            <td style="width: 8pt; border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.nomorBahpl || '003.2/DPUPR/Prc.Brigif/PP/07/2026'}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 1pt 0;">Tanggal</td>
            <td style="border: none; padding: 1pt 0;">:</td>
            <td style="border: none; padding: 1pt 0;">${spk.tanggalBahpl ? formatTanggalIndo(spk.tanggalBahpl) : '17 Juni 2026'}</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 6pt; text-align: justify;">
        <strong>SUMBER DANA :</strong> ${spk.sumberDana || 'APBD DAU Kabupaten Tegal'} dibebankan atas DPA Nomor ${spk.dppaNomor || 'DPA/A.1/1.03.0.00.0.00.01.0000/001/2026'} ${spk.perubahanAnggaran || `Tahun Anggaran ${spk.tahunAnggaran || 2026}`} untuk mata anggaran kegiatan ${spk.mataAnggaran || spk.kegiatan || 'Penyelenggaraan Bangunan Gedung Di Wilayah Daerah Kabupaten/Kota, Pemberian Izin Mendirikan Bangunan (IMB) dan Sertifikat Laik Fungsi Bangunan Gedung'}
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 6pt; text-align: justify;">
        Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) adalah sebesar <strong>${formatRupiah(spk.nilaiKontrak)}</strong> (${spk.nilaiKontrakTerbilang})
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 6pt;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">SISTEM PEMBAYARAN</p>
        <p style="margin: 0 0 2pt 0;">
          1. Pembayaran untuk kontrak ini dilakukan ke <strong>${spk.penyediaBank || 'Bank Jateng Cabang Slawi'}</strong> rekening nomor : <strong>${spk.penyediaNomorRekening || '1035-01626-7'}</strong> atas nama Penyedia : <strong>${spk.penyediaNamaRekening || cleanPenyediaNama}</strong>
        </p>
        <p style="margin: 0;">
          2. Pembayaran dilakukan dengan pembayaran secara <strong>${(spk.sistemPembayaran || 'sekaligus').toLowerCase().includes('termin') ? 'termin' : (spk.sistemPembayaran || '').toLowerCase().includes('bulanan') ? 'bulanan' : 'sekaligus'}</strong>.
        </p>
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 6pt;">
        <strong>Jenis Kontrak:</strong> ${spk.jenisKontrak || 'Lumpsum'}
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 6pt;">
        <strong>WAKTU PELAKSANAAN PEKERJAAN:</strong> ${spk.jangkaWaktuHari} (${spk.jangkaWaktuHuruf || '-'}) hari kalender
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 0;">
        <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
          <tr>
            <td style="width: 50%; border-right: 1px solid #000000; padding: 8pt 6pt; text-align: center; vertical-align: top;">
              <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Untuk dan atas nama</p>
              <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Dinas PUPR Kabupaten Tegal</p>
              <p style="font-weight: bold; font-style: italic; font-size: 8.5pt; margin: 0 0 45pt 0; text-align: center;">${spk.ppkJabatan}<br />Selaku Pejabat Penandatangan Kontrak</p>
              <p style="font-weight: bold; text-decoration: underline; margin: 0; text-align: center;">${spk.ppkNama}</p>
              <p style="font-weight: normal; font-size: 8.5pt; margin: 2pt 0 0 0; text-align: center;">NIP. ${spk.ppkNip}</p>
            </td>
            <td style="width: 50%; padding: 8pt 6pt; text-align: center; vertical-align: top;">
              <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Untuk dan atas nama Penyedia</p>
              <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 55pt 0; text-align: center;">${cleanPenyediaNama}</p>
              <p style="font-weight: bold; text-decoration: underline; margin: 0; text-align: center;">${spk.penyediaNamaPimpinan}</p>
              <p style="font-weight: normal; font-size: 8.5pt; margin: 2pt 0 0 0; text-align: center;">${spk.penyediaJabatanPimpinan}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <div style="page-break-before: always; mso-break-type: section-break;"></div>

  <!-- ======================================================== -->
  <!-- HALAMAN 3+: SYARAT UMUM SPK (27 PASAL)                   -->
  <!-- ======================================================== -->
  <div style="text-align: center; margin: 10pt 0 14pt 0;">
    <p style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center;">
      SYARAT UMUM
    </p>
    <p style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center;">
      SURAT PERINTAH KERJA (SPK)
    </p>
  </div>

  ${clausesHtml}

  <!-- Penutup & Tanda Tangan SPK (Satu Kesatuan Utuh di Word, Tidak Terpisah) -->
  <div style="page-break-inside: avoid; mso-pagination: widow-orphan; margin-top: 14pt; padding-top: 0; border: none;">
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 4pt; page-break-after: avoid;">
      SPK untuk melaksanakan Pekerjaan ${spk.namaPaket} ini, beserta lampiran-lampiranya merupakan bagian tak terpisahkan, dibuat dalam rangkap 3 (Tiga) bermaterai untuk Pejabat Penandatangan Kontrak dan Penyedia serta masing-masing mempunyai kekuatan hukum yang sama.
    </p>
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 4pt; page-break-after: avoid;">
      SPK ini mulai berlaku efektif terhitung sejak tanggal yang ditetapkan dalam SPK dengan tanggal mulai dan penyelesaian keseluruhan pekerjaan sebagaimana diatur dalam SPMK.
    </p>
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 6pt; page-break-after: avoid;">
      Dengan demikian, Pejabat Penandatangan Kontrak dan Penyedia telah bersepakat untuk menandatangani SPK ini pada tanggal tersebut di atas dan melaksanakan SPK sesuai dengan ketentuan peraturan perundang-undangan di Republik Indonesia.
    </p>

    <!-- Tanda Tangan Penutup -->
    <table style="width: 100%; margin-top: 14pt; font-size: 10pt; text-align: center; page-break-inside: avoid;">
      <tr>
        <td style="width: 50%; vertical-align: top; text-align: center;">
          <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Untuk dan atas nama</p>
          <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Dinas PUPR Kabupaten Tegal</p>
          <p style="font-weight: normal; font-size: 8.5pt; margin: 0 0 2pt 0; text-align: center;">${spk.ppkJabatan}</p>
          <p style="font-weight: bold; font-style: italic; font-size: 8.5pt; margin: 0 0 45pt 0; text-align: center;">Selaku Pejabat Penandatangan Kontrak</p>
          <p style="font-weight: bold; text-decoration: underline; margin: 0; text-align: center;">${spk.ppkNama}</p>
          <p style="font-weight: normal; font-size: 8.5pt; margin: 2pt 0 0 0; text-align: center;">NIP. ${spk.ppkNip}</p>
        </td>
        <td style="width: 50%; vertical-align: top; text-align: center;">
          <p style="font-size: 8.5pt; margin: 0 0 2pt 0; text-align: center;">Slawi, ${tanggalSpkFormatted}</p>
          <p style="font-weight: normal; margin: 0 0 2pt 0; text-align: center;">Untuk dan atas nama Penyedia</p>
          <p style="font-weight: bold; text-transform: uppercase; margin: 0 0 45pt 0; text-align: center;">${cleanPenyediaNama}</p>
          <p style="font-weight: bold; text-decoration: underline; margin: 0; text-align: center;">${spk.penyediaNamaPimpinan}</p>
          <p style="font-weight: normal; font-size: 8.5pt; margin: 2pt 0 0 0; text-align: center;">${spk.penyediaJabatanPimpinan}</p>
        </td>
      </tr>
    </table>
  </div>
</div>

  <!-- Running Footer Word Kotak Paraf Koordinasi (Cover Halaman 1 Kosong, Halaman 2+ Muncul) -->
  <div style="mso-element:footer" id="f0">
    <p class="MsoFooter" style="margin: 0;"></p>
  </div>
  <div style="mso-element:footer" id="f1">
    <p class="MsoFooter" style="margin: 0; text-align: right;">
      <table align="right" style="width: 170pt; border-collapse: collapse; border: 1px solid #000000; font-family: 'Times New Roman', serif; font-size: 8.5pt;">
        <tr>
          <td style="border: 1px solid #000000; padding: 2pt 5pt; font-weight: bold; width: 130pt; text-align: left; background-color: #ffffff;">
            Pejabat Penandatangan Kontrak
          </td>
          <td style="border: 1px solid #000000; width: 40pt; height: 16pt; background-color: #ffffff;">&nbsp;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000000; padding: 2pt 5pt; font-weight: bold; width: 130pt; text-align: left; background-color: #ffffff;">
            Penyedia
          </td>
          <td style="border: 1px solid #000000; width: 40pt; height: 16pt; background-color: #ffffff;">&nbsp;</td>
        </tr>
      </table>
    </p>
  </div>

</body>
</html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SPK_PERENCANA_${safeDocName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  // =========================================================================
  // EXPORT SPK KONSULTAN PENGAWAS (FORMAT BAKU DPUPR KAB. TEGAL)
  // =========================================================================
  if (spk.spkType === 'pengawas') {
    const cleanPenyediaNama = (spk.penyediaNamaBadanUsaha || '').replace(/:\s*$/, '').trim();

    const clausesHtml = (spk.clauses || []).filter(c => c.isActive).map(c => `
      <div style="margin-top: 8pt; margin-bottom: 6pt;">
        <p style="margin: 8pt 0 2pt 20pt; text-indent: -20pt; font-weight: bold; font-size: 10pt; text-transform: uppercase; text-align: justify; line-height: 1.35;">
          ${c.pasal}.&nbsp;&nbsp;${c.judul}
        </p>
        <div>
          ${formatCustomClauseForWord(c.isi)}
        </div>
      </div>
    `).join('');

    const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>SPK KONSULTAN PENGAWAS - ${spk.namaPaket}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 21.5cm 33.0cm;
      margin: 2.0cm 2.0cm 2.0cm 2.0cm;
      mso-page-orientation: portrait;
      mso-header-margin: 1.0cm;
      mso-footer-margin: 1.0cm;
      mso-title-page: yes;
      mso-footer: f1;
      mso-first-footer: f0;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Bookman Old Style', 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.35;
      color: #000000;
    }
    p { margin: 0 0 4pt 0; text-align: justify; }
    table { border-collapse: collapse; width: 100%; }
    .text-center { text-align: center; }
    .text-justify { text-align: justify; }
    .font-bold { font-weight: bold; }
    .uppercase { text-transform: uppercase; }
  </style>
</head>
<body>
<div class="Section1">

  <!-- ======================================================== -->
  <!-- LEMBAR 1: COVER / LEMBAR MUKA SPK KONSULTAN PENGAWAS     -->
  <!-- ======================================================== -->
  <div style="min-height: 900pt; display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <!-- Kop Surat Resmi DPUPR -->
      <table style="width: 100%; border-bottom: 2.5pt double #000000; padding-bottom: 3pt; margin-bottom: 12pt;">
        <tr>
          <td style="width: 70pt; text-align: center; vertical-align: middle;">
            <img src="${LOGO_KAB_TEGAL_BASE64}" width="65" height="80" alt="Logo Kab Tegal" />
          </td>
          <td style="text-align: center; vertical-align: middle; padding-left: 8pt;">
            <p style="margin: 0; font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; text-align: center;">PEMERINTAH KABUPATEN TEGAL</p>
            <p style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; text-align: center;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG</p>
            <p style="margin: 1pt 0 0 0; font-size: 8.5pt; text-align: center;">Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal - Kode Pos 52416</p>
            <p style="margin: 0; font-size: 8.5pt; text-align: center;">Telepon: (0283) 6197673 | Email: dpupr@tegalkab.go.id</p>
          </td>
        </tr>
      </table>

      <!-- Judul Dokumen SPK -->
      <div style="text-align: center; margin-top: 14pt; margin-bottom: 14pt;">
        <p style="font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; text-decoration: underline; text-align: center;">
          SURAT PERINTAH KERJA
        </p>
        <p style="font-size: 10pt; margin: 2pt 0 0 0; text-align: center;">
          Nomor : ${spk.nomorSpk || '602.1/SPK-PWS/01/DPUPR/2026'}
        </p>
        <p style="font-size: 10pt; margin: 1pt 0 0 0; text-align: center;">
          Tanggal ${tanggalSpkFormatted}
        </p>
      </div>

      <!-- Uraian Kegiatan & Paket Pengawasan -->
      <div style="text-align: center; margin-top: 14pt; margin-bottom: 14pt;">
        <p style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center;">
          ${spk.kegiatan || 'KEGIATAN PENYELENGGARAAN BANGUNAN GEDUNG DI WILAYAH DAERAH KABUPATEN/KOTA, PEMBERIAN IZIN MENDIRIKAN BANGUNAN (IMB) DAN SERTIFIKAT LAIK FUNGSI BANGUNAN GEDUNG'}
        </p>
        <p style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin: 0 0 3pt 0; text-align: center;">
          PAKET PEKERJAAN JASA KONSULTANSI PENGAWASAN ${spk.namaPaket.toUpperCase()}
        </p>
        <p style="font-size: 10pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center;">
          ${spk.perubahanAnggaran || `TAHUN ANGGARAN ${spk.tahunAnggaran || 2026}`}
        </p>
      </div>

      <!-- Ringkasan Data Kontrak Cover -->
      <div style="margin-top: 16pt; margin-bottom: 20pt; padding: 0 10pt;">
        <table style="width: 100%; font-size: 10pt;">
          <tr>
            <td style="width: 130pt; padding: 2.5pt 0; vertical-align: top;">Lokasi Pekerjaan</td>
            <td style="width: 15pt; padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
            <td style="padding: 2.5pt 0; vertical-align: top;">${spk.lokasiPekerjaan}</td>
          </tr>
          <tr>
            <td style="padding: 2.5pt 0; vertical-align: top;">Sumber Dana</td>
            <td style="padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
            <td style="padding: 2.5pt 0; vertical-align: top;">${spk.sumberDana || 'APBD DAU Kabupaten Tegal'}</td>
          </tr>
          <tr>
            <td style="padding: 2.5pt 0; vertical-align: top;">Tahun Anggaran</td>
            <td style="padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
            <td style="padding: 2.5pt 0; vertical-align: top;">${spk.tahunAnggaran || 2026}</td>
          </tr>
          <tr>
            <td style="padding: 2.5pt 0; vertical-align: top;">Nilai Kontrak</td>
            <td style="padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
            <td style="padding: 2.5pt 0; vertical-align: top;">
              <strong>${formatRupiah(spk.nilaiKontrak)}</strong><br/>
              <em>(${spk.nilaiKontrakTerbilang})</em>
            </td>
          </tr>
          <tr>
            <td style="padding: 2.5pt 0; vertical-align: top;">Masa pelaksanaan</td>
            <td style="padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
            <td style="padding: 2.5pt 0; vertical-align: top;">${spk.jangkaWaktuHari} (${spk.jangkaWaktuHuruf || '-'}) Hari Kalender</td>
          </tr>
          <tr>
            <td style="padding: 2.5pt 0; vertical-align: top;">Mulai</td>
            <td style="padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
            <td style="padding: 2.5pt 0; vertical-align: top;">${tanggalMulaiFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 2.5pt 0; vertical-align: top;">Sampai Dengan</td>
            <td style="padding: 2.5pt 0; text-align: center; vertical-align: top;">:</td>
            <td style="padding: 2.5pt 0; vertical-align: top;">${tanggalSelesaiFormatted}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Garis Pembatas & Penyedia Cover -->
    <div style="margin-top: 30pt; width: 100%;">
      <div style="border-top: 2pt solid #000000; margin-bottom: 18pt;"></div>
      <div style="text-align: center; padding-bottom: 10pt;">
        <p style="font-size: 9.5pt; text-transform: uppercase; margin: 0 0 2pt 0; letter-spacing: 0.5pt; text-align: center;">PENYEDIA :</p>
        <p style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0 0 2pt 0; text-align: center;">${cleanPenyediaNama}</p>
        <p style="font-size: 9.5pt; margin: 0; text-align: center;">${spk.penyediaAlamat}</p>
      </div>
    </div>
  </div>

  <!-- Page Break ke Lembar 2 -->
  <br clear="all" style="page-break-before: always; mso-break-type: page-break;" />

  <!-- ======================================================== -->
  <!-- LEMBAR 2: FORMULIR TABEL SPK KONSULTAN PENGAWAS         -->
  <!-- ======================================================== -->
  <!-- Kop Surat DPUPR di Atas Formulir Tabel -->
  <table style="width: 100%; border-bottom: 2.5pt double #000000; padding-bottom: 3pt; margin-bottom: 12pt;">
    <tr>
      <td style="width: 70pt; text-align: center; vertical-align: middle;">
        <img src="${LOGO_KAB_TEGAL_BASE64}" width="65" height="80" alt="Logo Kab Tegal" />
      </td>
      <td style="text-align: center; vertical-align: middle; padding-left: 8pt;">
        <p style="margin: 0; font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; text-align: center;">PEMERINTAH KABUPATEN TEGAL</p>
        <p style="margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; text-align: center;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG</p>
        <p style="margin: 1pt 0 0 0; font-size: 8.5pt; text-align: center;">Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal - Kode Pos 52416</p>
        <p style="margin: 0; font-size: 8.5pt; text-align: center;">Telepon: (0283) 6197673 | Email: dpupr@tegalkab.go.id</p>
      </td>
    </tr>
  </table>

  <!-- Tabel Utama 12 Baris SPK Konsultan Pengawas -->
  <table style="width: 100%; border: 1px solid #000000; border-collapse: collapse; font-size: 9.5pt; line-height: 1.25;">
    <!-- Baris 1: Header SPK & Dinas -->
    <tr>
      <td rowspan="2" style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        SURAT PERINTAH KERJA<br/>(SPK)
      </td>
      <td style="width: 68%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: middle;">
        DINAS PEKERJAAN UMUM DAN PENATAAN RUANG KABUPATEN TEGAL
      </td>
    </tr>

    <!-- Baris 2: Nomor & Tanggal -->
    <tr>
      <td style="border: 1px solid #000000; padding: 4pt 6pt; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 2pt;">NOMOR DAN TANGGAL SPK:</div>
        <table style="width: 100%; font-size: 9.5pt;">
          <tr>
            <td style="width: 50pt;">Nomor</td>
            <td style="width: 10pt;">:</td>
            <td>${spk.nomorSpk || '602.1/SPK-PWS/01/DPUPR/2026'}</td>
          </tr>
          <tr>
            <td>Tanggal</td>
            <td>:</td>
            <td>${tanggalSpkFormatted}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Baris 3: Pejabat Penandatangan Kontrak -->
    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        NAMA PEJABAT PENANDATANGAN KONTRAK
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt; vertical-align: top;">
        <table style="width: 100%; font-size: 9.5pt; margin-bottom: 3pt;">
          <tr>
            <td style="width: 90pt;">Nama</td>
            <td style="width: 10pt;">:</td>
            <td><strong>${spk.ppkNama}</strong></td>
          </tr>
          <tr>
            <td>NIP</td>
            <td>:</td>
            <td>${spk.ppkNip}</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>${spk.ppkJabatan}</td>
          </tr>
          <tr>
            <td>Berkedudukan di</td>
            <td>:</td>
            <td>${spk.ppkAlamat || 'Jl. Cut Nyak Dien Slawi'}</td>
          </tr>
        </table>
        <p style="text-align: justify; font-size: 9pt; margin: 0; line-height: 1.25;">
          yang bertindak untuk dan atas nama*) Pemerintah Indonesia c.q. Pemerintah Kabupaten Tegal c.q. Satuan Kerja Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal. berdasarkan ${spk.ppkSkPengangkatanText || 'Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor 07 Tahun 2026 tanggal 12 Januari 2026 tentang Penunjukan Pejabat Pembuat Komitmen (PPKom) Pada Dinas Pekerjaan Umum Dan Penataan Ruang Kabupaten Tegal Tahun Anggaran 2026'} selanjutnya disebut “Pejabat Penandatangan Kontrak”, dengan:
        </p>
      </td>
    </tr>

    <!-- Baris 4: Nama Penyedia -->
    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        NAMA PENYEDIA
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt; vertical-align: top;">
        <table style="width: 100%; font-size: 9.5pt; margin-bottom: 3pt;">
          <tr>
            <td style="width: 105pt;">Nama</td>
            <td style="width: 10pt;">:</td>
            <td><strong>${spk.penyediaNamaPimpinan}</strong></td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>${spk.penyediaJabatanPimpinan}</td>
          </tr>
          <tr>
            <td>Berkedudukan di</td>
            <td>:</td>
            <td>${spk.penyediaAlamat}</td>
          </tr>
          <tr>
            <td>Akta Notaris Nomor</td>
            <td>:</td>
            <td>${spk.penyediaAktaNotarisNomor || '25'}</td>
          </tr>
          <tr>
            <td>Tanggal</td>
            <td>:</td>
            <td>${spk.penyediaAktaNotarisTanggal || '31 Agustus 2021'}</td>
          </tr>
          <tr>
            <td>Notaris</td>
            <td>:</td>
            <td>${spk.penyediaAktaNotarisNama || 'UNTUNG DWIKORIANTO, SH., SpN'}</td>
          </tr>
        </table>
        <p style="text-align: justify; font-size: 9pt; margin: 0; line-height: 1.25;">
          yang bertindak untuk dan atas nama <strong>${cleanPenyediaNama}</strong> selanjutnya disebut “Penyedia”.
        </p>
      </td>
    </tr>

    <!-- Baris 5: Wakil Sah -->
    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        WAKIL SAH PEJABAT PENANDATANGAN KONTRAK
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt; vertical-align: top;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">Wakil Sah Pejabat Penandatangan Kontrak</p>
        <p style="margin: 0;">Untuk Pejabat Penandatangan Kontrak: <strong>${spk.wakilSahPpk || 'Tidak ada'}</strong></p>
      </td>
    </tr>

    <!-- Baris 6: Paket Pengadaan -->
    <tr>
      <td style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase; text-align: center; vertical-align: top;">
        PAKET PENGADAAN: JASA KONSULTANSI PENGAWASAN ${spk.namaPaket.toUpperCase()}
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt; vertical-align: top;">
        <div style="margin-bottom: 4pt;">
          <div style="font-weight: bold; text-transform: uppercase; font-size: 8.5pt;">NOMOR DAN TANGGAL SURAT UNDANGAN PENGADAAN LANGSUNG:</div>
          <table style="width: 100%; font-size: 9.5pt;">
            <tr>
              <td style="width: 50pt;">Nomor</td>
              <td style="width: 10pt;">:</td>
              <td>${spk.nomorUndanganPengadaan || '003.2/DPUPR/Pws.Brigif/PP/03/2026'}</td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>:</td>
              <td>${spk.tanggalUndanganPengadaan ? formatTanggalIndo(spk.tanggalUndanganPengadaan) : '11 Juni 2026'}</td>
            </tr>
          </table>
        </div>
        <div>
          <div style="font-weight: bold; text-transform: uppercase; font-size: 8.5pt;">NOMOR DAN TANGGAL BERITA ACARA HASIL PEMILIHAN:</div>
          <table style="width: 100%; font-size: 9.5pt;">
            <tr>
              <td style="width: 50pt;">Nomor</td>
              <td style="width: 10pt;">:</td>
              <td>${spk.nomorBahpl || '003.2/DPUPR/Pws.Brigif/PP/07/2026'}</td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>:</td>
              <td>${spk.tanggalBahpl ? formatTanggalIndo(spk.tanggalBahpl) : '17 Juni 2026'}</td>
            </tr>
          </table>
        </div>
      </td>
    </tr>

    <!-- Baris 7: Sumber Dana -->
    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt; text-align: justify; line-height: 1.25;">
        <strong>SUMBER DANA :</strong> ${spk.sumberDana || 'APBD DAU Kabupaten Tegal'} dibebankan atas DPPA Nomor ${spk.dppaNomor || 'DPPA/A.2/1.03.0.00.0.01.0000/001/2026'} ${spk.perubahanAnggaran || `Tahun Anggaran ${spk.tahunAnggaran || 2026}`} untuk mata anggaran kegiatan ${spk.mataAnggaran || spk.kegiatan || 'Penyelenggaraan Bangunan Gedung Di Wilayah Daerah Kabupaten/Kota, Pemberian Izin Mendirikan Bangunan (IMB) dan Sertifikat Laik Fungsi Bangunan Gedung'}
      </td>
    </tr>

    <!-- Baris 8: Harga Kontrak -->
    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt; text-align: justify;">
        Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) adalah sebesar <strong>${formatRupiah(spk.nilaiKontrak)}</strong> (${spk.nilaiKontrakTerbilang})
      </td>
    </tr>

    <!-- Baris 9: Sistem Pembayaran -->
    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt;">
        <p style="font-weight: bold; margin: 0 0 2pt 0;">SISTEM PEMBAYARAN</p>
        <p style="margin: 0 0 2pt 0;">
          1. Pembayaran untuk kontrak ini dilakukan ke <strong>${spk.penyediaBank || 'Bank Jateng Cabang Slawi'}</strong> rekening nomor : <strong>${spk.penyediaNomorRekening || '1035-01626-7'}</strong> atas nama Penyedia : <strong>${spk.penyediaNamaRekening || cleanPenyediaNama}</strong>
        </p>
        <p style="margin: 0;">
          2. Pembayaran dilakukan dengan pembayaran secara <strong>${(spk.sistemPembayaran || 'sekaligus').toLowerCase().includes('termin') ? 'termin' : (spk.sistemPembayaran || '').toLowerCase().includes('bulanan') ? 'bulanan' : 'sekaligus'}</strong>.
        </p>
      </td>
    </tr>

    <!-- Baris 10: Jenis Kontrak -->
    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt;">
        <strong>Jenis Kontrak:</strong> ${spk.jenisKontrak || 'Lumpsum'}
      </td>
    </tr>

    <!-- Baris 11: Waktu Pelaksanaan Pekerjaan -->
    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 4pt 6pt;">
        <strong>WAKTU PELAKSANAAN PEKERJAAN:</strong> ${spk.jangkaWaktuHari} (${spk.jangkaWaktuHuruf || '-'}) hari kalender
      </td>
    </tr>

    <!-- Baris 12: Kolom Tanda Tangan Formulir Tabel -->
    <tr>
      <td colspan="2" style="border: 1px solid #000000; padding: 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; border-right: 1px solid #000000; padding: 8pt 10pt; text-align: center; vertical-align: top;">
              <p style="margin: 0; font-size: 9.5pt; text-align: center;">Untuk dan atas nama</p>
              <p style="margin: 0; font-size: 9.5pt; text-align: center;">Dinas PUPR Kabupaten Tegal</p>
              <p style="margin: 2pt 0 45pt 0; font-size: 9pt; font-weight: bold; font-style: italic; text-align: center;">
                ${spk.ppkJabatan}<br/>Selaku Pejabat Penandatangan Kontrak
              </p>
              <p style="margin: 0; font-weight: bold; text-decoration: underline; font-size: 10pt; text-align: center;">${spk.ppkNama}</p>
              <p style="margin: 1pt 0 0 0; font-size: 9pt; text-align: center;">NIP. ${spk.ppkNip}</p>
            </td>
            <td style="width: 50%; padding: 8pt 10pt; text-align: center; vertical-align: top;">
              <p style="margin: 0; font-size: 9.5pt; text-align: center;">Untuk dan atas nama Penyedia</p>
              <p style="margin: 0 0 45pt 0; font-weight: bold; text-transform: uppercase; font-size: 9.5pt; text-align: center;">${cleanPenyediaNama}</p>
              <p style="margin: 0; font-weight: bold; text-decoration: underline; font-size: 10pt; text-align: center;">${spk.penyediaNamaPimpinan}</p>
              <p style="margin: 1pt 0 0 0; font-size: 9pt; text-align: center;">${spk.penyediaJabatanPimpinan}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Page Break ke Lembar 3+ -->
  <br clear="all" style="page-break-before: always; mso-break-type: page-break;" />

  <!-- ======================================================== -->
  <!-- LEMBAR 3+: SYARAT UMUM SURAT PERINTAH KERJA (SPK)        -->
  <!-- ======================================================== -->
  <div style="text-align: center; margin-top: 10pt; margin-bottom: 12pt;">
    <p style="font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center;">
      SYARAT UMUM
    </p>
    <p style="font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; text-align: center;">
      SURAT PERINTAH KERJA (SPK)
    </p>
  </div>

  <!-- Daftar 27 Pasal SPK Konsultan Pengawas -->
  ${clausesHtml}

  <!-- Bagian Penutup & Tanda Tangan SPK (Utuh Tidak Terpotong) -->
  <div style="page-break-inside: avoid; mso-pagination: widow-orphan; margin-top: 14pt;">
    <p style="font-size: 10pt; text-align: justify; line-height: 1.35; margin-bottom: 4pt;">
      SPK untuk melaksanakan Pekerjaan Jasa Konsultansi Pengawasan ${spk.namaPaket} ini, beserta lampiran-lampiranya merupakan bagian tak terpisahkan, dibuat dalam rangkap 3 (Tiga) bermaterai untuk Pejabat Penandatangan Kontrak dan Penyedia serta masing-masing mempunyai kekuatan hukum yang sama.
    </p>
    <p style="font-size: 10pt; text-align: justify; line-height: 1.35; margin-bottom: 4pt;">
      SPK ini mulai berlaku efektif terhitung sejak tanggal yang ditetapkan dalam SPK dengan tanggal mulai dan penyelesaian keseluruhan pekerjaan sebagaimana diatur dalam SPMK.
    </p>
    <p style="font-size: 10pt; text-align: justify; line-height: 1.35; margin-bottom: 10pt;">
      Dengan demikian, Pejabat Penandatangan Kontrak dan Penyedia telah bersepakat untuk menandatangani SPK ini pada tanggal tersebut di atas dan melaksanakan SPK sesuai dengan ketentuan peraturan perundang-undangan di Republik Indonesia.
    </p>

    <!-- Tanda Tangan Penutup Berdampingan -->
    <table style="width: 100%; margin-top: 12pt; text-align: center; page-break-inside: avoid;">
      <tr>
        <td style="width: 50%; vertical-align: top; padding: 0 10pt;">
          <p style="font-size: 9.5pt; margin: 0; text-align: center;">Untuk dan atas nama</p>
          <p style="font-size: 9.5pt; margin: 0; text-align: center;">Dinas PUPR Kabupaten Tegal</p>
          <p style="font-size: 9pt; margin: 0 0 2pt 0; text-align: center;">${spk.ppkJabatan}</p>
          <p style="font-size: 9pt; font-style: italic; font-weight: bold; margin: 0 0 45pt 0; text-align: center;">
            Selaku Pejabat Penandatangan Kontrak
          </p>
          <p style="font-weight: bold; text-decoration: underline; font-size: 10pt; margin: 0; text-align: center;">${spk.ppkNama}</p>
          <p style="margin: 1pt 0 0 0; font-size: 9pt; text-align: center;">NIP. ${spk.ppkNip}</p>
        </td>
        <td style="width: 50%; vertical-align: top; padding: 0 10pt;">
          <p style="font-size: 9.5pt; margin: 0 0 2pt 0; text-align: center;">Slawi, ${tanggalSpkFormatted}</p>
          <p style="font-size: 9.5pt; margin: 0; text-align: center;">Untuk dan atas nama Penyedia</p>
          <p style="font-weight: bold; text-transform: uppercase; font-size: 9.5pt; margin: 0 0 55pt 0; text-align: center;">${cleanPenyediaNama}</p>
          <p style="font-weight: bold; text-decoration: underline; font-size: 10pt; margin: 0; text-align: center;">${spk.penyediaNamaPimpinan}</p>
          <p style="margin: 1pt 0 0 0; font-size: 9pt; text-align: center;">${spk.penyediaJabatanPimpinan}</p>
        </td>
      </tr>
    </table>
  </div>

  <!-- Running Footer Word Kotak Paraf Koordinasi (Cover Halaman 1 Kosong, Halaman 2+ Muncul) -->
  <div style="mso-element:footer" id="f0">
    <p class="MsoFooter" style="margin: 0;"></p>
  </div>
  <div style="mso-element:footer" id="f1">
    <p class="MsoFooter" style="margin: 0; text-align: right;">
      <table align="right" style="width: 170pt; border-collapse: collapse; border: 1px solid #000000; font-family: 'Times New Roman', serif; font-size: 8.5pt;">
        <tr>
          <td style="border: 1px solid #000000; padding: 2pt 5pt; font-weight: bold; width: 130pt; text-align: left; background-color: #ffffff;">
            Pejabat Penandatangan Kontrak
          </td>
          <td style="border: 1px solid #000000; width: 40pt; height: 16pt; background-color: #ffffff;">&nbsp;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000000; padding: 2pt 5pt; font-weight: bold; width: 130pt; text-align: left; background-color: #ffffff;">
            Penyedia
          </td>
          <td style="border: 1px solid #000000; width: 40pt; height: 16pt; background-color: #ffffff;">&nbsp;</td>
        </tr>
      </table>
    </p>
  </div>

</div>
</body>
</html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SPK_PENGAWAS_${safeDocName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }
}

