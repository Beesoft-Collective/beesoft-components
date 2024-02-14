import { ChangeEvent } from 'react';

export interface CheckboxChangeEvent {
  name?: string;
  value: unknown;
  checked: boolean;
  originalEvent?: ChangeEvent<HTMLInputElement>;
}
