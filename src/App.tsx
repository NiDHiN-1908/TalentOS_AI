import React, { useState } from 'react';
import './presentation/styles/designSystem.css';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import { Sidebar } from './presentation/components/Sidebar';
import { Navbar } from './presentation/components/Navbar';
import { ApprovalsDrawer } from './presentation/components/ApprovalsDrawer';
import { CommandPalette } from './presentation/components/CommandPalette';
import { RBXGuard } from './presentation/components/RBXGuard';
import { FloatingAICopilot } from './presentation/components/ai/FloatingAICopilot';

import { DashboardView } from './presentation/views/DashboardView';
import { AgentOrchestratorView } from './presentation/views/AgentOrchestratorView';
import { RecruitmentView } from './presentation/views/RecruitmentView';
import { OnboardingView } from './presentation/views/OnboardingView';
import { AttendanceLeaveView } from './presentation/views/AttendanceLeaveView';
import { PayrollView } from './presentation/views/PayrollView';
import { PerformanceView } from './presentation/views/PerformanceView';
import { LearningView } from './presentation/views/LearningView';
import { AssetsComplianceView } from './presentation/views/AssetsComplianceView';
import { HelpdeskExitView } from './presentation/views/HelpdeskExitView';
import { AnalyticsView } from './presentation/views/AnalyticsView';
import { AuthView } from './presentation/views/AuthView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'orchestrator':
        return <RBXGuard moduleId="orchestrator"><AgentOrchestratorView /></RBXGuard>;
      case 'recruitment':
        return <RBXGuard moduleId="recruitment"><RecruitmentView /></RBXGuard>;
      case 'onboarding':
        return <RBXGuard moduleId="onboarding"><OnboardingView /></RBXGuard>;
      case 'attendance_leave':
        return <RBXGuard moduleId="attendance_leave"><AttendanceLeaveView /></RBXGuard>;
      case 'payroll':
        return <RBXGuard moduleId="payroll"><PayrollView /></RBXGuard>;
      case 'performance':
        return <RBXGuard moduleId="performance"><PerformanceView /></RBXGuard>;
      case 'learning':
        return <RBXGuard moduleId="learning"><LearningView /></RBXGuard>;
      case 'assets_compliance':
        return <RBXGuard moduleId="assets_compliance"><AssetsComplianceView /></RBXGuard>;
      case 'helpdesk_exit':
        return <RBXGuard moduleId="helpdesk_exit"><HelpdeskExitView /></RBXGuard>;
      case 'analytics':
        return <RBXGuard moduleId="analytics"><AnalyticsView /></RBXGuard>;
      case 'auth':
        return <RBXGuard moduleId="auth"><AuthView /></RBXGuard>;
      default:
        return <DashboardView />;
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16' }}>
        
        {/* Enterprise Collapsible Left Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Application Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          
          {/* Top Navigation Bar */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onOpenApprovals={() => setIsApprovalsOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenAICopilot={() => setIsAICopilotOpen(!isAICopilotOpen)}
          />

          {/* Canvas Workspace Area */}
          <main style={{
            flex: 1,
            padding: '24px 32px',
            maxWidth: '1480px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}>
            {/* Active Module View Protected by RBXGuard */}
            {renderActiveView()}
          </main>

          {/* Footer */}
          <footer style={{
            padding: '16px 32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.75rem',
            color: '#64748b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>TalentOS AI — Executive AI Copilot Ecosystem (Linear/Cursor Style)</div>
            <div>Enterprise Architecture v1.0 • SOC 2 Type II Certified</div>
          </footer>
        </div>

        {/* Global Floating AI Copilot Widget (Bottom Right 56px Button & 420px Glass Panel) */}
        <FloatingAICopilot 
          activeTab={activeTab}
          isOpen={isAICopilotOpen}
          setIsOpen={setIsAICopilotOpen}
        />

        {/* Approvals Drawer */}
        <ApprovalsDrawer 
          isOpen={isApprovalsOpen} 
          onClose={() => setIsApprovalsOpen(false)} 
        />

        {/* Global Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectTab={(tab) => setActiveTab(tab)}
        />
      </div>
    </ErrorBoundary>
  );
};
