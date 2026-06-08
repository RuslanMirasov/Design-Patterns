import { Reader } from "../models/Reader";
import { Copy } from "../models/Copy";

export class BorrowService {
  borrow(reader: Reader, copy: Copy): boolean {
    if (!copy.isCopyAvailable()) {
      return false;
    }
    copy.setAvailable(false);
    reader.addBorrowedCopy(copy);
    return true;
  }

  returnBook(reader: Reader, copy: Copy): void {
    reader.removeBorrowedCopy(copy);
    copy.setAvailable(true);
  }
}
