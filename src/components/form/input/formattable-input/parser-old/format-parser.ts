import { IDisposable } from '../../../../common-interfaces';
import { InputFormat } from '../formats/input-format.interfaces';
import { FormatCreator } from './format-creator';
import { FormatInputProcessor } from './format-input-processor';
import { FormatKeyProcessor } from './format-key-processor';
import { FormatNavigator } from './format-navigator';

export class FormatParser implements IDisposable {
  private readonly formatProcessor: FormatKeyProcessor;
  private readonly inputProcessor: FormatInputProcessor;
  private readonly formatNavigator: FormatNavigator;
  private inputElement: HTMLElement | undefined;

  constructor(private format: InputFormat, private inputValue = '') {
    this.formatProcessor = new FormatKeyProcessor(format);
    this.inputProcessor = new FormatInputProcessor(format);
    this.formatNavigator = FormatNavigator.getServiceInstance(format);
  }

  public inputElementCreated(element: HTMLElement) {
    this.inputElement = element;
    this.formatProcessor.setInputElement(element);
    this.formatNavigator.setInputElement(element);
  }

  public inputFocused() {
    if (this.inputElement) {
      this.inputElement.innerHTML = this.inputProcessor.processInputValue(this.inputValue);
      this.formatNavigator.setCursorToCurrentLocation();
    }
  }

  public mouseClicked(event: MouseEvent) {
    console.log('mouse event', event);
  }

  public keyDownHandler(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.formatProcessor.isIgnoreKey(event)) {
      return;
    }

    if (this.formatProcessor.isMovementKey(event)) {
      this.formatProcessor.processMovementKey(event);
      return;
    }

    if (this.inputElement) {
      const cursorLocation = this.formatNavigator.getCursorLocation();
      const keyValid = this.formatProcessor.isKeyPressValid(event);
      if (keyValid.isValid) {
        const nextCursorPosition = keyValid.newCursorLocation;
        if (nextCursorPosition > this.inputValue.length) {
          this.inputValue += keyValid.key;
        } else {
          this.inputValue =
            this.inputValue.substring(0, cursorLocation) + keyValid.key + this.inputValue.substring(cursorLocation);
        }

        this.inputElement.innerHTML = this.inputProcessor.processInputValue(this.inputValue);
        this.formatNavigator.setCursorPosition(nextCursorPosition);
      }
    }
  }

  public dispose() {
    // dispose of items here
  }
}
