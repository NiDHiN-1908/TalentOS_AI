import React from 'react';
import { 
  ShieldAlert, 
  Search,
  Sparkles,
  ChevronRight,
  UserCheck,
  Sun,
  Moon
} from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { authStore } from '../../infrastructure/store/authStore';
import { SystemRole } from '../../domain/types/rbac';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApprovals: () => void;
  onOpenCommandPalette: () => void;
  onOpenAICopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenApprovals, 
  onOpenCommandPalette,
  onOpenAICopilot
}) => {
  const [approvalsCount, setApprovalsCount] = React.useState(0);
  const [currentPersona, setCurrentPersona] = React.useState(authStore.getCurrentPersona());
  const [isLightMode, setIsLightMode] = React.useState(false);

  React.useEffect(() => {
    const updateStore = () => setApprovalsCount(hrStore.getApprovals().filter(a => a.status === 'pending').length);
    const updateAuth = () => setCurrentPersona(authStore.getCurrentPersona());

    updateStore();
    updateAuth();

    const unsubStore = hrStore.subscribe(updateStore);
    const unsubAuth = authStore.subscribe(updateAuth);

    return () => {
      unsubStore();
      unsubAuth();
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isLightMode;
    setIsLightMode(nextTheme);
    if (nextTheme) {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as SystemRole;
    authStore.setPersonaByRole(newRole);
    if (!authStore.canAccessModule(activeTab)) {
      setActiveTab('dashboard');
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Executive Dashboard';
      case 'orchestrator': return 'Supervisor AI Core';
      case 'recruitment': return 'Recruitment & ATS Workstation';
      case 'onboarding': return 'Employee Onboarding Engine';
      case 'attendance_leave': return 'Attendance & Leave Intelligence';
      case 'payroll': return 'Global Payroll Intelligence';
      case 'performance': return 'Performance Management & OKRs';
      case 'learning': return 'Enterprise Learning Intelligence';
      case 'assets_compliance': return 'Asset Management & GRC';
      case 'helpdesk_exit': return 'Helpdesk & Offboarding';
      case 'analytics': return 'Workforce BI Analytics';
      case 'auth': return 'Security & Identity Systems';
      default: return 'Dashboard';
    }
  };

  return (
    <header style={{
      height: '56px',
      padding: '0 24px',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Breadcrumb Trail */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Acme Corp</span>
        <ChevronRight size={14} color="var(--text-muted)" />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{getTabTitle(activeTab)}</span>
      </div>

      {/* Right Controls & Persona Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Dynamic Persona / Role Switcher */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          backgroundColor: 'var(--bg-canvas)', 
          border: '1px solid var(--border-subtle)', 
          padding: '4px 10px', 
          borderRadius: 'var(--radius-sm)' 
        }}>
          <UserCheck size={14} color="var(--accent-emerald)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>RBX Persona:</span>
          <select 
            value={currentPersona.role}
            onChange={handleRoleChange}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--accent-emerald)',
              fontWeight: 700,
              fontSize: '0.78rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="HR_MANAGER" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>HR Manager (Elena Rostova)</option>
            <option value="RECRUITER" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>Recruiter (Sarah Chen)</option>
            <option value="PAYROLL_MANAGER" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>Payroll Manager (Marcus Vance)</option>
            <option value="EMPLOYEE" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>Employee (Alex Rivera)</option>
            <option value="EXECUTIVE" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>Executive (David Sterling)</option>
            <option value="PLATFORM_ADMIN" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>Platform Admin (System)</option>
          </select>
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn-ghost"
          style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)' }}
          title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {isLightMode ? <Moon size={15} color="var(--text-secondary)" /> : <Sun size={15} color="var(--text-secondary)" />}
        </button>

        <button
          onClick={onOpenAICopilot}
          className="btn-primary"
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
        >
          <Sparkles size={14} />
          <span>⚡ AI Copilot</span>
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
        >
          <Search size={13} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-muted)' }}>Search</span>
          <span style={{ background: 'var(--border-subtle)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>⌘K</span>
        </button>

        <button
          onClick={onOpenApprovals}
          className="btn-secondary"
          style={{ position: 'relative', padding: '6px 12px', fontSize: '0.75rem' }}
        >
          <ShieldAlert size={14} color={approvalsCount > 0 ? 'var(--accent-rose)' : 'var(--text-secondary)'} />
          <span>Approvals</span>
          {approvalsCount > 0 && (
            <span style={{
              background: 'var(--accent-rose)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)'
            }}>
              {approvalsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
