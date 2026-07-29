export type SystemRole = 
  | 'PLATFORM_ADMIN'
  | 'EXECUTIVE'
  | 'HR_MANAGER'
  | 'RECRUITER'
  | 'PAYROLL_MANAGER'
  | 'EMPLOYEE';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  department: string;
  title: string;
  tenantId: string;
  permissions: string[];
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
    permissions: ['read:self_profile', 'read:self_payroll', 'read:self_attendance', 'request:leave', 'access:learning', 'access:helpdesk']
  },
  RECRUITER: {
    id: 'USR-REC-01',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.corp',
    role: 'RECRUITER',
    department: 'Talent Acquisition',
    title: 'Lead Technical Recruiter',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:self_profile', 'read:recruitment', 'write:recruitment', 'create:jobs', 'schedule:interviews', 'generate:offers']
  },
  PAYROLL_MANAGER: {
    id: 'USR-PAY-01',
    name: 'Marcus Vance',
    email: 'marcus.vance@acme.corp',
    role: 'PAYROLL_MANAGER',
    department: 'Finance',
    title: 'Global Payroll Director',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:self_profile', 'read:payroll', 'write:payroll', 'audit:payroll', 'access:attendance']
  },
  HR_MANAGER: {
    id: 'USR-HRM-01',
    name: 'Elena Rostova',
    email: 'elena.rostova@acme.corp',
    role: 'HR_MANAGER',
    department: 'People Ops',
    title: 'VP of People & Culture',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:employees', 'write:employees', 'read:recruitment', 'read:onboarding', 'read:performance', 'read:assets', 'read:helpdesk']
  },
  EXECUTIVE: {
    id: 'USR-EXEC-01',
    name: 'David Sterling',
    email: 'david.sterling@acme.corp',
    role: 'EXECUTIVE',
    department: 'Executive Office',
    title: 'Chief Executive Officer',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['read:executive_analytics', 'read:bi_reports', 'read:org_health', 'access:strategic_ai', 'read:compliance']
  },
  PLATFORM_ADMIN: {
    id: 'USR-ADM-01',
    name: 'System Admin',
    email: 'admin@talentos.ai',
    role: 'PLATFORM_ADMIN',
    department: 'Platform Engineering',
    title: 'Chief System Administrator',
    tenantId: 'TNT-TALENTOS-01',
    permissions: ['*']
  }
};
