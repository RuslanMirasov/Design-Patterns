# ДЗ-3 до теми "Factory Method / Abstract Factory"

У реальних застосунках робота з платіжними системами — це завжди про змінність, залежності й масштабованість. У цьому завданні ви навчитеся відділяти створення об’єктів від їх використання за допомогою патернів Factory Method і **Abstract Factory**, що дає змогу будувати гнучкі, модульні та розширювані системи. Це базовий крок до створення архітектур, які легко адаптуються під зміну бізнес-вимог і технологій.

Необхідно реалізувати імітаційну архітектуру платіжної системи, яка підтримує кілька провайдерів: **Stripe, PayPal і ApplePay**. Кожен провайдер реалізує однакову функціональність: **authorize → capture → refund**.

Завдання полягає в застосуванні патернів Factory Method та Abstract Factory, щоб:

- відокремити логіку створення об’єктів;
- спростити розширення системи новими провайдерами;
- приховати використання new за фабричним шаром.

Це завдання не передбачає використання реальних платіжних систем чи SDK. Реалізація платіжних сервісів є імітацією і виконується через console.log.

Приклад:

```JavaScript
console.log(`[Stripe] Authorizing $${amount}`);
console.log(`[ApplePay] Refunding transaction ${transactionId}`);
```

## Завдання

У файлі src/core/PaymentProvider.ts створіть інтерфейс платіжного сервісу PaymentProvider з такими методами:

```JavaScript
export interface PaymentProvider {
  authorize(amount: number): void;
  capture(transactionId: string): void;
  refund(transactionId: string): void;
}
```

У файлі **src/core/PaymentProviderFactory.ts** опишіть інтерфейс фабрики PaymentProviderFactory, який створює сервіс:

```JavaScript
import { PaymentProvider } from "./PaymentProvider";

export interface PaymentProviderFactory {
  createPaymentProvider(): PaymentProvider;
}
```

Виконайте реалізацію трьох платіжних провайдерів. Створіть у директорії src/providers три директорії: stripe/, paypal/, apple/. У кожній з них:

- реалізуйте відповідний клас **XxxPaymentProvider**, який реалізує PaymentProvider в файлі **XxxPaymentProvider.ts**;
- реалізуйте відповідний клас **XxxFactory**, який реалізує **PaymentProviderFactory** та створює відповідний сервіс в файлі **XxxFactory.ts**.

У файлі **src/app/PaymentContext.ts** реалізуйте клас **PaymentContext**, який приймає фабрику у конструкторі й виконує повний платіжний сценарій за допомогою методу **processPayment**.

У головному файлі **src/main.ts** реалізуйте динамічний вибір провайдера.

Структура проєкту повинна бути наступною

```JavaScript
/src
  /core
    PaymentProvider.ts        # Інтерфейс платіжного провайдера
    PaymentProviderFactory.ts # Інтерфейс фабрики провайдерів
  /providers
    /stripe
      StripePaymentProvider.ts # Реалізація Stripe провайдера
      StripeFactory.ts         # Фабрика для Stripe
    /paypal
      PaypalPaymentProvider.ts # Реалізація PayPal провайдера
      PaypalFactory.ts         # Фабрика для PayPal
    /apple
      ApplePaymentProvider.ts  # Реалізація Apple Pay провайдера
      AppleFactory.ts          # Фабрика для Apple Pay
  /app
    PaymentContext.ts         # Контекст для роботи з провайдерами
  main.ts                    # Приклад використання
package.json
tsconfig.json
```

## Очікуваний результат

- Усі класи XxxPaymentProvider реалізують PaymentProvider;
- Усі класи XxxFactory реалізують PaymentProviderFactory;
- Клас PaymentContext працює з будь-якою фабрикою через інтерфейс;
- В main.ts реалізовано сценарій повного платіжного циклу з обраним провайдером;
- Весь код типізовано, він не використовує new поза фабриками, і легко розширюється.

У репозиторії обов’язково має бути файл **README.md**, який містить:

- короткий опис структури проєкту;
- перелік використаних патернів;
- інструкцію запуску проєкту:

```JavaScript
npx ts-node src/main.ts stripe
```

Виведення:

```JavaScript
[Stripe] Authorizing $100
[Stripe] Capturing transaction 4g7rfa
[Stripe] Refunding transaction 4g7rfa
```

або

```JavaScript
npx ts-node src/main.ts paypal
```

Виведення:

```JavaScript
[PayPal] Authorizing $100
[PayPal] Capturing transaction epv2y
[PayPal] Refunding transaction epv2y
```

- Виконайте завдання та відправте його у свій репозиторій.
- Завантажте робочі файли на свій комп’ютер та прикріпіть їх у LMS у форматі zip. Назва архіву повинна бути у форматі ДЗ3_ПІБ.
- Прикріпіть посилання на репозиторій neo-design-patterns-hw-03 та відправте на перевірку.
