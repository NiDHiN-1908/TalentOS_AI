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
      background: 'rgba(11, 15, 25, 0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)'
        }}>
          <Bot size={20} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TalentOS <span style={{ color: '#6366f1', WebkitTextFillColor: '#6366f1' }}>AI</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: '#94a3b8' }}>
            <span className="pulsing-dot" />
            <span>Agent Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '3px', background: 'rgba(255, 255, 255, 0.03)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)', flexWrap: 'wrap' }}>
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
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} color={isActive ? '#6366f1' : '#94a3b8'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenCommandPalette}
          className="btn-secondary"
          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
        >
          <Search size={13} color="#6366f1" />
          <span>Cmd+K</span>
        </button>

        <button
          onClick={onOpenApprovals}
          className="btn-secondary"
          style={{ position: 'relative', padding: '6px 10px', fontSize: '0.75rem' }}
        >
          <ShieldAlert size={14} color={approvalsCount > 0 ? '#f43f5e' : '#94a3b8'} />
          <span>Approvals</span>
          {approvalsCount > 0 && (
            <span style={{
              background: '#f43f5e',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: '8px',
              marginLeft: '4px'
            }}>
              {approvalsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
