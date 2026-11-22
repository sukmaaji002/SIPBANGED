import type { ContractAddendumDocument } from '../types';
import { formatTanggalIndo } from './formatters';

function escapeHtml(value: string): string {
  return (value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] ?? character);
}

const paragraph = (value: string) => escapeHtml(value)
  .replace(/&lt;(\/?(?:b|strong|i|em|u|s))&gt;/gi, '<$1>')
  .replace(/\r?\n/g, '<br>');

export function contractAddendumHtml(document: ContractAddendumDocument): string {
  const { sumber, nomor, tanggal, uraian } = document;
  const title = sumber.jenis === 'spk' ? 'Surat Perintah Kerja (SPK)' : 'Surat Perjanjian';
  const sections = sumber.pasal.map(clause => {
    const label = escapeHtml(clause.label);
    const heading = escapeHtml(clause.judul);
    if (clause.perubahan === undefined) {
      return '<section><h2><strong>' + label + ' Sama</strong></h2><p>' + heading + '</p></section>';
    }
    return '<section><h2>' + label + ' · ' + heading + '</h2>' +
      '<h3>Klausul sebelumnya</h3><p>' + paragraph(clause.sebelumnya) + '</p>' +
      '<h3>Klausul perubahan</h3><p>' + paragraph(clause.perubahan) + '</p></section>';
  }).join('');
  return '<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Addendum ' + escapeHtml(nomor) + '</title>' +
    '<style>@page{size:215mm 330mm;margin:18mm}body{margin:20px;color:#111;font:12pt/1.45 "Times New Roman",serif}' +
    'header{text-align:center;border-bottom:1pt solid #555;padding-bottom:12pt}h1{font-size:16pt;margin:0}' +
    'h2{font-size:12pt;margin:11pt 0 4pt}h3{font-size:11pt;margin:6pt 0 2pt}h2,h3{page-break-after:avoid}' +
    'p{margin:4pt 0;overflow-wrap:break-word}section{border-top:1px solid #bbb;margin-top:9pt}' +
    'table{margin-top:24pt;width:100%;table-layout:fixed;page-break-inside:avoid}td{text-align:center;vertical-align:top;padding:4pt}' +
    '@media print{body{margin:0}}</style></head><body>' +
    '<header><h1>ADDENDUM ' + escapeHtml(title.toUpperCase()) + '</h1><p><strong>' +
    escapeHtml(sumber.namaPaket) + '</strong></p><p>Nomor ' + escapeHtml(nomor) + '</p><p>Tanggal ' + escapeHtml(formatTanggalIndo(tanggal)) + '</p></header>' +
    '<p>Kontrak awal: ' + escapeHtml(sumber.nomorKontrakAwal) + ' · ' + escapeHtml(formatTanggalIndo(sumber.tanggalKontrakAwal)) + '</p>' +
    '<p>Dokumen sumber: ' + escapeHtml(sumber.nomor) + ' · ' + escapeHtml(formatTanggalIndo(sumber.tanggal)) + '</p>' +
    '<p>Pejabat Penandatangan Kontrak: ' + escapeHtml(sumber.ppk) + '</p><p>Penyedia: ' + escapeHtml(sumber.penyedia) + '</p>' +
    '<p><strong>Uraian addendum</strong></p><p>' + paragraph(uraian) + '</p>' + sections +
    '<table><tr><td>Pejabat Penandatangan Kontrak</td><td>Untuk Penyedia<br>' + escapeHtml(sumber.penyedia) + '</td></tr>' +
    '<tr><td style="padding-top:55pt"><strong>' + escapeHtml(sumber.ppk) + '</strong></td>' +
    '<td style="padding-top:55pt"><strong>' + escapeHtml(sumber.penandaTanganPenyedia) + '</strong></td></tr></table></body></html>';
}

export function downloadContractAddendum(document: ContractAddendumDocument, html: string) {
  const fileName = 'Addendum-' + document.nomor.replace(/[^a-z0-9.-]+/gi, '-') + '.doc';
  const url = URL.createObjectURL(new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' }));
  const link = window.document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
