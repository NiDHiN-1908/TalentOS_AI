import { 
  AuthUser, 
  JWTPayload, 
  PermissionCode, 
  RefreshToken, 
  UserRole, 
  UserSession, 
  ROLE_PERMISSIONS_MATRIX, 
  PasswordResetToken 
} from '../../domain/types/auth';
import { hrStore, TENANT_ID } from '../../infrastructure/store/hrStore';
import { AuditService } from './AuditService';
import { RateLimiterService } from './RateLimiterService';

export class AuthService {
  private static activeSessions: Map<string, UserSession> = new Map();
  private static refreshTokens: Map<string, RefreshToken> = new Map();
  private static passwordResetTokens: Map<string, PasswordResetToken> = new Map();
  private static emailVerificationTokens: Map<string, { email: string; token: string }> = new Map();

  // Mock User Directory
  private static users: Map<string, AuthUser & { passwordHash: string }> = new Map([
    [
      'user@talentos.ai',
      {
        id: 'USR-101',
        tenantId: TENANT_ID,
        email: 'user@talentos.ai',
        fullName: 'Sarah Chen (HR Admin)',
        role: 'HR_ADMIN',
        isEmailVerified: true,
        passwordHash: 'hashed_password_123',
        createdAt: '2026-01-01T00:00:00Z'
      }
    ],
    [
      'manager@talentos.ai',
      {
        id: 'USR-102',
        tenantId: TENANT_ID,
        email: 'manager@talentos.ai',
        fullName: 'Marcus Vance (Manager)',
        role: 'MANAGER',
        isEmailVerified: true,
        passwordHash: 'hashed_password_123',
        createdAt: '2026-01-01T00:00:00Z'
      }
    ]
  ]);

  private static currentUser: AuthUser = {
    id: 'USR-101',
    tenantId: TENANT_ID,
    email: 'user@talentos.ai',
    fullName: 'Sarah Chen (HR Admin)',
    role: 'HR_ADMIN',
    isEmailVerified: true,
    createdAt: '2026-01-01T00:00:00Z'
  };

  public static getCurrentUser(): AuthUser {
    return this.currentUser;
  }

  public static setCurrentUserRole(role: UserRole) {
    this.currentUser = {
      ...this.currentUser,
      role
    };
    AuditService.log(this.currentUser.tenantId, this.currentUser.email, 'ROLE_SWITCHED', `Switched active role to ${role}`);
  }

  public static async login(email: string, pass: string, ip: string = '192.168.1.1', device: string = 'Chrome MacOS'): Promise<UserSession> {
    const rateLimitKey = `login:${email}:${ip}`;
    const limitCheck = RateLimiterService.isRateLimited(rateLimitKey);

    if (limitCheck.isLimited) {
      AuditService.log(TENANT_ID, email, 'LOGIN_RATE_LIMITED', `Brute force attempt blocked. Retry after ${limitCheck.retryAfterSeconds}s`);
      throw new Error(`Too many failed login attempts. Account locked for ${limitCheck.retryAfterSeconds} seconds.`);
    }

    const u = this.users.get(email.toLowerCase());
    if (!u || pass !== 'password123') { // Demo credential
      RateLimiterService.recordAttempt(rateLimitKey, true);
      AuditService.log(TENANT_ID, email, 'LOGIN_FAILED', 'Invalid credentials provided');
      throw new Error('Invalid email or password.');
    }

    RateLimiterService.recordAttempt(rateLimitKey, false);

    const sessionId = `SES-${Date.now()}`;
    const accessToken = this.generateJWT(u);
    const refreshToken = `RT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const session: UserSession = {
      sessionId,
      user: {
        id: u.id,
        tenantId: u.tenantId,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        isEmailVerified: u.isEmailVerified,
        createdAt: u.createdAt
      },
      accessToken,
      refreshToken,
      deviceInfo: device,
      ipAddress: ip,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    this.activeSessions.set(sessionId, session);
    this.refreshTokens.set(refreshToken, {
      id: `RTI-${Date.now()}`,
      userId: u.id,
      tenantId: u.tenantId,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      isRevoked: false,
      deviceInfo: device,
      ipAddress: ip
    });

    this.currentUser = session.user;
    AuditService.log(u.tenantId, u.email, 'LOGIN_SUCCESS', `Session ${sessionId} created on ${device}`);

    return session;
  }

  public static async refreshToken(tokenStr: string): Promise<{ accessToken: string; refreshToken: string }> {
    const rt = this.refreshTokens.get(tokenStr);
    if (!rt || rt.isRevoked || new Date() > new Date(rt.expiresAt)) {
      AuditService.log(TENANT_ID, 'SYSTEM', 'REFRESH_TOKEN_FAILED', 'Invalid or expired refresh token');
      throw new Error('Invalid or expired refresh token.');
    }

    // Revoke old token (Rotation)
    rt.isRevoked = true;

    const newRtStr = `RT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    this.refreshTokens.set(newRtStr, {
      ...rt,
      tokenHash: newRtStr,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString()
    });

    const newAccessToken = this.generateJWT(this.currentUser);
    AuditService.log(rt.tenantId, this.currentUser.email, 'TOKEN_REFRESHED', 'Rotated refresh token & issued new access JWT');

    return { accessToken: newAccessToken, refreshToken: newRtStr };
  }

  public static hasPermission(user: AuthUser, permission: PermissionCode): boolean {
    const userPermissions = ROLE_PERMISSIONS_MATRIX[user.role] || [];
    return userPermissions.includes(permission);
  }

  public static requestPasswordReset(email: string): string {
    const resetToken = `RST-${Date.now()}`;
    this.passwordResetTokens.set(resetToken, {
      token: resetToken,
      email,
      tenantId: TENANT_ID,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      isUsed: false
    });
    AuditService.log(TENANT_ID, email, 'PASSWORD_RESET_REQUESTED', `Reset token generated`);
    return resetToken;
  }

  public static revokeSession(sessionId: string) {
    this.activeSessions.delete(sessionId);
    AuditService.log(TENANT_ID, this.currentUser.email, 'SESSION_REVOKED', `Session ${sessionId} revoked by user`);
  }

  public static getActiveSessions(): UserSession[] {
    return Array.from(this.activeSessions.values());
  }

  private static generateJWT(user: AuthUser): string {
    const permissions = ROLE_PERMISSIONS_MATRIX[user.role] || [];
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload: JWTPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 900 // 15 min expiry
    };
    const encodedPayload = btoa(JSON.stringify(payload));
    return `${header}.${encodedPayload}.signature_hash_simulated`;
  }
}
