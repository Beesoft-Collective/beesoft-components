import { IIterator } from '../../../../../interfaces/iterator.interface';
import { InputFormat } from '../formats/input-format.interfaces';
import { FormatPartEntry } from './parser.interfaces';
import { PartEntryCreator } from './part-entry-creator';

export class PartEntryIterator implements IIterator<FormatPartEntry> {
  private _currentIndex = 0;
  private index = 0;
  private readonly formatParts: FormatPartEntry[];

  get currentIndex(): number {
    return this._currentIndex;
  }

  constructor(format: InputFormat) {
    this.formatParts = PartEntryCreator.create(format);
  }
  hasNext(): boolean {
    return this.index < this.formatParts.length;
  }

  next(): FormatPartEntry | undefined {
    if (this.index < this.formatParts.length) {
      this._currentIndex = this.index++;
      return this.formatParts[this._currentIndex];
    }
  }

  peek(): FormatPartEntry | undefined {
    if (this.index < this.formatParts.length) {
      // since we get the next item in the list by performing a ++ after retrieving it, we can just return the current
      // index to peek the next item
      return this.formatParts[this.index];
    }
  }

  reset(): void {
    this.index = 0;
  }
}
