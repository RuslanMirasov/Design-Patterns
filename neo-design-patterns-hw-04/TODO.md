# ДЗ-4 до теми "Одинак, Будівельник та Прототип"

У цьому домашньому завданні необхідно опрацювати три окремі приклади застосування породжувальних патернів: Одинак, Будівельник та Прототип.

Кожен приклад подано як реалістичну задачу з практичного TypeScript-контексту. Ваше завдання — проаналізувати початковий код та застосувати відповідний патерн, переписавши реалізацію.

Всі три приклади повинні бути реалізовані в одному репозиторії, і кожен у власній директорії типу:

```
/src
  /singleton
    AppConfigService.ts
    main.ts
  /builder
    ...
  /prototype
    ...
```

## Реалізація патерну Одинак

Надається реалізація класу AppConfigService, який зберігає глобальні налаштування для всього застосунку. У поточній реалізації немає обмеження на кількість створених екземплярів, тому кожен модуль створює новий об’єкт і втрачає єдність конфігурації.

Ваше завдання — перетворити AppConfigService на Одинак, щоб у всій системі існував лише один екземпляр конфігураційного сервісу.

Початковий код **src\\singleton\\AppConfigService.ts**:

```JavaScript
export class AppConfigService {
  constructor(
    public readonly companyName: string,
    public readonly footer: string
  ) {}
}
```

Файл **src\\singleton\\main.ts**

```JavaScript
import { AppConfigService } from "./core/AppConfigService";

const config1 = new AppConfigService("Acme Inc.", "Confidential");
const config2 = new AppConfigService("Another Corp", "Top Secret");

console.log(config1.companyName); // Acme Inc.
console.log(config2.companyName); // Another Corp
```

### Очікуваний результат

- Уся система має використовувати єдиний об’єкт AppConfigService.
- Неможливо створити новий об’єкт напряму через new.
- У main.ts при повторному виклику отримується вже створений екземпляр:

```JavaScript
const config1 = AppConfigService.getInstance();
const config2 = AppConfigService.getInstance();

console.log(config1 === config2); // true
```

### Вимоги

- Код із реалізацією Одинака **AppConfigService** у файлі **src\\singleton\\AppConfigService.ts**;
- Файл **main.ts**, який демонструє правильну поведінку;

## Реалізація патерну Будівельник

У компанії генеруються текстові документи, які складаються з кількох частин: заголовка, основного тексту, підпису. На цей момент документ формується вручну, через конкатенацію рядків у довільному порядку, що призводить до дублювання коду та помилок структури.

Ваше завдання — застосувати патерн Будівельник, щоб централізувати логіку формування документа, зробити її гнучкою, передбачуваною та контрольованою.

Початковий код в файлі **src/builder/main.ts**:

```JavaScript
const header = "ACME Corporation — Report";
const body = "Quarterly performance increased by 12%.";
const footer = "--- Confidential ---";

const myDocument = header + "\\\\n\\\\n" + body + "\\\\n\\\\n" + footer;

console.log(myDocument);
```

Очікуваний результат

```JavaScript
const builder = new DocumentBuilder();
const output = builder
  .addHeader("ACME Corporation — Report")
  .addBody("Quarterly performance increased by 12%.")
  .addFooter("--- Confidential ---")
  .build();

console.log(output);
```

Виведення:

```JavaScript
=== ACME Corporation — Report ===

Quarterly performance increased by 12%.

--- Confidential ---
```

### Вимоги

1. У файлі **src/builder/DocumentBuilder.ts** створено клас **DocumentBuilder**, який:

- має методи **addHeader(string)**, **addBody(string)**, **addFooter(string)**;
- будує документ методом **build(): string**;
- зберігає порядок частин незалежно від порядку викликів.

2. Переписано **main.ts**, і він створює документ через DocumentBuilder та демонструє використання патерну.

## Реалізація патерну Прототип

У внутрішній системі управління користувачами зберігаються типові профілі доступу — наприклад, **"finance-chief"** або **"engineering-lead"**. Кожен профіль включає ім’я користувача, відділ і набір прав доступу. Часто виникає потреба створити нового користувача на основі існуючого профілю, з незначними змінами.

Ваше завдання — застосувати патерн Прототип, реалізувавши метод **clone()**, який створює незалежну копію об'єкта профілю користувача.

У файлі **src/prototype/UserProfilePrototype.ts** створіть інтерфейс:

```JavaScript
export interface UserProfilePrototype {
  clone(): UserProfilePrototype;
}
```

У файлі **src/prototype/UserProfile.ts** реалізуйте клас **UserProfile**, який реалізує **UserProfilePrototype** та має наступні поля:

```JavaScript
username: string;
department: 'finance' | 'engineering' | 'marketing';
permissions: {
  canEditUsers: boolean;
  canApproveBudget: boolean;
  canAccessInternalTools: boolean;
};
```

Клас повинен реалізувати метод **clone()**, який повертає новий об’єкт з новим об’єктом permissions, як глибока копія.

У файлі **src/prototype/main.ts**:

- створіть профіль **"Гупало Іван"** з усіма правами;
- створіть копію цього профілю;
- змініть **username** та вимкніть **canEditUsers** у копії;
- виведіть обидва профілі у консоль та переконайтесь, що оригінал не змінився.

## Очікуваний результат

```JavaScript
const chief = new UserProfile("Гупало Іван", "finance", {
  canEditUsers: true,
  canApproveBudget: true,
  canAccessInternalTools: true
});

const deputy = chief.clone() as UserProfile;
deputy.username = "Коваль Максим";
deputy.permissions.canEditUsers = false;

console.log(chief);
console.log(deputy);
```

### Вимоги

1. У файлі **src/prototype/UserProfilePrototype.ts** описано інтерфейс **UserProfilePrototype** з методом **clone(): UserProfilePrototype**.

2. У файлі **src/prototype/UserProfile.ts** реалізовано клас **UserProfile**, який:

- реалізує інтерфейс **UserProfilePrototype**;
- має публічні поля:
- **username: string**;
- **department: 'finance' | 'engineering' | 'marketing'**;
- **permissions: { canEditUsers: boolean; canApproveBudget: boolean; canAccessInternalTools: boolean; }**

3. У методі **clone()** класу **UserProfile** реалізовано:

- створення нового екземпляра класу **UserProfile**;
- копіювання значень усіх полів;
- обов’язкове створення нового об’єкта permissions, а не посилання на існуючий, тобто глибоке клонування.

4. У **main.ts** реалізовано демонстрацію:

- створення об’єкта **UserProfile** з усіма правами доступу;
- клонування цього об’єкта через **clone()**;
- редагування деяких полів у копії;
- виведення в консоль обох об’єктів для підтвердження незалежності копії.

## Вимоги cтруктури

- Репозиторій має окремі директорії: **src/singleton**, **src/builder**, **src/prototype**;
- У кожній — реалізація патерну з файлом **main.ts** для демонстрації;

У репозиторії обов’язково має бути файл **README.md**, який містить:

- назву кожного патерну;
- структуру проєкту;
- інструкцію запуску:

```JavaScript
npx ts-node src/singleton/main.ts
npx ts-node src/builder/main.ts
npx ts-node src/prototype/main.ts
```
