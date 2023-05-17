import { InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputRuleProcessor } from './input-rule-processor';
import { InputSlotCollection } from './input-slot-collection';
import { KeyProcessor } from './key-processor';
import { FormatCompleteEvent } from './parser.interfaces';

/**
 * This is the entry point for the format module.
 */
export class FormatParser {
  private readonly keyProcessor: KeyProcessor;
  private readonly formatNavigator: FormatNavigator;
  private readonly formatRenderer: FormatRenderer;
  private readonly inputSlotCollection: InputSlotCollection;
  private readonly inputRuleProcessor: InputRuleProcessor;

  private inputElementSet = false;
  private inputElement?: HTMLElement;
  private onFormatComplete?: FormatCompleteEvent;

  constructor(format: InputFormat, private inputValue = '') {
    this.keyProcessor = new KeyProcessor(format);
    this.formatNavigator = FormatNavigator.getInstance(format);
    this.formatRenderer = new FormatRenderer(format);
    this.inputSlotCollection = InputSlotCollection.getInstance(format);
    this.inputRuleProcessor = new InputRuleProcessor(format);
  }

  /**
   * When the input element is created, this method is called, so it can be set to all the classes that need it.
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
   * Called when the input element gains focus. This method renders the current data and sets the cursor to its current
   * or saved position.
   */
  public inputFocused(): void {
    this.formatRenderer.render();
    setTimeout(() => this.formatNavigator.setCursorToCurrentPosition());
  }

  /**
   * When an input value is passed this is called to load the value into the formatter.
   * @param {string} inputValue - The value to load into the formatter.
   */
  public inputValuePassed(inputValue: string): void {
    this.inputValue = inputValue;
    if (this.inputElementSet && this.inputValue.length > 0) {
      this.inputRuleProcessor.processInputValue(inputValue);
      // setTimeout is used because this is usually called after the input element has been created. This is a good
      // article to explain why this is necessary https://web.dev/rendering-performance/.
      setTimeout(() => {
        this.formatRenderer.render();
        this.formatNavigator.setCursorToCurrentPosition();
      });
    }
  }

  /**
   * Registers the "event" that is triggered when all input slots are completed.
   * @param {FormatCompleteEvent} onFormatComplete - The event to call when all input slots are completed.
   */
  public registerFormatCompleteEvent(onFormatComplete: FormatCompleteEvent): void {
    this.onFormatComplete = onFormatComplete;
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
      if (this.inputSlotCollection.allSlotsCompleted() && this.inputElement && this.onFormatComplete) {
        // here fire an event to notify the user that the input is complete
        this.onFormatComplete(this.inputElement.innerHTML);
      }
    }
  }
}
