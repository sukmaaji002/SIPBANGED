import React from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_DETAILS, AppAction } from '../../utils/permissions';
import { UserRole } from '../../types';
import { 
  ShieldAlert, 
  Check, 
  X, 
  LogIn, 
  ShieldCheck, 
  Users, 
  KeyRound, 
  Building 
} from 'lucide-react';

export const RbacMatrix: React.FC = () => {
  const { currentUser, quickLogin } = useApp();

  const actionsList: { key: AppAction; label: string; desc: string }[] = [
    { key: 'create_project', label: 'Tambah & Konfigurasi Paket Proyek', desc: 'Membuat paket pekerjaan bangunan gedung baru' },
    { key: 'upload_planning_doc', label: 'Upload Dokumen DED, RAB & KAK', desc: 'Mengunggah file teknis perencanaan gedung' },
    { key: 'approve_planning_doc', label: 'Pengesahan Asistensi DED / RAB', desc: 'Menyetujui dokumen perencanaan oleh dinas' },
    { key: 'submit_progress', label: 'Input Progres Mingguan & Kurva S', desc: 'Melaporkan capaian fisik mingguan dan foto lapangan' },
    { key: 'verify_progress', label: 'Verifikasi Fisik & Opname Lapangan', desc: 'Memeriksa kebenaran progres fisik lapangan' },
    { key: 'add_supervision_log', label: 'Buku Direksi, Uji Lab & Rekomendasi SCM', desc: 'Mencatat hasil tes mutu dan instruksi pengawas' },
    { key: 'add_maintenance_issue', label: 'Lapor Temuan Cacat Mutu (180 Hari)', desc: 'Mencatat kerusakan pada masa pemeliharaan' },
    { key: 'edit_contract', label: 'Penyusunan & Edit Klausul Kontrak LKPP', desc: 'Memilih poin klausul dan mengedit teks kontrak' },
    { key: 'create_berita_acara', label: 'Membuat Form Berita Acara (BA)', desc: 'Menerbitkan SPMK, MC-0, PHO, FHO, dll' },
    { key: 'manage_finance', label: 'Pengelolaan Uang Kas & SP2D', desc: 'Pencairan uang muka, termin, retensi, pajak' },
    { key: 'manage_users', label: 'Manajemen Akun & Otorisasi Pengguna', desc: 'Approval akun baru, ubah peran dan penangguhan' }
  ];

  const roles: UserRole[] = [
    'admin',
    'kabid',
    'ppk',
    'kontraktor',
    'pengawas',
    'perencana',
    'keuangan'
  ];

  // Matrix permission logic
  const checkMatrix = (role: UserRole, action: AppAction): boolean => {
    if (role === 'admin') return true;
    switch (action) {
      case 'create_project':
        return role === 'ppk' || role === 'kabid';
      case 'upload_planning_doc':
        return role === 'perencana' || role === 'ppk';
      case 'approve_planning_doc':
        return role === 'ppk' || role === 'kabid';
      case 'submit_progress':
        return role === 'kontraktor' || role === 'ppk';
      case 'verify_progress':
        return role === 'pengawas' || role === 'ppk' || role === 'kabid';
      case 'add_supervision_log':
        return role === 'pengawas' || role === 'ppk';
      case 'add_maintenance_issue':
        return ['pengawas', 'ppk', 'kontraktor', 'kabid'].includes(role);
      case 'edit_contract':
        return role === 'ppk';
      case 'create_berita_acara':
        return ['ppk', 'kontraktor', 'pengawas'].includes(role);
      case 'manage_finance':
        return role === 'keuangan' || role === 'ppk' || role === 'kabid';
      case 'manage_users':
        return false;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase font-mono">
            Role-Based Access Control (RBAC)
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Keamanan Data & Tata Kelola Pengadaan
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 mt-1">
          Matriks Pembatasan Akun Pengguna SIPBANGED
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Sesuai dengan ketentuan regulasi pengadaan pemerintah dan tata kerja Dinas PUPR Kabupaten Tegal, setiap aktor memiliki batasan wewenang yang tegas untuk mencegah konflik kepentingan dan menjamin integritas data proyek.
        </p>
      </div>

      {/* Quick Role Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {roles.map(r => {
          const detail = ROLE_DETAILS[r];
          const isCurrent = currentUser?.role === r;

          return (
            <div
              key={r}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500'
                  : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isCurrent ? 'bg-emerald-500 text-white' : detail.badgeColor
                  }`}>
                    {detail.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-mono text-emerald-300 font-bold">
                      Sedang Aktif
                    </span>
                  )}
                </div>

                <p className={`text-xs mt-2 leading-relaxed ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                  {detail.deskripsi}
                </p>
              </div>

              <button
                onClick={() => quickLogin(r)}
                disabled={isCurrent}
                className={`mt-4 w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-white/10 text-slate-400 cursor-default'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                {isCurrent ? 'Peran Anda Saat Ini' : `Masuk Sebagai ${detail.label}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* RBAC Table Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Tabel Matriks Hak Akses Tindakan (Permission Matrix)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Terintegrasi dengan session pengguna
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4 min-w-[240px]">Fitur & Tindakan Sistem</th>
                <th className="py-3 px-2 text-center">Admin</th>
                <th className="py-3 px-2 text-center">Kabid</th>
                <th className="py-3 px-2 text-center">PPK</th>
                <th className="py-3 px-2 text-center">Kontraktor</th>
                <th className="py-3 px-2 text-center">Pengawas</th>
                <th className="py-3 px-2 text-center">Perencana</th>
                <th className="py-3 px-2 text-center">Keuangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actionsList.map((action) => (
                <tr key={action.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{action.label}</div>
                    <div className="text-[11px] text-slate-400">{action.desc}</div>
                  </td>

                  {roles.map((r) => {
                    const isAllowed = checkMatrix(r, action.key);
                    const isCurrentRole = currentUser?.role === r;

                    return (
                      <td 
                        key={r} 
                        className={`py-3 px-2 text-center ${
                          isCurrentRole ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        {isAllowed ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
                            <X className="w-3 h-3 stroke-[2]" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

