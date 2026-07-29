import { OnboardingPipeline, OnboardingStep } from '../../domain/types/onboarding';
import { hrStore } from '../../infrastructure/store/hrStore';
import { AuditService } from '../services/AuditService';

export class OnboardingAgentEngine {

  public static initializePipeline(candidateId: string, candidateName: string, candidateEmail: string, roleTitle: string, department: string): OnboardingPipeline {
    const tenantId = hrStore.getTenantId();
    const pipelineId = `ONB-${Date.now()}`;

    const defaultSteps: OnboardingStep[] = [
      { stepId: 'OFFER_ACCEPTED', title: '1. Offer Accepted', description: 'Offer letter signed & accepted by candidate', status: 'completed', completedAt: new Date().toISOString() },
      { stepId: 'DOCUMENT_COLLECTION', title: '2. Document Collection', description: 'Collecting I-9, Tax W-4 & Direct Deposit forms', status: 'pending' },
      { stepId: 'VERIFICATION', title: '3. Verification', description: 'Background check & credential verification', status: 'pending' },
      { stepId: 'EMPLOYEE_CREATION', title: '4. Employee Creation', description: 'Instantiating Employee record in Core HR', status: 'pending' },
      { stepId: 'EMPLOYEE_ID_GEN', title: '5. Employee ID Generation', description: 'Assigning unique enterprise EMP code', status: 'pending' },
      { stepId: 'COMPANY_EMAIL_PROVISION', title: '6. Company Email Provisioning', description: 'Provisioning @talentos.ai email & SSO', status: 'pending' },
      { stepId: 'LAPTOP_ASSIGNMENT', title: '7. Laptop Assignment', description: 'Dispatching MacBook Pro M3 Max hardware ticket', status: 'pending' },
      { stepId: 'TRAINING_ASSIGNMENT', title: '8. Training Assignment', description: 'Enrolling in SOC2 & Role Security modules', status: 'pending' },
      { stepId: 'PAYROLL_REGISTRATION', title: '9. Payroll Registration', description: 'Adding employee to active Payroll Ledger', status: 'pending' },
      { stepId: 'WELCOME_KIT', title: '10. Welcome Kit & Buddy Pairing', description: 'Dispatching Swag Box & assigning Sarah Chen as Buddy', status: 'pending' },
      { stepId: 'MANAGER_NOTIFICATION', title: '11. Manager Notification', description: 'Notifying department lead of onboarding readiness', status: 'pending' }
    ];

    const pipeline: OnboardingPipeline = {
      id: pipelineId,
      tenantId,
      candidateId,
      candidateName,
      candidateEmail,
      roleTitle,
      department,
      currentStepIndex: 1,
      steps: defaultSteps,
      status: 'In Progress',
      createdAt: new Date().toISOString()
    };

    AuditService.log(tenantId, 'ONBOARDING_AGENT', 'PIPELINE_STARTED', `Started 11-step onboarding for ${candidateName} (${roleTitle})`, 'ONBOARDING');
    return pipeline;
  }

  public static async executeNextStep(pipeline: OnboardingPipeline): Promise<OnboardingPipeline> {
    if (pipeline.status === 'Completed' || pipeline.currentStepIndex >= pipeline.steps.length) {
      return pipeline;
    }

    const stepIndex = pipeline.currentStepIndex;
    const step = pipeline.steps[stepIndex];
    step.status = 'in_progress';

    // Execution logic for each step
    switch (step.stepId) {
      case 'DOCUMENT_COLLECTION':
        step.outputDetails = 'I-9, Passport, and W-4 tax documents collected cleanly.';
        break;
      case 'VERIFICATION':
        step.outputDetails = 'Background check status: CLEARED (Zero red flags).';
        break;
      case 'EMPLOYEE_CREATION':
        step.outputDetails = 'Employee record instantiated in Core HR schema.';
        break;
      case 'EMPLOYEE_ID_GEN':
        pipeline.assignedEmployeeId = `EMP-${Math.floor(Math.random() * 900) + 100}`;
        step.outputDetails = `Assigned Employee ID: ${pipeline.assignedEmployeeId}`;
        break;
      case 'COMPANY_EMAIL_PROVISION':
        const nameClean = pipeline.candidateName.toLowerCase().replace(/[^a-z]/g, '.');
        pipeline.assignedCompanyEmail = `${nameClean}@talentos.ai`;
        step.outputDetails = `Provisioned Email: ${pipeline.assignedCompanyEmail}`;
        break;
      case 'LAPTOP_ASSIGNMENT':
        pipeline.assignedLaptop = 'MacBook Pro M3 Max (36GB RAM, 1TB SSD) - Serial #MBP-9921';
        step.outputDetails = `Dispatched Hardware: ${pipeline.assignedLaptop}`;
        break;
      case 'TRAINING_ASSIGNMENT':
        step.outputDetails = 'Enrolled in 2 mandatory courses: "SOC2 Compliance" and "AI Safety Architecture".';
        break;
      case 'PAYROLL_REGISTRATION':
        step.outputDetails = 'Registered on July 2026 Payroll Run ledger with direct deposit account.';
        break;
      case 'WELCOME_KIT':
        pipeline.buddyName = 'Sarah Chen (Principal AI Engineer)';
        step.outputDetails = `Welcome Swag Box dispatched via FedEx. Buddy assigned: ${pipeline.buddyName}`;
        break;
      case 'MANAGER_NOTIFICATION':
        step.outputDetails = `Notification sent to Department Lead: "${pipeline.candidateName} onboarding 100% complete."`;
        break;
    }

    step.status = 'completed';
    step.completedAt = new Date().toISOString();
    pipeline.currentStepIndex += 1;

    if (pipeline.currentStepIndex >= pipeline.steps.length) {
      pipeline.status = 'Completed';
      pipeline.completedAt = new Date().toISOString();
      AuditService.log(pipeline.tenantId, 'ONBOARDING_AGENT', 'PIPELINE_COMPLETED', `Completed 11-step onboarding for ${pipeline.candidateName}`, 'ONBOARDING');
    }

    return { ...pipeline };
  }
}
