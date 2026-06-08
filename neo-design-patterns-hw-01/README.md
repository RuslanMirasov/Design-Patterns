# ДЗ до теми "Основи об’єктно-орієнтованого програмування"

Запуск

```JavaScript
npx ts-node src/main.ts
```

У цьому завданні ви моделюєте невелику систему, схожу на ті, з якими стикаються розробники в реальних проєктах. Завдяки цьому попрактикуєтесь у застосуванні ключових принципів ООП — інкапсуляції, композиції, наслідування і поліморфізму — у зв’язному, життєвому контексті.

Вам потрібно реалізувати модель бібліотеки з підтримкою об'єктів: книги, автори, фізичні примірники, читачі, бібліотека як агрегатор. Основна мета — реалізувати предметну область з використанням ключових понять ООП у TypeScript.

## Вимоги до реалізації

### Структура проєкту — файли та директорії:

```
/src
  /models
    Author.ts
    Book.ts
    Copy.ts
    Reader.ts
    Library.ts
    AbstractBook.ts
    EBook.ts
  /services
    BorrowService.ts
  main.ts
tsconfig.json
```

### Архітектурні обмеження:

- Усі класи мають бути оформлені в окремих файлах.
- Заборонено використовувати будь-які зовнішні бібліотеки.
- Кожен клас повинен мати механізми інкапсуляції — приватні поля, геттери/сеттери, або інше.
- Повинна бути реалізована агрегація — клас **Library** містить інші сутності.
- Повинна бути реалізована абстракція через **AbstractBook**.
- Повинне бути наслідування, як **EBook extends AbstractBook**.
- Повинна бути реалізована поведінкова різниця через поліморфізм — метод **getDescription()**.

## Очікувана функціональність

### Основні класи:

- **Author** зберігає ім’я та список написаних книг.
- **Book** реалізує AbstractBook, містить назву, рік, автора.
- **EBook** реалізує AbstractBook, додає поле url.
- **Copy** містить посилання на книгу та прапорець isAvailable.
- **Reader** має унікальний id, ім’я та список позичених копій.
- **Library** надає методи для:
- додавання книг, авторів, копій, читачів
- отримання вільних копій
- пошуку книг за автором
- **BorrowService** окремий сервіс для позичання книги читачу borrow(reader: Reader, copy: Copy).

### Демонстраційний сценарій:

У **main.ts** має бути реалізовано:

- створення автора і книги;
- створення електронної книги;
- створення кількох копій однієї книги;
- додавання читача;
- спроба видати копію читачу;
- повторна спроба видати вже зайняту копію — має бути відхилена;
- виклик **getDescription()** для **Book і EBook** — має показати різні повідомлення;
- спроба створити об’єкт **AbstractBook** має бути заборонена на рівні коду.

Приклад файл main.ts:

```ts
import { Author } from "./models/Author";
import { Book } from "./models/Book";
import { EBook } from "./models/EBook";
import { Copy } from "./models/Copy";
import { Reader } from "./models/Reader";
import { Library } from "./models/Library";
import { BorrowService } from "./services/BorrowService";
import { AbstractBook } from "./models/AbstractBook";

// Створення автора та книг
const author = new Author("John Doe");
const book = new Book("The Great Book", 2020, author);
const ebook = new EBook(
  "Digital Book",
  2021,
  author,
  "<https://example.com/ebook>",
);

// Створення копій
const copy1 = new Copy(book);
const copy2 = new Copy(book);

// Створення читача
const reader = new Reader("1", "Alice");

// Створення бібліотеки та додавання об'єктів
const library = new Library();
library.addAuthor(author);
library.addBook(book);
library.addBook(ebook);
library.addCopy(copy1);
library.addCopy(copy2);
library.addReader(reader);

// Створення сервісу позичання
const borrowService = new BorrowService();

// Демонстрація позичання
console.log("Attempting to borrow copy1...");
const borrowResult1 = borrowService.borrow(reader, copy1);
console.log(`Borrow result: ${borrowResult1}`);

console.log("Attempting to borrow copy1 again...");
const borrowResult2 = borrowService.borrow(reader, copy1);
console.log(`Borrow result: ${borrowResult2}`);

// Демонстрація повернення
console.log("Attempting to return copy1...");
borrowService.returnBook(reader, copy1);
console.log(`Copy1 is available: ${copy1.isCopyAvailable()}`);

// Демонстрація поліморфізму
console.log("\\nBook descriptions:");
console.log(book.getDescription());
console.log(ebook.getDescription());

// Спроба створити AbstractBook
// const abstractBook = new AbstractBook('Test', 2022); // Повинно викликати помилку компіляції
```
