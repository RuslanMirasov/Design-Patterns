import { AbstractBook } from "./AbstractBook";
import { Author } from "./Author";

export class EBook extends AbstractBook {
  private _url: string;

  constructor(title: string, year: number, author: Author, url: string) {
    super(title, year, author);
    this._url = url;
  }

  get url(): string {
    return this._url;
  }

  getDescription(): string {
    return `EBook: "${this.title}" by ${this.author.name}, published in ${this.year}. Available at: ${this._url}`;
  }
}
