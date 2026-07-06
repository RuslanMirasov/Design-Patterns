import { PaymentProvider } from "../../core/PaymentProvider";

export class StripePaymentProvider implements PaymentProvider {
  authorize(amount: number): void {
    console.log(`[Stripe] Authorizing $${amount}`);
  }

  capture(transactionId: string): void {
    console.log(`[Stripe] Capturing transaction ${transactionId}`);
  }

  refund(transactionId: string): void {
    console.log(`[Stripe] Refunding transaction ${transactionId}`);
  }
}
