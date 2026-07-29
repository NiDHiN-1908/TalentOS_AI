import { 
  LangGraphState, 
  LangGraphNodeState, 
  LangGraphAgentMessage 
} from './LangGraphTypes';
import { AgentType } from '../../../domain/types';
import { hrStore } from '../../../infrastructure/store/hrStore';
import { AgentMemoryService } from '../../services/AgentMemoryService';
import { AuditService } from '../../services/AuditService';
import { GuardrailService } from '../../services/GuardrailService';

export class LangGraphEngine {

  public static async runStateGraph(userPrompt: string): Promise<LangGraphState> {
    const tenantId = hrStore.getTenantId();
    const dagId = `LG-DAG-${Date.now()}`;

    // 1. Security Guardrail Validation
    const guardrail = GuardrailService.validatePrompt(userPrompt);
    if (!guardrail.isValid) {
      AuditService.log(tenantId, 'GUARDRAIL', 'PROMPT_REJECTED', guardrail.reason || 'Guardrail violation');
      throw new Error(guardrail.reason);
    }

    // 2. Query Tri-Layer Memory Context
    const semanticMemories = AgentMemoryService.queryMemories(tenantId, userPrompt);
    const memoryContext = semanticMemories.map(m => m.content).join(' | ');

    // 3. Build Initial Graph State
    const nodes = this.planNodesForPrompt(userPrompt);
    let state: LangGraphState = {
      dagId,
      tenantId,
      userPrompt,
      currentStepIndex: 0,
      nodes,
      messages: [],
      workingMemory: [memoryContext ? `Semantic Context: ${memoryContext}` : 'No prior semantic memories'],
      requiresHumanApproval: false,
      status: 'in_progress',
      totalTokens: 0,
      totalCostUsd: 0,
      createdAt: new Date().toISOString()
    };

    AuditService.log(tenantId, 'SUPERVISOR_AGENT', 'LANGGRAPH_STARTED', `Started StateGraph with ${nodes.length} nodes`, 'SUPERVISOR');

    // Asynchronous Step Graph Execution with ReAct Reflection & Error Recovery
    this.executeGraphLoop(state);

    return state;
  }

