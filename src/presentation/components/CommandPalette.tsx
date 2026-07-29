import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Cpu, Users, CreditCard, UserPlus, TrendingUp, GraduationCap, X, Terminal } from 'lucide-react';
import { OrchestratorService } from '../../application/services/OrchestratorService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNavItems = [
    { label: 'Executive Dashboard', tab: 'dashboard', icon: Cpu, desc: 'View C-Suite KPIs & Talent Health' },
    { label: 'Supervisor Engine Visualizer', tab: 'orchestrator', icon: Terminal, desc: 'Live multi-agent execution DAGs' },
    { label: 'Recruitment Agent', tab: 'recruitment', icon: Users, desc: 'AI sourcing & candidate ATS match scoring' },
    { label: 'Onboarding Agent', tab: 'onboarding', icon: UserPlus, desc: '30-day automated workflows & IT hardware' },
    { label: 'Payroll Agent', tab: 'payroll', icon: CreditCard, desc: 'Audit anomalies & compliance validation' },
    { label: 'Performance Agent', tab: 'performance', icon: TrendingUp, desc: 'Retention flight risk & 360 sentiment' },
    { label: 'Learning Agent', tab: 'learning', icon: GraduationCap, desc: 'Adaptive skill pathways' }
  ];

  const filteredNav = quickNavItems.filter(i => 
    i.label.toLowerCase().includes(query.toLowerCase()) || 
    i.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleRunCustomAgent = async () => {
    if (!query.trim()) return;
    await OrchestratorService.executeNaturalLanguageCommand(query);
    onSelectTab('orchestrator');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '100px'
    }}>
      <div className="glass-card" style={{
        width: '640px',
        maxWidth: '92%',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          gap: '12px'
        }}>
          <Search size={20} color="#6366f1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or ask Supervisor Agent... (ESC to close)"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'var(--font-main)'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
          {query.trim().length > 3 && (
            <div 
              onClick={handleRunCustomAgent}
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Sparkles size={18} color="#6366f1" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  Dispatch Agent Workflow: "{query}"
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Press Enter to let Supervisor Agent build an autonomous DAG.
                </div>
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.72rem', color: '#64748b', padding: '6px 8px', textTransform: 'uppercase', fontWeight: 700 }}>
            Domain Workstations & Navigation
          </div>

          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.tab}
                onClick={() => {
                  onSelectTab(item.tab);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="glass-card-interactive"
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={16} color="#6366f1" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
