import { readFileSync } from "fs";
import { UserData } from "../data/UserData";

export class JsonIterator implements Iterable<UserData> {
  private readonly users: UserData[];

  constructor(filePath: string) {
    const content = readFileSync(filePath, "utf-8");
    this.users = JSON.parse(content) as UserData[];
  }

  *[Symbol.iterator](): Generator<UserData> {
    for (const user of this.users) {
      yield user;
    }
  }
}
