import { AgentType, TaskStatus } from '../../../domain/types';

export interface LangGraphAgentMessage {
  id: string;
  senderAgent: AgentType;
  recipientAgent: AgentType | 'BROADCAST';
  content: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface LangGraphNodeState {
  nodeId: string;
  agentType: AgentType;
  actionName: string;
  thoughtTrace: string;
  inputPrompt: string;
  outputResult?: string;
  qualityScore: number; // 0 - 100%
  status: TaskStatus;
  retryCount: number;
  durationMs: number;
  tokensUsed: number;
  costUsd: number;
}

export interface LangGraphState {
  dagId: string;
  tenantId: string;
  userPrompt: string;
  currentStepIndex: number;
  nodes: LangGraphNodeState[];
  messages: LangGraphAgentMessage[];
  workingMemory: string[];
  episodicMemoryQuery?: string;
  requiresHumanApproval: boolean;
  approvalRequestId?: string;
  status: TaskStatus;
  totalTokens: number;
  totalCostUsd: number;
  createdAt: string;
  completedAt?: string;
}
