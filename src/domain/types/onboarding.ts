export type OnboardingStepId = 
  | 'OFFER_ACCEPTED'
  | 'DOCUMENT_COLLECTION'
  | 'VERIFICATION'
  | 'EMPLOYEE_CREATION'
  | 'EMPLOYEE_ID_GEN'
  | 'COMPANY_EMAIL_PROVISION'
  | 'LAPTOP_ASSIGNMENT'
  | 'TRAINING_ASSIGNMENT'
  | 'PAYROLL_REGISTRATION'
  | 'WELCOME_KIT'
  | 'MANAGER_NOTIFICATION';

export type OnboardingStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface OnboardingStep {
  stepId: OnboardingStepId;
  title: string;
  description: string;
  status: OnboardingStepStatus;
  outputDetails?: string;
  completedAt?: string;
}

export interface OnboardingPipeline {
  id: string;
  tenantId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  roleTitle: string;
  department: string;
  assignedEmployeeId?: string;
  assignedCompanyEmail?: string;
  assignedLaptop?: string;
  buddyName?: string;
  currentStepIndex: number;
  steps: OnboardingStep[];
  status: 'In Progress' | 'Completed' | 'Failed';
  createdAt: string;
  completedAt?: string;
}
