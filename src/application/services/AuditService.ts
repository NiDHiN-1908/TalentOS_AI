import { AuditLog } from '../../domain/types';

export class AuditService {
  private static logs: AuditLog[] = [];

  public static log(tenantId: string, actor: string, action: string, details: string, agentType?: AuditLog['agentType']) {
    const maskedDetails = this.maskPII(details);
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      actor,
      agentType,
      action,
      details: maskedDetails,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(newLog);
    return newLog;
  }

  public static getLogs(tenantId?: string): AuditLog[] {
    if (!tenantId) return this.logs;
    return this.logs.filter(l => l.tenantId === tenantId);
  }

  public static maskPII(text: string): string {
    if (!text) return '';
    // Mask SSN patterns (000-00-0000)
    let masked = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, 'XXX-XX-XXXX');
    // Mask Credit Card / Bank Account patterns
    masked = masked.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '****-****-****-****');
    // Mask Email Addresses partially
    masked = masked.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, user, domain) => {
      const maskedUser = user.length > 2 ? user.substring(0, 2) + '***' : '***';
      return `${maskedUser}@${domain}`;
    });
    return masked;
  }
}
