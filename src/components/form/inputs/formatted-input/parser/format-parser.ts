import { v4 as uuidV4 } from 'uuid';
import { IDisposable } from '../../../../common-interfaces';
import { InputFormat } from '../input-format.interfaces';
import { FormatInstanceCollection } from './format-instance-collection';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputRuleProcessor } from './input-rule-processor';
import { InputSlotCollection } from './input-slot-collection';
import { KeyProcessor } from './key-processor';
import { FormatChangeEvent } from './parser.interfaces';

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
  private inputElement?: HTMLElement;
  private onFormatChange?: FormatChangeEvent;

  constructor(format: InputFormat, private inputValue = '') {
    this.instanceId = uuidV4();
    this.instanceCollection = FormatInstanceCollection.getInstance();
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
    setTimeout(() => this.formatNavigator.findCursorPosition());
  }

  public inputBlurred(): void {
    this.isInputFocused = false;
  }

  /**
   * When an inputs value is passed this is called to load the value into the formatter.
   * @param {string} inputValue - The value to load into the formatter.
   */
  public inputValuePassed(inputValue: string): void {
    this.inputValue = inputValue;
    if (this.inputElementSet) {
      if (this.inputValue.length > 0) {
        this.inputRuleProcessor.processInputValue(inputValue);
      } else {
        this.inputSlotCollection.clearAllSlots();
        this.previousOutputValue = undefined;
      }

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
      });
    }
  }

  /**
   * Registers the "event" that is triggered when all inputs slots are completed.
   * @param {FormatChangeEvent} onFormatChange - The event to call when all inputs slots are completed.
   */
  public registerFormatChangeEvent(onFormatChange: FormatChangeEvent): void {
    this.onFormatChange = onFormatChange;
  }

  public mouseUpHandler(): void {
    this.formatNavigator.findCursorPosition();
  }

  /**
   * The main entry for the key press event.
   * @param {KeyboardEvent} event - The event for the formatter to process.
   */
  public keyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

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
  }

  public dispose(): void {
    // dispose of static class instances
    this.instanceCollection.removeInstances(this.instanceId);
  }
}
