import { InputFormat } from '../input-format.interfaces';
import { FormatInstanceCollection, FormatInstanceCollectionManager } from './format-instance-collection';
import { InputSlotCollection } from './input-slot-collection';
import { FormatPartEntry } from './parser.interfaces';
import { PartEntryCreator } from './part-entry-creator';

export class FormatNavigator {
  private readonly instanceCollection: FormatInstanceCollection;
  private readonly formatPartList: FormatPartEntry[];
  private readonly inputSlotCollection: InputSlotCollection;

  private currentPartIndex = 0;
  private currentPartIndices: Array<number> = [];
  private currentCursorPosition = 0;
  private highlightCursorPosition = 0;
  private currentCursorStartPosition = -1;
  private currentCursorEndPosition = -1;

  private inputElement?: HTMLElement;
  private inputSelection: Selection | null = null;
  private inputRange?: Range;
  private textNode?: Node;

  constructor(format: InputFormat, instanceId: string) {
    this.instanceCollection = FormatInstanceCollectionManager.getInstance();
    this.formatPartList = PartEntryCreator.create(format);
    this.inputSlotCollection = this.instanceCollection.getInputSlotInstance(instanceId, format);
  }

  public get isSelection() {
    return this.inputRange !== undefined && this.inputRange.startOffset !== this.inputRange.endOffset;
  }

  public get isAllSelected() {
    const lastSlot = this.inputSlotCollection.getLastSlot();
    return this.isSelection && this.inputRange?.startOffset === 0 && this.inputRange.endOffset === lastSlot.endPosition;
  }

  public getCursorPosition() {
    return this.currentCursorPosition;
  }

  public getCursorStartPosition() {
    return this.currentCursorStartPosition;
  }

  public getCursorEndPosition() {
    return this.currentCursorEndPosition;
  }

  public getCurrentPartIndex() {
    return this.currentPartIndex;
  }

