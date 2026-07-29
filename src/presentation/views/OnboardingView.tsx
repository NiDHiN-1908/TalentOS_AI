import React, { useState } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  Play, 
  FastForward, 
  Laptop, 
  Mail, 
  Award, 
  ShieldCheck, 
  CreditCard, 
  Gift, 
  Bell, 
  UserCheck, 
  Clock 
} from 'lucide-react';
import { OnboardingService } from '../../application/services/OnboardingService';
import { OnboardingPipeline } from '../../domain/types/onboarding';

export const OnboardingView: React.FC = () => {
  const [pipelines, setPipelines] = useState<OnboardingPipeline[]>(OnboardingService.getPipelines());
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(pipelines[0] ? pipelines[0].id : '');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId) || pipelines[0];

  const handleAdvanceStep = async () => {
    if (!selectedPipeline || isProcessing) return;
    setIsProcessing(true);
    await OnboardingService.advancePipeline(selectedPipeline.id);
    setPipelines([...OnboardingService.getPipelines()]);
    setIsProcessing(false);
  };

  const handleRunToCompletion = async () => {
    if (!selectedPipeline || isProcessing) return;
    setIsProcessing(true);
    await OnboardingService.runPipelineToCompletion(selectedPipeline.id);
    setPipelines([...OnboardingService.getPipelines()]);
    setIsProcessing(false);
  };

  const handleStartNewOnboarding = () => {
    const p = OnboardingService.startOnboarding(
      `CAN-${Math.floor(Math.random() * 900) + 100}`,
      'Maya Patel',
      'maya.patel@techcorp.io',
      'Senior Frontend Engineer',
      'Engineering'
    );
    setPipelines([...OnboardingService.getPipelines()]);
    setSelectedPipelineId(p.id);
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'OFFER_ACCEPTED': return Award;
      case 'DOCUMENT_COLLECTION': return ShieldCheck;
      case 'VERIFICATION': return UserCheck;
      case 'EMPLOYEE_CREATION': return UserPlus;
      case 'EMPLOYEE_ID_GEN': return ShieldCheck;
      case 'COMPANY_EMAIL_PROVISION': return Mail;
      case 'LAPTOP_ASSIGNMENT': return Laptop;
      case 'TRAINING_ASSIGNMENT': return Award;
      case 'PAYROLL_REGISTRATION': return CreditCard;
      case 'WELCOME_KIT': return Gift;
      case 'MANAGER_NOTIFICATION': return Bell;
      default: return CheckCircle2;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <UserPlus size={22} color="#34d399" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>11-Step Onboarding Agent Workstation</h2>
            <span className="badge badge-emerald">Zero-Touch Automation Engine</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Offer Accepted → Document Collection → Verification → Employee Creation → ID Gen → Email → Laptop → Training → Payroll → Welcome Kit → Manager Notification.
          </p>
        </div>

        <button onClick={handleStartNewOnboarding} className="btn-primary">
          <UserPlus size={16} /> Start Onboarding Pipeline
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        
        {/* Cohort Pipelines Sidebar */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>In-Flight Onboarding Cohort</h3>

          {pipelines.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedPipelineId(p.id)}
              className="glass-card-interactive"
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: selectedPipelineId === p.id ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.06)',
                background: selectedPipelineId === p.id ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{p.candidateName}</div>
              <div style={{ fontSize: '0.78rem', color: '#34d399', margin: '2px 0' }}>{p.roleTitle}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span className={p.status === 'Completed' ? 'badge badge-emerald' : 'badge badge-amber'}>
                  {p.status}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Step {p.currentStepIndex + 1} / 11</span>
              </div>
            </div>
          ))}
        </div>

        {/* 11-Step Visual Workflow Engine Tracker */}
        {selectedPipeline && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Control Bar */}
            <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{selectedPipeline.candidateName}</h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {selectedPipeline.roleTitle} ({selectedPipeline.department}) • Pipeline ID: {selectedPipeline.id}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleAdvanceStep}
                  disabled={selectedPipeline.status === 'Completed' || isProcessing}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  <Play size={14} color="#34d399" /> Advance 1 Step
                </button>
                <button
                  onClick={handleRunToCompletion}
                  disabled={selectedPipeline.status === 'Completed' || isProcessing}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <FastForward size={14} /> Auto-Run All 11 Steps
                </button>
              </div>
            </div>

            {/* Generated Enterprise Artifacts Snapshot */}
            <div className="glass-card" style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Employee ID</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{selectedPipeline.assignedEmployeeId || 'Pending Step 5'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Company Email</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa' }}>{selectedPipeline.assignedCompanyEmail || 'Pending Step 6'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Laptop Hardware</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>{selectedPipeline.assignedLaptop ? 'MacBook Pro M3 Max' : 'Pending Step 7'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Assigned Buddy</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#a855f7' }}>{selectedPipeline.buddyName || 'Pending Step 10'}</div>
              </div>
            </div>

            {/* 11-Step Progress List */}
            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>11-Step Sequential Execution Pipeline</h3>

              {selectedPipeline.steps.map((st, idx) => {
                const Icon = getStepIcon(st.stepId);
                const isDone = st.status === 'completed';
                const isCurrent = selectedPipeline.currentStepIndex === idx && selectedPipeline.status === 'In Progress';

                return (
                  <div
                    key={st.stepId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: isCurrent ? 'rgba(99, 102, 241, 0.12)' : isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      border: isCurrent ? '1px solid #6366f1' : isDone ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={16} color={isDone ? '#34d399' : isCurrent ? '#6366f1' : '#94a3b8'} />
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isDone ? '#fff' : '#cbd5e1' }}>
                          {st.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {st.outputDetails || st.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {st.completedAt && (
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                          {new Date(st.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      <span className={isDone ? 'badge badge-emerald' : isCurrent ? 'badge badge-purple' : 'badge badge-amber'}>
                        {st.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
