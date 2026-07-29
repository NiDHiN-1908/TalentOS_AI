import { describe, it, expect } from 'vitest';
import { AuthService } from '../src/application/services/AuthService';
import { RateLimiterService } from '../src/application/services/RateLimiterService';
import { TENANT_ID } from '../src/infrastructure/store/hrStore';

describe('TalentOS AI Authentication & Security System', () => {
  it('should authenticate valid user and return JWT session', async () => {
    const session = await AuthService.login('user@talentos.ai', 'password123', '10.0.0.1', 'Vitest Agent');

    expect(session).toBeDefined();
    expect(session.user.email).toBe('user@talentos.ai');
    expect(session.user.tenantId).toBe(TENANT_ID);
    expect(session.accessToken).toContain('signature_hash_simulated');
    expect(session.refreshToken).toContain('RT-');
  });

  it('should rotate refresh token and issue new access JWT', async () => {
    const session = await AuthService.login('user@talentos.ai', 'password123');
    const oldRefreshToken = session.refreshToken;

    const rotated = await AuthService.refreshToken(oldRefreshToken);

    expect(rotated.accessToken).toBeDefined();
    expect(rotated.refreshToken).not.toBe(oldRefreshToken);

    // Old token should be revoked
    await expect(AuthService.refreshToken(oldRefreshToken)).rejects.toThrow('Invalid or expired refresh token.');
  });

  it('should enforce RBAC permission matrix rules accurately', () => {
    const adminUser = {
      id: 'USR-1',
      tenantId: TENANT_ID,
      email: 'admin@talentos.ai',
      fullName: 'Admin',
      role: 'HR_ADMIN' as const,
      isEmailVerified: true,
      createdAt: '2026-01-01'
    };

    const employeeUser = {
      id: 'USR-2',
      tenantId: TENANT_ID,
      email: 'emp@talentos.ai',
      fullName: 'Emp',
      role: 'EMPLOYEE' as const,
      isEmailVerified: true,
      createdAt: '2026-01-01'
    };

    expect(AuthService.hasPermission(adminUser, 'payroll:read')).toBe(true);
    expect(AuthService.hasPermission(adminUser, 'payroll:approve')).toBe(false); // Only SUPER_ADMIN can approve
    expect(AuthService.hasPermission(employeeUser, 'payroll:read')).toBe(false);
    expect(AuthService.hasPermission(employeeUser, 'employees:read')).toBe(true);
  });

  it('should trigger rate limiting after 5 consecutive failed login attempts', () => {
    const rateKey = 'login:baduser@talentos.ai:192.168.1.50';
    RateLimiterService.clear(rateKey);

    for (let i = 0; i < 5; i++) {
      RateLimiterService.recordAttempt(rateKey, true);
    }

    const check = RateLimiterService.isRateLimited(rateKey);
    expect(check.isLimited).toBe(true);
    expect(check.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('should issue password reset token', () => {
    const email = 'user@talentos.ai';
    const token = AuthService.requestPasswordReset(email);

    expect(token).toContain('RST-');
  });

  it('should revoke active session cleanly', async () => {
    const session = await AuthService.login('user@talentos.ai', 'password123');
    const countBefore = AuthService.getActiveSessions().length;

    AuthService.revokeSession(session.sessionId);
    const countAfter = AuthService.getActiveSessions().length;

    expect(countAfter).toBe(countBefore - 1);
  });
});
