import React from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CreditCard, 
  TrendingUp, 
  GraduationCap, 
  Cpu,
  Lock,
  Clock,
  Laptop,
  HelpCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { authStore } from '../../infrastructure/store/authStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed 
}) => {
  const [persona, setPersona] = React.useState(authStore.getCurrentPersona());

  React.useEffect(() => {
    const update = () => setPersona(authStore.getCurrentPersona());
    update();
    return authStore.subscribe(update);
  }, []);

  const allGroups = [
    {
      title: 'OPERATING SYSTEM',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Executive BI Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'TALENT & ATS',
      items: [
        { id: 'recruitment', label: 'Recruitment & ATS', icon: Users },
        { id: 'onboarding', label: 'Employee Onboarding', icon: UserPlus }
      ]
    },
    {
      title: 'WORKFORCE & PAYROLL',
      items: [
        { id: 'attendance_leave', label: 'Attendance & Leave', icon: Clock },
        { id: 'payroll', label: 'Global Payroll', icon: CreditCard },
        { id: 'performance', label: 'Performance & OKRs', icon: TrendingUp }
      ]
    },
    {
      title: 'ENTERPRISE OPERATIONS',
      items: [
        { id: 'learning', label: 'Enterprise Learning', icon: GraduationCap },
        { id: 'assets_compliance', label: 'Assets & Compliance', icon: Laptop },
        { id: 'helpdesk_exit', label: 'Helpdesk & Exit', icon: HelpCircle },
        { id: 'orchestrator', label: 'Agent Telemetry & DAGs', icon: Cpu },
        { id: 'auth', label: 'Security & Identity', icon: Lock }
      ]
    }
  ];

  // Dynamically filter navigation groups based on authorized permissions for current persona
  const filteredGroups = allGroups.map(group => ({
    ...group,
    items: group.items.filter(item => authStore.canAccessModule(item.id))
  })).filter(group => group.items.length > 0);

  return (
    <aside style={{
      width: collapsed ? '64px' : '240px',
      height: '100vh',
      backgroundColor: '#090d16',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 110,
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        height: '56px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={16} color="#000" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>
              TalentOS <span style={{ color: '#10b981' }}>AI</span>
            </span>
          </div>
        )}

        {collapsed && (
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={18} color="#000" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'color 0.15s ease'
          }}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Grouped Dynamic Navigation Links */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: collapsed ? '12px 6px' : '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {filteredGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {!collapsed && (
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                paddingLeft: '8px'
              }}>
                {group.title}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: collapsed ? '10px' : '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isActive ? 'rgba(16, 185, 129, 0.14)' : 'transparent',
                      color: isActive ? '#10b981' : '#94a3b8',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} color={isActive ? '#10b981' : '#94a3b8'} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Active Persona Info */}
      {!collapsed && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.72rem',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 600 }}>{persona.name}</div>
            <div>{persona.role}</div>
          </div>
          <span className="badge badge-indigo" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>Active RBX</span>
        </div>
      )}
    </aside>
  );
};
