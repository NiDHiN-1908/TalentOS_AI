import React, { useState } from 'react';
import { Sparkles, ArrowRight, Terminal } from 'lucide-react';
import { OrchestratorService } from '../../application/services/OrchestratorService';

interface CommandHubProps {
  onCommandTriggered: () => void;
}

export const CommandHub: React.FC<CommandHubProps> = ({ onCommandTriggered }) => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const samplePrompts = [
    'Audit July 2026 payroll for salary spikes & check flight risk across Engineering',
    'Source top AI researchers, schedule interviews & generate 30-day onboarding workflow',
    'Evaluate skill gaps in Cloud Infrastructure and build adaptive learning tracks'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await OrchestratorService.executeNaturalLanguageCommand(prompt);
    setIsSubmitting(false);
    setPrompt('');
    onCommandTriggered();
  };

  const handleQuickClick = async (text: string) => {
    setPrompt(text);
    setIsSubmitting(true);
    await OrchestratorService.executeNaturalLanguageCommand(text);
    setIsSubmitting(false);
    setPrompt('');
    onCommandTriggered();
  };

  return (
    <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow accent */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none'
      }} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#6366f1',
          paddingLeft: '4px'
        }}>
          <Sparkles size={20} className="pulsing-glow" />
        </div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Supervisor Agent... (e.g. Audit payroll anomalies & check flight risk in Engineering)"
          style={{
            flex: 1,
            background: 'var(--bg-glass-input)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            color: '#fff',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-main)',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Dispatching Agents...' : 'Dispatch'}
          <ArrowRight size={16} />
        </button>
      </form>

      {/* Suggested Quick Prompts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Terminal size={12} /> Suggested Autonomous Workflows:
        </span>
        {samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickClick(sp)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '4px 10px',
              color: '#94a3b8',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {sp}
          </button>
        ))}
      </div>
    </div>
  );
};
