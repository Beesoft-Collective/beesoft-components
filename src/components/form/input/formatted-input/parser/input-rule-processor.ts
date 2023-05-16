import { FormatValueType, InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputSlotCollection } from './input-slot-collection';
import { KeyTypeChecker } from './key-type-checker';
import { EditingKeyboardEvent, FormatPartSlot } from './parser.interfaces';
import { PartEntryIterator } from './part-entry-iterator';

export class InputRuleProcessor {
  private readonly inputSlotCollection: InputSlotCollection;
  private readonly formatNavigator: FormatNavigator;
  private readonly keyTypeChecker: KeyTypeChecker;
  private readonly formatRenderer: FormatRenderer;
  private readonly formatPartList: PartEntryIterator;

  constructor(private format: InputFormat) {
    this.inputSlotCollection = InputSlotCollection.getInstance(format);
    this.formatNavigator = FormatNavigator.getInstance(format);
    this.keyTypeChecker = new KeyTypeChecker();
    this.formatRenderer = new FormatRenderer(format);
    this.formatPartList = new PartEntryIterator(format);
  }

  public setInputElement(element: HTMLElement): void {
    this.formatRenderer.setInputElement(element);
  }

  public processKeyPress(event: KeyboardEvent): void {
    if (this.keyTypeChecker.isEditingKey(event)) {
      this.processEditRules(event);
      return;
    }

    this.processInputRules(event);
  }

  public processInputValue(value: string): void {
    this.inputSlotCollection.clearAllSlots();
    this.formatPartList.reset();

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
              slot.partText = value.substring(valueIndex, separatorIndex);
              this.processSlotRules(slot);
              valueIndex = separatorIndex + separator.characterCount;
            }
          }
        } else {
          // this should be the end of the format since there is no corresponding separator
          const slot = this.inputSlotCollection.getSlot(this.formatPartList.currentIndex);
          if (slot) {
            slot.partText = value.substring(valueIndex);
            this.formatNavigator.setCursorPosition(slot.startPosition + slot.partText.length);
            this.processSlotRules(slot);
          }
        }
      }
    }
  }

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
   * Used to shift the text of the format parts to the right of where the delete happened.
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

  private processInputRules(event: KeyboardEvent): void {
    const inputSlot = this.inputSlotCollection.getSlot(this.formatNavigator.getCurrentPartIndex());
    if (!inputSlot) {
      return;
    }

    const { key } = event;
    const characterCount = inputSlot.characterCount;
    const currentValue = inputSlot.partText;

    if (inputSlot.valueType === FormatValueType.Numeric) {
      if (!this.keyTypeChecker.isNumberKey(key)) {
        return;
      }

      const maximumValue = inputSlot.maximumValue;
      const exceedingMaximumValueCausesTab = inputSlot.exceedingMaximumValueCausesTab || false;
      const padWithZeros = inputSlot.padWithZeros || false;
      const newValue = parseInt(currentValue + key);

      if (maximumValue && newValue > maximumValue) {
        if (exceedingMaximumValueCausesTab) {
          if (padWithZeros) {
            inputSlot.partText = inputSlot.partText.padStart(characterCount, '0');
          }
          inputSlot.isComplete = true;

          // since we've exceeded the maximum value, we need to put the currently typed value into the next slot
          const nextSlot = this.inputSlotCollection.getNextSlot(inputSlot.partIndex);
          if (nextSlot && !nextSlot.isComplete) {
            nextSlot.partText = key;
          }
          this.formatRenderer.render();

          if (nextSlot) {
            this.formatNavigator.setCursorPosition(
              !nextSlot.isComplete ? nextSlot.startPosition + 1 : nextSlot.startPosition
            );
          }
        } else {
          return;
        }
      } else if (currentValue.length + 1 === characterCount) {
        this.addToInputSlot(key);
        inputSlot.isComplete = true;
        this.formatRenderer.render();

        if (!this.formatNavigator.isAtLastPart()) {
          this.formatNavigator.moveToNextInputPart();
        } else {
          this.formatNavigator.moveCursorRight();
        }
      } else {
        this.addToInputSlot(key);
        this.formatRenderer.render();
        this.formatNavigator.moveCursorRight();
      }
    } else {
      // non-numeric input is more simple than numeric input
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
    if (!inputSlot) {
      return;
    }

    const currentValue = inputSlot.partText;
    const cursorPosition = this.formatNavigator.getCursorPosition();

    if (cursorPosition >= inputSlot.startPosition + inputSlot.partText.length) {
      inputSlot.partText = currentValue + key;
    } else {
      const slotCursorPosition = cursorPosition - inputSlot.startPosition;
      inputSlot.partText =
        currentValue.substring(0, slotCursorPosition) + key + currentValue.substring(slotCursorPosition);
    }
  }

  private processSlotRules(inputSlot: FormatPartSlot, isEditing = false): void {
    const characterCount = inputSlot.characterCount;
    const allCharactersRequired = inputSlot.allCharactersRequired || false;

    if (inputSlot.valueType === FormatValueType.Numeric) {
      const minimumValue = inputSlot.minimumValue;
      const maximumValue = inputSlot.maximumValue;

      if (allCharactersRequired) {
        inputSlot.isComplete = inputSlot.partText.length === characterCount;
      } else if (minimumValue !== undefined && maximumValue !== undefined) {
        const padWithZeros = inputSlot.padWithZeros || false;
        const currentValue = parseInt(inputSlot.partText);
        inputSlot.isComplete = currentValue >= minimumValue && currentValue <= maximumValue;

        if (inputSlot.isComplete && padWithZeros && !isEditing) {
          inputSlot.partText = inputSlot.partText.padStart(characterCount, '0');
        }
      } else {
        // all the characters are not required and there is no minimum or maximum value so any value is valid
        inputSlot.isComplete = inputSlot.partText.length > 0;
      }
    } else {
      if (allCharactersRequired) {
        inputSlot.isComplete = inputSlot.partText.length === characterCount;
      } else {
        inputSlot.isComplete = inputSlot.partText.length > 0;
      }
    }
  }
}
