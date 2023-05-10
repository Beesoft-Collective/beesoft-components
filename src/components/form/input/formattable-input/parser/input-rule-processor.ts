import { FormatValueType, InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { InputSlotCollection } from './input-slot-collection';
import { KeyTypeChecker } from './key-type-checker';
import { EditingKeyboardEvent, FormatPartSlot } from './parser.interfaces';

export class InputRuleProcessor {
  private readonly inputSlotCollection: InputSlotCollection;
  private readonly formatNavigator: FormatNavigator;
  private readonly keyTypeChecker: KeyTypeChecker;

  constructor(private format: InputFormat) {
    this.inputSlotCollection = InputSlotCollection.getInstance(format);
    this.formatNavigator = FormatNavigator.getInstance(format);
    this.keyTypeChecker = new KeyTypeChecker();
  }

  public processKeyPress(event: KeyboardEvent): void {
    if (this.keyTypeChecker.isEditingKey(event)) {
      this.processEditRules(event);
      return;
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
          this.formatNavigator.moveCursorLeft();

          if (deleteShiftsFormatPart) {
            this.shiftFormatParts(inputSlot);
          }
        } else {
          // here we are at the beginning of the input slot so we need to remove the item from the end of the previous
          // slot
          const previousSlot = this.inputSlotCollection.getPreviousSlot(inputSlot.partIndex);
          if (previousSlot) {
            previousSlot.partText = previousSlot.partText.substring(0, previousSlot.partText.length - 1);
            this.formatNavigator.tabBackward();
            this.formatNavigator.moveCursorLeft();

            if (deleteShiftsFormatPart) {
              this.shiftFormatParts(previousSlot);
            }
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
    const allCharactersRequired = inputSlot.allCharactersRequired || false;
    const currentValue = inputSlot.partText;

    if (inputSlot.valueType === FormatValueType.Numeric) {
      if (!this.keyTypeChecker.isNumberKey(key)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const minimumValue = inputSlot.minimumValue;
      const maximumValue = inputSlot.maximumValue;
      const exceedingMaximumValueCausesTab = inputSlot.exceedingMaximumValueCausesTab || false;
      const padWithZeros = inputSlot.padWithZeros || false;

      if (maximumValue) {
        const newValue = parseInt(currentValue + key);
      }
    } else {
      // non-numeric input is more simple than numeric input
    }
  }
}