  public getCurrentPartIndices() {
    return this.currentPartIndices;
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

      this.currentPartIndices = [];
      if (end === undefined || start === end) {
        this.currentCursorPosition = end || start;
        this.highlightCursorPosition = end || start;
        this.currentCursorStartPosition = -1;
        this.currentCursorEndPosition = -1;
        this.setPartIndexByCursorPosition();
      } else {
        if (start < end) {
          if (this.currentCursorStartPosition !== start) {
            this.highlightCursorPosition = start;
          } else if (this.currentCursorEndPosition !== end) {
            this.highlightCursorPosition = end;
          }

          this.currentCursorStartPosition = start;
          this.currentCursorEndPosition = end;
        } else {
          if (this.currentCursorStartPosition !== end) {
            this.highlightCursorPosition = end;
          } else if (this.currentCursorEndPosition !== start) {
            this.highlightCursorPosition = start;
          }

          this.currentCursorStartPosition = end;
          this.currentCursorEndPosition = start;
        }

        this.currentCursorPosition = -1;
        this.setPartIndexByHighlightPosition();
        this.setPartIndicesByCursorPositions();
      }
    }
  }

  /**
   * Called when the mouse is clicked in the inputs element; this gets the cursor position of where the mouse was
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

      if (range.startOffset === range.endOffset) {
        this.setCursorSelection(cursorPosition > maximumLength ? maximumLength : cursorPosition);
      } else {
        this.setCursorSelection(range.startOffset, range.endOffset);
      }
    }
  }

  public isAtLastPart(): boolean {
    return this.currentPartIndex === this.formatPartList.length - 1;
  }

  /**
   * Moves the cursor to the first position that can accept input.
   */
  public moveHome(): void {
    // instead of moving the cursor to the beginning of the inputs element, we move the cursor to the start position of
    // the first inputs slot. this is useful in cases where the first format part is a separator.
    const firstSlot = this.inputSlotCollection.getFirstSlot();
    this.setCursorSelection(firstSlot.startPosition);
  }

  /**
   * Moves the cursor to the end of the entered text.
   */
  public moveEnd(): void {
    const lastDataSlot = this.inputSlotCollection.getLastSlotWithData();
    const lastCursorPosition = lastDataSlot.startPosition + lastDataSlot.partText.length;
    this.setCursorSelection(lastCursorPosition);
  }

  /**
   * Moves the cursor one position to the left skipping over any placeholders.
   */
  public moveCursorLeft() {
    this.updateCursorPosition();

    if (this.currentCursorPosition > 0 && !this.isSelection) {
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

            break;
          }
        }
      }
    } else {
      if (!this.isSelection) {
        // this is done in the case where text is highlighted all the way to the start, the cursor position still needs
        // to be set to make the highlight disappear
        this.moveHome();
      } else {
        this.setCursorSelection(this.currentCursorPosition);
      }
    }
  }

  /**
   * Moves the cursor one position to the right skipping over any placeholders.
   */
  public moveCursorRight() {
    this.updateCursorPosition(false);

    const lastDataSlot = this.inputSlotCollection.getLastSlotWithData();
    const lastCursorPosition = lastDataSlot.startPosition + lastDataSlot.partText.length;
    if (this.currentCursorPosition < lastCursorPosition && !this.isSelection) {
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

            break;
          }
        }
      }
    } else {
      // this is done in the case where text is highlighted all the way to the end, the cursor position still needs to
      // be set to make the highlight disappear
      this.setCursorSelection(this.currentCursorPosition);
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

  /**
   * Highlights everything in the input.
   */
  public highlightAll() {
    const endPosition = this.formatPartList[this.formatPartList.length - 1].endPosition;
    this.setCursorSelection(0, endPosition);
  }

  /**
   * Either starts or makes the highlight grow to the left or decreases the highlight from the right.
   */
  public moveHighlightLeft() {
    this.updateHighlightPositions();

    const shouldDecreaseHighlight = this.highlightCursorPosition > this.currentCursorStartPosition;

    if (this.currentCursorStartPosition > 0 || shouldDecreaseHighlight) {
      let newStartCursorPosition = !shouldDecreaseHighlight
        ? this.currentCursorStartPosition - 1
        : this.currentCursorStartPosition;
      let newEndCursorPosition = shouldDecreaseHighlight
        ? this.highlightCursorPosition - 1
        : this.currentCursorEndPosition;
      let currentPartEntry = this.formatPartList[this.currentPartIndex];
      if (
        (newStartCursorPosition >= currentPartEntry.startPosition &&
          newStartCursorPosition <= currentPartEntry.endPosition) ||
        (shouldDecreaseHighlight &&
          newEndCursorPosition >= currentPartEntry.startPosition &&
          newEndCursorPosition <= currentPartEntry.endPosition)
      ) {
        this.setCursorSelection(newStartCursorPosition, newEndCursorPosition);
      } else {
        for (let i = this.currentPartIndex - 1; i >= 0; i--) {
          currentPartEntry = this.formatPartList[i];
          if (
            (newStartCursorPosition >= currentPartEntry.startPosition &&
              newStartCursorPosition <= currentPartEntry.endPosition) ||
            (shouldDecreaseHighlight &&
              newEndCursorPosition >= currentPartEntry.startPosition &&
              newEndCursorPosition <= currentPartEntry.endPosition)
          ) {
            if (currentPartEntry.isSeparator) {
              if (!shouldDecreaseHighlight) {
                newStartCursorPosition = this.formatPartList[i - 1].endPosition - 1;
              } else {
                newEndCursorPosition = this.formatPartList[i - 1].endPosition - 1;
              }

              this.setCursorSelection(newStartCursorPosition, newEndCursorPosition);
            } else {
              this.setCursorSelection(newStartCursorPosition, newEndCursorPosition);
            }

            break;
          }
        }
      }
    }
  }

  /**
   * Either starts or makes the highlight grow to the right or decreases the highlight from the left.
   */
  public moveHighlightRight() {
    this.updateHighlightPositions();

    const lastDataSlot = this.inputSlotCollection.getLastSlotWithData();
    const lastCursorPosition = lastDataSlot.startPosition + lastDataSlot.partText.length;
    const shouldDecreaseHighlight = this.highlightCursorPosition < this.currentCursorEndPosition;

    if (this.currentCursorEndPosition < lastCursorPosition || shouldDecreaseHighlight) {
      let newStartCursorPosition = shouldDecreaseHighlight
        ? this.highlightCursorPosition + 1
        : this.currentCursorStartPosition;
      let newEndCursorPosition = !shouldDecreaseHighlight
        ? this.currentCursorEndPosition + 1
        : this.currentCursorEndPosition;
      let currentPartEntry = this.formatPartList[this.currentPartIndex];
      if (
        (newEndCursorPosition >= currentPartEntry.startPosition &&
          newEndCursorPosition <= currentPartEntry.endPosition) ||
        (shouldDecreaseHighlight &&
          newStartCursorPosition >= currentPartEntry.startPosition &&
          newStartCursorPosition <= currentPartEntry.endPosition)
      ) {
        this.setCursorSelection(newStartCursorPosition, newEndCursorPosition);
      } else {
        for (let i = this.currentPartIndex + 1, length = this.formatPartList.length; i < length; i++) {
          currentPartEntry = this.formatPartList[i];
          if (
            (newEndCursorPosition >= currentPartEntry.startPosition &&
              newEndCursorPosition <= currentPartEntry.endPosition) ||
            (shouldDecreaseHighlight &&
              newStartCursorPosition >= currentPartEntry.startPosition &&
              newStartCursorPosition <= currentPartEntry.endPosition)
          ) {
            if (currentPartEntry.isSeparator) {
              if (!shouldDecreaseHighlight) {
                newEndCursorPosition = this.formatPartList[i + 1].startPosition + 1;
              } else {
                newStartCursorPosition = this.formatPartList[i + 1].startPosition + 1;
              }

              this.setCursorSelection(newStartCursorPosition, newEndCursorPosition);
            } else {
              this.setCursorSelection(newStartCursorPosition, newEndCursorPosition);
            }

            break;
          }
        }
      }
    }
  }

  /**
   * When starting a highlight operation this method will transfer the current cursor position to the cursor start and
   * end positions.
   * @private
   */
  private updateHighlightPositions() {
    if (
      this.currentCursorStartPosition === -1 &&
      this.currentCursorEndPosition === -1 &&
      this.currentCursorPosition > -1
    ) {
      this.currentCursorStartPosition = this.currentCursorPosition;
      this.currentCursorEndPosition = this.currentCursorPosition;
      this.highlightCursorPosition = this.currentCursorPosition;
    }
  }

  /**
   * When leaving a highlight operation this method will transfer either the highlight start or end position to the
   * current cursor position.
   * @param startPosition - Determines if the start or end position is transferred to the cursor position (default: true).
   * @private
   */
  private updateCursorPosition(startPosition = true) {
    if (
      this.currentCursorPosition === -1 &&
      this.currentCursorStartPosition > -1 &&
      this.currentCursorEndPosition > -1
    ) {
      if (startPosition) {
        this.currentCursorPosition = this.currentCursorStartPosition;
      } else {
        this.currentCursorPosition = this.currentCursorEndPosition;
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

  private setPartIndexByHighlightPosition() {
    for (let i = 0; i < this.formatPartList.length; i++) {
      const formatPart = this.formatPartList[i];
      if (
        this.highlightCursorPosition >= formatPart.startPosition &&
        this.highlightCursorPosition <= formatPart.endPosition
      ) {
        if (formatPart.isSeparator) {
          this.highlightCursorPosition = this.formatPartList[i + 1].startPosition;
          this.currentPartIndex = i + 1;
          break;
        }

        this.currentPartIndex = i;
        break;
      }
    }
  }

  private setPartIndicesByCursorPositions() {
    for (let i = 0, length = this.formatPartList.length; i < length; i++) {
      const formatPart = this.formatPartList[i];

      if (formatPart.isSeparator) {
        continue;
      }

      if (
        (formatPart.startPosition >= this.currentCursorStartPosition &&
          formatPart.startPosition <= this.currentCursorEndPosition) ||
        (formatPart.endPosition >= this.currentCursorStartPosition &&
          formatPart.endPosition <= this.currentCursorEndPosition) ||
        (formatPart.startPosition < this.currentCursorStartPosition &&
          formatPart.endPosition > this.currentCursorEndPosition)
      ) {
        this.currentPartIndices.push(i);
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
