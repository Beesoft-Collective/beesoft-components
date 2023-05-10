import { InputFormat } from '../formats/input-format.interfaces';
import { InputSlotCollection } from './input-slot-collection';
import { FormatPartEntry } from './parser.interfaces';
import { PartEntryCreator } from './part-entry-creator';

export class FormatNavigator {
  private static _instance: FormatNavigator;

  private readonly formatPartList: FormatPartEntry[];
  private readonly inputSlotCollection: InputSlotCollection;

  private currentPartIndex = 0;
  private currentCursorPosition = 0;

  private inputElement?: HTMLInputElement;
  private inputSelection: Selection | null = null;
  private inputRange?: Range;
  private textNode?: Node;

  private constructor(private format: InputFormat) {
    this.formatPartList = PartEntryCreator.create(format);
    this.inputSlotCollection = InputSlotCollection.getInstance(format);
  }

  public static getInstance(format: InputFormat): FormatNavigator {
    if (!this._instance) {
      this._instance = new FormatNavigator(format);
    }

    return this._instance;
  }

  public getCursorPosition(): number {
    return this.currentCursorPosition;
  }

  public getCurrentPartIndex(): number {
    return this.currentPartIndex;
  }

  public setInputElement(element: HTMLInputElement) {
    this.inputElement = element;
  }

  public setCursorToCurrentPosition() {
    this.setCursorSelection(this.currentCursorPosition);
  }

  public setCursorPosition(position: number) {
    this.setCursorSelection(position);
  }

  public setCursorSelection(start: number, end?: number): void {
    this.createInputRangeSelection();
    if (this.inputRange && this.textNode) {
      this.inputRange.setStart(this.textNode, start);
      this.inputRange.setEnd(this.textNode, end || start);
      this.currentCursorPosition = end || start;
      this.setPartIndexByCursorPosition();
    }
  }

  public moveHome(): void {
    this.setCursorSelection(0);
  }

  public moveEnd(): void {
    const incompleteSlot = this.inputSlotCollection.getIncompleteSlot();
    const lastCursorPosition = incompleteSlot
      ? incompleteSlot.startPosition + incompleteSlot.partText.length
      : this.formatPartList[this.formatPartList.length - 1].endPosition;
    this.setCursorSelection(lastCursorPosition);
  }

  public moveCursorLeft() {
    if (this.currentCursorPosition > 0) {
      const newCursorPosition = this.currentCursorPosition - 1;
      let currentPartEntry = this.formatPartList[this.currentPartIndex];
      if (newCursorPosition >= currentPartEntry.startPosition && newCursorPosition <= currentPartEntry.endPosition) {
        this.setCursorSelection(newCursorPosition);
      } else {
        for (let i = this.currentPartIndex - 1; i >= 0; i--) {
          currentPartEntry = this.formatPartList[i];
          if (
            newCursorPosition >= currentPartEntry.startPosition &&
            newCursorPosition <= currentPartEntry.endPosition
          ) {
            if (currentPartEntry.isSeparator) {
              this.setCursorSelection(this.formatPartList[i - 1].endPosition);
            } else {
              this.setCursorSelection(newCursorPosition);
            }
          }
        }
      }
    }
  }

  public moveCursorRight() {
    const incompleteSlot = this.inputSlotCollection.getIncompleteSlot();
    const lastCursorPosition = incompleteSlot
      ? incompleteSlot.startPosition + incompleteSlot.partText.length
      : this.formatPartList[this.formatPartList.length - 1].endPosition;
    if (this.currentCursorPosition < lastCursorPosition) {
      const newCursorPosition = this.currentCursorPosition + 1;
      let currentPartEntry = this.formatPartList[this.currentPartIndex];
      if (newCursorPosition >= currentPartEntry.startPosition && newCursorPosition <= currentPartEntry.endPosition) {
        this.setCursorSelection(newCursorPosition);
      } else {
        for (let i = this.currentPartIndex + 1, length = this.formatPartList.length; i < length; i++) {
          currentPartEntry = this.formatPartList[i];
          if (
            newCursorPosition >= currentPartEntry.startPosition &&
            newCursorPosition <= currentPartEntry.endPosition
          ) {
            if (currentPartEntry.isSeparator) {
              this.setCursorSelection(this.formatPartList[i + 1].startPosition);
            } else {
              this.setCursorSelection(newCursorPosition);
            }
          }
        }
      }
    }
  }

  public tabForward() {
    if (this.currentPartIndex < this.formatPartList.length - 1) {
      const partEntry = this.findNextEditablePart();
      if (partEntry) {
        this.currentPartIndex = partEntry.partIndex;
        this.setCursorSelection(partEntry.startPosition);
      }
    }
  }

  public tabBackward() {
    if (this.currentPartIndex > 0) {
      const partEntry = this.findPreviousEditablePart();
      if (partEntry) {
        this.currentPartIndex = partEntry.partIndex;
        this.setCursorSelection(partEntry.startPosition);
      }
    }
  }

  private findNextEditablePart() {
    return this.inputSlotCollection.getNextSlot(this.currentPartIndex);
  }

  private findPreviousEditablePart() {
    return this.inputSlotCollection.getPreviousSlot(this.currentPartIndex);
  }

  private setPartIndexByCursorPosition() {
    for (let i = 0; i < this.formatPartList.length; i++) {
      const formatPart = this.formatPartList[i];
      if (
        this.currentCursorPosition >= formatPart.startPosition &&
        this.currentCursorPosition <= formatPart.endPosition
      ) {
        if (formatPart.isSeparator) {
          this.currentCursorPosition = this.formatPartList[i + 1].startPosition;
          this.currentPartIndex = i + 1;
          break;
        }

        this.currentPartIndex = i;
        break;
      }
    }
  }

  private createInputRangeSelection() {
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
