import { IIterator } from '../../../../../interfaces/iterator.interface';
import { InputFormat } from '../formats/input-format.interfaces';
import { FormatPartEntry, FormatPartEntryConstructor } from './format-part-entry-constructor';

export class FormatPartList implements IIterator<FormatPartEntry> {
  private index = 0;
  private readonly formatParts: Array<FormatPartEntry> = [];

  constructor(private format: InputFormat) {
    this.formatParts = FormatPartEntryConstructor.createFormatPartList(format);
  }

  hasNext(): boolean {
    return this.index < this.formatParts.length;
  }

  next(): FormatPartEntry {
    if (this.index < this.formatParts.length) {
      return this.formatParts[this.index++];
    }

    throw new Error('The end of the list has been reached');
  }

  reset(): void {
    this.index = 0;
  }
}
