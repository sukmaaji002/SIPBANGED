import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { ROLE_DETAILS } from '../../utils/permissions';
import { X, Users, Shield, Check, Ban, Search } from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
  const { users, updateUser, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.agency.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (user: User, newRole: UserRole) => {
    updateUser({ ...user, role: newRole });
  };

  const handleStatusToggle = (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    updateUser({ ...user, status: newStatus });
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Manajemen Pengguna & Pembatasan Akun (RBAC)</h3>
              <p className="text-xs text-slate-400">Kontrol Otorisasi Pengguna Sistem SIPBANGED DPUPR Kab. Tegal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Filter */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, email, instansi..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Filter Peran:</label>
            <select
              value={selectedRoleFilter}
              onChange={e => setSelectedRoleFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
            >
              <option value="all">Semua Peran ({users.length})</option>
              {roleOptions.map(r => (
                <option key={r} value={r}>{ROLE_DETAILS[r].label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* User Table List */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">Pengguna & Instansi</th>
                <th className="pb-3">Kontak & NIP</th>
                <th className="pb-3">Peran / Otorisasi</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const roleDetail = ROLE_DETAILS[u.role];
                const isSelf = currentUser?.id === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pr-3">
                      <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        {u.name}
                        {isSelf && (
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{u.agency}</div>
                      <div className="text-[10px] text-emerald-600 font-mono mt-0.5">{u.email}</div>
                    </td>

                    <td className="py-3 pr-3 text-slate-600">
                      <div>{u.phone}</div>
                      {u.nip && <div className="text-[10px] text-slate-400 font-mono">NIP: {u.nip}</div>}
                    </td>

                    <td className="py-3 pr-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                        disabled={isSelf}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-hidden ${roleDetail.badgeColor} cursor-pointer`}
                      >
                        {roleOptions.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_DETAILS[r].label}
                          </option>
                        ))}
                      </select>
                      <div className="text-[10px] text-slate-400 mt-1 max-w-[200px] line-clamp-1">
                        {roleDetail.deskripsi}
                      </div>
                    </td>

                    <td className="py-3 pr-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
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

                    <td className="py-3 text-right">
                      {!isSelf && (
                        <button
                          onClick={() => handleStatusToggle(u)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                            u.status === 'active'
                              ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                              : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          {u.status === 'active' ? 'Tangguhkan' : 'Aktifkan'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Perubahan hak akses tersimpan otomatis ke sistem.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

