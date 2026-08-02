import React from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';

export const LearningView: React.FC = () => {
  const learningTracks = hrStore.getLearningTracks();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <GraduationCap size={22} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Learning & Upskilling Agent</h2>
            <span className="badge badge-success">Adaptive Skill Pathways</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Skill gap detection, personalized course recommendation, and employee progression tracking.
          </p>
        </div>
      </div>

      {/* Learning Tracks List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
        {learningTracks.map((track) => (
          <div key={track.id} className="glass-card-interactive" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{track.employeeName}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '2px' }}>Target: {track.targetSkill}</div>
              </div>
              <span className="badge badge-indigo">{track.progressPercent}% Completed</span>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <BookOpen size={14} color="var(--accent-indigo)" /> Course: <strong style={{ color: 'var(--text-primary)' }}>{track.recommendedCourse}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-muted)' }}>
                <span>Level: {track.currentLevel} → {track.targetLevel}</span>
                <span>Deadline: {track.deadline}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', background: 'var(--bg-canvas)', height: '8px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <div style={{
                width: `${track.progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-indigo) 0%, var(--accent-emerald) 100%)',
                borderRadius: 'var(--radius-xs)'
              }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
