import { OfflineSyncEngine } from '../src/services/OfflineSyncEngine';
import { BiometricSecurityService } from '../src/services/BiometricSecurityService';

describe('Enterprise Mobile Experience Platform Foundation', () => {
  test('should enqueue action offline and flush pending queue upon network reconnection', async () => {
    expect(OfflineSyncEngine.getPendingQueueCount()).toBe(0);

    await OfflineSyncEngine.enqueueAction('/api/v1/attendance/check-in', 'POST', {
      employee_id: 'EMP-101',
      gps_lat: 37.7749,
      gps_long: -122.4194
    });

    expect(OfflineSyncEngine.getPendingQueueCount()).toBe(1);

    const syncRes = await OfflineSyncEngine.flushPendingQueue();
    expect(syncRes.syncedCount).toBe(1);
    expect(OfflineSyncEngine.getPendingQueueCount()).toBe(0);
  });

  test('should authenticate via biometric vault and return JWT token', async () => {
    const authRes = await BiometricSecurityService.authenticateBiometric('Scan FaceID');
    assert(authRes.success === true);
    assert(authRes.biometricType === 'FACE_ID');
    assert(authRes.authToken !== undefined);
  });
});
