import { InputFormat } from '../formats/input-format.interfaces';
import { InputSlotCollection } from './input-slot-collection';
import { FormatPartEntry } from './parser.interfaces';
import { PartEntryCreator } from './part-entry-creator';

export class FormatRenderer {
  private readonly formatPartList: FormatPartEntry[];
  private readonly inputSlotCollection: InputSlotCollection;

  private inputElement?: HTMLElement;

  constructor(format: InputFormat) {
    this.formatPartList = PartEntryCreator.create(format);
    this.inputSlotCollection = InputSlotCollection.getInstance(format);
  }

  public setInputElement(element: HTMLElement) {
    this.inputElement = element;
  }

  public render() {
    let output = '';

    for (let i = 0, length = this.formatPartList.length; i < length; i++) {
      const partEntry = this.formatPartList[i];
      if (!partEntry.isSeparator) {
        const inputSlot = this.inputSlotCollection.getSlot(i);
        if (inputSlot) {
          output +=
            inputSlot.partText + inputSlot.inputText?.repeat(inputSlot.characterCount - inputSlot.partText.length);
        }
      } else {
        output += partEntry.inputText;
      }
    }

    if (this.inputElement) {
      this.inputElement.innerHTML = output;
    }
  }
}
