import React from 'react';
import { CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { PayrollRun } from '../../domain/types';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';

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
      
      {/* Page Header */}
      <PageHeader 
        title="Global Payroll Intelligence Workstation"
        subtitle="Pre-payroll anomaly detection, tax compliance verification, and automated reconciliation engine."
        icon={<CreditCard size={22} color="var(--accent-amber)" />}
        badgeText="Compliance & Audit Engine"
        badgeVariant="amber"
        actions={
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              ${payroll.totalGross.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Period: {payroll.period} ({payroll.employeeCount} Employees)
            </div>
          </div>
        }
      />

      {/* Anomalies Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', margin: 0 }}>
            <AlertTriangle size={18} color="var(--accent-rose)" /> Flagged Payroll Anomalies ({payroll.anomalies.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {payroll.anomalies.length === 0 ? 'All anomalies resolved!' : 'Action required before disbursement'}
          </span>
        </div>

        {payroll.anomalies.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--accent-emerald)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={32} />
            <div style={{ fontWeight: 600 }}>Payroll Audit Passed Cleanly</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No salary variances or tax discrepancies detected in ledger.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {payroll.anomalies.map((ano) => (
              <div key={ano.id} style={{
                background: 'var(--accent-rose-subtle)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <Badge variant="rose">{ano.severity} SEVERITY</Badge>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{ano.employeeName} ({ano.employeeId})</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose)' }}>— {ano.type}</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                    {ano.description}
                  </p>
                </div>

                <button
                  onClick={() => handleResolve(ano.id)}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
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
