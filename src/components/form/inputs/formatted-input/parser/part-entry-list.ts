import {FormatPartEntry} from "./parser.interfaces.ts";
import {InputFormat} from "../input-format.interfaces.ts";
import {PartEntryCreator} from "./part-entry-creator.ts";

export class PartEntryList {
  private readonly formatParts: FormatPartEntry[];

  constructor(format: InputFormat) {
    this.formatParts = PartEntryCreator.create(format);
  }

  public getUniqueSeparators() {
    const separators: Array<string> = [];
    const parts = this.formatParts.filter((part) => part.isSeparator);

    for (let i = 0, length = parts.length; i < length; i++) {
      const part = parts[i];
      if (part.inputText && !separators.includes(part.inputText)) {
        separators.push(part.inputText);
      }
    }

    return separators;
  }
}
