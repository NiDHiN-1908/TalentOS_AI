import { authStore } from '../src/infrastructure/store/authStore';

describe('Dynamic Role-Based Experience (RBX) Engine Suite', () => {
  test('should verify default persona is HR Manager with full domain permissions', () => {
    const persona = authStore.getCurrentPersona();
    expect(persona.role).toBe('HR_MANAGER');
    expect(authStore.canAccessModule('recruitment')).toBe(true);
    expect(authStore.canAccessModule('payroll')).toBe(true);
    expect(authStore.canAccessModule('orchestrator')).toBe(true);
  });

  test('should verify switching persona to RECRUITER hides payroll and security modules', () => {
    authStore.setPersonaByRole('RECRUITER');
    const persona = authStore.getCurrentPersona();
    expect(persona.role).toBe('RECRUITER');

    expect(authStore.canAccessModule('recruitment')).toBe(true);
    expect(authStore.canAccessModule('onboarding')).toBe(true);

    // Forbidden for recruiter
    expect(authStore.canAccessModule('payroll')).toBe(false);
    expect(authStore.canAccessModule('auth')).toBe(false);
  });

  test('should verify switching persona to EMPLOYEE restricts navigation to self-service items', () => {
    authStore.setPersonaByRole('EMPLOYEE');
    const persona = authStore.getCurrentPersona();
    expect(persona.role).toBe('EMPLOYEE');

    expect(authStore.canAccessModule('dashboard')).toBe(true);
    expect(authStore.canAccessModule('attendance_leave')).toBe(true);
    expect(authStore.canAccessModule('learning')).toBe(true);

    // Forbidden for employee
    expect(authStore.canAccessModule('recruitment')).toBe(false);
    expect(authStore.canAccessModule('orchestrator')).toBe(false);
    expect(authStore.canAccessModule('assets_compliance')).toBe(false);
  });

  test('should verify switching persona to PAYROLL_MANAGER allows payroll access but hides ATS', () => {
    authStore.setPersonaByRole('PAYROLL_MANAGER');
    expect(authStore.canAccessModule('payroll')).toBe(true);
    expect(authStore.canAccessModule('attendance_leave')).toBe(true);

    // Forbidden for payroll manager
    expect(authStore.canAccessModule('recruitment')).toBe(false);
  });
});
