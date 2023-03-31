import { FormatPart, InputFormat } from '../formatted-input.interfaces';

export interface FormatPartPosition {
  currentCursorLocation: number;
  formatPart: FormatPart;
}

export class FormatKeyValidator {
  private _inputElement: HTMLElement | undefined;

  public set inputElement(value: HTMLElement) {
    this._inputElement = value;
  }

  constructor(private format: InputFormat) {}

  public isKeyPressValid(event: KeyboardEvent, cursorLocation: number) {
    const formatObject = this.getFormatPart(cursorLocation);
    if (formatObject) {
      const { key } = event;
    }
  }

  private getFormatPart(cursorLocation: number): FormatPartPosition | undefined {
    if (cursorLocation === 0) {
      return {
        currentCursorLocation: cursorLocation,
        formatPart: this.format.formatParts[0],
      };
    }

    let combinedCount = 0;
    for (let i = 0, length = this.format.formatParts.length; i < length; i++) {
      const formatPart = this.format.formatParts[i];

      if (!formatPart.isSeparator) {
        combinedCount += formatPart.characterCount || 0;
      } else {
        combinedCount += (formatPart.inputText && formatPart.inputText.length) || 0;
        continue;
      }

      if (cursorLocation < combinedCount) {
        return {
          currentCursorLocation: cursorLocation,
          formatPart,
        };
      } else if (cursorLocation === combinedCount) {
        for (let j = i + 1; j < length; j++) {
          if (!this.format.formatParts[j].isSeparator) {
            return {
              currentCursorLocation: combinedCount,
              formatPart: this.format.formatParts[j],
            };
          } else {
            combinedCount += this.format.formatParts[j].inputText?.length || 0;
          }
        }
      }
    }
  }
}
