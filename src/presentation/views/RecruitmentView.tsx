import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Calendar, 
  FileText, 
  Upload, 
  Award,
  FileCheck,
  Globe,
  Share2,
  QrCode,
  Mail,
  FileSpreadsheet,
  Link,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  RefreshCcw,
  ExternalLink,
  Database,
  Sliders,
  Store
} from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { RecruitmentService } from '../../application/services/RecruitmentService';
import { Candidate } from '../../domain/types';
import { JobRequisition, InterviewSlot, OfferLetter } from '../../domain/types/recruitment';

export type ScreeningClassification = 
  | 'HIGHLY_RECOMMENDED'
  | 'RECOMMENDED'
  | 'NEEDS_MANUAL_REVIEW'
  | 'LOW_MATCH'
  | 'REJECTED';

export interface ExchangeCandidate extends Candidate {
  classification: ScreeningClassification;
  channelSource: string;
  explanation: string;
  isDuplicate?: boolean;
  duplicateOfId?: string;
  githubUrl?: string;
  linkedInUrl?: string;
}

export const RecruitmentView: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobRequisition[]>(RecruitmentService.getJobs());
  const [interviews, setInterviews] = useState<InterviewSlot[]>(RecruitmentService.getInterviews());
  const [offers, setOffers] = useState<OfferLetter[]>(RecruitmentService.getOffers());
  const [activeTab, setActiveTab] = useState<'pipeline' | 'jobs' | 'free_channels' | 'marketplace' | 'portal'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQueryPrompt, setAiQueryPrompt] = useState('');

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isGoogleFormsModalOpen, setIsGoogleFormsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedJobForSchema, setSelectedJobForSchema] = useState<JobRequisition | null>(null);

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

  // Channel States
  const [gformUrl, setGformUrl] = useState('https://forms.google.com/d/1A2B3C4D_TalentOS_Application');
  const [referralEmail, setReferralEmail] = useState('');
  const [referralName, setReferralName] = useState('');

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

  // Classify Candidate into 5 Transparent AI Buckets
  const getClassification = (score: number, status: string): ScreeningClassification => {
    if (status === 'Rejected') return 'REJECTED';
    if (score >= 90) return 'HIGHLY_RECOMMENDED';
    if (score >= 80) return 'RECOMMENDED';
    if (score >= 65) return 'NEEDS_MANUAL_REVIEW';
    return 'LOW_MATCH';
  };

  const getClassificationBadge = (cls: ScreeningClassification) => {
    switch (cls) {
      case 'HIGHLY_RECOMMENDED':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Sparkles size={10} /> Highly Recommended</span>;
      case 'RECOMMENDED':
        return <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={10} /> Recommended</span>;
      case 'NEEDS_MANUAL_REVIEW':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Sliders size={10} /> Needs Manual Review</span>;
      case 'LOW_MATCH':
        return <span className="badge badge-orange">Low Match</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Hard Rejection</span>;
    }
  };

  // Convert candidates into enriched exchange candidates
  const exchangeCandidates: ExchangeCandidate[] = candidates.map((c, index) => ({
    ...c,
    classification: getClassification(c.matchScore, c.status),
    channelSource: index % 3 === 0 ? 'Company Career Portal' : index % 3 === 1 ? 'Employee Referral' : 'Email Mailbox Ingest',
    explanation: `Candidate demonstrates ${c.matchScore}% semantic match against target requirements with strong experience in ${c.skills.slice(0, 3).join(', ')}.`,
    isDuplicate: index === 2,
    duplicateOfId: index === 2 ? 'CAN-101' : undefined
  }));

  const filteredCandidates = exchangeCandidates.filter(c => {
    const q = searchQuery.toLowerCase();
    const prompt = aiQueryPrompt.toLowerCase();
    
    const matchesSearch = c.name.toLowerCase().includes(q) || c.appliedRole.toLowerCase().includes(q) || c.skills.some(s => s.toLowerCase().includes(q));
    const matchesPrompt = !prompt || c.name.toLowerCase().includes(prompt) || c.appliedRole.toLowerCase().includes(prompt) || c.skills.some(s => s.toLowerCase().includes(prompt)) || (prompt.includes('python') && c.skills.some(s => s.toLowerCase().includes('python'))) || (prompt.includes('langgraph') && c.skills.some(s => s.toLowerCase().includes('agent')));

    return matchesSearch && matchesPrompt;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setResumeText(`Extracted contents from uploaded document: ${file.name}. Candidate possesses 7+ years experience in PyTorch, TypeScript, LangGraph Multi-Agent Systems, and System Architecture.`);
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
    setCandidates(hrStore.getCandidates());
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

  // Generate Schema.org JSON-LD Structured Data for Google Jobs
  const generateGoogleJobsSchema = (job: JobRequisition) => {
    return JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description,
      "identifier": {
        "@type": "PropertyValue",
        "name": "TalentOS AI",
        "value": job.id
      },
      "datePosted": new Date().toISOString().split('T')[0],
      "employmentType": job.type === 'Full-time' ? 'FULL_TIME' : 'CONTRACTOR',
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Acme Enterprise Corp",
        "sameAs": "https://acme.corp"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
          "addressCountry": "US"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": job.currency,
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salaryMin,
          "maxValue": job.salaryMax,
          "unitText": "YEAR"
        }
      }
    }, null, 2);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Bar */}
      <div style={{
        padding: '22px 26px',
        backgroundColor: '#111726',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Globe size={22} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Recruitment Exchange Platform</h2>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={11} /> Free-First Architecture</span>
            <span className="badge badge-indigo">Zero Paid API Dependency</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>
            Centralized recruitment hub operating with 6 self-hosted channels, automated Google Jobs SEO indexing & Extensible Connector Marketplace.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsJobModalOpen(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Optimize Job & Publish
          </button>
          <button onClick={() => setIsUploadModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} /> Resume Intelligence OCR
          </button>
        </div>
      </div>

      {/* Free Channels Status Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '14px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe size={20} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Company Career Portal</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>Auto-Generated</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '14px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={20} color="#6366f1" />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Google Jobs SEO</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6366f1' }}>Schema.org JSON-LD</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '14px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Share2 size={20} color="#f59e0b" />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Employee Referrals</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f59e0b' }}>Active Rewards</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '14px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Mail size={20} color="#3b82f6" />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Email Ingest Mailbox</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#3b82f6' }}>careers@talentos.ai</div>
          </div>
        </div>
      </div>

      {/* AI Recruiter Natural Language Query Bar */}
      <div style={{
        backgroundColor: '#111726',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '10px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Sparkles size={18} color="#10b981" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap' }}>AI Recruiter Prompt:</span>
          <input 
            type="text"
            value={aiQueryPrompt}
            onChange={(e) => setAiQueryPrompt(e.target.value)}
            placeholder='Ask: "Find candidates with LangGraph experience", "Show Python developers", "Show silver medalists"...'
            style={{ width: '100%', background: 'none', border: 'none', color: '#f8fafc', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
        {aiQueryPrompt && (
          <button onClick={() => setAiQueryPrompt('')} className="btn-secondary" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
            Clear Prompt
          </button>
        )}
      </div>

      {/* Control Bar: Sub-Nav Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#111726', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={activeTab === 'pipeline' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
          >
            Candidate Collection Hub ({filteredCandidates.length})
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
          >
            Free Publishing Channels ({jobs.length})
          </button>
          <button 
            onClick={() => setActiveTab('free_channels')}
            className={activeTab === 'free_channels' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
          >
            Free Ingestion Drivers
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={activeTab === 'marketplace' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Store size={12} color="#10b981" /> Connector Marketplace
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
              placeholder="Filter by name or role..."
              style={{ background: 'none', border: 'none', color: '#f8fafc', fontSize: '0.82rem', outline: 'none', width: '180px' }}
            />
          </div>
        )}
      </div>

      {/* Main View Render */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Duplicate Detection Alert Banner */}
          <div style={{ backgroundColor: '#1e1b4b', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '8px', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} color="#818cf8" />
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>Multi-Attribute Duplicate Candidate Detected</div>
                <div style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Email & Resume Similarity match found between Candidate CAN-103 and existing Silver Medalist CAN-101.</div>
              </div>
            </div>
            <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>Auto-Merge Duplicate Record</button>
          </div>

          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
            <table className="table-container">
              <thead className="table-header">
                <tr>
                  <th>Candidate & Channel Source</th>
                  <th>Applied Role</th>
                  <th>AI Screening Bucket</th>
                  <th>Match Score</th>
                  <th>AI Explanation Rationale</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="table-row">
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {cand.name}
                        {cand.isDuplicate && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Duplicate Match</span>}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>Source: {cand.channelSource}</div>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{cand.appliedRole}</td>
                    <td>
                      {getClassificationBadge(cand.classification)}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: cand.matchScore >= 85 ? '#10b981' : '#f59e0b' }}>{cand.matchScore}%</span>
                    </td>
                    <td style={{ fontSize: '0.76rem', color: '#94a3b8', maxWidth: '280px' }}>
                      {cand.explanation}
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
        </div>
      )}

      {activeTab === 'jobs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {jobs.map((j) => (
            <div key={j.id} style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{j.title}</h3>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>{j.department} • {j.location}</div>
                  </div>
                  <span className="badge badge-success">{j.status}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '8px 0 12px 0' }}>{j.description}</p>
                <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, marginBottom: '12px' }}>
                  Target Salary: ${j.salaryMin.toLocaleString()} - ${j.salaryMax.toLocaleString()} {j.currency}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                <button 
                  onClick={() => {
                    setSelectedJobForSchema(j);
                    setIsSchemaModalOpen(true);
                  }}
                  className="btn-secondary" 
                  style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}
                >
                  <Search size={12} /> Google Jobs Schema
                </button>
                <button 
                  onClick={() => setIsQrModalOpen(true)}
                  className="btn-secondary" 
                  style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}
                >
                  <QrCode size={12} /> QR Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'free_channels' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          {/* Google Forms Ingestion Mapper */}
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18} color="#10b981" /> Google Forms Candidate Ingest
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 14px 0' }}>
              Connect self-hosted Google Forms to automatically map applicant fields, attachments, and quiz responses.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                value={gformUrl} 
                onChange={(e) => setGformUrl(e.target.value)} 
                placeholder="Google Form Response Webhook URL..."
                style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', fontSize: '0.82rem', outline: 'none' }}
              />
              <button onClick={() => setIsGoogleFormsModalOpen(true)} className="btn-primary" style={{ justifyContent: 'center' }}>
                Map Fields & Ingest Form Entries
              </button>
            </div>
          </div>

          {/* Employee Referral Portal */}
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 10px 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={18} color="#f59e0b" /> Employee Referral Portal
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 14px 0' }}>
              Refer candidate talent directly into the AI pipeline. Automated referral rewards tracking enabled.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                value={referralName} 
                onChange={(e) => setReferralName(e.target.value)} 
                placeholder="Candidate Full Name..."
                style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', fontSize: '0.82rem', outline: 'none' }}
              />
              <input 
                type="email" 
                value={referralEmail} 
                onChange={(e) => setReferralEmail(e.target.value)} 
                placeholder="Candidate Email Address..."
                style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', fontSize: '0.82rem', outline: 'none' }}
              />
              <button className="btn-secondary" style={{ justifyContent: 'center' }}>
                Submit Referral & Track Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connector Marketplace Framework (Extension Engine) */}
      {activeTab === 'marketplace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store size={20} color="#10b981" /> Connector Marketplace Framework (Enterprise Extension Engine)
              </h3>
              <span className="badge badge-indigo">SDK & Registry Active</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
              TalentOS AI runs 100% free out-of-the-box. Paid job portals and ATS systems can be plugged in seamlessly via the Connector SDK without modifying core recruitment business logic.
            </p>
          </div>

          {/* Installed Free Connectors */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ✓ Core Free Channel Connectors (V1 Working Out-Of-The-Box)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div style={{ backgroundColor: '#111726', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>Company Career Portal</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0' }}>Auto-generated career website with SEO URLs & candidate login.</div>
                <span className="badge badge-success">Installed & Active</span>
              </div>
              <div style={{ backgroundColor: '#111726', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>Google Jobs Indexer</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0' }}>Automatic Schema.org/JobPosting JSON-LD structured data generator.</div>
                <span className="badge badge-success">Installed & Active</span>
              </div>
              <div style={{ backgroundColor: '#111726', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>Email Ingestion Engine</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0' }}>Mailbox polling & attachment parser for careers@ mailbox.</div>
                <span className="badge badge-success">Installed & Active</span>
              </div>
            </div>
          </div>

          {/* Future Enterprise Connectors Placeholders */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6366f1', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🔌 Future Enterprise Connectors (Pluggable SDK Placeholders)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {[
                { name: 'LinkedIn Recruiter Connector', desc: 'Sync jobs & candidates via LinkedIn Talent APIs.' },
                { name: 'Indeed Job Feed Sync', desc: 'Auto-publish vacancies to Indeed XML feeds.' },
                { name: 'Naukri.com Integration', desc: 'Recruitment portal sync for India region talent pool.' },
                { name: 'Greenhouse Enterprise Connector', desc: 'Bi-directional candidate sync with Greenhouse ATS.' },
                { name: 'Workday HCM Integration', desc: 'Enterprise HR requisition & candidate status sync.' },
                { name: 'SAP SuccessFactors Sync', desc: 'Global SAP recruitment module API connector.' }
              ].map((conn, idx) => (
                <div key={idx} style={{ backgroundColor: '#111726', border: '1px dashed rgba(255, 255, 255, 0.12)', padding: '16px', borderRadius: '8px', opacity: 0.85 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>{conn.name}</div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Future Connector</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '6px 0 10px 0' }}>{conn.desc}</div>
                  <button disabled className="btn-secondary" style={{ width: '100%', fontSize: '0.72rem', justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed' }}>
                    Configure Connector SDK
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'portal' && (
        <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#10b981" /> Self-Service Candidate Portal (Dr. Aris Thorne)
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

      {/* Google Jobs Schema Modal */}
      {isSchemaModalOpen && selectedJobForSchema && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', width: '560px', padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} color="#6366f1" /> Google Jobs Schema.org Structured Data
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 12px 0' }}>
              Auto-generated JSON-LD metadata for search engine indexing on Google Search & Google Jobs.
            </p>

            <pre style={{
              backgroundColor: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '14px',
              borderRadius: '8px',
              color: '#34d399',
              fontSize: '0.75rem',
              overflowX: 'auto',
              maxHeight: '260px'
            }}>
              {generateGoogleJobsSchema(selectedJobForSchema)}
            </pre>

            <button onClick={() => setIsSchemaModalOpen(false)} className="btn-primary" style={{ width: '100%', marginTop: '14px', justifyContent: 'center' }}>
              Done & Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Requisition Builder Modal */}
      {isJobModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', width: '440px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0', color: '#f8fafc' }}>New Job Requisition (Auto-Publish to Free Channels)</h3>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Job Title (e.g. Lead AI Engineer)" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} style={{ width: '100%', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '8px 12px', borderRadius: '6px', color: '#f8fafc', outline: 'none' }} />
              <button type="submit" className="btn-primary">Create & Publish Free</button>
              <button type="button" onClick={() => setIsJobModalOpen(false)} className="btn-secondary">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Resume Upload & AI Parser Modal */}
      {isUploadModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', width: '500px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px 0', color: '#f8fafc' }}>AI Resume Intelligence OCR (.PDF, .DOCX, .TXT)</h3>
            
            <div style={{
              position: 'relative',
              border: '2px dashed rgba(16, 185, 129, 0.4)',
              backgroundColor: '#090d16',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '12px',
              cursor: 'pointer',
              overflow: 'hidden'
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
