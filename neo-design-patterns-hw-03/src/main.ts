import { PaymentProviderFactory } from "./core/PaymentProviderFactory";
import { StripeFactory } from "./providers/stripe/StripeFactory";
import { PaypalFactory } from "./providers/paypal/PaypalFactory";
import { AppleFactory } from "./providers/apple/AppleFactory";
import { PaymentContext } from "./app/PaymentContext";

const providerType = process.argv[2];

let factory: PaymentProviderFactory;

switch (providerType) {
  case "stripe":
    factory = new StripeFactory();
    break;

  case "paypal":
    factory = new PaypalFactory();
    break;

  case "apple":
    factory = new AppleFactory();
    break;

  default:
    throw new Error("Unknown payment provider");
}

const context = new PaymentContext(factory);

context.processPayment(100);
