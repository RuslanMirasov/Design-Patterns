# Звіт з виконання ДЗ-3: Factory Method / Abstract Factory

## Використані патерни

- **Factory Method** — кожна `XxxFactory` інкапсулює `new XxxPaymentProvider()` за методом
  `createPaymentProvider()`. `PaymentContext` ніколи не викликає `new` напряму.
- **Abstract Factory** — інтерфейс `PaymentProviderFactory` є єдиною точкою створення провайдера,
  завдяки чому `PaymentContext` і `main.ts` працюють з будь-яким провайдером однаково.

## Ключові рішення

- `PaymentContext` отримує фабрику в конструкторі, а сам провайдер створює всередині
  `processPayment()` — так фабричний метод викликається саме в момент виконання операції.
- `transactionId` генерується випадково (`Math.random().toString(36)`) для кожного платежу.
- `main.ts` обирає фабрику за аргументом командного рядка; невідомий провайдер призводить до
  помилки (fail-fast).

## Перевірка результату

Проєкт компілюється без помилок і перевірений запуском для всіх трьох провайдерів:

```
$ npx ts-node src/main.ts stripe
[Stripe] Authorizing $100
[Stripe] Capturing transaction k8ffoi
[Stripe] Refunding transaction k8ffoi

$ npx ts-node src/main.ts paypal
[PayPal] Authorizing $100
[PayPal] Capturing transaction 8nrsjg
[PayPal] Refunding transaction 8nrsjg

$ npx ts-node src/main.ts apple
[ApplePay] Authorizing $100
[ApplePay] Capturing transaction ea9m9f
[ApplePay] Refunding transaction ea9m9f
```
