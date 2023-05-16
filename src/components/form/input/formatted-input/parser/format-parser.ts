import { InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputRuleProcessor } from './input-rule-processor';
import { InputSlotCollection } from './input-slot-collection';
import { KeyProcessor } from './key-processor';
import { FormatCompleteEvent } from './parser.interfaces';

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

  public inputElementCreated(element: HTMLElement): void {
    this.keyProcessor.setInputElement(element);
    this.formatNavigator.setInputElement(element);
    this.formatRenderer.setInputElement(element);
    this.inputElement = element;
    this.inputElementSet = true;

    if (this.inputElementSet && this.inputValue.length > 0) {
      this.inputValuePassed(this.inputValue);
    }
  }

  public inputFocused(): void {
    this.formatRenderer.render();
    setTimeout(() => this.formatNavigator.setCursorToCurrentPosition());
  }

  public inputValuePassed(inputValue: string): void {
    this.inputValue = inputValue;
    if (this.inputElementSet && this.inputValue.length > 0) {
      this.inputRuleProcessor.processInputValue(inputValue);
      setTimeout(() => this.formatRenderer.render());
    }
  }

  public registerFormatCompleteEvent(onFormatComplete: FormatCompleteEvent): void {
    this.onFormatComplete = onFormatComplete;
  }

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
