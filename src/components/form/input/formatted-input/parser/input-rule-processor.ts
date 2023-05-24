import { FormatValueType, InputFormat } from '../formats/input-format.interfaces';
import { FormatInstanceCollection } from './format-instance-collection';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputSlotCollection } from './input-slot-collection';
import { KeyTypeChecker } from './key-type-checker';
import { EditingKeyboardEvent, FormatPartSlot } from './parser.interfaces';
import { PartEntryIterator } from './part-entry-iterator';

/**
 * Takes input either in the form of a passed value or as a key press and run that input against the rules of the
 * format.
 */
export class InputRuleProcessor {
  private readonly instanceCollection: FormatInstanceCollection;
  private readonly inputSlotCollection: InputSlotCollection;
  private readonly formatNavigator: FormatNavigator;
  private readonly keyTypeChecker: KeyTypeChecker;
  private readonly formatRenderer: FormatRenderer;
  private readonly formatPartList: PartEntryIterator;

  constructor(private format: InputFormat, instanceId: string) {
    this.instanceCollection = FormatInstanceCollection.getInstance();
    this.inputSlotCollection = this.instanceCollection.getInputSlotInstance(instanceId, format);
    this.formatNavigator = this.instanceCollection.getNavigatorInstance(instanceId, format);
    this.keyTypeChecker = new KeyTypeChecker();
    this.formatRenderer = new FormatRenderer(format, instanceId);
    this.formatPartList = new PartEntryIterator(format);
  }

  public setInputElement(element: HTMLElement): void {
    this.formatRenderer.setInputElement(element);
  }

  /**
   * Takes a key press event, determines if it is a movement key or data to run the format rules against.
   * @param {KeyboardEvent} event - The event with the key press information.
   */
  public processKeyPress(event: KeyboardEvent): void {
    if (this.keyTypeChecker.isEditingKey(event)) {
      this.processEditRules(event);
      return;
    }

    this.processInputRules(event);
  }

  /**
   * Called when a set value is passed into the formatter.
   * @param {string} value - The raw value to process.
   */
  public processInputValue(value: string): void {
    this.inputSlotCollection.clearAllSlots();
    this.formatPartList.reset();

    // the assumption of this code is that a format will end with an input slot not a separator. it would be a good idea
    // to add code to handle the case where the last part of the input is a separator.
    let valueIndex = 0;
    while (this.formatPartList.hasNext()) {
      const partEntry = this.formatPartList.next();
      if (partEntry && !partEntry.isSeparator) {
        if (this.formatPartList.peek()?.isSeparator === true) {
          const formatPartIndex = this.formatPartList.currentIndex;
          const separator = this.formatPartList.next();
          if (separator && separator.inputText) {
            const separatorIndex = value.indexOf(separator.inputText, valueIndex);
            const slot = this.inputSlotCollection.getSlot(formatPartIndex);
            if (slot && separatorIndex > -1) {
              const endIndex =
                separatorIndex - valueIndex > slot.characterCount ? valueIndex + slot.characterCount : separatorIndex;
              slot.partText = value.substring(valueIndex, endIndex);
              this.processSlotRules(slot);
              valueIndex = separatorIndex + separator.characterCount;
            }
          }
        } else {
          // this should be the end of the format since there is no corresponding separator
          const slot = this.inputSlotCollection.getSlot(this.formatPartList.currentIndex);
          if (slot) {
            slot.partText = value.substring(valueIndex, valueIndex + slot.characterCount);
            this.processSlotRules(slot);
          }
        }
      }
    }
  }

