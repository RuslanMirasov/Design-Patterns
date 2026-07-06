import { PaymentProviderFactory } from "../../core/PaymentProviderFactory";
import { PaymentProvider } from "../../core/PaymentProvider";
import { StripePaymentProvider } from "./StripePaymentProvider";

export class StripeFactory implements PaymentProviderFactory {
  createPaymentProvider(): PaymentProvider {
    return new StripePaymentProvider();
  }
}
