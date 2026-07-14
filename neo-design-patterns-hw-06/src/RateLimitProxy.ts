import { IMessageService } from "./IMessageService";

export class RateLimitProxy implements IMessageService {
  private lastSentTime = 0;

  constructor(
    private wrappee: IMessageService,
    private intervalMs: number,
  ) {}

  send(message: string): void {
    const now = Date.now();

    if (now - this.lastSentTime < this.intervalMs) {
      console.log("[RateLimit] skipped");
      return;
    }

    this.lastSentTime = now;
    this.wrappee.send(message);
  }
}

export function createRateLimitProxy(
  service: IMessageService,
  intervalMs: number,
): IMessageService {
  return new RateLimitProxy(service, intervalMs);
}
