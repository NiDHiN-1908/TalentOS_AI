import React from 'react';
import { CreditCard, AlertTriangle, ShieldCheck, CheckCircle2, DollarSign, RefreshCw } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { PayrollRun } from '../../domain/types';

export const PayrollView: React.FC = () => {
  const [payroll, setPayroll] = React.useState<PayrollRun>(hrStore.getPayrollRun());

  React.useEffect(() => {
    const update = () => setPayroll(hrStore.getPayrollRun());
    update();
    return hrStore.subscribe(update);
  }, []);

  const handleResolve = (anomalyId: string) => {
    hrStore.resolvePayrollAnomaly(anomalyId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <CreditCard size={22} color="#fbbf24" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Payroll Agent Workstation</h2>
            <span className="badge badge-amber">Compliance & Audit Engine</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Pre-payroll anomaly detection, tax compliance verification, and automated reconciliation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>${payroll.totalGross.toLocaleString()}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Period: {payroll.period} ({payroll.employeeCount} Employees)</div>
          </div>
        </div>
      </div>

      {/* Anomalies Panel */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#f43f5e" /> Flagged Payroll Anomalies ({payroll.anomalies.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {payroll.anomalies.length === 0 ? 'All anomalies resolved!' : 'Action required before disbursement'}
          </span>
        </div>

        {payroll.anomalies.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#34d399', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={32} />
            <div style={{ fontWeight: 600 }}>Payroll Audit Passed Cleanly</div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No salary variances or tax discrepancies detected in ledger.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {payroll.anomalies.map((ano) => (
              <div key={ano.id} style={{
                background: 'rgba(244, 63, 94, 0.06)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span className="badge badge-rose">{ano.severity} SEVERITY</span>
                    <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{ano.employeeName} ({ano.employeeId})</strong>
                    <span style={{ fontSize: '0.8rem', color: '#fb7185' }}>— {ano.type}</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                    {ano.description}
                  </p>
                </div>

                <button
                  onClick={() => handleResolve(ano.id)}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <CheckCircle2 size={14} /> Resolve Anomaly
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