  /**
   * If a key press is performing an edit on the data (deleting data) then this method will be called.
   * @param {EditingKeyboardEvent} event - A special key press event that restricts the key property to only "Backspace" or "Delete".
   * @private
   */
  private processEditRules(event: EditingKeyboardEvent): void {
    const inputSlot = this.inputSlotCollection.getSlot(this.formatNavigator.getCurrentPartIndex());
    if (!inputSlot) {
      return;
    }

    const cursorPosition = this.formatNavigator.getCursorPosition();
    const cursorPositionInSlot = cursorPosition - inputSlot.startPosition;
    const deleteShiftsFormatPart = this.format.deleteShiftsFormatPart || false;

    switch (event.key) {
      case 'Backspace':
        // this will delete the item to the left of the cursor
        const isAtBeginningOfInputSlot = inputSlot.startPosition === cursorPosition;
        if (!isAtBeginningOfInputSlot) {
          // this is run when the cursor is not at the beginning of the input slot
          inputSlot.partText =
            inputSlot.partText.substring(0, cursorPositionInSlot - 1) +
            inputSlot.partText.substring(cursorPositionInSlot);

          if (deleteShiftsFormatPart) {
            this.shiftFormatParts(inputSlot);
          }

          this.formatRenderer.render();
          this.formatNavigator.moveCursorLeft();

          this.processSlotRules(inputSlot, true);
        } else {
          // as a safety precaution we need to check if the current input slot is complete
          this.processSlotRules(inputSlot, true);

          // here we are at the beginning of the input slot, so we need to remove the item from the end of the previous
          // slot
          const previousSlot = this.inputSlotCollection.getPreviousSlot(inputSlot.partIndex);
          if (previousSlot) {
            previousSlot.partText = previousSlot.partText.substring(0, previousSlot.partText.length - 1);

            if (deleteShiftsFormatPart) {
              this.shiftFormatParts(previousSlot);
            }

            this.formatRenderer.render();
            this.formatNavigator.setCursorPosition(previousSlot.startPosition + previousSlot.partText.length);

            this.processSlotRules(previousSlot, true);
          }
        }

        break;
      case 'Delete':
        // this will delete the item to the right of the cursor
        inputSlot.partText =
          inputSlot.partText.substring(0, cursorPositionInSlot) +
          inputSlot.partText.substring(cursorPositionInSlot + 1);

        if (deleteShiftsFormatPart) {
          this.shiftFormatParts(inputSlot);
        }

        this.formatRenderer.render();
        this.formatNavigator.setCursorToCurrentPosition();

        this.processSlotRules(inputSlot, true);

        break;
    }
  }

  /**
   * Used to shift the text of the format parts to the right of where the delete happened. This is only called when the
   * format has turned this setting on.
   * @param {FormatPartSlot} inputSlot - The slot where the delete happened.
   * @private
   */
  private shiftFormatParts(inputSlot: FormatPartSlot): void {
    let previousSlot = inputSlot;
    let nextSlot: FormatPartSlot | undefined;
    while ((nextSlot = this.inputSlotCollection.getNextSlot(previousSlot.partIndex)) !== undefined) {
      const removedCharacter = nextSlot.partText.substring(0, 1);
      nextSlot.partText = nextSlot.partText.substring(1);
      previousSlot.partText = previousSlot.partText + removedCharacter;
      previousSlot = nextSlot;
    }
  }

  /**
   * If a key press is data being typed into the input then this is called to process that data.
   * @param {KeyboardEvent} event - Contains the data for the key press.
   * @private
   */
  private processInputRules(event: KeyboardEvent): void {
    const inputSlot = this.inputSlotCollection.getSlot(this.formatNavigator.getCurrentPartIndex());
    if (!inputSlot) {
      return;
    }

    const { key } = event;
    const characterCount = inputSlot.characterCount;
    const currentValue = inputSlot.partText;

    if (inputSlot.valueType === FormatValueType.Numeric) {
      // numeric slots have more rules than text slots
      if (!this.keyTypeChecker.isNumberKey(key)) {
        return;
      }

      // determines the largest number allowed in the slot
      const maximumValue = inputSlot.maximumValue;
      // if the maximum value is set and exceeded then this setting determines if the formatter will move the next typed
      // character into the next input slot.
      const exceedingMaximumValueCausesTab = inputSlot.exceedingMaximumValueCausesTab || false;
      // if true a numeric value with fewer characters than the ones defined will be filled to the left with zeros.
      const padWithZeros = inputSlot.padWithZeros || false;
      // this is the potential new value to put into the slot.
      const newValue = parseInt(this.createNewValue(inputSlot, key));

      if (maximumValue && newValue > maximumValue) {
        // if the maximum value is defined and the new value is greater than the maximum value then some other settings
        // need to be checked.
        if (exceedingMaximumValueCausesTab) {
          // if this is set then the newly typed character will be added to the next input slot.
          if (padWithZeros) {
            // if there is any empty space in the input slot then it will be filled with zeros.
            inputSlot.partText = inputSlot.partText.padStart(characterCount, '0');
          }
          inputSlot.isComplete = true;

          // since we've exceeded the maximum value, we need to put the currently typed value into the next slot, but
          // only if the next slot is not complete.
          const nextSlot = this.inputSlotCollection.getNextSlot(inputSlot.partIndex);
          if (nextSlot && !nextSlot.isComplete) {
            nextSlot.partText = key;
          }
          this.formatRenderer.render();

          if (nextSlot) {
            // if the next slot is not complete, then move the cursor after the newly typed character. else move the
            // cursor to the beginning of the next slot.
            this.formatNavigator.setCursorPosition(
              !nextSlot.isComplete ? nextSlot.startPosition + 1 : nextSlot.startPosition
            );
          }
        } else {
          return;
        }
      } else if (currentValue.length + 1 === characterCount) {
        // this is called when the typed character is the last character in the input slot.
        this.addToInputSlot(key);
        inputSlot.isComplete = true;
        this.formatRenderer.render();

        if (!this.formatNavigator.isAtLastPart()) {
          // if there is another input slot, then move the cursor to that slot.
          this.formatNavigator.moveToNextInputPart();
        } else {
          // if this is the last input slot, then move the cursor to the end of the input slot.
          this.formatNavigator.moveCursorRight();
        }
      } else if (currentValue.length + 1 < characterCount) {
        // if the maximum value hasn't been exceeded and the slot hasn't been filled then this is called.
        this.addToInputSlot(key);
        this.formatRenderer.render();
        this.formatNavigator.moveCursorRight();
      }
    } else {
      // non-numeric input is more simple than numeric input, either we've filled the input slow or we haven't.
      if (currentValue.length + 1 === characterCount) {
        this.addToInputSlot(key);
        inputSlot.isComplete = true;
        this.formatRenderer.render();
        this.formatNavigator.moveToNextInputPart();
      } else {
        this.addToInputSlot(key);
        this.formatRenderer.render();
        this.formatNavigator.moveCursorRight();
      }
    }
  }

