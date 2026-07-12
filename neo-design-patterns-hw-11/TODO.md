# Домашнє завдання до Теми 11

Мета домашнього завдання — закріпити знання поведінкових патернів, Ланцюжок відповідальностей та Посередник, у сценарії обробки даних наближеному до реальності.

Ви реалізуєте систему, яка приймає масив записів у форматі JSON, проводить їхню валідацію, обробку та зберігає результати у відповідні файли залежно від формату.

Ваша задача — реалізувати обробник вхідних записів у форматі .json, кожен з яких має поле type та специфічну структуру. Дані необхідно передати через ланцюг обробників, який виконує валідацію та підготовку до збереження. Залежно від типу, результат зберігається у відповідний файл через централізованого посередника. У разі помилки — запис фіксується у файл відхилених rejected.jsonl.

Тож весь процес організовано у два рівні:

- Ланцюжки відповідальності відповідають за обробку даних різних типів: access_log, transaction, system_error;
- Посередник централізує процес збереження та маршрутизації результатів: успішні та помилкові записи.

Це завдання моделює практичну утиліту, яка аналізує структуровані дані, фільтрує помилки та зберігає звіти у форматі .json, .csv та .jsonl.

## Завдання

Структура проєкту

```JavaScript
/
├── data/
│   └── records.json                  # Вхідний файл з необробленими записами
├── chain/
│   ├── AbstractHandler.ts           # Базовий клас для ланцюга відповідальностей
│   ├── handlers/
│   │   ├── TimestampParser.ts       # Парсинг timestamp у формат ISO
│   │   ├── UserIdValidator.ts       # Перевірка коректності userId
│   │   ├── IpValidator.ts           # Перевірка валідності IP-адреси (IPv4)
│   │   ├── AmountParser.ts          # Парсинг числових значень amount
│   │   ├── CurrencyNormalizer.ts    # Нормалізація валютного поля (ISO-формат)
│   │   ├── LevelValidator.ts        # Валідація рівня помилки (error, warning, info)
│   │   └── MessageTrimmer.ts        # Обрізання пробілів у повідомленні
│   └── chains/
│       ├── AccessLogChain.ts        # Ланцюг обробки access_log
│       ├── TransactionChain.ts      # Ланцюг обробки transaction
│       └── SystemErrorChain.ts      # Ланцюг обробки system_error
├── mediator/
│   ├── ProcessingMediator.ts        # Центральний посередник для збереження результатів
│   └── writers/
│       ├── AccessLogWriter.ts       # Збереження access_log у CSV
│       ├── TransactionWriter.ts     # Збереження transaction у JSON
│       ├── ErrorLogWriter.ts        # Збереження system_error у JSONL
│       └── RejectedWriter.ts        # Відхилені записи з помилками у JSONL
├── output/                          # Директорія для вихідних файлів
├── models/
│   └── DataRecord.ts                # Структура одного запису
└── main.ts                          # Точка входу для запуску
```

Вхідні дані — файл records.json містить масив записів. Кожен запис має поле type і решту полів, які залежать від типу.

```JavaScript
[
  {
    "type": "access_log",
    "timestamp": "2025-05-01T12:00:00Z",
    "userId": "user-123",
    "ip": "192.168.0.1"
  },
  {
    "type": "transaction",
    "amount": "1400.50",
    "currency": "usd",
    "timestamp": "2025-05-01T12:10:00Z"
  },
  {
    "type": "system_error",
    "timestamp": "2025-05-01T12:15:00Z",
    "level": "warning",
    "message": "Disk usage exceeded 90%"
  }
]
```

Цей JSON-файл містить масив об'єктів, кожен з яких має обов’язкове поле type, що вказує на формат: access_log, transaction, system_error.

Передбачено 3 типи записів:

