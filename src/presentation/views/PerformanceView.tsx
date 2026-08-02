import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';

export const PerformanceView: React.FC = () => {
  const summaries = hrStore.getPerformanceSummaries();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <TrendingUp size={22} color="var(--accent-rose)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Performance & Flight Risk Agent</h2>
            <span className="badge badge-danger">360 Sentiment Synthesizer</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Predictive flight risk analytics, sentiment pulse monitoring, and performance review compilation.
          </p>
        </div>
      </div>

      {/* Flight Risk Alert Banner */}
      <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-rose)', background: 'var(--accent-rose-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={24} color="var(--accent-rose)" />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Flight Risk Detection Alert: Marcus Vance (Senior Designer)</h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
              Sentiment score dropped from 0.85 to 0.15 over the last 30 days. External recruiter profile views detected. Manager check-in recommended.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Snapshot Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {summaries.map((review) => (
          <div key={review.id} className="glass-card-interactive" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{review.employeeName}</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Period: {review.period}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{review.overallRating} / 5.0</div>
                <div style={{ fontSize: '0.7rem', color: review.sentimentScore < 0.3 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                  Sentiment: {(review.sentimentScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Key Strengths:</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {review.strengths.map((str, sIdx) => (
                  <span key={sIdx} className="badge badge-indigo" style={{ textTransform: 'none' }}>
                    {str}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--accent-indigo)' }}>AI Performance Summary:</strong> {review.aiSummary}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
