import React from 'react';
import { X, CheckCircle2, XCircle, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { ApprovalRequest } from '../../domain/types';

interface ApprovalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApprovalsDrawer: React.FC<ApprovalsDrawerProps> = ({ isOpen, onClose }) => {
  const [approvals, setApprovals] = React.useState<ApprovalRequest[]>([]);

  React.useEffect(() => {
    const update = () => setApprovals(hrStore.getApprovals());
    update();
    return hrStore.subscribe(update);
  }, []);

  if (!isOpen) return null;

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    hrStore.updateApprovalStatus(id, status);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '460px',
        maxWidth: '100%',
        height: '100%',
        background: '#0d1322',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="#f43f5e" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Human-in-the-Loop Approvals</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {approvals.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px', fontSize: '0.9rem' }}>
              No pending approval requests.
            </div>
          ) : (
            approvals.map((req) => (
              <div key={req.id} className="glass-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-rose">{req.agentType} AGENT</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>{req.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '12px', lineHeight: 1.4 }}>
                  {req.description}
                </p>

                {/* Payload details */}
                <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '14px', fontFamily: 'var(--font-mono)' }}>
                  {Object.entries(req.details).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>{k}:</span>
                      <span style={{ color: '#6366f1', fontWeight: 600 }}>{String(v)}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {req.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleAction(req.id, 'approved')}
                      className="btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
                    >
                      <CheckCircle2 size={14} /> Authorize & Execute
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'rejected')}
                      className="btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '0.82rem', borderColor: 'rgba(244,63,94,0.3)', color: '#fb7185' }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '6px', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    background: req.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                    color: req.status === 'approved' ? '#34d399' : '#fb7185'
                  }}>
                    Status: {req.status.toUpperCase()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
