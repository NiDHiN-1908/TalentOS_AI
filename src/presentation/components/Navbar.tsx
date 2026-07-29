import React from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CreditCard, 
  TrendingUp, 
  GraduationCap, 
  ShieldAlert, 
  Cpu,
  Search,
  Lock,
  Clock,
  Laptop,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApprovals: () => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenApprovals, onOpenCommandPalette }) => {
  const [approvalsCount, setApprovalsCount] = React.useState(0);

  React.useEffect(() => {
    const update = () => {
      const pending = hrStore.getApprovals().filter(a => a.status === 'pending');
      setApprovalsCount(pending.length);
    };
    update();
    return hrStore.subscribe(update);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orchestrator', label: 'Supervisor', icon: Cpu },
    { id: 'recruitment', label: 'Recruitment', icon: Users },
    { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
    { id: 'attendance_leave', label: 'Attendance & Leave', icon: Clock },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'learning', label: 'Learning', icon: GraduationCap },
    { id: 'assets_compliance', label: 'Assets & Compliance', icon: Laptop },
    { id: 'helpdesk_exit', label: 'Helpdesk & Exit', icon: HelpCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'auth', label: 'Auth', icon: Lock }
  ];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: 'rgba(9, 13, 22, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Workspace Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
          }}>
            <Bot size={18} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              TalentOS <span style={{ color: '#10b981' }}>AI</span>
            </h1>
          </div>
        </div>

        <div style={{ height: '20px', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
          <span>Acme Corp</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>Production</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '2px', background: 'rgba(255, 255, 255, 0.02)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', flexWrap: 'wrap' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: isActive ? '#10b981' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} color={isActive ? '#10b981' : '#94a3b8'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
