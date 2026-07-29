import { describe, it, expect } from 'vitest';
import { DomainEventPublisher } from '../src/domain/events/DomainEventPublisher';
import { JWTVerificationService } from '../src/application/services/JWTVerificationService';
import { AuthService } from '../src/application/services/AuthService';

describe('TalentOS AI Senior Architect Review & Quality Suite', () => {
  it('should publish and subscribe to DDD Domain Events', () => {
    let capturedEvent: any = null;

    const unsubscribe = DomainEventPublisher.subscribe('EMPLOYEE_CREATED', (evt) => {
      capturedEvent = evt;
    });

    DomainEventPublisher.publish({
      tenantId: 'TNT-01',
      eventType: 'EMPLOYEE_CREATED',
      aggregateId: 'EMP-999',
      payload: { name: 'Test Employee', role: 'Engineer' }
    });

    expect(capturedEvent).toBeDefined();
    expect(capturedEvent.aggregateId).toBe('EMP-999');
    expect(DomainEventPublisher.getEventHistory('TNT-01').length).toBeGreaterThan(0);

    unsubscribe();
  });

  it('should verify JWT tokens and validate payload claims', async () => {
    const session = await AuthService.login('user@talentos.ai', 'password123');
    const result = JWTVerificationService.decodeAndVerifyJWT(session.accessToken);

    expect(result.isValid).toBe(true);
    expect(result.payload?.sub).toBe(session.user.id);
    expect(result.payload?.tenantId).toBe(session.user.tenantId);
  });

  it('should reject malformed or expired JWT tokens', () => {
    const malformedResult = JWTVerificationService.decodeAndVerifyJWT('invalid.jwt.token');
    expect(malformedResult.isValid).toBe(false);
    expect(malformedResult.error).toContain('Decode Failed');
  });
});
