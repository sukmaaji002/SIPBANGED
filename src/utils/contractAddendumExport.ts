import type { ContractAddendumDocument } from '../types';
import { angkaKeTerbilang, angkaKeTerbilangHari, formatTanggalIndo, parseKomponenTanggalKontrak } from './formatters';
import { addendumOrder } from './contractAddendum';
import logo from '../assets/logo-kab-tegal-addendum.jpg?inline';

function escapeHtml(value: string): string {
  return (value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] ?? character);
}

export const paragraph = (value: string) => {
  if (!value.startsWith('<div data-rich-clause="1">')) {
    return escapeHtml(value)
      .replace(/&lt;(\/?(?:b|strong|i|em|u|s))&gt;/gi, '<$1>')
      .replace(/\r?\n/g, '<br>');
  }
  const parsed = new DOMParser().parseFromString(value, 'text/html');
  const permitted = new Set(['DIV', 'P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'SPAN', 'FONT', 'BLOCKQUOTE', 'OL', 'UL', 'LI']);
  const clean = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? '');
    if (!(node instanceof HTMLElement)) return '';
    const content = Array.from(node.childNodes).map(clean).join('');
    if (!permitted.has(node.tagName)) return content;
    const tag = node.tagName.toLowerCase();
    const styles: string[] = [];
    const align = node.style.textAlign || node.getAttribute('align');
    if (align && ['left', 'center', 'right', 'justify'].includes(align)) styles.push('text-align:' + align);
    const family = node.getAttribute('face');
    if (family && ['Arial', 'Times New Roman', 'Calibri'].includes(family)) styles.push('font-family:' + family);
    const size = node.getAttribute('size');
    if (size && ['2', '3', '4', '5'].includes(size)) styles.push('font-size:' + ({'2':'10pt','3':'12pt','4':'14pt','5':'18pt'}[size]));
    const style = styles.length ? ' style="' + styles.join(';') + '"' : '';
    return '<' + tag + style + '>' + content + (tag === 'br' ? '' : '</' + tag + '>');
  };
  return Array.from(parsed.body.childNodes).map(clean).join('');
};

const letterhead = `
  <table class="letterhead"><tbody><tr>
    <td class="crest"><img src="${logo}" alt="Lambang Kabupaten Tegal" width="94" height="113"></td>
    <td class="agency">
      <p class="government">PEMERINTAH KABUPATEN TEGAL</p>
      <p class="department">DINAS PEKERJAAN UMUM<br>DAN PENATAAN RUANG (DPUPR)</p>
      <p class="contact">Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal – Kode Pos 52416<br>Telepon (0283) 6197673 – Email: dpupr@tegalkab.go.id</p>
    </td>
  </tr></tbody></table>`;

