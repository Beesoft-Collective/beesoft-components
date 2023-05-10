import { InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { InputRuleProcessor } from './input-rule-processor';
import { KeyTypeChecker } from './key-type-checker';
import { MovementKeyboardEvent } from './parser.interfaces';

export class KeyProcessor {
  private readonly formatNavigator: FormatNavigator;
  private readonly ruleProcessor: InputRuleProcessor;
  private readonly keyTypeChecker: KeyTypeChecker;

  private inputElement?: HTMLInputElement;

  constructor(private format: InputFormat) {
    this.formatNavigator = FormatNavigator.getInstance(format);
    this.ruleProcessor = new InputRuleProcessor(format);
    this.keyTypeChecker = new KeyTypeChecker();
  }

  public setInputElement(element: HTMLInputElement) {
    this.inputElement = element;
  }

  public processMovementKey(event: MovementKeyboardEvent) {
    const { key, metaKey, shiftKey } = event;
    switch (key) {
      case 'ArrowLeft':
        if (!metaKey) {
          this.formatNavigator.moveCursorLeft();
        } else {
          this.formatNavigator.moveHome();
        }

        break;
      case 'ArrowRight':
        if (!metaKey) {
          this.formatNavigator.moveCursorRight();
        } else {
          this.formatNavigator.moveEnd();
        }

        break;
      case 'Tab':
        if (!shiftKey) {
          this.formatNavigator.tabForward();
        } else {
          this.formatNavigator.tabBackward();
        }

        break;
      case 'Home':
        this.formatNavigator.moveHome();
        break;
      case 'End':
        this.formatNavigator.moveEnd();
        break;
    }
  }

  public processKeyPress(event: KeyboardEvent): void {
    if (this.keyTypeChecker.isIgnoreKey(event)) {
      return;
    }

    if (this.keyTypeChecker.isMovementKey(event)) {
      this.processMovementKey(event);
      return;
    }

    this.ruleProcessor.processKeyPress(event);
  }
}
