import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { ExecutiveSummary } from './components/dashboard/ExecutiveSummary';
import { ProjectList } from './components/projects/ProjectList';
import { PlanningPhase } from './components/phases/PlanningPhase';
import { ExecutionPhase } from './components/phases/ExecutionPhase';
import { SupervisionPhase } from './components/phases/SupervisionPhase';
import { MaintenancePhase } from './components/phases/MaintenancePhase';
import { ContractBuilder } from './components/contracts/ContractBuilder';
import { BeritaAcaraList } from './components/beritaAcara/BeritaAcaraList';
import { FinanceOverview } from './components/finance/FinanceOverview';
import { RbacMatrix } from './components/auth/RbacMatrix';
import { RegisterModal } from './components/auth/RegisterModal';
import { UserManagementModal } from './components/auth/UserManagementModal';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sipbanged_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sipbanged_sidebar_collapsed', String(next));
      return next;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveSummary onNavigate={setActiveTab} />;
      case 'projects':
        return <ProjectList onNavigate={setActiveTab} />;
      case 'perencanaan':
        return <PlanningPhase />;
      case 'pelaksanaan':
        return <ExecutionPhase />;
      case 'pengawasan':
        return <SupervisionPhase />;
      case 'pemeliharaan':
        return <MaintenancePhase />;
      case 'kontrak':
        return <ContractBuilder />;
      case 'berita-acara':
        return <BeritaAcaraList />;
      case 'keuangan':
        return <FinanceOverview />;
      case 'rbac-matrix':
        return <RbacMatrix />;
      default:
        return <ExecutiveSummary onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar 
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenUserManagement={() => setIsUserManagementOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Layout */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto transition-all duration-300">
          {renderContent()}
        </main>
      </div>

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
