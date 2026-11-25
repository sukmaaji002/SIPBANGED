import type { ContractAddendumDocument, ContractAddendumSource, ContractClause, Project, ProjectContract, ScheduleAddendum, SpkContract } from '../types';
import { SURAT_PERJANJIAN_CLAUSES } from '../data/lkppClauses';
import { angkaKeTerbilang, angkaKeTerbilangHari, formatRupiah, formatTanggalIndo, resolveContractPlaceholders } from './formatters';
import { parseRuangLingkup } from './ruangLingkupParser';

export const getPelaksanaanHuruf = (hari: number, huruf?: string) => {
  const terbilangAuto = angkaKeTerbilangHari(hari);
  if (!huruf) return terbilangAuto;
  if (huruf.toLowerCase() === 'seratus delapan puluh' && hari !== 180 && terbilangAuto) {
    return terbilangAuto;
  }
  return huruf;
};

export const activeAgreementArticles = (contract: ProjectContract) => (contract.clauses ?? []).filter(
  clause => clause.isActive && clause.kategori === 'Surat Perjanjian' && clause.id !== 'sp-konsiderans' && clause.id !== 'sp-premis',
);

export function agreementScope(contract: ProjectContract, clause?: ContractClause) {
  return parseRuangLingkup(clause?.kontenCustom ?? (contract.ruangLingkupUtama?.length ? contract.ruangLingkupUtama :
    clause ? ['Pekerjaan Persiapan & SMKK', 'Pekerjaan Pondasi & Struktur Beton', 'Pekerjaan Pasangan Dinding & Plesteran', 'Pekerjaan Penutup Lantai & Atap', 'Pekerjaan Mekanikal Elektrikal']
      : ['Pekerjaan Persiapan', 'Pekerjaan Struktur', 'Pekerjaan Arsitektur']));
}

export function agreementArticleText(contract: ProjectContract, clause: ContractClause, usesFallback = false): string {
  switch (clause.id) {
    case 'sp-pasal-2':
      return ['Ruang lingkup pekerjaan utama terdiri dari:', ...agreementScope(contract, usesFallback ? undefined : clause)
        .flatMap((item, index) => [
          (index + 1) + '. ' + item.nama,
          ...(item.subItems ?? []).map((sub, subIndex) => '  ' + String.fromCharCode(97 + subIndex % 26) + '. ' + sub),
        ])].join('\n');
    case 'sp-pasal-3':
      return `1. Harga Kontrak termasuk Pajak Pertambahan Nilai (PPN) yang diperoleh berdasarkan total harga penawaran sebagaimana tercantum dalam Daftar Kuantitas dan Harga adalah sebesar ${formatRupiah(contract.nilaiKontrakAngka)} (${angkaKeTerbilang(contract.nilaiKontrakAngka)}) dengan kode akun kegiatan ${contract.kodeAkunKegiatan};\n2. Kontrak ini dibiayai dari ${contract.sumberPembiayaan};\n3. Pembayaran untuk kontrak ini dilakukan ke ${contract.bankNamaDanCabang} rekening nomor ${contract.nomorRekeningPenyedia} atas nama Penyedia ${contract.namaRekeningPenyedia}.`;
    case 'sp-pasal-5':
      return `1. Masa Kontrak adalah jangka waktu berlakunya Kontrak ini terhitung sejak tanggal penandatanganan Kontrak sampai dengan Tanggal Penyerahan Akhir Pekerjaan (FHO);\n2. Masa Pelaksanaan ditentukan dalam Syarat-Syarat Khusus Kontrak, dihitung sejak Tanggal Mulai Kerja yang tercantum dalam SPMK sampai dengan Tanggal Penyerahan Pertama Pekerjaan selama ${contract.jangkaWaktuPelaksanaanHari} (${getPelaksanaanHuruf(contract.jangkaWaktuPelaksanaanHari, contract.jangkaWaktuPelaksanaanHuruf)}) hari kalender;\n3. Masa Pemeliharaan ditentukan dalam Syarat-Syarat Khusus Kontrak dihitung sejak Tanggal Penyerahan Pertama Pekerjaan sampai dengan Tanggal Penyerahan Akhir Pekerjaan selama ${contract.jangkaWaktuPemeliharaanHari} (${getPelaksanaanHuruf(contract.jangkaWaktuPemeliharaanHari, contract.jangkaWaktuPemeliharaanHuruf)}) hari kalender.`;
    default:
      return clause.kontenCustom ?? clause.kontenDefault;
  }
}

export function sourceFromAgreement(contract: ProjectContract, project: Project): ContractAddendumSource {
  const active = activeAgreementArticles(contract);
  const articles = active.length ? active : SURAT_PERJANJIAN_CLAUSES.filter(clause => typeof clause.pasal === 'number');
  const preliminaries = (contract.clauses ?? []).filter(clause => clause.isActive && ['sp-konsiderans', 'sp-premis'].includes(clause.id));
  return {
    id: 'perjanjian:' + contract.id,
    jenis: 'perjanjian',
    nomor: contract.nomorSurat,
    tanggal: contract.tanggal,
    nomorKontrakAwal: contract.nomorSurat,
    tanggalKontrakAwal: contract.tanggal,
    namaPaket: contract.namaPaket,
    ppk: contract.ppkNama,
    penyedia: contract.penyediaNamaBadanUsaha,
    penandaTanganPenyedia: contract.penyediaNamaDirektur,
    rincian: {
      lokasi: project.lokasi, dana: contract.sumberPembiayaan || project.sumberDana, tahun: project.tahunAnggaran,
      nilai: contract.nilaiKontrakAngka, durasi: contract.jangkaWaktuPelaksanaanHari,
      mulai: project.paketFisik?.tanggalMulai || project.tanggalMulai,
      selesai: project.paketFisik?.tanggalSelesai || project.tanggalSelesai,
      pemeliharaan: contract.jangkaWaktuPemeliharaanHari, jenisKontrak: contract.jenisKontrak,
      ppkNip: contract.ppkNip, ppkJabatan: contract.ppkJabatan,
      ppkNomorSk: contract.ppkNomorSK, ppkTanggalSk: contract.ppkTanggalSK,
      penyediaAlamat: contract.penyediaKedudukan, penyediaJabatan: contract.penyediaJabatan,
      aktaNomor: contract.penyediaAktaNomor, aktaTanggal: contract.penyediaAktaTanggal, aktaNotaris: contract.penyediaAktaNotaris,
    },
    pasal: [
      ...preliminaries.map(clause => ({
        id: clause.id, label: String(clause.pasal), judul: clause.judul,
        sebelumnya: resolveContractPlaceholders(clause.kontenCustom ?? clause.kontenDefault, contract),
      })),
      ...articles.map((clause, index) => ({
        id: clause.id, label: 'Pasal ' + (index + 1), judul: clause.judul,
        sebelumnya: agreementArticleText(contract, clause, !active.length),
      })),
    ],
  };
}

