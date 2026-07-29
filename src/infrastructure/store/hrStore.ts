import { 
  Employee, 
  Candidate, 
  PayrollRun, 
  LearningTrack, 
  PerformanceReviewSummary, 
  AgentExecutionDAG, 
  ApprovalRequest 
} from '../../domain/types';
import { AuditService } from '../../application/services/AuditService';

export const TENANT_ID = 'TNT-TALENTOS-01';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-101',
    tenantId: TENANT_ID,
    name: 'Sarah Chen',
    email: 'sarah.chen@talentos.ai',
    role: 'Principal AI Engineer',
    department: 'Engineering',
    hireDate: '2024-03-15',
    salary: 195000,
    currency: 'USD',
    flightRisk: 'Low',
    flightRiskReason: 'High engagement score (94%), recent bonus & promotion.',
    performanceScore: 4.9,
    onboardingStatus: 'Completed',
    skills: ['PyTorch', 'Agentic Systems', 'LLM Fine-tuning', 'Distributed Systems'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'EMP-102',
    tenantId: TENANT_ID,
    name: 'Marcus Vance',
    email: 'marcus.vance@talentos.ai',
    role: 'Senior Product Designer',
    department: 'Design',
    hireDate: '2023-11-01',
    salary: 160000,
    currency: 'USD',
    flightRisk: 'High',
    flightRiskReason: 'Logged below-average 1-on-1 sentiment, external LinkedIn updates detected.',
    performanceScore: 4.2,
    onboardingStatus: 'Completed',
    skills: ['Design Systems', 'Figma', 'Glassmorphism', 'User Research'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'EMP-103',
    tenantId: TENANT_ID,
    name: 'Elena Rostova',
    email: 'elena.rostova@talentos.ai',
    role: 'Staff Data Engineer',
    department: 'Data & Analytics',
    hireDate: '2025-01-10',
    salary: 175000,
    currency: 'USD',
    flightRisk: 'Medium',
    flightRiskReason: 'Heavy workload spikes in last 2 quarters.',
    performanceScore: 4.7,
    onboardingStatus: 'Completed',
    skills: ['Snowflake', 'dbt', 'Apache Spark', 'Kafka'],
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'EMP-104',
    tenantId: TENANT_ID,
    name: 'David Okafor',
    email: 'david.okafor@talentos.ai',
    role: 'HR Business Partner',
    department: 'People Operations',
    hireDate: '2026-02-01',
    salary: 130000,
    currency: 'USD',
    flightRisk: 'Low',
    flightRiskReason: 'New hire, highly aligned with company mission.',
    performanceScore: 4.5,
    onboardingStatus: 'Completed',
    skills: ['Talent Acquisition', 'Employee Relations', 'Comp & Benefits'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'EMP-105',
    tenantId: TENANT_ID,
    name: 'Alex Rivera',
    email: 'alex.rivera@talentos.ai',
    role: 'DevOps Lead',
    department: 'Infrastructure',
    hireDate: '2026-06-15',
    salary: 165000,
    currency: 'USD',
    flightRisk: 'Low',
    flightRiskReason: 'Smooth onboarding phase.',
    performanceScore: 4.4,
    onboardingStatus: 'In Progress',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD Pipelines'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'CAN-801',
    tenantId: TENANT_ID,
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@stanford.edu',
    appliedRole: 'Senior AI Researcher',
    department: 'AI Research',
    experienceYears: 7,
    matchScore: 96,
    resumeSummary: 'Ex-DeepMind research scientist with 14 top-tier NeurIPS/ICLR papers on multi-agent alignment & tool synthesis.',
    keySkills: ['Multi-Agent Systems', 'RLHF', 'PyTorch', 'Transformer Architecture'],
    status: 'Interview Scheduled',
    aiRecommendation: 'Strong Hire. Top 1% candidate for Supervisor Agent alignment optimization.'
  },
  {
    id: 'CAN-802',
    tenantId: TENANT_ID,
    name: 'Maya Patel',
    email: 'maya.patel@techcorp.io',
    appliedRole: 'Senior Frontend Engineer',
    department: 'Engineering',
    experienceYears: 5,
    matchScore: 91,
    resumeSummary: 'Frontend architect specializing in high-performance WebGL dashboards, React 18, and design systems.',
    keySkills: ['React', 'TypeScript', 'Vite', 'Three.js', 'Tailwind/CSS'],
    status: 'Screened',
    aiRecommendation: 'Recommend technical interview. Excellent experience scaling complex analytical UIs.'
  },
  {
    id: 'CAN-803',
    tenantId: TENANT_ID,
    name: 'Liam Sterling',
    email: 'l.sterling@fintech.co',
    appliedRole: 'Payroll Operations Lead',
    department: 'Finance & HR Ops',
    experienceYears: 8,
    matchScore: 88,
    resumeSummary: 'Certified Payroll Professional (CPP) with deep knowledge of global multi-jurisdiction compliance and Workday integrations.',
    keySkills: ['US Payroll', 'Tax Compliance', 'Workday', 'Audit Reporting'],
    status: 'Sourced',
    aiRecommendation: 'Good candidate. Strong compliance background matches our payroll agent validation requirements.'
  }
];

export const INITIAL_PAYROLL_RUN: PayrollRun = {
  id: 'PAY-2026-07',
  tenantId: TENANT_ID,
  period: 'July 2026',
  totalGross: 825000,
  employeeCount: 42,
  anomaliesCount: 2,
  status: 'Audited',
  createdAt: '2026-07-25T08:00:00Z',
  anomalies: [
    {
      id: 'ANO-901',
      employeeId: 'EMP-103',
      employeeName: 'Elena Rostova',
      type: 'Salary Spike',
      description: 'Gross pay increased by +28% vs previous month due to unapproved retroactive bonus adjustment.',
      varianceAmount: 4800,
      severity: 'High'
    },
    {
      id: 'ANO-902',
      employeeId: 'EMP-105',
      employeeName: 'Alex Rivera',
      type: 'Tax ID Missing',
      description: 'State tax identification number missing for recently relocated residence in California.',
      severity: 'Medium'
    }
  ]
};

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'APR-501',
    tenantId: TENANT_ID,
    agentType: 'PAYROLL',
    title: 'Approve July 2026 Payroll Execution ($825,000)',
    description: 'Payroll Agent audited 42 employees. 2 anomalies detected and flagged for manager override.',
    details: {
      totalGross: '$825,000',
      payDate: 'July 31, 2026',
      anomalies: '2 Flagged items (1 Salary Spike, 1 Tax ID missing)'
    },
    status: 'pending',
    slaExpiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: '2026-07-28T14:30:00Z'
  },
  {
    id: 'APR-502',
    tenantId: TENANT_ID,
    agentType: 'RECRUITMENT',
    title: 'Extend Offer Letter to Dr. Aris Thorne ($210,000 Base + Equity)',
    description: 'Recruitment Agent completed 4 round evaluations. Candidate scored 96% match rating.',
    details: {
      role: 'Senior AI Researcher',
      baseSalary: '$210,000',
      equityOptions: '25,000 RSUs',
      startDate: 'September 1, 2026'
    },
    status: 'pending',
    slaExpiresAt: new Date(Date.now() + 172800000).toISOString(),
    createdAt: '2026-07-29T09:15:00Z'
  }
];

