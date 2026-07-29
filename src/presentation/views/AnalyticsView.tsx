import React from 'react';
import { TrendingUp, Users, CreditCard, AlertTriangle, Award, Clock, Activity } from 'lucide-react';
import { EnterpriseModulesService } from '../../application/services/EnterpriseModulesService';

export const AnalyticsView: React.FC = () => {
  const metrics = EnterpriseModulesService.getAnalyticsMetrics();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <TrendingUp size={22} color="#a855f7" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enterprise BI Analytics & Executive Intelligence</h2>
            <span className="badge badge-purple">Real-Time Workforce Metrics</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Cross-domain metrics: Headcount velocity, attrition analytics, payroll run rate, flight risk maps, and hiring efficiency.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6366f1', marginBottom: '10px' }}>
            <Users size={22} />
            <span style={{ fontSize: '0.72rem', color: '#34d399' }}>+8% QoQ</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{metrics.totalHeadcount}</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Enterprise Headcount</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', marginBottom: '10px' }}>
            <CreditCard size={22} />
            <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Audited</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>${metrics.monthlyPayrollGross.toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Monthly Payroll Run-Rate</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f43f5e', marginBottom: '10px' }}>
            <AlertTriangle size={22} />
            <span style={{ fontSize: '0.72rem', color: '#fb7185' }}>1 High Risk</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{metrics.flightRiskHighCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Flight Risk Escalation Alert</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a855f7', marginBottom: '10px' }}>
            <Clock size={22} />
            <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Top 10% Industry</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{metrics.hiringVelocityDays} Days</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Average Time-to-Hire</div>
        </div>
      </div>

      {/* Analytics Visualization Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Headcount Breakdown */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#6366f1" /> Department Headcount Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { dept: 'Engineering', count: 18, pct: 43, color: '#6366f1' },
              { dept: 'AI Research', count: 8, pct: 19, color: '#a855f7' },
              { dept: 'Design & Product', count: 6, pct: 14, color: '#ec4899' },
              { dept: 'Data & Analytics', count: 5, pct: 12, color: '#06b6d4' },
              { dept: 'People Ops & Finance', count: 5, pct: 12, color: '#10b981' }
            ].map(d => (
              <div key={d.dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{d.dept}</span>
                  <span style={{ color: '#94a3b8' }}>{d.count} ({d.pct}%)</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retainability & Health Index */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#34d399" /> Enterprise Retention & Health Index
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>94.8 / 100</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                Overall Employee Health Score based on sentiment, 1-on-1 check-ins, and performance feedback.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Annual Attrition Rate</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>{metrics.attritionRatePercent}% (Benchmark: 11%)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>Avg Performance Rating</span>
              <span style={{ fontWeight: 700, color: '#a855f7' }}>{metrics.avgPerformanceRating} / 5.0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
