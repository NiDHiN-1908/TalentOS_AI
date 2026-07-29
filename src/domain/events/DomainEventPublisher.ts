export interface DomainEvent {
  eventId: string;
  tenantId: string;
  eventType: string;
  aggregateId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export type DomainEventListener = (event: DomainEvent) => void;

export class DomainEventPublisher {
  private static listeners: Map<string, Set<DomainEventListener>> = new Map();
  private static eventHistory: DomainEvent[] = [];

  public static subscribe(eventType: string, listener: DomainEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public static publish(event: Omit<DomainEvent, 'eventId' | 'timestamp'>): DomainEvent {
    const fullEvent: DomainEvent = {
      ...event,
      eventId: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    this.eventHistory.unshift(fullEvent);

    const typeListeners = this.listeners.get(event.eventType);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(fullEvent));
    }

    return fullEvent;
  }

  public static getEventHistory(tenantId?: string): DomainEvent[] {
    if (!tenantId) return this.eventHistory;
    return this.eventHistory.filter(e => e.tenantId === tenantId);
  }
}