export const INITIAL_LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'LRN-01',
    tenantId: TENANT_ID,
    employeeId: 'EMP-103',
    employeeName: 'Elena Rostova',
    targetSkill: 'Real-time Stream Processing (Flink)',
    currentLevel: 'Intermediate',
    targetLevel: 'Advanced Expert',
    recommendedCourse: 'Enterprise Apache Flink Architecture & Stream Joins',
    progressPercent: 65,
    deadline: '2026-08-30'
  },
  {
    id: 'LRN-02',
    tenantId: TENANT_ID,
    employeeId: 'EMP-105',
    employeeName: 'Alex Rivera',
    targetSkill: 'SOC2 & Zero-Trust Security Compliance',
    currentLevel: 'Beginner',
    targetLevel: 'Certified',
    recommendedCourse: 'Enterprise DevSecOps & Cloud Compliance Mastery',
    progressPercent: 40,
    deadline: '2026-09-15'
  }
];

export const INITIAL_PERFORMANCE_SUMMARIES: PerformanceReviewSummary[] = [
  {
    id: 'PRF-01',
    tenantId: TENANT_ID,
    employeeId: 'EMP-101',
    employeeName: 'Sarah Chen',
    period: 'H1 2026',
    overallRating: 4.9,
    strengths: ['Exceptional AI System Architecture', 'Cross-functional Leadership', 'Zero-downtime Agent Deployments'],
    growthAreas: ['Delegate operational monitoring to junior engineers'],
    sentimentScore: 0.92,
    aiSummary: 'Top tier contributor driving TalentOS AI core engine. High retention stability and mentor capability.'
  },
  {
    id: 'PRF-02',
    tenantId: TENANT_ID,
    employeeId: 'EMP-102',
    employeeName: 'Marcus Vance',
    period: 'H1 2026',
    overallRating: 4.2,
    strengths: ['Beautiful visual craft', 'Rapid prototyping', 'Design system maintainability'],
    growthAreas: ['Workload balance', 'Communicating design trade-offs earlier'],
    sentimentScore: 0.15,
    aiSummary: 'High technical visual output, but sentiment analysis highlights stress & potential attrition risk. Immediate intervention recommended.'
  }
];

