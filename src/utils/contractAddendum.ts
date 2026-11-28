import type { ContractAddendumDocument, ContractAddendumFormat, ContractAddendumSource, ContractAddendumTerms, ContractClause, Project, ProjectContract, ScheduleAddendum, SpkContract } from '../types';
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
  const order = Number(match?.[1]);
  return Number.isSafeInteger(order) ? order : undefined;
}

export function scheduleAddendumTerms(record?: ScheduleAddendum) {
  return {
    nilai: record?.nilaiKontrakBaru,
    durasi: record?.durasiHariBaru,
    selesai: record?.tanggalSelesaiBaru,
  };
}

type AddendumRecord = {
  id: string;
  nomor: string;
  tanggal: string;
  dokumenKontrak?: ContractAddendumDocument;
};

export function recordedAddendumOrder(record: AddendumRecord) {
  return record.dokumenKontrak?.format?.urutan ??
    addendumOrder(record.dokumenKontrak?.nomor ?? '') ??
    addendumOrder(record.nomor);
}

function revisionTerms(primary: ContractAddendumTerms, fallback?: ContractAddendumTerms): ContractAddendumTerms {
  return {
    nilai: primary.nilai ?? fallback?.nilai,
    durasi: primary.durasi ?? fallback?.durasi,
    selesai: primary.selesai || fallback?.selesai,
  };
}

export function contractAddendumHistory(
  records: AddendumRecord[],
  schedules: ScheduleAddendum[],
  { source, date, number, manualOrder, id, terms }: {
    source: ContractAddendumSource;
    date: string;
    number: string;
    manualOrder?: number;
    id?: string;
    terms?: ContractAddendumTerms;
  },
): Pick<ContractAddendumFormat, 'urutan' | 'revisi'> {
  const saved = records.find(record => record.id === id)?.dokumenKontrak?.format;
  const savedOrder = saved?.urutan;
  const order = manualOrder ?? savedOrder ?? addendumOrder(number);
  const bySourceId = new Map(records.map(record => ['addendum:' + record.id, record]));
  const ancestors = new Set<string>();
  let sourceId = source.id;
  while (bySourceId.has(sourceId) && !ancestors.has(sourceId)) {
    ancestors.add(sourceId);
    sourceId = bySourceId.get(sourceId)?.dokumenKontrak?.sumber.id ?? '';
  }

  const candidates = records.flatMap(record => {
    const documentSource = record.dokumenKontrak?.sumber;
    if (record.id === id || record.tanggal > date || (documentSource &&
      (documentSource.nomorKontrakAwal !== source.nomorKontrakAwal || documentSource.jenis !== source.jenis))) return [];
    const recordOrder = recordedAddendumOrder(record);
    if (order !== undefined && recordOrder !== undefined && recordOrder >= order) return [];
    // A new document can follow the day's existing records. For a saved document,
    // same-day predecessors need an earlier order or a link in its source chain.
    const isEarlier = id === undefined || record.tanggal < date || ancestors.has('addendum:' + record.id) ||
      (order !== undefined && recordOrder !== undefined);
    if (!isEarlier) return [];
    return [{ record, order: recordOrder }];
  }).sort((a, b) => a.record.tanggal.localeCompare(b.record.tanggal) ||
    (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  const occupied = new Set(candidates.map(candidate => candidate.order));
  const scheduleById = new Map(schedules.map(schedule => [schedule.id, schedule]));
  const prior = new Map<number, ContractAddendumFormat['revisi'][number]>();
  // Retain terms saved with the document and fill missing rows or fields from records.
  if (saved) {
    for (const row of saved.revisi) {
      if (row.urutan < saved.urutan) prior.set(row.urutan, row);
    }
  }
  let previousOrder = 0;
  for (const candidate of candidates) {
    let recordOrder = candidate.order;
    if (recordOrder === undefined) {
      recordOrder = previousOrder + 1;
      while (occupied.has(recordOrder)) recordOrder++;
    }
    previousOrder = Math.max(previousOrder, recordOrder);
    const format = candidate.record.dokumenKontrak?.format;
    const recordedTerms = format?.revisi.find(row => row.urutan === format.urutan);
    const scheduleTerms = scheduleAddendumTerms(scheduleById.get(candidate.record.id));
    const currentTerms = revisionTerms(recordedTerms ?? {}, scheduleTerms);
    prior.set(recordOrder, { ...revisionTerms(prior.get(recordOrder) ?? {}, currentTerms), urutan: recordOrder });
  }

  const urutan = order ?? Math.max(0, ...prior.keys()) + 1;
  const savedTerms = saved?.revisi.find(row => row.urutan === savedOrder);
  const ownTerms = terms ?? revisionTerms(savedTerms ?? {}, scheduleAddendumTerms(scheduleById.get(id ?? '')));
  return {
    urutan,
    revisi: [...prior.values()].filter(row => row.urutan < urutan).sort((a, b) => a.urutan - b.urutan)
      .concat({ ...ownTerms, urutan }),
  };
}
