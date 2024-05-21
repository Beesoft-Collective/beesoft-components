import { ChangeEvent } from 'react';

export interface HeadlessCheckboxChangeEvent {
  name?: string;
  value: unknown;
  checked: boolean;
  originalEvent?: ChangeEvent<HTMLInputElement>;
}
