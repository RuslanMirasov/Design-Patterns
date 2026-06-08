import { AbstractBook } from "./AbstractBook";

export class Author {
  private _name: string;
  private _books: AbstractBook[] = [];

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get books(): AbstractBook[] {
    return [...this._books];
  }

  addBook(book: AbstractBook): void {
    this._books.push(book);
  }
}