- Перший тип access_log. Валідуються поля timestamp, userId та ip. Зберігається у файл output/access_logs.json у форматі масиву об’єктів.
- Другий тип transaction. Валідуюється поле timestamp. Поле amount переводиться у число. Поле приводиться currency до верхнього регістру. Зберігається у файл output/transactions.csv з колонками timestamp, amount, currency.
- Третій тип system_error. Валідуюється поле timestamp. Перевіряється, щоб поле level мало значення з множини (info, warning, critical). Поле message обрізається до 255 символів. Зберігається у файл output/errors.jsonl.

У разі помилки обробки будь-якого запису — він зберігається у output/rejected.jsonl.

Структура одного запису зберігається в файлі src\\models\\DataRecord.ts:

```JavaScript
export type RecordType = "access_log" | "transaction" | "system_error";

export interface BaseRecord {
  type: RecordType;
  timestamp: string;
}

export interface AccessLogRecord extends BaseRecord {
  type: "access_log";
  userId: string;
  ip: string;
}

export interface TransactionRecord extends BaseRecord {
  type: "transaction";
  amount: string | number;
  currency: string;
}

export interface SystemErrorRecord extends BaseRecord {
  type: "system_error";
  level: "info" | "warning" | "critical";
  message: string;
}

export type DataRecord =
  | AccessLogRecord
  | TransactionRecord
  | SystemErrorRecord;
```

Для кожного типу визначено окремий ланцюг обробки з власними правилами валідації та перетворення.

Для кожного типу запису будується окремий ланцюг обробників. Ланцюг реалізується через абстрактний клас AbstractHandler.

```JavaScript
// chain/AbstractHandler.ts
export abstract class AbstractHandler {
  private next: AbstractHandler | null = null;

  setNext(handler: AbstractHandler): AbstractHandler {
    this.next = handler;
    return handler;
  }

  handle(record: any): any {
    const processed = this.process(record);
    if (this.next) {
      return this.next.handle(processed);
    }
    return processed;
  }

  protected abstract process(record: any): any;
}
```

Обробник реалізує метод handle(data: Record): Record, який або повертає оброблений запис, або викидає помилку у разі валідаційної помилки. AbstractHandler має метод setNext(handler: AbstractHandler): AbstractHandler для побудови ланцюгів. Якщо валідація не пройдена — запис передається до ProcessingMediator.onRejected(...).

Основні обробники:

- TimestampParser — перевіряє та парсить timestamp.
- UserIdValidator — перевіряє непорожнє поле userId.
- IpValidator — перевіряє, що поле ip відповідає формату IPv4 (x.x.x.x).
- AmountParser — переводить поле amount у число.
- CurrencyNormalizer — переводить currency у верхній регістр.
- LevelValidator — перевіряє, що level входить у відповідну множину значень.
- MessageTrimmer — обрізає довгі повідомлення.

Шаблон для handler-а може виглядати так:

```JavaScript
// chain/handlers/SomeValidator.ts
import { AbstractHandler } from "../AbstractHandler";

export class SomeValidator extends AbstractHandler {
  protected process(record: any): any {
    // Валідація/обробка
    return record;
  }
}
```

Всі обробники мають такий вигляд і якщо дані не валідні — викидують throw new Error("...").

Наприклад src\\chain\\handlers\\AmountParser.ts:

```JavaScript
import { AbstractHandler } from "../AbstractHandler";
import { TransactionRecord } from "../../models/DataRecord";

export class AmountParser extends AbstractHandler {
  protected process(record: TransactionRecord): TransactionRecord {
    const amount =
      typeof record.amount === "string"
        ? parseFloat(record.amount)
        : record.amount;
    if (isNaN(amount)) throw new Error("Invalid amount");
    return { ...record, amount };
  }
}
```

Для кожного типу обробника будується окремий ланцюг. Пам'ятай, що порядок обробників важливий.

```JavaScript
// chain/chains/AccessLogChain.ts
import { TimestampParser } from "../handlers/TimestampParser";
import { UserIdValidator } from "../handlers/UserIdValidator";
import { IpValidator } from "../handlers/IpValidator";
import { AbstractHandler } from "../AbstractHandler";

export function buildAccessLogChain(): AbstractHandler {
  const ts = new TimestampParser();
  const user = new UserIdValidator();
  const ip = new IpValidator();
  ts.setNext(user).setNext(ip);
  return ts;
}
```

