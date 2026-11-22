import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { BeritaAcara, BAType, SpkType } from '../../types';
import { formatTanggalIndo, formatRupiah } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';
import { getProjectPackage, projectPackageLabels } from '../../utils/projectPackages';
import { KopSurat } from '../common/KopSurat';
import { 
  Award, 
  Plus, 
  Printer, 
  Eye, 
  Trash2, 
  FileCheck, 
  Calendar, 
  Building2, 
  FileText,
  X
} from 'lucide-react';

const physicalTemplates: { type: BAType; label: string }[] = [
  { type: 'BAPLK', label: 'BA Penyerahan Lokasi (BAPLK)' },
  { type: 'SPMK', label: 'Surat Perintah Mulai Kerja (SPMK)' },
  { type: 'PCM', label: 'Rapat Persiapan (PCM)' },
  { type: 'MC-0', label: 'Mutual Check 0% (MC-0)' },
  { type: 'OPNAME', label: 'Pemeriksaan Opname Fisik' },
  { type: 'BAP-TERMIN', label: 'BA Pembayaran (Termin)' },
  { type: 'PHO', label: 'Serah Terima Pertama (PHO)' },
  { type: 'CACAT-MUTU', label: 'Pemeriksaan Cacat Mutu' },
  { type: 'FHO', label: 'Serah Terima Akhir (FHO)' },
];

const consultantTemplates: { type: BAType; label: string }[] = [
  { type: 'BAST', label: 'BA Serah Terima Hasil Pekerjaan' },
  { type: 'BAP-TERMIN', label: 'BA Pembayaran Konsultansi' },
];

interface BeritaAcaraListProps {
  packageType?: SpkType;
  view?: 'create' | 'records' | 'all';
  onCreated?: () => void;
}

