import React from 'react';
import { TrendingUp, AlertTriangle, HeartPulse, Award, MessageSquare } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';

export const PerformanceView: React.FC = () => {
  const summaries = hrStore.getPerformanceSummaries();
  const employees = hrStore.getEmployees();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <TrendingUp size={22} color="#f43f5e" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Performance & Flight Risk Agent</h2>
            <span className="badge badge-rose">360 Sentiment Synthesizer</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Predictive flight risk analytics, sentiment pulse monitoring, and performance review compilation.
          </p>
        </div>
      </div>

      {/* Flight Risk Alert Banner */}
      <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f43f5e', background: 'rgba(244, 63, 94, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={24} color="#f43f5e" />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Flight Risk Detection Alert: Marcus Vance (Senior Designer)</h3>
            <p style={{ fontSize: '0.83rem', color: '#94a3b8', marginTop: '2px' }}>
              Sentiment score dropped from 0.85 to 0.15 over the last 30 days. External recruiter profile views detected. Manager check-in recommended.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Snapshot Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {summaries.map((review) => (
          <div key={review.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{review.employeeName}</h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Period: {review.period}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{review.overallRating} / 5.0</div>
                <div style={{ fontSize: '0.7rem', color: review.sentimentScore < 0.3 ? '#f43f5e' : '#34d399' }}>
                  Sentiment: {(review.sentimentScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Key Strengths:</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {review.strengths.map((str, sIdx) => (
                  <span key={sIdx} className="badge badge-purple" style={{ textTransform: 'none' }}>
                    {str}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
              <strong style={{ color: '#6366f1' }}>AI Performance Summary:</strong> {review.aiSummary}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
