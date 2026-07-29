export type PermissionCode = 
  | 'org:manage'
  | 'employees:read'
  | 'employees:write'
  | 'payroll:read'
  | 'payroll:approve'
  | 'candidates:read'
  | 'candidates:write'
  | 'agent:dispatch'
  | 'audit:read';

export type UserRole = 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'AUDITOR';

export const ROLE_PERMISSIONS_MATRIX: Record<UserRole, PermissionCode[]> = {
  SUPER_ADMIN: [
    'org:manage', 'employees:read', 'employees:write', 
    'payroll:read', 'payroll:approve', 'candidates:read', 
    'candidates:write', 'agent:dispatch', 'audit:read'
  ],
  HR_ADMIN: [
    'employees:read', 'employees:write', 'payroll:read', 
    'candidates:read', 'candidates:write', 'agent:dispatch', 'audit:read'
  ],
  MANAGER: [
    'employees:read', 'payroll:read', 'candidates:read', 
    'candidates:write', 'agent:dispatch'
  ],
  EMPLOYEE: [
    'employees:read'
  ],
  AUDITOR: [
    'employees:read', 'payroll:read', 'audit:read'
  ]
};

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface JWTPayload {
  sub: string; // User ID
  tenantId: string;
  email: string;
  role: UserRole;
  permissions: PermissionCode[];
  iat: number;
  exp: number;
}

export interface RefreshToken {
  id: string;
  userId: string;
  tenantId: string;
  tokenHash: string;
  expiresAt: string;
  isRevoked: boolean;
  deviceInfo: string;
  ipAddress: string;
}

export interface UserSession {
  sessionId: string;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  deviceInfo: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface PasswordResetToken {
  token: string;
  email: string;
  tenantId: string;
  expiresAt: string;
  isUsed: boolean;
}
