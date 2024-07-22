import { ChangeEvent } from 'react';

export interface HeadlessRadioButtonChangeEvent {
  name?: string;
  value: unknown;
  originalEvent?: ChangeEvent<HTMLInputElement>;
}
