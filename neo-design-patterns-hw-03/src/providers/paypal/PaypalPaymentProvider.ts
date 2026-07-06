import { PaymentProvider } from "../../core/PaymentProvider";

export class PaypalPaymentProvider implements PaymentProvider {
  authorize(amount: number): void {
    console.log(`[PayPal] Authorizing $${amount}`);
  }

  capture(transactionId: string): void {
    console.log(`[PayPal] Capturing transaction ${transactionId}`);
  }

  refund(transactionId: string): void {
    console.log(`[PayPal] Refunding transaction ${transactionId}`);
  }
}
