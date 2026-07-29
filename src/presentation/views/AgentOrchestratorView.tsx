import React from 'react';
import { Cpu, CheckCircle2, Clock, Terminal, ShieldAlert, DollarSign, Activity, Lock } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { AuditService } from '../../application/services/AuditService';
import { AgentExecutionDAG, AgentExecutionStep, AuditLog } from '../../domain/types';

export const AgentOrchestratorView: React.FC = () => {
  const [activeDAG, setActiveDAG] = React.useState<AgentExecutionDAG | null>(null);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);

  React.useEffect(() => {
    const update = () => {
      setActiveDAG(hrStore.getActiveDAG());
      setAuditLogs(AuditService.getLogs(hrStore.getTenantId()));
    };
    update();
    return hrStore.subscribe(update);
  }, []);

  const agentBadges: Record<string, string> = {
    SUPERVISOR: 'badge-purple',
    RECRUITMENT: 'badge-blue',
    ONBOARDING: 'badge-emerald',
    PAYROLL: 'badge-amber',
    PERFORMANCE: 'badge-rose',
    LEARNING: 'badge-emerald',
    EXECUTIVE_AI: 'badge-purple'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Info */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Cpu size={22} color="#6366f1" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Supervisor Agent DAG Orchestrator</h2>
            {activeDAG && (
              <span className={activeDAG.status === 'completed' ? 'badge badge-emerald' : 'badge badge-purple'}>
                {activeDAG.status.toUpperCase()}
              </span>
            )}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {activeDAG ? `Goal Prompt: "${activeDAG.goalPrompt}"` : 'No active execution DAG. Input a command in the AI Command Hub above.'}
          </p>
        </div>

        {activeDAG && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: '10px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>{activeDAG.totalTokens}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Tokens Used</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: '10px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a855f7' }}>${activeDAG.totalCostUsd}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Run Cost</div>
            </div>
          </div>
        )}
      </div>

      {/* DAG Node Graph Visualizer */}
      {!activeDAG ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
          <Activity size={36} color="#6366f1" style={{ marginBottom: '12px', opacity: 0.6 }} />
          <h3>No Execution DAG Currently Active</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
            Try dispatching an intent using the prompt bar above. (e.g., "Audit payroll & source AI researchers")
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          
          {/* Node Execution Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeDAG.steps.map((step, idx) => {
              const isCurrent = activeDAG.currentStepIndex === idx && activeDAG.status === 'in_progress';
              const isDone = step.status === 'completed';

              return (
                <div 
                  key={step.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '18px 20px',
                    borderColor: isCurrent ? 'var(--primary)' : isDone ? 'rgba(16,185,129,0.3)' : 'var(--border-glass)',
                    boxShadow: isCurrent ? '0 0 20px rgba(99,102,241,0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge ${agentBadges[step.agentType] || 'badge-purple'}`}>
                        {step.agentType}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{step.action}</h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {step.durationMs && (
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                          {step.durationMs}ms
                        </span>
                      )}
                      {isDone && <CheckCircle2 size={18} color="#34d399" />}
                      {isCurrent && <span className="pulsing-dot" />}
                    </div>
                  </div>

                  {/* Thought process trace */}
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '10px', lineHeight: 1.4 }}>
                    <strong style={{ color: '#cbd5e1' }}>Agent Reasoning:</strong> {step.thought}
                  </div>

                  {/* Tool Call details */}
                  {step.toolCalls && step.toolCalls.length > 0 && (
                    <div style={{ 
                      background: 'rgba(0, 0, 0, 0.4)', 
                      borderRadius: '8px', 
                      padding: '10px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      marginBottom: '8px'
                    }}>
                      <div style={{ color: '#a855f7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Terminal size={12} /> Invoked Tool: {step.toolCalls[0].toolName}
                      </div>
                      <div style={{ color: '#64748b' }}>
                        Args: {JSON.stringify(step.toolCalls[0].arguments)}
                      </div>
                    </div>
                  )}

                  {/* Step output */}
                  {step.output && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#34d399', 
                      background: 'rgba(16, 185, 129, 0.08)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      borderLeft: '3px solid #10b981'
                    }}>
                      {step.output}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Execution Telemetry Panel */}
          <div className="glass-card" style={{ padding: '20px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#6366f1" /> Execution Telemetry
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Tenant ID</span>
                <span style={{ fontWeight: 700, color: '#6366f1' }}>{activeDAG.tenantId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Total Steps</span>
                <span style={{ fontWeight: 700 }}>{activeDAG.steps.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Completed Steps</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>
                  {activeDAG.steps.filter(s => s.status === 'completed').length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Guardrail Check</span>
                <span style={{ fontWeight: 600, color: '#34d399' }}>Passed Cleanly</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Audit Log Stream */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={16} color="#a855f7" /> SOC2 Immutable Audit Stream
        </h3>

        <div style={{
          maxHeight: '160px',
          overflowY: 'auto',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '8px',
          padding: '10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.74rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {auditLogs.slice(0, 10).map((log) => (
            <div key={log.id} style={{ display: 'flex', gap: '10px', color: '#94a3b8' }}>
              <span style={{ color: '#64748b' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span style={{ color: '#6366f1', fontWeight: 600 }}>[{log.actor}]</span>
              <span style={{ color: '#fff' }}>{log.action}</span>
              <span>— {log.details}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
