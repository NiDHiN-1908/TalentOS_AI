import React from 'react';
import { 
  Users, 
  Cpu, 
  CreditCard, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
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
      
      {/* Executive Overview Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.7) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-purple">Executive AI Briefing</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time Workforce Intelligence</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
              Talent Engine Operating at <span style={{ color: '#34d399' }}>98.4% Efficiency</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '680px' }}>
              Supervisor Agent has autonomously orchestrated 142 cross-domain HR workflows this week. 2 payroll anomalies detected & flagged for review. 1 employee identified with high flight risk in Design.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6366f1' }}>42</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Employees</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>$825K</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Monthly Payroll</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6366f1', marginBottom: '12px' }}>
            <Users size={24} />
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              +12% <ArrowUpRight size={14} />
            </span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2px' }}>{candidates.length}</div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Active Candidates in ATS Pipeline</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f43f5e', marginBottom: '12px' }}>
            <AlertTriangle size={24} />
            <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600 }}>Action Needed</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2px' }}>{highFlightRiskCount}</div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>High Retention / Flight Risk Alert</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '12px' }}>
            <CreditCard size={24} />
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>Audited</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2px' }}>{payroll.anomaliesCount}</div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Payroll Anomalies Flagged</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', marginBottom: '12px' }}>
            <Cpu size={24} />
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>99.9% Up</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2px' }}>6</div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Autonomous Domain Agents Online</div>
        </div>
      </div>

      {/* Main Content split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Active Employee Table Snapshot */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#6366f1" /> Key Enterprise Talent Roster
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '10px 8px' }}>Employee</th>
                <th style={{ padding: '10px 8px' }}>Department</th>
                <th style={{ padding: '10px 8px' }}>Performance</th>
                <th style={{ padding: '10px 8px' }}>Flight Risk</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={emp.avatarUrl} alt={emp.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{emp.role}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>{emp.department}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 700, color: '#34d399' }}>{emp.performanceScore} / 5.0</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={emp.flightRisk === 'High' ? 'badge badge-rose' : emp.flightRisk === 'Medium' ? 'badge badge-amber' : 'badge badge-emerald'}>
                      {emp.flightRisk} Risk
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Agent Telemetry & Log Stream */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#a855f7" /> Agent Telemetry Log
          </h3>

          <div style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto'
          }}>
            <div><span style={{ color: '#6366f1' }}>[SUPERVISOR]</span> DAG-7701 initialized for payroll & hiring.</div>
            <div><span style={{ color: '#10b981' }}>[RECRUITMENT]</span> Parsed candidate resume Dr. Aris Thorne (96% match).</div>
            <div><span style={{ color: '#f43f5e' }}>[PAYROLL_FLAG]</span> High variance detected: EMP-103 (+28% salary spike).</div>
            <div><span style={{ color: '#f59e0b' }}>[PERFORMANCE]</span> High flight risk trigger on Marcus Vance (Design).</div>
            <div><span style={{ color: '#34d399' }}>[ONBOARDING]</span> Mac Studio provisioned for Alex Rivera.</div>
          </div>
        </div>

      </div>
    </div>
  );
};
