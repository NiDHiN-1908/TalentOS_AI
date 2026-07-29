import { 
  AgentExecutionDAG, 
  AgentExecutionStep 
} from '../../domain/types';
import { hrStore, TENANT_ID } from '../../infrastructure/store/hrStore';
import { LangGraphEngine } from '../agents/langgraph/LangGraphEngine';
import { AuditService } from './AuditService';

export class OrchestratorService {
  
  public static async executeNaturalLanguageCommand(prompt: string): Promise<AgentExecutionDAG> {
    const tenantId = hrStore.getTenantId();

    // Invoke LangGraph Engine
    const graphState = await LangGraphEngine.runStateGraph(prompt);

    // Map LangGraph state to AgentExecutionDAG
    const steps: AgentExecutionStep[] = graphState.nodes.map((n, idx) => ({
      id: `step-${idx + 1}`,
      agentType: n.agentType,
      action: n.actionName,
      thought: n.thoughtTrace,
      status: n.status,
      tokensUsed: n.tokensUsed,
      costUsd: n.costUsd,
      durationMs: n.durationMs,
      output: n.outputResult,
      timestamp: new Date().toISOString()
    }));

    const dag: AgentExecutionDAG = {
      id: graphState.dagId,
      tenantId,
      goalPrompt: prompt,
      steps,
      status: 'completed',
      currentStepIndex: steps.length - 1,
      totalTokens: graphState.totalTokens,
      totalCostUsd: Number(graphState.totalCostUsd.toFixed(5)),
      createdAt: graphState.createdAt,
      completedAt: graphState.completedAt
    };

    hrStore.setActiveDAG(dag);
    AuditService.log(tenantId, 'SUPERVISOR_AGENT', 'LANGGRAPH_DAG_COMPLETED', `LangGraph execution completed with ${steps.length} sub-agent nodes`, 'SUPERVISOR');

    return dag;
  }
}
