import { Candidate } from '../../domain/types';

export interface ChannelIngestionResult {
  candidateId: string;
  channelName: string;
  candidateName: string;
  candidateEmail: string;
  status: string;
  timestamp: string;
}

export class FreeChannelsService {
  private static mockIngestedLogs: ChannelIngestionResult[] = [
    { candidateId: 'CAN-101', channelName: 'Company Career Portal', candidateName: 'Dr. Aris Thorne', candidateEmail: 'aris.thorne@example.com', status: 'Ingested & AI Parsed', timestamp: '2026-08-01 10:14' },
    { candidateId: 'CAN-102', channelName: 'Google Jobs SEO', candidateName: 'Maya Lin', candidateEmail: 'maya.lin@example.com', status: 'Ingested & AI Parsed', timestamp: '2026-08-01 11:30' },
    { candidateId: 'CAN-103', channelName: 'Employee Referral Portal', candidateName: 'Jordan Vance', candidateEmail: 'jordan.vance@example.com', status: 'Referral Rewards Logged', timestamp: '2026-08-01 14:05' },
    { candidateId: 'CAN-104', channelName: 'Email Ingest (careers@)', candidateName: 'Liam O\'Connor', candidateEmail: 'liam.oc@example.com', status: 'Attachment OCR Extracted', timestamp: '2026-08-01 15:45' },
    { candidateId: 'CAN-105', channelName: 'Google Forms Mapper', candidateName: 'Elena Rostova', candidateEmail: 'elena.r@example.com', status: 'Field Mapped & Saved', timestamp: '2026-08-01 16:20' },
    { candidateId: 'CAN-106', channelName: 'Campus & University Drive', candidateName: 'Rohan Sharma', candidateEmail: 'rohan.s@university.edu', status: 'Campus Intake Recorded', timestamp: '2026-08-01 17:10' }
  ];

  /**
   * Parse raw CSV / Excel candidate records
   */
  public static parseCsvCandidates(csvText: string): ChannelIngestionResult[] {
    const lines = csvText.trim().split('\n');
    const results: ChannelIngestionResult[] = [];

    lines.forEach((line, index) => {
      if (index === 0 && line.toLowerCase().includes('name')) return; // Header skip
      const parts = line.split(',');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const email = parts[1].trim();
        results.push({
          candidateId: `CAN-CSV-${Math.floor(Math.random() * 9000) + 1000}`,
          channelName: 'CSV / Excel Bulk Import',
          candidateName: name,
          candidateEmail: email,
          status: 'Batch Ingested',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
      }
    });

    this.mockIngestedLogs.unshift(...results);
    return results;
  }

  /**
   * Process Google Forms Webhook Submission
   */
  public static processGoogleFormsSubmission(formId: string, responses: Record<string, string>): ChannelIngestionResult {
    const candidateName = responses['Name'] || responses['Full Name'] || 'Google Form Applicant';
    const candidateEmail = responses['Email'] || 'gform.applicant@example.com';

    const result: ChannelIngestionResult = {
      candidateId: `CAN-GF-${Math.floor(Math.random() * 9000) + 1000}`,
      channelName: 'Google Forms Webhook Ingest',
      candidateName,
      candidateEmail,
      status: 'Mapped & Ingested',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    this.mockIngestedLogs.unshift(result);
    return result;
  }

  /**
   * Submit Campus & University Recruitment Drive Entry
   */
  public static submitCampusCandidate(universityName: string, candidateName: string, candidateEmail: string, gpa: string): ChannelIngestionResult {
    const result: ChannelIngestionResult = {
      candidateId: `CAN-UNI-${Math.floor(Math.random() * 9000) + 1000}`,
      channelName: `University Drive (${universityName})`,
      candidateName,
      candidateEmail,
      status: `Campus Intake (GPA ${gpa})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    this.mockIngestedLogs.unshift(result);
    return result;
  }

  /**
   * Generate QR Code Vector Data for Recruitment Campaign Flyers
   */
  public static generateRecruitmentQrPayload(jobId: string, jobTitle: string): string {
    const campaignUrl = `https://careers.talentos.ai/apply/${jobId}?utm_source=qr_flyer`;
    return `QR_DATA:${campaignUrl}:${jobTitle}`;
  }

  /**
   * Get Recent Free Channel Ingestion Logs
   */
  public static getIngestionLogs(): ChannelIngestionResult[] {
    return this.mockIngestedLogs;
  }
}
