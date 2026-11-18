import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStage } from '../../types';
import { X, Building2, Plus } from 'lucide-react';
import { formatRibuan, parseRibuanKeAngka } from '../../utils/formatters';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject } = useApp();

  const [nama, setNama] = useState('');
  const [kodePaket, setKodePaket] = useState(`PBG-2026-00${Math.floor(Math.random() * 90) + 10}`);
  const [lokasi, setLokasi] = useState('');
  const [sumberDana, setSumberDana] = useState<'APBD Kab. Tegal' | 'DAK Fisik' | 'Banprov Jateng' | 'BLUD'>('APBD Kab. Tegal');
  const [tahunAnggaran, setTahunAnggaran] = useState<number>(2026);
  const [paguAnggaran, setPaguAnggaran] = useState<number>(3500000000);
  const [hps, setHps] = useState<number>(3400000000);
  const [nilaiKontrak, setNilaiKontrak] = useState<number>(3250000000);
  
  const [ppkNama, setPpkNama] = useState('Ahmad Fauzi, S.T., M.Eng.');
  const [ppkNip, setPpkNip] = useState('19820719 200604 1 009');
  const [pptkNama, setPptkNama] = useState('Danang Prasetyo, S.T.');
  const [kontraktorNama, setKontraktorNama] = useState('');
  const [kontraktorDirektur, setKontraktorDirektur] = useState('');
  const [pengawasNama, setPengawasNama] = useState('');
  const [perencanaNama, setPerencanaNama] = useState('');
  
  const [tanggalMulai, setTanggalMulai] = useState('2026-05-01');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-11-30');
  const [durasiHari, setDurasiHari] = useState<number>(214);
  const [stage, setStage] = useState<ProjectStage>('pelaksanaan');
  const [kategoriGedung, setKategoriGedung] = useState<Project['kategoriGedung']>('Fasilitas Kesehatan');
  const [deskripsi, setDeskripsi] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !lokasi || !kontraktorNama) {
      alert('Mohon lengkapi nama proyek, lokasi, dan nama kontraktor.');
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      kodePaket,
      nama,
      lokasi,
      tahunAnggaran,
      sumberDana,
      paguAnggaran: Number(paguAnggaran),
      hps: Number(hps),
      nilaiKontrak: Number(nilaiKontrak),
      ppkNama,
      ppkNip,
      pptkNama,
      kontraktorNama,
      kontraktorDirektur,
      pengawasNama: pengawasNama || 'PT Konsultan Supervisi Mandiri',
      perencanaNama: perencanaNama || 'CV Cipta Rekayasa Tegal',
      tanggalMulai,
      tanggalSelesai,
      durasiHari: Number(durasiHari),
      masaPemeliharaanHari: 180,
      stage,
      progresFisikRencana: 0,
      progresFisikRealisasi: 0,
      progresKeuangan: 0,
      deskripsi,
      kategoriGedung
    };

    addProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Tambah Paket Proyek Bangunan Gedung</h3>
              <p className="text-xs text-emerald-100">Bidang PBLTARU DPUPR Kabupaten Tegal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Paket</label>
              <input
                type="text"
                required
                value={kodePaket}
                onChange={e => setKodePaket(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Anggaran</label>
              <input
                type="number"
                value={tahunAnggaran}
                onChange={e => setTahunAnggaran(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sumber Dana</label>
              <select
                value={sumberDana}
                onChange={e => setSumberDana(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="APBD Kab. Tegal">APBD Kab. Tegal</option>
                <option value="DAK Fisik">DAK Fisik</option>
                <option value="Banprov Jateng">Banprov Jateng</option>
                <option value="BLUD">BLUD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Paket Pekerjaan *</label>
            <input
              type="text"
              required
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Contoh: Pembangunan Puskesmas Rawat Inap Kec. Kramat"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Proyek di Kab. Tegal *</label>
              <input
                type="text"
                required
                value={lokasi}
                onChange={e => setLokasi(e.target.value)}
                placeholder="Jl. Garuda No. 4, Slawi"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Gedung</label>
              <select
                value={kategoriGedung}
                onChange={e => setKategoriGedung(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="Fasilitas Kesehatan">Fasilitas Kesehatan</option>
                <option value="Kantor Pemerintahan">Kantor Pemerintahan</option>
                <option value="Pendidikan / Perpustakaan">Pendidikan / Perpustakaan</option>
                <option value="Komersial / IKM">Komersial / IKM</option>
                <option value="Ruang Terbuka Publik">Ruang Terbuka Publik</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pagu Anggaran (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={paguAnggaran ? formatRibuan(paguAnggaran) : ''}
                onChange={e => setPaguAnggaran(parseRibuanKeAngka(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nilai HPS (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={hps ? formatRibuan(hps) : ''}
                onChange={e => setHps(parseRibuanKeAngka(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nilai Kontrak (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={nilaiKontrak ? formatRibuan(nilaiKontrak) : ''}
                onChange={e => setNilaiKontrak(parseRibuanKeAngka(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kontraktor Pelaksana *</label>
              <input
                type="text"
                required
                value={kontraktorNama}
                onChange={e => setKontraktorNama(e.target.value)}
                placeholder="PT / CV Penyedia Konstruksi"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Direktur Kontraktor</label>
              <input
                type="text"
                value={kontraktorDirektur}
                onChange={e => setKontraktorDirektur(e.target.value)}
                placeholder="Nama Pimpinan Penyedia"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Konsultan Pengawas</label>
              <input
                type="text"
                value={pengawasNama}
                onChange={e => setPengawasNama(e.target.value)}
                placeholder="PT / CV Pengawas"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahap Saat Ini</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
              >
                <option value="perencanaan">Perencanaan (DED / RAB)</option>
                <option value="pelaksanaan">Pelaksanaan Fisik</option>
                <option value="pemeliharaan">Pemeliharaan (Retensi)</option>
                <option value="selesai">Selesai / FHO</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Simpan Paket Proyek
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

