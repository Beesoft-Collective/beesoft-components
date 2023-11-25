import { FormatPart } from '../input-format.interfaces';

export interface FormatPartEntry extends FormatPart {
  startPosition: number;
  endPosition: number;
}

export interface FormatPartSlot extends FormatPartEntry {
  partIndex: number;
  partText: string;
  isComplete: boolean;
}

export interface KeyPressValidationResult {
  isValid: boolean;
  isMovement: boolean;
  key: string;
  isShiftKey: boolean;
  newCursorLocation: number;
}

export interface EditingKeyboardEvent extends Omit<KeyboardEvent, 'key'> {
  key: 'Backspace' | 'Delete';
}

export interface MovementKeyboardEvent extends Omit<KeyboardEvent, 'key'> {
  key: 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End';
}

export type FormatChangeEvent = (value?: string) => void;
