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
  SpkContract
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
  INITIAL_SCHEDULE_ADDENDUMS 
} from '../data/initialData';
import { DEFAULT_LKPP_CLAUSES } from '../data/lkppClauses';
import { generateInitialSpkContracts, createDefaultSpkForProject } from '../data/spkData';

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
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) return JSON.parse(saved);
    // Default logged in as PPK (can switch anytime)
    return INITIAL_USERS.find(u => u.role === 'ppk') || INITIAL_USERS[0];
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
      return JSON.parse(saved);
    } catch {
      return generateInitialSpkContracts(INITIAL_PROJECTS);
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
    const user = users.find(u => u.role === role);
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
  };

  const addUser = (newUser: Omit<User, 'id'>): User => {
    const id = `user-${Date.now()}`;
    const created: User = {
      ...newUser,
      id
    };
    setUsers(prev => [...prev, created]);
    return created;
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Projects
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const addProject = (p: Project) => {
    setProjects(prev => [p, ...prev]);
    setSelectedProjectId(p.id);
  };

  const updateProject = (p: Project) => {
    setProjects(prev => prev.map(item => item.id === p.id ? p : item));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProjectId === id && projects.length > 1) {
      const remaining = projects.filter(p => p.id !== id);
      setSelectedProjectId(remaining[0].id);
    }
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
  };

  const getSpkContractByProjectAndType = (projectId: string, type: SpkType) => {
    return spkContracts.find(s => s.projectId === projectId && s.spkType === type);
  };

  // Berita Acara
  const addBeritaAcara = (ba: BeritaAcara) => {
    setBeritaAcaraList(prev => [ba, ...prev]);
  };

  const updateBeritaAcara = (ba: BeritaAcara) => {
    setBeritaAcaraList(prev => prev.map(item => item.id === ba.id ? ba : item));
  };

  const deleteBeritaAcara = (id: string) => {
    setBeritaAcaraList(prev => prev.filter(item => item.id !== id));
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

  const resetToDefault = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS.find(u => u.role === 'ppk') || INITIAL_USERS[0]);
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

