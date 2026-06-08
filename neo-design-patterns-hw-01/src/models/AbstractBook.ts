import { Author } from "./Author";

export abstract class AbstractBook {
  private _title: string;
  private _year: number;
  private _author: Author;

  constructor(title: string, year: number, author: Author) {
    this._title = title;
    this._year = year;
    this._author = author;
    author.addBook(this);
  }

  get title(): string {
    return this._title;
  }

  get year(): number {
    return this._year;
  }

  get author(): Author {
    return this._author;
  }

  abstract getDescription(): string;
}
