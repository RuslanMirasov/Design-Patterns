import { PaymentProvider } from "../../core/PaymentProvider";

export class ApplePaymentProvider implements PaymentProvider {
  authorize(amount: number): void {
    console.log(`[ApplePay] Authorizing $${amount}`);
  }

  capture(transactionId: string): void {
    console.log(`[ApplePay] Capturing transaction ${transactionId}`);
  }

  refund(transactionId: string): void {
    console.log(`[ApplePay] Refunding transaction ${transactionId}`);
  }
}
