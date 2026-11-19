export const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val);
};

/**
 * Format angka atau string angka ke pemisah ribuan titik Indonesia (contoh: 13920000000 -> 13.920.000.000)
 */
export const formatRibuan = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  const cleanStr = val.toString().replace(/\D/g, '');
  if (!cleanStr) return '';
  const num = parseInt(cleanStr, 10);
  if (isNaN(num)) return '';
  return num.toLocaleString('id-ID');
};

/**
 * Mengubah string format ribuan (contoh: '13.920.000.000') menjadi angka murni (number)
 */
export const parseRibuanKeAngka = (valStr: string | number | undefined | null): number => {
  if (valStr === undefined || valStr === null || valStr === '') return 0;
  if (typeof valStr === 'number') return isNaN(valStr) ? 0 : valStr;
  const clean = valStr.toString().replace(/\D/g, '');
  return clean ? parseInt(clean, 10) : 0;
};

export const formatTanggalIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatTanggalSingkat = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatRentangTanggal = (startStr: string, endStr: string): string => {
  if (!startStr && !endStr) return '-';
  if (startStr && !endStr) return formatTanggalIndo(startStr);
  if (!startStr && endStr) return formatTanggalIndo(endStr);
  return `${formatTanggalSingkat(startStr)} s/d ${formatTanggalSingkat(endStr)}`;
};

const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

export const angkaKeTerbilang = (angka: number): string => {
  if (angka === 0) return 'Nol Rupiah';
  if (angka < 0) return 'Minus ' + angkaKeTerbilang(Math.abs(angka));

  const convert = (n: number): string => {
    if (n < 12) return satuan[n];
    if (n < 20) return convert(n - 10) + ' Belas';
    if (n < 100) return convert(Math.floor(n / 10)) + ' Puluh ' + convert(n % 10);
    if (n < 200) return 'Seratus ' + convert(n - 100);
    if (n < 1000) return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    if (n < 2000) return 'Seribu ' + convert(n - 1000);
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    if (n < 1000000000000) return convert(Math.floor(n / 1000000000)) + ' Miliar ' + convert(n % 1000000000);
    return convert(Math.floor(n / 1000000000000)) + ' Triliun ' + convert(n % 1000000000000);
  };

  const result = convert(Math.floor(angka)).replace(/\s+/g, ' ').trim();
  return result + ' Rupiah';
};

/**
 * Mengonversi jumlah hari ke teks terbilang (tanpa kata Rupiah)
 * Contoh: 150 -> "Seratus Lima Puluh", 180 -> "Seratus Delapan Puluh"
 */
export const angkaKeTerbilangHari = (angka: number): string => {
  if (!angka || isNaN(angka) || angka <= 0) return '';
  return angkaKeTerbilang(angka).replace(/\s*rupiah/gi, '').trim();
};

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Mengurai tanggal ISO (YYYY-MM-DD) menjadi komponen-komponen resmi Surat Perjanjian:
 * pada hari (hari sesuai tanggal) tanggal (tanggal) bulan (bulan) tahun (tahun dalam angka) ((tanggal bulan tahun dalam angka))
 */
export const parseKomponenTanggalKontrak = (dateStr: string) => {
  if (!dateStr) {
    return {
      hari: 'Senin',
      tanggalTeks: 'satu',
      tanggalAngka: '1',
      bulanTeks: 'Januari',
      tahunAngka: '2026',
      tanggalBulanTahunAngka: '01-01-2026'
    };
  }

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);

    const dt = new Date(y, m - 1, d);
    const hari = NAMA_HARI[dt.getDay()] || 'Senin';
    const bulanTeks = NAMA_BULAN[m - 1] || 'Januari';
    const tahunAngka = String(y);

    const satuanKecil = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
    let tanggalTeks = '';
    if (d < 12) {
      tanggalTeks = satuanKecil[d];
    } else if (d < 20) {
      tanggalTeks = satuanKecil[d - 10] + ' belas';
    } else if (d < 30) {
      tanggalTeks = 'dua puluh' + (d % 10 !== 0 ? ' ' + satuanKecil[d % 10] : '');
    } else if (d === 30) {
      tanggalTeks = 'tiga puluh';
    } else if (d === 31) {
      tanggalTeks = 'tiga puluh satu';
    } else {
      tanggalTeks = String(d);
    }

    const padD = String(d).padStart(2, '0');
    const padM = String(m).padStart(2, '0');
    const tanggalBulanTahunAngka = `${padD}-${padM}-${y}`;

    return {
      hari,
      tanggalTeks,
      tanggalAngka: String(d),
      bulanTeks,
      tahunAngka,
      tanggalBulanTahunAngka
    };
  }

  return {
    hari: 'Senin',
    tanggalTeks: dateStr,
    tanggalAngka: dateStr,
    bulanTeks: '-',
    tahunAngka: '2026',
    tanggalBulanTahunAngka: dateStr
  };
};

