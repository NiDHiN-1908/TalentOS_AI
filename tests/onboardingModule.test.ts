import { describe, it, expect } from 'vitest';
import { OnboardingService } from '../src/application/services/OnboardingService';
import { OnboardingAgentEngine } from '../src/application/agents/OnboardingAgentEngine';

describe('TalentOS AI 11-Step Employee Onboarding Module Suite', () => {
  it('should initialize onboarding pipeline with 11 sequential steps', () => {
    const pipeline = OnboardingAgentEngine.initializePipeline(
      'CAN-901',
      'Elena Rostova',
      'elena@data.io',
      'Staff Data Engineer',
      'Data & Analytics'
    );

    expect(pipeline.id).toContain('ONB-');
    expect(pipeline.steps.length).toBe(11);
    expect(pipeline.steps[0].stepId).toBe('OFFER_ACCEPTED');
    expect(pipeline.steps[0].status).toBe('completed');
    expect(pipeline.steps[10].stepId).toBe('MANAGER_NOTIFICATION');
  });

  it('should advance onboarding step by step', async () => {
    const pipeline = OnboardingService.startOnboarding(
      'CAN-902',
      'Alex Rivera',
      'alex@devops.co',
      'DevOps Lead',
      'Infrastructure'
    );

    // Step 2: Document collection
    const step2 = await OnboardingService.advancePipeline(pipeline.id);
    expect(step2?.steps[1].status).toBe('completed');
    expect(step2?.steps[1].outputDetails).toContain('collected cleanly');

    // Step 3: Verification
    const step3 = await OnboardingService.advancePipeline(pipeline.id);
    expect(step3?.steps[2].status).toBe('completed');
    expect(step3?.steps[2].outputDetails).toContain('CLEARED');
  });

  it('should run all 11 onboarding steps to 100% completion automatically', async () => {
    const pipeline = OnboardingService.startOnboarding(
      'CAN-903',
      'Sarah Connor',
      'sarah.c@ai.io',
      'AI Alignment Lead',
      'AI Engineering'
    );

    const completedPipeline = await OnboardingService.runPipelineToCompletion(pipeline.id);

    expect(completedPipeline).toBeDefined();
    expect(completedPipeline?.status).toBe('Completed');
    expect(completedPipeline?.assignedEmployeeId).toContain('EMP-');
    expect(completedPipeline?.assignedCompanyEmail).toContain('@talentos.ai');
    expect(completedPipeline?.assignedLaptop).toContain('MacBook Pro M3 Max');
    expect(completedPipeline?.buddyName).toContain('Sarah Chen');
  });
});
