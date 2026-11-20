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

    // 1. Sub-paren like 1), 2), a), b)
    const parenMatch = trimmed.match(/^(\d+|[a-zA-Z])\)\s+(.*)$/);
    if (parenMatch) {
      return `<p style="margin: 0 0 3pt 56pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${parenMatch[1]})&nbsp;&nbsp;${parseRichTextToHtml(parenMatch[2])}</p>`;
    }

    // 2. (1), (a)
    const fullParenMatch = trimmed.match(/^\(([a-zA-Z0-9]+)\)\s+(.*)$/);
    if (fullParenMatch) {
      return `<p style="margin: 0 0 3pt 56pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">(${fullParenMatch[1]})&nbsp;&nbsp;${parseRichTextToHtml(fullParenMatch[2])}</p>`;
    }

    // 3. Numbered with dot like 1. , 14.1.
    const numDotMatch = trimmed.match(/^(\d+(?:\.\d+)*)\.\s+(.*)$/);
    if (numDotMatch) {
      return `<p style="margin: 0 0 3pt 56pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${numDotMatch[1]}.&nbsp;&nbsp;${parseRichTextToHtml(numDotMatch[2])}</p>`;
    }

    // 4. Letter with dot like a., b., c.
    const letterDotMatch = trimmed.match(/^([a-zA-Z])\.\s+(.*)$/);
    if (letterDotMatch) {
      return `<p style="margin: 0 0 3pt 38pt; text-indent: -18pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${letterDotMatch[1]}.&nbsp;&nbsp;${parseRichTextToHtml(letterDotMatch[2])}</p>`;
    }

    // 5. Standard paragraph (flush with title text at 20pt)
    return `<p style="margin: 0 0 3pt 20pt; font-size: 10pt; line-height: 1.35; text-align: justify;">${parseRichTextToHtml(trimmed)}</p>`;
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

  <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />

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
      <td rowspan="2" style="width: 32%; border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; vertical-align: middle; text-align: left;">
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
      <td style="border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase;">
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
      <td style="border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase;">
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
      <td style="border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase;">
        WAKIL SAH PEJABAT PENANDATANGAN KONTRAK
      </td>
      <td style="border: 1px solid #000000; padding: 4pt 6pt;">
        <strong>Wakil Sah Pejabat penandatangan kontrak</strong><br/>
        Untuk Pejabat penandatangan kontrak: ${spk.wakilSahPpk || 'Tidak ada'}
      </td>
    </tr>

    <tr>
      <td style="border: 1px solid #000000; padding: 4pt 6pt; font-weight: bold; text-transform: uppercase;">
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

  <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />

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

  <!-- Penutup SPK -->
  <div style="margin-top: 14pt; padding-top: 8pt; border-top: 1px solid #000000;">
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 4pt;">
      SPK untuk melaksanakan Pekerjaan ${spk.namaPaket} ini, beserta lampiran-lampiranya merupakan bagian tak terpisahkan, dibuat dalam rangkap 3 (tiga) bermaterai untuk Pejabat Penandatangan Kontrak dan Penyedia serta masing-masing mempunyai kekuatan hukum yang sama.
    </p>
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 4pt;">
      SPK ini mulai berlaku efektif terhitung sejak tanggal yang ditetapkan dalam SPK dengan tanggal mulai dan penyelesaian keseluruhan pekerjaan sebagaimana diatur dalam SPMK.
    </p>
    <p style="font-size: 9.5pt; text-align: justify; margin-bottom: 6pt;">
      Dengan demikian, Pejabat Penandatangan Kontrak dan Penyedia telah bersepakat untuk menandatangani SPK ini pada tanggal tersebut di atas dan melaksanakan SPK sesuai dengan ketentuan peraturan perundang-undangan di Republik Indonesia.
    </p>
  </div>

  <!-- Tanda Tangan Penutup -->
  <table style="width: 100%; margin-top: 14pt; font-size: 10pt; text-align: center;">
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
    link.download = `SPK_FISIK_${safeDocName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  // =========================================================================
  // EXPORT SPK PENGAWAS & PERENCANA
  // =========================================================================
  const jenisSpkJudul = 
    spk.spkType === 'pengawas'
      ? 'SURAT PERINTAH KERJA (SPK)<br/>JASA KONSULTANSI PENGAWASAN TEKNIS'
      : 'SURAT PERINTAH KERJA (SPK)<br/>JASA KONSULTANSI PERENCANAAN TEKNIS (DED)';

  const lingkupHtml = (spk.ruangLingkup || []).map((item, idx) => `
    <tr>
      <td style="width: 25pt; vertical-align: top; text-align: center; font-size: 10pt; padding: 2pt 4pt; border: 1px solid #000;">${idx + 1}.</td>
      <td style="vertical-align: top; font-size: 10pt; padding: 2pt 6pt; border: 1px solid #000;">${item}</td>
    </tr>
  `).join('');

  const personelHtml = (spk.personelList || []).map((p, idx) => `
    <tr>
      <td style="width: 25pt; text-align: center; font-size: 10pt; padding: 2pt 4pt; border: 1px solid #000;">${idx + 1}.</td>
      <td style="font-size: 10pt; font-weight: bold; padding: 2pt 6pt; border: 1px solid #000;">${p.nama}</td>
      <td style="font-size: 10pt; padding: 2pt 6pt; border: 1px solid #000;">${p.posisi}</td>
      <td style="font-size: 10pt; padding: 2pt 6pt; border: 1px solid #000;">${p.kualifikasi}</td>
    </tr>
  `).join('');

  const clausesHtml = (spk.clauses || []).filter(c => c.isActive).map(c => `
    <div style="margin-top: 10pt; margin-bottom: 8pt;">
      <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin: 0 0 3pt 0; font-size: 10.5pt;">
        Pasal ${c.pasal}<br/>${c.judul}
      </p>
      <div style="text-align: justify; font-size: 10pt; line-height: 1.4;">
        ${formatCustomClauseForWord(c.isi)}
      </div>
    </div>
  `).join('');

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
      mso-footer: f1;
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
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">6. Cara Pembayaran</td>
      <td style="padding: 4pt 6pt; border: 1px solid #000;">
        <strong>${spk.sistemPembayaran}</strong><br/>
        <span style="font-size: 9.5pt;">${spk.keteranganPembayaran}</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 4pt 6pt; border: 1px solid #000; font-weight: bold; background-color: #f2f2f2;">7. Denda Keterlambatan</td>
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
  link.download = `SPK_${spk.spkType.toUpperCase()}_${safeDocName}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
