function formatTimestamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Декоратор для додавання timestamp
export function withTimestamp<This, Args extends [string, ...any[]], Return>(
  originalMethod: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
): (this: This, ...args: Args) => Return {
  return function (this: This, ...args: Args): Return {
    const [message, ...rest] = args;
    const newArgs = [
      `[${formatTimestamp(new Date())}] ${message}`,
      ...rest,
    ] as Args;
    return originalMethod.apply(this, newArgs);
  };
}

// Декоратор для перетворення в верхній регістр
export function uppercase<This, Args extends [string, ...any[]], Return>(
  originalMethod: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
): (this: This, ...args: Args) => Return {
  return function (this: This, ...args: Args): Return {
    const [message, ...rest] = args;
    const newArgs = [message.toUpperCase(), ...rest] as Args;
    return originalMethod.apply(this, newArgs);
  };
}
