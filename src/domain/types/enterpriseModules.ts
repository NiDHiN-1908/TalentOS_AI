export interface AttendanceRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  workDate: string;
  clockIn: string;
  clockOut?: string;
  overtimeHours: number;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
}

export interface LeaveRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'PTO' | 'Sick Leave' | 'Parental Leave' | 'Unpaid';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface AssetRecord {
  id: string;
  tenantId: string;
  assetName: string;
  serialNumber: string;
  category: 'Laptop' | 'Monitor' | 'Mobile' | 'Security Token';
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  status: 'Available' | 'Allocated' | 'In Repair' | 'Retired';
}

export interface CompliancePolicy {
  id: string;
  tenantId: string;
  policyName: string;
  category: 'SOC2' | 'HIPAA' | 'GDPR' | 'Code of Conduct';
  version: string;
  effectiveDate: string;
  acknowledgedCount: number;
  totalEmployees: number;
}

export interface HelpdeskTicket {
  id: string;
  tenantId: string;
  submittedByEmail: string;
  subject: string;
  category: 'Payroll' | 'Benefits' | 'IT Support' | 'General HR';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  aiSuggestedAnswer?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface ExitOffboarding {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  resignationDate: string;
  lastWorkingDay: string;
  exitReason: string;
  sentimentScore: number;
  assetReturned: boolean;
  accessRevoked: boolean;
  finalSettlementPaid: boolean;
  status: 'In Progress' | 'Completed';
}

export interface AnalyticsMetrics {
  totalHeadcount: number;
  monthlyPayrollGross: number;
  flightRiskHighCount: number;
  avgPerformanceRating: number;
  attritionRatePercent: number;
  hiringVelocityDays: number;
  openRequisitionsCount: number;
}