class HRStore {
  private currentTenantId: string = TENANT_ID;
  private employees: Employee[] = [...INITIAL_EMPLOYEES];
  private candidates: Candidate[] = [...INITIAL_CANDIDATES];
  private payrollRun: PayrollRun = { ...INITIAL_PAYROLL_RUN };
  private approvals: ApprovalRequest[] = [...INITIAL_APPROVALS];
  private learningTracks: LearningTrack[] = [...INITIAL_LEARNING_TRACKS];
  private performanceSummaries: PerformanceReviewSummary[] = [...INITIAL_PERFORMANCE_SUMMARIES];
  private activeDAG: AgentExecutionDAG | null = null;
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Getters with Tenant Scoping
  public getTenantId(): string { return this.currentTenantId; }
  public getEmployees(): Employee[] { return this.employees.filter(e => e.tenantId === this.currentTenantId); }
  public getCandidates(): Candidate[] { return this.candidates.filter(c => c.tenantId === this.currentTenantId); }
  public getPayrollRun(): PayrollRun { return this.payrollRun; }
  public getApprovals(): ApprovalRequest[] { return this.approvals.filter(a => a.tenantId === this.currentTenantId); }
  public getLearningTracks(): LearningTrack[] { return this.learningTracks.filter(l => l.tenantId === this.currentTenantId); }
  public getPerformanceSummaries(): PerformanceReviewSummary[] { return this.performanceSummaries.filter(p => p.tenantId === this.currentTenantId); }
  public getActiveDAG(): AgentExecutionDAG | null { return this.activeDAG; }

  // Mutations with Audit Dispatch
  public setActiveDAG(dag: AgentExecutionDAG | null) {
    this.activeDAG = dag;
    if (dag) {
      AuditService.log(dag.tenantId, 'SUPERVISOR_AGENT', 'DAG_STATE_UPDATED', `DAG ${dag.id} status: ${dag.status}`, 'SUPERVISOR');
    }
    this.notify();
  }

  public updateApprovalStatus(id: string, status: 'approved' | 'rejected') {
    this.approvals = this.approvals.map(app => 
      app.id === id ? { ...app, status } : app
    );
    AuditService.log(this.currentTenantId, 'MANAGER_USER', 'APPROVAL_DECISION', `Request ${id} marked as ${status}`);
    this.notify();
  }

  public addCandidate(candidate: Candidate) {
    this.candidates = [candidate, ...this.candidates];
    AuditService.log(candidate.tenantId, 'RECRUITMENT_AGENT', 'CANDIDATE_SOURCED', `Candidate ${candidate.name} added to pipeline`, 'RECRUITMENT');
    this.notify();
  }

  public updateCandidateStatus(id: string, status: Candidate['status']) {
    this.candidates = this.candidates.map(c => c.id === id ? { ...c, status } : c);
    AuditService.log(this.currentTenantId, 'RECRUITMENT_AGENT', 'CANDIDATE_STATUS_CHANGED', `Candidate ${id} moved to ${status}`, 'RECRUITMENT');
    this.notify();
  }

  public resolvePayrollAnomaly(anomalyId: string) {
    if (!this.payrollRun) return;
    const updatedAnomalies = this.payrollRun.anomalies.filter(a => a.id !== anomalyId);
    this.payrollRun = {
      ...this.payrollRun,
      anomalies: updatedAnomalies,
      anomaliesCount: updatedAnomalies.length
    };
    AuditService.log(this.currentTenantId, 'PAYROLL_AGENT', 'ANOMALY_RESOLVED', `Payroll anomaly ${anomalyId} marked resolved`, 'PAYROLL');
    this.notify();
  }
}

export const hrStore = new HRStore();
