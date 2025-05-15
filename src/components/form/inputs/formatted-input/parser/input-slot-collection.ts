import { InputFormat } from '../input-format.interfaces';
import { InputSlotCreator } from './input-slot-creator';
import { FormatPartSlot } from './parser.interfaces';
import { PartEntryCreator } from './part-entry-creator';

/**
 * Allows access to the inputs slots and their values.
 */
export class InputSlotCollection {
  private readonly inputSlots: FormatPartSlot[];

  constructor(format: InputFormat) {
    this.inputSlots = InputSlotCreator.create(PartEntryCreator.create(format));
  }

  /**
   * Clears the inputs slots and their values. This is used when we want to process the data from scratch.
   */
  public clearAllSlots(): void {
    for (let i = 0, length = this.inputSlots.length; i < length; i++) {
      this.inputSlots[i].partText = '';
    }
  }

  /**
   * Returns a slot by its part index.
   * @param {number} partIndex - The part index of the slot to retrieve.
   * @returns {FormatPartSlot} - The slot with the given part index.
   */
  public getSlot(partIndex: number) {
    return this.inputSlots.find((slot) => slot.partIndex === partIndex);
  }

  /**
   * Returns all slots contained within the part index array.
   * @param partIndices - The part indices to retrieve.
   * @returns {Array<FormatPartSlot>} - The slots with the given part indices.
   */
  public getSlots(partIndices: Array<number>) {
    return this.inputSlots.filter((slot) => partIndices.includes(slot.partIndex));
  }

  public getSlotsFromCursorPosition(cursorPosition: number) {
    let slotPosition = -1;

    // TODO: This logic has a flaw where it possibly wouldn't return a value when it should...in the case where a format
    //  would have a separator that is longer than 1 character the cursor could be in the middle of the separator. We
    //  need to add some logic to handle that possibility, currently it will just return undefined.
    for (let i = 0, length = this.inputSlots.length; i < length; i++) {
      const slot = this.inputSlots[i];
      if (cursorPosition >= slot.startPosition && cursorPosition <= slot.endPosition) {
        slotPosition = i;
        break;
      }
    }

    return slotPosition > -1 ? this.inputSlots.filter((slot) => slot.partIndex >= slotPosition) : undefined;
  }

  /**
   * Returns the first inputs slot in the collection.
   * @returns {FormatPartSlot} The first slot in the collection.
   */
  public getFirstSlot() {
    return this.inputSlots[0];
  }

  public getLastSlot() {
    return this.inputSlots[this.inputSlots.length - 1];
  }

  /**
   * Returns the next slot based on the current format part index.
   * @param {number} currentPartIndex - The current part index.
   * @returns {FormatPartSlot} The next slot or undefined if there is no next slot.
   */
  public getNextSlot(currentPartIndex: number) {
    const currentIndex = this.inputSlots.findIndex((slot) => slot.partIndex === currentPartIndex);
    if (currentIndex > -1 && currentIndex + 1 < this.inputSlots.length) {
      return this.inputSlots[currentIndex + 1];
    }
  }

  /**
   * Returns the previous slot based on the current format part index.
   * @param {number} currentPartIndex - The current part index.
   * @returns {FormatPartSlot} The previous slot or undefined if there is no previous slot.
   */
  public getPreviousSlot(currentPartIndex: number) {
    const currentIndex = this.inputSlots.findIndex((slot) => slot.partIndex === currentPartIndex);
    if (currentIndex > -1 && currentIndex - 1 >= 0) {
      return this.inputSlots[currentIndex - 1];
    }
  }

  /**
   * Returns the next slot that is not completed.
   * @returns {FormatPartSlot} The next slot that is not completed or undefined if all are completed.
   */
  public getLastSlotWithData() {
    const incompleteSlotIndex = this.inputSlots.findIndex((slot) => !slot.isComplete);
    let finalSlotIndex = incompleteSlotIndex;
    for (let i = incompleteSlotIndex + 1, length = this.inputSlots.length; i < length; i++) {
      const slot = this.inputSlots[i];
      if (slot.partText.length > 0) {
        finalSlotIndex = i;
      }
    }

    return this.inputSlots[finalSlotIndex > -1 ? finalSlotIndex : 0];
  }

  /**
   * Determines if all slots are completed.
   * @returns {boolean} True if all slots are completed.
   */
  public allSlotsCompleted() {
    return this.inputSlots.every((slot) => slot.isComplete);
  }

  /**
   * Determines if all slots are empty.
   * @returns {boolean} True if all slots are empty.
   */
  public allSlotsEmpty() {
    return this.inputSlots.every((slot) => slot.partText.length === 0);
  }
}
