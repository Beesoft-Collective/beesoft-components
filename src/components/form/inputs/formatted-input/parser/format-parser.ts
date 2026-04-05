import { v4 as uuidV4 } from 'uuid';
import { IDisposable } from '../../../../common-interfaces';
import { InputFormat } from '../input-format.interfaces';
import { FormatInstanceCollection, FormatInstanceCollectionManager } from './format-instance-collection';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputRuleProcessor } from './input-rule-processor';
import { InputSlotCollection } from './input-slot-collection';
import { KeyProcessor } from './key-processor';
import { FormatChangeEvent, SlotChangeEvent } from './parser.interfaces';

/**
 * This is the entry point for the format module.
 */
export class FormatParser implements IDisposable {
  private readonly instanceId: string;
  private readonly instanceCollection: FormatInstanceCollection;
  private readonly keyProcessor: KeyProcessor;
  private readonly formatNavigator: FormatNavigator;
  private readonly formatRenderer: FormatRenderer;
  private readonly inputSlotCollection: InputSlotCollection;
  private readonly inputRuleProcessor: InputRuleProcessor;

  private previousOutputValue? = '';
  private inputElementSet = false;
  private isInputFocused = false;
  private currentSlotPosition = -1;
  private inputElement?: HTMLElement;
  private onFormatChange?: FormatChangeEvent;
  private onSlotChange?: SlotChangeEvent;

  constructor(
    format: InputFormat,
    private inputValue = ''
  ) {
    this.instanceId = uuidV4();
    this.instanceCollection = FormatInstanceCollectionManager.getInstance();
    this.keyProcessor = new KeyProcessor(format, this.instanceId);
    this.formatNavigator = this.instanceCollection.getNavigatorInstance(this.instanceId, format);
    this.formatRenderer = new FormatRenderer(format, this.instanceId);
    this.inputSlotCollection = this.instanceCollection.getInputSlotInstance(this.instanceId, format);
    this.inputRuleProcessor = new InputRuleProcessor(format, this.instanceId);
  }

  /**
   * When the inputs element is created, this method is called, so it can be set to all the classes that need it.
   * @param {HTMLElement} element - The content editable element.
   */
  public inputElementCreated(element: HTMLElement): void {
    this.keyProcessor.setInputElement(element);
    this.formatNavigator.setInputElement(element);
    this.formatRenderer.setInputElement(element);
    this.inputElement = element;
    this.inputElementSet = true;

    if (this.inputElementSet && this.inputValue.length > 0) {
      // if there is a passed in value, call the method used to load it into the formatter.
      this.inputValuePassed(this.inputValue);
    }
  }

  /**
   * Called when the inputs element gains focus. This method renders the current data and sets the cursor to its current
   * or saved position.
   */
  public inputFocused(): void {
    this.isInputFocused = true;
    this.formatRenderer.render();
    setTimeout(() => {
      this.fireOnSlotChange();
    });
  }

  public inputBlurred(): void {
    this.isInputFocused = false;
  }

  /**
   * When an inputs value is passed this is called to load the value into the formatter.
   * @param {string} inputValue - The value to load into the formatter.
   */
  public inputValuePassed(inputValue: string) {
    this.inputValue = inputValue;
    if (this.inputElementSet) {
      if (this.inputValue.length > 0) {
        this.inputRuleProcessor.processInputValue(inputValue);
      } else {
        this.inputSlotCollection.clearAllSlots();
        this.previousOutputValue = undefined;
      }

      this.renderFormat();
    }
  }

  public pastedValue(value: string) {
    if (value.length > 0) {
      if (!this.formatNavigator.isSelection) {
        if (this.inputValue.length === 0) {
          this.inputValuePassed(value);
        } else {
          this.inputRuleProcessor.processPastedValue(value);
        }
      } else {
        if (this.formatNavigator.isAllSelected) {
          this.inputValuePassed(value);
        } else {
          this.inputRuleProcessor.processPastedValue(value, true);
        }
      }

      this.renderFormat(true);
    }
  }

  /**
   * Registers the "event" that is triggered when all inputs slots are completed.
   * @param {FormatChangeEvent} onFormatChange - The event to call when all inputs slots are completed.
   */
  public registerFormatChangeEvent(onFormatChange: FormatChangeEvent) {
    this.onFormatChange = onFormatChange;
  }

  /**
   * Registers the "event" that is triggered when the cursor has moved to a new slot.
   * @param onSlotChange
   */
  public registerSlotChangeEvent(onSlotChange: SlotChangeEvent) {
    this.onSlotChange = onSlotChange;
  }

  public mouseUpHandler(): void {
    this.formatNavigator.findCursorPosition();
    this.fireOnSlotChange();
  }

  /**
   * The main entry for the key press event.
   * @param {KeyboardEvent} event - The event for the formatter to process.
   */
  public keyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      return;
    }

    // this will allow the value in the formatted input to be copied
    if (
      !(event.key === 'c' && (event.ctrlKey || event.metaKey)) &&
      !(event.key === 'x' && (event.ctrlKey || event.metaKey)) &&
      !(event.key === 'v' && (event.ctrlKey || event.metaKey))
    ) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      return;
    }

    if (this.keyProcessor.processKeyPress(event)) {
      if (this.inputElement && this.onFormatChange) {
        if (this.inputSlotCollection.allSlotsCompleted() && this.previousOutputValue !== this.inputElement.innerHTML) {
          // here fire an event to notify the user that the inputs is complete
          this.previousOutputValue = this.inputElement.innerHTML;
          this.onFormatChange(this.inputElement.innerHTML);
        } else if (this.inputSlotCollection.allSlotsEmpty() && this.previousOutputValue !== undefined) {
          // here fire an event to notify the user that the inputs is empty...this is needed so a fields value can be
          // removed
          this.previousOutputValue = undefined;
          this.onFormatChange();
        }
      }
    }

    this.fireOnSlotChange();
  }

  public dispose(): void {
    // dispose of static class instances
    this.instanceCollection.removeInstances(this.instanceId);
  }

  private fireOnSlotChange() {
    const cursorPosition = this.formatNavigator.getCursorPosition();
    const newSlotPosition = this.inputSlotCollection.getSlotPosition(cursorPosition);
    console.log('cursor', cursorPosition, 'slot', newSlotPosition, 'current', this.currentSlotPosition);
    if (newSlotPosition !== this.currentSlotPosition) {
      this.currentSlotPosition = newSlotPosition;
      const currentSlot = this.inputSlotCollection.getSlotFromCursorPosition(cursorPosition);
      if (currentSlot && this.onSlotChange) {
        this.onSlotChange(currentSlot);
      }
    }
  }

  private renderFormat(fireOnChange = false) {
    // setTimeout is used because this is usually called after the inputs element has been created. This is a good
    // article to explain why this is necessary https://web.dev/rendering-performance/.
    setTimeout(() => {
      this.formatRenderer.render();
      if (this.isInputFocused) {
        this.formatNavigator.setCursorToCurrentPosition();
      }

      if (this.inputValue.length > 0) {
        this.previousOutputValue = this.inputElement?.innerHTML;
      }

      if (fireOnChange && this.inputElement?.innerHTML && this.onFormatChange) {
        this.onFormatChange(this.inputElement.innerHTML);
      }

      this.fireOnSlotChange();
    });
  }
}
