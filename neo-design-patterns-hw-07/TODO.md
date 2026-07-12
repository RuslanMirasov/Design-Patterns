# Домашнє завдання до Теми 7

У цьому домашньому завданні необхідно буде реалізувати систему генерації документів, яка дозволяє створювати документ із кількох вкладених блоків. Буде три види блоків — параграфи, списки та секції. Документи необхідно зберігати і виводити у різних форматах: Markdown, HTML, plain text (чистий текст).

Архітектура застосунку повинна демонструвати чітке розділення відповідальностей:

- структура документа моделюється у вигляді дерева елементів, де Section є вузлом, який містить інші елементи;
- форматування виводу делегується окремим об’єктам — рендерерам, що реалізують єдиний інтерфейс.

Це завдання ілюструє два структурні патерни:

- **Composite** — має бути реалізовано в класі Section, який дозволяє створювати ієрархію елементів DocNode;
- **Bridge** — має бути реалізовано через інтерфейс DocRenderer, який можна підставляти у будь-який елемент для зміни формату виводу.

## Завдання

Необхідно реалізувати систему відповідно до структури:

```JavaScript
src/
├── interfaces/          # Інтерфейси
│   ├── DocNode.ts      # Базовий інтерфейс для всіх елементів документа
│   └── DocRenderer.ts  # Інтерфейс для рендерерів
├── renderers/          # Реалізації рендерерів
│   ├── BaseRenderer.ts      # Базовий клас для рендерерів
│   ├── HTMLRenderer.ts      # HTML формат
│   ├── MarkdownRenderer.ts  # Markdown формат
│   └── PlainTextRenderer.ts # Простий текст
├── nodes/              # Елементи документа
│   ├── List.ts        # Список
│   ├── Paragraph.ts   # Параграф
│   └── Section.ts     # Секція (Composite)
├── factories/          # Фабрики
│   └── RendererFactory.ts  # Фабрика для створення рендерерів
└── main.ts            # Точка входу
```

Усі елементи документа Paragraph, List, та Section повинні реалізовувати інтерфейс DocNode, який містить метод render(): string.

```JavaScript
export interface DocNode {
  render(): string;
}
```

Елементи не повинні самостійно вирішувати, у якому форматі генеруватись — це має бути повністю делеговано об’єкту DocRenderer, переданому через конструктор.

```JavaScript
export interface DocRenderer {
  renderHeader(level: number, text: string): string;
  renderParagraph(text: string): string;
  renderList(items: string[]): string;
  wrapDocument(content: string): string;
}
```

Клас Section відповідає за групування інших елементів документа. Він реалізує інтерфейс DocNode, тому поводиться як повноцінний елемент документа, але при цьому містить список дочірніх елементів. У патерні Компонувальник (Composite) елемент може бути простим (Paragraph, List) або бути контейнером інших елементів, тобто мати children, як дерево. Клас Section — це контейнер. Він зберігає список інших DocNode, наприклад: один Paragraph, один List, ще один Section. Водночас, Section сам реалізує інтерфейс DocNode, тобто він сам є частиною документа, як і всі інші елементи.

```JavaScript
export class Section implements DocNode {
  constructor(
    private title: string,
    private renderer: DocRenderer,
    private children: DocNode[] = [],
    private level: number = 1
  ) {}

  add(child: DocNode): void {
    this.children.push(child);
  }

  render(): string {
		// TODO
  }
}
```

Метод render() спочатку формує заголовок секції, а потім додає до нього вивід усіх дочірніх елементів у заданому порядку. Коли ми викликаємо section.render(), метод повинен вивести свій власний заголовок потім — викликати render() для кожного дочірнього елемента та об’єднати всі ці частини в один результат — суцільний текст.

Усі рендери мають реалізовувати інтерфейс DocRenderer, який визначає форматування для заголовків, параграфів і списків. Усі рендери мають наслідуватись від BaseRenderer.

```JavaScript
import { DocRenderer } from "../interfaces/DocRenderer";

export abstract class BaseRenderer implements DocRenderer {
  abstract renderHeader(level: number, text: string): string;
  abstract renderParagraph(text: string): string;
  abstract renderList(items: string[]): string;

  wrapDocument(content: string): string {
    return content;
  }

  protected escape(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
```

Метод wrapDocument() використовується рендерами для обгортки всього виводу — наприклад, у <html>-розмітку.

