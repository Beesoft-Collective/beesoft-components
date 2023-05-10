import { InputFormat } from '../formats/input-format.interfaces';
import { FormatPartEntry, FormatPartEntryConstructor } from './format-part-entry-constructor';

export interface FormatPartEntryFindResult {
  foundIndex: number;
  entry: FormatPartEntry;
}

export interface FormatPartPosition {
  currentCursorLocation: number;
  formatPartEntry: FormatPartEntry;
}

export class FormatNavigator {
  private static instance: FormatNavigator;

  private currentPartIndex = 0;
  private _currentCursorLocation = 0;

  private readonly formatPartList: Array<FormatPartEntry> = [];
  private inputElement: HTMLElement | undefined;
  private inputSelection: Selection | null = null;
  private inputRange?: Range;
  private textNode?: Node;

  private constructor(private format: InputFormat) {
    this.formatPartList = FormatPartEntryConstructor.createFormatPartList(format);
  }

  public static getServiceInstance(format: InputFormat) {
    if (!this.instance) {
      this.instance = new FormatNavigator(format);
    }

    return this.instance;
  }

  public getCursorLocation() {
    return this._currentCursorLocation;
  }

  /**
   * Called when the input element is created; this is needed to create the selection and range objects.
   * @param {HTMLElement} element - The element containing the text to format.
   */
  public setInputElement(element: HTMLElement) {
    this.inputElement = element;
  }

  public setCursorToCurrentLocation() {
    this.setCursorSelection(this._currentCursorLocation);
  }

  public setCursorPosition(position: number) {
    this.setCursorSelection(position);
  }

  public setCursorSelection(start: number, end?: number) {
    this.createNavigationObjects();
    if (this.inputRange && this.textNode) {
      this.inputRange.setStart(this.textNode, start);
      this.inputRange.setEnd(this.textNode, end || start);
      this._currentCursorLocation = end || start;
      this.setPartIndexByCursor();
    }
  }

  public moveCursorLeft() {
    if (this._currentCursorLocation > 0) {
      const newCursorLocation = this._currentCursorLocation - 1;
      let currentPartEntry = this.formatPartList[this.currentPartIndex];
      if (newCursorLocation >= currentPartEntry.start && newCursorLocation <= currentPartEntry.end) {
        this.setCursorSelection(newCursorLocation);
      } else {
        for (let i = this.currentPartIndex - 1; i >= 0; i--) {
          currentPartEntry = this.formatPartList[i];
          if (newCursorLocation >= currentPartEntry.start && newCursorLocation <= currentPartEntry.end) {
            if (currentPartEntry.isSeparator) {
              this.setCursorSelection(this.formatPartList[i - 1].end);
            } else {
              this.setCursorSelection(newCursorLocation);
            }
          }
        }
      }
    }
  }

  /**
   * Moves from the current format part to the next editable format part if one is available.
   * @returns {FormatPartEntry | undefined} The found format part.
   */
  public tabForward() {
    if (this.currentPartIndex < this.formatPartList.length - 1) {
      const entryResult = this.findNextEditableFormatPart();
      if (entryResult) {
        this.currentPartIndex = entryResult.foundIndex;
        this.setCursorSelection(entryResult.entry.start);
      }
    }
  }

  /**
   * Moves from the current format part to the previous editable format part if one is available.
   * @returns {FormatPartEntry | undefined} The found format part.
   */
  public tabReverse() {
    if (this.currentPartIndex > 0) {
      const entryResult = this.findPreviousEditableFormatPart();
      if (entryResult) {
        this.currentPartIndex = entryResult.foundIndex;
        this.setCursorSelection(entryResult.entry.start);
      }
    }
  }

  public getFormatPart(cursorLocation: number): FormatPartPosition | undefined {
    for (let i = 0, length = this.formatPartList.length; i < length; i++) {
      const formatPartEntry = this.formatPartList[i];
      if (cursorLocation >= formatPartEntry.start && cursorLocation < formatPartEntry.end) {
        if (formatPartEntry.isSeparator) {
          // the assumption here is that there will not be 2 separators in a row which seems reasonable
          const nextFormatPartEntry = this.formatPartList[i + 1];
          this._currentCursorLocation = nextFormatPartEntry.start;
          this.currentPartIndex = i + 1;

          return {
            currentCursorLocation: this._currentCursorLocation,
            formatPartEntry: nextFormatPartEntry,
          };
        }

        this._currentCursorLocation = cursorLocation;
        this.currentPartIndex = i;

        return {
          currentCursorLocation: cursorLocation,
          formatPartEntry,
        };
      }
    }
  }

  private findNextEditableFormatPart(): FormatPartEntryFindResult | undefined {
    for (let i = this.currentPartIndex + 1, length = this.formatPartList.length; i < length; i++) {
      const formatPartEntry = this.formatPartList[i];
      if (formatPartEntry.isSeparator) {
        continue;
      }

      return {
        foundIndex: i,
        entry: formatPartEntry,
      };
    }
  }

  private findPreviousEditableFormatPart(): FormatPartEntryFindResult | undefined {
    for (let i = this.currentPartIndex - 1; i >= 0; i--) {
      const formatPartEntry = this.formatPartList[i];
      if (formatPartEntry.isSeparator) {
        continue;
      }

      return {
        foundIndex: i,
        entry: formatPartEntry,
      };
    }
  }

  private setPartIndexByCursor() {
    for (let i = 0, length = this.formatPartList.length; i < length; i++) {
      const formatPartEntry = this.formatPartList[i];
      if (this._currentCursorLocation >= formatPartEntry.start && this._currentCursorLocation <= formatPartEntry.end) {
        if (formatPartEntry.isSeparator) {
          // the assumption here is that there will not be 2 separators in a row which seems reasonable
          const nextFormatPartEntry = this.formatPartList[i + 1];
          this._currentCursorLocation = nextFormatPartEntry.start;
          this.currentPartIndex = i + 1;
          break;
        }

        this.currentPartIndex = i;
        break;
      }
    }
  }

  private createNavigationObjects() {
    if (this.inputElement) {
      this.inputSelection = window.getSelection();
      this.inputRange = document.createRange();
      this.inputSelection?.removeAllRanges();
      this.inputRange.selectNodeContents(this.inputElement);
      this.inputRange.collapse(true);
      this.inputSelection?.removeAllRanges();
      this.inputSelection?.addRange(this.inputRange);

      if (this.inputElement.firstChild) {
        this.textNode = this.inputElement.firstChild;
      }
    }
  }
}
