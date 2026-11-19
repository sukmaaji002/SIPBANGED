import React, { useState } from 'react';
import { useApp, STORAGE_KEYS } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { ROLE_DETAILS } from '../../utils/permissions';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Ban, 
  ShieldCheck, 
  RotateCcw,
  Crown,
  Phone,
  Mail,
  Building2,
  X,
  Save,
  Check,
  Database,
  Download,
  Upload,
  Cloud,
  Settings,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, isSupabaseConnected } from '../../lib/supabase';
import { supabaseSync } from '../../lib/supabaseSync';

export const UserAccountsPage: React.FC = () => {
  const { 
    users, 
    updateUser, 
    addUser, 
    deleteUser, 
    currentUser, 
    resetToDefault,
    projects,
    planningDocs,
    weeklyProgressList,
    supervisionLogs,
    maintenanceIssues,
    contracts,
    spkContracts,
    beritaAcaraList,
    payments,
    scheduleAddendums
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Supabase Cloud State
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseConfig().anonKey);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isTestingSb, setIsTestingSb] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncingToCloud, setIsSyncingToCloud] = useState(false);

  // New User Form State
  const [newUserData, setNewUserData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    agency: string;
    nip: string;
    phone: string;
    status: 'active' | 'suspended';
  }>({
    name: '',
    email: '',
    role: 'ppk',
    agency: 'DPUPR Kabupaten Tegal',
    nip: '',
    phone: '',
    status: 'active'
  });

  const showAlert = (msg: string) => {
    setAlertSuccess(msg);
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const roleOptions: UserRole[] = [
    'master_admin',
    'admin',
    'kabid',
    'ppk',
    'kontraktor',
    'pengawas',
    'perencana',
    'keuangan'
  ];

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.nip && u.nip.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalActive = users.filter(u => u.status === 'active').length;
  const totalSuspended = users.filter(u => u.status === 'suspended').length;
  const totalSuperAdmin = users.filter(u => u.role === 'master_admin').length;

  const handleStatusToggle = (user: User) => {
    const updatedStatus = user.status === 'active' ? 'suspended' : 'active';
    updateUser({ ...user, status: updatedStatus });
    showAlert(`Status akun "${user.name}" diubah menjadi ${updatedStatus === 'active' ? 'Aktif' : 'Ditangguhkan'}.`);
  };

  const handleDeleteUser = (user: User) => {
    if (user.id === currentUser?.id) {
      alert('Anda tidak dapat menghapus akun yang sedang Anda gunakan.');
      return;
    }
    if (window.confirm(`Hapus permanen akun "${user.name}" (${user.email})?`)) {
      deleteUser(user.id);
      showAlert(`Akun "${user.name}" berhasil dihapus.`);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser);
    showAlert(`Data akun "${editingUser.name}" berhasil diperbarui!`);
    setEditingUser(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim()) {
      alert('Nama dan email wajib diisi.');
      return;
    }
    addUser({
      name: newUserData.name.trim(),
      email: newUserData.email.trim(),
      role: newUserData.role,
      agency: newUserData.agency.trim() || 'DPUPR Kabupaten Tegal',
      nip: newUserData.nip.trim() || undefined,
      phone: newUserData.phone.trim() || '-',
      status: newUserData.status
    });
    showAlert(`Akun baru "${newUserData.name}" berhasil ditambahkan!`);
    setIsAddUserOpen(false);
    setNewUserData({
      name: '',
      email: '',
      role: 'ppk',
      agency: 'DPUPR Kabupaten Tegal',
      nip: '',
      phone: '',
      status: 'active'
    });
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        appName: 'SIPBANGED DPUPR Kab. Tegal',
        data: {
          users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
          projects: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]'),
          selectedProject: localStorage.getItem(STORAGE_KEYS.SELECTED_PROJ) || 'proj-1',
          planningDocs: JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANNING) || '[]'),
          weeklyProgressList: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '[]'),
          supervisionLogs: JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPERVISION) || '[]'),
          maintenanceIssues: JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE) || '[]'),
          contracts: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRACTS) || '[]'),
          spkContracts: JSON.parse(localStorage.getItem(STORAGE_KEYS.SPK_CONTRACTS) || '[]'),
          beritaAcara: JSON.parse(localStorage.getItem(STORAGE_KEYS.BA) || '[]'),
          payments: JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]'),
          scheduleAddendums: JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULE_ADDENDUMS) || '[]'),
        }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-sipbanged-dpupr-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showAlert('Cadangan database berhasil diunduh dalam file .json!');
    } catch (err) {
      alert('Gagal mengekspor data: ' + err);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.data) {
          alert('Format file cadangan tidak valid. Pastikan memilih file backup SIPBANGED yang sah.');
          return;
        }
        if (window.confirm('Pulihkan seluruh database dari file cadangan ini? Seluruh data proyek, progres, kontrak, dan akun akan diperbarui. Halaman akan otomatis dimuat ulang.')) {
          if (json.data.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(json.data.users));
          if (json.data.projects) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(json.data.projects));
          if (json.data.selectedProject) localStorage.setItem(STORAGE_KEYS.SELECTED_PROJ, json.data.selectedProject);
          if (json.data.planningDocs) localStorage.setItem(STORAGE_KEYS.PLANNING, JSON.stringify(json.data.planningDocs));
          if (json.data.weeklyProgressList) localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(json.data.weeklyProgressList));
          if (json.data.supervisionLogs) localStorage.setItem(STORAGE_KEYS.SUPERVISION, JSON.stringify(json.data.supervisionLogs));
          if (json.data.maintenanceIssues) localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(json.data.maintenanceIssues));
          if (json.data.contracts) localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(json.data.contracts));
          if (json.data.spkContracts) localStorage.setItem(STORAGE_KEYS.SPK_CONTRACTS, JSON.stringify(json.data.spkContracts));
          if (json.data.beritaAcara) localStorage.setItem(STORAGE_KEYS.BA, JSON.stringify(json.data.beritaAcara));
          if (json.data.payments) localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(json.data.payments));
          if (json.data.scheduleAddendums) localStorage.setItem(STORAGE_KEYS.SCHEDULE_ADDENDUMS, JSON.stringify(json.data.scheduleAddendums));
          
          window.location.reload();
        }
      } catch (err) {
        alert('Gagal membaca file cadangan: ' + err);
      }
    };
    reader.readAsText(file);
  };

  const isCloudConnected = isSupabaseConnected();

  const SQL_SCHEMA_SCRIPT = `-- SKEMA DATABASE RESMI SIPBANGED - DPUPR KABUPATEN TEGAL
-- Jalankan skrip ini di SQL Editor Supabase (Dashboard -> SQL Editor -> New Query -> Paste & Run)

CREATE TABLE IF NOT EXISTS public.sipbanged_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  agency TEXT,
  nip TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sipbanged_projects (
  id TEXT PRIMARY KEY,
  kode_paket TEXT,
  nama TEXT NOT NULL,
  tahun_anggaran INT DEFAULT 2026,
  sumber_dana TEXT,
  lokasi TEXT,
  stage TEXT DEFAULT 'perencanaan',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sipbanged_planning_docs (id TEXT PRIMARY KEY, project_id TEXT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sipbanged_weekly_progress (id TEXT PRIMARY KEY, project_id TEXT, minggu_ke INT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sipbanged_supervision (id TEXT PRIMARY KEY, project_id TEXT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sipbanged_maintenance (id TEXT PRIMARY KEY, project_id TEXT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sipbanged_contracts (id TEXT PRIMARY KEY, project_id TEXT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sipbanged_spk_contracts (id TEXT PRIMARY KEY, project_id TEXT, spk_type TEXT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sipbanged_berita_acara (id TEXT PRIMARY KEY, project_id TEXT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sipbanged_payments (id TEXT PRIMARY KEY, project_id TEXT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sipbanged_schedule_addendums (id TEXT PRIMARY KEY, project_id TEXT, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());

ALTER TABLE public.sipbanged_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_planning_docs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_weekly_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_supervision DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_spk_contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_berita_acara DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_schedule_addendums DISABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Akses Penuh Anon Users" ON public.sipbanged_users;
CREATE POLICY "Akses Penuh Anon Users" ON public.sipbanged_users FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon Projects" ON public.sipbanged_projects;
CREATE POLICY "Akses Penuh Anon Projects" ON public.sipbanged_projects FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon Contracts" ON public.sipbanged_contracts;
CREATE POLICY "Akses Penuh Anon Contracts" ON public.sipbanged_contracts FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon SPK" ON public.sipbanged_spk_contracts;
CREATE POLICY "Akses Penuh Anon SPK" ON public.sipbanged_spk_contracts FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon Planning" ON public.sipbanged_planning_docs;
CREATE POLICY "Akses Penuh Anon Planning" ON public.sipbanged_planning_docs FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon Progress" ON public.sipbanged_weekly_progress;
CREATE POLICY "Akses Penuh Anon Progress" ON public.sipbanged_weekly_progress FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon Supervision" ON public.sipbanged_supervision;
CREATE POLICY "Akses Penuh Anon Supervision" ON public.sipbanged_supervision FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon Maintenance" ON public.sipbanged_maintenance;
CREATE POLICY "Akses Penuh Anon Maintenance" ON public.sipbanged_maintenance FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon BA" ON public.sipbanged_berita_acara;
CREATE POLICY "Akses Penuh Anon BA" ON public.sipbanged_berita_acara FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon Payments" ON public.sipbanged_payments;
CREATE POLICY "Akses Penuh Anon Payments" ON public.sipbanged_payments FOR ALL TO public USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Akses Penuh Anon Addendums" ON public.sipbanged_schedule_addendums;
CREATE POLICY "Akses Penuh Anon Addendums" ON public.sipbanged_schedule_addendums FOR ALL TO public USING (true) WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingSb(true);
    setSupabaseTestStatus(null);
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    const res = await supabaseSync.testConnection();
    setIsTestingSb(false);
    setSupabaseTestStatus(res);
    if (res.success) {
      showAlert('Koneksi Supabase Cloud Database berhasil dihubungkan & disimpan!');
    }
  };

  const handleDisconnectSupabase = () => {
    if (window.confirm('Putuskan koneksi ke Supabase dan kembali ke mode Local Storage?')) {
      saveSupabaseConfig('', '');
      setSupabaseUrlInput('');
      setSupabaseKeyInput('');
      setSupabaseTestStatus(null);
      showAlert('Koneksi Supabase diputuskan. Sistem kembali ke mode lokal.');
    }
  };

  const handleSyncAllToCloud = async () => {
    if (!isCloudConnected) {
      alert('Hubungkan ke Supabase terlebih dahulu sebelum menyinkronkan data.');
      return;
    }
    setIsSyncingToCloud(true);
    const res = await supabaseSync.syncAllLocalToCloud({
      users,
      projects,
      planningDocs,
      weeklyProgress: weeklyProgressList,
      supervisionLogs,
      maintenanceIssues,
      contracts,
      spkContracts,
      beritaAcara: beritaAcaraList,
      payments,
      scheduleAddendums
    });
    setIsSyncingToCloud(false);
    showAlert(res.message);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider shadow-xs">
                <Crown className="w-3.5 h-3.5" />
                Hak Akses Khusus: MASTER ADMIN
              </span>
              <span className="text-xs text-amber-200/80 font-medium">
                Kontrol Penuh Data Akun & Identitas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              Data Akun & Profil Pengguna SIPBANGED
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Sebagai Super Admin, Anda memiliki wewenang mutlak untuk melihat, menambah, mengubah nama pejabat, NIP, instansi/jabatan, peran, kontak, hingga menonaktifkan akun di lingkungan DPUPR Kabupaten Tegal.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Akun Baru
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset seluruh data akun ke konfigurasi default DPUPR Kab. Tegal?')) {
                  resetToDefault();
                  showAlert('Data akun berhasil di-reset ke nilai default.');
                }
              }}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset akun ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {alertSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{alertSuccess}</span>
          </div>
          <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono">OK</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Akun</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{users.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Terdaftar di database</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Akun Aktif</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalActive}</div>
          <div className="text-[10px] text-emerald-600/80 mt-0.5">Dapat login & beraktivitas</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ditangguhkan</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{totalSuspended}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Akses dinonaktifkan</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Master Admin</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{totalSuperAdmin}</div>
          <div className="text-[10px] text-amber-700/80 mt-0.5">Superuser berkuasa penuh</div>
        </div>
      </div>

      {/* Database Storage & Backup Control Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isCloudConnected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-slate-900">
                  Status Database & Sinkronisasi Cloud
                </h3>
                {isCloudConnected ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Cloud Terhubung (Aktif)
                  </span>
                ) : (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                    Mode Lokal (LocalStorage Browser)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isCloudConnected 
                  ? 'Data tersimpan di PostgreSQL Supabase Cloud secara permanen dan real-time. Setiap update langsung terpusat.' 
                  : 'Data saat ini tersimpan otomatis di browser laptop Anda. Hubungkan ke Supabase Cloud agar seluruh dinas dan rekanan dapat berbagi database online.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Konfigurasi URL & Kunci API Supabase"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isCloudConnected ? 'Pengaturan Supabase' : 'Hubungkan Supabase Cloud'}</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Unduh seluruh data database dalam file .json"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh Cadangan (.json)</span>
            </button>

            <label className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Pulihkan Data (.json)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {!isCloudConnected && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-start gap-2.5">
              <Cloud className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-bold">Siap Terhubung ke Supabase:</strong> Anda dapat memasukkan <em>Project URL</em> dan <em>Anon Key</em> dari akun Supabase Anda dengan mengklik tombol <strong>Hubungkan Supabase Cloud</strong> di atas agar database menjadi permanen secara online.
              </div>
            </div>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-950 shrink-0 cursor-pointer"
            >
              Hubungkan Sekarang →
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama, NIP, email, instansi, atau peran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500 text-[11px]">Peran:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Peran ({users.length})</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {ROLE_DETAILS[r].label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="suspended">Ditangguhkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">Daftar Akun Pengguna ({filteredUsers.length})</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Klik tombol <strong>Edit</strong> untuk mengubah data identitas atau peran pengguna.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Nama Pengguna & Akun</th>
                <th className="py-3 px-4">NIP & Kontak</th>
                <th className="py-3 px-4">Instansi / Satker</th>
                <th className="py-3 px-4">Peran Otorisasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data akun yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleDetail = ROLE_DETAILS[u.role] || {
                    label: u.role,
                    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
                    deskripsi: '-'
                  };
                  const isCurrent = currentUser?.id === u.id;
                  const isMaster = u.role === 'master_admin';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isMaster 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {isMaster ? <Crown className="w-4 h-4 text-amber-600" /> : u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-mono font-semibold">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* NIP & Phone */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-mono text-slate-700 font-medium">
                          {u.nip ? (
                            <span>NIP: {u.nip}</span>
                          ) : (
                            <span className="text-slate-400 italic">Non-PNS / Rekanan</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{u.phone || '-'}</span>
                        </div>
                      </td>

                      {/* Agency */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{u.agency || 'DPUPR Kabupaten Tegal'}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${roleDetail.badgeColor}`}>
                          <ShieldCheck className="w-3 h-3" />
                          {roleDetail.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {u.status === 'active' ? (
                            <>
                              <Check className="w-3 h-3" /> Aktif
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3" /> Ditangguhkan
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingUser({ ...u })}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Edit data akun ini"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleStatusToggle(u)}
                            className={`px-2 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                              u.status === 'active'
                                ? 'text-amber-700 border-amber-200 hover:bg-amber-50'
                                : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Tangguhkan akun ini' : 'Aktifkan kembali akun ini'}
                          >
                            {u.status === 'active' ? 'Tangguhkan' : 'Aktifkan'}
                          </button>

                          {!isCurrent && !isMaster && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL: EDIT USER
          ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Edit Data Akun & Jabatan</h3>
                  <p className="text-[11px] text-slate-400">ID: {editingUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="Contoh: Ahmad Fauzi, S.T., M.Eng."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIP (Nomor Induk Pegawai)
                  </label>
                  <input
                    type="text"
                    value={editingUser.nip || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, nip: e.target.value })}
                    placeholder="Contoh: 19820719 200604 1 009"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Peran Otorisasi (Role) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 cursor-pointer"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_DETAILS[r].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Instansi / Jabatan / Satuan Kerja <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.agency}
                  onChange={(e) => setEditingUser({ ...editingUser, agency: e.target.value })}
                  placeholder="Contoh: DPUPR Kabupaten Tegal / PT Wijaya Bangun Perkasa"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Akun
                </label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as 'active' | 'suspended' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 cursor-pointer"
                >
                  <option value="active">Aktif (Dapat Login)</option>
                  <option value="suspended">Ditangguhkan (Dinonaktifkan)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW USER
          ========================================================================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Tambah Akun Pengguna Baru</h3>
                  <p className="text-[11px] text-slate-400">Didaftarkan langsung oleh Master Admin</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso, S.T."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIP (Jika ASN / Pejabat)
                  </label>
                  <input
                    type="text"
                    value={newUserData.nip}
                    onChange={(e) => setNewUserData({ ...newUserData, nip: e.target.value })}
                    placeholder="Contoh: 19850101 201001 1 002"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Peran Otorisasi (Role) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 cursor-pointer"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_DETAILS[r].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Instansi / Badan Usaha / Satuan Kerja <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUserData.agency}
                  onChange={(e) => setNewUserData({ ...newUserData, agency: e.target.value })}
                  placeholder="Contoh: DPUPR Kabupaten Tegal / PT Cipta Bangun Slawi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="email@dpupr-tegal.go.id"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SUPABASE CLOUD DATABASE CONFIGURATION
          ========================================================================= */}
      {isSupabaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Konfigurasi Cloud Database (Supabase PostgreSQL)</h3>
                  <p className="text-[11px] text-slate-400">Sinkronisasi permanen terpusat untuk seluruh pengguna & dinas</p>
                </div>
              </div>
              <button
                onClick={() => setIsSupabaseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                isCloudConnected 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <div>
                    <div className="font-bold">
                      {isCloudConnected ? 'Status: Terkoneksi ke Supabase Cloud' : 'Status: Belum Terhubung (Mode Penyimpanan Lokal)'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {isCloudConnected 
                        ? `Target URL: ${supabaseUrlInput}` 
                        : 'Masukkan URL dan Anon Key di bawah untuk menghubungkan database.'}
                    </div>
                  </div>
                </div>

                {isCloudConnected && (
                  <button
                    onClick={handleDisconnectSupabase}
                    className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Putuskan
                  </button>
                )}
              </div>

              {/* Step 1: SQL Schema */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Jalankan Skrip Tabel di SQL Editor Supabase</span>
                  </div>
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Tersalin!' : 'Salin Skrip SQL'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Buka akun Supabase Anda di <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">Supabase Dashboard</a>, pilih proyek Anda, masuk ke menu <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, lalu tempel (<em>paste</em>) dan klik <strong>Run</strong>.
                </p>
              </div>

              {/* Step 2: Credentials Form */}
              <form onSubmit={handleSaveSupabase} className="space-y-4">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Masukkan Kredensial API Proyek Supabase</span>
                </div>
                <p className="text-[11px] text-slate-500 -mt-2">
                  Dapat Anda lihat di Supabase Dashboard pada menu <strong>Project Settings &gt; API</strong>:
                </p>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Project URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://abcdefghijklm.supabase.co"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Anon / Public Key (API Key) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono resize-none"
                  />
                </div>

                {supabaseTestStatus && (
                  <div className={`p-3 rounded-xl border text-xs font-semibold ${
                    supabaseTestStatus.success 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    {supabaseTestStatus.message}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSupabaseModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={isTestingSb}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTestingSb ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Menguji Koneksi...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Tes &amp; Simpan Koneksi
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Step 3: Migration Button */}
              {isCloudConnected && (
                <div className="pt-4 border-t border-slate-200 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Sinkronisasi Data Lokal Saat Ini ke Supabase Cloud</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Klik tombol di bawah jika Anda ingin mengunggah seluruh data proyek, SPK, kontrak, dan akun pengguna yang ada di laptop ini ke database Supabase agar langsung tersedia untuk semua orang:
                  </p>
                  <button
                    onClick={handleSyncAllToCloud}
                    disabled={isSyncingToCloud}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSyncingToCloud ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Mengunggah Data ke Cloud...
                      </>
                    ) : (
                      <>
                        <Cloud className="w-3.5 h-3.5" />
                        Kirim Seluruh Data Lokal ke Supabase Sekarang
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