export function BeritaAcaraList({ packageType = 'fisik', view = 'all', onCreated }: BeritaAcaraListProps) {
  const { selectedProject, beritaAcaraList, addBeritaAcara, deleteBeritaAcara, currentUser } = useApp();
  
  const [selectedBA, setSelectedBA] = useState<BeritaAcara | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isPhysical = packageType === 'fisik';
  const defaultType: BAType = isPhysical ? 'OPNAME' : 'BAST';
  const templates = isPhysical ? physicalTemplates : consultantTemplates;
  const [tipe, setTipe] = useState<BAType>(defaultType);
  const [nomorSurat, setNomorSurat] = useState('');
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [tempat, setTempat] = useState('Slawi, Kabupaten Tegal');
  const [deskripsi, setDeskripsi] = useState('');
  const [progresFisik, setProgresFisik] = useState<number>(50);
  const [nilaiPembayaran, setNilaiPembayaran] = useState<number>(0);
  const [catatanItem1, setCatatanItem1] = useState('');
  const [catatanItem2, setCatatanItem2] = useState('');
  const [rekomendasi, setRekomendasi] = useState('');

  if (!selectedProject) {
    return <div className="p-8 text-center text-slate-500">Pilih proyek terlebih dahulu.</div>;
  }

  const pack = getProjectPackage(selectedProject, packageType);
  const packageLabel = projectPackageLabels[packageType];
  const documentNumber = (type: BAType) =>
    `600.1.1/0${Math.floor(Math.random() * 80) + 10}/BA-${type}/PBLTARU/DPUPR/${selectedProject.tahunAnggaran}`;
  const projectBAs = beritaAcaraList.filter(b => b.projectId === selectedProject.id && (b.spkType ?? 'fisik') === packageType);
  const canCreate = hasPermission(currentUser?.role, 'create_berita_acara');

  const getTitle = (type: BAType) => {
    const titles: Record<BAType, string> = {
      'BAPLK': 'BERITA ACARA PENYERAHAN LOKASI KERJA',
      'SPMK': 'SURAT PERINTAH MULAI KERJA (SPMK)',
      'PCM': 'BERITA ACARA RAPAT PERSIAPAN PELAKSANAAN KONTRAK (PCM)',
      'MC-0': 'BERITA ACARA MUTUAL CHECK AWAL (MC-0%)',
      'OPNAME': 'BERITA ACARA PEMERIKSAAN KEMAJUAN PEKERJAAN FISIK',
      'BAP-TERMIN': 'BERITA ACARA PEMBAYARAN TERMIN PRESTASI PEKERJAAN',
      'PHO': 'BERITA ACARA SERAH TERIMA PERTAMA PEKERJAAN (PHO)',
      'CACAT-MUTU': 'BERITA ACARA PEMERIKSAAN CACAT MUTU PEMELIHARAAN',
      'FHO': 'BERITA ACARA SERAH TERIMA AKHIR PEKERJAAN (FHO)',
      'BAST': 'BERITA ACARA SERAH TERIMA HASIL PEKERJAAN KONSULTANSI'
    };
    
    return !isPhysical && type === 'BAP-TERMIN' ? 'BERITA ACARA PEMBAYARAN PEKERJAAN KONSULTANSI' : titles[type];
  };

  const openCreateModal = (type: BAType = defaultType) => {
    setTipe(type);
    setNomorSurat(documentNumber(type));
    setJudul(getTitle(type));
    setDeskripsi(`Pemeriksaan dan verifikasi administratif serta teknis untuk paket ${isPhysical ? '' : packageLabel.toLowerCase() + ' '}${selectedProject.nama}.`);
    setCatatanItem1(isPhysical ? 'Pekerjaan telah dilaksanakan sesuai dengan gambar kerja DED dan spesifikasi teknis RKS.' : '');
    setCatatanItem2(isPhysical ? 'Seluruh hasil pengujian mutu bahan beton dan baja memenuhi standar teknis yang disyaratkan.' : '');
    setRekomendasi(isPhysical ? 'Dapat disetujui untuk proses tahapan administrasi dan pembayaran selanjutnya.' : '');
    setProgresFisik(isPhysical ? selectedProject.progresFisikRealisasi : 0);
    setNilaiPembayaran(isPhysical ? selectedProject.nilaiKontrak * 0.3 : 0);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate || !nomorSurat || !judul) return;

    const catatan: string[] = [];
    if (catatanItem1) catatan.push(catatanItem1);
    if (catatanItem2) catatan.push(catatanItem2);

    const newBA: BeritaAcara = {
      id: `ba-${crypto.randomUUID()}`,
      projectId: selectedProject.id,
      spkType: packageType,
      tipe,
      nomorSurat,
      judul,
      tanggal,
      tempat,
      deskripsiPekerjaan: deskripsi,
      progresFisikPersen: isPhysical ? Number(progresFisik) : undefined,
      nilaiPembayaran: Number(nilaiPembayaran) || undefined,
      catatanHasilPemeriksaan: catatan,
      rekomendasi,
      pihakPertama: {
        nama: pack.ppk || selectedProject.ppkNama,
        jabatan: 'Pejabat Pembuat Komitmen (PPK)',
        nip: pack.ppkNip,
        instansi: 'DPUPR Kabupaten Tegal'
      },
      pihakKedua: {
        nama: pack.director || (isPhysical ? 'Ir. Bambang Haryadi' : ''),
        jabatan: 'Direktur Utama',
        perusahaan: pack.company || ''
      },
      status: 'Final'
    };

    addBeritaAcara(newBA);
    setIsCreateModalOpen(false);
    onCreated?.();
  };

  const handlePrintBA = (ba: BeritaAcara) => {
    setSelectedBA(ba);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {view !== 'records' && <>
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase font-mono">
              Tata Naskah Dinas DPUPR
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Sistem Form & Cetak Berita Acara Proyek Gedung
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Form Berita Acara (BA) Terpadu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paket: <strong className="text-slate-800">{selectedProject.nama}</strong> • {isPhysical ? 'Pengesahan administrasi fisik & termin' : `Paket ${packageLabel.toLowerCase()}`}
          </p>
        </div>

        <div>
          {canCreate ? (
            <button
              onClick={() => openCreateModal()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Buat Berita Acara Baru
            </button>
          ) : (
            <div 
              className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
              title="Akses terbatas"
            >
              <Award className="w-3.5 h-3.5" />
              Buat BA (PPK/Kontraktor/Pengawas)
            </div>
          )}
        </div>
      </div>

      {canCreate && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs no-print">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Pilih Template Berita Acara Siap Pakai:
          </span>
          <div className="flex flex-wrap gap-2">
            {templates.map(item => (
              <button
                key={item.type}
                onClick={() => openCreateModal(item.type)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-purple-300 transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-purple-600" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      </>}

      {/* BA Table List */}
      {view !== 'create' && (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden no-print">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Daftar Berita Acara yang Telah Diterbitkan
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {projectBAs.length} Berkas Berita Acara
          </span>
        </div>

        {projectBAs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-medium">Belum ada berita acara untuk kategori ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projectBAs.map((ba) => (
              <div key={ba.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                      {ba.tipe}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      No: {ba.nomorSurat}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • Tanggal: {formatTanggalIndo(ba.tanggal)}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900">
                    {ba.judul}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {ba.deskripsiPekerjaan}
                  </p>

                  {(ba.progresFisikPersen !== undefined || Boolean(ba.nilaiPembayaran)) && (
                    <div className="flex items-center gap-3 text-xs pt-1">
                      {ba.progresFisikPersen !== undefined && (
                        <span className="text-slate-500">
                          Progres Fisik: <strong className="text-emerald-700">{ba.progresFisikPersen}%</strong>
                        </span>
                      )}
                      {ba.nilaiPembayaran && (
                        <span className="text-slate-500">
                          Nilai BAP: <strong className="text-slate-900">{formatRupiah(ba.nilaiPembayaran)}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handlePrintBA(ba)}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Cetak / Pratinjau
                  </button>

                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus berita acara: ${ba.judul}?`)) {
                          deleteBeritaAcara(ba.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      )}

      {/* Modal Cetak Format Resmi Berita Acara */}
      {isPrintModalOpen && selectedBA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 border border-slate-200 flex flex-col">
            
            {/* Modal Controls Bar */}
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between no-print rounded-t-2xl">
              <span className="text-xs font-semibold">
                Pratinjau Cetak Format Resmi DPUPR Kabupaten Tegal
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak / Simpan PDF
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content for Print */}
            <div className="p-8 sm:p-12 print-page font-serif text-black max-w-3xl mx-auto w-full">
              
              <KopSurat />

              <div className="text-center my-6">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide">
                  {selectedBA.judul}
                </h3>
                <p className="text-xs font-bold mt-0.5">
                  Nomor: {selectedBA.nomorSurat}
                </p>
                <p className="text-xs mt-1">
                  Kegiatan Penyelenggaraan Bangunan Gedung Tahun Anggaran {selectedProject.tahunAnggaran}
                </p>
              </div>

              <div className="text-xs leading-relaxed space-y-3 text-justify">
                <p>
                  Pada hari ini, <strong>{formatTanggalIndo(selectedBA.tanggal)}</strong>, bertempat di {selectedBA.tempat}, kami yang bertanda tangan di bawah ini:
                </p>

                <div className="pl-4 space-y-1">
                  <div className="flex">
                    <span className="w-24 font-bold">1. Nama</span>
                    <span>: <strong>{selectedBA.pihakPertama.nama}</strong></span>
                  </div>
                  {selectedBA.pihakPertama.nip && (
                    <div className="flex">
                      <span className="w-24 font-bold">   NIP</span>
                      <span>: {selectedBA.pihakPertama.nip}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="w-24 font-bold">   Jabatan</span>
                    <span>: {selectedBA.pihakPertama.jabatan}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold">   Instansi</span>
                    <span>: {selectedBA.pihakPertama.instansi}</span>
                  </div>
                  <p className="italic text-[11px] text-slate-600">
                    Disebut sebagai <strong>PIHAK PERTAMA (PPK Dinas PUPR)</strong>.
                  </p>
                </div>

                <div className="pl-4 space-y-1 mt-2">
                  <div className="flex">
                    <span className="w-24 font-bold">2. Nama</span>
                    <span>: <strong>{selectedBA.pihakKedua.nama}</strong></span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold">   Jabatan</span>
                    <span>: {selectedBA.pihakKedua.jabatan}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold">   Perusahaan</span>
                    <span>: <strong>{selectedBA.pihakKedua.perusahaan}</strong></span>
                  </div>
                  <p className="italic text-[11px] text-slate-600">
                    Disebut sebagai <strong>PIHAK KEDUA (PENYEDIA JASA)</strong>.
                  </p>
                </div>

                <p className="pt-2">
                  Telah bersama-sama melakukan pemeriksaan terhadap {isPhysical ? 'pelaksanaan paket pekerjaan konstruksi bangunan gedung' : `hasil pekerjaan konsultansi ${packageLabel.toLowerCase()}`} dengan rincian sebagai berikut:
                </p>

                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div><strong>Nama Paket:</strong> {selectedProject.nama}</div>
                  <div><strong>Lokasi:</strong> {selectedProject.lokasi}</div>
                  <div><strong>Sumber Dana:</strong> {selectedProject.sumberDana}</div>
                  <div><strong>Nilai Kontrak:</strong> {pack.value == null ? "-" : formatRupiah(pack.value)}</div>
                  {selectedBA.progresFisikPersen !== undefined && (
                    <div><strong>Prestasi Kemajuan Fisik:</strong> {selectedBA.progresFisikPersen}%</div>
                  )}
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-xs uppercase mb-1">
                    HASIL PEMERIKSAAN BERSAMA:
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    {selectedBA.catatanHasilPemeriksaan.map((cat, cIdx) => (
                      <li key={cIdx}>{cat}</li>
                    ))}
                  </ol>
                </div>

                {selectedBA.rekomendasi && (
                  <div className="pt-2">
                    <h4 className="font-bold text-xs uppercase mb-1">
                      KESIMPULAN DAN REKOMENDASI:
                    </h4>
                    <p className="pl-2 border-l-2 border-black italic">
                      {selectedBA.rekomendasi}
                    </p>
                  </div>
                )}

                <p className="pt-3">
                  Demikian Berita Acara ini dibuat dan ditandatangani oleh Para Pihak dengan sebenarnya dalam rangkap secukupnya untuk dipergunakan sebagaimana mestinya.
                </p>
              </div>

              {/* Tanda Tangan */}
              <div className="mt-10 pt-4 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="font-bold uppercase">PIHAK KEDUA</p>
                  <p className="text-[11px] font-semibold">{selectedBA.pihakKedua.perusahaan}</p>
                  <div className="h-20" />
                  <p className="font-bold underline text-sm">{selectedBA.pihakKedua.nama}</p>
                  <p className="text-[11px]">{selectedBA.pihakKedua.jabatan}</p>
                </div>

                <div>
                  <p className="font-bold uppercase">PIHAK PERTAMA</p>
                  <p className="text-[11px] font-semibold">DPUPR KABUPATEN TEGAL</p>
                  <div className="h-20" />
                  <p className="font-bold underline text-sm">{selectedBA.pihakPertama.nama}</p>
                  <p className="text-[11px]">NIP. {selectedBA.pihakPertama.nip}</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal Create Berita Acara */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto my-auto">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Buat Berita Acara Baru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Penerbitan Berita Acara resmi format standar DPUPR Kab. Tegal
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Berita Acara</label>
                  <select
                    value={tipe}
                    onChange={e => {
                      const newTipe = e.target.value as BAType;
                      setTipe(newTipe);
                      setNomorSurat(documentNumber(newTipe));
                      setJudul(getTitle(newTipe));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    {templates.map(({ type, label }) => <option key={type} value={type}>{label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Surat Resmi</label>
                  <input
                    type="text"
                    required
                    value={nomorSurat}
                    onChange={e => setNomorSurat(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Berita Acara *</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={e => setJudul(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={e => setTanggal(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat</label>
                  <input
                    type="text"
                    value={tempat}
                    onChange={e => setTempat(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-purple-50/60 p-3 rounded-xl border border-purple-200/60">
                {isPhysical && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Progres Fisik Terverifikasi (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={progresFisik}
                      onChange={e => setProgresFisik(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-bold text-purple-800"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai Pembayaran (Rp) (Opsional)</label>
                  <input
                    type="number"
                    value={nilaiPembayaran}
                    onChange={e => setNilaiPembayaran(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Hasil Pemeriksaan 1</label>
                <input
                  type="text"
                  value={catatanItem1}
                  onChange={e => setCatatanItem1(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Hasil Pemeriksaan 2</label>
                <input
                  type="text"
                  value={catatanItem2}
                  onChange={e => setCatatanItem2(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rekomendasi / Kesimpulan Akhir</label>
                <textarea
                  rows={2}
                  value={rekomendasi}
                  onChange={e => setRekomendasi(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                >
                  Terbitkan Berita Acara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