const styles = `
  @page{size:215.9mm 330.2mm;margin:23.6mm 15mm 30mm 25mm}
  *{box-sizing:border-box}
  body{margin:0;color:#000;font:11pt/1.15 "Trebuchet MS",Arial,sans-serif;overflow-wrap:anywhere}
  p{margin:0}
  .cover,.main-heading,.agency,.signatures{text-align:center}
  table{width:100%;border-collapse:collapse}
  td{vertical-align:top}
  .letterhead{border-bottom:2.25pt solid #000;margin:0 0 17pt}
  .letterhead td{vertical-align:middle;padding:0 0 7pt}
  .crest{width:16%;text-align:left;padding-left:8pt!important}
  .government{font-size:15pt}
  .department{font-size:20pt;font-weight:bold}
  .contact{font-size:10.5pt;margin-top:2pt}
  .title{font-size:18pt;font-weight:bold}
  .cover .document-number{margin-top:14pt;font-size:12pt}
  .cover .document-date{font-size:12pt}
  .project-summary{margin:28pt 0 13pt;font-size:12pt;font-weight:bold}
  .project-summary p{margin:2pt 10pt}
  .cover-data{width:97%;margin:auto;text-align:left}
  .cover-data td{padding:1pt 3pt}
  .cover-data td:first-child{width:28.6%}
  .cover-data td:nth-child(2){width:3.1%}
  .provider{border-top:2.25pt solid #000;margin-top:11pt;padding-top:20pt;font-size:12pt}
  .provider-name{font-size:18pt;font-weight:bold}
  .main-heading{margin:0 0 22pt;font-weight:bold}
  .package-title{margin-top:10pt}
  .narrative{padding:0 2.5mm}
  .narrative>p,.parties,.basis{margin:0 0 10pt;text-align:justify}
  .basis{padding-left:21pt}
  .parties p+p{margin-top:10pt}
  .clause{margin:0 0 8pt}
  .clause-heading{margin:0 0 3pt;break-after:avoid;page-break-after:avoid}
  .clause-heading strong{display:inline-block;min-width:58pt}
  .clause-label{font-weight:bold;margin-top:7pt;break-after:avoid;page-break-after:avoid}
  .clause-content{margin:2pt 0 0;white-space:pre-wrap}
  .clause-label,.clause-content{margin-left:21pt}
  .clause-content ol,.clause-content ul{margin:2pt 0;padding-left:23pt}
  .signatures{table-layout:fixed;margin-top:12pt;break-inside:avoid;page-break-inside:avoid}
  .signatures td{width:50%;padding:0 7pt}
  .signature-name td{padding-top:55pt}
  .footer{display:flex;justify-content:space-between;gap:10pt;font-size:8pt;font-style:italic;border-top:.75pt solid #000}
  .footer span{padding-top:4pt}
  .footer table{width:207pt;text-align:left;font-size:7pt;font-style:normal}
  .footer td{border:1px solid #000;padding:4pt 6pt}
  .footer td+td{width:38pt}
  @media screen{
    html{background:#f1f3f5}
    .cover,.main-document{width:215.9mm;margin:12px auto;padding:23.6mm 15mm 30mm 25mm;background:#fff}
    .cover{min-height:330.2mm}
    .footer{margin:12pt auto;width:calc(215.9mm - 40mm)}
  }
  @media print{
    .cover{break-after:page;page-break-after:always}
    .footer{display:none}
    .letterhead,.cover-data tr{break-inside:avoid;page-break-inside:avoid}
  }`;

