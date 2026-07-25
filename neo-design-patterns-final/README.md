# Домашка - Фінальний проєкт

# «Генератор резюме з JSON‑опису»

## Опис завдання

У цьому фінальному домашньому завданні необхідно реалізувати генератор резюме, який демонструє застосування п'яти патернів проектування: Facade, Template Method, Factory Method, Composite, Decorator.

Завдання має на меті навчити вас:

- Правильно застосовувати патерни проектування в практичних сценаріях
- Створювати модульну, розширювану архітектуру
- Структурувати код з використанням патернів

Необхідно сформувати самодостатню HTML‑сторінку‑резюме, яка будується з єдиного джерела даних - файл `resume.json`. Усі стилі фіксовані у `styles.css`, сторонніх бібліотек або фреймворків не використовуємо. Після компіляції `main.ts` і відкриття `index.html` сторінка повинна безпомилково відобразити повне резюме, а проєкти з прапорцем `"isRecent": true` — підсвітити червоним.

## Структура проекту

```
/
├── index.html                  # Статичний макет сторінки
├── resume.json                 # Джерело даних для сторінки
├── vite.config.js              # Конфігурація Vite
├── tsconfig.json               # Конфігурація TypeScript
├── dist/                       # Директорія для збірки
└── src/
    ├── styles.css              # Базові стилі + .highlight
    ├── facade/
    │   └── ResumePage.ts       # Фасад проєкту
    ├── importer/
    │   ├── AbstractImporter.ts # Базовий Template Method
    │   └── ResumeImporter.ts   # Конкретна реалізація
    ├── blocks/                 # Конкретні блоки резюме
    │   ├── BlockFactory.ts     # Factory Method
    │   ├── HeaderBlock.ts
    │   ├── SummaryBlock.ts
    │   ├── ExperienceBlock.ts  # Composite‑контейнер
    │   ├── ProjectBlock.ts
    │   ├── EducationBlock.ts
    │   └── SkillsBlock.ts
    ├── decorators/
    │   └── HighlightDecorator.ts
    ├── models/
    │   └── ResumeModel.ts      # Типи внутрішньої моделі
    └── main.ts                 # Точка входу
```

## Запуск проекту

1. Встановлення залежностей:

   ```bash
   npm install
   ```

2. Режим розробки:

   ```bash
   npm run dev
   ```

3. Збірка для продакшену:

   ```bash
   npm run build
   ```

4. Попередній перегляд збірки:
   ```bash
   npm run preview
   ```

## Технології

- TypeScript
- Vite (збірка та розробка)
- Патерни проектування
- JSON для зберігання даних
- CSS для стилізації

## Реалізація патернів

### Facade — `src/facade/ResumePage.ts`

Клас ResumePage — єдина точка входу в застосунок. Метод init(jsonPath) завантажує resume.json і одразу передає дані далі в ResumeImporter. Іншому коду (main.ts) не потрібно знати, як саме відбувається завантаження чи побудова сторінки — досить викликати один метод.

### Template Method — `src/importer/AbstractImporter.ts`, `src/importer/ResumeImporter.ts`

AbstractImporter задає порядок дій: спочатку validate, потім map, потім render. ResumeImporter — конкретна реалізація цих кроків: validate() перевіряє, що в JSON є всі потрібні блоки (header, summary, experience, education, skills), map() перетворює JSON у типізовану модель ResumeModel, а render() створює блоки резюме через BlockFactory і додає їх на сторінку.

### Factory Method — `src/blocks/BlockFactory.ts`

BlockFactory створює потрібний блок резюме залежно від типу. Метод createBlock(type, model) повертає HeaderBlock, SummaryBlock, ExperienceBlock, EducationBlock або SkillsBlock, усі вони мають однаковий інтерфейс IBlock з методом render(), тому решта коду працює з ними однаково, не знаючи конкретного класу.

### Composite — `src/blocks/ExperienceBlock.ts`, `src/blocks/ProjectBlock.ts`

ExperienceBlock це контейнер: для кожного місця роботи він рендерить блок з посадою й компанією, а всередину додає дочірні ProjectBlock — по одному на кожен проєкт. ProjectBlock - листовий елемент, усередині якого вже немає дочірніх блоків.

### Decorator — `src/decorators/HighlightDecorator.ts`

HighlightDecorator обгортає готовий блок проєкту й додає йому клас highlight, не змінюючи сам ProjectBlock. У ExperienceBlock таким декоратором обгортаються тільки ті проєкти, в яких isRecent: true, саме вони підсвічуються червоним.

## Як додати новий блок резюме (приклад: «Certificates»)

1. Додати тип даних у `src/models/ResumeModel.ts` (наприклад, `Certificate` і поле `certificates: Certificate[]` у `ResumeModel`).
2. Створити клас `src/blocks/CertificatesBlock.ts`, що реалізує `IBlock` і рендерить власну секцію.
3. Додати новий варіант у `BlockType` (`src/blocks/BlockFactory.ts`) і одну гілку `case "certificates": return new CertificatesBlock(m.certificates);` у `createBlock()`.
4. Додати `"certificates"` у список типів у `ResumeImporter.render()`, щоб блок потрапив у DOM.

Жоден інший клас змінювати не потрібн, це і є розширюваність, яку забезпечують патерни Factory Method та Template Method.
