# Домашнє завдання до Теми 8

У цьому домашньому завданні необхідно додати до генератора документа (попереднє домашнє завдання) реактивний шар, який дозволяє відслідковувати процес рендерингу окремих елементів документа. Під час генерації кожен елемент Paragraph, List, Section має повідомляти про те, що він закінчив роботу. Реакція на ці події має реалізовуватись через механізм підписки — тобто через патерн Спостерігач (Observer).

Центральний об'єкт має називатися RenderEventPublisher, який зберігає список підписників і розсилає їм повідомлення про подію, що відбулася. Кожен підписник реалізує інтерфейс RenderEventSubscriber, який містить метод update(context: RenderContext). Події передаються у вигляді об’єкта типу RenderContext, який включає тип елемента, його вміст, додаткову інформацію, як рівень заголовка, кількість пунктів у списку, а також час рендерингу.

Після інтеграції підписників, кожен елемент документа під час рендерингу зможе надсилати подію, на яку реагують підключені сервіси — наприклад, логування або збір статистики. Це дозволяє безболісно розширювати застосунок новими компонентами, такими як логери, аналітика, профайлери, системи повідомлень тощо.

## Завдання

Розширити структуру генератора документа з попередньої теми, реалізувавши спостережувану модель рендерингу. Для цього необхідно реалізувати такі компоненти:

Компонент RenderEventPublisher — це центральний об’єкт, який зберігає список підписників і розсилає їм події. Має бути реалізований як статичний клас.

```JavaScript
export class RenderEventPublisher {
  static subscribe(subscriber: RenderEventSubscriber): void;
  static unsubscribe(subscriber: RenderEventSubscriber): void;
  static notify(context: RenderContext): void;
}
```

Компонент RenderEventSubscriber — це інтерфейс, який повинен реалізовувати кожен підписник.

```JavaScript
import { RenderContext } from './RenderContext';

export interface RenderEventSubscriber {
    update(context: RenderContext): void;
}
```

Компонент RenderContext — це тип, який описує деталі події рендерингу.

```JavaScript
export interface RenderContext {
    type: 'Section' | 'Paragraph' | 'List';
    content: string;
    level?: number;
    items?: string[];
    renderTime?: number;
}
```

Цей об’єкт передається всім підписникам щоразу, коли елемент документа закінчує свою роботу.

Необхідно також реалізувати підписники в директорії src/subscribers/.

Підписник RenderLoggerSubscriber виводить у консоль повідомлення про кожен відрендерений елемент, наприклад як [Log] Rendered Paragraph (36 chars).

Підписник SummaryCollector збирає статистику по типах елементів (кількість секцій, параграфів, списків) і виводить її після завершення генерації. Наприклад як, [Summary] Rendered 4 sections, 3 paragraphs, 2 lists

Останній підписник PerformanceSubscriber, який заміряє час генерації кожного елемента і виводить загальний час: [Performance] Total render time: 5ms.

Кожен елемент документа Section, Paragraph та List після завершення генерації викликає:

```JavaScript
RenderEventPublisher.notify(context);
```

Сам виклик можна реалізувати у render()-методі відповідного елемента або винести у допоміжний метод, наприклад у BaseRenderer, якщо зручно.

У main.ts має бути підключено всі підписники через subscribe().

```JavaScript
const logger = new RenderLoggerSubscriber();
const summary = new SummaryCollector();
const perf = new PerformanceSubscriber();

RenderEventPublisher.subscribe(logger);
RenderEventPublisher.subscribe(summary);
RenderEventPublisher.subscribe(perf);
```

## Очікуваний результат

Запуск застосунку:

```JavaScript
npx ts-node .\\src\\main.ts markdown output.md
```

Повинен виводити в консолі повідомлення рендерингу:

```JavaScript
[Log] Rendered Paragraph (44 chars)
[Log] Rendered Paragraph (53 chars)
[Log] Rendered List (3 items)
[Log] Rendered Section ("Composite", level 2)
[Log] Rendered Paragraph (34 chars)
[Log] Rendered List (2 items)
[Log] Rendered Section ("Bridge", level 2)
[Log] Rendered Section ("Основні патерни", level 2)
[Log] Rendered Section ("Структурні патерни", level 1)
[Summary] Rendered 4 sections, 3 paragraphs, 2 lists
[Performance] Total render time: 5ms
```

Ці повідомлення генеруються як результат виклику notify(context) і спрацьовування підписників.

Структура проєкту має бути доповнена такими файлами:

- RenderEventPublisher.ts
- interfaces/RenderEventSubscriber.ts
- interfaces/RenderContext.ts
- subscribers/RenderLoggerSubscriber.ts
- subscribers/SummaryCollector.ts
- subscribers/PerformanceSubscriber.ts

  Структура директорій з цими файлами наступна:

```JavaScript
/
└── src/
    ├── main.ts
    ├── RenderEventPublisher.ts
    ├── interfaces/
    │   ├── RenderEventSubscriber.ts
    │   ├── RenderContext.ts
    │   └── ...
    ├── subscribers/
    │   ├── RenderLoggerSubscriber.ts
    │   ├── SummaryCollector.ts
    │   └── PerformanceSubscriber.ts
    ├── nodes/
    │   └── ...
    ├── factories/
    │   └── ...
    └── renderers/
        └── ...
```

Всі інші файли попередньої домашньої роботи замінені на ….

Структура проєкту має бути доповнена відповідними файлами;
Файл main.ts повинен містити підключення підписників через subscribe() перед генерацією.

Файл README.md повинен містити пояснення, як реалізовано патерн Observer, приклад виклику і виводу та приклад створення нового підписника.
