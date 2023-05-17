import { InputFormat } from '../formats/input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { FormatRenderer } from './format-renderer';
import { InputRuleProcessor } from './input-rule-processor';
import { KeyTypeChecker } from './key-type-checker';
import { MovementKeyboardEvent } from './parser.interfaces';

/**
 * Processes any key press and determines where it needs to be handled.
 */
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

  /**
   * Handles movement key presses.
   * @param {MovementKeyboardEvent} event - A specific movement key event.
   */
  public processMovementKey(event: MovementKeyboardEvent) {
    const { key, metaKey } = event;
    switch (key) {
      case 'ArrowLeft':
        if (!metaKey) {
          // move the cursor to the left
          this.formatNavigator.moveCursorLeft();
        } else {
          // on Mac home is a combination of the command key and the left arrow key
          this.formatNavigator.moveHome();
        }

        break;
      case 'ArrowRight':
        if (!metaKey) {
          // move the cursor to the right
          this.formatNavigator.moveCursorRight();
        } else {
          // on Mac end is a combination of the command key and the right arrow key
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
   * Processes the keypress event and returns true if the key pressed results in a format change. I'm not a fan of
   * returning true or false to indicate whether the format was changed, so I'm going to fix this later.
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
