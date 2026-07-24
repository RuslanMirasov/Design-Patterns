import { SystemErrorRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class ErrorLogWriter {
  private lines: string[] = [];
  write(record: SystemErrorRecord) {
    const { type: _type, ...rest } = record;
    this.lines.push(JSON.stringify(rest));
  }
  async finalize() {
    const content = this.lines.length ? this.lines.join("\n") + "\n" : "";
    await fs.writeFile("src/output/errors.jsonl", content);
  }
}
