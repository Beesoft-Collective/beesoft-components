import { InputFormat } from '../formats/input-format.interfaces';
import { InputSlotCollection } from './input-slot-collection';
import { FormatPartEntry } from './parser.interfaces';
import { PartEntryCreator } from './part-entry-creator';

/**
 * Combines the format parts with the input slot collection and renders it into a final output.
 */
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

  /**
   * Renders the formatted data by looping through the format parts and using the data from the input slots.
   */
  public render() {
    let output = '';

    for (let i = 0, length = this.formatPartList.length; i < length; i++) {
      const partEntry = this.formatPartList[i];
      if (!partEntry.isSeparator) {
        // for an input part, we need to get the data from the input slot collection
        const inputSlot = this.inputSlotCollection.getSlot(i);
        if (inputSlot) {
          // if the slot isn't completely filled by the data then render input text for the remaining text
          output +=
            inputSlot.partText + inputSlot.inputText?.repeat(inputSlot.characterCount - inputSlot.partText.length);
        }
      } else {
        // for a separator just render the input text
        output += partEntry.inputText;
      }
    }

    // set the output to the input element
    if (this.inputElement) {
      this.inputElement.innerHTML = output;
    }
  }
}
