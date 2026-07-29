interface RateLimitRecord {
  attempts: number;
  resetTime: number;
}

export class RateLimiterService {
  private static records: Map<string, RateLimitRecord> = new Map();
  private static MAX_ATTEMPTS = 5;
  private static WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  public static isRateLimited(key: string): { isLimited: boolean; remainingAttempts: number; retryAfterSeconds: number } {
    const now = Date.now();
    const record = this.records.get(key);

    if (!record) {
      return { isLimited: false, remainingAttempts: this.MAX_ATTEMPTS, retryAfterSeconds: 0 };
    }

    if (now > record.resetTime) {
      this.records.delete(key);
      return { isLimited: false, remainingAttempts: this.MAX_ATTEMPTS, retryAfterSeconds: 0 };
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      return { isLimited: true, remainingAttempts: 0, retryAfterSeconds };
    }

    return {
      isLimited: false,
      remainingAttempts: this.MAX_ATTEMPTS - record.attempts,
      retryAfterSeconds: 0
    };
  }

  public static recordAttempt(key: string, isFailure: boolean) {
    const now = Date.now();
    let record = this.records.get(key);

    if (!record || now > record.resetTime) {
      record = { attempts: 0, resetTime: now + this.WINDOW_MS };
    }

    if (isFailure) {
      record.attempts += 1;
      this.records.set(key, record);
    } else {
      this.records.delete(key); // Reset on successful login
    }
  }

  public static clear(key: string) {
    this.records.delete(key);
  }
}
