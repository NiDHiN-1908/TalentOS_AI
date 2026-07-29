import { 
  AttendanceRecord, 
  LeaveRequest, 
  AssetRecord, 
  CompliancePolicy, 
  HelpdeskTicket, 
  ExitOffboarding, 
  AnalyticsMetrics 
} from '../../domain/types/enterpriseModules';
import { hrStore, TENANT_ID } from '../../infrastructure/store/hrStore';
import { AuditService } from './AuditService';

export class EnterpriseModulesService {
  private static attendanceRecords: AttendanceRecord[] = [
    {
      id: 'ATT-101',
      tenantId: TENANT_ID,
      employeeId: 'EMP-101',
      employeeName: 'Sarah Chen',
      workDate: '2026-07-29',
      clockIn: '08:55 AM',
      clockOut: '05:30 PM',
      overtimeHours: 0.5,
      status: 'Present'
    },
    {
      id: 'ATT-102',
      tenantId: TENANT_ID,
      employeeId: 'EMP-102',
      employeeName: 'Marcus Vance',
      workDate: '2026-07-29',
      clockIn: '09:15 AM',
      overtimeHours: 0,
      status: 'Present'
    }
  ];

  private static leaveRequests: LeaveRequest[] = [
    {
      id: 'LEV-501',
      tenantId: TENANT_ID,
      employeeId: 'EMP-103',
      employeeName: 'Elena Rostova',
      leaveType: 'PTO',
      startDate: '2026-08-10',
      endDate: '2026-08-14',
      daysCount: 5,
      reason: 'Summer vacation trip',
      status: 'Pending',
      createdAt: '2026-07-28T10:00:00Z'
    }
  ];

  private static assets: AssetRecord[] = [
    {
      id: 'AST-901',
      tenantId: TENANT_ID,
      assetName: 'MacBook Pro M3 Max 16"',
      serialNumber: 'MBP-9921-X',
      category: 'Laptop',
      assignedEmployeeId: 'EMP-101',
      assignedEmployeeName: 'Sarah Chen',
      status: 'Allocated'
    },
    {
      id: 'AST-902',
      tenantId: TENANT_ID,
      assetName: 'Dell UltraSharp 32" 4K Monitor',
      serialNumber: 'DEL-4410-M',
      category: 'Monitor',
      assignedEmployeeId: 'EMP-102',
      assignedEmployeeName: 'Marcus Vance',
      status: 'Allocated'
    }
  ];

  private static policies: CompliancePolicy[] = [
    {
      id: 'POL-01',
      tenantId: TENANT_ID,
      policyName: 'SOC2 Type II Security & Data Protection Policy',
      category: 'SOC2',
      version: 'v2.4',
      effectiveDate: '2026-01-01',
      acknowledgedCount: 41,
      totalEmployees: 42
    },
    {
      id: 'POL-02',
      tenantId: TENANT_ID,
      policyName: 'GDPR / Employee Privacy & PII Handling Guide',
      category: 'GDPR',
      version: 'v1.8',
      effectiveDate: '2026-03-15',
      acknowledgedCount: 42,
      totalEmployees: 42
    }
  ];

  private static tickets: HelpdeskTicket[] = [
    {
      id: 'TCK-201',
      tenantId: TENANT_ID,
      submittedByEmail: 'marcus.vance@talentos.ai',
      subject: 'Question regarding retroactive bonus tax withholding',
      category: 'Payroll',
      priority: 'High',
      aiSuggestedAnswer: 'Retroactive bonuses are taxed under supplemental wage guidelines (22% flat rate).',
      status: 'Open',
      createdAt: '2026-07-29T09:00:00Z'
    }
  ];

  private static exitOffboardings: ExitOffboarding[] = [
    {
      id: 'EXT-101',
      tenantId: TENANT_ID,
      employeeId: 'EMP-102',
      employeeName: 'Marcus Vance',
      resignationDate: '2026-07-28',
      lastWorkingDay: '2026-08-15',
      exitReason: 'Seeking different career balance',
      sentimentScore: 0.15,
      assetReturned: false,
      accessRevoked: false,
      finalSettlementPaid: false,
      status: 'In Progress'
    }
  ];

