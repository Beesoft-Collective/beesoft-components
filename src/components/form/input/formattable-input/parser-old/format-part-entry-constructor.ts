import { FormatPart, InputFormat } from '../formats/input-format.interfaces';

export interface FormatPartEntry extends FormatPart {
  start: number;
  end: number;
}

export class FormatPartEntryConstructor {
  public static createFormatPartList(format: InputFormat) {
    const formatPartList: Array<FormatPartEntry> = [];
    let currentIndex = 0;

    for (let i = 0, length = format.formatParts.length; i < length; i++) {
      const formatPart = format.formatParts[i];
      const start = currentIndex;
      const end = currentIndex + formatPart.characterCount;

      formatPartList.push({
        start,
        end,
        ...formatPart,
      });

      currentIndex = end;
    }

    return formatPartList;
  }
}
