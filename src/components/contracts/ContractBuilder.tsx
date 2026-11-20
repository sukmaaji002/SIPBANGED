import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ProjectContract, 
  ContractClause, 
  PersonelManajerialItem, 
  PeralatanUtamaItem, 
  SubkontraktorItem, 
  HargaSatuanTimpangItem, 
  IBPRPItem 
} from '../../types';
import { OFFICIAL_DPUPR_TEGAL_CLAUSES, OFFICIAL_SSUK_CLAUSES } from '../../data/lkppClauses';
import { formatRupiah, formatRibuan, parseRibuanKeAngka, angkaKeTerbilang, angkaKeTerbilangHari, formatTanggalIndo, parseKomponenTanggalKontrak, resolveContractPlaceholders } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';
import { KopSurat } from '../common/KopSurat';
import { SuratPerjanjianPrint } from './SuratPerjanjianPrint';
import { SSUKPrint } from './SSUKPrint';
import { SSKKPrint } from './SSKKPrint';
import { LampiranAPrint } from './LampiranAPrint';
import { LampiranBPrint } from './LampiranBPrint';
import { ClauseTextEditor } from './ClauseTextEditor';
import { RichSpan } from '../../utils/richText';
import { generateContractWordDoc } from '../../utils/contractWordExport';
import { RuangLingkupEditor } from './RuangLingkupEditor';
import { parseRuangLingkup, formatRuangLingkupToLines, formatRuangLingkupToText } from '../../utils/ruangLingkupParser';
import { PpkSelectorDropdown } from '../common/PpkSelectorDropdown';
import { 
  CheckSquare, 
  Square, 
  Edit3, 
  Printer, 
  Save, 
  Eye, 
  RotateCcw, 
  Building,
  Download,
  Sparkles,
  Sliders,
  Plus,
  Trash2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Link2
} from 'lucide-react';

