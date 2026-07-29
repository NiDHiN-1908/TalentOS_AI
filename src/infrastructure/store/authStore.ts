import { SystemRole, UserPersona, PRESET_PERSONAS } from '../../domain/types/rbac';

type Listener = () => void;

class AuthStore {
  private currentPersona: UserPersona = PRESET_PERSONAS.HR_MANAGER; // Default to HR Manager
  private listeners: Set<Listener> = new Set();

  public getCurrentPersona(): UserPersona {
    return this.currentPersona;
  }

  public setPersonaByRole(role: SystemRole): void {
    if (PRESET_PERSONAS[role]) {
      this.currentPersona = PRESET_PERSONAS[role];
      this.notify();
    }
  }

  public hasPermission(permission: string): boolean {
    if (this.currentPersona.role === 'PLATFORM_ADMIN') return true;
    if (this.currentPersona.permissions.includes('*')) return true;
    return this.currentPersona.permissions.includes(permission);
  }

  public canAccessModule(moduleId: string): boolean {
    const role = this.currentPersona.role;
    if (role === 'PLATFORM_ADMIN') return true;

    switch (moduleId) {
      case 'dashboard':
        return true; // All authenticated roles have custom dashboards
      case 'orchestrator':
        return ['HR_MANAGER', 'EXECUTIVE', 'PLATFORM_ADMIN'].includes(role);
      case 'analytics':
        return ['EXECUTIVE', 'HR_MANAGER', 'PAYROLL_MANAGER', 'PLATFORM_ADMIN'].includes(role);
      case 'recruitment':
        return ['RECRUITER', 'HR_MANAGER', 'PLATFORM_ADMIN'].includes(role);
      case 'onboarding':
        return ['HR_MANAGER', 'RECRUITER', 'PLATFORM_ADMIN'].includes(role);
      case 'attendance_leave':
        return ['EMPLOYEE', 'HR_MANAGER', 'PAYROLL_MANAGER', 'PLATFORM_ADMIN'].includes(role);
      case 'payroll':
        return ['PAYROLL_MANAGER', 'EMPLOYEE', 'HR_MANAGER', 'PLATFORM_ADMIN'].includes(role);
      case 'performance':
        return ['EMPLOYEE', 'HR_MANAGER', 'PLATFORM_ADMIN'].includes(role);
      case 'learning':
        return ['EMPLOYEE', 'HR_MANAGER', 'PLATFORM_ADMIN'].includes(role);
      case 'assets_compliance':
        return ['HR_MANAGER', 'PLATFORM_ADMIN'].includes(role);
      case 'helpdesk_exit':
        return ['EMPLOYEE', 'HR_MANAGER', 'PLATFORM_ADMIN'].includes(role);
      case 'auth':
        return ['PLATFORM_ADMIN', 'HR_MANAGER'].includes(role);
      default:
        return false;
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }
}

export const authStore = new AuthStore();
