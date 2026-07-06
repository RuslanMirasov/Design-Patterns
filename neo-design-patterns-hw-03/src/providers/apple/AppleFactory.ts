import { PaymentProviderFactory } from "../../core/PaymentProviderFactory";
import { PaymentProvider } from "../../core/PaymentProvider";
import { ApplePaymentProvider } from "./ApplePaymentProvider";

export class AppleFactory implements PaymentProviderFactory {
  createPaymentProvider(): PaymentProvider {
    return new ApplePaymentProvider();
  }
}
