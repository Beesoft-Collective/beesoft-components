import { FormatValueType, InputFormat } from '../formats/input-format.interfaces';
import { FormatKeyProcessor } from './format-key-processor';
import { FormatNavigator } from './format-navigator';
import { FormatPartEntry, FormatPartEntryConstructor } from './format-part-entry-constructor';
import { FormatPartList } from './format-part-list';

export interface FormatInputSlot extends FormatPartEntry {
  partIndex: number;
  partText: string;
  isComplete: boolean;
}

/**
 * Takes the user typed input and merges it with the format to create the final output.
 */
export class FormatInputProcessor {
  private readonly keyProcessor: FormatKeyProcessor;
  private readonly formPartList: Array<FormatPartEntry>;
  private readonly formatPartIterator: FormatPartList;
  private readonly formatNavigator: FormatNavigator;

  private formatInputSlots: Array<FormatInputSlot> = [];

  constructor(private format: InputFormat, private inputValue = '') {
    this.keyProcessor = new FormatKeyProcessor(format);
    this.formPartList = FormatPartEntryConstructor.createFormatPartList(format);
    this.formatPartIterator = new FormatPartList(format);
    this.formatNavigator = FormatNavigator.getServiceInstance(format);

    this.createInputSlots();
  }

  public processKeyPress(event: KeyboardEvent) {

  }

  public processInputValue(rawInputValue = '') {
    let formatText = '';
    this.formatPartIterator.reset();

    if (rawInputValue.length > 0) {
      let currentDataPosition = 0;
      while (this.formatPartIterator.hasNext()) {
        const formatPart = this.formatPartIterator.next();
        if (formatPart.isSeparator) {
          formatText += formatPart.inputText;
          continue;
        }

        const inputText = formatPart.inputText;
        const inputPart = rawInputValue.substring(currentDataPosition, currentDataPosition + formatPart.characterCount);
        // this code goes down the happy path for the date maximum value tab feature
        if (formatPart.valueType === FormatValueType.Numeric && inputPart.length > 0) {
          if (formatPart.maximumValue && formatPart.exceedingMaximumValueCausesTab === true) {
            const parsedPartValue = parseInt(inputPart);
            if (parsedPartValue > formatPart.maximumValue) {
              const inputSubPart = inputPart.substring(0, inputPart.length - 1);
              formatText +=
                inputSubPart.length === formatPart.characterCount
                  ? inputSubPart
                  : formatPart.padWithZeros !== true
                  ? inputSubPart + inputText?.repeat(formatPart.characterCount - inputSubPart.length)
                  : inputSubPart.padStart(formatPart.characterCount, '0');
              currentDataPosition += inputPart.length - 1;
            } else {
              formatText +=
                inputPart.length === formatPart.characterCount
                  ? inputPart
                  : inputPart + inputText?.repeat(formatPart.characterCount - inputPart.length);
              currentDataPosition += inputPart.length;
            }
          } else {
            formatText +=
              inputPart.length === formatPart.characterCount
                ? inputPart
                : inputPart + inputText?.repeat(formatPart.characterCount - inputPart.length);
            currentDataPosition += inputPart.length;
          }
        } else {
          formatText +=
            inputPart.length === formatPart.characterCount
              ? inputPart
              : inputPart + inputText?.repeat(formatPart.characterCount - inputPart.length);
          currentDataPosition += inputPart.length;
        }
      }

      return formatText;
    }

    while (this.formatPartIterator.hasNext()) {
      const formatPart = this.formatPartIterator.next();
      const inputText = formatPart.inputText;
      for (let i = 0, length = formatPart.characterCount; i < length; i++) {
        formatText += inputText;
      }
    }

    return formatText;
  }

  private createInputSlots() {
    for (let i = 0, length = this.formPartList.length; i < length; i++) {
      const currentPart = this.formPartList[i];
      if (currentPart.isSeparator) {
        continue;
      }

      this.formatInputSlots?.push({
        partIndex: i,
        partText: '',
        isComplete: false,
        ...currentPart,
      });
    }
  }
}
