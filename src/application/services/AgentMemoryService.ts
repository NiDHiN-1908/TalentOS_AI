import { MemoryEntry } from '../../domain/types';

export class AgentMemoryService {
  private static memories: MemoryEntry[] = [
    {
      id: 'MEM-01',
      tenantId: 'TNT-TALENTOS-01',
      memoryType: 'semantic',
      content: 'Engineering Department headcount policy: 1 Lead Architect required per 8 Engineers.',
      metadata: { department: 'Engineering' },
      timestamp: '2026-07-01T00:00:00Z'
    },
    {
      id: 'MEM-02',
      tenantId: 'TNT-TALENTOS-01',
      memoryType: 'episodic',
      content: 'Q2 2026 Payroll Audit resolved 3 salary variance anomalies after HR VP sign-off.',
      metadata: { period: 'Q2 2026' },
      timestamp: '2026-06-30T00:00:00Z'
    }
  ];

  public static addMemory(tenantId: string, type: MemoryEntry['memoryType'], content: string, metadata: Record<string, any> = {}) {
    const entry: MemoryEntry = {
      id: `MEM-${Date.now()}`,
      tenantId,
      memoryType: type,
      content,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.memories.push(entry);
    return entry;
  }

  public static queryMemories(tenantId: string, query: string): MemoryEntry[] {
    const q = query.toLowerCase();
    return this.memories.filter(m => 
      m.tenantId === tenantId && 
      (m.content.toLowerCase().includes(q) || JSON.stringify(m.metadata).toLowerCase().includes(q))
    );
  }
}
