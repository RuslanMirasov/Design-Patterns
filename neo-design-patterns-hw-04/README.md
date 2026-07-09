# Домашнє завдання до Теми 4

### Опис завдання

У цьому домашньому завданні необхідно опрацювати три окремі приклади застосування породжувальних патернів: Одинак, Будівельник та Прототип.

Кожен приклад подано як реалістичну задачу з практичного TypeScript-контексту. Ваше завдання — проаналізувати початковий код та застосувати відповідний патерн, переписавши реалізацію.

## Патерни

- **Одинак (Singleton)** — `src/singleton` — гарантує єдиний екземпляр `AppConfigService` у всій системі.
- **Будівельник (Builder)** — `src/builder` — покроково формує текстовий документ через `DocumentBuilder`.
- **Прототип (Prototype)** — `src/prototype` — клонує профіль користувача `UserProfile` через `clone()` із глибоким копіюванням `permissions`.

## Структура проєкту

```
src/
├── builder/          # Builder pattern implementation
│   ├── DocumentBuilder.ts
│   └── main.ts
├── prototype/        # Prototype pattern implementation
│   ├── UserProfilePrototype.ts
│   ├── UserProfile.ts
│   └── main.ts
└── singleton/        # Singleton pattern implementation
    ├── AppConfigService.ts
    └── main.ts
```

## Запуск

1. Встановити залежності:

```bash
npm install
```

2. Запустити приклад Builder патерну:

```bash
npm run builder
```

3. Запустити приклад Prototype патерну:

```bash
npm run prototype
```

4. Запустити приклад Singleton патерну:

```bash
npm run singleton
```

Для розробки з автоматичною перезбіркою:

```bash
npm run dev
```

Альтернативно кожен приклад можна запустити напряму через `ts-node`:

```bash
npx ts-node src/singleton/main.ts
npx ts-node src/builder/main.ts
npx ts-node src/prototype/main.ts
```
