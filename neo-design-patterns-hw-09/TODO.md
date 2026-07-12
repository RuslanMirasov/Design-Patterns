# Домашнє завдання до Теми 9

У цьому домашньому завданні вам необхідно реалізувати експорт користувацької статистики, використовуючи патерн Шаблонний метод. Ви повинні виокремити загальний алгоритм експорту у базовому класі, залишивши деталі форматування у конкретних підкласах.

Дані користувачів мають бути завантажені з API https://jsonplaceholder.typicode.com/users. Система повинна підтримувати експорт у три формати: CSV, JSON та XML.

Завдання має на меті навчити вас:

- виокремлювати сталі етапи алгоритму;
- інкапсулювати алгоритм у базовому класі;
- реалізовувати варіативну поведінку через абстрактні та hook-методи.

## Завдання

Реалізуйте застосунок за наведеною структурою:

```JavaScript
/
└── src/
    ├── exporters/
    │   ├── DataExporter.ts     # Базовий клас з шаблонним методом
    │   ├── CsvExporter.ts      # Експорт у CSV
    │   ├── JsonExporter.ts     # Експорт у JSON
    │   └── XmlExporter.ts      # Експорт у XML
    ├── data/
    │   └── UserData.ts         # Тип даних користувачів
    └── main.ts                 # Точка входу для демонстрації роботи
```

Базовий клас DataExporter повинен мати методи у фіксованій послідовності виклику:

- load() — обов’язковий. Завантаження даних із API https://jsonplaceholder.typicode.com/users.
- transform() — обов’язковий. Відбір тільки потрібних полів: id, name, email, phone. Сортування за іменем.
- beforeRender() — hook. Порожня реалізація за замовчуванням.
- render() — абстрактний метод. Форматування у цільовий формат.
- afterRender() — hook. Порожня реалізація за замовчуванням.
- save() — абстрактний метод. Збереження результату у відповідний файл.

Метод export() — шаблонний метод, викликає кроки за вказаним вище порядком.

Кожен підклас CsvExporter, JsonExporter, XmlExporter повинен наслідуватися від базового класу та реалізовувати свої версії методів render() та save(). Методи beforeRender() та afterRender() у базовому класі мають порожню реалізацію за замовчуванням.

Клас XmlExporter додатково перевизначає afterRender(), додаючи коментар про час генерації у кінець XML-файлу.

```JavaScript
protected afterRender(): void {
  this.result += `\\n<!-- Експорт згенеровано: ${new Date().toISOString()} -->`;
}
```

Тип даних користувача UserData:

```JavaScript
export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
}
```

## Очікуваний результат

Після запуску демонстраційного файлу main.ts командою:

```JavaScript
npx ts-node ./src/main.ts
```

повинні створитися три файли з відповідними форматами:

users.csv

```JavaScript
id,name,email,phone
5,Chelsey Dietrich,Lucio_Hettinger@annie.ca,(254)954-1289
10,Clementina DuBuque,Rey.Padberg@karina.biz,024-648-3804
...
```

users.json

```JavaScript
[
  {
    "id": 5,
    "name": "Chelsey Dietrich",
    "email": "Lucio_Hettinger@annie.ca",
    "phone": "(254)954-1289"
  },
  {
    "id": 10,
    "name": "Clementina DuBuque",
    "email": "Rey.Padberg@karina.biz",
    "phone": "024-648-3804"
  },
  {
    "id": 3,
    "name": "Clementine Bauch",
    "email": "Nathan@yesenia.net",
    "phone": "1-463-123-4447"
  },
  ...
]
```

users.xml

```JavaScript
<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user>
    <id>5</id>
    <name>Chelsey Dietrich</name>
    <email>Lucio_Hettinger@annie.ca</email>
    <phone>(254)954-1289</phone>
  </user>
  <user>
    <id>10</id>
    <name>Clementina DuBuque</name>
    <email>Rey.Padberg@karina.biz</email>
    <phone>024-648-3804</phone>
  </user>
  <user>
    <id>3</id>
    <name>Clementine Bauch</name>
    <email>Nathan@yesenia.net</email>
    <phone>1-463-123-4447</phone>
  </user>
  ...
</users>
<!-- Експорт згенеровано: 2024-04-28T18:00:30.123Z -->
```

Приклад реалізації файлу main.ts:

