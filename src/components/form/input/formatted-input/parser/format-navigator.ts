import { InputFormat } from '../formats/input-format.interfaces';
import { FormatInstanceCollection } from './format-instance-collection';
import { InputSlotCollection } from './input-slot-collection';
import { FormatPartEntry } from './parser.interfaces';
import { PartEntryCreator } from './part-entry-creator';

export class FormatNavigator {
  private readonly instanceCollection: FormatInstanceCollection;
  private readonly formatPartList: FormatPartEntry[];
  private readonly inputSlotCollection: InputSlotCollection;

  private currentPartIndex = 0;
  private currentCursorPosition = 0;

  private inputElement?: HTMLElement;
  private inputSelection: Selection | null = null;
  private inputRange?: Range;
  private textNode?: Node;

  constructor(format: InputFormat, instanceId: string) {
    this.instanceCollection = FormatInstanceCollection.getInstance();
    this.formatPartList = PartEntryCreator.create(format);
    this.inputSlotCollection = this.instanceCollection.getInputSlotInstance(instanceId, format);
  }

  public getCursorPosition(): number {
    return this.currentCursorPosition;
  }

  public getCurrentPartIndex(): number {
    return this.currentPartIndex;
  }

  public setInputElement(element: HTMLElement) {
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

  /**
   * Called when the mouse is clicked in the input element; this gets the cursor position of where the mouse was
   * clicked, or the last typed character.
   */
  public findCursorPosition() {
    const range = window.getSelection()?.getRangeAt(0);
    if (this.inputElement && range) {
      const treeWalker = document.createTreeWalker(this.inputElement, NodeFilter.SHOW_TEXT, (node) => {
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);
        return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      });

      let cursorPosition = 0;
      while (treeWalker.nextNode()) {
        cursorPosition += treeWalker.currentNode.textContent?.length || 0;
      }

      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        cursorPosition += range.startOffset;
      }

      const lastDataSlot = this.inputSlotCollection.getLastSlotWithData();
      const maximumLength = lastDataSlot.startPosition + lastDataSlot.partText.length;
      this.setCursorSelection(cursorPosition > maximumLength ? maximumLength : cursorPosition);
    }
  }

  public isAtLastPart(): boolean {
    return this.currentPartIndex === this.formatPartList.length - 1;
  }

  public moveHome(): void {
    // instead of moving the cursor to the beginning of the input element, we move the cursor to the start position of
    // the first input slot. this is useful in cases where the first format part is a separator.
    const firstSlot = this.inputSlotCollection.getFirstSlot();
    this.setCursorSelection(firstSlot.startPosition);
  }

  public moveEnd(): void {
    const lastDataSlot = this.inputSlotCollection.getLastSlotWithData();
    const lastCursorPosition = lastDataSlot.startPosition + lastDataSlot.partText.length;
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
    const lastDataSlot = this.inputSlotCollection.getLastSlotWithData();
    const lastCursorPosition = lastDataSlot.startPosition + lastDataSlot.partText.length;
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

  public moveToNextInputPart() {
    if (this.currentPartIndex < this.formatPartList.length - 1) {
      const partEntry = this.findNextEditablePart();
      if (partEntry) {
        this.currentPartIndex = partEntry.partIndex;
        this.setCursorSelection(partEntry.startPosition);
      }
    }
  }

  public moveToPreviousInputPart() {
    if (this.currentPartIndex > 0) {
      const partEntry = this.findPreviousEditablePart();
      if (partEntry) {
        this.currentPartIndex = partEntry.partIndex;
        this.setCursorSelection(partEntry.endPosition);
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
      this.inputSelection?.addRange(this.inputRange);

      if (this.inputElement.firstChild) {
        this.textNode = this.inputElement.firstChild;
      }
    }
  }
}
