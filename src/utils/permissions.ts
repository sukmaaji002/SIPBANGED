import { UserRole } from '../types';

export interface RoleDetail {
  role: UserRole;
  label: string;
  badgeColor: string;
  bgColor: string;
  textColor: string;
  deskripsi: string;
}

export const ROLE_DETAILS: Record<UserRole, RoleDetail> = {
  admin: {
    role: 'admin',
    label: 'Admin DPUPR',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-200',
    bgColor: 'bg-rose-600',
    textColor: 'text-rose-600',
    deskripsi: 'Akses penuh ke seluruh sistem, manajemen pengguna, konfigurasi data master dan audit log.'
  },
  kabid: {
    role: 'kabid',
    label: 'Kepala Bidang PBLTARU',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200',
    bgColor: 'bg-purple-700',
    textColor: 'text-purple-700',
    deskripsi: 'Monitoring eksekutif seluruh proyek bangunan gedung Pemkab Tegal, approval akhir dan supervisi kebijakan.'
  },
  ppk: {
    role: 'ppk',
    label: 'PPK / PPTK Bangunan Gedung',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
    bgColor: 'bg-blue-600',
    textColor: 'text-blue-700',
    deskripsi: 'Pejabat Pembuat Komitmen: menyusun & mengedit klausul kontrak LKPP, pengesahan Berita Acara, persetujuan termin pembayaran.'
  },
  kontraktor: {
    role: 'kontraktor',
    label: 'Kontraktor Pelaksana',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    bgColor: 'bg-amber-600',
    textColor: 'text-amber-700',
    deskripsi: 'Penyedia konstruksi: menginput progres mingguan, kurva S realisasi, foto 0%-100%, pengajuan Berita Acara dan permohonan termin.'
  },
  pengawas: {
    role: 'pengawas',
    label: 'Konsultan Pengawas',
    badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-200',
    bgColor: 'bg-teal-600',
    textColor: 'text-teal-700',
    deskripsi: 'Pengawas teknis: verifikasi lapangan, catatan mutu uji lab beton/baja, menerbitkan instruksi lapangan & rekomendasi SCM.'
  },
  perencana: {
    role: 'perencana',
    label: 'Konsultan Perencana',
    badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    bgColor: 'bg-indigo-600',
    textColor: 'text-indigo-700',
    deskripsi: 'Perencana arsitektur & struktur: upload & update berkas DED, RAB HPS, spesifikasi teknis dan KAK.'
  },
  keuangan: {
    role: 'keuangan',
    label: 'Staf Keuangan / Bendahara',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    bgColor: 'bg-emerald-600',
    textColor: 'text-emerald-700',
    deskripsi: 'Pengelola anggaran: verifikasi SPP, penerbitan SPM & input SP2D BPKAD, pengelolaan kas uang muka dan sisa kontrak.'
  }
};

export type AppAction =
  | 'manage_users'             // Admin
  | 'create_project'            // Admin, PPK
  | 'edit_project'              // Admin, PPK
  | 'delete_project'            // Admin
  | 'upload_planning_doc'       // Admin, PPK, Perencana
  | 'approve_planning_doc'      // Admin, PPK, Kabid
  | 'submit_progress'           // Admin, Kontraktor
  | 'verify_progress'           // Admin, Pengawas, PPK
  | 'add_supervision_log'       // Admin, Pengawas
  | 'add_maintenance_issue'     // Admin, Pengawas, PPK, Kontraktor
  | 'edit_contract'             // Admin, PPK
  | 'create_berita_acara'       // Admin, PPK, Kontraktor, Pengawas
  | 'sign_berita_acara'         // Admin, PPK, Kabid
  | 'manage_finance'            // Admin, Keuangan, PPK
  | 'view_all';                 // Semua role

export const hasPermission = (role: UserRole | undefined, action: AppAction): boolean => {
  if (!role) return false;
  if (role === 'admin') return true; // Superadmin has access to all actions

  switch (action) {
    case 'manage_users':
      return false; // Hanya Admin

    case 'create_project':
    case 'edit_project':
      return role === 'ppk' || role === 'kabid';

    case 'delete_project':
      return false; // Hanya Admin

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

    case 'sign_berita_acara':
      return ['ppk', 'kabid'].includes(role);

    case 'manage_finance':
      return role === 'keuangan' || role === 'ppk' || role === 'kabid';

    case 'view_all':
      return true;

    default:
      return false;
  }
};

