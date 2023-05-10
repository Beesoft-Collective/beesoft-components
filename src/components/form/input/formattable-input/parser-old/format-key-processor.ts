import { FormatValueType, InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';

export interface KeyPressValidResult {
  isValid: boolean;
  isMovement: boolean;
  key: string;
  shiftKey: boolean;
  newCursorLocation: number;
}

type FormatMovementKey = 'Tab' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End';

export class FormatKeyProcessor {
  private _allNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private _movementKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
  private _ignoreKeys = ['Shift', 'Alt', 'Control', 'Fn', 'Meta'];

  private formatNavigator: FormatNavigator;
  private _inputElement: HTMLElement | undefined;

  constructor(private format: InputFormat) {
    this.formatNavigator = FormatNavigator.getServiceInstance(format);
  }

  public setInputElement(element: HTMLElement) {
    this._inputElement = element;
  }

  public isIgnoreKey(event: KeyboardEvent) {
    const { key } = event;
    return this._ignoreKeys.includes(key);
  }

  public isMovementKey(event: KeyboardEvent) {
    const { key } = event;
    return this._movementKeys.includes(key);
  }

  public processMovementKey(event: KeyboardEvent) {
    const { key, shiftKey, metaKey } = event;
    if (this.isMovementKeyType(key)) {
      switch (key) {
        case 'ArrowLeft':
          if (!metaKey) {
            this.formatNavigator.moveCursorLeft();
            break;
          } else {
            // Home on a Mac
            this.formatNavigator.setCursorPosition(0);
            break;
          }
        case 'ArrowRight':
          if (!metaKey) {
            break;
          } else {
            // End on a Mac
            break;
          }
        case 'Tab':
          if (!shiftKey) {
            this.formatNavigator.tabForward();
            break;
          } else {
            // tab in reverse direction
            this.formatNavigator.tabReverse();
            break;
          }
        case 'Home':
          this.formatNavigator.setCursorPosition(0);
          break;
        case 'End':
          break;
      }
    }
  }

  public isKeyPressValid(event: KeyboardEvent): KeyPressValidResult {
    const { key, shiftKey } = event;
    const cursorLocation = this.formatNavigator.getCursorLocation();
    const formatObject = this.formatNavigator.getFormatPart(cursorLocation);

    if (formatObject) {
      if (formatObject.formatPartEntry.valueType === FormatValueType.Numeric) {
        const isNumeric = this.isNumber(key);
        const newCursorLocation = isNumeric
          ? formatObject.currentCursorLocation + 1
          : formatObject.currentCursorLocation;

        return {
          isValid: isNumeric,
          isMovement: false,
          key,
          shiftKey,
          newCursorLocation,
        };
      }

      return {
        isValid: true,
        isMovement: false,
        key,
        shiftKey,
        newCursorLocation: formatObject.currentCursorLocation + 1,
      };
    }

    return {
      isValid: false,
      isMovement: false,
      key: '',
      shiftKey,
      newCursorLocation: cursorLocation,
    };
  }

  public isNumber(character: string) {
    return this._allNumbers.includes(character);
  }

  private isMovementKeyType(key: string): key is FormatMovementKey {
    return this._movementKeys.includes(key);
  }
}
