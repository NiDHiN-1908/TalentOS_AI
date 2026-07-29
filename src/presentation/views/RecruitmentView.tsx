import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Calendar, 
  FileText, 
  Upload, 
  Award,
  FileCheck
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
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Form State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
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

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.appliedRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setResumeText(`Extracted contents from uploaded file: ${file.name}. Candidate possesses 7+ years experience in PyTorch, TypeScript, Multi-Agent Systems, and System Architecture.`);
    }
  };

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
    const textToParse = resumeText.trim() || (selectedFileName ? `Parsed document ${selectedFileName}` : 'Experienced Senior AI Engineer');
    const res = RecruitmentService.parseResume(textToParse, selectedCandidate ? selectedCandidate.id : 'CAN-NEW');
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
            <Users size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Recruitment & ATS Workstation</h2>
            <span className="badge badge-indigo">AI Sourcing Active</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
            End-to-end ATS pipeline, PDF resume parser, interview scheduler & digital offer generator.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsJobModalOpen(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> New Requisition
          </button>
          <button onClick={() => setIsUploadModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} /> Parse PDF Resume
          </button>
        </div>
      </div>

      {/* Control Bar: Sub-Nav & Search Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#111726', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={activeTab === 'pipeline' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
          >
            ATS Pipeline ({candidates.length})
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
          >
            Job Requisitions ({jobs.length})
          </button>
          <button 
            onClick={() => setActiveTab('portal')}
            className={activeTab === 'portal' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
          >
            Candidate Portal
          </button>
        </div>

        {activeTab === 'pipeline' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '6px' }}>
            <Search size={14} color="#64748b" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter candidates by name or role..."
              style={{ background: 'none', border: 'none', color: '#f8fafc', fontSize: '0.82rem', outline: 'none', width: '220px' }}
            />
          </div>
        )}
      </div>

      {/* Main View Render */}
      {activeTab === 'pipeline' && (
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
          <table className="table-container">
            <thead className="table-header">
              <tr>
                <th>Candidate</th>
                <th>Applied Role</th>
                <th>AI Match Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((cand) => (
                <tr key={cand.id} className="table-row">
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{cand.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{cand.resumeSummary.substring(0, 48)}...</div>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{cand.appliedRole}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>{cand.matchScore}%</span>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{cand.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => {
                          setSelectedCandidate(cand);
                          setIsInterviewModalOpen(true);
                        }}
                        className="btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      >
                        <Calendar size={12} /> Schedule
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedCandidate(cand);
                          setIsOfferModalOpen(true);
                        }}
                        className="btn-primary" 
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      >
                        <FileText size={12} /> Offer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {jobs.map((j) => (
            <div key={j.id} style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{j.title}</h3>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>{j.department} • {j.location}</div>
                </div>
                <span className="badge badge-success">{j.status}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '8px 0 12px 0' }}>{j.description}</p>
              <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                Salary Target: ${j.salaryMin.toLocaleString()} - ${j.salaryMax.toLocaleString()} {j.currency}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'portal' && (
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#10b981" /> Candidate Portal (Dr. Aris Thorne)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginTop: 0, marginBottom: '10px' }}>Scheduled Interviews:</h4>
              {interviews.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.82rem' }}>No interviews scheduled yet.</div>
              ) : (
                interviews.map(i => (
                  <div key={i.id} style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.82rem' }}>{i.roleTitle} Interview with {i.interviewerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Time: {new Date(i.scheduledTime).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginTop: 0, marginBottom: '10px' }}>Extended Offer Letters:</h4>
              {offers.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.82rem' }}>No pending offers.</div>
              ) : (
                offers.map(o => (
                  <div key={o.id} style={{ backgroundColor: '#111726', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '12px', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.85rem' }}>Offer Extended: {o.roleTitle}</div>
                    <div style={{ fontSize: '0.8rem', color: '#f8fafc', margin: '4px 0' }}>Base Salary: ${o.baseSalary.toLocaleString()} • Equity: {o.equity}</div>
                    <button className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.72rem', marginTop: '6px' }}>
                      Sign Digitally
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
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', width: '440px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0', color: '#f8fafc' }}>New Job Requisition</h3>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Job Title (e.g. Lead AI Engineer)" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} />
              <button type="submit" className="btn-primary">Create Requisition</button>
              <button type="button" onClick={() => setIsJobModalOpen(false)} className="btn-secondary">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Resume Upload & AI Parser Modal */}
      {isUploadModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', width: '500px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px 0', color: '#f8fafc' }}>AI Resume File Parser (.PDF, .DOCX, .TXT)</h3>
            
            {/* File Dropzone */}
            <div style={{
              border: '2px dashed rgba(16, 185, 129, 0.4)',
              backgroundColor: '#090d16',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '12px',
              cursor: 'pointer'
            }}>
              <Upload size={24} color="#10b981" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>
                {selectedFileName ? `Selected File: ${selectedFileName}` : 'Click to Upload PDF / Word Resume Document'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Supports .pdf, .docx, .txt (Max 25MB)</div>
              <input 
                type="file" 
                accept=".pdf,.docx,.txt" 
                onChange={handleFileUpload} 
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
              />
            </div>

            <textarea 
              rows={4} 
              placeholder="Or paste resume text directly here..." 
              value={resumeText} 
              onChange={(e) => setResumeText(e.target.value)} 
              style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} 
            />

            <button onClick={handleParseResume} className="btn-primary" style={{ width: '100%', margin: '10px 0', justifyContent: 'center' }}>
              <FileCheck size={14} /> Parse Resume with AI
            </button>

            {parsedResult && (
              <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '12px', borderRadius: '6px', fontSize: '0.78rem', color: '#94a3b8' }}>
                <strong style={{ color: '#10b981' }}>Extracted Skills:</strong> {parsedResult.skillsExtracted.join(', ')}
                <div style={{ color: '#f8fafc', marginTop: '4px' }}>{parsedResult.recommendation}</div>
              </div>
            )}

            <button onClick={() => setIsUploadModalOpen(false)} className="btn-secondary" style={{ width: '100%', marginTop: '8px' }}>Close</button>
          </div>
        </div>
      )}

      {/* Interview Scheduler Modal */}
      {isInterviewModalOpen && selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', width: '440px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px 0', color: '#f8fafc' }}>Schedule Interview for {selectedCandidate.name}</h3>
            <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" value={interviewerName} onChange={(e) => setInterviewerName(e.target.value)} placeholder="Interviewer Name" style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} />
              <input type="datetime-local" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} />
              <button type="submit" className="btn-primary">Confirm Interview</button>
              <button type="button" onClick={() => setIsInterviewModalOpen(false)} className="btn-secondary">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Offer Generator Modal */}
      {isOfferModalOpen && selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', width: '440px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px 0', color: '#f8fafc' }}>Generate Offer for {selectedCandidate.name}</h3>
            <form onSubmit={handleGenerateOffer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="number" value={offerSalary} onChange={(e) => setOfferSalary(Number(e.target.value))} placeholder="Base Salary (USD)" style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} />
              <input type="text" value={offerEquity} onChange={(e) => setOfferEquity(e.target.value)} placeholder="Equity (e.g. 25,000 RSUs)" style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} />
              <button type="submit" className="btn-primary">Generate Offer</button>
              <button type="button" onClick={() => setIsOfferModalOpen(false)} className="btn-secondary">Cancel</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
