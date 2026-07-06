import { PaymentProviderFactory } from "../core/PaymentProviderFactory";

export class PaymentContext {
  constructor(private factory: PaymentProviderFactory) {}

  processPayment(amount: number): void {
    const provider = this.factory.createPaymentProvider();
    const transactionId = this.generateTransactionId();

    provider.authorize(amount);
    provider.capture(transactionId);
    provider.refund(transactionId);
  }

  private generateTransactionId(): string {
    return Math.random().toString(36).slice(2, 8);
  }
}
