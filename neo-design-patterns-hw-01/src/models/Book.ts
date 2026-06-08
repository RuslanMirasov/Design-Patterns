import { AbstractBook } from "./AbstractBook";
import { Author } from "./Author";

export class Book extends AbstractBook {
  constructor(title: string, year: number, author: Author) {
    super(title, year, author);
  }

  getDescription(): string {
    return `Book: "${this.title}" by ${this.author.name}, published in ${this.year}`;
  }
}
