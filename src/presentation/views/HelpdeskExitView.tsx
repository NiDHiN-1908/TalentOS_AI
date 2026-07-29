import React, { useState } from 'react';
import { HelpCircle, LogOut, MessageSquare, Plus, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { EnterpriseModulesService } from '../../application/services/EnterpriseModulesService';
import { HelpdeskTicket, ExitOffboarding } from '../../domain/types/enterpriseModules';

export const HelpdeskExitView: React.FC = () => {
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(EnterpriseModulesService.getTickets());
  const [exits] = useState<ExitOffboarding[]>(EnterpriseModulesService.getExitOffboardings());
  const [activeTab, setActiveTab] = useState<'helpdesk' | 'exit'>('helpdesk');

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<HelpdeskTicket['category']>('Payroll');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    EnterpriseModulesService.submitHelpdeskTicket(subject, category, 'sarah.chen@talentos.ai');
    setTickets([...EnterpriseModulesService.getTickets()]);
    setSubject('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <HelpCircle size={22} color="#06b6d4" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>HR Helpdesk & Exit Offboarding</h2>
            <span className="badge badge-purple">AI Ticket Routing & Exit Workflows</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Automated HR handbook Q&A tickets, SLA resolution tracking, and exit offboarding checklists.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('helpdesk')}
          className={activeTab === 'helpdesk' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          AI HR Helpdesk ({tickets.length})
        </button>
        <button 
          onClick={() => setActiveTab('exit')}
          className={activeTab === 'exit' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          Exit Management ({exits.length})
        </button>
      </div>

      {activeTab === 'helpdesk' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          
          {/* Tickets List */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Support Ticket Queue</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tickets.map((tck) => (
                <div key={tck.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{tck.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Submitted by {tck.submittedByEmail} • {tck.category}</div>
                    </div>
                    <span className="badge badge-amber">{tck.status}</span>
                  </div>

                  {tck.aiSuggestedAnswer && (
                    <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderLeft: '3px solid #6366f1', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1', marginTop: '8px' }}>
                      <strong style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} /> AI Auto-Resolution Recommendation:
                      </strong>
                      <div style={{ marginTop: '2px' }}>{tck.aiSuggestedAnswer}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* New Ticket Form */}
          <div className="glass-card" style={{ padding: '20px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Submit HR Inquiry</h3>
            <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Inquiry Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', color: '#fff' }}>
                  <option value="Payroll">Payroll & Taxes</option>
                  <option value="Benefits">Health Benefits</option>
                  <option value="IT Support">IT & Access</option>
                  <option value="General HR">General HR Policy</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Question / Problem</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Describe your question..." style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', color: '#fff' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px' }}>Submit Ticket</button>
            </form>
          </div>

        </div>
      )}

      {activeTab === 'exit' && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={18} color="#f43f5e" /> Active Exit Offboarding Workflows
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {exits.map((ex) => (
              <div key={ex.id} style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244,63,94,0.2)', padding: '16px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{ex.employeeName} ({ex.employeeId})</h4>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Resigned: {ex.resignationDate} • Last Day: {ex.lastWorkingDay}</div>
                  </div>
                  <span className="badge badge-rose">{ex.status}</span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '12px' }}>
                  Reason: "{ex.exitReason}" • Sentiment Score: {(ex.sentimentScore * 100).toFixed(0)}%
                </div>

                {/* Offboarding Checklist Items */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <div style={{ color: ex.assetReturned ? '#34d399' : '#fb7185' }}>
                    Asset Recovery: {ex.assetReturned ? '✓ Returned' : '✗ Pending Return'}
                  </div>
                  <div style={{ color: ex.accessRevoked ? '#34d399' : '#fb7185' }}>
                    IT Access: {ex.accessRevoked ? '✓ Revoked' : '✗ Pending Revocation'}
                  </div>
                  <div style={{ color: ex.finalSettlementPaid ? '#34d399' : '#fb7185' }}>
                    Final Settlement: {ex.finalSettlementPaid ? '✓ Disbursed' : '✗ Calculating'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