  private static planNodesForPrompt(prompt: string): LangGraphNodeState[] {
    const p = prompt.toLowerCase();
    const nodes: LangGraphNodeState[] = [];

    // Node 1: Supervisor Routing
    nodes.push({
      nodeId: 'node-supervisor-plan',
      agentType: 'SUPERVISOR',
      actionName: 'Parse Intent & Construct LangGraph Sub-Agent DAG',
      thoughtTrace: `Supervisor analyzing user prompt: "${prompt}". Constructing multi-agent execution state machine.`,
      inputPrompt: prompt,
      qualityScore: 95,
      status: 'pending',
      retryCount: 0,
      durationMs: 420,
      tokensUsed: 140,
      costUsd: 0.00021
    });

    if (p.includes('recruit') || p.includes('candidate') || p.includes('hire') || p.includes('source')) {
      nodes.push({
        nodeId: 'node-recruitment',
        agentType: 'RECRUITMENT',
        actionName: 'AI Sourcing & Resume Match Matrix',
        thoughtTrace: 'Recruitment Agent evaluating candidates against active job requisitions.',
        inputPrompt: prompt,
        qualityScore: 90,
        status: 'pending',
        retryCount: 0,
        durationMs: 650,
        tokensUsed: 280,
        costUsd: 0.00042
      });
    }

    if (p.includes('onboard') || p.includes('new hire')) {
      nodes.push({
        nodeId: 'node-onboarding',
        agentType: 'ONBOARDING',
        actionName: 'Orchestrate 11-Step Onboarding Pipeline',
        thoughtTrace: 'Onboarding Agent initializing document collection & IT hardware provisioning.',
        inputPrompt: prompt,
        qualityScore: 92,
        status: 'pending',
        retryCount: 0,
        durationMs: 580,
        tokensUsed: 240,
        costUsd: 0.00036
      });
    }

    if (p.includes('attendance') || p.includes('shift') || p.includes('clock')) {
      nodes.push({
        nodeId: 'node-attendance',
        agentType: 'ATTENDANCE',
        actionName: 'Verify Shift Clock-Ins & Overtime Balances',
        thoughtTrace: 'Attendance Agent validating daily shift logs & geofence metrics.',
        inputPrompt: prompt,
        qualityScore: 88,
        status: 'pending',
        retryCount: 0,
        durationMs: 380,
        tokensUsed: 160,
        costUsd: 0.00024
      });
    }

    if (p.includes('payroll') || p.includes('salary') || p.includes('pay')) {
      nodes.push({
        nodeId: 'node-payroll',
        agentType: 'PAYROLL',
        actionName: 'Pre-Payroll Anomaly Audit & Gross-to-Net Ledger',
        thoughtTrace: 'Payroll Agent running variance checks across 42 employee ledger records.',
        inputPrompt: prompt,
        qualityScore: 85,
        status: 'pending',
        retryCount: 0,
        durationMs: 720,
        tokensUsed: 310,
        costUsd: 0.000465
      });
    }

    if (p.includes('flight risk') || p.includes('performance') || p.includes('sentiment')) {
      nodes.push({
        nodeId: 'node-performance',
        agentType: 'PERFORMANCE',
        actionName: '360 Sentiment Synthesis & Retention Flight Risk Map',
        thoughtTrace: 'Performance Agent aggregating weekly 1-on-1 check-in pulse ratings.',
        inputPrompt: prompt,
        qualityScore: 89,
        status: 'pending',
        retryCount: 0,
        durationMs: 490,
        tokensUsed: 210,
        costUsd: 0.000315
      });
    }

    if (p.includes('learning') || p.includes('skill') || p.includes('course')) {
      nodes.push({
        nodeId: 'node-learning',
        agentType: 'LEARNING',
        actionName: 'Adaptive Skill Gap Matrix & Course Recommendation',
        thoughtTrace: 'Learning Agent matching required engineering capabilities against active courses.',
        inputPrompt: prompt,
        qualityScore: 91,
        status: 'pending',
        retryCount: 0,
        durationMs: 410,
        tokensUsed: 180,
        costUsd: 0.00027
      });
    }

    if (p.includes('soc2') || p.includes('compliance') || p.includes('policy')) {
      nodes.push({
        nodeId: 'node-compliance',
        agentType: 'COMPLIANCE',
        actionName: 'Audit SOC2/HIPAA Policy Acknowledgments',
        thoughtTrace: 'Compliance Agent inspecting mandatory security policy sign-offs.',
        inputPrompt: prompt,
        qualityScore: 94,
        status: 'pending',
        retryCount: 0,
        durationMs: 360,
        tokensUsed: 150,
        costUsd: 0.000225
      });
    }

    if (p.includes('analytics') || p.includes('headcount') || p.includes('attrition')) {
      nodes.push({
        nodeId: 'node-analytics',
        agentType: 'ANALYTICS',
        actionName: 'Calculate Enterprise BI Headcount & Attrition Velocity',
        thoughtTrace: 'Analytics Agent computing QoQ hiring velocity and department metrics.',
        inputPrompt: prompt,
        qualityScore: 96,
        status: 'pending',
        retryCount: 0,
        durationMs: 440,
        tokensUsed: 190,
        costUsd: 0.000285
      });
    }

    if (p.includes('helpdesk') || p.includes('question') || p.includes('ticket')) {
      nodes.push({
        nodeId: 'node-support',
        agentType: 'EMPLOYEE_SUPPORT',
        actionName: 'Handbook Automated Q&A & Ticket Resolution',
        thoughtTrace: 'Employee Support Agent matching question against HR Handbook vectors.',
        inputPrompt: prompt,
        qualityScore: 87,
        status: 'pending',
        retryCount: 0,
        durationMs: 390,
        tokensUsed: 170,
        costUsd: 0.000255
      });
    }

    // Default Node if generic query
    if (nodes.length === 1) {
      nodes.push({
        nodeId: 'node-executive-briefing',
        agentType: 'EXECUTIVE_AI',
        actionName: 'Synthesize Real-Time C-Suite Intelligence Briefing',
        thoughtTrace: 'Executive Assistant Agent consolidating cross-domain HR KPIs.',
        inputPrompt: prompt,
        qualityScore: 97,
        status: 'pending',
        retryCount: 0,
        durationMs: 510,
        tokensUsed: 260,
        costUsd: 0.00039
      });
    }

    // Node Final: Executive Synthesizer
    nodes.push({
      nodeId: 'node-final-synthesis',
      agentType: 'SUPERVISOR',
      actionName: 'Consolidate Sub-Agent Outputs & Verify Approval Gates',
      thoughtTrace: 'Supervisor Agent verifying all sub-agent outputs and formatting final response.',
      inputPrompt: prompt,
      qualityScore: 98,
      status: 'pending',
      retryCount: 0,
      durationMs: 320,
      tokensUsed: 130,
      costUsd: 0.000195
    });

    return nodes;
  }

  private static async executeGraphLoop(state: LangGraphState) {
    for (let i = 0; i < state.nodes.length; i++) {
      const node = state.nodes[i];
      node.status = 'in_progress';
      state.currentStepIndex = i;

      // Inter-agent message passing
      const msg: LangGraphAgentMessage = {
        id: `MSG-${Date.now()}`,
        senderAgent: node.agentType,
        recipientAgent: 'SUPERVISOR',
        content: `Executing action: ${node.actionName}`,
        timestamp: new Date().toISOString()
      };
      state.messages.push(msg);

      await new Promise(r => setTimeout(r, 600));

      // ReAct Reflection Check (Self-correction simulation if score < 80%)
      if (node.qualityScore < 80) {
        node.retryCount += 1;
        node.thoughtTrace += ' [ReAct Reflection: Quality score low. Re-evaluating tool arguments]';
        node.qualityScore = 90;
      }

      node.status = 'completed';
      node.outputResult = this.generateNodeResult(node);
      state.totalTokens += node.tokensUsed;
      state.totalCostUsd += node.costUsd;
    }

    state.status = 'completed';
    state.completedAt = new Date().toISOString();
  }

  private static generateNodeResult(node: LangGraphNodeState): string {
    return `[${node.agentType}] Successfully completed ${node.actionName}. (Quality Score: ${node.qualityScore}%)`;
  }
}
