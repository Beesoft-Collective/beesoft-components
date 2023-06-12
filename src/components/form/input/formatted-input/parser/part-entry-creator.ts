import { InputFormat } from '../input-format.interfaces';
import { FormatPartEntry } from './parser.interfaces';

/**
 * Creates format part entries.
 */
export class PartEntryCreator {
  /**
   * Creates a list of format part entries from a list of format parts.
   */
  public static create(format: InputFormat) {
    const formatPartList: FormatPartEntry[] = [];
    let currentIndex = 0;

    for (let i = 0, len = format.formatParts.length; i < len; i++) {
      const formatPart = format.formatParts[i];
      const startPosition = currentIndex;
      const endPosition = startPosition + formatPart.characterCount;

      formatPartList.push({
        startPosition,
        endPosition,
        ...formatPart,
      });

      currentIndex = endPosition;
    }

    return formatPartList;
  }
}
