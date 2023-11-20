import { FormatPartEntry, FormatPartSlot } from './parser.interfaces';

/**
 * Creates the format part entries.
 */
export class InputSlotCreator {
  /**
   * Creates inputs slots from a list of format part entries.
   */
  public static create(formatPartEntries: FormatPartEntry[]): FormatPartSlot[] {
    const slots: FormatPartSlot[] = [];
    for (let i = 0, len = formatPartEntries.length; i < len; i++) {
      const entry = formatPartEntries[i];
      if (entry.isSeparator) {
        continue;
      }

      slots.push({
        partIndex: i,
        partText: '',
        isComplete: false,
        ...entry,
      });
    }

    return slots;
  }
}
