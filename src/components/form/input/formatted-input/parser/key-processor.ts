import { InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputRuleProcessor } from './input-rule-processor';
import { KeyTypeChecker } from './key-type-checker';
import { MovementKeyboardEvent } from './parser.interfaces';

export class KeyProcessor {
  private readonly formatNavigator: FormatNavigator;
  private readonly ruleProcessor: InputRuleProcessor;
  private readonly keyTypeChecker: KeyTypeChecker;
  private readonly formatRenderer: FormatRenderer;

  constructor(private format: InputFormat) {
    this.formatNavigator = FormatNavigator.getInstance(format);
    this.ruleProcessor = new InputRuleProcessor(format);
    this.keyTypeChecker = new KeyTypeChecker();
    this.formatRenderer = new FormatRenderer(format);
  }

  public setInputElement(element: HTMLElement): void {
    this.ruleProcessor.setInputElement(element);
    this.formatRenderer.setInputElement(element);
  }

  public processMovementKey(event: MovementKeyboardEvent) {
    const { key, metaKey } = event;
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
      case 'Home':
        this.formatNavigator.moveHome();
        break;
      case 'End':
        this.formatNavigator.moveEnd();
        break;
    }
  }

  /**
   * Processes the keypress event and returns true if the key pressed results in a format change.
   * @param {KeyboardEvent} event - The key event to process.
   * @returns {boolean} True if the key pressed results in a format change.
   */
  public processKeyPress(event: KeyboardEvent) {
    if (this.keyTypeChecker.isIgnoreKey(event)) {
      return false;
    }

    if (this.keyTypeChecker.isMovementKey(event)) {
      this.processMovementKey(event);
      return false;
    }

    this.ruleProcessor.processKeyPress(event);
    return true;
  }
}
