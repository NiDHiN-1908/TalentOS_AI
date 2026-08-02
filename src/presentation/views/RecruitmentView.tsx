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
  Store,
  Clock,
  Check,
  School,
  FileCode,
  UserPlus,
  Settings,
  Activity,
  Terminal,
  BookOpen,
  Lock,
  Download
} from 'lucide-react';
import { hrStore } from '../../infrastructure/store/hrStore';
import { RecruitmentService } from '../../application/services/RecruitmentService';
import { FreeChannelsService, ChannelIngestionResult } from '../../application/services/FreeChannelsService';
import { ConnectorMarketplaceService, ConnectorPluginMeta } from '../../application/services/ConnectorMarketplaceService';
import { Candidate } from '../../domain/types';
import { JobRequisition, InterviewSlot, OfferLetter } from '../../domain/types/recruitment';

export type ScreeningClassification = 
  | 'HIGHLY_RECOMMENDED'
  | 'RECOMMENDED'
  | 'NEEDS_MANUAL_REVIEW'
  | 'LOW_MATCH'
  | 'REJECTED';

export interface TimelineEvent {
  title: string;
  time: string;
  channel: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface ExchangeCandidate extends Candidate {
  classification: ScreeningClassification;
  channelSource: string;
  explanation: string;
  isDuplicate?: boolean;
  duplicateOfId?: string;
  timeline: TimelineEvent[];
}

export const RecruitmentView: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobRequisition[]>(RecruitmentService.getJobs());
  const [interviews, setInterviews] = useState<InterviewSlot[]>(RecruitmentService.getInterviews());
  const [offers, setOffers] = useState<OfferLetter[]>(RecruitmentService.getOffers());
  const [ingestionLogs, setIngestionLogs] = useState<ChannelIngestionResult[]>(FreeChannelsService.getIngestionLogs());
  const [connectors, setConnectors] = useState<ConnectorPluginMeta[]>(ConnectorMarketplaceService.getRegistry());
  const [activeTab, setActiveTab] = useState<'pipeline' | 'jobs' | 'free_channels' | 'marketplace' | 'portal'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQueryPrompt, setAiQueryPrompt] = useState('');

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isConnectorDetailModalOpen, setIsConnectorDetailModalOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorPluginMeta | null>(null);
  const [selectedJobForSchema, setSelectedJobForSchema] = useState<JobRequisition | null>(null);

  // Form State
  const [selectedCandidate, setSelectedCandidate] = useState<ExchangeCandidate | Candidate | null>(null);
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
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Sliders size={10} /> Needs Review</span>;
      case 'LOW_MATCH':
        return <span className="badge badge-orange">Low Match</span>;
      case 'REJECTED':
        return <span className="badge badge-danger">Hard Rejection</span>;
    }
  };

  const exchangeCandidates: ExchangeCandidate[] = candidates.map((c, index) => {
    const skillsList = Array.isArray(c.skills) ? c.skills : [];
    return {
      ...c,
      skills: skillsList,
      classification: getClassification(c.matchScore || 0, c.status || ''),
      channelSource: index % 3 === 0 ? 'Company Career Portal' : index % 3 === 1 ? 'Employee Referral' : 'Email Mailbox Ingest',
      explanation: `Candidate demonstrates ${c.matchScore || 0}% semantic match against target requirements with strong experience in ${skillsList.slice(0, 3).join(', ') || 'relevant fields'}.`,
      isDuplicate: index === 2,
      duplicateOfId: index === 2 ? 'CAN-101' : undefined,
      timeline: [
        { title: 'Application Collected', time: 'Aug 01, 10:14 AM', channel: index % 3 === 0 ? 'Company Career Portal' : index % 3 === 1 ? 'Employee Referral' : 'Email Mailbox', status: 'completed' },
        { title: 'Resume Intelligence OCR Parsed', time: 'Aug 01, 10:15 AM', channel: 'TalentOS AI Core', status: 'completed' },
        { title: 'Multi-Attribute Duplicate Check', time: 'Aug 01, 10:15 AM', channel: 'Database Security Engine', status: 'completed' },
        { title: `AI Screening Match (${c.matchScore || 0}%)`, time: 'Aug 01, 10:16 AM', channel: 'LangGraph Supervisor Agent', status: 'completed' },
        { title: 'Interview Scheduling & Offer Stage', time: 'Pending Supervision', channel: 'Recruiter Workstation', status: 'in_progress' }
      ]
    };
  });

  const filteredCandidates = exchangeCandidates.filter(c => {
    const q = searchQuery.toLowerCase();
    const prompt = aiQueryPrompt.toLowerCase();
    const skillsList = Array.isArray(c.skills) ? c.skills : [];
    
    const matchesSearch = (c.name || '').toLowerCase().includes(q) || (c.appliedRole || '').toLowerCase().includes(q) || skillsList.some(s => (s || '').toLowerCase().includes(q));
    const matchesPrompt = !prompt || (c.name || '').toLowerCase().includes(prompt) || (c.appliedRole || '').toLowerCase().includes(prompt) || skillsList.some(s => (s || '').toLowerCase().includes(prompt)) || (prompt.includes('python') && skillsList.some(s => (s || '').toLowerCase().includes('python'))) || (prompt.includes('langgraph') && skillsList.some(s => (s || '').toLowerCase().includes('agent')));

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

  const handleInstallConnector = (connId: string) => {
    ConnectorMarketplaceService.installConnector(connId);
    setConnectors([...ConnectorMarketplaceService.getRegistry()]);
    if (selectedConnector && selectedConnector.id === connId) {
      setSelectedConnector(ConnectorMarketplaceService.getConnectorById(connId) || null);
    }
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>AI Recruitment Exchange Platform</h2>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={11} /> Free-First Architecture</span>
            <span className="badge badge-indigo">Connector SDK Active</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>
            Unified recruitment exchange managing job publishing, multi-channel application collection, OCR parsing, duplicate merging, AI classification & digital offer onboarding.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsJobModalOpen(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Optimize & Auto-Publish Vacancy
          </button>
          <button onClick={() => setIsUploadModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} /> Resume Intelligence OCR
          </button>
        </div>
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
            Free Ingestion Drivers ({ingestionLogs.length})
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={activeTab === 'marketplace' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Store size={12} color="#10b981" /> Connector Marketplace ({connectors.length})
          </button>
          <button 
            onClick={() => setActiveTab('portal')}
            className={activeTab === 'portal' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.78rem', border: 'none' }}
          >
            Candidate Portal
          </button>
        </div>
      </div>

      {/* Candidate Collection Hub View */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
            <table className="table-container">
              <thead className="table-header">
                <tr>
                  <th>Candidate & Unified Source</th>
                  <th>Applied Role</th>
                  <th>AI Screening Classification</th>
                  <th>Match Score</th>
                  <th>AI Rationale</th>
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
                    <td>{getClassificationBadge(cand.classification)}</td>
                    <td><span style={{ fontWeight: 700, color: cand.matchScore >= 85 ? '#10b981' : '#f59e0b' }}>{cand.matchScore}%</span></td>
                    <td style={{ fontSize: '0.76rem', color: '#94a3b8', maxWidth: '260px' }}>{cand.explanation}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => { setSelectedCandidate(cand); setIsTimelineModalOpen(true); }} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>
                          <Clock size={12} /> Timeline
                        </button>
                        <button onClick={() => { setSelectedCandidate(cand); setIsInterviewModalOpen(true); }} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>
                          <Calendar size={12} /> Schedule
                        </button>
                        <button onClick={() => { setSelectedCandidate(cand); setIsOfferModalOpen(true); }} className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>
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

      {/* Free Publishing Channels View */}
      {activeTab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="#10b981" /> Active Requisitions & Free Publishing Distribution Channels ({jobs.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Vacancies are automatically published to the Company Career Portal & Google Jobs Schema.org structured data network.
              </p>
            </div>
            <button onClick={() => setIsJobModalOpen(true)} className="btn-primary" style={{ fontSize: '0.78rem' }}>
              <Plus size={14} /> Create Requisition
            </button>
          </div>

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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Ingestion Drivers View */}
      {activeTab === 'free_channels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setIsCsvModalOpen(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
              <FileCode size={14} color="#a855f7" /> Bulk CSV / Excel Candidate Import
            </button>
            <button onClick={() => setIsCampusModalOpen(true)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
              <School size={14} color="#ec4899" /> Campus & University Drive Intake
            </button>
          </div>

          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 14px 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#10b981" /> Live Ingestion Stream across 13 Free Channels
            </h3>
            <table className="table-container">
              <thead className="table-header">
                <tr>
                  <th>Candidate Name & ID</th>
                  <th>Channel Driver</th>
                  <th>Email</th>
                  <th>Ingestion Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {ingestionLogs.map((log, idx) => (
                  <tr key={idx} className="table-row">
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>
                      {log.candidateName}
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{log.candidateId}</div>
                    </td>
                    <td style={{ color: '#10b981', fontWeight: 600 }}>{log.channelName}</td>
                    <td style={{ color: '#94a3b8' }}>{log.candidateEmail}</td>
                    <td><span className="badge badge-indigo">{log.status}</span></td>
                    <td style={{ color: '#64748b', fontSize: '0.78rem' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Portal View */}
      {activeTab === 'portal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Globe size={22} color="#10b981" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Company Candidate Self-Service Portal</h3>
              <span className="badge badge-success">Live Candidate Facing UI</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>
              Self-hosted candidate application submission and status tracking portal (`careers.acme.corp`).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
            <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>Candidate Application Status Tracker</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {candidates.slice(0, 3).map(c => (
                  <div key={c.id} style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{c.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>{c.appliedRole}</div>
                    </div>
                    <span className="badge badge-emerald">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>Portal Settings</h4>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>Portal Domain: <strong style={{ color: '#10b981' }}>careers.acme.corp</strong></div>
                <div>SSL Certificate: <span className="badge badge-success">Valid (TLS 1.3)</span></div>
                <div>Status: <span className="badge badge-indigo">Auto-Publish Active</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connector Marketplace Framework View */}
      {activeTab === 'marketplace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store size={20} color="#10b981" /> Extensible Connector Marketplace Framework
              </h3>
              <span className="badge badge-indigo">Connector SDK v2.4</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
              TalentOS AI runs 100% free out-of-the-box using self-hosted channels. Commercial job portals and enterprise ERP connectors are defined via the Connector SDK and marked clearly as <strong>Future Enterprise Connector</strong> placeholders.
            </p>
          </div>

          {/* Connectors Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {connectors.map((conn) => (
              <div key={conn.id} style={{
                backgroundColor: '#111726',
                border: conn.isEnterpriseFuture ? '1px dashed rgba(99, 102, 241, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{conn.name}</h4>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>{conn.provider} • v{conn.version}</div>
                    </div>
                    {conn.isEnterpriseFuture ? (
                      <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Future Enterprise Connector</span>
                    ) : (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Free V1 Core</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '8px 0 14px 0' }}>{conn.description}</p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px', display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      setSelectedConnector(conn);
                      setIsConnectorDetailModalOpen(true);
                    }}
                    className="btn-secondary" 
                    style={{ flex: 1, fontSize: '0.74rem', justifyContent: 'center' }}
                  >
                    <Settings size={12} /> SDK Settings
                  </button>
                  {conn.installed ? (
                    <span className="badge badge-success" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Active</span>
                  ) : (
                    <button 
                      onClick={() => handleInstallConnector(conn.id)}
                      className="btn-primary" 
                      style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                    >
                      <Download size={12} /> Install SDK
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connector Detail, Settings, Permissions & Telemetry Modal */}
      {isConnectorDetailModalOpen && selectedConnector && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', width: '620px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store size={20} color="#10b981" /> {selectedConnector.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Provider: {selectedConnector.provider} • Version: {selectedConnector.version}</div>
              </div>
              {selectedConnector.isEnterpriseFuture ? (
                <span className="badge badge-indigo">Future Enterprise Connector</span>
              ) : (
                <span className="badge badge-success">Free V1 Connector</span>
              )}
            </div>

            {/* SDK Tabs Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Permissions & Scopes
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Read Candidates: {selectedConnector.permissions.readCandidates ? '✓ Granted' : '✗ Denied'}</div>
                  <div>Publish Jobs: {selectedConnector.permissions.writeJobs ? '✓ Granted' : '✗ Denied'}</div>
                  <div>Webhook Events: {selectedConnector.permissions.webhookEvents ? '✓ Enabled' : '✗ Disabled'}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Activity size={12} /> Connector Telemetry & Health
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  <div>Status: <span style={{ color: '#10b981', fontWeight: 700 }}>{selectedConnector.health}</span></div>
                  <div>Last Sync: {selectedConnector.lastSyncTimestamp || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Logs Window */}
            <div style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Terminal size={12} color="#10b981" /> Connector Audit Logs & Telemetry Stream
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontFamily: 'monospace', maxHeight: '100px', overflowY: 'auto' }}>
                {selectedConnector.logs.length === 0 ? (
                  <div>[SDK] Connector initialized. Waiting for API credentials configuration.</div>
                ) : (
                  selectedConnector.logs.map((l, i) => (
                    <div key={i}>[{l.timestamp}] [{l.level}] {l.message}</div>
                  ))
                )}
              </div>
            </div>

            <button onClick={() => setIsConnectorDetailModalOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Save Connector Configuration
            </button>
          </div>
        </div>
      )}

      {/* Candidate Activity Timeline Modal */}
      {isTimelineModalOpen && selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#111726', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', width: '560px', padding: '22px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#10b981" /> Unified Candidate Activity Timeline ({selectedCandidate.name})
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0' }}>
              Single chronologically unified event trace across channel collection, OCR parsing, duplicate check, and interview scheduling.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              {'timeline' in selectedCandidate && (selectedCandidate as ExchangeCandidate).timeline.map((evt, idx) => (
                <div key={idx} style={{ backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ backgroundColor: evt.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)', padding: '6px', borderRadius: '50%' }}>
                    {evt.status === 'completed' ? <Check size={14} color="#10b981" /> : <Clock size={14} color="#6366f1" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>{evt.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Channel: {evt.channel} • {evt.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setIsTimelineModalOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close Timeline Viewer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
