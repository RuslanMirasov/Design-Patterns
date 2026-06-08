import { Copy } from "./Copy";

export class Reader {
  private _id: string;
  private _name: string;
  private _borrowedCopies: Copy[] = [];

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get borrowedCopies(): Copy[] {
    return [...this._borrowedCopies];
  }

  addBorrowedCopy(copy: Copy): void {
    this._borrowedCopies.push(copy);
  }

  removeBorrowedCopy(copy: Copy): void {
    this._borrowedCopies = this._borrowedCopies.filter((c) => c !== copy);
  }
}
