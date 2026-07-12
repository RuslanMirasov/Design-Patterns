# Домашнє завдання до Теми 10

У цьому домашньому завданні вам необхідно реалізувати простий, але функціональний TODO-застосунок з використанням патерну Команда.

Мета — закріпити розуміння патерну через розробку простого керованого TODO-застосунку із підтримкою додавання, видалення, оновлення задач і керування історією undo/redo.

Потрібно реалізувати консольний TODO-застосунок, де кожна дія над задачами оформлена у вигляді об'єкта-команди, де:

- Кожна дія над задачами (додавання, редагування, видалення, позначення виконання) — це окрема команда.
- Всі команди виконуються через єдиний диспетчер CommandHistory.
- Можна скасувати undo або повторити redo останні дії.

## Завдання

Структура проєкту

```JavaScript
/
└── src/
    ├── commands/
    │   ├── Command.ts              # Інтерфейс базової команди
    │   ├── AbstractCommand.ts      # Абстрактна реалізація команди із базовим redo
    │   ├── AddTaskCommand.ts       # Додавання нової задачі до списку (реалізовано)
    │   ├── RemoveTaskCommand.ts    # Видалення задачі зі списку (не реалізовано)
    │   ├── UpdateTaskCommand.ts    # Оновлення полів існуючої задачі (не реалізовано)
    │   ├── CompleteTaskCommand.ts  # Позначення статусу задачі (не реалізовано)
    │   └── CommandHistory.ts       # Історія виконаних команд для підтримки undo/redo
    ├── models/
    │   ├── Task.ts                 # Модель задачі
    │   └── TaskList.ts             # Колекція задач з необхідними методами
    ├── services/
    │   └── TaskManager.ts          # Менеджер задач
    └── main.ts                     # Точка входу - демонстрація роботи
```

Проєкт має наступні модулі:

| Модуль                | Призначення                                             |
| --------------------- | ------------------------------------------------------- |
| `Task`                | Модель окремої задачі                                   |
| `TaskList`            | Колекція всіх задач                                     |
| `Command`             | Інтерфейс команди (`execute`, `undo`, `redo`)           |
| `AbstractCommand`     | Базова абстрактна команда                               |
| `AddTaskCommand`      | Команда для додавання задачі                            |
| `RemoveTaskCommand`   | Команда для видалення задачі (потрібно реалізувати)     |
| `UpdateTaskCommand`   | Команда для оновлення задачі (потрібно реалізувати)     |
| `CompleteTaskCommand` | Команда для зміни статусу задачі (потрібно реалізувати) |
| `CommandHistory`      | Історія команд для підтримки `undo`, `redo`             |
| `TaskManager`         | Менеджер задач, що обгортає `TaskList` та історію       |
| `main.ts`             | Приклад використання                                    |

Вам вже надано початкові реалізації:

Модель задачі models/Task.ts

```JavaScript
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}
```

Task.ts — це базова модель задачі у TODO-застосунку. Вона описує, які саме дані має зберігати кожна задача.

Модель містить наступні поля:

- id: string — унікальний ідентифікатор задачі.
- title: string — назва задачі (обов'язкове поле).
- description?: string — опис задачі (необов'язковий).
- completed: boolean — статус виконання задачі (виконана чи ні).
- createdAt: Date — дата створення задачі.
- dueDate?: Date — бажана дата завершення задачі.
- priority: 'low' | 'medium' | 'high' — пріоритет задачі.
- tags?: string[] — довільний список тегів для категоризації задачі.

Всі операції в застосунку працюють саме з об'єктами типу Task. Додавання, видалення, оновлення задач — це все робота з цією моделлю.

Колекція задач models/TaskList.ts

```JavaScript
import { Task } from './Task';

export class TaskList {
  private tasks: Map<string, Task> = new Map();

  addTask(task: Task): void {
    this.tasks.set(task.id, task);
  }

  removeTask(id: string): Task | undefined {
    const task = this.tasks.get(id);
    if (task) {
      this.tasks.delete(id);
    }
    return task;
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id);
    if (task) {
      const updated = { ...task, ...updates };
      this.tasks.set(id, updated);
      return updated;
    }
    return undefined;
  }

  completeTask(id: string, completed: boolean = true): Task | undefined {
    const task = this.tasks.get(id);
    if (task) {
      task.completed = completed;
    }
    return task;
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }
}
```

TaskList — це клас, який управляє колекцією задач. Він зберігає задачі у пам'яті та надає методи для роботи з ними.

Містить наступні методи та поля:

- приватне поле tasks: Map<string, Task> — всі задачі зберігаються у вигляді Map за id.
- addTask(task: Task): void — додає нову задачу до списку.
- removeTask(id: string): Task | undefined — видаляє задачу за id, повертає її якщо існувала.
- updateTask(id: string, updates: Partial<Task>): Task | undefined — оновлює поля задачі за id.
- completeTask(id: string, completed?: boolean): Task | undefined — змінює статус виконання задачі.
- getAllTasks(): Task[] — повертає список усіх задач у вигляді масиву.

Команди працюють із TaskList: додають, видаляють, змінюють задачі саме через його методи.

Інтерфейс команди commands/Command.ts

```JavaScript
export interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}
```

Command — це базовий інтерфейс, який визначає контракт для всіх команд у застосунку.

Він містить:

- execute(): void — метод для виконання дії.
- undo(): void — метод для скасування дії.
- redo(): void — метод для повторного виконання дії (типово викликає execute).

Кожна дія у застосунку, як додавання задачі, видалення, оновлення має реалізовувати цей інтерфейс. Завдяки цьому їх можна централізовано обробляти через CommandHistory.

Базова абстрактна команда commands/AbstractCommand.ts

```JavaScript
import { Command } from './Command';

export abstract class AbstractCommand implements Command {
  abstract execute(): void;
  abstract undo(): void;

  redo(): void {
    this.execute();
  }
}
```

Клас AbstractCommand — це базова абстрактна реалізація інтерфейсу Command, яка спрощує написання конкретних команд.

Клас містить:

- абстрактні методи execute() і undo(), які треба реалізувати в кожній команді.
- реалізований метод redo(), який за замовченням просто викликає execute().

Клас потрібен, щоб не дублювати однаковий код у кожній конкретній команді. Наприклад, AddTaskCommand, RemoveTaskCommand і інші будуть наслідуватися від AbstractCommand.

Реалізація класу AddTaskCommand в файлі commands/AddTaskCommand.ts

```JavaScript
import { AbstractCommand } from './AbstractCommand';
import { TaskList } from '../models/TaskList';
import { Task } from '../models/Task';

export class AddTaskCommand extends AbstractCommand {
  constructor(private taskList: TaskList, private task: Task) {
    super();
  }

  execute(): void {
    this.taskList.addTask(this.task);
  }

  undo(): void {
    this.taskList.removeTask(this.task.id);
  }
}
```

Реалізований, як приклад AddTaskCommand — команда для додавання нової задачі

до списку.

Вона вже містить:

- посилання на об'єкт TaskList і об'єкт задачі Task.
- метод execute() — додає задачу до списку.
- метод undo() — видаляє цю ж задачу за id зі списку.

Команда забезпечує додавання задачі у спосіб, який можна скасувати undo або повторити redo.

Реалізація історії команд commands/CommandHistory.ts

```JavaScript
import { Command } from './Command';

export class CommandHistory {
  private commands: Command[] = [];
  private currentIndex: number = -1;

  executeCommand(command: Command): void {
    command.execute();

    if (this.currentIndex < this.commands.length - 1) {
      this.commands.splice(this.currentIndex + 1);
    }

    this.commands.push(command);
    this.currentIndex = this.commands.length - 1;
  }

  undo(): void {
    if (this.currentIndex >= 0) {
      this.commands[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  redo(): void {
    if (this.currentIndex < this.commands.length - 1) {
      this.currentIndex++;
      this.commands[this.currentIndex].redo();
    }
  }
}
```

Клас CommandHistory — диспетчер виконання команд. Він зберігає список усіх виконаних команд для підтримки можливості undo/redo.

Він містить:

- список команд commands.
- поточний індекс currentIndex, що вказує на останню виконану команду.
- метод executeCommand(command: Command) — виконує команду і додає її в історію.
- метод undo() — скасовує останню виконану команду.
- метод redo() — повторно виконує наступну команду, якщо така є.

Без класу CommandHistory ми не змогли б реалізувати скасування та повторення дій.

Менеджер задач services/TaskManager.ts

```JavaScript
import { TaskList } from '../models/TaskList';
import { CommandHistory } from '../commands/CommandHistory';
import { Task } from '../models/Task';
import { AddTaskCommand } from '../commands/AddTaskCommand';

export class TaskManager {
  private taskList = new TaskList();
  private history = new CommandHistory();

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'completed'>): string {
    const newTask: Task = {
      id: this.generateId(),
      createdAt: new Date(),
      completed: false,
      ...task
    };
    this.history.executeCommand(new AddTaskCommand(this.taskList, newTask));
    return newTask.id;
  }

  undo(): void {
    this.history.undo();
  }

  redo(): void {
    this.history.redo();
  }

  getTasks(): Task[] {
    return this.taskList.getAllTasks();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
```

Клас TaskManager — основний сервіс застосунку, який об'єднує управління задачами TaskList та історію команд CommandHistory.

Він містить наступні методи:

- addTask() — додає нову задачу через AddTaskCommand.
- undo() — скасовує останню дію.
- redo() — повторює останню скасовану дію.
- getTasks() — повертає всі поточні задачі.

Клас потрібен, бо це точка взаємодії для зовнішнього коду — через нього додаток керує задачами і командною історією.

Точка входу main.ts у застосунок, де демонструється, як використовувати TaskManager

```JavaScript
import { TaskManager } from './services/TaskManager';

const manager = new TaskManager();

// Додаємо нову задачу
const taskId = manager.addTask({
  title: 'Завершити домашнє завдання',
  priority: 'high'
});

console.log('--- Після додавання задачі ---');
console.log(manager.getTasks());

// Оновлюємо задачу
manager.updateTask(taskId, {
  title: 'Завершити складне домашнє завдання',
  priority: 'medium'
});

console.log('--- Після оновлення задачі ---');
console.log(manager.getTasks());

// Позначаємо задачу як виконану
manager.completeTask(taskId, true);

console.log('--- Після позначення як виконаної ---');
console.log(manager.getTasks());

// Видаляємо задачу
manager.removeTask(taskId);

console.log('--- Після видалення задачі ---');
console.log(manager.getTasks());

// Скасовуємо видалення
manager.undo();

console.log('--- Після undo видалення ---');
console.log(manager.getTasks());

// Скасовуємо зміну статусу (completed)
manager.undo();

console.log('--- Після undo виконання задачі ---');
console.log(manager.getTasks());

// Скасовуємо оновлення задачі
manager.undo();

console.log('--- Після undo оновлення задачі ---');
console.log(manager.getTasks());

// Скасовуємо додавання задачі
manager.undo();

console.log('--- Після undo додавання задачі ---');
console.log(manager.getTasks());

// Відновлюємо додавання задачі
manager.redo();

console.log('--- Після redo додавання задачі ---');
console.log(manager.getTasks());

// Відновлюємо оновлення задачі
manager.redo();

console.log('--- Після redo оновлення задачі ---');
console.log(manager.getTasks());

// Відновлюємо зміну статусу
manager.redo();

console.log('--- Після redo виконання задачі ---');
console.log(manager.getTasks());

// Відновлюємо видалення задачі
manager.redo();

console.log('--- Після redo видалення задачі ---');
console.log(manager.getTasks());
```

Вам потрібно реалізувати наступні елементи:

1. команду RemoveTaskCommand.
2. команду UpdateTaskCommand.
3. команду CompleteTaskCommand.
4. Інтегрувати їх у TaskManager для відповідних операцій.

Реалізація RemoveTaskCommand має робити наступне:

-При виконанні execute — видаляти задачу з TaskList.
-При скасуванні undo — відновлювати видалену задачу назад.
-Зберігати копію задачі під час видалення, щоб потім її відновити.

Реалізація UpdateTaskCommand має робити наступне:

- При виконанні execute — оновлювати властивості задачі.
- При скасуванні undo — повертати старі значення.
- Перед оновленням зберігати старий стан задачі, це старі значення полів.

Реалізація CompleteTaskCommand має робити наступне:

- При виконанні execute — змінювати статус задачі completed: true або false.
- При скасуванні undo — повертати попередній статус.
- Перед зміною зберігати попередній статус задачі completed.

Після реалізації команд їх потрібно інтегрувати в TaskManager, для чого потрібно додати методи:

- removeTask(id: string): void
- updateTask(id: string, updates: Partial<Task>): void
- completeTask(id: string, completed?: boolean): void

В кожному з них створювати відповідну команду і виконувати її через CommandHistory.

## Очікуваний результат

Після запуску демонстраційного файлу main.ts командою:

```JavaScript
npx ts-node ./src/main.ts
```

система повинна послідовно виконати такі дії:

- Додати нову задачу до списку задач.
- Оновити поля доданої задачі (наприклад, змінити заголовок і пріоритет).
- Позначити задачу як виконану completed: true.
- Видалити задачу зі списку задач.

Далі через послідовність викликів undo() має відбутися:

- Скасування видалення задачі.
- Скасування позначення задачі як виконаної.
- Скасування оновлення полів задачі.
- Скасування додавання задачі.

Після цього через послідовність викликів redo() система повинна:

- Відновити додавання задачі.
- Відновити зміну полів задачі.
- Відновити позначення задачі як виконаної.
- Відновити видалення задачі.

На кожному етапі у консолі має виводитись актуальний стан списку задач: після кожного виконання команди, а також після кожного скасування undo або повторного виконання redo.

Реалізуйте вказану вище структуру файлів.
Додайте файл README.md, де коротко поясніть: як реалізований патерн Команда у проєкті; як запускати проєкт; як працює механізм undo/redo.
