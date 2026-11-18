import React, { useState } from 'react';
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
  ChevronRight,
  ChevronLeft
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  isCollapsed: controlledCollapsed,
  onToggleCollapse
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(prev => !prev));

  const { selectedProject } = useApp();

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
      icon: <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
    },
    {
      id: 'projects',
      label: 'Daftar Paket Proyek',
      icon: <Building className="w-4 h-4 flex-shrink-0" />,
      badge: '4 Paket'
    },
    // SIKLUS 4 TAHAP
    {
      id: 'perencanaan',
      label: '1. Perencanaan (DED/RAB)',
      category: 'Siklus Bangunan Gedung',
      icon: <FileSpreadsheet className="w-4 h-4 flex-shrink-0 text-indigo-500" />
    },
    {
      id: 'pelaksanaan',
      label: '2. Pelaksanaan (Kurva S)',
      icon: <HardHat className="w-4 h-4 flex-shrink-0 text-amber-500" />,
      badge: selectedProject?.stage === 'pelaksanaan' ? 'Aktif' : undefined
    },
    {
      id: 'pengawasan',
      label: '3. Pengawasan Teknis',
      icon: <ClipboardCheck className="w-4 h-4 flex-shrink-0 text-teal-500" />
    },
    {
      id: 'pemeliharaan',
      label: '4. Pemeliharaan & FHO',
      icon: <Wrench className="w-4 h-4 flex-shrink-0 text-cyan-600" />
    },
    // DOKUMEN & KONTRAK
    {
      id: 'kontrak',
      label: 'Kontrak Modular LKPP',
      category: 'Dokumen & Administrasi',
      icon: <FileText className="w-4 h-4 flex-shrink-0 text-blue-600" />,
      badge: 'Perlem 12/21'
    },
    {
      id: 'berita-acara',
      label: 'Form Berita Acara (BA)',
      icon: <Award className="w-4 h-4 flex-shrink-0 text-purple-600" />
    },
    // KEUANGAN
    {
      id: 'keuangan',
      label: 'Pengelolaan Keuangan',
      category: 'Anggaran & Kas',
      icon: <Coins className="w-4 h-4 flex-shrink-0 text-emerald-600" />
    },
    // RBAC
    {
      id: 'rbac-matrix',
      label: 'Matriks Hak Akses Akun',
      category: 'Pengaturan & Keamanan',
      icon: <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-500" />
    }
  ];

  let currentCategory = '';

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-16 p-2' : 'w-64 p-3'
      } bg-white border-r border-slate-200 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out no-print select-none`}
    >
      {/* Top Header Toggle Button */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} pb-2 mb-2 border-b border-slate-100`}>
        {!isCollapsed && (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Navigasi
          </span>
        )}
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Perbesar Menu (Expand)" : "Perkecil Menu (Collapse)"}
          className={`flex items-center gap-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ${
            isCollapsed ? 'p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50' : 'px-2 py-1 text-[11px] font-medium'
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <span>Perkecil</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
      
      {/* Current Project Brief Badge */}
      {selectedProject && (
        isCollapsed ? (
          <div 
            className="mb-3 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center cursor-pointer group relative hover:border-emerald-300 transition-colors"
            title={`Proyek: ${selectedProject.nama} (Fisik: ${selectedProject.progresFisikRealisasi}%)`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 mb-1 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600">
              {selectedProject.progresFisikRealisasi}%
            </span>

            {/* Floating Tooltip */}
            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Proyek Dipilih</div>
              <div className="font-semibold text-slate-100 max-w-[200px] truncate">{selectedProject.nama}</div>
              <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400">Realisasi Fisik:</span>
                <span className="font-bold text-emerald-400">{selectedProject.progresFisikRealisasi}%</span>
              </div>
            </div>
          </div>
        ) : (
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
        )
      )}

      {/* Nav List */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const showCategory = item.category && item.category !== currentCategory;
          if (showCategory && item.category) {
            currentCategory = item.category;
          }

          const isActive = activeTab === item.id;

          if (isCollapsed) {
            return (
              <React.Fragment key={item.id}>
                {showCategory && <div className="my-2 border-t border-slate-100" />}
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-all relative group ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>

                  {/* Badge indicator dot if badge exists and not active */}
                  {item.badge && !isActive && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}

                  {/* Floating tooltip */}
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </React.Fragment>
            );
          }

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
      <div className={`border-t border-slate-100 text-center ${isCollapsed ? 'pt-3' : 'pt-4'}`}>
        {isCollapsed ? (
          <div title="DPUPR Kab. Tegal • LKPP Compliant" className="cursor-help">
            <p className="text-[9px] font-bold text-slate-400">©2026</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] text-slate-400">
              DPUPR Kabupaten Tegal © 2026
            </p>
            <p className="text-[9px] text-slate-400">
              Perlem LKPP No. 12/2021 Compliant
            </p>
          </>
        )}
      </div>

    </aside>
  );
};