/**
 * Menggantikan variabel/placeholder {{VARIABEL}} dalam klausul kontrak secara dinamis
 * dengan data rincian proyek, formulir kontrak, dan SSKK.
 */
export const resolveContractPlaceholders = (text: string, contract: any): string => {
  if (!text) return '';
  const replacers: [RegExp, string][] = [
    [/\{\{\s*NAMA_PAKET\s*\}\}/gi, contract.namaPaket || ''],
    [/\{\{\s*METODE_PEMILIHAN\s*\}\}/gi, contract.metodePemilihan || 'E-Purchasing'],
    [/\{\{\s*NOMOR_SPPBJ\s*\}\}/gi, contract.nomorSPPBJ || ''],
    [/\{\{\s*TANGGAL_SPPBJ\s*\}\}/gi, contract.tanggalSPPBJ ? formatTanggalIndo(contract.tanggalSPPBJ) : ''],
    [/\{\{\s*NOMOR_SURAT\s*\}\}/gi, contract.nomorSurat || ''],
    [/\{\{\s*JENIS_KONTRAK\s*\}\}/gi, contract.jenisKontrak || 'Harga Satuan'],
    [/\{\{\s*NAMA_PENYEDIA\s*\}\}/gi, contract.penyediaNamaBadanUsaha || ''],
    [/\{\{\s*NAMA_DIREKTUR\s*\}\}/gi, contract.penyediaNamaDirektur || ''],
    [/\{\{\s*JABATAN_DIREKTUR\s*\}\}/gi, contract.penyediaJabatan || 'Direktur Utama'],
    [/\{\{\s*ALAMAT_PENYEDIA\s*\}\}/gi, contract.penyediaKedudukan || ''],
    [/\{\{\s*NAMA_PPK\s*\}\}/gi, contract.ppkNama || ''],
    [/\{\{\s*NIP_PPK\s*\}\}/gi, contract.ppkNip || ''],
    [/\{\{\s*JABATAN_PPK\s*\}\}/gi, contract.ppkJabatan || 'Pejabat Pembuat Komitmen'],
    [/\{\{\s*NILAI_KONTRAK\s*\}\}/gi, typeof contract.nilaiKontrakAngka === 'number' ? formatRupiah(contract.nilaiKontrakAngka) : ''],
    [/\{\{\s*NILAI_TERBILANG\s*\}\}/gi, typeof contract.nilaiKontrakAngka === 'number' ? angkaKeTerbilang(contract.nilaiKontrakAngka) : ''],
    [/\{\{\s*SUMBER_PEMBIAYAAN\s*\}\}/gi, contract.sumberPembiayaan || ''],
    [/\{\{\s*KODE_AKUN_KEGIATAN\s*\}\}/gi, contract.kodeAkunKegiatan || ''],
    [/\{\{\s*BANK_PENYEDIA\s*\}\}/gi, contract.bankNamaDanCabang || ''],
    [/\{\{\s*NOMOR_REKENING_PENYEDIA\s*\}\}/gi, contract.nomorRekeningPenyedia || ''],
    [/\{\{\s*NAMA_REKENING_PENYEDIA\s*\}\}/gi, contract.namaRekeningPenyedia || ''],
    [/\{\{\s*JANGKA_WAKTU_PELAKSANAAN\s*\}\}/gi, contract.jangkaWaktuPelaksanaanHari ? `${contract.jangkaWaktuPelaksanaanHari} (${(contract.jangkaWaktuPelaksanaanHuruf && (contract.jangkaWaktuPelaksanaanHari === 180 || contract.jangkaWaktuPelaksanaanHuruf.toLowerCase() !== 'seratus delapan puluh')) ? contract.jangkaWaktuPelaksanaanHuruf : (angkaKeTerbilangHari(contract.jangkaWaktuPelaksanaanHari) || contract.jangkaWaktuPelaksanaanHuruf || '')}) hari kalender` : ''],
    [/\{\{\s*JANGKA_WAKTU_PEMELIHARAAN\s*\}\}/gi, contract.jangkaWaktuPemeliharaanHari ? `${contract.jangkaWaktuPemeliharaanHari} (${(contract.jangkaWaktuPemeliharaanHuruf && (contract.jangkaWaktuPemeliharaanHari === 180 || contract.jangkaWaktuPemeliharaanHuruf.toLowerCase() !== 'seratus delapan puluh')) ? contract.jangkaWaktuPemeliharaanHuruf : (angkaKeTerbilangHari(contract.jangkaWaktuPemeliharaanHari) || contract.jangkaWaktuPemeliharaanHuruf || '')}) hari kalender` : '']
  ];

  let result = text;
  for (const [pattern, val] of replacers) {
    result = result.replace(pattern, val);
  }
  return result;
};

