import React from 'react';
import { Users, Sparkles, ArrowUpRight } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Employee } from '../../domain/types';

export const DashboardView: React.FC = () => {
  const [employees] = React.useState(hrStore.getEmployees());
  const [candidates] = React.useState(hrStore.getCandidates());
  const [payroll] = React.useState(hrStore.getPayrollRun());

  const highFlightRiskCount = employees.filter(e => e.flightRisk === 'High').length;

  const employeeColumns: Column<Employee>[] = [
    {
      header: 'Employee',
      accessor: (emp) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={emp.avatarUrl} alt={emp.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{emp.role}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: (emp) => <span style={{ color: 'var(--text-secondary)' }}>{emp.department}</span>
    },
    {
      header: 'Performance',
      accessor: (emp) => <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>{emp.performanceScore} / 5.0</span>
    },
    {
      header: 'Flight Risk',
      accessor: (emp) => (
        <Badge variant={emp.flightRisk === 'High' ? 'amber' : 'emerald'}>
          {emp.flightRisk} Risk
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <PageHeader 
        title="Executive AI Telemetry Dashboard"
        subtitle="Real-time multi-agent HR telemetry, retention risk analytics, and cross-domain workflow execution."
        badgeText="98.4% Efficiency"
        badgeVariant="emerald"
        actions={
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>42</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Employees</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>$825K</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Payroll Spend</div>
            </div>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard 
          title="ATS Pipeline"
          value={candidates.length}
          subtitle="Active Candidates Sourced"
          badgeText="+12%"
          badgeVariant="emerald"
        />
        <StatCard 
          title="Retention Risk"
          value={highFlightRiskCount}
          subtitle="High Flight Risk Alert"
          badgeText="Action Needed"
          badgeVariant="amber"
        />
        <StatCard 
          title="Payroll Audit"
          value={payroll.anomaliesCount}
          subtitle="Anomalies Flagged"
          badgeText="Audited"
          badgeVariant="amber"
        />
        <StatCard 
          title="AI Agents"
          value="6"
          subtitle="Active Agents Online"
          badgeText="99.9% Up"
          badgeVariant="emerald"
        />
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Active Employee Table Snapshot */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--accent-emerald)" /> Key Enterprise Talent Roster
          </h3>

          <DataTable 
            columns={employeeColumns}
            data={employees}
            keyExtractor={(emp) => emp.id}
          />
        </div>

        {/* AI Agent Telemetry & Log Stream */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-emerald)" /> Agent Telemetry Stream
          </h3>

          <div style={{
            flex: 1,
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto'
          }}>
            <div><span style={{ color: 'var(--accent-emerald)' }}>[SUPERVISOR]</span> DAG-7701 initialized for payroll & hiring.</div>
            <div><span style={{ color: 'var(--text-secondary)' }}>[RECRUITMENT]</span> Parsed candidate resume Dr. Aris Thorne (96% match).</div>
            <div><span style={{ color: 'var(--accent-amber)' }}>[PAYROLL_FLAG]</span> High variance detected: EMP-103 (+28% salary spike).</div>
            <div><span style={{ color: 'var(--accent-amber)' }}>[PERFORMANCE]</span> High flight risk trigger on Marcus Vance (Design).</div>
            <div><span style={{ color: 'var(--accent-emerald)' }}>[ONBOARDING]</span> Mac Studio provisioned for Alex Rivera.</div>
          </div>
        </div>

      </div>
    </div>
  );
};
