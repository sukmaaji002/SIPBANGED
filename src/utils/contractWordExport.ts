import { ProjectContract } from '../types';
import { OFFICIAL_SSUK_SECTIONS } from '../data/ssukData';
import { formatTanggalIndo, formatRupiah, angkaKeTerbilang, parseKomponenTanggalKontrak, resolveContractPlaceholders } from './formatters';
import { parseRuangLingkup } from './ruangLingkupParser';
import { LOGO_KAB_TEGAL_BASE64 } from './logoBase64';

export function generateContractWordDoc(contract: ProjectContract): void {
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

  // Generate Clauses for Surat Perjanjian (Pasal-Pasal Pokok)
  let pasalHtml = '';
  if (activePasalClauses.length > 0) {
    activePasalClauses.forEach((clause, idx) => {
      let content = clause.kontenCustom !== undefined ? clause.kontenCustom : clause.kontenDefault;

      if (clause.id === 'sp-pasal-2') {
        const rawData = clause.kontenCustom !== undefined
          ? clause.kontenCustom
          : (contract.ruangLingkupUtama && contract.ruangLingkupUtama.length > 0
            ? contract.ruangLingkupUtama
            : ['Pekerjaan Persiapan & SMKK', 'Pekerjaan Pondasi & Struktur Beton', 'Pekerjaan Pasangan Dinding & Plesteran', 'Pekerjaan Penutup Lantai & Atap', 'Pekerjaan Mekanikal Elektrikal']);
        const parsed = parseRuangLingkup(rawData);
        content = `Ruang lingkup pekerjaan utama terdiri dari:<br/>` +
          parsed.map((item, i) => `
            <p style="margin: 0 0 2pt 20pt; text-indent: -16pt;">${i + 1}.&nbsp;&nbsp;${item.nama}</p>
            ${item.subItems && item.subItems.length > 0 ? item.subItems.map((sub, sIdx) => `
              <p style="margin: 0 0 2pt 40pt; text-indent: -16pt;">${String.fromCharCode(97 + (sIdx % 26))}.&nbsp;&nbsp;${sub}</p>
            `).join('') : ''}
          `).join('');
      } else if (clause.id === 'sp-pasal-3') {
        content = `1. Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) yang diperoleh berdasarkan total harga penawaran sebagaimana tercantum dalam Daftar Kuantitas dan Harga adalah sebesar <strong>${formatRupiah(contract.nilaiKontrakAngka)}</strong> (<em>${angkaKeTerbilang(contract.nilaiKontrakAngka)}</em>) dengan kode akun kegiatan <strong>${contract.kodeAkunKegiatan}</strong>;<br/>2. Kontrak ini dibiayai dari ${contract.sumberPembiayaan};<br/>3. Pembayaran untuk kontrak ini dilakukan ke ${contract.bankNamaDanCabang} rekening nomor <strong>${contract.nomorRekeningPenyedia}</strong> atas nama Penyedia <strong>${contract.namaRekeningPenyedia}</strong>.`;
      } else if (clause.id === 'sp-pasal-5') {
        content = `1. Masa Kontrak adalah jangka waktu berlakunya Kontrak ini terhitung sejak tanggal penandatanganan Kontrak sampai dengan Tanggal Penyerahan Akhir Pekerjaan (FHO);<br/>2. Masa Pelaksanaan ditentukan dalam Syarat-Syarat Khusus Kontrak, dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan selama <strong>${contract.jangkaWaktuPelaksanaanHari} (${contract.jangkaWaktuPelaksanaanHuruf})</strong> hari kalender;<br/>3. Masa Pemeliharaan ditentukan dalam Syarat-Syarat Khusus Kontrak dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan selama <strong>${contract.jangkaWaktuPemeliharaanHari} (${contract.jangkaWaktuPemeliharaanHuruf})</strong> hari kalender.`;
      } else {
        content = content.replace(/\n/g, '<br/>');
      }

      pasalHtml += `
        <div style="margin-top: 14pt; margin-bottom: 10pt;">
          <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin: 0;">
            Pasal ${idx + 1}<br/>${clause.judul}
          </p>
          <div style="text-align: justify; margin-top: 4pt; font-size: 11pt; line-height: 1.4;">
            ${content}
          </div>
        </div>
      `;
    });
  } else {
    // Default 5 articles
    pasalHtml = `
      <div style="margin-top: 14pt; margin-bottom: 10pt;">
        <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin: 0;">Pasal 1<br/>ISTILAH DAN UNGKAPAN</p>
        <p style="text-align: justify; margin-top: 4pt;">Peristilahan dan ungkapan dalam Surat Perjanjian ini memiliki arti dan makna yang sama seperti yang tercantum dalam lampiran Surat Perjanjian ini.</p>
      </div>

      <div style="margin-top: 14pt; margin-bottom: 10pt;">
        <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin: 0;">Pasal 2<br/>RUANG LINGKUP PEKERJAAN UTAMA</p>
        <p style="text-align: justify; margin-top: 4pt; margin-bottom: 2pt;">Ruang lingkup pekerjaan utama terdiri dari:</p>
        <div>
          ${parseRuangLingkup(contract.ruangLingkupUtama && contract.ruangLingkupUtama.length > 0 ? contract.ruangLingkupUtama : ['Pekerjaan Persiapan', 'Pekerjaan Struktur', 'Pekerjaan Arsitektur']).map((item, i) => `
            <p style="margin: 0 0 2pt 20pt; text-indent: -16pt;">${i + 1}.&nbsp;&nbsp;${item.nama}</p>
            ${item.subItems && item.subItems.length > 0 ? item.subItems.map((sub, sIdx) => `
              <p style="margin: 0 0 2pt 40pt; text-indent: -16pt;">${String.fromCharCode(97 + (sIdx % 26))}.&nbsp;&nbsp;${sub}</p>
            `).join('') : ''}
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 14pt; margin-bottom: 10pt;">
        <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin: 0;">Pasal 3<br/>HARGA KONTRAK, SUMBER PEMBIAYAAN DAN PEMBAYARAN</p>
        <ol style="margin-top: 4pt; padding-left: 20pt; text-align: justify;">
          <li>Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) yang diperoleh berdasarkan total harga penawaran sebagaimana tercantum dalam Daftar Kuantitas dan Harga adalah sebesar <strong>${formatRupiah(contract.nilaiKontrakAngka)}</strong> (<em>${angkaKeTerbilang(contract.nilaiKontrakAngka)}</em>) dengan kode akun kegiatan <strong>${contract.kodeAkunKegiatan}</strong>;</li>
          <li>Kontrak ini dibiayai dari ${contract.sumberPembiayaan};</li>
          <li>Pembayaran untuk kontrak ini dilakukan ke ${contract.bankNamaDanCabang} rekening nomor <strong>${contract.nomorRekeningPenyedia}</strong> atas nama Penyedia <strong>${contract.namaRekeningPenyedia}</strong>.</li>
        </ol>
      </div>

      <div style="margin-top: 14pt; margin-bottom: 10pt;">
        <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin: 0;">Pasal 4<br/>DOKUMEN KONTRAK</p>
        <p style="text-align: justify; margin-top: 4pt;">Kelengkapan dokumen-dokumen berikut merupakan satu kesatuan dan bagian yang tidak terpisahkan dari Kontrak ini terdiri dari adendum Kontrak (apabila ada), Surat Perjanjian, Surat Pesanan, Daftar Kuantitas dan Harga, Syarat-Syarat Umum Kontrak, Syarat-Syarat Khusus Kontrak beserta lampirannya berupa lampiran A (daftar harga satuan timpang, subkontraktor, personel manajerial, dan peralatan utama), lampiran B (Rencana Keselamatan Konstruksi), spesifikasi teknis, gambar-gambar, dan dokumen lainnya seperti: Surat Penunjukan Penyedia Barang/Jasa, Jadwal Pelaksanaan Pekerjaan, jaminan-jaminan, Berita Acara Rapat Persiapan Penandatanganan Kontrak, Berita Acara Rapat Persiapan Pelaksanaan Kontrak.</p>
        <p style="text-align: justify; margin-top: 4pt;">Jika terjadi pertentangan antara ketentuan dalam suatu dokumen dengan ketentuan dalam dokumen yang lain maka yang berlaku adalah ketentuan dalam dokumen yang lebih tinggi berdasarkan urutan hierarki sebagai berikut:</p>
        <ol style="margin-top: 2pt; padding-left: 20pt;">
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

      <div style="margin-top: 14pt; margin-bottom: 10pt;">
        <p style="text-align: center; font-weight: bold; text-transform: uppercase; margin: 0;">Pasal 5<br/>MASA KONTRAK</p>
        <ol style="margin-top: 4pt; padding-left: 20pt; text-align: justify;">
          <li>Masa Kontrak adalah jangka waktu berlakunya Kontrak ini terhitung sejak tanggal penandatanganan Kontrak sampai dengan Tanggal Penyerahan Akhir Pekerjaan (FHO);</li>
          <li>Masa Pelaksanaan ditentukan dalam Syarat-Syarat Khusus Kontrak, dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan selama <strong>${contract.jangkaWaktuPelaksanaanHari} (${contract.jangkaWaktuPelaksanaanHuruf})</strong> hari kalender;</li>
          <li>Masa Pemeliharaan ditentukan dalam Syarat-Syarat Khusus Kontrak dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan selama <strong>${contract.jangkaWaktuPemeliharaanHari} (${contract.jangkaWaktuPemeliharaanHuruf})</strong> hari kalender.</li>
        </ol>
      </div>
    `;
  }

  // Generate SSUK Document Content (8 Bagian, 79 Pasal, 2 Kolom Borderless Table Sesuai Word Asli)
  let ssukHtml = '';
  const clauseMap = new Map((contract.clauses || []).map(c => [c.id, c]));

  OFFICIAL_SSUK_SECTIONS.forEach((section) => {
    let rowsHtml = '';
    section.clauses.forEach((clause) => {
      const clauseState = clauseMap.get(clause.id);
      if (clauseState && !clauseState.isActive) {
        return; // Lewati pasal yang dinonaktifkan pengguna
      }

      let parasHtml = '';
      if (clauseState && clauseState.kontenCustom !== undefined) {
        // Gunakan redaksi hasil editan pengguna
        const customParas = clauseState.kontenCustom.split('\n\n').filter(Boolean);
        parasHtml = customParas.map(cp => {
          return `<p style="margin: 0 0 4pt 0; font-size: 10pt; line-height: 1.35; text-align: justify;">${cp.replace(/\n/g, '<br/>')}</p>`;
        }).join('');
      } else {
        // Redaksi baku LKPP
        clause.paragraphs.forEach((p) => {
          const isLetter = p.prefix && /^[a-z]\.$/.test(p.prefix);
          if (isLetter) {
            parasHtml += `<p style="margin: 0 0 3pt 20pt; text-indent: -12pt; font-size: 10pt; line-height: 1.35;">${p.prefix} ${p.text}</p>`;
          } else if (p.prefix) {
            parasHtml += `<p style="margin: 0 0 4pt 0; font-size: 10pt; line-height: 1.35;"><strong>${p.prefix}</strong> ${p.text}</p>`;
          } else {
            parasHtml += `<p style="margin: 0 0 4pt 0; font-size: 10pt; line-height: 1.35;">${p.text}</p>`;
          }
        });
      }

      rowsHtml += `
        <tr>
          <td style="width: 28%; vertical-align: top; padding: 4pt 8pt 4pt 0; font-weight: bold; font-size: 10pt; border: none;">
            ${clause.nomorDanJudul}
          </td>
          <td style="width: 72%; vertical-align: top; padding: 4pt 0; text-align: justify; border: none;">
            ${parasHtml}
          </td>
        </tr>
      `;
    });

    if (rowsHtml) {
      ssukHtml += `
        <div style="margin-top: 14pt; margin-bottom: 6pt;">
          <p style="font-weight: bold; font-size: 11pt; text-transform: uppercase; margin: 0 0 6pt 0;">
            ${section.nomorDanJudul}
          </p>
          <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 12pt;">
            ${rowsHtml}
          </table>
        </div>
      `;
    }
  });

  // Generate Lampiran A Tables
  const personelRows = (contract.personelManajerial || []).map((p, i) => `
    <tr>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${i + 1}</td>
      <td style="border: 1px solid black; padding: 4px; font-weight: bold;">${p.nama}</td>
      <td style="border: 1px solid black; padding: 4px;">${p.jabatan}</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${p.pendidikan}</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${p.pengalamanTahun}</td>
      <td style="border: 1px solid black; padding: 4px;">${p.sertifikatKompetensi}</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${p.keterangan || '-'}</td>
    </tr>
  `).join('');

  const peralatanRows = (contract.peralatanUtama || []).map((a, i) => `
    <tr>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${i + 1}</td>
      <td style="border: 1px solid black; padding: 4px; font-weight: bold;">${a.nama}</td>
      <td style="border: 1px solid black; padding: 4px;">${a.merekTipe}</td>
      <td style="border: 1px solid black; padding: 4px;">${a.kapasitas}</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${a.jumlah}</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${a.kondisi}</td>
      <td style="border: 1px solid black; padding: 4px;">${a.statusKepemilikan}</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${a.keterangan || '-'}</td>
    </tr>
  `).join('');

  // Generate IBPRP Rows
  const ibprpRows = (contract.rkkTabelIBPRP || []).map((ib, i) => `
    <tr>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">${i + 1}</td>
      <td style="border: 1px solid black; padding: 4px; font-weight: bold;">${ib.uraianPekerjaan}</td>
      <td style="border: 1px solid black; padding: 4px;">${ib.identifikasiBahaya}</td>
      <td style="border: 1px solid black; padding: 4px;">${ib.jenisBahaya}</td>
      <td style="border: 1px solid black; padding: 4px;">Permen PUPR No. 10/2021</td>
      <td style="border: 1px solid black; padding: 4px;">${ib.pengendalianAwal}</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">3</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">3</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;">${ib.tingkatRisiko}</td>
      <td style="border: 1px solid black; padding: 4px;">${ib.pengendalianLanjutan}</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">1</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">2</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;">Kecil</td>
      <td style="border: 1px solid black; padding: 4px; text-align: center;">N/A</td>
    </tr>
  `).join('');

  // Generate Kotak Paraf Koordinasi Footer (Pejabat Penandatangan Kontrak & Penyedia)
  const parafFooterHtml = `
    <table align="right" style="width: 260px; border: 1px solid black; border-collapse: collapse; margin-top: 16pt; margin-bottom: 6pt; margin-left: auto;">
      <tr>
        <td style="border: 1px solid black; padding: 2.5pt 6pt; font-size: 8.5pt; font-family: 'Times New Roman', serif; font-weight: bold; width: 210px; background-color: #ffffff;">
          Pejabat Penandatangan Kontrak
        </td>
        <td style="border: 1px solid black; width: 50px; height: 18pt; background-color: #ffffff;"></td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 2.5pt 6pt; font-size: 8.5pt; font-family: 'Times New Roman', serif; font-weight: bold; width: 210px; background-color: #ffffff;">
          Penyedia
        </td>
        <td style="border: 1px solid black; width: 50px; height: 18pt; background-color: #ffffff;"></td>
      </tr>
    </table>
  `;

  // Build the complete Word Document HTML with mso-special-character:line-break;page-break-before:always
  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Dokumen Kontrak Lengkap - ${contract.namaPaket}</title>
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
          size: 21.0cm 29.7cm;
          margin: 2.0cm 2.0cm 2.2cm 2.0cm;
          mso-page-orientation: portrait;
          mso-footer-margin: 36.0pt;
          mso-footer: f1;
        }
        div.Section1 {
          page: Section1;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 11pt;
          line-height: 1.35;
          color: black;
        }
        .header-kop {
          text-align: center;
          border-bottom: 3px double black;
          padding-bottom: 8px;
          margin-bottom: 18px;
        }
        .header-kop h3 { margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold; }
        .header-kop h2 { margin: 2px 0; font-size: 15pt; text-transform: uppercase; font-weight: bold; }
        .header-kop p { margin: 0; font-size: 9pt; }
        .page-break {
          page-break-before: always;
          mso-special-character: line-break;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          margin-bottom: 12px;
        }
        th, td {
          font-family: 'Times New Roman', Times, serif;
          font-size: 10pt;
        }
      </style>
    </head>
    <body>
      <div class="Section1">

      <!-- ========================================== -->
      <!-- BAGIAN 1: SURAT PERJANJIAN (KONTRAK)      -->
      <!-- ========================================== -->
      <table style="width: 100%; border: none; border-bottom: 3px double black; padding-bottom: 8px; margin-bottom: 18px; border-collapse: collapse;">
        <tr>
          <td style="width: 15%; text-align: center; vertical-align: middle; border: none; padding-right: 10px;">
            <img src="${LOGO_KAB_TEGAL_BASE64}" width="68" height="84" alt="Logo Kab Tegal" />
          </td>
          <td style="width: 85%; text-align: center; vertical-align: middle; border: none;">
            <h3 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">PEMERINTAH KABUPATEN TEGAL</h3>
            <h2 style="margin: 2px 0; font-size: 15pt; text-transform: uppercase; font-weight: bold;">DINAS PEKERJAAN UMUM DAN PENATAAN RUANG</h2>
            <p style="margin: 0; font-size: 9pt;">Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal – Kode Pos 52416</p>
            <p style="margin: 0; font-size: 9pt;">Telepon (0283) 6197673 – Email: dpupr@tegalkab.go.id</p>
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin-bottom: 18px;">
        <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: bold;">SURAT PERJANJIAN</h2>
        <p style="margin: 2px 0 8px 0; font-size: 11pt; font-weight: bold;">Kontrak ${contract.jenisKontrak}</p>
        <p style="margin: 0; font-size: 11pt;">Paket Pekerjaan Konstruksi</p>
        <p style="margin: 2px 0 8px 0; font-size: 11pt; font-weight: bold; text-transform: uppercase;">${contract.namaPaket}</p>
        <p style="margin: 0; font-size: 11pt; font-weight: bold;">Nomor : ${contract.nomorSurat}</p>
      </div>

      <div style="text-align: justify; font-size: 11pt; line-height: 1.4;">
        <p>SURAT PERJANJIAN ini berikut semua lampirannya adalah Kontrak Kerja Konstruksi ${contract.jenisKontrak}, yang selanjutnya disebut “Kontrak” dibuat dan ditandatangani di Slawi pada hari <strong>${hariSesuaiTanggal}</strong> tanggal <strong>${tanggalTeks}</strong> bulan <strong>${bulanTeks}</strong> tahun <strong>${tahunAngka}</strong> (<strong>${tanggalBulanTahunAngka}</strong>), berdasarkan Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) Nomor <strong>${contract.nomorSPPBJ}</strong> tanggal <strong>${tanggalSPPBJFormatted}</strong> , antara:</p>

        <table style="width: 100%; border: none; margin-bottom: 8px;">
          <tr>
            <td style="width: 28%; font-weight: bold; border: none; padding: 2px 0;">Nama</td>
            <td style="width: 2%; border: none; padding: 2px 0;">:</td>
            <td style="width: 70%; font-weight: bold; border: none; padding: 2px 0;">${contract.ppkNama}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">NIP</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${contract.ppkNip}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Jabatan</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${(contract.ppkJabatan || '').replace(/PPKom/g, 'PPK')}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Berkedudukan di</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${contract.ppkKedudukan}</td>
          </tr>
        </table>

        <p>yang bertindak untuk dan atas nama Pemerintah Kabupaten Tegal cq Dinas Pekerjaan Umum dan Penataan Ruang berdasarkan Surat Keputusan Kepala Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Nomor ${contract.ppkNomorSK} Tahun ${contract.ppkTahunSK} tanggal ${contract.ppkTanggalSK} tentang Penunjukan Pejabat Pembuat Komitmen (PPK) Pada Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal Tahun Anggaran ${contract.ppkTahunAnggaran} selanjutnya disebut <strong>“Pejabat Penandatangan Kontrak”</strong>, dengan:</p>

        <table style="width: 100%; border: none; margin-bottom: 8px;">
          <tr>
            <td style="width: 28%; font-weight: bold; border: none; padding: 2px 0;">Nama</td>
            <td style="width: 2%; border: none; padding: 2px 0;">:</td>
            <td style="width: 70%; font-weight: bold; border: none; padding: 2px 0;">${contract.penyediaNamaDirektur}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Jabatan</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${contract.penyediaJabatan}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Berkedudukan di</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${contract.penyediaKedudukan}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Akta Notaris Nomor</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${contract.penyediaAktaNomor}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Tanggal</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${contract.penyediaAktaTanggal}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Notaris</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${contract.penyediaAktaNotaris}</td>
          </tr>
        </table>

        <p>yang bertindak untuk dan atas nama <strong>${contract.penyediaNamaBadanUsaha}</strong> selanjutnya disebut <strong>“Penyedia”</strong>.</p>

        ${konsideransClause && konsideransClause.isActive ? `
          <p style="font-weight: bold; margin-top: 10pt; margin-bottom: 4pt;">Dan dengan memperhatikan:</p>
          <div style="font-size: 11pt; line-height: 1.35; text-align: justify; padding-left: 6pt;">
            ${resolveContractPlaceholders(
              konsideransClause.kontenCustom !== undefined ? konsideransClause.kontenCustom : konsideransClause.kontenDefault,
              contract
            ).split('\n').filter(Boolean).map(line => `<p style="margin: 0 0 3pt 20pt; text-indent: -16pt;">${line}</p>`).join('')}
          </div>
        ` : ''}

        ${premisClause && premisClause.isActive ? `
          <p style="font-weight: bold; text-align: center; margin-top: 14pt; margin-bottom: 6pt; text-transform: uppercase;">PARA PIHAK MENERANGKAN TERLEBIH DAHULU BAHWA:</p>
          <div style="font-size: 11pt; line-height: 1.35; text-align: justify;">
            ${resolveContractPlaceholders(
              premisClause.kontenCustom !== undefined ? premisClause.kontenCustom : premisClause.kontenDefault,
              contract
            ).split('\n').filter(Boolean).map(line => {
              const trimmed = line.trim();
              const isSub = /^\d+\)/.test(trimmed);
              return `<p style="margin: 0 0 3pt ${isSub ? '44pt' : '24pt'}; text-indent: -${isSub ? '18pt' : '20pt'};">${trimmed}</p>`;
            }).join('')}
          </div>
        ` : ''}

        <p style="margin-top: 10pt;">Maka oleh karena itu, Pejabat Penandatangan Kontrak dan Penyedia dengan ini bersepakat dan menyetujui untuk membuat perjanjian pelaksanaan paket Pekerjaan <strong>${contract.namaPaket}</strong> dengan syarat dan ketentuan sebagai berikut:</p>

        ${pasalHtml}

        <p style="margin-top: 14pt; text-align: justify; line-height: 1.35; font-size: 11pt;">
          Dengan demikian, Pejabat Penandatangan Kontrak dan Penyedia telah bersepakat untuk menandatangani Kontrak ini pada tanggal tersebut di atas dan melaksanakan Kontrak sesuai dengan ketentuan peraturan perundang-undangan di Republik Indonesia dan dibuat dalam 2 (dua) rangkap, masing-masing dibubuhi dengan meterai, mempunyai kekuatan hukum yang sama dan mengikat bagi para pihak, rangkap yang lain dapat diperbanyak sesuai kebutuhan tanpa dibubuhi meterai.
        </p>

        <table style="width: 100%; border: none; margin-top: 20pt; border-collapse: collapse;">
          <tr style="vertical-align: top;">
            <td style="width: 50%; text-align: center; border: none; padding: 0 10pt;">
              <p style="margin: 0; font-size: 11pt;">Untuk dan atas nama</p>
              <p style="margin: 2pt 0 0 0; font-size: 11pt; font-weight: bold; text-transform: uppercase;">${contract.penyediaNamaBadanUsaha}</p>
            </td>
            <td style="width: 50%; text-align: center; border: none; padding: 0 10pt;">
              <p style="margin: 0; font-size: 11pt;">Untuk dan atas nama</p>
              <p style="margin: 2pt 0 0 0; font-size: 11pt; font-weight: bold; text-transform: uppercase;">DINAS PUPR KABUPATEN TEGAL</p>
              <p style="margin: 1pt 0 0 0; font-size: 10pt;">${(contract.ppkJabatan || 'Pejabat Pembuat Komitmen').replace(/PPKom/g, 'PPK')}</p>
              <p style="margin: 1pt 0 0 0; font-size: 10.5pt; font-weight: bold;">Selaku Pejabat Penandatangan Kontrak</p>
            </td>
          </tr>
          <tr style="vertical-align: middle;">
            <td style="height: 75pt; text-align: center; border: none;">
              <!-- Ruang Tanda Tangan & Materai Manual (Kosongan) -->
            </td>
            <td style="height: 75pt; text-align: center; border: none;">
              <!-- Ruang Tanda Tangan Manual PPK (Kosongan) -->
            </td>
          </tr>
          <tr style="vertical-align: bottom;">
            <td style="text-align: center; border: none; padding: 0 10pt;">
              <p style="margin: 0; font-size: 11pt; font-weight: bold;"><u>${contract.penyediaNamaDirektur}</u></p>
              <p style="margin: 2pt 0 0 0; font-size: 10pt;">${contract.penyediaJabatan}</p>
            </td>
            <td style="text-align: center; border: none; padding: 0 10pt;">
              <p style="margin: 0; font-size: 11pt; font-weight: bold;"><u>${contract.ppkNama}</u></p>
              <p style="margin: 2pt 0 0 0; font-size: 10pt;">NIP. ${contract.ppkNip}</p>
            </td>
          </tr>
        </table>

        <!-- Kotak Paraf Koordinasi Footer -->
        ${parafFooterHtml}
      </div>

      <!-- ========================================== -->
      <!-- BAGIAN 2: SYARAT-SYARAT UMUM KONTRAK (SSUK)-->
      <!-- ========================================== -->
      <div class="page-break"></div>
      <div style="text-align: center; margin-bottom: 16px;">
        <h2 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">I. SYARAT-SYARAT UMUM KONTRAK (SSUK)</h2>
        <p style="margin: 2px 0; font-size: 10.5pt; font-weight: bold; text-transform: uppercase;">PENGADAAN PEKERJAAN KONSTRUKSI DINAS PEKERJAAN UMUM DAN PENATAAN RUANG KABUPATEN TEGAL</p>
      </div>

      ${ssukHtml}

      <!-- Kotak Paraf Koordinasi Footer -->
      ${parafFooterHtml}

      <!-- ========================================== -->
      <!-- BAGIAN 3: SYARAT-SYARAT KHUSUS KONTRAK(SSKK)-->
      <!-- ========================================== -->
      <div class="page-break"></div>
      <div style="text-align: center; margin-bottom: 16px;">
        <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: bold;">SYARAT-SYARAT KHUSUS KONTRAK (SSKK)</h2>
        <p style="margin: 2px 0; font-size: 11pt; font-weight: bold;">PAKET PEKERJAAN KONSTRUKSI: ${contract.namaPaket.toUpperCase()}</p>
      </div>

      <table style="width: 100%; border: 1px solid black; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid black; padding: 6px; width: 15%; text-align: center;">Pasal dalam SSUK</th>
            <th style="border: 1px solid black; padding: 6px; width: 25%; text-align: center;">Ketentuan</th>
            <th style="border: 1px solid black; padding: 6px; width: 60%; text-align: center;">Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">4.1 & 4.2</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Korespondensi</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              <strong>Alamat Para Pihak sebagai berikut:</strong><br/>
              <strong>Satuan Kerja Pejabat Penandatangan Kontrak:</strong><br/>
              Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal<br/>
              Nama: <strong>${contract.ppkNama}</strong><br/>
              Alamat: Jl. Cut Nyak Dien, Kalisapu, Slawi, Kabupaten Tegal<br/>
              E-mail: ${contract.sskkEmailPPK}<br/>
              Faksimili: -<br/><br/>
              <strong>Penyedia:</strong><br/>
              Badan Usaha: <strong>${contract.penyediaNamaBadanUsaha}</strong><br/>
              Nama Direktur: <strong>${contract.penyediaNamaDirektur}</strong><br/>
              Alamat: ${contract.penyediaKedudukan}<br/>
              E-mail: ${contract.sskkEmailPenyedia}<br/>
              No. Whatsapp: ${contract.sskkWhatsappPenyedia}<br/>
              Faksimili: ${contract.sskkFaksimiliPenyedia}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">4.2 & 5.1</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Wakil Sah Para Pihak</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Wakil Sah Para Pihak sebagai berikut:<br/>
              Untuk Pejabat Penandatangan Kontrak: <strong>${contract.sskkWakilSahPPK}</strong><br/>
              Untuk Penyedia: <strong>${contract.sskkWakilSahPenyedia}</strong>
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">6.3.b & 6.3.c<br/>43.4 & 43.6</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Pencairan Jaminan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Jaminan dicairkan dan disetorkan pada <strong>${contract.sskkPencairanJaminan}</strong>.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">7.2</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Asal Material / Bahan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top; text-align: justify;">
              Material/bahan yang digunakan harus berasal dari sumber, produsen, pabrik, pemasok, dan/atau lokasi pengambilan material yang sah serta memenuhi ketentuan perizinan berusaha yang dipersyaratkan sesuai jenis material dan ketentuan peraturan perundang-undangan. Penyedia wajib menunjukkan bukti asal dan/atau legalitas material apabila diminta oleh Pejabat Penandatangan Kontrak/Pengawas Pekerjaan.<br/><br/>
              Setiap material/bahan yang digunakan wajib memenuhi spesifikasi teknis dan persyaratan mutu dalam Kontrak. Ketidaksesuaian penggunaan material/bahan menjadi tanggung jawab Penyedia dan wajib diperbaiki, diganti, dan/atau ditindaklanjuti sesuai perintah Pengawas Pekerjaan tanpa menimbulkan tambahan biaya bagi Pejabat Penandatangan Kontrak.<br/><br/>
              Perjanjian pengadaan material/bahan antara Penyedia dengan produsen, pabrik, pemasok, dan/atau pemilik sumber material sepenuhnya menjadi tanggung jawab Penyedia. Setiap sengketa atau tuntutan yang timbul dari hubungan hukum tersebut menjadi tanggung jawab Penyedia dan tidak menimbulkan hubungan kontraktual maupun kewajiban pembayaran bagi Pejabat Penandatangan Kontrak dan/atau Pemerintah Kabupaten Tegal.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">13.1</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Pengawasan Pelaksanaan Pekerjaan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Pengawas Pekerjaan berasal dari Penyedia Jasa Pengawasan (Konsultan Pengawas) yang ditetapkan oleh Pejabat Penandatangan Kontrak.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">26.1</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Masa Pelaksanaan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Masa Pelaksanaan selama <strong>${contract.jangkaWaktuPelaksanaanHari} (${contract.jangkaWaktuPelaksanaanHuruf})</strong> hari kalender terhitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">26.4</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Masa Pelaksanaan Serah Terima Sebagian</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">Tidak Ada</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">32.8</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Masa Pemeliharaan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Masa Pemeliharaan berlaku selama <strong>${contract.jangkaWaktuPemeliharaanHari} (${contract.jangkaWaktuPemeliharaanHuruf})</strong> hari kalender terhitung sejak Tanggal Penyerahan Pertama Pekerjaan (PHO).
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">32.14 & 32.17</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Serah Terima Sebagian Pekerjaan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">Tidak Ada</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">33</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Pengambilalihan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Jangka waktu pengambilalihan lokasi dan hasil pekerjaan paling lambat 14 (empat belas) hari kalender setelah dikeluarkan surat keterangan selesai/pengakhiran pekerjaan.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">34.1</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Gambar As Built & Pedoman</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Gambar ”As built” dan/atau pedoman pengoperasian dan perawatan/pemeliharaan harus diserahkan paling lambat 14 (empat belas) hari kalender setelah Tanggal Penyerahan Pertama Pekerjaan (PHO).
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">37.7</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Penyesuaian Harga</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">Penyesuaian harga tidak diberikan.</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">44.b</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Pembayaran Tagihan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Batas akhir waktu yang disepakati untuk penerbitan SPP oleh Pejabat Penandatangan Kontrak untuk pembayaran tagihan angsuran adalah 14 (empat belas) hari kerja terhitung sejak tagihan dan kelengkapan dokumen penunjang yang tidak diperselisihkan diterima oleh Pejabat Penandatangan Kontrak.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">48.j</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Hak dan Kewajiban Penyedia</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top; text-align: justify;">
              Hak dan kewajiban Penyedia:<br/>
              1. tidak membuat dan/atau menyampaikan dokumen dan/atau keterangan yang tidak benar untuk memenuhi persyaratan Katalog Elektronik dan/atau dalam penyusunan dan pelaksanaan Surat Pesanan/Kontrak;<br/>
              2. menjamin bahwa harga Barang/Jasa yang tercantum dalam Katalog Elektronik merupakan harga terbaik bagi Pemerintah dan tidak menjual Barang/Jasa melalui Katalog Elektronik dengan harga lebih mahal daripada harga Barang/Jasa yang dijual selain melalui Katalog Elektronik pada periode penjualan, volume, tempat (kabupaten/kota), dan spesifikasi teknis yang sama; dan<br/>
              3. menindaklanjuti hasil audit/pemeriksaan oleh lembaga atau aparat yang berwenang sesuai ketentuan peraturan perundang-undangan, termasuk mengembalikan kelebihan pembayaran dan/atau mengganti kerugian negara/daerah apabila berdasarkan hasil audit/pemeriksaan yang berwenang ditetapkan adanya kerugian yang menjadi tanggung jawab Penyedia.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">55.1 & 55.3</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Tindakan Mensyaratkan Persetujuan PPK</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Tindakan lain oleh Penyedia yang memerlukan persetujuan Pejabat Penandatangan Kontrak adalah penyampaian kepada pihak luar atas informasi dan/atau dokumen pelaksanaan pekerjaan yang bersifat terbatas atau bukan merupakan informasi publik, kecuali diwajibkan berdasarkan ketentuan peraturan perundang-undangan atau diminta oleh instansi yang berwenang.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">55.2 & 55.3</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Tindakan Mensyaratkan Persetujuan Pengawas</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Penyedia diperbolehkan menggunakan salinan dokumen dan piranti lunak yang dihasilkan dari Pekerjaan Konstruksi ini dengan pembatasan untuk penelitian/riset setelah mendapat persetujuan tertulis dari Pejabat Penandatangan Kontrak.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">57</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Kepemilikan Dokumen</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Penyedia diperbolehkan menggunakan salinan dokumen dan piranti lunak yang dihasilkan dari Pekerjaan Konstruksi ini dengan pembatasan untuk penelitian/riset setelah mendapat persetujuan tertulis dari Pejabat Penandatangan Kontrak.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">61</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Pembayaran Denda</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Penyedia menyetorkan denda ke kas daerah sebelum pembayaran tahapan penyelesaian pekerjaan.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">62</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Jaminan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Jaminan pelaksanaan dan jaminan uang muka dalam pelaksanaan kontrak ini dapat berupa bank garansi atau surety bond (Bank Umum, Perusahaan Asuransi, Perusahaan Penjaminan, Lembaga Pembiayaan Ekspor Indonesia).<br/><br/>
              Jaminan pemeliharaan dalam pelaksanaan kontrak ini berupa:<br/>
              a. Bank Garansi dengan dilampiri/disertai bukti slip setoran tunai senilai nilai jaminan dari pihak penjamin yang menerbitkan, atau;<br/>
              b. Bank garansi dengan cara pemblokiran/penahanan dana oleh Bank atas SP2D pekerjaan sebesar 5% (lima perseratus) dari Harga Kontrak untuk keperluan Jaminan Pemeliharaan terhadap pembayaran pekerjaan;<br/>
              c. Pemblokiran/penahanan dana sebagaimana point b. dapat dicairkan setelah Pejabat yang berwenang untuk menandatangani Kontrak menerbitkan Surat Pencairan Jaminan Pemeliharaan.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">64 & 65.1.h</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Fasilitas & Kompensasi</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Fasilitas: Tidak Ada. Peristiwa Kompensasi: sesuai ketentuan SSUK.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">69.1.e</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Besaran Uang Muka</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              <strong>${contract.sskkUangMukaKetentuan}</strong>
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">69.2.d</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Pembayaran Prestasi Pekerjaan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top; text-align: justify;">
              Pembayaran prestasi pekerjaan dilakukan dengan cara <strong>${contract.sskkPembayaranCara}</strong> dengan ketentuan tahapan pembayaran sebagai berikut:<br/>
              a. Pelaksanaan pembayaran termin ke I (satu) sebesar <strong>${contract.sskkTermin1Bayar}%</strong> dari nilai kontrak setelah prestasi pekerjaan fisik mencapai <strong>${contract.sskkTermin1Fisik}%</strong> atas dasar berita acara pemeriksaan prestasi pekerjaan yang telah disetujui oleh Pejabat Penandatangan Kontrak;<br/>
              b. Pelaksanaan pembayaran termin ke II (dua) sebesar <strong>${contract.sskkTermin2Bayar}%</strong> dari nilai kontrak setelah prestasi pekerjaan fisik mencapai <strong>${contract.sskkTermin2Fisik}%</strong> atas dasar berita acara pemeriksaan prestasi pekerjaan yang telah disetujui oleh Pejabat Penandatangan Kontrak;<br/>
              c. Pelaksanaan pembayaran termin ke III (tiga) sebesar <strong>${contract.sskkTermin3Bayar}%</strong> dari nilai kontrak setelah prestasi pekerjaan fisik mencapai <strong>${contract.sskkTermin3Fisik}%</strong> atas dasar berita acara pemeriksaan prestasi pekerjaan yang telah disetujui oleh Pejabat Penandatangan Kontrak;<br/>
              d. Pelaksanaan pembayaran termin ke IV (empat) dengan membayarkan keseluruhan sisa pembayaran dari Harga Kontrak setelah prestasi pekerjaan fisik mencapai <strong>${contract.sskkTermin4Fisik}%</strong> dengan ketentuan Penyedia harus menyerahkan Jaminan Pemeliharaan sebesar 5% (lima persen) dari Harga Kontrak atas dasar berita acara pemeriksaan prestasi pekerjaan yang telah disetujui Pejabat Penandatangan Kontrak, serta dilampiri bukti pembayaran denda (apabila ada);<br/>
              e. Apabila Penyedia tidak dapat menyelesaikan prestasi pekerjaan mencapai 100% sampai batas akhir masa pelaksanaan berakhir atau prestasi pekerjaan tidak disetujui 100%, maka nilai pembayaran yang berhak diterima pihak Penyedia Jasa adalah sebesar progres pekerjaan yang telah terpasang dan disetujui Pejabat Penandatangan Kontrak;<br/>
              f. Dalam hal Penyedia tidak mengajukan pembayaran pada suatu tahapan termin, pembayaran dapat diakumulasikan pada termin berikutnya sepanjang prestasi pekerjaan yang menjadi dasar pembayaran telah diperiksa dan diterima;<br/>
              g. Terhadap volume atau item pekerjaan yang sudah terpasang/dikerjakan tetapi tidak bisa dibayarkan menjadi milik Pemerintah Daerah Kabupaten Tegal;<br/>
              h. Dokumen penunjang yang dipersyaratkan untuk pengajuan tagihan pembayaran prestasi pekerjaan sekurang-kurangnya meliputi: Surat permohonan pembayaran/tagihan, Laporan kemajuan fisik, BAP Prestasi Pekerjaan, Rekapitulasi volume, Opname bersama, Dokumentasi/foto progres, Addendum Kontrak (apabila ada), dan Jaminan Pemeliharaan 5%.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">69.3.e</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Pembayaran Bahan & Peralatan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Penentuan dan besaran pembayaran untuk bahan dan/atau peralatan yang menjadi bagian permanen dari pekerjaan utama (material on site) tidak dibayar.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">69.4.c</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Denda Keterlambatan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Untuk pekerjaan ini besar denda keterlambatan untuk setiap hari keterlambatan adalah <strong>${contract.sskkDendaKeterlambatan}</strong>.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">77.2 & 77.3</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Umur Konstruksi & Pertanggungan</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Bangunan hasil pekerjaan memiliki Umur Konstruksi selama <strong>${contract.sskkUmurKonstruksiTahun} (lima puluh) tahun</strong> terhitung sejak Tanggal Penyerahan Akhir Pekerjaan (FHO).<br/>
              Jangka waktu pertanggungjawaban Penyedia terhadap Kegagalan Bangunan ditetapkan selama <strong>${contract.sskkPertanggunganKegagalanTahun} (sepuluh) tahun</strong> terhitung sejak Tanggal Penyerahan Akhir Pekerjaan.<br/>
              Pada saat penyerahan pekerjaan, Penyedia wajib menyerahkan surat penjaminan atas Kegagalan Bangunan Gedung yang disusun bersama Konsultan Pengawas.
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; text-align: center; vertical-align: top;">78.3</td>
            <td style="border: 1px solid black; padding: 6px; font-weight: bold; vertical-align: top;">Penyelesaian Sengketa</td>
            <td style="border: 1px solid black; padding: 6px; vertical-align: top;">
              Penyelesaian perselisihan/sengketa para pihak dilakukan melalui <strong>${contract.sskkPenyelesaianSengketa}</strong>.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Kotak Paraf Koordinasi Footer -->
      ${parafFooterHtml}

      <!-- ========================================== -->
      <!-- BAGIAN 4: LAMPIRAN A SSKK                  -->
      <!-- ========================================== -->
      <div class="page-break"></div>
      <div style="text-align: center; margin-bottom: 16px;">
        <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: bold;">LAMPIRAN A SYARAT-SYARAT KHUSUS KONTRAK</h2>
        <p style="margin: 2px 0; font-size: 11pt; font-weight: bold;">PAKET PEKERJAAN: ${contract.namaPaket.toUpperCase()}</p>
      </div>

      <h3 style="font-size: 11pt; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">DAFTAR HARGA SATUAN TIMPANG*)</h3>
      <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="border: 1px solid black; padding: 4px; width: 5%;">No</th>
            <th style="border: 1px solid black; padding: 4px;">Mata Pembayaran</th>
            <th style="border: 1px solid black; padding: 4px;">Satuan Ukuran</th>
            <th style="border: 1px solid black; padding: 4px;">Kuantitas</th>
            <th style="border: 1px solid black; padding: 4px;">Harga Satuan HPS (Rp)</th>
            <th style="border: 1px solid black; padding: 4px;">Harga Penawaran (Rp)</th>
            <th style="border: 1px solid black; padding: 4px;">% Thd HPS</th>
            <th style="border: 1px solid black; padding: 4px;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${(contract.hargaSatuanTimpang && contract.hargaSatuanTimpang.length > 0) ? (
            contract.hargaSatuanTimpang.map((h, i) => `
              <tr style="text-align: center;">
                <td style="border: 1px solid black; padding: 4px;">${i + 1}</td>
                <td style="border: 1px solid black; padding: 4px;">${h.mataPembayaran}</td>
                <td style="border: 1px solid black; padding: 4px;">${h.satuanUkuran}</td>
                <td style="border: 1px solid black; padding: 4px;">${h.kuantitas}</td>
                <td style="border: 1px solid black; padding: 4px;">${h.hpsRp ? h.hpsRp.toLocaleString('id-ID') : 'Tidak Ada'}</td>
                <td style="border: 1px solid black; padding: 4px;">${h.penawaranRp ? h.penawaranRp.toLocaleString('id-ID') : 'Tidak Ada'}</td>
                <td style="border: 1px solid black; padding: 4px;">${h.persenTerhadapHps}</td>
                <td style="border: 1px solid black; padding: 4px;">${h.keterangan}</td>
              </tr>
            `).join('')
          ) : `
            <tr style="text-align: center;">
              <td style="border: 1px solid black; padding: 4px;">1</td>
              <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
              <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
              <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
              <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
              <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
              <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
              <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
            </tr>
          `}
        </tbody>
      </table>

      <h3 style="font-size: 11pt; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">DAFTAR PEKERJAAN YANG DISUBKONTRAKKAN DAN SUBKONTRAKTOR</h3>
      <p style="font-weight: bold; font-size: 10pt; margin: 4px 0;">Pekerjaan Utama</p>
      <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 8px;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="border: 1px solid black; padding: 4px; width: 5%;">No</th>
            <th style="border: 1px solid black; padding: 4px;">Bagian Pekerjaan yang Disubkontrakkan</th>
            <th style="border: 1px solid black; padding: 4px;">Nama Subkontraktor</th>
            <th style="border: 1px solid black; padding: 4px;">Alamat Subkontraktor</th>
            <th style="border: 1px solid black; padding: 4px;">Kualifikasi Subkontraktor</th>
            <th style="border: 1px solid black; padding: 4px;">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr style="text-align: center;">
            <td style="border: 1px solid black; padding: 4px;">1</td>
            <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
            <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
            <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
            <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
            <td style="border: 1px solid black; padding: 4px;">Tidak Ada</td>
          </tr>
        </tbody>
      </table>

      <h3 style="font-size: 11pt; text-transform: uppercase; font-weight: bold; margin-top: 12px; margin-bottom: 4px;">DAFTAR PERSONEL MANAJERIAL</h3>
      <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="border: 1px solid black; padding: 4px; width: 5%;">No</th>
            <th style="border: 1px solid black; padding: 4px;">Nama Personel</th>
            <th style="border: 1px solid black; padding: 4px;">Jabatan</th>
            <th style="border: 1px solid black; padding: 4px;">Pendidikan</th>
            <th style="border: 1px solid black; padding: 4px;">Pengalaman (Th)</th>
            <th style="border: 1px solid black; padding: 4px;">Sertifikat Kompetensi</th>
            <th style="border: 1px solid black; padding: 4px;">Ket</th>
          </tr>
        </thead>
        <tbody>
          ${personelRows}
        </tbody>
      </table>

      <h3 style="font-size: 11pt; text-transform: uppercase; font-weight: bold; margin-top: 12px; margin-bottom: 4px;">DAFTAR PERALATAN UTAMA</h3>
      <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="border: 1px solid black; padding: 4px; width: 5%;">No</th>
            <th style="border: 1px solid black; padding: 4px;">Nama Peralatan Utama</th>
            <th style="border: 1px solid black; padding: 4px;">Merek / Tipe</th>
            <th style="border: 1px solid black; padding: 4px;">Kapasitas</th>
            <th style="border: 1px solid black; padding: 4px;">Jumlah</th>
            <th style="border: 1px solid black; padding: 4px;">Kondisi</th>
            <th style="border: 1px solid black; padding: 4px;">Status Kepemilikan</th>
            <th style="border: 1px solid black; padding: 4px;">Ket</th>
          </tr>
        </thead>
        <tbody>
          ${peralatanRows}
        </tbody>
      </table>

      <!-- Kotak Paraf Koordinasi Footer -->
      ${parafFooterHtml}

      <!-- ========================================== -->
      <!-- BAGIAN 5: LAMPIRAN B SSKK (RKK & K3)       -->
      <!-- ========================================== -->
      <div class="page-break"></div>
      <div style="text-align: center; margin-bottom: 16px;">
        <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: bold;">LAMPIRAN B SYARAT-SYARAT KHUSUS KONTRAK</h2>
        <h3 style="margin: 2px 0; font-size: 12pt; text-transform: uppercase; font-weight: bold;">RENCANA KESELAMATAN KONSTRUKSI (RKK)</h3>
        <p style="margin: 2px 0; font-size: 11pt; font-weight: bold;">PAKET PEKERJAAN: ${contract.namaPaket.toUpperCase()}</p>
      </div>

      <div style="border: 1px solid black; padding: 12px; margin-bottom: 16px; background-color: #f8fafc;">
        <h4 style="margin: 0 0 8px 0; font-size: 11pt; text-transform: uppercase; font-weight: bold;">DAFTAR ISI RKK</h4>
        <p style="margin: 2px 0;"><strong>A. Kepemimpinan dan Partisipasi Pekerja dalam Keselamatan Konstruksi</strong></p>
        <p style="margin: 2px 0 2px 15px;">A.1. Kepedulian pimpinan terhadap Isu eksternal dan internal</p>
        <p style="margin: 2px 0 2px 15px;">A.2. Komitmen Keselamatan Konstruksi</p>
        <p style="margin: 4px 0 2px 0;"><strong>B. Perencanaan Keselamatan Konstruksi</strong></p>
        <p style="margin: 2px 0 2px 15px;">B.1. Identifikasi bahaya, Penilaian risiko, Pengendalian dan Peluang (IBPRP)</p>
        <p style="margin: 2px 0 2px 15px;">B.2. Rencana tindakan (sasaran & program khusus)</p>
        <p style="margin: 2px 0 2px 15px;">B.3. Standar dan peraturan perundangan</p>
        <p style="margin: 4px 0 2px 0;"><strong>C. Dukungan Keselamatan Konstruksi</strong> (Sumber Daya, Kompetensi, Komunikasi)</p>
        <p style="margin: 4px 0 2px 0;"><strong>D. Operasi Keselamatan Konstruksi</strong> (Job Safety Analysis & APD)</p>
        <p style="margin: 4px 0 2px 0;"><strong>E. Evaluasi Kinerja Keselamatan Konstruksi</strong> (Inspeksi & Audit Bulanan)</p>
      </div>

      <div style="border: 1px solid black; padding: 14px; margin-bottom: 16px;">
        <h4 style="text-align: center; font-size: 12pt; text-transform: uppercase; font-weight: bold; margin: 0 0 10px 0;">PAKTA KOMITMEN KESELAMATAN KONSTRUKSI</h4>
        <p>Saya yang bertanda tangan di bawah ini:</p>
        <table style="width: 100%; border: none; margin-bottom: 8px;">
          <tr>
            <td style="width: 30%; font-weight: bold; border: none; padding: 2px 0;">Nama</td>
            <td style="width: 2%; border: none; padding: 2px 0;">:</td>
            <td style="width: 68%; font-weight: bold; border: none; padding: 2px 0;">${contract.penyediaNamaDirektur}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Jabatan</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="border: none; padding: 2px 0;">${contract.penyediaJabatan}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; border: none; padding: 2px 0;">Bertindak untuk dan atas nama</td>
            <td style="border: none; padding: 2px 0;">:</td>
            <td style="font-weight: bold; border: none; padding: 2px 0;">${contract.penyediaNamaBadanUsaha}</td>
          </tr>
        </table>
        <p>dalam rangka pengadaan <strong>${contract.namaPaket}</strong> pada Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal berkomitmen melaksanakan konstruksi berkeselamatan demi terciptanya <strong>Zero Accident</strong>, dengan memastikan bahwa seluruh pelaksanaan konstruksi:</p>
        <ol style="padding-left: 20pt; margin-top: 4pt; margin-bottom: 12pt;">
          <li>Memenuhi ketentuan Keselamatan Konstruksi;</li>
          <li>Menggunakan tenaga kerja kompeten bersertifikat;</li>
          <li>Menggunakan peralatan yang memenuhi standar kelaikan;</li>
          <li>Menggunakan material yang memenuhi standar mutu;</li>
          <li>Menggunakan teknologi yang memenuhi standar kelaikan;</li>
          <li>Melaksanakan Standar Operasi dan Prosedur (SOP); dan</li>
          <li>Memenuhi 9 (Sembilan) komponen biaya penerapan SMKK.</li>
        </ol>

        <table style="width: 100%; border: none; margin-top: 15px;">
          <tr>
            <td style="width: 50%; border: none;"></td>
            <td style="width: 50%; text-align: center; border: none;">
              Slawi, ${formatTanggalIndo(contract.tanggal)}<br/>
              <strong>${contract.penyediaNamaBadanUsaha}</strong><br/><br/><br/><br/>
              <strong><u>${contract.penyediaNamaDirektur}</u></strong><br/>
              ${contract.penyediaJabatan}
            </td>
          </tr>
        </table>
      </div>

      <h4 style="font-size: 11pt; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">B.1. IDENTIFIKASI BAHAYA, PENILAIAN RISIKO & PELUANG (IBPRP)</h4>
      <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 16px; font-size: 9pt;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="border: 1px solid black; padding: 3px;" rowspan="2">No</th>
            <th style="border: 1px solid black; padding: 3px;" colspan="3">Deskripsi Risiko</th>
            <th style="border: 1px solid black; padding: 3px;" rowspan="2">Persyaratan</th>
            <th style="border: 1px solid black; padding: 3px;" rowspan="2">Pengendalian Awal</th>
            <th style="border: 1px solid black; padding: 3px;" colspan="3">Penilaian Awal</th>
            <th style="border: 1px solid black; padding: 3px;" rowspan="2">Pengendalian Lanjutan</th>
            <th style="border: 1px solid black; padding: 3px;" colspan="3">Penilaian Sisa</th>
            <th style="border: 1px solid black; padding: 3px;" rowspan="2">Ket</th>
          </tr>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="border: 1px solid black; padding: 3px;">Uraian Pekerjaan</th>
            <th style="border: 1px solid black; padding: 3px;">Identifikasi Bahaya</th>
            <th style="border: 1px solid black; padding: 3px;">Jenis Bahaya</th>
            <th style="border: 1px solid black; padding: 3px;">F</th>
            <th style="border: 1px solid black; padding: 3px;">A</th>
            <th style="border: 1px solid black; padding: 3px;">TR</th>
            <th style="border: 1px solid black; padding: 3px;">F</th>
            <th style="border: 1px solid black; padding: 3px;">A</th>
            <th style="border: 1px solid black; padding: 3px;">TR</th>
          </tr>
        </thead>
        <tbody>
          ${ibprpRows}
        </tbody>
      </table>

      <h4 style="font-size: 11pt; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">OPERASI KESELAMATAN KONSTRUKSI (JSA & APD)</h4>
      <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="border: 1px solid black; padding: 4px; width: 5%;">No</th>
            <th style="border: 1px solid black; padding: 4px;">Urutan Langkah Pekerjaan</th>
            <th style="border: 1px solid black; padding: 4px;">Identifikasi Bahaya</th>
            <th style="border: 1px solid black; padding: 4px;">Pengendalian yang Diperlukan</th>
            <th style="border: 1px solid black; padding: 4px;">Penanggung Jawab</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 4px; text-align: center;">1</td>
            <td style="border: 1px solid black; padding: 4px; font-weight: bold;">Pekerjaan Pembongkaran & Galian Pondasi</td>
            <td style="border: 1px solid black; padding: 4px;">Dinding tanah galian runtuh, terpeleset ke lubang</td>
            <td style="border: 1px solid black; padding: 4px;">Pemasangan turap cerucuk, barikade pembatas lubang galian, APD helm & sepatu boots</td>
            <td style="border: 1px solid black; padding: 4px; font-weight: bold;">Pelaksana Lapangan</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 4px; text-align: center;">2</td>
            <td style="border: 1px solid black; padding: 4px; font-weight: bold;">Pemasangan Perancah Scaffolding & Cor Lantai Atas</td>
            <td style="border: 1px solid black; padding: 4px;">Perancah miring/ambles, jatuh dari ketinggian</td>
            <td style="border: 1px solid black; padding: 4px;">Landasan papan tebal, pasang safety net di sekeliling lantai, wajib full body harness</td>
            <td style="border: 1px solid black; padding: 4px; font-weight: bold;">Petugas K3 Konstruksi</td>
          </tr>
        </tbody>
      </table>

      <h4 style="font-size: 11pt; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">E.1. JADWAL INSPEKSI DAN AUDIT K3</h4>
      <table style="width: 100%; border: 1px solid black; border-collapse: collapse; text-align: center; font-size: 9pt;">
        <thead>
          <tr style="background-color: #f1f5f9; font-weight: bold;">
            <th style="border: 1px solid black; padding: 3px; width: 5%;" rowspan="2">No</th>
            <th style="border: 1px solid black; padding: 3px; text-align: left;" rowspan="2">Kegiatan</th>
            <th style="border: 1px solid black; padding: 3px;" rowspan="2">PIC</th>
            <th style="border: 1px solid black; padding: 3px;" colspan="12">Bulan Ke-</th>
          </tr>
          <tr style="background-color: #f1f5f9; font-weight: bold;">
            <th style="border: 1px solid black; padding: 2px;">1</th>
            <th style="border: 1px solid black; padding: 2px;">2</th>
            <th style="border: 1px solid black; padding: 2px;">3</th>
            <th style="border: 1px solid black; padding: 2px;">4</th>
            <th style="border: 1px solid black; padding: 2px;">5</th>
            <th style="border: 1px solid black; padding: 2px;">6</th>
            <th style="border: 1px solid black; padding: 2px;">7</th>
            <th style="border: 1px solid black; padding: 2px;">8</th>
            <th style="border: 1px solid black; padding: 2px;">9</th>
            <th style="border: 1px solid black; padding: 2px;">10</th>
            <th style="border: 1px solid black; padding: 2px;">11</th>
            <th style="border: 1px solid black; padding: 2px;">12</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 3px;">1</td>
            <td style="border: 1px solid black; padding: 3px; text-align: left; font-weight: bold;">Inspeksi Keselamatan Konstruksi Harian/Mingguan</td>
            <td style="border: 1px solid black; padding: 3px;">Petugas K3</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 3px;">2</td>
            <td style="border: 1px solid black; padding: 3px; text-align: left; font-weight: bold;">Patroli Keselamatan Konstruksi Terpadu</td>
            <td style="border: 1px solid black; padding: 3px;">Tim K3 & Pengawas</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 3px;">3</td>
            <td style="border: 1px solid black; padding: 3px; text-align: left; font-weight: bold;">Audit Internal SMKK</td>
            <td style="border: 1px solid black; padding: 3px;">Auditor K3 Dinas</td>
            <td style="border: 1px solid black; padding: 2px;">-</td>
            <td style="border: 1px solid black; padding: 2px;">-</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">-</td>
            <td style="border: 1px solid black; padding: 2px;">-</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">-</td>
            <td style="border: 1px solid black; padding: 2px;">-</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
            <td style="border: 1px solid black; padding: 2px;">-</td>
            <td style="border: 1px solid black; padding: 2px;">-</td>
            <td style="border: 1px solid black; padding: 2px;">✓</td>
          </tr>
        </tbody>
      </table>

      <!-- Kotak Paraf Koordinasi Footer -->
      ${parafFooterHtml}

      </div>

      <!-- KOTAK PARAF KOORDINASI FOOTER UNTUK WORD (RUNNING FOOTER PADA SETIAP HALAMAN) -->
      <div style="mso-element:footer" id="f1">
        ${parafFooterHtml}
      </div>

    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DOKUMEN_KONTRAK_LENGKAP_${contract.nomorSurat.replace(/[/\\?%*:|"<>]/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

