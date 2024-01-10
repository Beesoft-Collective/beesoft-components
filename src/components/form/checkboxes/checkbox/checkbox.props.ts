import { FormInputControl } from '../../form-control.interface.ts';
import { CheckboxChangeEvent } from '../checkboxes.interfaces.ts';

export enum CheckboxLabelLocation {
  Right,
  Left,
}

export interface CheckboxProps extends FormInputControl<unknown, CheckboxChangeEvent> {
  checked?: boolean;
  partial?: boolean;
  labelLocation?: CheckboxLabelLocation;
}
