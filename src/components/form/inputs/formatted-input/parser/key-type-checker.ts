import { EditingKeyboardEvent, MovementKeyboardEvent } from './parser.interfaces';

/**
 * Determines the type of key that was pressed.
 */
export class KeyTypeChecker {
  private numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private movementKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  private editingKeys = ['Backspace', 'Delete'];
  private ignoreKeys = ['Shift', 'Alt', 'Control', 'Fn', 'Meta'];

  public isNumberKey(key: string): boolean {
    return this.numberKeys.includes(key);
  }

  /**
   * This is a type guard for a movement key press event.
   * @param {KeyboardEvent} event - The event to limit to a certain number of keys.
   * @returns {event is MovementKeyboardEvent} Specifies the type used when method returns true.
   */
  public isMovementKey(event: KeyboardEvent): event is MovementKeyboardEvent {
    return this.movementKeys.includes(event.key);
  }

  /**
   * This is a type guard for an editing key press event.
   * @param {KeyboardEvent} event - The event to limit to a certain number of keys.
   * @returns {event is EditingKeyboardEvent} Specifies the type used when method returns true.
   */
  public isEditingKey(event: KeyboardEvent): event is EditingKeyboardEvent {
    return this.editingKeys.includes(event.key);
  }

  public isIgnoreKey(event: KeyboardEvent) {
    return this.ignoreKeys.includes(event.key);
  }
}
