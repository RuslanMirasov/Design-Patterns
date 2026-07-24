import { AbstractHandler } from "../AbstractHandler";
import { SystemErrorRecord } from "../../models/DataRecord";

export class MessageTrimmer extends AbstractHandler {
  protected process(record: SystemErrorRecord): SystemErrorRecord {
    const trimmed = record.message?.trim();
    if (!trimmed) throw new Error("Invalid message");
    return { ...record, message: trimmed.slice(0, 255) };
  }
}
