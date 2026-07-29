import React, { useState } from 'react';
import './presentation/styles/designSystem.css';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import { Navbar } from './presentation/components/Navbar';
import { CommandHub } from './presentation/components/CommandHub';
import { ApprovalsDrawer } from './presentation/components/ApprovalsDrawer';
import { CommandPalette } from './presentation/components/CommandPalette';

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
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleCommandTriggered = () => {
    setActiveTab('orchestrator');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'orchestrator':
        return <AgentOrchestratorView />;
      case 'recruitment':
        return <RecruitmentView />;
      case 'onboarding':
        return <OnboardingView />;
      case 'attendance_leave':
        return <AttendanceLeaveView />;
      case 'payroll':
        return <PayrollView />;
      case 'performance':
        return <PerformanceView />;
      case 'learning':
        return <LearningView />;
      case 'assets_compliance':
        return <AssetsComplianceView />;
      case 'helpdesk_exit':
        return <HelpdeskExitView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'auth':
        return <AuthView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header Navigation */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenApprovals={() => setIsApprovalsOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Main Container */}
        <main style={{ flex: 1, padding: '20px 24px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          
          {/* Top Autonomous Command Bar */}
          <CommandHub onCommandTriggered={handleCommandTriggered} />

          {/* Dynamic View Render */}
          {renderActiveView()}
        </main>

        {/* Human In The Loop Approval Modal Drawer */}
        <ApprovalsDrawer 
          isOpen={isApprovalsOpen} 
          onClose={() => setIsApprovalsOpen(false)} 
        />

        {/* Global Command Palette (Cmd+K) */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* Footer */}
        <footer style={{
          padding: '16px 24px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          TalentOS AI — Autonomous Agentic HR Operating System • Enterprise Clean Architecture v1.0
        </footer>

      </div>
    </ErrorBoundary>
  );
};
