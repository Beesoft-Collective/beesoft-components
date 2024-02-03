import { ChangeEvent } from 'react';

export interface ButtonChangeEvent {
  name: string;
  value: unknown;
  checked: boolean;
  originalEvent?: ChangeEvent<HTMLInputElement>;
}