export const ContractBuilder: React.FC = () => {
  const { selectedProject, contracts, updateContract, currentUser } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'form' | 'klausul' | 'preview'>('form');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  if (!selectedProject) {
    return <div className="p-8 text-center text-slate-500">Pilih proyek terlebih dahulu.</div>;
  }

  // Find contract specifically for this project
  const existingContract = contracts.find(c => c.projectId === selectedProject.id);

  // Form States - Per Project
  const [namaPaket, setNamaPaket] = useState('');
  const [nomorSurat, setNomorSurat] = useState('');
  const [hari, setHari] = useState('Senin');
  const [tanggal, setTanggal] = useState('');
  const [tanggalTeks, setTanggalTeks] = useState('dua puluh');
  const [bulanTeks, setBulanTeks] = useState('Februari');
  const [tahunAngka, setTahunAngka] = useState<number | string>(2026);
  const [tanggalBulanTahunAngka, setTanggalBulanTahunAngka] = useState('20-02-2026');
  const [nomorSPPBJ, setNomorSPPBJ] = useState('');
  const [tanggalSPPBJ, setTanggalSPPBJ] = useState('');
  const [metodePemilihan, setMetodePemilihan] = useState('E-Purchasing');
  const [jenisKontrak, setJenisKontrak] = useState<ProjectContract['jenisKontrak']>('Harga Satuan');

  // Helper when user selects a date from calendar
  const handleDateChange = (val: string) => {
    setTanggal(val);
    if (val) {
      const comp = parseKomponenTanggalKontrak(val);
      setHari(comp.hari);
      setTanggalTeks(comp.tanggalTeks);
      setBulanTeks(comp.bulanTeks);
      setTahunAngka(comp.tahunAngka);
      setTanggalBulanTahunAngka(comp.tanggalBulanTahunAngka);
    }
  };

  // PPK Data
  const [ppkNama, setPpkNama] = useState('');
  const [ppkNip, setPpkNip] = useState('');
  const [ppkJabatan, setPpkJabatan] = useState('');
  const [ppkKedudukan, setPpkKedudukan] = useState('');
  const [ppkNomorSK, setPpkNomorSK] = useState('');
  const [ppkTahunSK, setPpkTahunSK] = useState<number>(2026);
  const [ppkTanggalSK, setPpkTanggalSK] = useState('');
  const [ppkTahunAnggaran, setPpkTahunAnggaran] = useState<number>(2026);

  // Penyedia Data
  const [penyediaNamaDirektur, setPenyediaNamaDirektur] = useState('');
  const [penyediaJabatan, setPenyediaJabatan] = useState('');
  const [penyediaNamaBadanUsaha, setPenyediaNamaBadanUsaha] = useState('');
  const [penyediaKedudukan, setPenyediaKedudukan] = useState('');
  const [penyediaAktaNomor, setPenyediaAktaNomor] = useState('');
  const [penyediaAktaTanggal, setPenyediaAktaTanggal] = useState('');
  const [penyediaAktaNotaris, setPenyediaAktaNotaris] = useState('');

  // Pembayaran & Keuangan
  const [nilaiKontrakAngka, setNilaiKontrakAngka] = useState<number>(0);
  const [kodeAkunKegiatan, setKodeAkunKegiatan] = useState('');
  const [sumberPembiayaan, setSumberPembiayaan] = useState('');
  const [bankNamaDanCabang, setBankNamaDanCabang] = useState('');
  const [nomorRekeningPenyedia, setNomorRekeningPenyedia] = useState('');
  const [namaRekeningPenyedia, setNamaRekeningPenyedia] = useState('');

  // Ruang Lingkup Utama & Waktu
  const [ruangLingkupText, setRuangLingkupText] = useState('');
  const [jangkaWaktuPelaksanaanHari, setJangkaWaktuPelaksanaanHari] = useState<number>(180);
  const [jangkaWaktuPelaksanaanHuruf, setJangkaWaktuPelaksanaanHuruf] = useState('Seratus Delapan Puluh');
  const [jangkaWaktuPemeliharaanHari, setJangkaWaktuPemeliharaanHari] = useState<number>(180);
  const [jangkaWaktuPemeliharaanHuruf, setJangkaWaktuPemeliharaanHuruf] = useState('Seratus Delapan Puluh');

  // SSKK Fields
  const [sskkEmailPPK, setSskkEmailPPK] = useState('');
  const [sskkEmailPenyedia, setSskkEmailPenyedia] = useState('');
  const [sskkWhatsappPenyedia, setSskkWhatsappPenyedia] = useState('');
  const [sskkFaksimiliPenyedia, setSskkFaksimiliPenyedia] = useState('-');
  const [sskkWakilSahPPK, setSskkWakilSahPPK] = useState('- tidak ada -');
  const [sskkWakilSahPenyedia, setSskkWakilSahPenyedia] = useState('- tidak ada -');
  const [sskkPencairanJaminan, setSskkPencairanJaminan] = useState('Kas Daerah Pemerintah Kabupaten Tegal');
  const [sskkUangMukaKetentuan, setSskkUangMukaKetentuan] = useState('Tidak diberikan Uang muka');
  const [sskkPembayaranCara, setSskkPembayaranCara] = useState('Termin');
  const [sskkTermin1Fisik, setSskkTermin1Fisik] = useState<number>(30);
  const [sskkTermin1Bayar, setSskkTermin1Bayar] = useState<number>(25);
  const [sskkTermin2Fisik, setSskkTermin2Fisik] = useState<number>(55);
  const [sskkTermin2Bayar, setSskkTermin2Bayar] = useState<number>(25);
  const [sskkTermin3Fisik, setSskkTermin3Fisik] = useState<number>(80);
  const [sskkTermin3Bayar, setSskkTermin3Bayar] = useState<number>(25);
  const [sskkTermin4Fisik, setSskkTermin4Fisik] = useState<number>(100);
  const [sskkTermin4Bayar, setSskkTermin4Bayar] = useState<number>(25);
  const [sskkDendaKeterlambatan, setSskkDendaKeterlambatan] = useState('1/1000 (satu perseribu) dari Harga Kontrak (sebelum PPN)');
  const [sskkUmurKonstruksiTahun, setSskkUmurKonstruksiTahun] = useState<number>(50);
  const [sskkPertanggunganKegagalanTahun, setSskkPertanggunganKegagalanTahun] = useState<number>(10);
  const [sskkPenyelesaianSengketa, setSskkPenyelesaianSengketa] = useState('Layanan Penyelesaian Sengketa Pengadaan Barang/Jasa Pemerintah LKPP');

  // Lampiran A & B
  const [hargaSatuanTimpang, setHargaSatuanTimpang] = useState<HargaSatuanTimpangItem[]>([]);
  const [subkontraktorUtama, setSubkontraktorUtama] = useState<SubkontraktorItem[]>([]);
  const [subkontraktorNonUtama, setSubkontraktorNonUtama] = useState<SubkontraktorItem[]>([]);
  const [personelList, setPersonelList] = useState<PersonelManajerialItem[]>([]);
  const [peralatanList, setPeralatanList] = useState<PeralatanUtamaItem[]>([]);
  const [ibprpList, setIbprpList] = useState<IBPRPItem[]>([]);

  // Preview sub-tab mode
  const [previewDocType, setPreviewDocType] = useState<'all' | 'sp' | 'ssuk' | 'sskk' | 'lampa' | 'lampb'>('all');

  // Clauses per project
  const [clauses, setClauses] = useState<ContractClause[]>([]);
  const [editingClauseId, setEditingClauseId] = useState<string | null>(null);
  const [tempClauseText, setTempClauseText] = useState<string>('');
  const [clauseSearch, setClauseSearch] = useState<string>('');
  const [selectedBab, setSelectedBab] = useState<string>('all');
  const [expandedClauseIds, setExpandedClauseIds] = useState<Set<string>>(new Set());

  const canEdit = hasPermission(currentUser?.role, 'edit_contract');

  // Sync state whenever selectedProject changes or existingContract is updated
  useEffect(() => {
    if (existingContract) {
      setNamaPaket(existingContract.namaPaket || selectedProject.nama);
      setNomorSurat(existingContract.nomorSurat || `600.1.1/045/KTR-PBG/PBLTARU/DPUPR/${selectedProject.tahunAnggaran}`);
      const tgl = existingContract.tanggal || selectedProject.tanggalMulai;
      const comp = parseKomponenTanggalKontrak(tgl);
      setHari(existingContract.hari || comp.hari);
      setTanggal(tgl);
      setTanggalTeks(existingContract.tanggalTeks || comp.tanggalTeks);
      setBulanTeks(existingContract.bulanTeks || comp.bulanTeks);
      setTahunAngka(existingContract.tahunAngka || comp.tahunAngka);
      setTanggalBulanTahunAngka(existingContract.tanggalBulanTahunAngka || comp.tanggalBulanTahunAngka);
      setNomorSPPBJ(existingContract.nomorSPPBJ || `600.1.1/038/SPPBJ/PBLTARU/${selectedProject.tahunAnggaran}`);
      setTanggalSPPBJ(existingContract.tanggalSPPBJ || '2026-02-20');
      setMetodePemilihan(existingContract.metodePemilihan || 'E-Purchasing');
      setJenisKontrak(existingContract.jenisKontrak || 'Harga Satuan');

      setPpkNama(existingContract.ppkNama || selectedProject.ppkNama);
      setPpkNip(existingContract.ppkNip || selectedProject.ppkNip);
      setPpkJabatan((existingContract.ppkJabatan || 'Pejabat Pembuat Komitmen (PPK) Bidang PBLTARU').replace(/PPKom/g, 'PPK'));
      setPpkKedudukan(existingContract.ppkKedudukan || 'Jl. Cut Nyak Dien, Kalisapu, Slawi, Kab. Tegal');
      setPpkNomorSK(existingContract.ppkNomorSK || '800.1.2/015');
      setPpkTahunSK(existingContract.ppkTahunSK || selectedProject.tahunAnggaran);
      setPpkTanggalSK(existingContract.ppkTanggalSK || `${selectedProject.tahunAnggaran}-01-05`);
      setPpkTahunAnggaran(existingContract.ppkTahunAnggaran || selectedProject.tahunAnggaran);

      setPenyediaNamaDirektur(existingContract.penyediaNamaDirektur || selectedProject.kontraktorDirektur || 'Ir. Bambang Haryadi');
      setPenyediaJabatan(existingContract.penyediaJabatan || 'Direktur Utama');
      setPenyediaNamaBadanUsaha(existingContract.penyediaNamaBadanUsaha || selectedProject.kontraktorNama);
      setPenyediaKedudukan(existingContract.penyediaKedudukan || 'Jl. Raya Procot No. 88, Slawi, Kab. Tegal');
      setPenyediaAktaNomor(existingContract.penyediaAktaNomor || 'AHU-0012456.AH.01.02.Tahun 2020');
      setPenyediaAktaTanggal(existingContract.penyediaAktaTanggal || '2020-04-12');
      setPenyediaAktaNotaris(existingContract.penyediaAktaNotaris || 'Siti Rahmawati, S.H., M.Kn.');

      setNilaiKontrakAngka(existingContract.nilaiKontrakAngka || selectedProject.nilaiKontrak);
      setKodeAkunKegiatan(existingContract.kodeAkunKegiatan || '1.03.02.2.01.0005');
      setSumberPembiayaan(existingContract.sumberPembiayaan || `${selectedProject.sumberDana} Tahun Anggaran ${selectedProject.tahunAnggaran}`);
      setBankNamaDanCabang(existingContract.bankNamaDanCabang || 'Bank Jateng Cabang Slawi');
      setNomorRekeningPenyedia(existingContract.nomorRekeningPenyedia || '1012-0045-8890');
      setNamaRekeningPenyedia(existingContract.namaRekeningPenyedia || selectedProject.kontraktorNama);

      const defaultLingkup = existingContract.ruangLingkupUtama && existingContract.ruangLingkupUtama.length > 0
        ? formatRuangLingkupToText(parseRuangLingkup(existingContract.ruangLingkupUtama))
        : '1. Pekerjaan Persiapan & SMKK\n2. Pekerjaan Pondasi & Struktur Beton\n3. Pekerjaan Pasangan Dinding & Plesteran\n4. Pekerjaan Penutup Lantai & Atap\n5. Pekerjaan Mekanikal Elektrikal';
      setRuangLingkupText(defaultLingkup);

      const durasi = existingContract.jangkaWaktuPelaksanaanHari || selectedProject.durasiHari || 180;
      setJangkaWaktuPelaksanaanHari(durasi);
      const isHurufSesuai = existingContract.jangkaWaktuPelaksanaanHuruf &&
        (durasi === 180 || existingContract.jangkaWaktuPelaksanaanHuruf.toLowerCase() !== 'seratus delapan puluh');
      setJangkaWaktuPelaksanaanHuruf(isHurufSesuai ? existingContract.jangkaWaktuPelaksanaanHuruf : (angkaKeTerbilangHari(durasi) || 'Seratus Delapan Puluh'));

      const pemeliharaan = existingContract.jangkaWaktuPemeliharaanHari || selectedProject.masaPemeliharaanHari || 180;
      setJangkaWaktuPemeliharaanHari(pemeliharaan);
      const isPemeliharaanSesuai = existingContract.jangkaWaktuPemeliharaanHuruf &&
        (pemeliharaan === 180 || existingContract.jangkaWaktuPemeliharaanHuruf.toLowerCase() !== 'seratus delapan puluh');
      setJangkaWaktuPemeliharaanHuruf(isPemeliharaanSesuai ? existingContract.jangkaWaktuPemeliharaanHuruf : (angkaKeTerbilangHari(pemeliharaan) || 'Seratus Delapan Puluh'));

      setSskkEmailPPK((existingContract.sskkEmailPPK || 'dpupr@tegalkab.go.id').replace(/,?\s*pbltaru\.kabtegal@gmail\.com/g, '').trim());
      setSskkEmailPenyedia(existingContract.sskkEmailPenyedia || 'kontraktor@wijayabangun.co.id');
      setSskkWhatsappPenyedia(existingContract.sskkWhatsappPenyedia || '0811-2678-900');
      setSskkFaksimiliPenyedia(existingContract.sskkFaksimiliPenyedia || '-');
      setSskkWakilSahPPK(existingContract.sskkWakilSahPPK || '- tidak ada -');
      setSskkWakilSahPenyedia(existingContract.sskkWakilSahPenyedia || '- tidak ada -');
      setSskkPencairanJaminan(existingContract.sskkPencairanJaminan || 'Kas Daerah Pemerintah Kabupaten Tegal');
      setSskkUangMukaKetentuan(existingContract.sskkUangMukaKetentuan || 'Tidak diberikan Uang muka');
      setSskkPembayaranCara(existingContract.sskkPembayaranCara || 'Termin');
      setSskkTermin1Fisik(existingContract.sskkTermin1Fisik || 30);
      setSskkTermin1Bayar(existingContract.sskkTermin1Bayar || 25);
      setSskkTermin2Fisik(existingContract.sskkTermin2Fisik || 55);
      setSskkTermin2Bayar(existingContract.sskkTermin2Bayar || 25);
      setSskkTermin3Fisik(existingContract.sskkTermin3Fisik || 80);
      setSskkTermin3Bayar(existingContract.sskkTermin3Bayar || 25);
      setSskkTermin4Fisik(existingContract.sskkTermin4Fisik || 100);
      setSskkTermin4Bayar(existingContract.sskkTermin4Bayar || 25);
      setSskkDendaKeterlambatan(existingContract.sskkDendaKeterlambatan || '1/1000 (satu perseribu) dari Harga Kontrak (sebelum PPN)');
      setSskkUmurKonstruksiTahun(existingContract.sskkUmurKonstruksiTahun || 50);
      setSskkPertanggunganKegagalanTahun(existingContract.sskkPertanggunganKegagalanTahun || 10);
      setSskkPenyelesaianSengketa(existingContract.sskkPenyelesaianSengketa || 'Layanan Penyelesaian Sengketa Pengadaan Barang/Jasa Pemerintah LKPP');

      setHargaSatuanTimpang(existingContract.hargaSatuanTimpang || [
        { id: 'hst-1', mataPembayaran: 'Tidak Ada', satuanUkuran: 'Tidak Ada', kuantitas: 'Tidak Ada', hpsRp: 0, penawaranRp: 0, persenTerhadapHps: '-', keterangan: 'Tidak Ada' }
      ]);
      setSubkontraktorUtama(existingContract.subkontraktorUtama || [
        { id: 'sub-1', bagianPekerjaan: 'Tidak Ada', namaSubkon: 'Tidak Ada', alamatSubkon: 'Tidak Ada', kualifikasiSubkon: 'Tidak Ada', keterangan: 'Tidak Ada' }
      ]);
      setSubkontraktorNonUtama(existingContract.subkontraktorNonUtama || [
        { id: 'sub-2', bagianPekerjaan: 'Tidak Ada', namaSubkon: 'Tidak Ada', alamatSubkon: 'Tidak Ada', kualifikasiSubkon: 'Tidak Ada', keterangan: 'Tidak Ada' }
      ]);

      setPersonelList(existingContract.personelManajerial || [
        { id: 'p1', nama: 'ERY SUGIANTO', jabatan: 'Pelaksana Lapangan Pekerjaan Gedung', pendidikan: 'SMK', pengalamanTahun: 1, sertifikatKompetensi: 'Pelaksana Lapangan Pekerjaan Gedung Jenjang 4', keterangan: '-' },
        { id: 'p2', nama: 'NOVEL SAPUTRA DWIFUADDILLAH', jabatan: 'Petugas Keselamatan Konstruksi', pendidikan: 'S1', pengalamanTahun: 0, sertifikatKompetensi: 'Ahli Madya K3 Konstruksi Jenjang 8', keterangan: '-' }
      ]);

      setPeralatanList(existingContract.peralatanUtama || [
        { id: 'a1', nama: 'Mesin Las Listrik', merekTipe: 'Mailthank', kapasitas: 'Min. 120A, elektroda Ø2,6-3,2 mm', jumlah: '1 Unit', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' },
        { id: 'a2', nama: 'Concrete Mixer / Molen Beton', merekTipe: 'Tigon', kapasitas: 'Drum min. 250 Liter', jumlah: '1 Unit', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' },
        { id: 'a3', nama: 'Scaffolding', merekTipe: 'Tubular Steel Frame', kapasitas: '250 kg/m2', jumlah: '3 Set', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' }
      ]);

      setIbprpList(existingContract.rkkTabelIBPRP || [
        { id: 'ib1', uraianPekerjaan: 'Pekerjaan Galian & Pondasi', identifikasiBahaya: 'Tertimbun tanah galian', jenisBahaya: 'Cedera fisik', pengendalianAwal: 'Pemasangan turap & barikade', tingkatRisiko: 'Sedang', pengendalianLanjutan: 'Pengawasan petugas K3' },
        { id: 'ib2', uraianPekerjaan: 'Pengecoran Balok & Plat Lantai', identifikasiBahaya: 'Jatuh dari ketinggian', jenisBahaya: 'Fatalitas', pengendalianAwal: 'Safety harness & safety net', tingkatRisiko: 'Besar', pengendalianLanjutan: 'Inspeksi berkala perancah scaffolding' }
      ]);

      const storedClauses = existingContract.clauses || [];
      const hasKonsiderans = storedClauses.some(c => c.id === 'sp-konsiderans');
      const hasPremis = storedClauses.some(c => c.id === 'sp-premis');
      const ssukCount = storedClauses.filter(c => c.kategori === 'SSUK (Syarat Umum)').length;
      if (!hasKonsiderans || !hasPremis || ssukCount < 79) {
        const customMap = new Map(storedClauses.filter(c => c.kontenCustom).map(c => [c.id, c.kontenCustom]));
        const activeMap = new Map(storedClauses.map(c => [c.id, c.isActive]));
        const mergedClauses = OFFICIAL_DPUPR_TEGAL_CLAUSES.map(clause => ({
          ...clause,
          kontenCustom: customMap.get(clause.id) ?? clause.kontenCustom,
          isActive: activeMap.has(clause.id) ? (activeMap.get(clause.id) ?? true) : true
        }));
        setClauses(mergedClauses);
      } else {
        setClauses(storedClauses);
      }
    } else {
      // Create initial defaults for this project
      setNamaPaket(selectedProject.nama);
      setNomorSurat(`600.1.1/0${Math.floor(Math.random() * 80) + 10}/KTR-PBG/PBLTARU/DPUPR/${selectedProject.tahunAnggaran}`);
      const tglInit = selectedProject.tanggalMulai;
      const compInit = parseKomponenTanggalKontrak(tglInit);
      setHari(compInit.hari);
      setTanggal(tglInit);
      setTanggalTeks(compInit.tanggalTeks);
      setBulanTeks(compInit.bulanTeks);
      setTahunAngka(compInit.tahunAngka);
      setTanggalBulanTahunAngka(compInit.tanggalBulanTahunAngka);
      setNomorSPPBJ(`600.1.1/0${Math.floor(Math.random() * 80) + 10}/SPPBJ/PBLTARU/${selectedProject.tahunAnggaran}`);
      setTanggalSPPBJ('2026-02-20');
      setMetodePemilihan('E-Purchasing');
      setJenisKontrak('Harga Satuan');

      setPpkNama(selectedProject.ppkNama);
      setPpkNip(selectedProject.ppkNip);
      setPpkJabatan('Pejabat Pembuat Komitmen (PPK) Bidang Penataan Bangunan dan Lingkungan, Tata Ruang');
      setPpkKedudukan('Jl. Cut Nyak Dien, Kalisapu, Slawi, Kab. Tegal');
      setPpkNomorSK('800.1.2/015');
      setPpkTahunSK(selectedProject.tahunAnggaran);
      setPpkTanggalSK(`${selectedProject.tahunAnggaran}-01-05`);
      setPpkTahunAnggaran(selectedProject.tahunAnggaran);

      setPenyediaNamaDirektur(selectedProject.kontraktorDirektur || 'Ir. Bambang Haryadi');
      setPenyediaJabatan('Direktur Utama');
      setPenyediaNamaBadanUsaha(selectedProject.kontraktorNama);
      setPenyediaKedudukan('Jl. Raya Procot No. 88, Slawi, Kab. Tegal');
      setPenyediaAktaNomor('AHU-0012456.AH.01.02.Tahun 2020');
      setPenyediaAktaTanggal('2020-04-12');
      setPenyediaAktaNotaris('Siti Rahmawati, S.H., M.Kn.');

      setNilaiKontrakAngka(selectedProject.nilaiKontrak);
      setKodeAkunKegiatan('1.03.02.2.01.0005');
      setSumberPembiayaan(`${selectedProject.sumberDana} Tahun Anggaran ${selectedProject.tahunAnggaran}`);
      setBankNamaDanCabang('Bank Jateng Cabang Slawi');
      setNomorRekeningPenyedia('1012-0045-8890');
      setNamaRekeningPenyedia(selectedProject.kontraktorNama);

      setRuangLingkupText('1. Pekerjaan Persiapan & SMKK\n2. Pekerjaan Pondasi & Struktur Beton\n3. Pekerjaan Pasangan Dinding & Plesteran\n4. Pekerjaan Penutup Lantai & Atap\n5. Pekerjaan Mekanikal Elektrikal');
      const durasiBaru = selectedProject.durasiHari || 180;
      setJangkaWaktuPelaksanaanHari(durasiBaru);
      setJangkaWaktuPelaksanaanHuruf(angkaKeTerbilangHari(durasiBaru) || 'Seratus Delapan Puluh');

      const pemeliharaanBaru = selectedProject.masaPemeliharaanHari || 180;
      setJangkaWaktuPemeliharaanHari(pemeliharaanBaru);
      setJangkaWaktuPemeliharaanHuruf(angkaKeTerbilangHari(pemeliharaanBaru) || 'Seratus Delapan Puluh');

      setSskkEmailPPK('dpupr@tegalkab.go.id');
      setSskkEmailPenyedia('kontraktor@wijayabangun.co.id');
      setSskkWhatsappPenyedia('0811-2678-900');
      setSskkFaksimiliPenyedia('-');
      setSskkWakilSahPPK('- tidak ada -');
      setSskkWakilSahPenyedia('- tidak ada -');
      setSskkPencairanJaminan('Kas Daerah Pemerintah Kabupaten Tegal');
      setSskkUangMukaKetentuan('Tidak diberikan Uang muka');
      setSskkPembayaranCara('Termin');
      setSskkTermin1Fisik(30);
      setSskkTermin1Bayar(25);
      setSskkTermin2Fisik(55);
      setSskkTermin2Bayar(25);
      setSskkTermin3Fisik(80);
      setSskkTermin3Bayar(25);
      setSskkTermin4Fisik(100);
      setSskkTermin4Bayar(25);
      setSskkDendaKeterlambatan('1/1000 (satu perseribu) dari Harga Kontrak (sebelum PPN)');
      setSskkUmurKonstruksiTahun(50);
      setSskkPertanggunganKegagalanTahun(10);
      setSskkPenyelesaianSengketa('Layanan Penyelesaian Sengketa Pengadaan Barang/Jasa Pemerintah LKPP');

      setHargaSatuanTimpang([
        { id: 'hst-1', mataPembayaran: 'Tidak Ada', satuanUkuran: 'Tidak Ada', kuantitas: 'Tidak Ada', hpsRp: 0, penawaranRp: 0, persenTerhadapHps: '-', keterangan: 'Tidak Ada' }
      ]);
      setSubkontraktorUtama([
        { id: 'sub-1', bagianPekerjaan: 'Tidak Ada', namaSubkon: 'Tidak Ada', alamatSubkon: 'Tidak Ada', kualifikasiSubkon: 'Tidak Ada', keterangan: 'Tidak Ada' }
      ]);
      setSubkontraktorNonUtama([
        { id: 'sub-2', bagianPekerjaan: 'Tidak Ada', namaSubkon: 'Tidak Ada', alamatSubkon: 'Tidak Ada', kualifikasiSubkon: 'Tidak Ada', keterangan: 'Tidak Ada' }
      ]);

      setPersonelList([
        { id: 'p1', nama: 'ERY SUGIANTO', jabatan: 'Pelaksana Lapangan Pekerjaan Gedung', pendidikan: 'SMK', pengalamanTahun: 1, sertifikatKompetensi: 'Pelaksana Lapangan Pekerjaan Gedung Jenjang 4', keterangan: '-' },
        { id: 'p2', nama: 'NOVEL SAPUTRA DWIFUADDILLAH', jabatan: 'Petugas Keselamatan Konstruksi', pendidikan: 'S1', pengalamanTahun: 0, sertifikatKompetensi: 'Ahli Madya K3 Konstruksi Jenjang 8', keterangan: '-' }
      ]);

      setPeralatanList([
        { id: 'a1', nama: 'Mesin Las Listrik', merekTipe: 'Mailthank', kapasitas: 'Min. 120A, elektroda Ø2,6-3,2 mm', jumlah: '1 Unit', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' },
        { id: 'a2', nama: 'Concrete Mixer / Molen Beton', merekTipe: 'Tigon', kapasitas: 'Drum min. 250 Liter', jumlah: '1 Unit', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' },
        { id: 'a3', nama: 'Scaffolding', merekTipe: 'Tubular Steel Frame', kapasitas: '250 kg/m2', jumlah: '3 Set', kondisi: 'Baik', statusKepemilikan: 'Milik Sendiri', keterangan: '-' }
      ]);

      setIbprpList([
        { id: 'ib1', uraianPekerjaan: 'Pekerjaan Galian & Pondasi', identifikasiBahaya: 'Tertimbun tanah galian', jenisBahaya: 'Cedera fisik', pengendalianAwal: 'Pemasangan turap & barikade', tingkatRisiko: 'Sedang', pengendalianLanjutan: 'Pengawasan petugas K3' },
        { id: 'ib2', uraianPekerjaan: 'Pengecoran Balok & Plat Lantai', identifikasiBahaya: 'Jatuh dari ketinggian', jenisBahaya: 'Fatalitas', pengendalianAwal: 'Safety harness & safety net', tingkatRisiko: 'Besar', pengendalianLanjutan: 'Inspeksi berkala perancah scaffolding' }
      ]);

      setClauses(OFFICIAL_DPUPR_TEGAL_CLAUSES);
    }
  }, [selectedProject.id]);

  // Toggle clause inclusion
  const handleToggleClause = (id: string) => {
    if (!canEdit) {
      alert('Hanya Pejabat Pembuat Komitmen (PPK) atau Admin yang berwenang mengubah klausul kontrak.');
      return;
    }
    setClauses(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  // Start inline editing
  const handleStartEdit = (clause: ContractClause) => {
    if (!canEdit) {
      alert('Hanya Pejabat Pembuat Komitmen (PPK) atau Admin yang berwenang mengubah klausul kontrak.');
      return;
    }
    setEditingClauseId(clause.id);
    setTempClauseText(clause.kontenCustom !== undefined ? clause.kontenCustom : clause.kontenDefault);
  };

  // Save edited clause
  const handleSaveEdit = (id: string) => {
    setClauses(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, kontenCustom: tempClauseText };
      }
      return c;
    }));
    setEditingClauseId(null);
  };

  // Reset single clause to default
  const handleResetClause = (id: string) => {
    if (!canEdit) return;
    setClauses(prev => prev.map(c => c.id === id ? { ...c, kontenCustom: undefined } : c));
    if (editingClauseId === id) {
      const def = clauses.find(c => c.id === id)?.kontenDefault || '';
      setTempClauseText(def);
    }
  };

  // Add/Remove Personel Manajerial
  const handleAddPersonel = () => {
    const newItem: PersonelManajerialItem = {
      id: `pers-${Date.now()}`,
      nama: 'Nama Tenaga Ahli Baru',
      jabatan: 'Pelaksana / Petugas K3',
      pendidikan: 'S1 Teknik Sipil / SMK',
      pengalamanTahun: 2,
      sertifikatKompetensi: 'SKK Konstruksi Jenjang 6',
      keterangan: '-'
    };
    setPersonelList([...personelList, newItem]);
  };

  const handleDeletePersonel = (id: string) => {
    setPersonelList(personelList.filter(p => p.id !== id));
  };

  // Add/Remove Peralatan Utama
  const handleAddPeralatan = () => {
    const newItem: PeralatanUtamaItem = {
      id: `alat-${Date.now()}`,
      nama: 'Nama Peralatan Baru',
      merekTipe: 'Merek / Spesifikasi',
      kapasitas: 'Kapasitas Operasi',
      jumlah: '1 Unit',
      kondisi: 'Baik',
      statusKepemilikan: 'Milik Sendiri / Sewa-Beli',
      keterangan: '-'
    };
    setPeralatanList([...peralatanList, newItem]);
  };

  const handleDeletePeralatan = (id: string) => {
    setPeralatanList(peralatanList.filter(a => a.id !== id));
  };

  // Add/Remove Harga Satuan Timpang
  const handleAddHargaTimpang = () => {
    const newItem: HargaSatuanTimpangItem = {
      id: `hst-${Date.now()}`,
      mataPembayaran: 'Item Pekerjaan Baru',
      satuanUkuran: 'm3 / m2 / ls',
      kuantitas: '1.00',
      hpsRp: 1000000,
      penawaranRp: 1200000,
      persenTerhadapHps: '120%',
      keterangan: 'Harga Timpang > 110% HPS'
    };
    setHargaSatuanTimpang([...hargaSatuanTimpang, newItem]);
  };

  const handleDeleteHargaTimpang = (id: string) => {
    setHargaSatuanTimpang(hargaSatuanTimpang.filter(h => h.id !== id));
  };

  // Add/Remove Subkontraktor
  const handleAddSubkonUtama = () => {
    const newItem: SubkontraktorItem = {
      id: `subu-${Date.now()}`,
      bagianPekerjaan: 'Pekerjaan Spesialis Struktur',
      namaSubkon: 'PT. Subkontraktor Spesialis',
      alamatSubkon: 'Tegal',
      kualifikasiSubkon: 'Usaha Menengah/Besar Spesialis',
      keterangan: 'Sesuai persetujuan PPK'
    };
    setSubkontraktorUtama([...subkontraktorUtama, newItem]);
  };

  const handleDeleteSubkonUtama = (id: string) => {
    setSubkontraktorUtama(subkontraktorUtama.filter(s => s.id !== id));
  };

  // Add/Remove IBPRP (K3)
  const handleAddIBPRP = () => {
    const newItem: IBPRPItem = {
      id: `ib-${Date.now()}`,
      uraianPekerjaan: 'Pekerjaan Baru',
      identifikasiBahaya: 'Terpeleset / Terbentur',
      jenisBahaya: 'Luka Ringan / Sedang',
      pengendalianAwal: 'Pemakaian APD Standar',
      tingkatRisiko: 'Sedang',
      pengendalianLanjutan: 'Pengawasan berkala petugas K3'
    };
    setIbprpList([...ibprpList, newItem]);
  };

  const handleDeleteIBPRP = (id: string) => {
    setIbprpList(ibprpList.filter(ib => ib.id !== id));
  };

  // Save entire contract to context/storage
  const handleSaveContract = () => {
    const parsedLingkup = parseRuangLingkup(ruangLingkupText);
    const ruangLingkupArr = formatRuangLingkupToLines(parsedLingkup);

    const updated: ProjectContract = {
      id: existingContract?.id || `ct-${selectedProject.id}`,
      projectId: selectedProject.id,
      namaPaket,
      nomorSurat,
      hari,
      tanggal,
      tanggalTeks,
      bulanTeks,
      tahunAngka,
      tanggalBulanTahunAngka,
      nomorSPPBJ,
      tanggalSPPBJ,
      metodePemilihan: metodePemilihan || 'E-Purchasing',
      jenisKontrak,
      ppkNama,
      ppkNip,
      ppkJabatan,
      ppkKedudukan,
      ppkNomorSK,
      ppkTahunSK: Number(ppkTahunSK),
      ppkTanggalSK,
      ppkTahunAnggaran: Number(ppkTahunAnggaran),
      penyediaNamaDirektur,
      penyediaJabatan,
      penyediaNamaBadanUsaha,
      penyediaKedudukan,
      penyediaAktaNomor,
      penyediaAktaTanggal,
      penyediaAktaNotaris,
      nilaiKontrakAngka: Number(nilaiKontrakAngka),
      nilaiKontrakTerbilang: angkaKeTerbilang(Number(nilaiKontrakAngka)),
      kodeAkunKegiatan,
      sumberPembiayaan,
      bankNamaDanCabang,
      nomorRekeningPenyedia,
      namaRekeningPenyedia,
      ruangLingkupUtama: ruangLingkupArr,
      jangkaWaktuPelaksanaanHari: Number(jangkaWaktuPelaksanaanHari),
      jangkaWaktuPelaksanaanHuruf,
      jangkaWaktuPemeliharaanHari: Number(jangkaWaktuPemeliharaanHari),
      jangkaWaktuPemeliharaanHuruf,
      sskkEmailPPK,
      sskkEmailPenyedia,
      sskkWhatsappPenyedia,
      sskkFaksimiliPenyedia,
      sskkWakilSahPPK,
      sskkWakilSahPenyedia,
      sskkPencairanJaminan,
      sskkUangMukaKetentuan,
      sskkPembayaranCara,
      sskkTermin1Fisik: Number(sskkTermin1Fisik),
      sskkTermin1Bayar: Number(sskkTermin1Bayar),
      sskkTermin2Fisik: Number(sskkTermin2Fisik),
      sskkTermin2Bayar: Number(sskkTermin2Bayar),
      sskkTermin3Fisik: Number(sskkTermin3Fisik),
      sskkTermin3Bayar: Number(sskkTermin3Bayar),
      sskkTermin4Fisik: Number(sskkTermin4Fisik),
      sskkTermin4Bayar: Number(sskkTermin4Bayar),
      sskkDendaKeterlambatan,
      sskkUmurKonstruksiTahun: Number(sskkUmurKonstruksiTahun),
      sskkPertanggunganKegagalanTahun: Number(sskkPertanggunganKegagalanTahun),
      sskkPenyelesaianSengketa,
      hargaSatuanTimpang,
      subkontraktorUtama,
      subkontraktorNonUtama,
      personelManajerial: personelList,
      peralatanUtama: peralatanList,
      rkkNamaWakilSah: penyediaNamaDirektur,
      rkkJabatanWakilSah: `${penyediaJabatan} ${penyediaNamaBadanUsaha}`,
      rkkTanggalKomitmen: tanggal,
      rkkTabelIBPRP: ibprpList,
      clauses,
      status: 'Ditandatangani PPK & Penyedia'
    };

    updateContract(updated);
    alert(`Data Kontrak & Klausul Proyek "${selectedProject.nama}" berhasil disimpan ke sistem!`);
  };

  // Current Full Contract State Object (Reactive across all tabs)
  const currentContractState: ProjectContract = {
    id: existingContract?.id || `ct-${selectedProject.id}`,
    projectId: selectedProject.id,
    namaPaket,
    nomorSurat,
    hari,
    tanggal,
    tanggalTeks,
    bulanTeks,
    tahunAngka,
    tanggalBulanTahunAngka,
    nomorSPPBJ,
    tanggalSPPBJ,
    metodePemilihan: metodePemilihan || 'E-Purchasing',
    jenisKontrak,
    ppkNama,
    ppkNip,
    ppkJabatan,
    ppkKedudukan,
    ppkNomorSK,
    ppkTahunSK: Number(ppkTahunSK),
    ppkTanggalSK,
    ppkTahunAnggaran: Number(ppkTahunAnggaran),
    penyediaNamaDirektur,
    penyediaJabatan,
    penyediaNamaBadanUsaha,
    penyediaKedudukan,
    penyediaAktaNomor,
    penyediaAktaTanggal,
    penyediaAktaNotaris,
    nilaiKontrakAngka: Number(nilaiKontrakAngka),
    nilaiKontrakTerbilang: angkaKeTerbilang(Number(nilaiKontrakAngka)),
    kodeAkunKegiatan,
    sumberPembiayaan,
    bankNamaDanCabang,
    nomorRekeningPenyedia,
    namaRekeningPenyedia,
    ruangLingkupUtama: formatRuangLingkupToLines(parseRuangLingkup(ruangLingkupText)),
    jangkaWaktuPelaksanaanHari: Number(jangkaWaktuPelaksanaanHari),
    jangkaWaktuPelaksanaanHuruf,
    jangkaWaktuPemeliharaanHari: Number(jangkaWaktuPemeliharaanHari),
    jangkaWaktuPemeliharaanHuruf,
    sskkEmailPPK,
    sskkEmailPenyedia,
    sskkWhatsappPenyedia,
    sskkFaksimiliPenyedia,
    sskkWakilSahPPK,
    sskkWakilSahPenyedia,
    sskkPencairanJaminan,
    sskkUangMukaKetentuan,
    sskkPembayaranCara,
    sskkTermin1Fisik: Number(sskkTermin1Fisik),
    sskkTermin1Bayar: Number(sskkTermin1Bayar),
    sskkTermin2Fisik: Number(sskkTermin2Fisik),
    sskkTermin2Bayar: Number(sskkTermin2Bayar),
    sskkTermin3Fisik: Number(sskkTermin3Fisik),
    sskkTermin3Bayar: Number(sskkTermin3Bayar),
    sskkTermin4Fisik: Number(sskkTermin4Fisik),
    sskkTermin4Bayar: Number(sskkTermin4Bayar),
    sskkDendaKeterlambatan,
    sskkUmurKonstruksiTahun: Number(sskkUmurKonstruksiTahun),
    sskkPertanggunganKegagalanTahun: Number(sskkPertanggunganKegagalanTahun),
    sskkPenyelesaianSengketa,
    hargaSatuanTimpang,
    subkontraktorUtama,
    subkontraktorNonUtama,
    personelManajerial: personelList,
    peralatanUtama: peralatanList,
    rkkNamaWakilSah: penyediaNamaDirektur,
    rkkJabatanWakilSah: `${penyediaJabatan} ${penyediaNamaBadanUsaha}`,
    rkkTanggalKomitmen: tanggal,
    rkkTabelIBPRP: ibprpList,
    clauses,
    status: existingContract?.status || 'Ditandatangani PPK & Penyedia'
  };

  // Export contract as complete Word document (.doc) containing all 5 parts
  const handleExportWord = () => {
    generateContractWordDoc(currentContractState);
  };

  const handlePrint = (docType: 'all' | 'sp' | 'ssuk' | 'sskk' | 'lampa' | 'lampb' = previewDocType) => {
    setPreviewDocType(docType);
    setActiveTabMode('preview');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const activeClauses = clauses.filter(c => c.isActive);

  // Filter clauses based on Category, Bab SSUK, and Search Query
  const filteredClauses = clauses.filter(clause => {
    // 1. Category Filter
    if (filterCategory !== 'all' && clause.kategori !== filterCategory) {
      return false;
    }
    // 2. Bab Filter (when SSUK is selected or in All view)
    if (selectedBab !== 'all' && clause.kategori === 'SSUK (Syarat Umum)') {
      if (!clause.keteranganPerlem.includes(`Bab ${selectedBab}`)) {
        return false;
      }
    }
    // 3. Search Query
    if (clauseSearch.trim()) {
      const q = clauseSearch.toLowerCase().trim();
      const matchPasal = String(clause.pasal).toLowerCase().includes(q) || `pasal ${clause.pasal}`.toLowerCase().includes(q);
      const matchJudul = clause.judul.toLowerCase().includes(q);
      const matchKeterangan = clause.keteranganPerlem.toLowerCase().includes(q);
      const content = clause.kontenCustom !== undefined ? clause.kontenCustom : clause.kontenDefault;
      const matchContent = content.toLowerCase().includes(q);
      return matchPasal || matchJudul || matchKeterangan || matchContent;
    }
    return true;
  });

  const toggleExpandClause = (id: string) => {
    setExpandedClauseIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExpandAll = (expand: boolean) => {
    if (expand) {
      setExpandedClauseIds(new Set(filteredClauses.map(c => c.id)));
    } else {
      setExpandedClauseIds(new Set());
    }
  };

  const handleSelectAllSSUK = (active: boolean) => {
    if (!canEdit) return;
    setClauses(prev => prev.map(c => c.kategori === 'SSUK (Syarat Umum)' ? { ...c, isActive: active } : c));
  };

  const handleResetAllSSUK = () => {
    if (!canEdit) return;
    if (!window.confirm('Kembalikan seluruh 79 klausul SSUK ke redaksi baku standar LKPP DPUPR Kab. Tegal?')) return;
    const officialMap = new Map(OFFICIAL_SSUK_CLAUSES.map(c => [c.id, c]));
    setClauses(prev => prev.map(c => {
      if (c.kategori === 'SSUK (Syarat Umum)') {
        const orig = officialMap.get(c.id);
        return orig ? { ...orig, isActive: c.isActive } : c;
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Integrated Navigation (Neat, Compact & High Efficiency) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-xs no-print space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  Pengelolaan Kontrak & Dokumen Pengadaan
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase font-mono">
                  Perlem LKPP 12/2021
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span>Paket:</span>
                <span className="font-bold text-slate-800 truncate max-w-md" title={selectedProject.nama}>
                  {selectedProject.nama}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {canEdit && (
              <button
                onClick={handleSaveContract}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                title="Simpan perubahan kontrak proyek ini"
              >
                <Save className="w-4 h-4" />
                Simpan Kontrak
              </button>
            )}

            {activeTabMode !== 'preview' ? (
              <button
                onClick={() => setActiveTabMode('preview')}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-4 h-4" />
                Buka Pratinjau Cetak
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportWord}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  title="Download File Word Lengkap (.doc)"
                >
                  <Download className="w-4 h-4" />
                  Export Word (.doc)
                </button>
                <button
                  onClick={() => handlePrint(previewDocType)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  title="Cetak Dokumen Resmi"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Dokumen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3 Main Tab Buttons (Segmented Controls) */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTabMode('form')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'form'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            1. Form Isian Kontrak & SSKK
          </button>

          <button
            onClick={() => setActiveTabMode('klausul')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'klausul'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            2. Pemilihan & Editor Klausul
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeTabMode === 'klausul' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {activeClauses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTabMode('preview')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTabMode === 'preview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            3. Pratinjau Dokumen Cetak Resmi
          </button>
        </div>
      </div>

      {/* TAB 1: FORM ISIAN DATA KONTRAK */}
      {activeTabMode === 'form' && (
        <div className="space-y-6 no-print">
          
          {/* Section A: Identitas Surat Perjanjian */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              A. Identitas Surat Perjanjian (Kontrak Harga Satuan)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Paket Pekerjaan Konstruksi</label>
                <input
                  type="text"
                  value={namaPaket}
                  onChange={e => setNamaPaket(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nomor Surat Kontrak</label>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={e => setNomorSurat(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
            </div>

            {/* Format Tanggal Sesuai Naskah Word DPUPR */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Format Tanggal Pembukaan Perjanjian Sesuai File Word Acuan
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Rujukan: <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono">pada hari (hari sesuai tanggal) tanggal (tanggal) bulan (bulan) tahun (tahun dalam angka) ((tanggal bulan tahun dalam angka))</code>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    1. Kalender (Auto-Fill)
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={e => handleDateChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-blue-400 bg-white rounded-lg font-medium shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    2. Hari: <span className="text-blue-700 font-normal">(hari)</span>
                  </label>
                  <input
                    type="text"
                    value={hari}
                    onChange={e => setHari(e.target.value)}
                    placeholder="Jumat"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      3. Tanggal: <span className="text-blue-700 font-normal">(tanggal)</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setTanggalTeks(parseKomponenTanggalKontrak(tanggal).tanggalTeks)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold"
                        title="Pilih format huruf terbilang (misal: dua puluh)"
                      >
                        Huruf
                      </button>
                      <button
                        type="button"
                        onClick={() => setTanggalTeks(parseKomponenTanggalKontrak(tanggal).tanggalAngka)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold"
                        title="Pilih format angka (misal: 20)"
                      >
                        Angka
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={tanggalTeks}
                    onChange={e => setTanggalTeks(e.target.value)}
                    placeholder="dua puluh / 20"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    4. Bulan: <span className="text-blue-700 font-normal">(bulan)</span>
                  </label>
                  <input
                    type="text"
                    value={bulanTeks}
                    onChange={e => setBulanTeks(e.target.value)}
                    placeholder="Februari"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    5. Tahun: <span className="text-blue-700 font-normal">(tahun dlm angka)</span>
                  </label>
                  <input
                    type="text"
                    value={tahunAngka}
                    onChange={e => setTahunAngka(e.target.value)}
                    placeholder="2026"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    6. ((tgl bln thn dlm angka))
                  </label>
                  <input
                    type="text"
                    value={tanggalBulanTahunAngka}
                    onChange={e => setTanggalBulanTahunAngka(e.target.value)}
                    placeholder="20-02-2026"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white rounded-lg font-mono font-bold text-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Metode Pemilihan Penyedia
                  </label>
                  <select
                    value={metodePemilihan}
                    onChange={e => setMetodePemilihan(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white rounded-lg font-semibold text-emerald-800"
                  >
                    <option value="E-Purchasing">E-Purchasing (Katalog)</option>
                    <option value="Tender">Tender</option>
                    <option value="Tender Cepat">Tender Cepat</option>
                    <option value="Seleksi">Seleksi</option>
                    <option value="Penunjukan Langsung">Penunjukan Langsung</option>
                    <option value="Pengadaan Langsung">Pengadaan Langsung</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor SPPBJ</label>
                  <input
                    type="text"
                    value={nomorSPPBJ}
                    onChange={e => setNomorSPPBJ(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal SPPBJ</label>
                  <input
                    type="date"
                    value={tanggalSPPBJ}
                    onChange={e => setTanggalSPPBJ(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white rounded-lg"
                  />
                </div>
              </div>

              {/* Live Preview Box of the sentence */}
              <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs leading-relaxed text-slate-800 shadow-2xs">
                <span className="font-extrabold text-blue-900 flex items-center gap-1.5 mb-1">
                  <span>📄</span> Teks Kalimat Pembukaan Kontrak yang Akan Dicetak:
                </span>
                <p className="font-serif italic text-slate-900 bg-white p-2.5 rounded-lg border border-blue-100">
                  SURAT PERJANJIAN ini berikut semua lampirannya adalah Kontrak Kerja Konstruksi {jenisKontrak}, yang selanjutnya disebut “Kontrak” dibuat dan ditandatangani di Slawi pada hari <strong className="text-blue-900 not-italic">{hari}</strong> tanggal <strong className="text-blue-900 not-italic">{tanggalTeks}</strong> bulan <strong className="text-blue-900 not-italic">{bulanTeks}</strong> tahun <strong className="text-blue-900 not-italic">{tahunAngka}</strong> (<strong className="text-blue-900 not-italic">{tanggalBulanTahunAngka}</strong>), berdasarkan Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) Nomor <strong className="text-blue-900 not-italic">{nomorSPPBJ}</strong> tanggal <strong className="text-blue-900 not-italic">{tanggalSPPBJ ? formatTanggalIndo(tanggalSPPBJ) : '-'}</strong> , antara:
                </p>
              </div>
            </div>
          </div>

          {/* Section B: Pejabat Penandatangan Kontrak (PPK DPUPR) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              B. Data Pihak Pertama — Pejabat Penandatangan Kontrak (PPK DPUPR)
            </h3>

            {/* Tarik Data Cepat dari Master Data PPK */}
            <PpkSelectorDropdown
              selectedPpkNama={ppkNama}
              selectedPpkNip={ppkNip}
              onSelectPpk={(ppk) => {
                setPpkNama(ppk.nama);
                setPpkNip(ppk.nip);
                setPpkJabatan(ppk.jabatan);
                if (ppk.alamat) setPpkKedudukan(ppk.alamat);
                if (ppk.nomorSk) setPpkNomorSK(ppk.nomorSk);
                if (ppk.tanggalSk) setPpkTanggalSK(ppk.tanggalSk);
              }}
              label="Tarik Data dari Master PPK DPUPR"
              helperText="Pilih nama PPK terdaftar untuk otomatis mengisi Nama, NIP, Jabatan, Alamat Kedudukan, dan SK Pengangkatan."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama PPK</label>
                <input
                  type="text"
                  value={ppkNama}
                  onChange={e => setPpkNama(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">NIP PPK</label>
                <input
                  type="text"
                  value={ppkNip}
                  onChange={e => setPpkNip(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jabatan PPK</label>
                <input
                  type="text"
                  value={ppkJabatan}
                  onChange={e => setPpkJabatan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kedudukan Alamat PPK</label>
                <input
                  type="text"
                  value={ppkKedudukan}
                  onChange={e => setPpkKedudukan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nomor SK Kepala Dinas PUPR</label>
                <input
                  type="text"
                  value={ppkNomorSK}
                  onChange={e => setPpkNomorSK(e.target.value)}
                  placeholder="800.1.2/015"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tanggal SK Kepala Dinas</label>
                <input
                  type="date"
                  value={ppkTanggalSK}
                  onChange={e => setPpkTanggalSK(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section C: Data Penyedia Jasa Konstruksi */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              C. Data Pihak Kedua — Penyedia Jasa Konstruksi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Pimpinan / Direktur</label>
                <input
                  type="text"
                  value={penyediaNamaDirektur}
                  onChange={e => setPenyediaNamaDirektur(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jabatan Pimpinan</label>
                <input
                  type="text"
                  value={penyediaJabatan}
                  onChange={e => setPenyediaJabatan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Badan Usaha (PT / CV)</label>
                <input
                  type="text"
                  value={penyediaNamaBadanUsaha}
                  onChange={e => setPenyediaNamaBadanUsaha(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Berkedudukan di (Alamat Penyedia)</label>
                <input
                  type="text"
                  value={penyediaKedudukan}
                  onChange={e => setPenyediaKedudukan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Akta Notaris Nomor</label>
                <input
                  type="text"
                  value={penyediaAktaNomor}
                  onChange={e => setPenyediaAktaNomor(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tanggal Akta Notaris</label>
                <input
                  type="date"
                  value={penyediaAktaTanggal}
                  onChange={e => setPenyediaAktaTanggal(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Notaris</label>
                <input
                  type="text"
                  value={penyediaAktaNotaris}
                  onChange={e => setPenyediaAktaNotaris(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Penyedia</label>
                <input
                  type="email"
                  value={sskkEmailPenyedia}
                  onChange={e => setSskkEmailPenyedia(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nomor WhatsApp Penyedia</label>
                <input
                  type="text"
                  value={sskkWhatsappPenyedia}
                  onChange={e => setSskkWhatsappPenyedia(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section D: Nilai Kontrak, Pembayaran & Rekening */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              D. Nilai Kontrak, Kode Akun Kegiatan & Rekening Bank
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Harga Kontrak Termasuk PPN (Rp)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={nilaiKontrakAngka ? formatRibuan(nilaiKontrakAngka) : ''}
                  onChange={e => setNilaiKontrakAngka(parseRibuanKeAngka(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-black text-emerald-700"
                />
                <span className="text-[10px] text-slate-500 italic block mt-1">
                  Terbilang: {angkaKeTerbilang(nilaiKontrakAngka)}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kode Akun Kegiatan</label>
                <input
                  type="text"
                  value={kodeAkunKegiatan}
                  onChange={e => setKodeAkunKegiatan(e.target.value)}
                  placeholder="1.03.02.2.01.0005"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sumber Pembiayaan</label>
                <input
                  type="text"
                  value={sumberPembiayaan}
                  onChange={e => setSumberPembiayaan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Bank dan Cabang</label>
                <input
                  type="text"
                  value={bankNamaDanCabang}
                  onChange={e => setBankNamaDanCabang(e.target.value)}
                  placeholder="Bank Jateng Cabang Slawi"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nomor Rekening Penyedia</label>
                <input
                  type="text"
                  value={nomorRekeningPenyedia}
                  onChange={e => setNomorRekeningPenyedia(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  value={namaRekeningPenyedia}
                  onChange={e => setNamaRekeningPenyedia(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section E: Ruang Lingkup Pekerjaan & Jangka Waktu */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              E. Ruang Lingkup Pekerjaan Utama & Masa Pelaksanaan / Pemeliharaan
            </h3>

            <RuangLingkupEditor
              value={ruangLingkupText}
              onChange={setRuangLingkupText}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Masa Pelaksanaan (Hari)</label>
                <input
                  type="number"
                  value={jangkaWaktuPelaksanaanHari}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setJangkaWaktuPelaksanaanHari(val);
                    setJangkaWaktuPelaksanaanHuruf(angkaKeTerbilangHari(val));
                  }}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Masa Pelaksanaan (Huruf)</label>
                <input
                  type="text"
                  value={jangkaWaktuPelaksanaanHuruf}
                  onChange={e => setJangkaWaktuPelaksanaanHuruf(e.target.value)}
                  placeholder="Seratus Delapan Puluh"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Masa Pemeliharaan (Hari)</label>
                <input
                  type="number"
                  value={jangkaWaktuPemeliharaanHari}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setJangkaWaktuPemeliharaanHari(val);
                    setJangkaWaktuPemeliharaanHuruf(angkaKeTerbilangHari(val));
                  }}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Masa Pemeliharaan (Huruf)</label>
                <input
                  type="text"
                  value={jangkaWaktuPemeliharaanHuruf}
                  onChange={e => setJangkaWaktuPemeliharaanHuruf(e.target.value)}
                  placeholder="Seratus Delapan Puluh"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section F: Parameter Khusus SSKK (Termin, Denda, Sengketa) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              F. Ketentuan Khusus SSKK (Uang Muka, Termin, Denda & Kegagalan Bangunan)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ketentuan Uang Muka</label>
                <input
                  type="text"
                  value={sskkUangMukaKetentuan}
                  onChange={e => setSskkUangMukaKetentuan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sanksi Denda Keterlambatan</label>
                <input
                  type="text"
                  value={sskkDendaKeterlambatan}
                  onChange={e => setSskkDendaKeterlambatan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lembaga Penyelesaian Sengketa</label>
                <input
                  type="text"
                  value={sskkPenyelesaianSengketa}
                  onChange={e => setSskkPenyelesaianSengketa(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-medium"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Tahapan Pembayaran Termin Sesuai SSKK:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block">Termin I</span>
                  <div className="text-[11px] text-slate-600 mt-1">Bayar: <strong>{sskkTermin1Bayar}%</strong></div>
                  <div className="text-[11px] text-slate-600">Syarat Fisik: <strong>{sskkTermin1Fisik}%</strong></div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block">Termin II</span>
                  <div className="text-[11px] text-slate-600 mt-1">Bayar: <strong>{sskkTermin2Bayar}%</strong></div>
                  <div className="text-[11px] text-slate-600">Syarat Fisik: <strong>{sskkTermin2Fisik}%</strong></div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block">Termin III</span>
                  <div className="text-[11px] text-slate-600 mt-1">Bayar: <strong>{sskkTermin3Bayar}%</strong></div>
                  <div className="text-[11px] text-slate-600">Syarat Fisik: <strong>{sskkTermin3Fisik}%</strong></div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block">Termin IV (Pelunasan)</span>
                  <div className="text-[11px] text-slate-600 mt-1">Bayar: <strong>{sskkTermin4Bayar}%</strong></div>
                  <div className="text-[11px] text-slate-600">Syarat Fisik: <strong>{sskkTermin4Fisik}%</strong> (Retensi 5%)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rencana Umur Konstruksi Gedung (Tahun)</label>
                <input
                  type="number"
                  value={sskkUmurKonstruksiTahun}
                  onChange={e => setSskkUmurKonstruksiTahun(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lama Pertanggungan Kegagalan Bangunan (Tahun)</label>
                <input
                  type="number"
                  value={sskkPertanggunganKegagalanTahun}
                  onChange={e => setSskkPertanggunganKegagalanTahun(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section G: Lampiran A SSKK - Personel Manajerial & Peralatan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                G. Lampiran A SSKK — Daftar Personel Manajerial
              </h3>
              <button
                type="button"
                onClick={handleAddPersonel}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Personel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2 border">Nama Personel</th>
                    <th className="p-2 border">Jabatan</th>
                    <th className="p-2 border">Pendidikan</th>
                    <th className="p-2 border">Pengalaman (Th)</th>
                    <th className="p-2 border">Sertifikat Kompetensi Kerja (SKK)</th>
                    <th className="p-2 border text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {personelList.map((p, pIdx) => (
                    <tr key={p.id}>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={p.nama}
                          onChange={e => {
                            const val = e.target.value;
                            setPersonelList(personelList.map(item => item.id === p.id ? { ...item, nama: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded font-semibold"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={p.jabatan}
                          onChange={e => {
                            const val = e.target.value;
                            setPersonelList(personelList.map(item => item.id === p.id ? { ...item, jabatan: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={p.pendidikan}
                          onChange={e => {
                            const val = e.target.value;
                            setPersonelList(personelList.map(item => item.id === p.id ? { ...item, pendidikan: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border w-20">
                        <input
                          type="number"
                          value={p.pengalamanTahun}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setPersonelList(personelList.map(item => item.id === p.id ? { ...item, pengalamanTahun: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={p.sertifikatKompetensi}
                          onChange={e => {
                            const val = e.target.value;
                            setPersonelList(personelList.map(item => item.id === p.id ? { ...item, sertifikatKompetensi: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded text-[11px]"
                        />
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          type="button"
                          onClick={() => handleDeletePersonel(p.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Peralatan Utama */}
            <div className="flex items-center justify-between border-b border-slate-100 pt-4 pb-2">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                Daftar Peralatan Utama Konstruksi
              </h3>
              <button
                type="button"
                onClick={handleAddPeralatan}
                className="px-2.5 py-1 text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Alat
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2 border">Nama Peralatan</th>
                    <th className="p-2 border">Merek / Tipe</th>
                    <th className="p-2 border">Kapasitas</th>
                    <th className="p-2 border">Jumlah</th>
                    <th className="p-2 border">Kondisi</th>
                    <th className="p-2 border">Status Milik</th>
                    <th className="p-2 border text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {peralatanList.map((a) => (
                    <tr key={a.id}>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={a.nama}
                          onChange={e => {
                            const val = e.target.value;
                            setPeralatanList(peralatanList.map(item => item.id === a.id ? { ...item, nama: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded font-semibold"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={a.merekTipe}
                          onChange={e => {
                            const val = e.target.value;
                            setPeralatanList(peralatanList.map(item => item.id === a.id ? { ...item, merekTipe: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={a.kapasitas}
                          onChange={e => {
                            const val = e.target.value;
                            setPeralatanList(peralatanList.map(item => item.id === a.id ? { ...item, kapasitas: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border w-20">
                        <input
                          type="text"
                          value={a.jumlah}
                          onChange={e => {
                            const val = e.target.value;
                            setPeralatanList(peralatanList.map(item => item.id === a.id ? { ...item, jumlah: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border w-24">
                        <input
                          type="text"
                          value={a.kondisi}
                          onChange={e => {
                            const val = e.target.value;
                            setPeralatanList(peralatanList.map(item => item.id === a.id ? { ...item, kondisi: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={a.statusKepemilikan}
                          onChange={e => {
                            const val = e.target.value;
                            setPeralatanList(peralatanList.map(item => item.id === a.id ? { ...item, statusKepemilikan: val } : item));
                          }}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          type="button"
                          onClick={() => handleDeletePeralatan(a.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Harga Satuan Timpang */}
            <div className="flex items-center justify-between border-b border-slate-100 pt-4 pb-2">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Daftar Harga Satuan Timpang (apabila ada)
              </h3>
              <button
                type="button"
                onClick={handleAddHargaTimpang}
                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Item Timpang
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2 border">Mata Pembayaran</th>
                    <th className="p-2 border w-24">Satuan</th>
                    <th className="p-2 border w-24">Kuantitas</th>
                    <th className="p-2 border w-32">HPS (Rp)</th>
                    <th className="p-2 border w-32">Penawaran (Rp)</th>
                    <th className="p-2 border w-24">% Thd HPS</th>
                    <th className="p-2 border">Keterangan</th>
                    <th className="p-2 border text-center w-12">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {hargaSatuanTimpang.map((h) => (
                    <tr key={h.id}>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={h.mataPembayaran}
                          onChange={e => setHargaSatuanTimpang(hargaSatuanTimpang.map(item => item.id === h.id ? { ...item, mataPembayaran: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded font-semibold"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={h.satuanUkuran}
                          onChange={e => setHargaSatuanTimpang(hargaSatuanTimpang.map(item => item.id === h.id ? { ...item, satuanUkuran: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={h.kuantitas}
                          onChange={e => setHargaSatuanTimpang(hargaSatuanTimpang.map(item => item.id === h.id ? { ...item, kuantitas: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={h.hpsRp ? formatRibuan(h.hpsRp) : ''}
                          onChange={e => setHargaSatuanTimpang(hargaSatuanTimpang.map(item => item.id === h.id ? { ...item, hpsRp: parseRibuanKeAngka(e.target.value) } : item))}
                          placeholder="0"
                          className="w-full p-1 text-xs border rounded text-right font-medium"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={h.penawaranRp ? formatRibuan(h.penawaranRp) : ''}
                          onChange={e => setHargaSatuanTimpang(hargaSatuanTimpang.map(item => item.id === h.id ? { ...item, penawaranRp: parseRibuanKeAngka(e.target.value) } : item))}
                          placeholder="0"
                          className="w-full p-1 text-xs border rounded text-right font-medium"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={h.persenTerhadapHps}
                          onChange={e => setHargaSatuanTimpang(hargaSatuanTimpang.map(item => item.id === h.id ? { ...item, persenTerhadapHps: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={h.keterangan}
                          onChange={e => setHargaSatuanTimpang(hargaSatuanTimpang.map(item => item.id === h.id ? { ...item, keterangan: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteHargaTimpang(h.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subkontraktor */}
            <div className="flex items-center justify-between border-b border-slate-100 pt-4 pb-2">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Daftar Subkontraktor Pekerjaan (apabila ada)
              </h3>
              <button
                type="button"
                onClick={handleAddSubkonUtama}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Subkontraktor
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2 border">Bagian Pekerjaan yang Disubkontrakkan</th>
                    <th className="p-2 border">Nama Subkontraktor</th>
                    <th className="p-2 border">Alamat Subkontraktor</th>
                    <th className="p-2 border">Kualifikasi</th>
                    <th className="p-2 border">Keterangan</th>
                    <th className="p-2 border text-center w-12">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {subkontraktorUtama.map((s) => (
                    <tr key={s.id}>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={s.bagianPekerjaan}
                          onChange={e => setSubkontraktorUtama(subkontraktorUtama.map(item => item.id === s.id ? { ...item, bagianPekerjaan: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded font-semibold"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={s.namaSubkon}
                          onChange={e => setSubkontraktorUtama(subkontraktorUtama.map(item => item.id === s.id ? { ...item, namaSubkon: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={s.alamatSubkon}
                          onChange={e => setSubkontraktorUtama(subkontraktorUtama.map(item => item.id === s.id ? { ...item, alamatSubkon: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={s.kualifikasiSubkon}
                          onChange={e => setSubkontraktorUtama(subkontraktorUtama.map(item => item.id === s.id ? { ...item, kualifikasiSubkon: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={s.keterangan}
                          onChange={e => setSubkontraktorUtama(subkontraktorUtama.map(item => item.id === s.id ? { ...item, keterangan: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubkonUtama(s.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* RKK - Tabel IBPRP */}
            <div className="flex items-center justify-between border-b border-slate-100 pt-4 pb-2">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Rencana Keselamatan Konstruksi (Tabel 1. IBPRP K3)
              </h3>
              <button
                type="button"
                onClick={handleAddIBPRP}
                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Risiko K3
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2 border">Uraian Pekerjaan</th>
                    <th className="p-2 border">Identifikasi Bahaya</th>
                    <th className="p-2 border">Jenis Bahaya</th>
                    <th className="p-2 border">Pengendalian Awal</th>
                    <th className="p-2 border w-28">Tingkat Risiko</th>
                    <th className="p-2 border">Pengendalian Lanjutan</th>
                    <th className="p-2 border text-center w-12">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {ibprpList.map((ib) => (
                    <tr key={ib.id}>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={ib.uraianPekerjaan}
                          onChange={e => setIbprpList(ibprpList.map(item => item.id === ib.id ? { ...item, uraianPekerjaan: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded font-semibold"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={ib.identifikasiBahaya}
                          onChange={e => setIbprpList(ibprpList.map(item => item.id === ib.id ? { ...item, identifikasiBahaya: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={ib.jenisBahaya}
                          onChange={e => setIbprpList(ibprpList.map(item => item.id === ib.id ? { ...item, jenisBahaya: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={ib.pengendalianAwal}
                          onChange={e => setIbprpList(ibprpList.map(item => item.id === ib.id ? { ...item, pengendalianAwal: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border">
                        <select
                          value={ib.tingkatRisiko}
                          onChange={e => setIbprpList(ibprpList.map(item => item.id === ib.id ? { ...item, tingkatRisiko: e.target.value as any } : item))}
                          className="w-full p-1 text-xs border rounded font-semibold bg-white"
                        >
                          <option value="Kecil">Kecil</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Besar">Besar</option>
                        </select>
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          value={ib.pengendalianLanjutan}
                          onChange={e => setIbprpList(ibprpList.map(item => item.id === ib.id ? { ...item, pengendalianLanjutan: e.target.value } : item))}
                          className="w-full p-1 text-xs border rounded"
                        />
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteIBPRP(ib.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveContract}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Seluruh Isian Kontrak Proyek
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: PEMILIHAN & EDITOR KLAUSUL MODULAR */}
      {activeTabMode === 'klausul' && (
        <div className="space-y-4 no-print">
          
          {/* Main Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  Filter Dokumen:
                </span>
                {(['all', 'Surat Perjanjian', 'SSUK (Syarat Umum)', 'SSKK (Syarat Khusus)'] as const).map(cat => {
                  const countInCat = clauses.filter(c => cat === 'all' ? true : c.kategori === cat).length;
                  const activeInCat = clauses.filter(c => (cat === 'all' ? true : c.kategori === cat) && c.isActive).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilterCategory(cat);
                        if (cat !== 'SSUK (Syarat Umum)' && cat !== 'all') {
                          setSelectedBab('all');
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                        filterCategory === cat
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <span>{cat === 'all' ? 'Semua Dokumen' : cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        filterCategory === cat ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {activeInCat}/{countInCat}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[260px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={clauseSearch}
                  onChange={(e) => setClauseSearch(e.target.value)}
                  placeholder="Cari nomor pasal, judul, atau kata kunci..."
                  className="w-full pl-9 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {clauseSearch && (
                  <button
                    onClick={() => setClauseSearch('')}
                    className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* SSUK Bab Sub-Filter (Shown when SSUK or All is selected) */}
            {(filterCategory === 'SSUK (Syarat Umum)' || filterCategory === 'all') && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Bagian SSUK (8 Bab - Total 79 Pasal Lengkap Sesuai Dokumen Word Acuan):
                  </span>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {canEdit && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSelectAllSSUK(true)}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Centang Semua SSUK (79)
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleSelectAllSSUK(false)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:underline"
                        >
                          Kosongkan Semua
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleResetAllSSUK}
                          className="text-[11px] font-semibold text-amber-600 hover:text-amber-800 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reset Redaksi Baku LKPP
                        </button>
                        <span className="text-slate-300">|</span>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleExpandAll(expandedClauseIds.size < filteredClauses.length)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {expandedClauseIds.size < filteredClauses.length ? 'Bentangkan Semua Teks' : 'Ciutkan Semua Teks'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1">
                  {[
                    { key: 'all', label: 'Semua Bab (79)', range: 'Pasal 1 - 79' },
                    { key: 'A', label: 'Bab A: Ketentuan Umum', range: '1-15' },
                    { key: 'B', label: 'Bab B: Pelaksanaan & Pemutusan', range: '16-47' },
                    { key: 'C', label: 'Bab C: Hak & Kewajiban Pihak', range: '48-59' },
                    { key: 'D', label: 'Bab D: Kewajiban PPK', range: '60-61' },
                    { key: 'E', label: 'Bab E: Personel & Peralatan', range: '62-64' },
                    { key: 'F', label: 'Bab F: Pembayaran', range: '65-74' },
                    { key: 'G', label: 'Bab G: Pengawasan Mutu', range: '75-76' },
                    { key: 'H', label: 'Bab H: Penyelesaian Sengketa', range: '77-79' }
                  ].map(b => (
                    <button
                      key={b.key}
                      onClick={() => setSelectedBab(b.key)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 ${
                        selectedBab === b.key
                          ? 'bg-slate-900 text-white font-bold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title={b.label}
                    >
                      <span>{b.label}</span>
                      <span className="text-[10px] opacity-75 font-mono">({b.range})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status Information Bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>
                Menampilkan <strong>{filteredClauses.length}</strong> klausul ({filteredClauses.filter(c => c.isActive).length} aktif digunakan)
                {clauseSearch && <span> untuk kata kunci "<em>{clauseSearch}</em>"</span>}
              </span>
              <span>
                Centang kotak untuk memasukkan pasal ke dalam kontrak proyek ini
              </span>
            </div>
          </div>

          {/* Clause Card List */}
          <div className="space-y-3">
            {filteredClauses.map((clause) => {
              const isEditing = editingClauseId === clause.id;
              const hasCustom = clause.kontenCustom !== undefined;
              const displayContent = (hasCustom ? clause.kontenCustom : clause.kontenDefault) || '';
              const isExpanded = expandedClauseIds.has(clause.id) || isEditing || Boolean(clauseSearch);
              const isLongContent = displayContent.length > 280;

              return (
                <div
                  key={clause.id}
                  className={`bg-white rounded-2xl border p-5 transition-all ${
                    clause.isActive
                      ? 'border-slate-300 shadow-2xs'
                      : 'border-slate-200/60 bg-slate-50/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleClause(clause.id)}
                        className="mt-0.5 text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                        title={clause.isActive ? 'Nonaktifkan klausul ini' : 'Gunakan klausul ini'}
                      >
                        {clause.isActive ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                            {typeof clause.pasal === 'number' ? `PASAL ${clause.pasal}` : clause.pasal}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {clause.kategori}
                          </span>
                          {(clause.id === 'sp-premis' || clause.id === 'sp-konsiderans' || clause.id === 'sp-pasal-3' || clause.id === 'sp-pasal-5') && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              Auto-Link Data Kontrak & SSKK
                            </span>
                          )}
                          {hasCustom && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                              Telah Dimodifikasi
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-1 break-words">
                          {clause.judul}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Rujukan: {clause.keteranganPerlem}
                        </p>
                      </div>
                    </div>

                    {clause.isActive && canEdit && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {hasCustom && !isEditing && (
                          <button
                            onClick={() => handleResetClause(clause.id)}
                            className="text-xs text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 flex items-center gap-1"
                            title="Kembalikan ke redaksi default LKPP"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Reset Default</span>
                          </button>
                        )}
                        {!isEditing ? (
                          <button
                            onClick={() => handleStartEdit(clause)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Redaksi
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingClauseId(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleSaveEdit(clause.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Simpan Poin
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pl-8">
                    {isEditing ? (
                      <ClauseTextEditor
                        value={tempClauseText}
                        onChange={setTempClauseText}
                        variables={[
                          { label: 'Nama Paket', tag: '{{NAMA_PAKET}}' },
                          { label: 'Metode Pemilihan', tag: '{{METODE_PEMILIHAN}}' },
                          { label: 'Nomor SPPBJ', tag: '{{NOMOR_SPPBJ}}' },
                          { label: 'Tanggal SPPBJ', tag: '{{TANGGAL_SPPBJ}}' },
                          { label: 'Nama Penyedia', tag: '{{NAMA_PENYEDIA}}' },
                          { label: 'Nama Direktur', tag: '{{NAMA_DIREKTUR}}' },
                          { label: 'Nama PPK', tag: '{{NAMA_PPK}}' },
                          { label: 'Nilai Kontrak', tag: '{{NILAI_KONTRAK}}' },
                          { label: 'Nilai Terbilang', tag: '{{NILAI_TERBILANG}}' },
                          { label: 'Sumber Dana', tag: '{{SUMBER_PEMBIAYAAN}}' },
                          { label: 'Waktu Pelaksanaan', tag: '{{JANGKA_WAKTU_PELAKSANAAN}}' }
                        ]}
                        previewResolvedText={resolveContractPlaceholders(tempClauseText, currentContractState)}
                      />
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-sans">
                          {(() => {
                            const resolvedContent = resolveContractPlaceholders(displayContent, currentContractState);
                            const textToShow = isExpanded || !isLongContent
                              ? resolvedContent
                              : `${resolvedContent.slice(0, 280)}...`;
                            return <RichSpan text={textToShow} />;
                          })()}
                        </div>
                        {isLongContent && (
                          <button
                            type="button"
                            onClick={() => toggleExpandClause(clause.id)}
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" />
                                Ciutkan Teks
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                Lihat Selengkapnya ({displayContent.split('\n\n').length} Paragraf)
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 3: PRATINJAU DOKUMEN CETAK RESMI */}
      {activeTabMode === 'preview' && (
        <div className="space-y-6">
          
          {/* Document Section Selector & Print Controller Toolbar (Neat & Efficient Single Bar) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs no-print flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Sub Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {[
                { id: 'all', label: '📄 Semua (5 Dokumen)' },
                { id: 'sp', label: '1. Surat Perjanjian' },
                { id: 'ssuk', label: '2. SSUK' },
                { id: 'sskk', label: '3. SSKK' },
                { id: 'lampa', label: '4. Lampiran A' },
                { id: 'lampb', label: '5. Lampiran B' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setPreviewDocType(sub.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                    previewDocType === sub.id
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handlePrint(previewDocType)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                title="Cetak Dokumen Sesuai Pilihan"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak {previewDocType === 'all' ? 'Semua (5 Dokumen)' : 'Tampilan Ini'}
              </button>
              <button
                type="button"
                onClick={handleExportWord}
                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                title="Download Naskah Lengkap File Word (.doc)"
              >
                <Download className="w-3.5 h-3.5" />
                Word (.doc)
              </button>
            </div>
          </div>

          {/* Printable Documents Container */}
          <div className="w-full overflow-x-auto pb-4 space-y-8">
            {(previewDocType === 'all' || previewDocType === 'sp') && (
              <SuratPerjanjianPrint contract={currentContractState} />
            )}

            {(previewDocType === 'all' || previewDocType === 'ssuk') && (
              <SSUKPrint clauses={clauses} />
            )}

            {(previewDocType === 'all' || previewDocType === 'sskk') && (
              <SSKKPrint contract={currentContractState} />
            )}

            {(previewDocType === 'all' || previewDocType === 'lampa') && (
              <LampiranAPrint contract={currentContractState} />
            )}

            {(previewDocType === 'all' || previewDocType === 'lampb') && (
              <LampiranBPrint contract={currentContractState} />
            )}
          </div>

        </div>
      )}

    </div>
  );
};
