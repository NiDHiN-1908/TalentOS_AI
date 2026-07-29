import React from 'react';
import { 
  ShieldAlert, 
  Search,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { authStore } from '../../infrastructure/store/authStore';
import { SystemRole } from '../../domain/types/rbac';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApprovals: () => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenApprovals, 
  onOpenCommandPalette 
}) => {
  const [approvalsCount, setApprovalsCount] = React.useState(0);
  const [currentPersona, setCurrentPersona] = React.useState(authStore.getCurrentPersona());

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

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as SystemRole;
    authStore.setPersonaByRole(newRole);
    // If current tab is now forbidden for new role, default to dashboard
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
      backgroundColor: '#111726',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Breadcrumb Trail */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
        <span style={{ color: '#64748b' }}>Acme Corp</span>
        <ChevronRight size={14} color="#64748b" />
        <span style={{ color: '#f8fafc', fontWeight: 600 }}>{getTabTitle(activeTab)}</span>
      </div>

      {/* Right Controls & Persona Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Dynamic Persona / Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '4px 10px', borderRadius: '6px' }}>
          <UserCheck size={14} color="#10b981" />
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>RBX Persona:</span>
          <select 
            value={currentPersona.role}
            onChange={handleRoleChange}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#10b981',
              fontWeight: 700,
              fontSize: '0.78rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="HR_MANAGER" style={{ backgroundColor: '#090d16', color: '#fff' }}>HR Manager (Elena Rostova)</option>
            <option value="RECRUITER" style={{ backgroundColor: '#090d16', color: '#fff' }}>Recruiter (Sarah Chen)</option>
            <option value="PAYROLL_MANAGER" style={{ backgroundColor: '#090d16', color: '#fff' }}>Payroll Manager (Marcus Vance)</option>
            <option value="EMPLOYEE" style={{ backgroundColor: '#090d16', color: '#fff' }}>Employee (Alex Rivera)</option>
            <option value="EXECUTIVE" style={{ backgroundColor: '#090d16', color: '#fff' }}>Executive (David Sterling)</option>
            <option value="PLATFORM_ADMIN" style={{ backgroundColor: '#090d16', color: '#fff' }}>Platform Admin (System)</option>
          </select>
        </div>

        <button
          onClick={() => setActiveTab('orchestrator')}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.75rem', backgroundColor: '#10b981', color: '#000' }}
        >
          <Sparkles size={14} />
          <span>⚡ AI Autonomy Center</span>
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.75rem' }}
        >
          <Search size={13} color="#94a3b8" />
          <span style={{ color: '#64748b' }}>Search</span>
          <span style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.68rem', color: '#94a3b8' }}>⌘K</span>
        </button>

        <button
          onClick={onOpenApprovals}
          className="btn-secondary"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.75rem' }}
        >
          <ShieldAlert size={14} color={approvalsCount > 0 ? '#f43f5e' : '#94a3b8'} />
          <span>Approvals</span>
          {approvalsCount > 0 && (
            <span style={{
              background: '#f43f5e',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '9999px'
            }}>
              {approvalsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
