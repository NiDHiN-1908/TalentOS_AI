import { describe, it, expect } from 'vitest';
import { EnterpriseModulesService } from '../src/application/services/EnterpriseModulesService';
import { hrStore } from '../src/infrastructure/store/hrStore';

describe('TalentOS AI 11 Core Enterprise HR Modules Suite', () => {
  it('1. Attendance: should record employee clock in', () => {
    const record = EnterpriseModulesService.clockIn('EMP-101', 'Sarah Chen');
    expect(record.id).toContain('ATT-');
    expect(record.status).toBe('Present');
  });

  it('2. Leave: should submit and approve leave requests', () => {
    const req = EnterpriseModulesService.submitLeaveRequest({
      employeeId: 'EMP-101',
      employeeName: 'Sarah Chen',
      leaveType: 'PTO',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      daysCount: 5,
      reason: 'Vacation'
    });

    expect(req.status).toBe('Pending');

    EnterpriseModulesService.approveLeave(req.id);
    const updated = EnterpriseModulesService.getLeaveRequests().find(l => l.id === req.id);
    expect(updated?.status).toBe('Approved');
  });

  it('3. Payroll: should audit ledger and resolve flagged anomalies', () => {
    const run = hrStore.getPayrollRun();
    expect(run.anomalies.length).toBeGreaterThan(0);

    const firstAnomalyId = run.anomalies[0].id;
    hrStore.resolvePayrollAnomaly(firstAnomalyId);

    expect(hrStore.getPayrollRun().anomalies.length).toBe(run.anomalies.length - 1);
  });

  it('4. Performance: should calculate flight risk index', () => {
    const summaries = hrStore.getPerformanceSummaries();
    expect(summaries.length).toBeGreaterThan(0);
    expect(summaries[1].sentimentScore).toBeLessThan(0.3); // Marcus Vance sentiment drop
  });

  it('5. Learning: should track adaptive skill track progress', () => {
    const tracks = hrStore.getLearningTracks();
    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks[0].progressPercent).toBeGreaterThan(0);
  });

  it('6. Assets: should allocate IT hardware to employee', () => {
    const asset = EnterpriseModulesService.allocateAsset('MacBook Pro M3', 'Laptop', 'Elena Rostova');
    expect(asset.id).toContain('AST-');
    expect(asset.assignedEmployeeName).toBe('Elena Rostova');
    expect(asset.status).toBe('Allocated');
  });

  it('7. Compliance: should track SOC2 policy acknowledgments', () => {
    const policies = EnterpriseModulesService.getPolicies();
    expect(policies.length).toBeGreaterThan(0);
    expect(policies[0].category).toBe('SOC2');
  });

  it('8. Helpdesk: should submit AI ticket with auto-resolution recommendation', () => {
    const ticket = EnterpriseModulesService.submitHelpdeskTicket(
      'How to request W-2 tax forms?',
      'Payroll',
      'user@talentos.ai'
    );
    expect(ticket.id).toContain('TCK-');
    expect(ticket.aiSuggestedAnswer).toBeDefined();
  });

  it('9. Exit Management: should track offboarding checklists', () => {
    const exits = EnterpriseModulesService.getExitOffboardings();
    expect(exits.length).toBeGreaterThan(0);
    expect(exits[0].employeeName).toBe('Marcus Vance');
  });

  it('10. Analytics: should aggregate BI headcount and payroll metrics', () => {
    const metrics = EnterpriseModulesService.getAnalyticsMetrics();
    expect(metrics.totalHeadcount).toBeGreaterThan(0);
    expect(metrics.monthlyPayrollGross).toBe(825000);
  });

  it('11. Executive Dashboard: should compute health score', () => {
    const metrics = EnterpriseModulesService.getAnalyticsMetrics();
    expect(metrics.avgPerformanceRating).toBeGreaterThan(4.0);
  });
});