export function contractAddendumHtml(document: ContractAddendumDocument): string {
  const { sumber, nomor, tanggal, uraian, format } = document;
  const details = sumber.rincian ?? {};
  const title = sumber.jenis === 'spk' ? 'Surat Perintah Kerja' : 'Surat Perjanjian';
  const order = format?.urutan ?? addendumOrder(nomor) ?? 1;
  const heading = 'Addendum Ke-' + order;
  const footerLabel = 'Addendum ke-' + order + ' ' + title;
  const printFooter = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="664" height="65" viewBox="0 0 664 65">
    <path d="M0 .5H664 M391 4.5H663.5V60.5H391Z M391 32.5H664 M611.5 5V61" fill="none" stroke="black"/>
    <text x="6" y="21" font-family="Trebuchet MS, Arial, sans-serif" font-size="11" font-style="italic">${footerLabel}</text>
    <g font-family="Trebuchet MS, Arial, sans-serif" font-size="10"><text x="399" y="22">Pejabat Penandatangan Kontrak</text><text x="399" y="50">Penyedia</text></g>
  </svg>`);
  const packageName = escapeHtml(sumber.namaPaket);
  const supplier = escapeHtml(sumber.penyedia);
  const supplierName = escapeHtml(sumber.penandaTanganPenyedia);
  const official = escapeHtml(sumber.ppk);
  const date = parseKomponenTanggalKontrak(tanggal);
  const dateWords = `hari ${date.hari} tanggal ${date.tanggalTeks} bulan ${date.bulanTeks} tahun ${angkaKeTerbilangHari(Number(date.tahunAngka)).toLowerCase()} (${date.tanggalBulanTahunAngka})`;
  const revisions = [...(format?.revisi ?? [])].sort((a, b) => a.urutan - b.urutan);
  let terms = { nilai: details.nilai, durasi: details.durasi, selesai: details.selesai };
  const effective = revisions.map(item => {
    terms = { nilai: item.nilai ?? terms.nilai, durasi: item.durasi ?? terms.durasi, selesai: item.selesai || terms.selesai };
    return { ...terms, urutan: item.urutan };
  });
  const rupiah = (amount?: number) => amount == null || !Number.isFinite(amount) ? '' :
    `Rp ${amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${angkaKeTerbilang(amount)})`;
  const days = (count?: number) => count && Number.isFinite(count) ? `${count} (${angkaKeTerbilangHari(count)}) Hari Kalender` : '';
  const dateText = (day?: string) => day ? formatTanggalIndo(day) : '';
  const row = (label: string, value?: string | number) =>
    `<tr><td>${label}</td><td>:</td><td>${escapeHtml(value == null || value === '' ? '—' : String(value))}</td></tr>`;
  const sections = sumber.pasal.map(clause => {
    const label = escapeHtml(clause.label);
    const title = escapeHtml(clause.judul);
    const isArticle = /^Pasal\s+\d+$/i.test(clause.label);
    return `<section class="clause">
      <p class="clause-heading"><strong>${label}</strong>${!isArticle && title ? ' ' + title + ' ' : ' '}${clause.perubahan === undefined ? 'tetap' : 'berubah'};</p>
      ${clause.perubahan === undefined ? '' :
        `<p class="clause-label">SEMULA</p><div class="clause-content">${paragraph(clause.sebelumnya)}</div>
          <p class="clause-label">MENJADI</p><div class="clause-content">${paragraph(clause.perubahan)}</div>`}
    </section>`;
  }).join('');
  const initialContract = [
    sumber.nomorKontrakAwal && 'Nomor : ' + escapeHtml(sumber.nomorKontrakAwal),
    sumber.tanggalKontrakAwal && 'tanggal ' + escapeHtml(dateText(sumber.tanggalKontrakAwal)),
  ].filter(Boolean).join(' ');
  const previous = sumber.id.startsWith('addendum:') && sumber.nomor
    ? ' Perubahan ini mengacu pada addendum sebelumnya Nomor : ' + escapeHtml(sumber.nomor) + (sumber.tanggal ? ' tanggal ' + escapeHtml(dateText(sumber.tanggal)) : '') + '.'
    : '';
  const decree = details.ppkNomorSk
    ? ' berdasarkan Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor ' +
      escapeHtml(details.ppkNomorSk) + (details.ppkTanggalSk ? ' tanggal ' + escapeHtml(dateText(details.ppkTanggalSk)) : '') +
      ' tentang Penunjukan Pejabat Pembuat Komitmen (PPKom) pada Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal' +
      (details.tahun ? ' Tahun Anggaran ' + details.tahun : '')
    : '';
  const deed = details.aktaNomor ? ' berdasarkan Akta Notaris No. ' + escapeHtml(details.aktaNomor) +
    (details.aktaTanggal ? ' tanggal ' + escapeHtml(dateText(details.aktaTanggal)) : '') +
    (details.aktaNotaris ? ' yang dikeluarkan oleh Notaris ' + escapeHtml(details.aktaNotaris) : '') : '';
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
    <title>${heading} ${escapeHtml(nomor)}</title><style>${styles}@page{@bottom-center{content:url("data:image/svg+xml,${printFooter}");vertical-align:middle}}</style></head><body>
    <section class="cover">
      ${letterhead}
      <p class="title">${heading.toUpperCase()}<br>${title.toUpperCase()}</p>
      <p class="document-number">Nomor : ${escapeHtml(nomor)}</p>
      <p class="document-date">Tanggal ${escapeHtml(dateText(tanggal))}</p>
      <div class="project-summary">
        ${details.kegiatan ? '<p>KEGIATAN ' + escapeHtml(details.kegiatan.replace(/^kegiatan\s+/i, '')) + '</p>' : ''}
        <p>PEKERJAAN ${escapeHtml(sumber.namaPaket.toUpperCase())}</p>
        ${details.tahun ? '<p>TAHUN ANGGARAN ' + details.tahun + '</p>' : ''}
      </div>
      <table class="cover-data"><tbody>
        ${row('Lokasi Pekerjaan', details.lokasi)}
        ${row('Sumber Dana', details.dana)}
        ${row('Tahun Anggaran', details.tahun)}
        ${row('Nilai Kontrak', rupiah(details.nilai))}
        ${effective.map(item => row('Nilai Addendum ke-' + item.urutan, rupiah(item.nilai))).join('')}
        ${row('Masa pelaksanaan', days(details.durasi))}
        ${effective.map(item => row('Masa pelaksanaan (Addendum ke-' + item.urutan + ')', days(item.durasi))).join('')}
        ${row('Masa Pemeliharaan', days(details.pemeliharaan))}
        ${row('Mulai', dateText(details.mulai))}
        ${row('Selesai', dateText(details.selesai))}
        ${effective.map(item => row('Selesai (Addendum ke-' + item.urutan + ')', dateText(item.selesai))).join('')}
      </tbody></table>
      <div class="provider"><p>PENYEDIA :</p><p class="provider-name">${supplier}</p>
        ${details.penyediaAlamat ? '<p>' + escapeHtml(details.penyediaAlamat) + '</p>' : ''}</div>
    </section>
    <main class="main-document">
      ${letterhead}
      <div class="main-heading">
        <p class="title">${heading.toUpperCase()}<br>${title.toUpperCase()}</p>
        ${details.jenisKontrak ? '<p>' + escapeHtml(/^kontrak\b/i.test(details.jenisKontrak) ? details.jenisKontrak : 'Kontrak ' + details.jenisKontrak) + '</p>' : ''}
        <p class="package-title">Paket Pekerjaan${format?.jenisPaket ? ' ' + escapeHtml(format.jenisPaket) : ''}<br>${packageName}</p>
        <p>Nomor : ${escapeHtml(nomor)}</p>
      </div>
      <div class="narrative">
        <p>Addendum ${title} ini berikut semua lampirannya (selanjutnya disebut “Addendum Kontrak”) dibuat dan ditandatangani di ${escapeHtml(format?.tempat || 'Slawi')} pada ${escapeHtml(dateWords)} antara :</p>
        <div class="parties">
          <p><strong>${official}</strong> yang bertindak untuk dan atas nama Pemerintah Kabupaten Tegal cq Dinas Pekerjaan Umum dan Penataan Ruang${decree}, selanjutnya disebut “Pejabat Penandatangan Kontrak”, dengan:</p>
          <p><strong>${supplierName}</strong>${details.penyediaJabatan ? ' selaku ' + escapeHtml(details.penyediaJabatan) : ''} yang bertindak untuk dan atas nama <strong>${supplier}</strong>${details.penyediaAlamat ? ' yang berkedudukan di ' + escapeHtml(details.penyediaAlamat) : ''}${deed}, selanjutnya disebut “Penyedia”.</p>
        </div>
        <p>Maka dengan ini kedua belah pihak sepakat dan menyetujui untuk melakukan ${heading} atas ${title} Paket Pekerjaan ${packageName} ${initialContract}.${previous} Dasar perubahan:</p>
        <ol class="basis">${(format?.dasar || uraian).split(/\r?\n/).filter(line => line.trim()).map(line => '<li>' + escapeHtml(line) + '</li>').join('')}</ol>
        <p>Maka dengan ini kedua belah pihak menyetujui semua ketentuan dan perubahan yang tercantum dalam pasal-pasal sebagai berikut :</p>
        ${sections}
        <p>Dengan demikian, Pejabat Penandatangan Kontrak dan Penyedia telah bersepakat untuk menandatangani ${heading} ${title} ini pada tanggal tersebut di atas dan melaksanakannya sesuai dengan ketentuan peraturan perundang-undangan di Republik Indonesia. Addendum ini dibuat dalam 3 (tiga) rangkap, masing-masing dibubuhi meterai, mempunyai kekuatan hukum yang sama dan mengikat bagi para pihak. Rangkap yang lain dapat diperbanyak sesuai kebutuhan tanpa dibubuhi meterai.</p>
      </div>
      <table class="signatures"><tbody>
        <tr><td>Untuk dan Atas Nama Penyedia<br><strong>${supplier}</strong></td>
          <td>Untuk dan Atas Nama:<br><strong>Dinas PUPR Kabupaten Tegal</strong><br>${details.ppkJabatan ? escapeHtml(details.ppkJabatan) + '<br>' : ''}Selaku Pejabat Penandatangan Kontrak</td></tr>
        <tr class="signature-name"><td><strong><u>${supplierName}</u></strong><br>${escapeHtml(details.penyediaJabatan ?? '')}</td>
          <td><strong><u>${official}</u></strong>${details.ppkNip ? '<br>NIP. ' + escapeHtml(details.ppkNip) : ''}</td></tr>
      </tbody></table>
    </main>
    <footer class="footer"><span>${footerLabel}</span><table><tbody>
      <tr><td>Pejabat Penandatangan Kontrak</td><td></td></tr><tr><td>Penyedia</td><td></td></tr>
    </tbody></table></footer>
    </body></html>`;
}