Для вибору рендера реалізуйте фабрику RendererFactory у директорії src/factories/. Метод createRenderer(format: string): DocRenderer приймає назву формату і повертає відповідний об’єкт. Якщо формат невідомий, фабрика повинна повертати Markdown рендер за замовчуванням.

```JavaScript
class RendererFactory {
  static create(type: RendererType): DocRenderer {
		//TODO
  }

  static getSupportedFormats(): RendererType[] {
    return ['html', 'markdown', 'plain'];
  }
}
```

Тип RendererType має бути оголошений як:

```JavaScript
export type RendererType = 'html' | 'markdown' | 'plain';
```

і може бути розміщений безпосередньо у файлі фабрики.

Цей клас повинен інкапсулювати логіку вибору між MarkdownRenderer, PlainTextRenderer та HTMLRenderer, і має використовуватись у main.ts замість прямого створення рендера.

Формат виводу вибирається через аргумент командного рядка при запуску main.ts. Опціонально можна передати другий аргумент — шлях до файлу, в який потрібно зберегти результат. Якщо шлях не вказано — результат виводиться в консоль.

Приклад реалізації main.ts

```JavaScript
import { writeFileSync } from 'fs';
import { RendererFactory, RendererType } from './factories/RendererFactory';
import { Section } from './nodes/Section';
import { Paragraph } from './nodes/Paragraph';
import { List } from './nodes/List';

function createDocument(format: RendererType): string {
  const renderer = RendererFactory.create(format);
  const doc = new Section("Структурні патерни", renderer, [], 1);

  const patterns = new Section("Основні патерни", renderer, [
    new Paragraph("Розглянемо два важливих структурних патерни.", renderer),
    new Section("Composite", renderer, [
      new Paragraph("Дозволяє створювати деревоподібні структури об'єктів.", renderer),
      new List(["Спрощує структуру", "Гнучкий код", "Легка підтримка"], renderer)
    ], 2),
    new Section("Bridge", renderer, [
      new Paragraph("Розділяє абстракцію та реалізацію.", renderer),
      new List(["Незалежні зміни", "Краща масштабованість"], renderer)
    ], 2)
  ], 2);

  doc.add(patterns);
  return doc.render();
}

const { format, output } = {
  format: (process.argv[2] || 'markdown') as RendererType,
  output: process.argv[3]
};

const content = createDocument(format);
const renderer = RendererFactory.create(format);
const result = renderer.wrapDocument(content);

output ? writeFileSync(output, result) : console.log(result);
```

## Очікуваний результат

При запуску:

```JavaScript
npx ts-node .\\src\\main.ts markdown output.md
```

Буде створено файл output.md:

```JavaScript
# Структурні патерни

## Основні патерни

Розглянемо два важливих структурних патерни.

## Composite

Дозволяє створювати деревоподібні структури об'єктів.

- Спрощує структуру
- Гнучкий код
- Легка підтримка

## Bridge

Розділяє абстракцію та реалізацію.

- Незалежні зміни
- Краща масштабованість
```

При запуску:

```JavaScript
npx ts-node .\\src\\main.ts html output.html
```

створюється файл output.html з вмістом:

```HTML
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }

    h2 {
      color: #2c3e50;
      margin-top: 2em;
    }

    ul {
      list-style-type: disc;
      padding-left: 2em;
    }
  </style>
</head>

<body>
  <h1>Структурні патерни</h1>

  <h2>Основні патерни</h2>

  <p>Розглянемо два важливих структурних патерни.</p>

  <h2>Composite</h2>

  <p>Дозволяє створювати деревоподібні структури об&#039;єктів.</p>

  <ul>
    <li>Спрощує структуру</li>
    <li>Гнучкий код</li>
    <li>Легка підтримка</li>
  </ul>

  <h2>Bridge</h2>

  <p>Розділяє абстракцію та реалізацію.</p>

  <ul>
    <li>Незалежні зміни</li>
    <li>Краща масштабованість</li>
  </ul>
</body>

</html>
```

Форматування залежить лише від рендера. Структура документа не змінюється.

Усі файли структури, як наведено вище, мають бути реалізовані;
README.md обовʼязковий: має містити пояснення структури, приклад запуску, приклад виводу і короткий опис, де саме застосовано патерн Composite, а де патерн Bridge;