  /**
   * Makes sure that the key being entered into the input slot is at the correct position.
   * @param {string} key - The key to be added to the input slot.
   * @private
   */
  private addToInputSlot(key: string) {
    const inputSlot = this.inputSlotCollection.getSlot(this.formatNavigator.getCurrentPartIndex());
    if (inputSlot) {
      inputSlot.partText = this.createNewValue(inputSlot, key);
    }
  }

  /**
   * Creates a new value based on where the cursor position is in the input slot.
   * @param {FormatPartSlot} inputSlot - The input slot the value should be added to.
   * @param {string} key - The key to be added to the input slot.
   * @returns {string} The new value.
   * @private
   */
  private createNewValue(inputSlot: FormatPartSlot, key: string) {
    const currentValue = inputSlot.partText;
    const cursorPosition = this.formatNavigator.getCursorPosition();

    if (cursorPosition >= inputSlot.startPosition + inputSlot.partText.length) {
      // if the cursor position is at the end of the input slot then add the new key to the end of the input slot
      return currentValue + key;
    } else {
      // if the cursor position is somewhere other than the end of the input slot then put the new key where the cursor
      // is
      const slotCursorPosition = cursorPosition - inputSlot.startPosition;
      return currentValue.substring(0, slotCursorPosition) + key + currentValue.substring(slotCursorPosition);
    }
  }

  /**
   * Called when the data in a slot is deleted or when a value is passed into the formmatter.
   * @param {FormatPartSlot} inputSlot - The slot the process the rules for.
   * @param {boolean} isEditing - When true the code will not process the pad with zeros setting.
   * @private
   */
  private processSlotRules(inputSlot: FormatPartSlot, isEditing = false): void {
    const characterCount = inputSlot.characterCount;
    const allCharactersRequired = inputSlot.allCharactersRequired || false;

    if (inputSlot.valueType === FormatValueType.Numeric) {
      // since we are trying to determine if a slot is complete, we can check the minimum value here
      const minimumValue = inputSlot.minimumValue;
      const maximumValue = inputSlot.maximumValue;

      if (allCharactersRequired) {
        // if all characters are required then the part text must be the same length as the character count
        inputSlot.isComplete = inputSlot.partText.length === characterCount;
      } else if (minimumValue !== undefined && maximumValue !== undefined) {
        // here the slot is complete if the value is greater than or equal to the minimum value and less than or equal
        // to the maximum value
        const padWithZeros = inputSlot.padWithZeros || false;
        const currentValue = parseInt(inputSlot.partText);
        inputSlot.isComplete = currentValue >= minimumValue && currentValue <= maximumValue;

        if (inputSlot.isComplete && padWithZeros && !isEditing) {
          // if this isn't called by a character deletion then we need to pad with zeros
          inputSlot.partText = inputSlot.partText.padStart(characterCount, '0');
        }
      } else {
        // all the characters are not required and there is no minimum or maximum value so any value is valid
        inputSlot.isComplete = inputSlot.partText.length > 0;
      }
    } else {
      // once again text data is easier to validate either the text length needs to match the character count, or there
      // needs to be at least one character
      if (allCharactersRequired) {
        inputSlot.isComplete = inputSlot.partText.length === characterCount;
      } else {
        inputSlot.isComplete = inputSlot.partText.length > 0;
      }
    }
  }
}
