export type JobStatus = 'Draft' | 'Open' | 'Paused' | 'Closed';

export interface JobRequisition {
  id: string;
  tenantId: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  headcount: number;
  requiredSkills: string[];
  description: string;
  status: JobStatus;
  createdAt: string;
}

export interface ResumeParseResult {
  candidateId: string;
  parsedName: string;
  parsedEmail: string;
  parsedPhone?: string;
  experienceYears: number;
  skillsExtracted: string[];
  education: string;
  summary: string;
}

export interface InterviewSlot {
  id: string;
  tenantId: string;
  candidateId: string;
  candidateName: string;
  interviewerId: string;
  interviewerName: string;
  roleTitle: string;
  scheduledTime: string;
  durationMinutes: number;
  meetingUrl: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface OfferLetter {
  id: string;
  tenantId: string;
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  department: string;
  baseSalary: number;
  currency: string;
  equity: string;
  startDate: string;
  expirationDate: string;
  status: 'Draft' | 'Sent' | 'Signed' | 'Declined';
  signedAt?: string;
}

export interface RecruitmentNotification {
  id: string;
  tenantId: string;
  recipientEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'InterviewInvite' | 'OfferLetter' | 'ApplicationReceipt' | 'StatusUpdate';
}
