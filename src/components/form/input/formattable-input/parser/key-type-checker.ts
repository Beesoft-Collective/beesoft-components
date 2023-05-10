import { EditingKeyboardEvent, MovementKeyboardEvent } from './parser.interfaces';

export class KeyTypeChecker {
  private numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private movementKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
  private editingKeys = ['Backspace', 'Delete'];
  private ignoreKeys = ['Shift', 'Alt', 'Control', 'Fn', 'Meta'];

  public isNumberKey(key: string): boolean {
    return this.numberKeys.includes(key);
  }

  public isMovementKey(event: KeyboardEvent): event is MovementKeyboardEvent {
    return this.movementKeys.includes(event.key);
  }

  public isEditingKey(event: KeyboardEvent): event is EditingKeyboardEvent {
    return this.editingKeys.includes(event.key);
  }

  public isIgnoreKey(event: KeyboardEvent) {
    return this.ignoreKeys.includes(event.key);
  }
}
