import { AccessLogRecord } from "../../models/DataRecord";
import * as fs from "fs/promises";

export class AccessLogWriter {
  private records: Omit<AccessLogRecord, "type">[] = [];
  write(record: AccessLogRecord) {
    const { type: _type, ...rest } = record;
    this.records.push(rest);
  }
  async finalize() {
    await fs.writeFile(
      "src/output/access_logs.json",
      JSON.stringify(this.records, null, 2)
    );
  }
}
