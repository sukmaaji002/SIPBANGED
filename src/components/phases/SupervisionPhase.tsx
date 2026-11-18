import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupervisionLog } from '../../types';
import { hasPermission } from '../../utils/permissions';
import { 
  ClipboardCheck, 
  FlaskConical, 
  AlertTriangle, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  FileCheck,
  Calendar,
  Send
} from 'lucide-react';

export const SupervisionPhase: React.FC = () => {
  const { selectedProject, supervisionLogs, addSupervisionLog, currentUser } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [catatanTeknis, setCatatanTeknis] = useState('');
  const [instruksiLapangan, setInstruksiLapangan] = useState('');
  const [scmStatus, setScmStatus] = useState<SupervisionLog['peringatanSCM']>('Normal');
  
  // Test Mutu Form
  const [itemUji, setItemUji] = useState('Uji Kuat Tekan Beton Silinder 28 Hari');
  const [standarUji, setStandarUji] = useState('K-300 / fc 25 MPa');
  const [hasilUji, setHasilUji] = useState('27.2 MPa');
  const [statusUji, setStatusUji] = useState<'Memenuhi Syarat' | 'Tidak Memenuhi Syarat'>('Memenuhi Syarat');

  if (!selectedProject) {
    return <div className="p-8 text-center text-slate-500">Pilih proyek terlebih dahulu.</div>;
  }

  const projectLogs = supervisionLogs.filter(s => s.projectId === selectedProject.id);

  const canAddLog = hasPermission(currentUser?.role, 'add_supervision_log');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catatanTeknis) return;

    const newLog: SupervisionLog = {
      id: `sup-${Date.now()}`,
      projectId: selectedProject.id,
      tanggal,
      pengawasNama: currentUser?.name || selectedProject.pengawasNama,
      catatanTeknis,
      instruksiLapangan: instruksiLapangan || undefined,
      hasilUjiMutu: itemUji ? [{
        item: itemUji,
        standar: standarUji,
        hasilUji,
        status: statusUji
      }] : undefined,
      peringatanSCM: scmStatus,
      statusApproval: 'Disetujui Pengawas'
    };

    addSupervisionLog(newLog);
    setShowModal(false);
    setCatatanTeknis('');
    setInstruksiLapangan('');
  };

  return (
    <div className="space-y-6">
      
      {/* Phase Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
              Tahap 3: Pengawasan Teknis & Kendali Mutu
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Buku Direksi & Pengujian Laboratorium
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Laporan Konsultan Pengawas & Pengujian Mutu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Konsultan Pengawas: <strong className="text-slate-800">{selectedProject.pengawasNama}</strong> • Pejabat Pembuat Komitmen: <strong className="text-slate-800">{selectedProject.ppkNama}</strong>
          </p>
        </div>

        <div>
          {canAddLog ? (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Buat Catatan Pengawasan / Uji Lab
            </button>
          ) : (
            <div 
              className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
              title="Hanya Konsultan Pengawas / PPK yang dapat menginput catatan teknis"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              Catatan Pengawas (Khusus Pengawas/PPK)
            </div>
          )}
        </div>
      </div>

      {/* Early Warning SCM (Show Cause Meeting) Card */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Status Pengendalian Deviasi & Evaluasi Kontrak (SCM)
              </h3>
              <p className="text-xs text-slate-300">
                Berdasarkan Klausul SSKK Perlem LKPP No. 12/2021: Deviasi keterlambatan di atas ambang batas memicu Rapat Pembuktian Keterlambatan (Show Cause Meeting).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs bg-emerald-500 text-white font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: Aman / On Track
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-teal-300 font-bold block mb-0.5">SCM Tingkat I</span>
            <span className="text-slate-300 text-[11px]">Bila deviasi mencapai -5% s/d -10% pada periode kritis. Diberi SP-1 dan uji coba 7 hari.</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-amber-300 font-bold block mb-0.5">SCM Tingkat II</span>
            <span className="text-slate-300 text-[11px]">Bila target SCM-1 tidak tercapai. Penerbitan SP-2 dan pengawasan ketat per hari.</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-rose-300 font-bold block mb-0.5">SCM Tingkat III</span>
            <span className="text-slate-300 text-[11px]">Kegagalan pemenuhan komitmen. Rekomendasi pemutusan kontrak sepihak & sanksi blacklist.</span>
          </div>
        </div>
      </div>

      {/* Supervision Logs & Lab Tests */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Buku Direksi, Instruksi Lapangan & Hasil Uji Laboratorium
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {projectLogs.length} Catatan Teknis
          </span>
        </div>

        {projectLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-medium">Belum ada catatan pengawasan atau pengujian mutu.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projectLogs.map((log) => (
              <div key={log.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {log.tanggal}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Oleh: <strong className="text-slate-800">{log.pengawasNama}</strong>
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 self-start sm:self-auto">
                    {log.statusApproval}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">Catatan Pemeriksaan Lapangan:</div>
                  <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {log.catatanTeknis}
                  </p>
                </div>

                {log.instruksiLapangan && (
                  <div className="text-xs bg-amber-50/80 p-3 rounded-xl border border-amber-200/60 text-amber-900 space-y-0.5">
                    <span className="font-bold flex items-center gap-1 text-amber-800">
                      <Send className="w-3 h-3" /> Lembar Instruksi Lapangan (Site Instruction):
                    </span>
                    <p className="italic">{log.instruksiLapangan}</p>
                  </div>
                )}

                {/* Hasil Uji Mutu Table */}
                {log.hasilUjiMutu && log.hasilUjiMutu.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Hasil Uji Mutu Bahan / Laboratorium:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {log.hasilUjiMutu.map((uji, uIdx) => (
                        <div key={uIdx} className="bg-emerald-50/60 border border-emerald-200/70 p-2.5 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-800">{uji.item}</div>
                            <div className="text-[10px] text-slate-500">
                              Standar: {uji.standar} • Hasil: <strong className="text-emerald-700">{uji.hasilUji}</strong>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {uji.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Input Catatan Pengawas */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Catatan Pengawasan & Uji Laboratorium
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pencatatan buku direksi, instruksi lapangan, dan sertifikasi uji mutu bahan
            </p>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Inspeksi</label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Teknis Pengawas *</label>
                <textarea
                  rows={3}
                  required
                  value={catatanTeknis}
                  onChange={e => setCatatanTeknis(e.target.value)}
                  placeholder="Kondisi bekisting, pembesian, kerapihan pekerjaan arsitektural..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instruksi Lapangan (Site Instruction)</label>
                <input
                  type="text"
                  value={instruksiLapangan}
                  onChange={e => setInstruksiLapangan(e.target.value)}
                  placeholder="Perintah perawatan beton, perbaikan elevasi, dll..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Hasil Uji Laboratorium / Mutu Bahan</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500">Item Pengujian</label>
                    <input
                      type="text"
                      value={itemUji}
                      onChange={e => setItemUji(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Standar / Toleransi</label>
                    <input
                      type="text"
                      value={standarUji}
                      onChange={e => setStandarUji(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500">Hasil Nyata</label>
                    <input
                      type="text"
                      value={hasilUji}
                      onChange={e => setHasilUji(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Kesimpulan</label>
                    <select
                      value={statusUji}
                      onChange={e => setStatusUji(e.target.value as any)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-semibold"
                    >
                      <option value="Memenuhi Syarat">Memenuhi Syarat</option>
                      <option value="Tidak Memenuhi Syarat">Tidak Memenuhi Syarat</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

