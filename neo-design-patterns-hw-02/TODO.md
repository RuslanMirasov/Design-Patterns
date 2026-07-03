# ДЗ-2 до теми "Принципи проєктування SOLID"

У реальних проєктах погана архітектура часто не видно одразу — але з часом вона ускладнює підтримку, тестування та розвиток системи. Це завдання — можливість попрактикуватися у виявленні таких недоліків і вдосконаленні структури проєкту за принципами SOLID. Ви побачите, як через правильні абстракції та інтерфейси код стає зрозумілішим, гнучкішим і готовим до змін.

Вам надано приклад простої системи повідомлень, у якій навмисно реалізовано архітектуру, що порушує принципи проєктування SOLID. Ваше завдання — провести архітектурний рефакторинг, дотримуючись принципів SOLID, та реалізувати систему повідомлень, яка може бути масштабовано, легко підтримуваною та модульною.

### Початкова структура проєкту:

```JavaScript
src/
├── models/
│   └── User.ts
├── services/
│   ├── Logger.ts
│   └── NotificationService.ts
├── main.ts
└── tsconfig.json
```

Зміст файлу **src/models/User.ts**

```JavaScript
import { NotificationService } from "../services/NotificationService";

export class User {
  constructor(
    public email: string,
    public phone: string,
    public deviceToken: string
  ) {}

  sendNotification(message: string): void {
    const notifier = new NotificationService();
    notifier.sendEmail(this, message);
    notifier.sendSMS(this, message);
    notifier.sendPush(this, message);
  }
}
```

Зміст файлу **src/services/NotificationService.ts**

```JavaScript
import { User } from "../models/User";
import { Logger } from "./Logger";

export class NotificationService {
  private logger = new Logger();

  sendEmail(user: User, message: string): void {
    this.logger.log(`Sending EMAIL to ${user.email}`);
    console.log(`Email sent to ${user.email}: ${message}`);
  }

  sendSMS(user: User, message: string): void {
    this.logger.log(`Sending SMS to ${user.phone}`);
    console.log(`SMS sent to ${user.phone}: ${message}`);
  }

  sendPush(user: User, message: string): void {
    this.logger.log(`Sending PUSH to ${user.deviceToken}`);
    console.log(`Push sent to ${user.deviceToken}: ${message}`);
  }
}
```

Зміст файлу **src/services/Logger.ts**

```JavaScript
export class Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}
```

Зміст файлу **src/main.ts**

```JavaScript
import { User } from "./models/User";

const user = new User(
  "example@email.com",
  "+380123456789",
  "device-token-abc"
);

user.sendNotification("Ваш платіж оброблено успішно!");
```

## Пояснення наявних порушень:

1. Принцип єдиної відповідальності (SRP) порушено у двох класах:

- Клас User одночасно зберігає дані користувача і відповідає за надсилання повідомлень.
- Клас NotificationService реалізує логіку надсилання повідомлень і логування — це різні відповідальності.

2. Принцип відкритості-закритості (OCP) порушено тим, що додавання нового типу повідомлення наприклад, Telegram вимагає модифікації коду NotificationService, замість додавання окремого модуля.

3. Принцип підстановки Лісков (LSP) не реалізовано — сервіси повідомлень не уніфіковано через спільний інтерфейс, що унеможливлює взаємозамінність.

4. Принцип розділення інтерфейсів (ISP) взагалі не реалізовано — усі методи надсилання повідомлень перебувають у одному класі, незалежно від того, який канал буде використано.

5. Принцип інверсії залежностей (DIP) порушено, бо класи створюють залежності напряму new Logger() у NotificationService, new NotificationService() у User, замість того, щоб покладатися на абстракції.

## Завдання:

Провести повний рефакторинг наданого коду відповідно до принципів SOLID. Очікується, що результатом буде система, в якій:

- кожен клас відповідає лише за одну функцію;
- додавання нового типу повідомлення не потребує зміни існуючих класів;
- усі сервіси повідомлень реалізують спільний інтерфейс;
- класи не створюють залежності напряму, а отримують їх через інтерфейси;
- приклад роботи системи представлено в main.ts.

Після виконаного рефакторінгу структура проєкту повинна бути наступною

```JavaScript
/src
  /core
    interfaces.ts
  /models
    User.ts
  /services
    NotificationService.ts
    EmailNotification.ts
    SMSNotification.ts
    PushNotification.ts
    Logger.ts
  main.ts
```

## Очікуваний результат:

- Усі канали повідомлень Email, SMS, Push мають бути окремими сервісами, які реалізують спільний інтерфейс.
- Клас NotificationService не повинен знати про конкретні реалізації каналів.
- Logger має бути переданим як залежність через інтерфейс.
- Клас User більше не викликає логіку повідомлень.
- У main.ts повинна бути наочно продемонстрована взаємодія з системою через абстракції.

### Виведення:

```JavaScript
[LOG] Sending EMAIL to user@example.com
Email sent to user@example.com: Ваш платіж оброблено успішно!
[LOG] Sending SMS to +1234567890
SMS sent to +1234567890: Ваш платіж оброблено успішно!
[LOG] Sending PUSH to device-token-123
Push sent to device-token-123: Ваш платіж оброблено успішно!
```
