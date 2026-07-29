import { OnboardingPipeline } from '../../domain/types/onboarding';
import { OnboardingAgentEngine } from '../agents/OnboardingAgentEngine';

export class OnboardingService {
  private static pipelines: OnboardingPipeline[] = [
    OnboardingAgentEngine.initializePipeline(
      'CAN-801',
      'Dr. Aris Thorne',
      'aris.thorne@stanford.edu',
      'Senior AI Researcher',
      'AI Research'
    )
  ];

  public static getPipelines(): OnboardingPipeline[] {
    return this.pipelines;
  }

  public static startOnboarding(
    candidateId: string, 
    candidateName: string, 
    candidateEmail: string, 
    roleTitle: string, 
    department: string
  ): OnboardingPipeline {
    const pipeline = OnboardingAgentEngine.initializePipeline(
      candidateId, 
      candidateName, 
      candidateEmail, 
      roleTitle, 
      department
    );
    this.pipelines.unshift(pipeline);
    return pipeline;
  }

  public static async advancePipeline(pipelineId: string): Promise<OnboardingPipeline | null> {
    const idx = this.pipelines.findIndex(p => p.id === pipelineId);
    if (idx === -1) return null;

    const updated = await OnboardingAgentEngine.executeNextStep(this.pipelines[idx]);
    this.pipelines[idx] = updated;
    return updated;
  }

  public static async runPipelineToCompletion(pipelineId: string): Promise<OnboardingPipeline | null> {
    let p = this.pipelines.find(pip => pip.id === pipelineId);
    if (!p) return null;

    while (p.status === 'In Progress' && p.currentStepIndex < p.steps.length) {
      p = await OnboardingAgentEngine.executeNextStep(p);
    }
    return p;
  }
}
