import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { ExecutiveSummary } from './components/dashboard/ExecutiveSummary';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectWorkspace, type ProjectPage } from './components/projects/ProjectWorkspace';
import { PlanningPhase } from './components/phases/PlanningPhase';
import { ExecutionPhase } from './components/phases/ExecutionPhase';
import { SupervisionPhase } from './components/phases/SupervisionPhase';
import { MaintenancePhase } from './components/phases/MaintenancePhase';
import { KontrakModularContainer } from './components/contracts/KontrakModularContainer';
import { BeritaAcaraList } from './components/beritaAcara/BeritaAcaraList';
import { FinanceOverview } from './components/finance/FinanceOverview';
import { RbacMatrix } from './components/auth/RbacMatrix';
import { UserAccountsPage } from './components/admin/UserAccountsPage';
import { MasterPpkPage } from './components/admin/MasterPpkPage';
import { RegisterModal } from './components/auth/RegisterModal';
import { UserManagementModal } from './components/auth/UserManagementModal';
import { 
  LayoutDashboard, 
  Building, 
  HardHat, 
  FileText, 
  Menu 
} from 'lucide-react';

interface ProjectRoute {
  projectId: string;
  page: ProjectPage;
}

function readProjectRoute(): ProjectRoute | null {
  const match = window.location.hash.match(/^#\/proyek\/([^/]+)\/(detail|kategori|perencana|fisik|pengawas)$/);
  if (!match) return null;
  try {
    return { projectId: decodeURIComponent(match[1]), page: match[2] as ProjectPage };
  } catch {
    return null;
  }
}

const MainApp: React.FC = () => {
  const { selectedProject, setSelectedProjectId } = useApp();
  const [projectRoute, setProjectRoute] = useState(readProjectRoute);
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => projectRoute ? 'projects' : 'dashboard');

  useEffect(() => {
    const restoreRoute = () => {
      const route = readProjectRoute();
      setProjectRoute(route);
      setActiveTab(route ? 'projects' : window.history.state?.sipbangedTab ?? 'dashboard');
    };
    window.addEventListener('popstate', restoreRoute);
    return () => window.removeEventListener('popstate', restoreRoute);
  }, []);

  const routeProjectId = projectRoute?.projectId;
  useEffect(() => {
    if (routeProjectId) setSelectedProjectId(routeProjectId);
  }, [routeProjectId, setSelectedProjectId]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sipbanged_sidebar_collapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sipbanged_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  const navigate = (tab: ActiveTab) => {
    if (projectRoute) {
      window.history.pushState({ sipbangedTab: tab }, '', window.location.pathname + window.location.search);
    } else {
      window.history.replaceState({ sipbangedTab: tab }, '');
    }
    setProjectRoute(null);
    setActiveTab(tab);
  };

  const openProjectPage = (projectId: string, page: ProjectPage) => {
    const hash = '#/proyek/' + encodeURIComponent(projectId) + '/' + page;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    setSelectedProjectId(projectId);
    setProjectRoute({ projectId, page });
    window.scrollTo(0, 0);
  };

  const selectProject = (projectId: string) => {
    if (projectRoute) openProjectPage(projectId, projectRoute.page);
    else setSelectedProjectId(projectId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveSummary onNavigate={navigate} />;
      case 'projects':
        return (
          <>
            <div hidden={Boolean(projectRoute)}>
              <ProjectList onOpenProject={projectId => openProjectPage(projectId, 'detail')} />
            </div>
            {projectRoute && (selectedProject?.id === projectRoute.projectId ? (
              <ProjectWorkspace
                key={selectedProject.id + ':' + projectRoute.page}
                project={selectedProject}
                page={projectRoute.page}
                onPageChange={page => page ? openProjectPage(projectRoute.projectId, page) : navigate('projects')}
              />
            ) : (
              <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-600">Proyek belum tersedia.</p>
                <button type="button" className="text-sm font-semibold text-emerald-800 hover:underline" onClick={() => navigate('projects')}>
                  Kembali ke daftar proyek
                </button>
              </div>
            ))}
          </>
        );
      case 'perencanaan':
        return <PlanningPhase />;
      case 'pelaksanaan':
        return <ExecutionPhase />;
      case 'pengawasan':
        return <SupervisionPhase />;
      case 'pemeliharaan':
        return <MaintenancePhase />;
      case 'kontrak':
        return <KontrakModularContainer />;
      case 'berita-acara':
        return <BeritaAcaraList />;
      case 'keuangan':
        return <FinanceOverview />;
      case 'master-ppk':
        return <MasterPpkPage />;
      case 'user-management':
        return <UserAccountsPage />;
      case 'rbac-matrix':
        return <RbacMatrix />;
      default:
        return <ExecutiveSummary onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar 
        onProjectSelect={selectProject}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onToggleMobileSidebar={toggleMobileSidebar}
      />

      {/* Main Layout */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={navigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 md:pb-8 min-w-0 overflow-y-auto transition-all duration-300">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Smartphones < md:) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around no-print">
        <button 
          onClick={() => navigate('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${activeTab === 'dashboard' ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-400'}`} />
          <span className="text-[10px] leading-tight">Dashboard</span>
        </button>

        <button 
          onClick={() => navigate('projects')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'projects' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className={`w-5 h-5 mb-0.5 ${activeTab === 'projects' ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-400'}`} />
          <span className="text-[10px] leading-tight">Proyek</span>
        </button>

        <button 
          onClick={() => navigate('pelaksanaan')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'pelaksanaan' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HardHat className={`w-5 h-5 mb-0.5 ${activeTab === 'pelaksanaan' ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-400'}`} />
          <span className="text-[10px] leading-tight">Kurva S</span>
        </button>

        <button 
          onClick={() => navigate('kontrak')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'kontrak' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className={`w-5 h-5 mb-0.5 ${activeTab === 'kontrak' ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-400'}`} />
          <span className="text-[10px] leading-tight">Kontrak</span>
        </button>

        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isMobileSidebarOpen ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
          <span className="text-[10px] leading-tight">Menu</span>
        </button>
      </nav>

      {/* Modals */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />

      <UserManagementModal 
        isOpen={isUserManagementOpen} 
        onClose={() => setIsUserManagementOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
