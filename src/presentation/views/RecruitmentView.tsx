import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  FileText, 
  Mail, 
  Upload, 
  Briefcase, 
  Award, 
  Eye, 
  Send 
} from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { RecruitmentService } from '../../application/services/RecruitmentService';
import { Candidate } from '../../domain/types';
import { JobRequisition, InterviewSlot, OfferLetter } from '../../domain/types/recruitment';

export const RecruitmentView: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobRequisition[]>(RecruitmentService.getJobs());
  const [interviews, setInterviews] = useState<InterviewSlot[]>(RecruitmentService.getInterviews());
  const [offers, setOffers] = useState<OfferLetter[]>(RecruitmentService.getOffers());
  const [activeTab, setActiveTab] = useState<'pipeline' | 'jobs' | 'portal'>('pipeline');

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Form State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Engineering');
  const [interviewerName, setInterviewerName] = useState('Sarah Chen');
  const [interviewTime, setInterviewTime] = useState('2026-08-05T10:00');
  const [offerSalary, setOfferSalary] = useState(210000);
  const [offerEquity, setOfferEquity] = useState('25,000 RSUs');

  React.useEffect(() => {
    const update = () => {
      setCandidates(hrStore.getCandidates());
      setJobs(RecruitmentService.getJobs());
      setInterviews(RecruitmentService.getInterviews());
      setOffers(RecruitmentService.getOffers());
    };
    update();
    return hrStore.subscribe(update);
  }, []);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    RecruitmentService.createJob({
      title: newJobTitle,
      department: newJobDept,
      location: 'San Francisco, CA',
      type: 'Full-time',
      salaryMin: 150000,
      salaryMax: 220000,
      currency: 'USD',
      headcount: 1,
      requiredSkills: ['Multi-Agent Systems', 'TypeScript', 'System Design'],
      description: 'Lead engineering role building agentic workflow engines.',
      status: 'Open'
    });

    setJobs(RecruitmentService.getJobs());
    setIsJobModalOpen(false);
    setNewJobTitle('');
  };

  const handleParseResume = () => {
    if (!resumeText.trim()) return;
    const res = RecruitmentService.parseResume(resumeText, selectedCandidate ? selectedCandidate.id : 'CAN-NEW');
    setParsedResult(res);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    RecruitmentService.scheduleInterview(selectedCandidate.id, interviewerName, interviewTime);
    setInterviews(RecruitmentService.getInterviews());
    setIsInterviewModalOpen(false);
  };

  const handleGenerateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    RecruitmentService.generateOffer(selectedCandidate.id, offerSalary, offerEquity);
    setOffers(RecruitmentService.getOffers());
    setIsOfferModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Bar */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Users size={22} color="#60a5fa" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recruitment & ATS Workstation</h2>
            <span className="badge badge-blue">AI Sourcing & Screening</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            End-to-end recruitment lifecycle: Job Requisitions, ATS Pipeline, Resume Upload, Interview Scheduling & Offer Generation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsJobModalOpen(true)} className="btn-secondary">
            <Plus size={16} /> New Job Requisition
          </button>
          <button onClick={() => setIsUploadModalOpen(true)} className="btn-primary">
            <Upload size={16} /> Upload & Parse Resume
          </button>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={activeTab === 'pipeline' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          ATS Candidate Pipeline ({candidates.length})
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          Job Requisitions ({jobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('portal')}
          className={activeTab === 'portal' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          Candidate Self-Service Portal
        </button>
      </div>

      {/* Main View Render */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {candidates.map((cand) => (
            <div key={cand.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{cand.name}</h3>
                    <div style={{ fontSize: '0.82rem', color: '#60a5fa', fontWeight: 600 }}>{cand.appliedRole}</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(99, 102, 241, 0.15)', 
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    padding: '6px 12px', 
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' }}>{cand.matchScore}%</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>AI Score</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.4 }}>
                  {cand.resumeSummary}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-purple">{cand.status}</span>
                  <button 
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setIsInterviewModalOpen(true);
                    }}
                    className="btn-secondary" 
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    <Calendar size={13} /> Schedule Interview
                  </button>
                </div>

                <button 
                  onClick={() => {
                    setSelectedCandidate(cand);
                    setIsOfferModalOpen(true);
                  }}
                  className="btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '0.78rem', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <FileText size={14} /> Generate Offer Letter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
          {jobs.map((j) => (
            <div key={j.id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{j.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#60a5fa' }}>{j.department} • {j.location}</div>
                </div>
                <span className="badge badge-emerald">{j.status}</span>
              </div>
              <p style={{ fontSize: '0.83rem', color: '#94a3b8', marginBottom: '12px' }}>{j.description}</p>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                Salary Target: ${j.salaryMin.toLocaleString()} - ${j.salaryMax.toLocaleString()} {j.currency}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'portal' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#34d399" /> Candidate Self-Service Portal (Dr. Aris Thorne)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Scheduled Interviews:</h4>
              {interviews.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No interviews scheduled yet.</div>
              ) : (
                interviews.map(i => (
                  <div key={i.id} style={{ background: 'rgba(99,102,241,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{i.roleTitle} Interview with {i.interviewerName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Time: {new Date(i.scheduledTime).toLocaleString()}</div>
                    <a href={i.meetingUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Join Meeting Link</a>
                  </div>
                ))
              )}
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Extended Offer Letters:</h4>
              {offers.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No pending offers.</div>
              ) : (
                offers.map(o => (
                  <div key={o.id} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>Offer Extended: {o.roleTitle}</div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', margin: '4px 0' }}>Base Salary: ${o.baseSalary.toLocaleString()} • Equity: {o.equity}</div>
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', marginTop: '6px' }}>
                      Sign Offer Letter Digitally
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Requisition Builder Modal */}
      {isJobModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>New Job Requisition</h3>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Job Title (e.g. Senior AI Researcher)" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Create Requisition</button>
              <button type="button" onClick={() => setIsJobModalOpen(false)} className="btn-secondary">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Resume Upload & AI Parser Modal */}
      {isUploadModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '540px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>AI Resume Text Parser</h3>
            <textarea rows={6} placeholder="Paste resume text or candidate bio here..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }} />
            <button onClick={handleParseResume} className="btn-primary" style={{ width: '100%', justifyContent: 'center', margin: '12px 0' }}>Parse with AI Agent</button>
            {parsedResult && (
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#34d399' }}>Parsing Completed:</strong>
                <div>Extracted Skills: {parsedResult.skillsExtracted.join(', ')}</div>
                <div>{parsedResult.summary}</div>
              </div>
            )}
            <button onClick={() => setIsUploadModalOpen(false)} className="btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Close</button>
          </div>
        </div>
      )}

      {/* Interview Scheduler Modal */}
      {isInterviewModalOpen && selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>Schedule Interview for {selectedCandidate.name}</h3>
            <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" value={interviewerName} onChange={(e) => setInterviewerName(e.target.value)} placeholder="Interviewer Name" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
              <input type="datetime-local" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Confirm & Dispatch Invite Email</button>
              <button type="button" onClick={() => setIsInterviewModalOpen(false)} className="btn-secondary">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Offer Generator Modal */}
      {isOfferModalOpen && selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>Generate Offer Letter for {selectedCandidate.name}</h3>
            <form onSubmit={handleGenerateOffer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="number" value={offerSalary} onChange={(e) => setOfferSalary(Number(e.target.value))} placeholder="Base Salary (USD)" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
              <input type="text" value={offerEquity} onChange={(e) => setOfferEquity(e.target.value)} placeholder="Equity (e.g. 25,000 RSUs)" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#fff' }} />
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>Synthesize & Send Offer</button>
              <button type="button" onClick={() => setIsOfferModalOpen(false)} className="btn-secondary">Cancel</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