export function sourceFromSpk(spk: SpkContract): ContractAddendumSource {
  const coverItems = [
    { id: 'paket', judul: 'Paket dan lokasi pekerjaan', sebelumnya: [spk.namaPaket, spk.lokasiPekerjaan].filter(Boolean).join('\n') },
    { id: 'nilai', judul: 'Nilai kontrak dan sumber dana', sebelumnya: [
      'Nilai kontrak: ' + formatRupiah(spk.nilaiKontrak) + (spk.nilaiKontrakTerbilang ? ' (' + spk.nilaiKontrakTerbilang + ')' : ''),
      'Sumber dana: ' + spk.sumberDana, 'Kode rekening: ' + spk.kodeRekeningKegiatan,
    ].join('\n') },
    { id: 'waktu', judul: 'Waktu pelaksanaan', sebelumnya: [
      'Jangka waktu: ' + spk.jangkaWaktuHari + ' hari kalender',
      'Tanggal mulai: ' + formatTanggalIndo(spk.tanggalMulai), 'Tanggal selesai: ' + formatTanggalIndo(spk.tanggalSelesai),
      ...(spk.masaPemeliharaanHari == null ? [] : ['Masa pemeliharaan: ' + spk.masaPemeliharaanHari + ' hari kalender']),
    ].join('\n') },
    { id: 'lingkup', judul: 'Ruang lingkup pekerjaan', sebelumnya: (spk.ruangLingkup ?? []).join('\n') },
    { id: 'bayar', judul: 'Pembayaran dan denda', sebelumnya: [spk.sistemPembayaran, spk.keteranganPembayaran, spk.dendaKeterlambatan].filter(Boolean).join('\n') },
  ];
  return {
    id: 'spk:' + spk.id,
    jenis: 'spk',
    nomor: spk.nomorSpk,
    tanggal: spk.tanggalSpk,
    nomorKontrakAwal: spk.nomorSpk,
    tanggalKontrakAwal: spk.tanggalSpk,
    namaPaket: spk.namaPaket,
    ppk: spk.ppkNama,
    penyedia: spk.penyediaNamaBadanUsaha,
    penandaTanganPenyedia: spk.penyediaNamaPimpinan,
    rincian: {
      kegiatan: spk.kegiatan, lokasi: spk.lokasiPekerjaan, dana: spk.sumberDana, tahun: spk.tahunAnggaran,
      nilai: spk.nilaiKontrak, durasi: spk.jangkaWaktuHari, mulai: spk.tanggalMulai, selesai: spk.tanggalSelesai,
      pemeliharaan: spk.masaPemeliharaanHari, jenisKontrak: spk.jenisKontrak,
      ppkNip: spk.ppkNip, ppkJabatan: spk.ppkJabatan, ppkNomorSk: spk.ppkNomorSk,
      penyediaAlamat: spk.penyediaAlamat, penyediaJabatan: spk.penyediaJabatanPimpinan,
      aktaNomor: spk.penyediaAktaNotarisNomor, aktaTanggal: spk.penyediaAktaNotarisTanggal, aktaNotaris: spk.penyediaAktaNotarisNama,
    },
    pasal: [
      ...coverItems.map(item => ({ ...item, id: 'spk-cover-' + item.id, label: 'Lembar SPK' })),
      ...(spk.clauses ?? []).filter(clause => clause.isActive).map(clause => ({
        id: clause.id, label: typeof clause.pasal === 'number' ? 'Pasal ' + clause.pasal : /^\d+$/.test(clause.pasal) ? 'Pasal ' + clause.pasal : clause.pasal,
        judul: clause.judul, sebelumnya: clause.isi,
      })),
    ],
  };
}

export function sourceFromAddendum(id: string, document: ContractAddendumDocument): ContractAddendumSource {
  return {
    ...document.sumber, id: 'addendum:' + id, nomor: document.nomor, tanggal: document.tanggal,
    pasal: document.sumber.pasal.map(({ perubahan, ...clause }) => ({
      ...clause, sebelumnya: perubahan ?? clause.sebelumnya,
    })),
  };
}

export function addendumOrder(number: string): number | undefined {
  const match = /\b(?:addendum|adendum|add)\s*(?:ke\s*)?[-. ]*0*([1-9]\d*)\b/i.exec(number);
  return match ? Number(match[1]) : undefined;
}

export function scheduleAddendumTerms(record?: ScheduleAddendum) {
  return {
    nilai: record?.nilaiKontrakBaru,
    durasi: record?.durasiHariBaru,
    selesai: record?.tanggalSelesaiBaru,
  };
}
