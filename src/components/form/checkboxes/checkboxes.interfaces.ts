import { SyntheticEvent } from 'react';

export interface CheckboxChangeEvent {
  value: unknown;
  checked: boolean;
  originalEvent: SyntheticEvent<HTMLInputElement, Event>;
}
