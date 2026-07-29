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
    'Audit payroll for anomalies & evaluate engineering retention risk',
    'Source Senior AI Engineers, schedule interviews & setup onboarding',
    'Evaluate skill gaps & generate personalized 6-week learning tracks'
  ];

  const handleSubmit = async (e: FormEvent) => {
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
    <div style={{ 
      padding: '16px 20px', 
      marginBottom: '24px', 
      backgroundColor: '#111726',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '10px'
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}>
          <Sparkles size={18} />
        </div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Supervisor Agent... (e.g., Audit payroll anomalies & check flight risk in Engineering)"
          style={{
            flex: 1,
            backgroundColor: '#090d16',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '10px 14px',
            color: '#f8fafc',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>{isSubmitting ? 'Dispatching...' : 'Dispatch'}</span>
          <ArrowRight size={14} />
        </button>
      </form>

      {/* Suggested Quick Prompts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Terminal size={12} /> Suggested Workflows:
        </span>
        {samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickClick(sp)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '9999px',
              padding: '3px 10px',
              color: '#94a3b8',
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {sp}
          </button>
        ))}
      </div>
    </div>
  );
};
