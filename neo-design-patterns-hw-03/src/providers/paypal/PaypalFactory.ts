import { PaymentProviderFactory } from "../../core/PaymentProviderFactory";
import { PaymentProvider } from "../../core/PaymentProvider";
import { PaypalPaymentProvider } from "./PaypalPaymentProvider";

export class PaypalFactory implements PaymentProviderFactory {
  createPaymentProvider(): PaymentProvider {
    return new PaypalPaymentProvider();
  }
}