  // API Methods
  public static clockIn(employeeId: string, employeeName: string): AttendanceRecord {
    const record: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      tenantId: hrStore.getTenantId(),
      employeeId,
      employeeName,
      workDate: new Date().toISOString().split('T')[0],
      clockIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      overtimeHours: 0,
      status: 'Present'
    };
    this.attendanceRecords.unshift(record);
    AuditService.log(record.tenantId, employeeName, 'CLOCK_IN', `Employee ${employeeName} clocked in`);
    return record;
  }

  public static submitLeaveRequest(req: Omit<LeaveRequest, 'id' | 'tenantId' | 'status' | 'createdAt'>): LeaveRequest {
    const newReq: LeaveRequest = {
      ...req,
      id: `LEV-${Date.now()}`,
      tenantId: hrStore.getTenantId(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    this.leaveRequests.unshift(newReq);
    AuditService.log(newReq.tenantId, req.employeeName, 'LEAVE_SUBMITTED', `Submitted ${req.leaveType} for ${req.daysCount} days`);
    return newReq;
  }

  public static approveLeave(id: string) {
    const l = this.leaveRequests.find(lr => lr.id === id);
    if (l) {
      l.status = 'Approved';
      AuditService.log(l.tenantId, 'MANAGER_USER', 'LEAVE_APPROVED', `Approved leave request ${id}`);
    }
  }

  public static allocateAsset(assetName: string, category: AssetRecord['category'], employeeName: string): AssetRecord {
    const asset: AssetRecord = {
      id: `AST-${Date.now()}`,
      tenantId: hrStore.getTenantId(),
      assetName,
      serialNumber: `SN-${Math.floor(Math.random() * 90000) + 10000}`,
      category,
      assignedEmployeeName: employeeName,
      status: 'Allocated'
    };
    this.assets.unshift(asset);
    AuditService.log(asset.tenantId, 'IT_ADMIN', 'ASSET_ALLOCATED', `Allocated ${assetName} to ${employeeName}`);
    return asset;
  }

  public static submitHelpdeskTicket(subject: string, category: HelpdeskTicket['category'], email: string): HelpdeskTicket {
    const tck: HelpdeskTicket = {
      id: `TCK-${Date.now()}`,
      tenantId: hrStore.getTenantId(),
      submittedByEmail: email,
      subject,
      category,
      priority: 'Medium',
      aiSuggestedAnswer: 'TalentOS AI Assistant: Policy document section 4.2 covers your inquiry details.',
      status: 'Open',
      createdAt: new Date().toISOString()
    };
    this.tickets.unshift(tck);
    AuditService.log(tck.tenantId, email, 'TICKET_SUBMITTED', `Helpdesk ticket ${tck.id} created`);
    return tck;
  }

  public static getAnalyticsMetrics(): AnalyticsMetrics {
    const emps = hrStore.getEmployees();
    const cands = hrStore.getCandidates();
    const highRisk = emps.filter(e => e.flightRisk === 'High').length;

    return {
      totalHeadcount: emps.length,
      monthlyPayrollGross: 825000,
      flightRiskHighCount: highRisk,
      avgPerformanceRating: 4.54,
      attritionRatePercent: 2.4,
      hiringVelocityDays: 18,
      openRequisitionsCount: 4
    };
  }

  public static getAttendance(): AttendanceRecord[] { return this.attendanceRecords; }
  public static getLeaveRequests(): LeaveRequest[] { return this.leaveRequests; }
  public static getAssets(): AssetRecord[] { return this.assets; }
  public static getPolicies(): CompliancePolicy[] { return this.policies; }
  public static getTickets(): HelpdeskTicket[] { return this.tickets; }
  public static getExitOffboardings(): ExitOffboarding[] { return this.exitOffboardings; }
}
