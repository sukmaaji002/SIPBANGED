import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanningDocument } from '../../types';
import { hasPermission } from '../../utils/permissions';
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  AlertCircle,
  Plus,
  Shield,
  ExternalLink
} from 'lucide-react';

export const PlanningPhase: React.FC = () => {
  const { selectedProject, planningDocs, addPlanningDoc, updatePlanningDoc, currentUser } = useApp();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PlanningDocument['category']>('DED');
  const [version, setVersion] = useState('v1.0');
  const [notes, setNotes] = useState('');

  if (!selectedProject) {
    return <div className="p-8 text-center text-slate-500">Pilih proyek terlebih dahulu.</div>;
  }

  const projectDocs = planningDocs.filter(d => d.projectId === selectedProject.id);

  const canUpload = hasPermission(currentUser?.role, 'upload_planning_doc');
  const canApprove = hasPermission(currentUser?.role, 'approve_planning_doc');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newDoc: PlanningDocument = {
      id: `plan-${Date.now()}`,
      projectId: selectedProject.id,
      title,
      category,
      version,
      uploadedBy: currentUser?.name || 'Konsultan Perencana',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Asistensi',
      notes
    };

    addPlanningDoc(newDoc);
    setShowUploadModal(false);
    setTitle('');
    setNotes('');
  };

  const handleStatusChange = (doc: PlanningDocument, newStatus: PlanningDocument['status']) => {
    updatePlanningDoc({ ...doc, status: newStatus });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Phase */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase">
              Tahap 1: Pra-Konstruksi
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Standar Teknis Tata Bangunan Gedung
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Laporan Dokumen Perencanaan (DED & RAB)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paket: <strong className="text-slate-800">{selectedProject.nama}</strong> • Konsultan Perencana: <strong className="text-slate-800">{selectedProject.perencanaNama}</strong>
          </p>
        </div>

        <div>
          {canUpload ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload Berkas Perencanaan
            </button>
          ) : (
            <div 
              className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
              title="Hanya Konsultan Perencana / PPK yang dapat mengunggah berkas perencanaan"
            >
              <Shield className="w-3.5 h-3.5" />
              Upload Dokumen (Khusus Perencana/PPK)
            </div>
          )}
        </div>
      </div>

      {/* Info Boxes: Checklist Berkas Wajib */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-indigo-50/70 border border-indigo-200/60 p-3 rounded-xl text-center">
          <div className="text-[10px] font-bold text-indigo-600 uppercase">Gambar DED</div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">Arsitektur & Struktur</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Termasuk MEP</div>
        </div>
        <div className="bg-blue-50/70 border border-blue-200/60 p-3 rounded-xl text-center">
          <div className="text-[10px] font-bold text-blue-600 uppercase">RAB & Analisa</div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">SHS Kab. Tegal 2026</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Final Disetujui</div>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-200/60 p-3 rounded-xl text-center">
          <div className="text-[10px] font-bold text-emerald-600 uppercase">RKS & Spesifikasi</div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">Standar Bahan SNI</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Disahkan PPK</div>
        </div>
        <div className="bg-amber-50/70 border border-amber-200/60 p-3 rounded-xl text-center">
          <div className="text-[10px] font-bold text-amber-600 uppercase">Penyelidikan Tanah</div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">Uji Sondir & Bor Mesin</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1">Daya Dukung OK</div>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-800">Daftar Dokumen Teknis Perencanaan</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {projectDocs.length} Dokumen Terdaftar
          </span>
        </div>

        {projectDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-medium">Belum ada dokumen perencanaan diunggah untuk proyek ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projectDocs.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {doc.version}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'Disetujui PPK' ? 'bg-emerald-100 text-emerald-800' :
                      doc.status === 'Asistensi' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Diunggah oleh: <strong className="text-slate-700">{doc.uploadedBy}</strong> pada {doc.uploadDate}
                  </p>
                  {doc.notes && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1 italic">
                      Catatan Asistensi: "{doc.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {canApprove && doc.status !== 'Disetujui PPK' && (
                    <button
                      onClick={() => handleStatusChange(doc, 'Disetujui PPK')}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      title="Setujui Dokumen Perencanaan sebagai PPK/Kabid"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Setujui PPK
                    </button>
                  )}

                  <button
                    onClick={() => alert(`Simulasi Mengunduh Berkas Dokumen: ${doc.title} (${doc.category})`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh File
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Upload Perencanaan */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Upload Berkas Perencanaan Gedung
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              DED, RAB, RKS, atau KAK untuk verifikasi Bidang PBLTARU
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Dokumen *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Contoh: Gambar Detail Desain Arsitektur Final Lantai 1-4"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="DED">DED (Gambar Teknis)</option>
                    <option value="RAB">Rencana Anggaran Biaya (RAB)</option>
                    <option value="RKS">Rencana Kerja & Syarat (RKS)</option>
                    <option value="KAK">Kerangka Acuan Kerja (KAK)</option>
                    <option value="Spesifikasi Teknis">Spesifikasi Teknis</option>
                    <option value="Laporan Tanah / Sondir">Laporan Sondir Tanah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Versi / Edisi</label>
                  <input
                    type="text"
                    value={version}
                    onChange={e => setVersion(e.target.value)}
                    placeholder="Rev-01 / Final"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Keterangan kelengkapan berkas atau catatan perbaikan..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Simpan & Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

