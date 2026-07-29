import React from 'react';
import { 
  Users, 
  Cpu, 
  CreditCard, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle 
} from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';

export const DashboardView: React.FC = () => {
  const [employees] = React.useState(hrStore.getEmployees());
  const [candidates] = React.useState(hrStore.getCandidates());
  const [payroll] = React.useState(hrStore.getPayrollRun());

  const highFlightRiskCount = employees.filter(e => e.flightRisk === 'High').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Executive Overview Header */}
      <div style={{
        padding: '20px 24px',
        backgroundColor: '#111726',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">Executive AI Briefing</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time Telemetry</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
            Talent Engine Operating at <span style={{ color: '#10b981' }}>98.4% Efficiency</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px', margin: 0, maxWidth: '640px' }}>
            Supervisor Agent orchestrated 142 cross-domain HR workflows this week. 2 payroll anomalies flagged for review. 1 high retention risk identified.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>42</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Employees</div>
          </div>
          <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>$825K</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Payroll Spend</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS PIPELINE</span>
            <span className="badge badge-success">+12% <ArrowUpRight size={12} /></span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{candidates.length}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Active Candidates</div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>RETENTION RISK</span>
            <span className="badge badge-warning">Action Needed</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{highFlightRiskCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>High Flight Risk Alert</div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PAYROLL AUDIT</span>
            <span className="badge badge-warning">Audited</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{payroll.anomaliesCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Anomalies Flagged</div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI AGENTS</span>
            <span className="badge badge-success">99.9% Up</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>6</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Active Agents Online</div>
        </div>
      </div>

      {/* Main Content split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Active Employee Table Snapshot */}
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#10b981" /> Key Enterprise Talent Roster
          </h3>

          <table className="table-container">
            <thead className="table-header">
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Performance</th>
                <th>Flight Risk</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="table-row">
                  <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={emp.avatarUrl} alt={emp.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{emp.role}</div>
                    </div>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{emp.department}</td>
                  <td style={{ fontWeight: 600, color: '#10b981' }}>{emp.performanceScore} / 5.0</td>
                  <td>
                    <span className={emp.flightRisk === 'High' ? 'badge badge-warning' : 'badge badge-success'}>
                      {emp.flightRisk} Risk
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Agent Telemetry & Log Stream */}
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#10b981" /> Agent Telemetry Stream
          </h3>

          <div style={{
            flex: 1,
            backgroundColor: '#090d16',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            padding: '12px',
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto'
          }}>
            <div><span style={{ color: '#10b981' }}>[SUPERVISOR]</span> DAG-7701 initialized for payroll & hiring.</div>
            <div><span style={{ color: '#94a3b8' }}>[RECRUITMENT]</span> Parsed candidate resume Dr. Aris Thorne (96% match).</div>
            <div><span style={{ color: '#f59e0b' }}>[PAYROLL_FLAG]</span> High variance detected: EMP-103 (+28% salary spike).</div>
            <div><span style={{ color: '#f59e0b' }}>[PERFORMANCE]</span> High flight risk trigger on Marcus Vance (Design).</div>
            <div><span style={{ color: '#10b981' }}>[ONBOARDING]</span> Mac Studio provisioned for Alex Rivera.</div>
          </div>
        </div>

      </div>
    </div>
  );
};