Клас ProcessingMediator централізує логіку збереження:

```JavaScript
class ProcessingMediator {
	//...
  onSuccess(record: DataRecord): void {
	  //...
  };
  onRejected(original: DataRecord, error: string): void {
	  //...
  };
  async finalize() {
	  //...
  };
}
```

В нашій реалізації файли записуються тільки в самому кінці, \*\*\*\*коли викликається await mediator.finalize() після обробки всіх записів.

Пропонується наступний шаблон для writer-а

```JavaScript
// mediator/writers/AccessLogWriter.ts
import * as fs from "fs/promises";

export class AccessLogWriter {
  private records: any[] = [];
  write(record: any) {
    this.records.push(record);
  }
  async finalize() {
    await fs.writeFile("output/access_logs.json", JSON.stringify(this.records, null, 2));
  }
}
```

Кожен writer відповідає за свій формат, finalize — записує у файл.

- Для access_log — зберігає всі оброблені записи у масив .json.
- Для transaction — дописує .csv з рядками.
- Для system_error — дописує .jsonl рядки.
- Всі відхилені записи, які не пройшли валідацію записуються у rejected.jsonl.

Точка входу main.ts у застосунок, де демонструється, як використовувати наш симбіоз патернів.

```JavaScript
import { buildAccessLogChain } from "./chain/chains/AccessLogChain";
import { ProcessingMediator } from "./mediator/ProcessingMediator";
// ... інші імпорти

const handlerMap = {
  access_log: buildAccessLogChain,
  // ...
};

async function main() {
  // зчитування даних
  // створення mediator
  // цикл по records:
  //   - вибір handler-а через handlerMap
  //   - try/catch: handle + mediator.onSuccess/onRejected
  // finalize
}
```

## Очікуваний результат

Після запуску застосунку через

```JavaScript
npx ts-node main.ts
```

відбудеться обробка всіх об'єктів у вхідному JSON-файлі. Кожен запис буде передано через відповідний ланцюг обробників:

Якщо об'єкт успішно пройшов валідацію і був оброблений — він буде переданий посереднику, який збереже його у фінальному звіті наприклад, у output/access_logs.json, output/transactions.csv.

Якщо обробник виявив помилку наприклад, відсутнє поле або неправильний тип даних — посередник збереже цей запис у output/rejected.jsonl разом з описом помилки.

У консолі буде відображено короткий зведений звіт:

```JavaScript
[INFO] Завантажено записів: 125
[INFO] Успішно оброблено: 93
[WARN] Відхилено з помилками: 32
[INFO] Звіт збережено у директорії output/
```

У директорії output/ будуть створені файли:

- access_logs.json — масив оброблених access_log-записів.
- transactions.csv — таблиця оброблених транзакцій.
- errors.jsonl — потік записів типу system_error.
- rejected.jsonl — кожен рядок — окремий JSON-об'єкт, який містить поле record і пояснення помилки. Цей файл не є валідним JSON-файлом, але зручний для потокового читання.

Формат виводу залежить від типу:

access_logs.json

```JavaScript
[
  {
    "timestamp": "2025-05-02T12:34:56Z",
    "userId": "user-123",
    "ip": "192.168.0.1"
  }
]
```

transactions.csv

```JavaScript
timestamp,amount,currency
2025-05-02T10:15:30Z,1400.50,USD
```

errors.jsonl

```JavaScript
{"timestamp":"2025-05-01T12:15:00Z","level":"warning","message":"Disk usage exceeded 90%"}
```

rejected.jsonl:

```JavaScript
{"record":{"type":"transaction"},"error":"Missing required field 'amount'"}
{"record":{"type":"access_log","ip":"0.0.0.0"},"error":"Invalid userId"}
```

Реалізуйте вказану вище структуру файлів.
Додайте файл README.md, де коротко поясніть: як реалізовані патерни у проєкті, як запускати проєкт. Обов'язково додати короткий розділ “Як додати новий тип запису”.
