import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Project, 
  PlanningDocument, 
  WeeklyProgress, 
  SupervisionLog, 
  MaintenanceIssue, 
  ProjectContract, 
  BeritaAcara, 
  PaymentTerm,
  ScheduleAddendum,
  ContractDocType,
  SpkType,
  SpkContract,
  MasterPpk
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_PLANNING_DOCS, 
  INITIAL_PROGRESS, 
  INITIAL_SUPERVISION_LOGS, 
  INITIAL_MAINTENANCE_ISSUES, 
  INITIAL_CONTRACTS, 
  INITIAL_BERITA_ACARA, 
  INITIAL_PAYMENTS,
  INITIAL_SCHEDULE_ADDENDUMS,
  INITIAL_MASTER_PPK
} from '../data/initialData';
import { DEFAULT_LKPP_CLAUSES } from '../data/lkppClauses';
import { generateInitialSpkContracts, createDefaultSpkForProject, DEFAULT_SPK_FISIK_CLAUSES } from '../data/spkData';
import { supabaseSync } from '../lib/supabaseSync';
import { isSupabaseConnected } from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string) => boolean;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  registerUser: (newUser: Omit<User, 'id' | 'status'>) => void;
  
  users: User[];
  updateUser: (user: User) => void;
  addUser: (newUser: Omit<User, 'id'>) => User;
  deleteUser: (id: string) => void;
  
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedProject: Project | undefined;
  addProject: (p: Project) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  
  // Phase 1: Perencanaan
  planningDocs: PlanningDocument[];
  addPlanningDoc: (doc: PlanningDocument) => void;
  updatePlanningDoc: (doc: PlanningDocument) => void;
  
  // Phase 2: Pelaksanaan
  weeklyProgressList: WeeklyProgress[];
  addWeeklyProgress: (prog: WeeklyProgress) => void;
  updateWeeklyProgress: (prog: WeeklyProgress) => void;
  deleteWeeklyProgress: (id: string) => void;
  scheduleAddendums: ScheduleAddendum[];
  addScheduleAddendum: (addendum: ScheduleAddendum) => void;
  updateScheduleAddendum: (addendum: ScheduleAddendum) => void;
  deleteScheduleAddendum: (id: string) => void;
  setActiveScheduleAddendum: (projectId: string, addendumId: string) => void;
  
  // Phase 3: Pengawasan
  supervisionLogs: SupervisionLog[];
  addSupervisionLog: (log: SupervisionLog) => void;
  
  // Phase 4: Pemeliharaan
  maintenanceIssues: MaintenanceIssue[];
  addMaintenanceIssue: (issue: MaintenanceIssue) => void;
  updateMaintenanceIssue: (issue: MaintenanceIssue) => void;
  
  // Kontrak & Berita Acara
  contracts: ProjectContract[];
  updateContract: (c: ProjectContract) => void;
  getContractByProject: (projectId: string) => ProjectContract | undefined;
  
  // SPK Modular
  contractDocType: ContractDocType;
  setContractDocType: (type: ContractDocType) => void;
  spkDocType: SpkType;
  setSpkDocType: (type: SpkType) => void;
  spkContracts: SpkContract[];
  updateSpkContract: (spk: SpkContract) => void;
  getSpkContractByProjectAndType: (projectId: string, type: SpkType) => SpkContract | undefined;
  
  beritaAcaraList: BeritaAcara[];
  addBeritaAcara: (ba: BeritaAcara) => void;
  updateBeritaAcara: (ba: BeritaAcara) => void;
  deleteBeritaAcara: (id: string) => void;
  
  // Keuangan
  payments: PaymentTerm[];
  addPayment: (pay: PaymentTerm) => void;
  updatePayment: (pay: PaymentTerm) => void;
  deletePayment: (id: string) => void;

  // Master Data PPK (Eksklusif Super Admin)
  masterPpkList: MasterPpk[];
  addMasterPpk: (ppk: Omit<MasterPpk, 'id'>) => MasterPpk;
  updateMasterPpk: (ppk: MasterPpk) => void;
  deleteMasterPpk: (id: string) => void;
  
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const STORAGE_KEYS = {
  CURRENT_USER: 'sipbanged_current_user',
  USERS: 'sipbanged_users',
  PROJECTS: 'sipbanged_projects',
  SELECTED_PROJ: 'sipbanged_selected_proj',
  PLANNING: 'sipbanged_planning_docs',
  PROGRESS: 'sipbanged_progress',
  SUPERVISION: 'sipbanged_supervision',
  MAINTENANCE: 'sipbanged_maintenance',
  CONTRACTS: 'sipbanged_contracts',
  SPK_CONTRACTS: 'sipbanged_spk_contracts',
  BA: 'sipbanged_berita_acara',
  PAYMENTS: 'sipbanged_payments',
  SCHEDULE_ADDENDUMS: 'sipbanged_schedule_addendums',
  MASTER_PPK: 'sipbanged_master_ppk',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!saved) return INITIAL_USERS;
    try {
      const parsed: User[] = JSON.parse(saved);
      // Pastikan semua peran bawaan (terutama master_admin) ada di list akun
      const missingUsers = INITIAL_USERS.filter(
        initUser => !parsed.some(p => p.role === initUser.role)
      );
      if (missingUsers.length > 0) {
        const merged = [...missingUsers, ...parsed];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        const parsed: User = JSON.parse(saved);
        if (parsed && parsed.role) return parsed;
      } catch {
        // ignore
      }
    }
    // Default aktif ke Master Admin (Super Admin)
    return INITIAL_USERS.find(u => u.role === 'master_admin') || INITIAL_USERS[0];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_PROJ);
    return saved || 'proj-1';
  });

  const [planningDocs, setPlanningDocs] = useState<PlanningDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANNING);
    return saved ? JSON.parse(saved) : INITIAL_PLANNING_DOCS;
  });

  const [weeklyProgressList, setWeeklyProgressList] = useState<WeeklyProgress[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });

  const [supervisionLogs, setSupervisionLogs] = useState<SupervisionLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPERVISION);
    return saved ? JSON.parse(saved) : INITIAL_SUPERVISION_LOGS;
  });

  const [maintenanceIssues, setMaintenanceIssues] = useState<MaintenanceIssue[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_ISSUES;
  });

  const [contracts, setContracts] = useState<ProjectContract[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTRACTS);
    if (!saved) return INITIAL_CONTRACTS;
    try {
      const parsed: ProjectContract[] = JSON.parse(saved);
      return parsed.map((c) => {
        const hasKonsiderans = (c.clauses || []).some(cl => cl.id === 'sp-konsiderans');
        const hasPremis = (c.clauses || []).some(cl => cl.id === 'sp-premis');
        const ssukCount = (c.clauses || []).filter(cl => cl.kategori === 'SSUK (Syarat Umum)').length;
        if (!hasKonsiderans || !hasPremis || ssukCount < 79) {
          const customMap = new Map((c.clauses || []).filter(cl => cl.kontenCustom).map(cl => [cl.id, cl.kontenCustom]));
          const activeMap = new Map((c.clauses || []).map(cl => [cl.id, cl.isActive]));
          const updatedClauses = DEFAULT_LKPP_CLAUSES.map(clause => ({
            ...clause,
            kontenCustom: customMap.get(clause.id) ?? clause.kontenCustom,
            isActive: activeMap.has(clause.id) ? (activeMap.get(clause.id) ?? true) : true
          }));
          return { ...c, clauses: updatedClauses, metodePemilihan: c.metodePemilihan || 'E-Purchasing' };
        }
        return { ...c, metodePemilihan: c.metodePemilihan || 'E-Purchasing' };
      });
    } catch {
      return INITIAL_CONTRACTS;
    }
  });

  const [beritaAcaraList, setBeritaAcaraList] = useState<BeritaAcara[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BA);
    return saved ? JSON.parse(saved) : INITIAL_BERITA_ACARA;
  });

  const [payments, setPayments] = useState<PaymentTerm[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [scheduleAddendums, setScheduleAddendums] = useState<ScheduleAddendum[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE_ADDENDUMS);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_ADDENDUMS;
  });

  const [contractDocType, setContractDocType] = useState<ContractDocType>('perjanjian');
  const [spkDocType, setSpkDocType] = useState<SpkType>('fisik');

  const [spkContracts, setSpkContracts] = useState<SpkContract[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPK_CONTRACTS);
    if (!saved) return generateInitialSpkContracts(INITIAL_PROJECTS);
    try {
      const parsed: SpkContract[] = JSON.parse(saved);
      let wasMigrated = false;
      const migrated = parsed.map((s) => {
        if (s.spkType === 'fisik') {
          const currentCount = (s.clauses || []).length;
          const totalLines = (s.clauses || []).reduce((acc, c) => acc + (c.isi ? c.isi.split('\n').length : 0), 0);
          const hasOldPasal3 = (s.clauses || []).some(cl => cl.id === 'spk-fsk-3' && cl.isi && cl.isi.includes('1) menawarkan'));
          // If clauses are fewer than 31, or total lines are fewer than 230, or has outdated Pasal 3 numbering
          if (currentCount < 31 || totalLines < 230 || hasOldPasal3) {
            wasMigrated = true;
            const activeMap = new Map((s.clauses || []).map(cl => [cl.id, cl.isActive]));
            const customMap = new Map((s.clauses || []).filter(cl => cl.isi).map(cl => [cl.id, cl.isi]));
            const updatedClauses = DEFAULT_SPK_FISIK_CLAUSES.map(defaultClause => {
              const existingText = customMap.get(defaultClause.id);
              const isOutdated = !existingText || existingText.split('\n').length < defaultClause.isi.split('\n').length || (defaultClause.id === 'spk-fsk-3' && hasOldPasal3);
              return {
                ...defaultClause,
                isi: isOutdated ? defaultClause.isi : (existingText || defaultClause.isi),
                isActive: activeMap.has(defaultClause.id) ? (activeMap.get(defaultClause.id) ?? true) : true
              };
            });
            return { ...s, clauses: updatedClauses };
          }
        }
        return s;
      });

      if (wasMigrated) {
        try {
          localStorage.setItem(STORAGE_KEYS.SPK_CONTRACTS, JSON.stringify(migrated));
        } catch (e) {
          console.error('Failed to save migrated spkContracts', e);
        }
      }
      return migrated;
    } catch {
      return generateInitialSpkContracts(INITIAL_PROJECTS);
    }
  });

  const [masterPpkList, setMasterPpkList] = useState<MasterPpk[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTER_PPK);
    if (!saved) return INITIAL_MASTER_PPK;
    try {
      const parsed: MasterPpk[] = JSON.parse(saved);
      const missing = INITIAL_MASTER_PPK.filter(initPpk => !parsed.some(p => p.id === initPpk.id));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(STORAGE_KEYS.MASTER_PPK, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return INITIAL_MASTER_PPK;
    }
  });

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PROJ, selectedProjectId);
  }, [selectedProjectId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANNING, JSON.stringify(planningDocs));
  }, [planningDocs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(weeklyProgressList));
    } catch (err) {
      console.warn('LocalStorage quota reached for progress data:', err);
    }
  }, [weeklyProgressList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPERVISION, JSON.stringify(supervisionLogs));
  }, [supervisionLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceIssues));
  }, [maintenanceIssues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPK_CONTRACTS, JSON.stringify(spkContracts));
  }, [spkContracts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BA, JSON.stringify(beritaAcaraList));
  }, [beritaAcaraList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE_ADDENDUMS, JSON.stringify(scheduleAddendums));
  }, [scheduleAddendums]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTER_PPK, JSON.stringify(masterPpkList));
  }, [masterPpkList]);

  // Supabase Cloud Initial Sync
  useEffect(() => {
    if (!isSupabaseConnected()) return;

    const syncFromSupabase = async () => {
      try {
        const [cloudUsers, cloudProjects, cloudContracts, cloudSpk, cloudBeritaAcara] = await Promise.all([
          supabaseSync.fetchUsers(),
          supabaseSync.fetchProjects(),
          supabaseSync.fetchContracts(),
          supabaseSync.fetchSpkContracts(),
          supabaseSync.fetchBeritaAcara(),
        ]);

        if (cloudUsers && cloudUsers.length > 0) setUsers(cloudUsers);
        if (cloudProjects && cloudProjects.length > 0) setProjects(cloudProjects);
        if (cloudContracts && cloudContracts.length > 0) setContracts(cloudContracts);
        if (cloudSpk && cloudSpk.length > 0) setSpkContracts(cloudSpk);
        if (cloudBeritaAcara) {
          setBeritaAcaraList(local => {
            const localIds = new Set(local.map(ba => ba.id));
            return [...cloudBeritaAcara.filter(ba => ba?.spkType && !localIds.has(ba.id)), ...local];
          });
        }
      } catch (err) {
        console.warn('Initial Supabase sync notice:', err);
      }
    };

    syncFromSupabase();
  }, []);

  // Auth Functions
  const login = (email: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const quickLogin = (role: UserRole) => {
    let user = users.find(u => u.role === role);
    if (!user) {
      const fallback = INITIAL_USERS.find(u => u.role === role);
      if (fallback) {
        user = fallback;
        setUsers(prev => [fallback, ...prev.filter(u => u.id !== fallback.id)]);
      }
    }
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = (newUser: Omit<User, 'id' | 'status'>) => {
    const id = `user-${Date.now()}`;
    // Jika admin mendaftarkan atau user baru, set status active (atau pending bila perlu diverifikasi)
    const created: User = {
      ...newUser,
      id,
      status: 'active'
    };
    setUsers(prev => [...prev, created]);
    setCurrentUser(created);
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
    }
    supabaseSync.upsertUser(updated);
  };

  const addUser = (newUser: Omit<User, 'id'>): User => {
    const id = `user-${Date.now()}`;
    const created: User = {
      ...newUser,
      id
    };
    setUsers(prev => [...prev, created]);
    supabaseSync.upsertUser(created);
    return created;
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    supabaseSync.deleteUser(id);
  };

  // Projects
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const addProject = (p: Project) => {
    setProjects(prev => [p, ...prev]);
    setSelectedProjectId(p.id);
    supabaseSync.upsertProject(p);
  };

  const updateProject = (p: Project) => {
    setProjects(prev => prev.map(item => item.id === p.id ? p : item));
    supabaseSync.upsertProject(p);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProjectId === id && projects.length > 1) {
      const remaining = projects.filter(p => p.id !== id);
      setSelectedProjectId(remaining[0].id);
    }
    supabaseSync.deleteProject(id);
  };

  // Phase 1: Planning
  const addPlanningDoc = (doc: PlanningDocument) => {
    setPlanningDocs(prev => [doc, ...prev]);
  };

  const updatePlanningDoc = (doc: PlanningDocument) => {
    setPlanningDocs(prev => prev.map(d => d.id === doc.id ? doc : d));
  };

  // Phase 2: Progress
  const addWeeklyProgress = (prog: WeeklyProgress) => {
    setWeeklyProgressList(prev => [prog, ...prev]);
    // Auto update project physical progress
    setProjects(prev => prev.map(p => {
      if (p.id === prog.projectId) {
        return {
          ...p,
          progresFisikRealisasi: prog.kumulatifRealisasi,
          progresFisikRencana: prog.kumulatifRencana
        };
      }
      return p;
    }));
    supabaseSync.upsertWeeklyProgress(prog);
  };

  const updateWeeklyProgress = (prog: WeeklyProgress) => {
    setWeeklyProgressList(prev => prev.map(p => p.id === prog.id ? prog : p));
    setProjects(prev => prev.map(p => {
      if (p.id === prog.projectId) {
        return {
          ...p,
          progresFisikRealisasi: prog.kumulatifRealisasi,
          progresFisikRencana: prog.kumulatifRencana
        };
      }
      return p;
    }));
    supabaseSync.upsertWeeklyProgress(prog);
  };

  const deleteWeeklyProgress = (id: string) => {
    setWeeklyProgressList(prev => prev.filter(p => p.id !== id));
  };

  // Kurva S Addendums
  const addScheduleAddendum = (addendum: ScheduleAddendum) => {
    setScheduleAddendums(prev => {
      const updated = addendum.isAktif 
        ? prev.map(a => a.projectId === addendum.projectId ? { ...a, isAktif: false } : a)
        : prev;
      return [...updated, addendum];
    });
  };

  const updateScheduleAddendum = (addendum: ScheduleAddendum) => {
    setScheduleAddendums(prev => {
      const updated = addendum.isAktif
        ? prev.map(a => (a.projectId === addendum.projectId && a.id !== addendum.id) ? { ...a, isAktif: false } : a)
        : prev;
      return updated.map(a => a.id === addendum.id ? addendum : a);
    });
  };

  const deleteScheduleAddendum = (id: string) => {
    setScheduleAddendums(prev => prev.filter(a => a.id !== id));
  };

  const setActiveScheduleAddendum = (projectId: string, addendumId: string) => {
    setScheduleAddendums(prev => prev.map(a => {
      if (a.projectId === projectId) {
        return { ...a, isAktif: a.id === addendumId };
      }
      return a;
    }));
  };

  // Phase 3: Supervision
  const addSupervisionLog = (log: SupervisionLog) => {
    setSupervisionLogs(prev => [log, ...prev]);
  };

  // Phase 4: Maintenance
  const addMaintenanceIssue = (issue: MaintenanceIssue) => {
    setMaintenanceIssues(prev => [issue, ...prev]);
  };

  const updateMaintenanceIssue = (issue: MaintenanceIssue) => {
    setMaintenanceIssues(prev => prev.map(m => m.id === issue.id ? issue : m));
  };

  // Contracts
  const updateContract = (c: ProjectContract) => {
    setContracts(prev => {
      const exists = prev.some(item => item.id === c.id);
      if (exists) {
        return prev.map(item => item.id === c.id ? c : item);
      }
      return [c, ...prev];
    });
    supabaseSync.upsertContract(c);
  };

  const getContractByProject = (projectId: string) => {
    return contracts.find(c => c.projectId === projectId);
  };

  // SPK Modular
  const updateSpkContract = (spk: SpkContract) => {
    setSpkContracts(prev => {
      const idx = prev.findIndex(s => s.projectId === spk.projectId && s.spkType === spk.spkType);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = spk;
        return copy;
      }
      return [...prev, spk];
    });
    supabaseSync.upsertSpkContract(spk);
  };

  const getSpkContractByProjectAndType = (projectId: string, type: SpkType) => {
    return spkContracts.find(s => s.projectId === projectId && s.spkType === type);
  };

  // Berita Acara
  const addBeritaAcara = (ba: BeritaAcara) => {
    setBeritaAcaraList(prev => [ba, ...prev]);
    if (ba.spkType) void supabaseSync.upsertBeritaAcara(ba);
  };

  const updateBeritaAcara = (ba: BeritaAcara) => {
    setBeritaAcaraList(prev => prev.map(item => item.id === ba.id ? ba : item));
    if (ba.spkType) void supabaseSync.upsertBeritaAcara(ba);
  };

  const deleteBeritaAcara = (id: string) => {
    const ba = beritaAcaraList.find(item => item.id === id);
    setBeritaAcaraList(prev => prev.filter(item => item.id !== id));
    if (ba?.spkType) void supabaseSync.deleteBeritaAcara(ba);
  };

  // Finance
  const addPayment = (pay: PaymentTerm) => {
    setPayments(prev => [pay, ...prev]);
  };

  const updatePayment = (pay: PaymentTerm) => {
    setPayments(prev => prev.map(item => item.id === pay.id ? pay : item));
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(item => item.id !== id));
  };

  // Master PPK (Eksklusif Super Admin)
  const addMasterPpk = (newPpk: Omit<MasterPpk, 'id'>): MasterPpk => {
    const id = `ppk-${Date.now()}`;
    const created: MasterPpk = { ...newPpk, id };
    setMasterPpkList(prev => [created, ...prev]);
    return created;
  };

  const updateMasterPpk = (updated: MasterPpk) => {
    setMasterPpkList(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteMasterPpk = (id: string) => {
    setMasterPpkList(prev => prev.filter(p => p.id !== id));
  };

  const resetToDefault = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS.find(u => u.role === 'master_admin') || INITIAL_USERS[0]);
    setProjects(INITIAL_PROJECTS);
    setSelectedProjectId('proj-1');
    setPlanningDocs(INITIAL_PLANNING_DOCS);
    setWeeklyProgressList(INITIAL_PROGRESS);
    setSupervisionLogs(INITIAL_SUPERVISION_LOGS);
    setMaintenanceIssues(INITIAL_MAINTENANCE_ISSUES);
    setContracts(INITIAL_CONTRACTS);
    setSpkContracts(generateInitialSpkContracts(INITIAL_PROJECTS));
    setContractDocType('perjanjian');
    setSpkDocType('fisik');
    setBeritaAcaraList(INITIAL_BERITA_ACARA);
    setPayments(INITIAL_PAYMENTS);
    setScheduleAddendums(INITIAL_SCHEDULE_ADDENDUMS);
    setMasterPpkList(INITIAL_MASTER_PPK);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      login,
      quickLogin,
      logout,
      registerUser,
      users,
      updateUser,
      addUser,
      deleteUser,
      projects,
      selectedProjectId,
      setSelectedProjectId,
      selectedProject,
      addProject,
      updateProject,
      deleteProject,
      planningDocs,
      addPlanningDoc,
      updatePlanningDoc,
      weeklyProgressList,
      addWeeklyProgress,
      updateWeeklyProgress,
      deleteWeeklyProgress,
      scheduleAddendums,
      addScheduleAddendum,
      updateScheduleAddendum,
      deleteScheduleAddendum,
      setActiveScheduleAddendum,
      supervisionLogs,
      addSupervisionLog,
      maintenanceIssues,
      addMaintenanceIssue,
      updateMaintenanceIssue,
      contracts,
      updateContract,
      getContractByProject,
      contractDocType,
      setContractDocType,
      spkDocType,
      setSpkDocType,
      spkContracts,
      updateSpkContract,
      getSpkContractByProjectAndType,
      beritaAcaraList,
      addBeritaAcara,
      updateBeritaAcara,
      deleteBeritaAcara,
      payments,
      addPayment,
      updatePayment,
      deletePayment,
      masterPpkList,
      addMasterPpk,
      updateMasterPpk,
      deleteMasterPpk,
      resetToDefault
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

