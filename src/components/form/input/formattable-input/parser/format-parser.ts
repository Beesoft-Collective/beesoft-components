import { InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputSlotCollection } from './input-slot-collection';
import { KeyProcessor } from './key-processor';

export class FormatParser {
  private readonly keyProcessor: KeyProcessor;
  private readonly formatNavigator: FormatNavigator;
  private readonly formatRenderer: FormatRenderer;
  private readonly inputSlotCollection: InputSlotCollection;

  constructor(format: InputFormat, private inputValue = '') {
    this.keyProcessor = new KeyProcessor(format);
    this.formatNavigator = FormatNavigator.getInstance(format);
    this.formatRenderer = new FormatRenderer(format);
    this.inputSlotCollection = InputSlotCollection.getInstance(format);
  }

  public inputElementCreated(element: HTMLElement): void {
    this.keyProcessor.setInputElement(element);
    this.formatNavigator.setInputElement(element);
    this.formatRenderer.setInputElement(element);
  }

  public inputFocused(): void {
    this.formatRenderer.render();
    setTimeout(() => this.formatNavigator.setCursorToCurrentPosition());
  }

  public keyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.keyProcessor.processKeyPress(event);
    if (this.inputSlotCollection.allSlotsCompleted()) {
      // here fire an event to notify the user that the input is complete
      console.log('input format complete');
    }
  }
}
