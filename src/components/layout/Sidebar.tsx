import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Building, 
  FileSpreadsheet, 
  HardHat, 
  ClipboardCheck, 
  Wrench, 
  FileText, 
  Award, 
  Coins, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'projects'
  | 'perencanaan'
  | 'pelaksanaan'
  | 'pengawasan'
  | 'pemeliharaan'
  | 'kontrak'
  | 'berita-acara'
  | 'keuangan'
  | 'rbac-matrix';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, selectedProject } = useApp();

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    category?: string;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Eksekutif',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'projects',
      label: 'Daftar Paket Proyek',
      icon: <Building className="w-4 h-4" />,
      badge: '4 Paket'
    },
    // SIKLUS 4 TAHAP
    {
      id: 'perencanaan',
      label: '1. Perencanaan (DED/RAB)',
      category: 'Siklus Bangunan Gedung',
      icon: <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
    },
    {
      id: 'pelaksanaan',
      label: '2. Pelaksanaan (Kurva S)',
      icon: <HardHat className="w-4 h-4 text-amber-500" />,
      badge: selectedProject?.stage === 'pelaksanaan' ? 'Aktif' : undefined
    },
    {
      id: 'pengawasan',
      label: '3. Pengawasan Teknis',
      icon: <ClipboardCheck className="w-4 h-4 text-teal-500" />
    },
    {
      id: 'pemeliharaan',
      label: '4. Pemeliharaan & FHO',
      icon: <Wrench className="w-4 h-4 text-cyan-600" />
    },
    // DOKUMEN & KONTRAK
    {
      id: 'kontrak',
      label: 'Kontrak Modular LKPP',
      category: 'Dokumen & Administrasi',
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      badge: 'Perlem 12/21'
    },
    {
      id: 'berita-acara',
      label: 'Form Berita Acara (BA)',
      icon: <Award className="w-4 h-4 text-purple-600" />
    },
    // KEUANGAN
    {
      id: 'keuangan',
      label: 'Pengelolaan Keuangan',
      category: 'Anggaran & Kas',
      icon: <Coins className="w-4 h-4 text-emerald-600" />
    },
    // RBAC
    {
      id: 'rbac-matrix',
      label: 'Matriks Hak Akses Akun',
      category: 'Pengaturan & Keamanan',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />
    }
  ];

  let currentCategory = '';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)] p-3 no-print">
      
      {/* Current Project Brief Badge */}
      {selectedProject && (
        <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Proyek Dipilih
          </div>
          <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
            {selectedProject.nama}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
            <span className="text-slate-500 font-medium">Fisik:</span>
            <span className="font-bold text-emerald-600">
              {selectedProject.progresFisikRealisasi}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, selectedProject.progresFisikRealisasi)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const showCategory = item.category && item.category !== currentCategory;
          if (showCategory && item.category) {
            currentCategory = item.category;
          }

          const isActive = activeTab === item.id;

          return (
            <React.Fragment key={item.id}>
              {showCategory && (
                <div className="pt-3 pb-1 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.category}
                </div>
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {!item.badge && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400">
          DPUPR Kabupaten Tegal © 2026
        </p>
        <p className="text-[9px] text-slate-400">
          Perlem LKPP No. 12/2021 Compliant
        </p>
      </div>

    </aside>
  );
};

