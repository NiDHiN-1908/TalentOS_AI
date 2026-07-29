import React from 'react';
import { GraduationCap, BookOpen, Target, Award, CheckCircle } from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';

export const LearningView: React.FC = () => {
  const learningTracks = hrStore.getLearningTracks();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <GraduationCap size={22} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Learning & Upskilling Agent</h2>
            <span className="badge badge-emerald">Adaptive Skill Pathways</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Skill gap detection, personalized course recommendation, and employee progression tracking.
          </p>
        </div>
      </div>

      {/* Learning Tracks List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
        {learningTracks.map((track) => (
          <div key={track.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{track.employeeName}</h3>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Target: {track.targetSkill}</div>
              </div>
              <span className="badge badge-purple">{track.progressPercent}% Completed</span>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <BookOpen size={14} color="#6366f1" /> Course: <strong style={{ color: '#fff' }}>{track.recommendedCourse}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span>Level: {track.currentLevel} → {track.targetLevel}</span>
                <span>Deadline: {track.deadline}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${track.progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
