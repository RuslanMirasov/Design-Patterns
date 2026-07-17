import { readFileSync } from "fs";
import { UserData } from "../data/UserData";

const USER_PATTERN =
  /<user>\s*<id>(.*?)<\/id>\s*<name>(.*?)<\/name>\s*<email>(.*?)<\/email>\s*<phone>(.*?)<\/phone>\s*<\/user>/gs;

export class XmlIterator implements Iterable<UserData> {
  private readonly users: UserData[];

  constructor(filePath: string) {
    const content = readFileSync(filePath, "utf-8");

    this.users = [...content.matchAll(USER_PATTERN)].map((match) => ({
      id: Number(match[1]),
      name: match[2],
      email: match[3],
      phone: match[4],
    }));
  }

  *[Symbol.iterator](): Generator<UserData> {
    for (const user of this.users) {
      yield user;
    }
  }
}
