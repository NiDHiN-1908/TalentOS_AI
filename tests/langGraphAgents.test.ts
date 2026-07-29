import { describe, it, expect } from 'vitest';
import { LangGraphEngine } from '../src/application/agents/langgraph/LangGraphEngine';
import { OrchestratorService } from '../src/application/services/OrchestratorService';

describe('TalentOS AI LangGraph Multi-Agent System Suite', () => {
  it('should initialize and execute LangGraph state machine with Supervisor routing', async () => {
    const prompt = 'Audit July payroll anomalies and check recruitment candidates';
    const state = await LangGraphEngine.runStateGraph(prompt);

    expect(state.dagId).toContain('LG-DAG-');
    expect(state.nodes.length).toBeGreaterThan(2);
    expect(state.nodes[0].agentType).toBe('SUPERVISOR');
  });

  it('should activate specialized sub-agents based on prompt domain keywords', async () => {
    const prompt = 'Check SOC2 compliance policy acknowledgments and employee attendance records';
    const state = await LangGraphEngine.runStateGraph(prompt);

    const agentTypes = state.nodes.map(n => n.agentType);
    expect(agentTypes).toContain('COMPLIANCE');
    expect(agentTypes).toContain('ATTENDANCE');
  });

  it('should route prompts via OrchestratorService into LangGraph DAG', async () => {
    const prompt = 'Show C-Suite analytics and headcount velocity';
    const dag = await OrchestratorService.executeNaturalLanguageCommand(prompt);

    expect(dag).toBeDefined();
    expect(dag.totalTokens).toBeGreaterThan(0);
    expect(dag.totalCostUsd).toBeGreaterThan(0);
    expect(dag.steps.some(s => s.agentType === 'ANALYTICS' || s.agentType === 'EXECUTIVE_AI')).toBe(true);
  });
});
