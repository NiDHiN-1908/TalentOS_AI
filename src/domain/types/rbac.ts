export type SystemRole = 
  | 'PLATFORM_ADMIN'
  | 'EXECUTIVE'
  | 'HR_MANAGER'
  | 'RECRUITER'
  | 'PAYROLL_MANAGER'
  | 'EMPLOYEE';

export interface AttributeContext {
  department?: string;
  region?: string;
  maxApprovalLimitUsd?: number;
  ipWhitelist?: string[];
  clearanceLevel?: 'PUBLIC' | 'CONFIDENTIAL' | 'RESTRICTED';
}

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  department: string;
  title: string;
  tenantId: string;
  permissions: string[];
  attributes?: AttributeContext;
}

export const PRESET_PERSONAS: Record<SystemRole, UserPersona> = {
  EMPLOYEE: {
    id: 'USR-EMP-01',
    name: 'Alex Rivera',
    email: 'alex.rivera@acme.corp',
    role: 'EMPLOYEE',
    department: 'Engineering',
    title: 'Senior Software Engineer',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:self_profile', 'read:self_payroll', 'read:self_attendance', 'request:leave', 'access:learning', 'access:helpdesk'],
    attributes: {
      department: 'Engineering',
      region: 'US-WEST',
      maxApprovalLimitUsd: 1000,
      clearanceLevel: 'PUBLIC'
    }
  },
  RECRUITER: {
    id: 'USR-REC-01',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.corp',
    role: 'RECRUITER',
    department: 'Talent Acquisition',
    title: 'Lead Technical Recruiter',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:self_profile', 'read:recruitment', 'write:recruitment', 'create:jobs', 'schedule:interviews', 'generate:offers'],
    attributes: {
      department: 'Talent Acquisition',
      region: 'GLOBAL',
      maxApprovalLimitUsd: 10000,
      clearanceLevel: 'CONFIDENTIAL'
    }
  },
  PAYROLL_MANAGER: {
    id: 'USR-PAY-01',
    name: 'Marcus Vance',
    email: 'marcus.vance@acme.corp',
    role: 'PAYROLL_MANAGER',
    department: 'Finance',
    title: 'Global Payroll Director',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:self_profile', 'read:payroll', 'write:payroll', 'audit:payroll', 'access:attendance'],
    attributes: {
      department: 'Finance',
      region: 'GLOBAL',
      maxApprovalLimitUsd: 250000,
      clearanceLevel: 'RESTRICTED'
    }
  },
  HR_MANAGER: {
    id: 'USR-HRM-01',
    name: 'Elena Rostova',
    email: 'elena.rostova@acme.corp',
    role: 'HR_MANAGER',
    department: 'People Ops',
    title: 'VP of People & Culture',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:employees', 'write:employees', 'read:recruitment', 'read:onboarding', 'read:performance', 'read:assets', 'read:helpdesk', 'read:payroll'],
    attributes: {
      department: 'People Ops',
      region: 'GLOBAL',
      maxApprovalLimitUsd: 100000,
      clearanceLevel: 'CONFIDENTIAL'
    }
  },
  EXECUTIVE: {
    id: 'USR-EXEC-01',
    name: 'David Sterling',
    email: 'david.sterling@acme.corp',
    role: 'EXECUTIVE',
    department: 'Executive Office',
    title: 'Chief Executive Officer',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:executive_analytics', 'read:bi_reports', 'read:org_health', 'access:strategic_ai', 'read:compliance'],
    attributes: {
      department: 'Executive Office',
      region: 'GLOBAL',
      maxApprovalLimitUsd: 1000000,
      clearanceLevel: 'RESTRICTED'
    }
  },
  PLATFORM_ADMIN: {
    id: 'USR-ADM-01',
    name: 'System Admin',
    email: 'admin@talentos.ai',
    role: 'PLATFORM_ADMIN',
    department: 'Platform Engineering',
    title: 'Chief System Administrator',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['*'],
    attributes: {
      department: 'Platform Engineering',
      region: 'GLOBAL',
      maxApprovalLimitUsd: 99999999,
      clearanceLevel: 'RESTRICTED'
    }
  }
};
