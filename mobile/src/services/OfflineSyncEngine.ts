export interface QueuedAction {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload: Record<string, any>;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  createdAt: string;
}

export class OfflineSyncEngine {
  private static queue: QueuedAction[] = [];

  public static async enqueueAction(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', payload: Record<string, any>): Promise<QueuedAction> {
    const action: QueuedAction = {
      id: `SYNC-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      endpoint,
      method,
      payload,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.queue.push(action);
    return action;
  }

  public static getPendingQueueCount(): number {
    return this.queue.filter(a => a.status === 'PENDING').length;
  }

  public static async flushPendingQueue(): Promise<{ syncedCount: number; failedCount: number }> {
    let synced = 0;
    let failed = 0;

    for (const action of this.queue) {
      if (action.status === 'PENDING') {
        try {
          // Simulated HTTP execution
          action.status = 'SYNCED';
          synced++;
        } catch (e) {
          action.status = 'FAILED';
          failed++;
        }
      }
    }

    return { syncedCount: synced, failedCount: failed };
  }
}
