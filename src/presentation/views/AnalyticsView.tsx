import React from 'react';
import { TrendingUp, Award, Activity } from 'lucide-react';
import { EnterpriseModulesService } from '../../application/services/EnterpriseModulesService';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';

export const AnalyticsView: React.FC = () => {
  const metrics = EnterpriseModulesService.getAnalyticsMetrics();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Header */}
      <PageHeader 
        title="Enterprise BI Analytics & Executive Intelligence"
        subtitle="Headcount velocity, attrition analytics, payroll run rate, flight risk maps, and hiring efficiency."
        icon={<TrendingUp size={20} color="var(--accent-emerald)" />}
        badgeText="Real-Time BI Telemetry"
        badgeVariant="indigo"
      />

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard 
          title="Headcount"
          value={metrics.totalHeadcount}
          subtitle="Total Enterprise Headcount"
          badgeText="+8% QoQ"
          badgeVariant="emerald"
        />
        <StatCard 
          title="Payroll Run Rate"
          value={`$${metrics.monthlyPayrollGross.toLocaleString()}`}
          subtitle="Monthly Gross Payroll"
          badgeText="Audited"
          badgeVariant="indigo"
        />
        <StatCard 
          title="Flight Risk"
          value={metrics.flightRiskHighCount}
          subtitle="Flight Risk Escalations"
          badgeText="1 High Risk"
          badgeVariant="amber"
        />
        <StatCard 
          title="Hiring Velocity"
          value={`${metrics.hiringVelocityDays} Days`}
          subtitle="Average Time-to-Hire"
          badgeText="Top 10% Industry"
          badgeVariant="emerald"
        />
      </div>

      {/* Analytics Visualization Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Headcount Breakdown */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Activity size={16} color="var(--accent-emerald)" /> Department Headcount Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            {[
              { dept: 'Engineering', count: 18, pct: 43, color: 'var(--accent-emerald)' },
              { dept: 'AI Research', count: 8, pct: 19, color: 'var(--accent-indigo)' },
              { dept: 'Design & Product', count: 6, pct: 14, color: 'var(--accent-amber)' },
              { dept: 'Data & Analytics', count: 5, pct: 12, color: 'var(--accent-cyan)' },
              { dept: 'People Ops & Finance', count: 5, pct: 12, color: 'var(--accent-violet)' }
            ].map(d => (
              <div key={d.dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.dept}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{d.count} ({d.pct}%)</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'var(--bg-canvas)', height: '6px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', backgroundColor: d.color, borderRadius: 'var(--radius-xs)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retainability & Health Index */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Award size={16} color="var(--accent-emerald)" /> Enterprise Retention & Health Index
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
            <div style={{ backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--accent-emerald-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>94.8 / 100</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Overall Employee Health Score based on sentiment, 1-on-1 check-ins, and performance feedback.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Annual Attrition Rate</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>{metrics.attritionRatePercent}% (Benchmark: 11%)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Avg Performance Rating</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-indigo)' }}>{metrics.avgPerformanceRating} / 5.0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