```JavaScript
import { CsvExporter } from './exporters/CsvExporter';
import { JsonExporter } from './exporters/JsonExporter';
import { XmlExporter } from './exporters/XmlExporter';

const exporters = [
    new CsvExporter(),
    new JsonExporter(),
    new XmlExporter()
];

(async () => {
    await Promise.all(exporters.map(exporter => exporter.export()));
})();
```

Функціональність, яку потрібно реалізувати:

- Структура проєкту відповідно як в завданні
- Алгоритм експорту чітко інкапсульований у шаблонний метод базового класу без умовних гілок.
- Для кожного формату реалізовано окремий підклас, абстрактні методи коректно перекрито.
- Оголошені hook-методи, які не обов’язково перевизначати. Для класу XmlExporter перевизначено метод afterRender().
- Є інструкція у README.md щодо запуску та використання застосунку.

Реалізуйте вказану вище структуру файлів.
Додайте файл README.md, де коротко поясніть, як реалізований патерн Шаблонний метод, як додати новий формат експорту, та приклад запуску застосунку.

# Реалізація ітераторів для експортованих файлів

Після реалізації експорту користувачів у формати CSV, JSON та XML, необхідно створити окремі ітератори для обходу даних, збережених у цих файлах.

Ітератори повинні надавати послідовний обхід елементів, інкапсулюючи логіку читання та парсингу файлів.

Мета цієї частини завдання:

- навчитися створювати власні ітератори для різних джерел даних;
- практикувати інкапсуляцію обходу структури даних;
- продемонструвати розуміння протоколу ітераторів.

## Завдання

Реалізуйте три класи ітераторів:

- CsvIterator — обхід користувачів у CSV-файлі.
- JsonIterator — обхід користувачів у JSON-файлі.
- XmlIterator — обхід користувачів у XML-файлі.

Кожен ітератор повинен:

- самостійно відкривати та читати відповідний файл під час створення об'єкта;
- парсити дані у масив об'єктів типу UserData;
- Кожен ітератор має реалізовувати [Symbol.iterator]() і повертати об'єкти типу UserData через генератор або ручну реалізацію ітератора. Формат ітерації повинен бути сумісним із конструкцією for...of.

Структура проєкту доповнюється:

```JavaScript
/
└── src/
    ├── exporters/
    │   ├── DataExporter.ts     # Базовий клас з шаблонним методом
    │   ├── CsvExporter.ts      # Експорт у CSV
    │   ├── JsonExporter.ts     # Експорт у JSON
    │   └── XmlExporter.ts      # Експорт у XML
    ├── iterators/
    │   ├── CsvIterator.ts
    │   ├── JsonIterator.ts
    │   └── XmlIterator.ts
    ├── data/
    │   └── UserData.ts         # Тип даних користувачів
    ├── main-iterate.ts
    └── main.ts
```

Файл main-iterate.ts — обходить готові файли і виводить дані через ітератори.

Важливо, щоб Ітератори не змінювали отримані дані та не було ніяких умовних переходів за форматом у коді ітераторів — для кожного формату свій клас.

Приклад виклику ітератора:

```JavaScript
import { CsvIterator } from './iterators/CsvIterator';

console.log('--- CSV ---');
for (const user of new CsvIterator('./dist/users.csv')) {
    console.log(user);
}
```

Аналогічно для JsonIterator та XmlIterator.

## Очікуваний результат

Після запуску ітератора для кожного файлу у консолі мають виводитись об'єкти типу UserData, наприклад:

```JavaScript
--- CSV ---
{
  id: 5,
  name: 'Chelsey Dietrich',
  email: 'Lucio_Hettinger@annie.ca',
  phone: '(254)954-1289'
}
{
  id: 10,
  name: 'Clementina DuBuque',
  email: 'Rey.Padberg@karina.biz',
  phone: '024-648-3804'
}
...
```

Для всіх трьох форматів CSV, JSON, XML обхід повинен працювати однаково — по одному користувачу за ітерацію.

- У тому ж репозиторії створіть директорію src/iterators/.
- Додайте файли CsvIterator.ts, JsonIterator.ts, XmlIterator.ts.
- Додайте main-iterate.ts, для демонстрації використання ітераторів для обходу всіх трьох файлів.
- README.md має бути доповнений коротким поясненням роботи ітераторів.
