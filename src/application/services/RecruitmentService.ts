import { 
  JobRequisition, 
  InterviewSlot, 
  OfferLetter, 
  RecruitmentNotification,
  ResumeParseResult 
} from '../../domain/types/recruitment';
import { Candidate } from '../../domain/types';
import { hrStore, TENANT_ID } from '../../infrastructure/store/hrStore';
import { RecruitmentAgentEngine } from '../agents/RecruitmentAgentEngine';
import { AuditService } from './AuditService';

export class RecruitmentService {
  private static jobs: JobRequisition[] = [
    {
      id: 'JOB-301',
      tenantId: TENANT_ID,
      title: 'Senior AI Researcher',
      department: 'AI Research',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-time',
      salaryMin: 180000,
      salaryMax: 240000,
      currency: 'USD',
      headcount: 2,
      requiredSkills: ['Multi-Agent Systems', 'PyTorch', 'RLHF', 'Transformers'],
      description: 'Lead research and deployment of autonomous supervisor multi-agent frameworks.',
      status: 'Open',
      createdAt: '2026-07-01T00:00:00Z'
    },
    {
      id: 'JOB-302',
      tenantId: TENANT_ID,
      title: 'Principal Frontend Engineer',
      department: 'Engineering',
      location: 'Remote US',
      type: 'Full-time',
      salaryMin: 160000,
      salaryMax: 210000,
      currency: 'USD',
      headcount: 1,
      requiredSkills: ['React', 'TypeScript', 'Vite', 'Design Systems'],
      description: 'Architect next-generation cyberpunk glassmorphism analytical dashboards.',
      status: 'Open',
      createdAt: '2026-07-10T00:00:00Z'
    }
  ];

  private static interviews: InterviewSlot[] = [];
  private static offers: OfferLetter[] = [];
  private static notifications: RecruitmentNotification[] = [];

  public static getJobs(): JobRequisition[] {
    return this.jobs;
  }

  public static createJob(job: Omit<JobRequisition, 'id' | 'tenantId' | 'createdAt'>): JobRequisition {
    const newJob: JobRequisition = {
      ...job,
      id: `JOB-${Date.now()}`,
      tenantId: hrStore.getTenantId(),
      createdAt: new Date().toISOString()
    };
    this.jobs.unshift(newJob);
    AuditService.log(newJob.tenantId, 'RECRUITER_USER', 'JOB_CREATED', `Job Requisition Created: ${newJob.title}`);
    return newJob;
  }

  public static parseResume(rawText: string, candidateId: string): ResumeParseResult {
    const result = RecruitmentAgentEngine.parseResumeText(rawText, candidateId);
    AuditService.log(hrStore.getTenantId(), 'RECRUITMENT_AGENT', 'RESUME_PARSED', `Parsed resume for candidate ${candidateId}`);
    return result;
  }

  public static rankCandidates(jobId: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return [];

    const candidates = hrStore.getCandidates();
    return candidates.map(c => {
      const evaluation = RecruitmentAgentEngine.rankCandidateAgainstJob(c, job);
      return { candidate: c, evaluation };
    });
  }

  public static scheduleInterview(candidateId: string, interviewerName: string, scheduledTime: string): InterviewSlot {
    const candidate = hrStore.getCandidates().find(c => c.id === candidateId);
    const slot: InterviewSlot = {
      id: `INT-${Date.now()}`,
      tenantId: hrStore.getTenantId(),
      candidateId,
      candidateName: candidate ? candidate.name : 'Unknown Candidate',
      interviewerId: 'EMP-101',
      interviewerName,
      roleTitle: candidate ? candidate.appliedRole : 'Open Position',
      scheduledTime,
      durationMinutes: 45,
      meetingUrl: `https://meet.talentos.ai/room-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Scheduled'
    };

    this.interviews.unshift(slot);
    hrStore.updateCandidateStatus(candidateId, 'Interview Scheduled');

    // Generate Email Notification
    const notif = RecruitmentAgentEngine.generateNotification('InterviewInvite', candidate ? candidate.email : 'candidate@example.com', {
      candidateName: slot.candidateName,
      roleTitle: slot.roleTitle,
      scheduledTime: slot.scheduledTime,
      meetingUrl: slot.meetingUrl
    });
    this.notifications.unshift(notif);

    AuditService.log(slot.tenantId, 'RECRUITMENT_AGENT', 'INTERVIEW_SCHEDULED', `Scheduled interview for ${slot.candidateName} at ${scheduledTime}`);
    return slot;
  }

  public static generateOffer(candidateId: string, baseSalary: number, equity: string): OfferLetter {
    const candidate = hrStore.getCandidates().find(c => c.id === candidateId);
    const offer: OfferLetter = {
      id: `OFR-${Date.now()}`,
      tenantId: hrStore.getTenantId(),
      candidateId,
      candidateName: candidate ? candidate.name : 'Candidate',
      roleTitle: candidate ? candidate.appliedRole : 'Senior Engineer',
      department: candidate ? candidate.department : 'Engineering',
      baseSalary,
      currency: 'USD',
      equity,
      startDate: '2026-09-01',
      expirationDate: '2026-08-15',
      status: 'Sent'
    };

    this.offers.unshift(offer);
    hrStore.updateCandidateStatus(candidateId, 'Offer Extended');

    // Generate Email Notification
    const notif = RecruitmentAgentEngine.generateNotification('OfferLetter', candidate ? candidate.email : 'candidate@example.com', {
      candidateName: offer.candidateName,
      roleTitle: offer.roleTitle,
      currency: offer.currency,
      baseSalary: offer.baseSalary
    });
    this.notifications.unshift(notif);

    AuditService.log(offer.tenantId, 'RECRUITMENT_AGENT', 'OFFER_GENERATED', `Offer letter generated for ${offer.candidateName} ($${baseSalary})`);
    return offer;
  }

  public static getInterviews(): InterviewSlot[] { return this.interviews; }
  public static getOffers(): OfferLetter[] { return this.offers; }
  public static getNotifications(): RecruitmentNotification[] { return this.notifications; }
}
