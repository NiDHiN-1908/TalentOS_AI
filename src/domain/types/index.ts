export type AgentType = 
  | 'SUPERVISOR'
  | 'RECRUITMENT'
  | 'ONBOARDING'
  | 'PAYROLL'
  | 'PERFORMANCE'
  | 'LEARNING'
  | 'EXECUTIVE_AI';

export type TaskStatus = 'pending' | 'in_progress' | 'awaiting_approval' | 'completed' | 'failed';

export interface AgentToolCall {
  id: string;
  toolName: string;
  arguments: Record<string, any>;
  result?: any;
  timestamp: string;
}

export interface AgentExecutionStep {
  id: string;
  agentType: AgentType;
  action: string;
  thought: string;
  status: TaskStatus;
  toolCalls?: AgentToolCall[];
  durationMs?: number;
  tokensUsed?: number;
  costUsd?: number;
  output?: string;
  timestamp: string;
}

export interface AgentExecutionDAG {
  id: string;
  tenantId: string;
  goalPrompt: string;
  steps: AgentExecutionStep[];
  status: TaskStatus;
  currentStepIndex: number;
  totalTokens: number;
  totalCostUsd: number;
  createdAt: string;
  completedAt?: string;
}

export interface ApprovalRequest {
  id: string;
  tenantId: string;
  agentType: AgentType;
  title: string;
  description: string;
  details: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  slaExpiresAt: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  hireDate: string;
  salary: number;
  currency: string;
  flightRisk: 'Low' | 'Medium' | 'High';
  flightRiskReason?: string;
  performanceScore: number;
  onboardingStatus: 'Completed' | 'In Progress' | 'Pending';
  skills: string[];
  avatarUrl?: string;
}

export interface Candidate {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  appliedRole: string;
  department: string;
  experienceYears: number;
  matchScore: number;
  resumeSummary: string;
  keySkills: string[];
  status: 'Sourced' | 'Screened' | 'Interview Scheduled' | 'Offer Extended' | 'Hired';
  aiRecommendation: string;
}

export interface PayrollAnomaly {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Salary Spike' | 'Tax ID Missing' | 'Unapproved OT' | 'Duplicate Account';
  description: string;
  varianceAmount?: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface PayrollRun {
  id: string;
  tenantId: string;
  period: string;
  totalGross: number;
  employeeCount: number;
  anomaliesCount: number;
  anomalies: PayrollAnomaly[];
  status: 'Draft' | 'Audited' | 'Awaiting Approval' | 'Approved' | 'Executed';
  createdAt: string;
}

export interface LearningTrack {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  targetSkill: string;
  currentLevel: string;
  targetLevel: string;
  recommendedCourse: string;
  progressPercent: number;
  deadline: string;
}

export interface PerformanceReviewSummary {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  period: string;
  overallRating: number;
  strengths: string[];
  growthAreas: string[];
  sentimentScore: number;
  aiSummary: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actor: string;
  agentType?: AgentType;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface MemoryEntry {
  id: string;
  tenantId: string;
  memoryType: 'working' | 'episodic' | 'semantic';
  content: string;
  metadata: Record<string, any>;
  timestamp: string;
}
