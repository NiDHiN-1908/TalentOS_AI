import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Maximize2, 
  Minimize2, 
  Send, 
  Terminal, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  FileText,
  UserCheck
} from 'lucide-react';
import { authStore } from '../../../infrastructure/store/authStore';
import { OrchestratorService } from '../../../application/services/OrchestratorService';

interface FloatingAICopilotProps {
  activeTab: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const FloatingAICopilot: React.FC<FloatingAICopilotProps> = ({
  activeTab,
  isOpen,
  setIsOpen
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [persona, setPersona] = useState(authStore.getCurrentPersona());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'agent';
    text: string;
    reasoning?: string;
    toolCall?: { name: string; args: any };
    actionCard?: { title: string; desc: string; actionText: string };
  }>>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: `Hello ${authStore.getCurrentPersona().name}! I am your TalentOS AI Executive Copilot. Operating under ${authStore.getCurrentPersona().role} permissions. How can I assist your workforce today?`
    }
  ]);

  useEffect(() => {
    const updateAuth = () => setPersona(authStore.getCurrentPersona());
    updateAuth();
    const unsub = authStore.subscribe(updateAuth);
    return () => unsub();
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K / ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPills = [
    { label: 'Audit Payroll', prompt: 'Audit July payroll for salary anomalies' },
    { label: 'Create Job', prompt: 'Create new job requisition for Lead AI Engineer' },
    { label: 'Approve Leave', prompt: 'Approve pending leave requests' },
    { label: 'Find Candidates', prompt: 'Source top candidates matching AI Research' },
    { label: 'Analyse Performance', prompt: 'Analyze performance scores & flight risk' }
  ];

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isStreaming) return;

    const userMsgId = `usr-${Date.now()}`;
    const agentMsgId = `ag-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: promptText }
    ]);

    setInputPrompt('');
    setIsStreaming(true);

    // Permission Check
    const lower = promptText.toLowerCase();
    if ((lower.includes('salary') || lower.includes('ceo')) && persona.role === 'EMPLOYEE') {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: agentMsgId,
            sender: 'agent',
            text: '⛔ Access Denied: You do not have authorization to query executive compensation or peer salary metrics.'
          }
        ]);
        setIsStreaming(false);
      }, 400);
      return;
    }

    // Dispatch Autonomous Multi-Agent DAG via OrchestratorService
    await OrchestratorService.executeNaturalLanguageCommand(promptText);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: agentMsgId,
          sender: 'agent',
          text: `Autonomous multi-agent DAG executed successfully for prompt: "${promptText}". Scope: ${persona.role} on Module: ${activeTab.toUpperCase()}.`,
          reasoning: `Supervisor Agent analyzed telemetry on ${activeTab}. Evaluated zero-trust guardrails. Invoked domain tools with 100% compliance.`,
          toolCall: { name: `${activeTab}_audit_tool`, args: { tenant_id: persona.tenantId, role: persona.role } },
          actionCard: {
            title: '⚡ Autonomous Action Ready',
            desc: 'Multi-agent review complete. All compliance checks passed.',
            actionText: 'Execute Action & Notify Team'
          }
        }
      ]);
      setIsStreaming(false);
    }, 800);
  };

  const getModuleLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'orchestrator': return 'Supervisor AI';
      case 'recruitment': return 'Recruitment';
      case 'payroll': return 'Payroll';
      case 'performance': return 'Performance';
      case 'analytics': return 'Analytics';
      default: return tab.toUpperCase();
    }
  };

  return (
    <>
      {/* Floating Circular AI Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4), 0 0 12px rgba(16, 185, 129, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          title="AI Copilot (⌘K)"
        >
          <div style={{ position: 'relative' }}>
            <Sparkles size={24} color="#000" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#fff'
            }} />
          </div>
        </button>
      )}

      {/* Floating AI Copilot Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: isExpanded ? '640px' : '420px',
          height: isExpanded ? '85vh' : '75vh',
          maxHeight: '720px',
          backgroundColor: 'rgba(17, 23, 38, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'rgba(9, 13, 22, 0.9)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={16} color="#000" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>AI Copilot</span>
                  <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>● Online</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  Context: <strong style={{ color: '#94a3b8' }}>{getModuleLabel(activeTab)}</strong> • Scope: <strong style={{ color: '#10b981' }}>{persona.role}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                title={isExpanded ? "Collapse View" : "Expand View"}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                title="Close (ESC)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Action Pills */}
          <div style={{
            padding: '8px 14px',
            backgroundColor: '#090d16',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {quickPills.map((pill, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendPrompt(pill.prompt)}
                disabled={isStreaming}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Conversation Stream */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((m) => (
              <div 
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '3px' }}>
                  {m.sender === 'user' ? 'You' : 'TalentOS AI Agent'}
                </div>

                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  maxWidth: '88%',
                  lineHeight: 1.5,
                  backgroundColor: m.sender === 'user' 
                    ? '#10b981' 
                    : m.text.includes('Access Denied') 
                      ? 'rgba(244, 63, 94, 0.15)' 
                      : '#111726',
                  color: m.sender === 'user' ? '#000' : m.text.includes('Access Denied') ? '#f43f5e' : '#f8fafc',
                  border: m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  fontWeight: m.sender === 'user' ? 600 : 400
                }}>
                  {m.text}

                  {/* Agent Reasoning */}
                  {m.reasoning && (
                    <div style={{
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.74rem',
                      color: '#94a3b8'
                    }}>
                      <strong style={{ color: '#10b981' }}>Reasoning:</strong> {m.reasoning}
                    </div>
                  )}

                  {/* Tool Call details */}
                  {m.toolCall && (
                    <div style={{
                      marginTop: '8px',
                      backgroundColor: '#090d16',
                      padding: '8px',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      color: '#10b981'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Terminal size={12} /> Invoked Tool: {m.toolCall.name}
                      </div>
                    </div>
                  )}

                  {/* Interactive Action Card */}
                  {m.actionCard && (
                    <div style={{
                      marginTop: '10px',
                      backgroundColor: '#090d16',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '8px',
                      padding: '10px'
                    }}>
                      <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.78rem' }}>{m.actionCard.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '3px 0 8px 0' }}>{m.actionCard.desc}</div>
                      <button 
                        onClick={() => alert(`Executed action for persona ${persona.role}`)}
                        className="btn-primary" 
                        style={{ width: '100%', padding: '4px 8px', fontSize: '0.72rem', justifyContent: 'center' }}
                      >
                        {m.actionCard.actionText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> Agent Reasoning & Dispatching...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#090d16',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(inputPrompt);
              }}
              style={{ display: 'flex', gap: '8px' }}
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Ask TalentOS AI (${persona.role} Scope)...`}
                style={{
                  flex: 1,
                  backgroundColor: '#111726',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isStreaming}
                className="btn-primary"
                style={{ padding: '8px 12px' }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
