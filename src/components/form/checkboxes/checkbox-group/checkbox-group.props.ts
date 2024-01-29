import { MakeRequired } from '@beesoft/common';
import { FormInputControlData } from '../../form-control.interface.ts';
import { CheckboxGroupChangeEvent } from '../checkboxes.interfaces.ts';

export enum CheckboxGroupOrientation {
  Vertical,
  Horizontal,
}

export interface CheckboxGroupProps
  extends MakeRequired<FormInputControlData<Array<unknown>, CheckboxGroupChangeEvent>, 'name'> {
  orientation?: CheckboxGroupOrientation;
}
