import React from 'react';
import { TrendingUp, Users, CreditCard, AlertTriangle, Award, Clock, Activity } from 'lucide-react';
import { EnterpriseModulesService } from '../../application/services/EnterpriseModulesService';

export const AnalyticsView: React.FC = () => {
  const metrics = EnterpriseModulesService.getAnalyticsMetrics();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <TrendingUp size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Enterprise BI Analytics & Executive Intelligence</h2>
            <span className="badge badge-indigo">Real-Time BI Telemetry</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
            Headcount velocity, attrition analytics, payroll run rate, flight risk maps, and hiring efficiency.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>HEADCOUNT</span>
            <span className="badge badge-success">+8% QoQ</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{metrics.totalHeadcount}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Total Enterprise Headcount</div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PAYROLL RUN RATE</span>
            <span className="badge badge-indigo">Audited</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>${metrics.monthlyPayrollGross.toLocaleString()}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Monthly Gross Payroll</div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>FLIGHT RISK</span>
            <span className="badge badge-warning">1 High Risk</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{metrics.flightRiskHighCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Flight Risk Escalations</div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>HIRING VELOCITY</span>
            <span className="badge badge-success">Top 10% Industry</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{metrics.hiringVelocityDays} Days</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>Average Time-to-Hire</div>
        </div>
      </div>

      {/* Analytics Visualization Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Headcount Breakdown */}
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#10b981" /> Department Headcount Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { dept: 'Engineering', count: 18, pct: 43, color: '#10b981' },
              { dept: 'AI Research', count: 8, pct: 19, color: '#6366f1' },
              { dept: 'Design & Product', count: 6, pct: 14, color: '#f59e0b' },
              { dept: 'Data & Analytics', count: 5, pct: 12, color: '#06b6d4' },
              { dept: 'People Ops & Finance', count: 5, pct: 12, color: '#8b5cf6' }
            ].map(d => (
              <div key={d.dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>{d.dept}</span>
                  <span style={{ color: '#94a3b8' }}>{d.count} ({d.pct}%)</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#090d16', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', backgroundColor: d.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retainability & Health Index */}
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} color="#10b981" /> Enterprise Retention & Health Index
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#10b981' }}>94.8 / 100</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                Overall Employee Health Score based on sentiment, 1-on-1 check-ins, and performance feedback.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Annual Attrition Rate</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>{metrics.attritionRatePercent}% (Benchmark: 11%)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: '#94a3b8' }}>Avg Performance Rating</span>
              <span style={{ fontWeight: 600, color: '#6366f1' }}>{metrics.avgPerformanceRating} / 5.0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
