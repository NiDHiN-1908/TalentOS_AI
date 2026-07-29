import { describe, it, expect } from 'vitest';
import { RecruitmentService } from '../src/application/services/RecruitmentService';
import { RecruitmentAgentEngine } from '../src/application/agents/RecruitmentAgentEngine';
import { hrStore } from '../src/infrastructure/store/hrStore';

describe('TalentOS AI Recruitment & ATS Module Suite', () => {
  it('should create new job requisitions', () => {
    const initialJobsCount = RecruitmentService.getJobs().length;
    const newJob = RecruitmentService.createJob({
      title: 'Senior DevOps Architect',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Full-time',
      salaryMin: 170000,
      salaryMax: 220000,
      currency: 'USD',
      headcount: 1,
      requiredSkills: ['Kubernetes', 'Terraform', 'AWS'],
      description: 'Lead cloud infrastructure deployment.',
      status: 'Open'
    });

    expect(newJob.id).toContain('JOB-');
    expect(RecruitmentService.getJobs().length).toBe(initialJobsCount + 1);
  });

  it('should parse resume text with AI Recruitment Agent Engine', () => {
    const rawResume = 'Experienced PyTorch and TypeScript architect with 7 years building agentic AI systems.';
    const result = RecruitmentAgentEngine.parseResumeText(rawResume, 'CAN-801');

    expect(result.experienceYears).toBe(7);
    expect(result.skillsExtracted).toContain('Pytorch');
    expect(result.skillsExtracted).toContain('Typescript');
  });

  it('should rank candidates against job requisition specs', () => {
    const candidate = hrStore.getCandidates()[0]; // Dr. Aris Thorne
    const job = RecruitmentService.getJobs()[0];

    const ranking = RecruitmentAgentEngine.rankCandidateAgainstJob(candidate, job);

    expect(ranking.score).toBeGreaterThanOrEqual(80);
    expect(ranking.recommendation).toContain('Strong Hire');
  });

  it('should schedule interviews and generate email notifications', () => {
    const candidateId = 'CAN-801';
    const slot = RecruitmentService.scheduleInterview(candidateId, 'Sarah Chen', '2026-08-10T14:00');

    expect(slot.id).toContain('INT-');
    expect(slot.status).toBe('Scheduled');

    const notifications = RecruitmentService.getNotifications();
    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].type).toBe('InterviewInvite');
  });

  it('should generate offer letters and send candidate notifications', () => {
    const candidateId = 'CAN-801';
    const offer = RecruitmentService.generateOffer(candidateId, 220000, '30,000 RSUs');

    expect(offer.id).toContain('OFR-');
    expect(offer.baseSalary).toBe(220000);
    expect(offer.status).toBe('Sent');

    const candidate = hrStore.getCandidates().find(c => c.id === candidateId);
    expect(candidate?.status).toBe('Offer Extended');
  });
});
