import { 
  JobRequisition, 
  ResumeParseResult, 
  RecruitmentNotification 
} from '../../domain/types/recruitment';
import { Candidate } from '../../domain/types';

export class RecruitmentAgentEngine {

  public static parseResumeText(rawText: string, candidateId: string): ResumeParseResult {
    const text = rawText.toLowerCase();
    const skillsFound: string[] = [];

    const skillCatalog = ['pytorch', 'tensorflow', 'react', 'typescript', 'python', 'go', 'kubernetes', 'aws', 'docker', 'system design', 'agentic systems', 'sql'];
    skillCatalog.forEach(s => {
      if (text.includes(s)) {
        skillsFound.push(s.charAt(0).toUpperCase() + s.slice(1));
      }
    });

    const expMatch = text.match(/(\d+)\s*\+?\s*years/i);
    const expYears = expMatch ? parseInt(expMatch[1], 10) : 5;

    return {
      candidateId,
      parsedName: 'Extracted Candidate Name',
      parsedEmail: 'extracted.candidate@example.com',
      experienceYears: expYears,
      skillsExtracted: skillsFound.length > 0 ? skillsFound : ['AI Systems', 'TypeScript', 'System Architecture'],
      education: 'B.S. in Computer Science & Artificial Intelligence',
      summary: `Automated Resume Parsing Result: Candidate exhibits ${expYears} years relevant experience with core strengths in ${skillsFound.join(', ')}.`
    };
  }

  public static rankCandidateAgainstJob(candidate: Candidate, job: JobRequisition): { score: number; pros: string[]; cons: string[]; recommendation: string } {
    let score = 50;
    const pros: string[] = [];
    const cons: string[] = [];

    // Experience match
    if (candidate.experienceYears >= 5) {
      score += 25;
      pros.push(`Strong seniority (${candidate.experienceYears} years experience)`);
    } else {
      score += 10;
      cons.push('Junior experience level for lead role');
    }

    // Skills match
    const matchedSkills = candidate.keySkills.filter(s => 
      job.requiredSkills.some(rs => rs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(rs.toLowerCase()))
    );

    if (matchedSkills.length > 0) {
      score += 20;
      pros.push(`Direct skill alignment: ${matchedSkills.join(', ')}`);
    } else {
      cons.push('Missing core primary required skills');
    }

    score = Math.min(score, 98);

    const recommendation = score >= 85 
      ? 'Strong Hire: Advance candidate to fast-track technical interview.' 
      : score >= 70 
        ? 'Consider: Recommend initial HR phone screen.' 
        : 'Pass: Skills do not align with current job requisition.';

    return { score, pros, cons, recommendation };
  }

  public static generateNotification(
    type: RecruitmentNotification['type'],
    recipientEmail: string,
    details: Record<string, any>
  ): RecruitmentNotification {
    let subject = 'TalentOS AI — Update regarding your application';
    let body = 'Thank you for your interest in joining our team.';

    if (type === 'InterviewInvite') {
      subject = `Interview Invitation: ${details.roleTitle} at TalentOS AI`;
      body = `Hi ${details.candidateName},\n\nYou have been invited to an interview for ${details.roleTitle} on ${details.scheduledTime}.\nMeeting Link: ${details.meetingUrl}\n\nBest regards,\nTalentOS AI Recruitment Team`;
    } else if (type === 'OfferLetter') {
      subject = `Offer Letter: ${details.roleTitle} at TalentOS AI`;
      body = `Dear ${details.candidateName},\n\nWe are thrilled to offer you the position of ${details.roleTitle} with a base salary of ${details.currency} $${details.baseSalary.toLocaleString()}.\n\nPlease review and sign your offer in the Candidate Portal.\n\nWarmly,\nExecutive Leadership`;
    }

    return {
      id: `NTF-${Date.now()}`,
      tenantId: details.tenantId || 'TNT-TALENTOS-01',
      recipientEmail,
      subject,
      body,
      sentAt: new Date().toISOString(),
      type
    };
  }
}
