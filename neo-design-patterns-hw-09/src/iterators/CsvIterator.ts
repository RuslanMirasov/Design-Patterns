import { readFileSync } from "fs";
import { UserData } from "../data/UserData";

export class CsvIterator implements Iterable<UserData> {
  private readonly users: UserData[];

  constructor(filePath: string) {
    const [, ...lines] = readFileSync(filePath, "utf-8").trim().split("\n");

    this.users = lines.map((line) => {
      const [id, name, email, phone] = line.split(",");
      return { id: Number(id), name, email, phone };
    });
  }

  *[Symbol.iterator](): Generator<UserData> {
    for (const user of this.users) {
      yield user;
    }
  }
}
