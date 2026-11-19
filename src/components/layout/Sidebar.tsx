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
  ChevronLeft,
  ChevronDown,
  X,
  Layers,
  FileCheck2
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(prev => !prev));

  const { 
    selectedProject, 
    projects, 
    setSelectedProjectId,
    contractDocType,
    setContractDocType,
    spkDocType,
    setSpkDocType
  } = useApp();

  const [isKontrakExpanded, setIsKontrakExpanded] = useState(true);
  const [isSpkSubExpanded, setIsSpkSubExpanded] = useState(true);

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

  let currentDesktopCategory = '';
  let currentMobileCategory = '';

  const handleMobileNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* =========================================
          1. DESKTOP SIDEBAR (Visible on md: and up)
         ========================================= */}
      <aside 
        className={`hidden md:flex flex-col flex-shrink-0 ${
          isCollapsed ? 'w-16 p-2' : 'w-64 p-3'
        } bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out no-print select-none`}
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

        {/* Desktop Nav List */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const showCategory = item.category && item.category !== currentDesktopCategory;
            if (showCategory && item.category) {
              currentDesktopCategory = item.category;
            }

            const isActive = activeTab === item.id;

            if (isCollapsed) {
              if (item.id === 'kontrak') {
                return (
                  <React.Fragment key={item.id}>
                    {showCategory && <div className="my-2 border-t border-slate-100" />}
                    <div className="relative group">
                      <button
                        onClick={() => {
                          setActiveTab('kontrak');
                        }}
                        className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-all relative ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                        {item.badge && !isActive && (
                          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </button>

                      {/* Floating Flyout Menu for Kontrak Modular */}
                      <div className="absolute left-full top-0 ml-2 p-2 bg-slate-900 text-white text-xs rounded-xl shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[210px] space-y-1">
                        <div className="px-2 py-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          Kontrak Modular LKPP
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('kontrak');
                            setContractDocType('perjanjian');
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between text-[11px] ${
                            isActive && contractDocType === 'perjanjian'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                            <span>Surat Perjanjian</span>
                          </div>
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">Perlem</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setActiveTab('kontrak');
                            setContractDocType('spk');
                            setSpkDocType('fisik');
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between text-[11px] ${
                            isActive && contractDocType === 'spk' && spkDocType === 'fisik'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>SPK Fisik / Konstruksi</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('kontrak');
                            setContractDocType('spk');
                            setSpkDocType('pengawas');
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between text-[11px] ${
                            isActive && contractDocType === 'spk' && spkDocType === 'pengawas'
                              ? 'bg-teal-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-400" />
                            <span>SPK Pengawas Teknis</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('kontrak');
                            setContractDocType('spk');
                            setSpkDocType('perencana');
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between text-[11px] ${
                            isActive && contractDocType === 'spk' && spkDocType === 'perencana'
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            <span>SPK Konsultan Perencana</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              }

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

                    {item.badge && !isActive && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}

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

            if (item.id === 'kontrak') {
              return (
                <React.Fragment key={item.id}>
                  {showCategory && (
                    <div className="pt-3 pb-1 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => {
                        if (!isActive) {
                          setActiveTab('kontrak');
                          setIsKontrakExpanded(true);
                        } else {
                          setIsKontrakExpanded(prev => !prev);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {isKontrakExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                        )}
                      </div>
                    </button>

                    {/* Submenu Pilihan: Surat Perjanjian & SPK */}
                    {isKontrakExpanded && (
                      <div className="ml-4 pl-2.5 border-l-2 border-emerald-300 space-y-1 mt-1 mb-2 animate-fade-in">
                        {/* 1. Surat Perjanjian */}
                        <button
                          onClick={() => {
                            setActiveTab('kontrak');
                            setContractDocType('perjanjian');
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                            isActive && contractDocType === 'perjanjian'
                              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="truncate">Surat Perjanjian</span>
                          </div>
                          <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">
                            Perlem
                          </span>
                        </button>

                        {/* 2. Surat Perintah Kerja (SPK) */}
                        <div className="space-y-0.5">
                          <button
                            onClick={() => {
                              setActiveTab('kontrak');
                              setContractDocType('spk');
                              setIsSpkSubExpanded(prev => !prev);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                              isActive && contractDocType === 'spk'
                                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-300 shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span className="truncate">Surat Perintah Kerja (SPK)</span>
                            </div>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                              3 Jenis
                            </span>
                          </button>

                          {/* 3 Sub-types of SPK */}
                          {isSpkSubExpanded && (
                            <div className="ml-3 pl-2 border-l border-slate-200 space-y-0.5 pt-0.5">
                              <button
                                onClick={() => {
                                  setActiveTab('kontrak');
                                  setContractDocType('spk');
                                  setSpkDocType('fisik');
                                }}
                                className={`w-full text-left px-2 py-1 text-[10.5px] rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isActive && contractDocType === 'spk' && spkDocType === 'fisik'
                                    ? 'text-emerald-800 font-bold bg-emerald-100/70 border border-emerald-200'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive && contractDocType === 'spk' && spkDocType === 'fisik' ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                                <span className="truncate">1. SPK Fisik / Konstruksi</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveTab('kontrak');
                                  setContractDocType('spk');
                                  setSpkDocType('pengawas');
                                }}
                                className={`w-full text-left px-2 py-1 text-[10.5px] rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isActive && contractDocType === 'spk' && spkDocType === 'pengawas'
                                    ? 'text-teal-800 font-bold bg-teal-100/70 border border-teal-200'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive && contractDocType === 'spk' && spkDocType === 'pengawas' ? 'bg-teal-600' : 'bg-slate-300'}`} />
                                <span className="truncate">2. Konsultan Pengawas</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveTab('kontrak');
                                  setContractDocType('spk');
                                  setSpkDocType('perencana');
                                }}
                                className={`w-full text-left px-2 py-1 text-[10.5px] rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isActive && contractDocType === 'spk' && spkDocType === 'perencana'
                                    ? 'text-indigo-800 font-bold bg-indigo-100/70 border border-indigo-200'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive && contractDocType === 'spk' && spkDocType === 'perencana' ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                                <span className="truncate">3. Konsultan Perencana</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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

      {/* =========================================
          2. MOBILE DRAWER (Off-canvas for < md:)
         ========================================= */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isMobileOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop Overlay */}
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-label="Tutup menu"
        />

        {/* Drawer Sliding Panel */}
        <aside 
          className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-in-out select-none ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shadow-inner">
                <Building className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    SIP<span className="text-emerald-300">BANGED</span>
                  </span>
                  <span className="text-[9px] font-bold bg-white/20 text-white px-1.5 py-0.2 rounded uppercase">
                    PBLTARU
                  </span>
                </div>
                <div className="text-[10px] text-emerald-100 font-medium leading-tight">
                  DPUPR Kab. Tegal
                </div>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Project Selector inside Mobile Drawer */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Proyek Terpilih
                </div>
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
              </div>

              {/* Dropdown to switch project directly on mobile */}
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>

              {selectedProject && (
                <>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500">Realisasi Fisik:</span>
                    <span className="font-bold text-emerald-600">
                      {selectedProject.progresFisikRealisasi}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, selectedProject.progresFisikRealisasi)}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Nav Items */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const showCategory = item.category && item.category !== currentMobileCategory;
                if (showCategory && item.category) {
                  currentMobileCategory = item.category;
                }

                const isActive = activeTab === item.id;

                if (item.id === 'kontrak') {
                  return (
                    <React.Fragment key={item.id}>
                      {showCategory && (
                        <div className="pt-3 pb-1 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.category}
                        </div>
                      )}
                      <div>
                        <button
                          onClick={() => {
                            if (!isActive) {
                              setActiveTab('kontrak');
                              setIsKontrakExpanded(true);
                            } else {
                              setIsKontrakExpanded(prev => !prev);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-sm font-bold'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                            <span className="truncate">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                            {isKontrakExpanded ? (
                              <ChevronDown className="w-4 h-4 opacity-75" />
                            ) : (
                              <ChevronRight className="w-4 h-4 opacity-75" />
                            )}
                          </div>
                        </button>

                        {/* Submenu for Mobile */}
                        {isKontrakExpanded && (
                          <div className="ml-5 pl-2.5 border-l-2 border-emerald-300 space-y-1 mt-1 mb-2">
                            <button
                              onClick={() => {
                                handleMobileNavClick('kontrak');
                                setContractDocType('perjanjian');
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                                isActive && contractDocType === 'perjanjian'
                                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                <span>Surat Perjanjian</span>
                              </div>
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">
                                Perlem
                              </span>
                            </button>

                            <div className="space-y-0.5">
                              <button
                                onClick={() => {
                                  setActiveTab('kontrak');
                                  setContractDocType('spk');
                                  setIsSpkSubExpanded(prev => !prev);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                                  isActive && contractDocType === 'spk'
                                    ? 'bg-blue-50 text-blue-800 font-bold border border-blue-300'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Surat Perintah Kerja (SPK)</span>
                                </div>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                                  3 Jenis
                                </span>
                              </button>

                              {isSpkSubExpanded && (
                                <div className="ml-4 pl-2 border-l border-slate-200 space-y-1 pt-1">
                                  <button
                                    onClick={() => {
                                      handleMobileNavClick('kontrak');
                                      setContractDocType('spk');
                                      setSpkDocType('fisik');
                                    }}
                                    className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-all flex items-center gap-2 ${
                                      isActive && contractDocType === 'spk' && spkDocType === 'fisik'
                                        ? 'text-emerald-800 font-bold bg-emerald-100/70 border border-emerald-200'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive && contractDocType === 'spk' && spkDocType === 'fisik' ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                                    <span>1. SPK Fisik / Konstruksi</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      handleMobileNavClick('kontrak');
                                      setContractDocType('spk');
                                      setSpkDocType('pengawas');
                                    }}
                                    className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-all flex items-center gap-2 ${
                                      isActive && contractDocType === 'spk' && spkDocType === 'pengawas'
                                        ? 'text-teal-800 font-bold bg-teal-100/70 border border-teal-200'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive && contractDocType === 'spk' && spkDocType === 'pengawas' ? 'bg-teal-600' : 'bg-slate-300'}`} />
                                    <span>2. Konsultan Pengawas</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      handleMobileNavClick('kontrak');
                                      setContractDocType('spk');
                                      setSpkDocType('perencana');
                                    }}
                                    className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-all flex items-center gap-2 ${
                                      isActive && contractDocType === 'spk' && spkDocType === 'perencana'
                                        ? 'text-indigo-800 font-bold bg-indigo-100/70 border border-indigo-200'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive && contractDocType === 'spk' && spkDocType === 'perencana' ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                                    <span>3. Konsultan Perencana</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
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
                      onClick={() => handleMobileNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {!item.badge && isActive && (
                        <ChevronRight className="w-4 h-4 opacity-75" />
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/70">
            <p className="text-[10px] text-slate-500 font-medium">DPUPR Kabupaten Tegal © 2026</p>
            <p className="text-[9px] text-slate-400">Perlem LKPP No. 12/2021 Compliant</p>
          </div>
        </aside>
      </div>
    </>
  );
};

