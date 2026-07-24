import { DataRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class RejectedWriter {
  private lines: string[] = [];
  write(record: DataRecord, error: string) {
    this.lines.push(JSON.stringify({ record, error }));
  }
  async finalize() {
    const content = this.lines.length ? this.lines.join("\n") + "\n" : "";
    await fs.writeFile("src/output/rejected.jsonl", content);
  }
}
