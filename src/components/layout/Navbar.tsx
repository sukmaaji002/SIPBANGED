import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_DETAILS } from '../../utils/permissions';
import { UserRole } from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  LogOut, 
  ChevronDown, 
  Layers, 
  RefreshCw,
  UserPlus
} from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenUserManagement: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenRegister, 
  onOpenUserManagement 
}) => {
  const { 
    currentUser, 
    quickLogin, 
    logout, 
    projects, 
    selectedProjectId, 
    setSelectedProjectId,
    resetToDefault
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const selectedProj = projects.find(p => p.id === selectedProjectId);
  const currentRoleDetail = currentUser ? ROLE_DETAILS[currentUser.role] : null;

  const roleOptions: UserRole[] = [
    'admin',
    'kabid',
    'ppk',
    'kontraktor',
    'pengawas',
    'perencana',
    'keuangan'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  SIP<span className="text-emerald-600">BANGED</span>
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                  PBLTARU
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Penyelenggaraan Bangunan Gedung • DPUPR Kab. Tegal
              </p>
            </div>
          </div>

          {/* Project Quick Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-all max-w-[280px]"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate text-left font-semibold">
                {selectedProj?.nama || 'Pilih Proyek Gedung'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0 ml-auto" />
            </button>

            {showProjectDropdown && (
              <div 
                className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-left"
                onMouseLeave={() => setShowProjectDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Pilih Proyek Aktif
                </div>
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-start gap-2.5 transition-colors ${
                      proj.id === selectedProjectId ? 'bg-emerald-50/70 text-emerald-800 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                    <div className="truncate">
                      <div className="truncate">{proj.nama}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {proj.sumberDana} • {proj.tahunAnggaran}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action: Role Simulator & User Profile */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Role Switcher (Simulasi Pembatasan Akun) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  currentRoleDetail ? currentRoleDetail.badgeColor : 'bg-slate-100 text-slate-700'
                }`}
                title="Klik untuk mensimulasikan login sebagai peran/pengguna lain"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Peran Aktif:</span>
                <span>{currentRoleDetail?.label || 'Belum Login'}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {showRoleDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-50 text-left"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Ganti Peran Akun (RBAC Demo)
                  </div>
                  <p className="px-2 py-1 text-[11px] text-slate-400">
                    Sistem membatasi hak akses setiap peran secara ketat.
                  </p>
                  <div className="space-y-1">
                    {roleOptions.map((roleKey) => {
                      const item = ROLE_DETAILS[roleKey];
                      const isCurrent = currentUser?.role === roleKey;
                      return (
                        <button
                          key={roleKey}
                          onClick={() => {
                            quickLogin(roleKey);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            isCurrent ? 'bg-slate-900 text-white font-medium' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{item.label}</div>
                            <div className={`text-[10px] truncate max-w-[200px] ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>
                              {item.deskripsi}
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-mono">
                              Aktif
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Management Button (if role admin) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenUserManagement}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                title="Kelola Daftar Pengguna & Hak Akses"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Kelola User</span>
              </button>
            )}

            {/* Register New Account Button */}
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shadow-2xs"
              title="Daftar Akun Baru dengan Email"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Daftar Akun</span>
            </button>

            {/* Reset Data to Default */}
            <button
              onClick={() => {
                if (window.confirm('Reset semua data kembali ke default awal DPUPR Kab. Tegal?')) {
                  resetToDefault();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset Data Demo"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* User Logout or Info */}
            {currentUser && (
              <div className="flex items-center pl-2 border-l border-slate-200 gap-2">
                <div className="text-right hidden xl:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                    {currentUser.agency}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

