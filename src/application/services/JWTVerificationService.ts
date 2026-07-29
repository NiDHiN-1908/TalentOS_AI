import { JWTPayload } from '../../domain/types/auth';

export class JWTVerificationService {
  
  public static decodeAndVerifyJWT(token: string): { isValid: boolean; payload?: JWTPayload; error?: string } {
    if (!token) {
      return { isValid: false, error: 'Token string is empty' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, error: 'Invalid JWT structure. Must contain 3 dot-separated parts.' };
    }

    try {
      const payloadJson = atob(parts[1]);
      const payload: JWTPayload = JSON.parse(payloadJson);

      // Expiry Check
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp && nowSeconds > payload.exp) {
        return { isValid: false, error: 'Token has expired.' };
      }

      // Tenant & Subject Integrity Check
      if (!payload.sub || !payload.tenantId) {
        return { isValid: false, error: 'Missing mandatory claims (sub / tenantId).' };
      }

      return { isValid: true, payload };
    } catch (e: any) {
      return { isValid: false, error: `JWT Decode Failed: ${e.message}` };
    }
  }
}
