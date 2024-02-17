import { MakeRequired } from '@beesoft/common';
import { FormInputControlData } from '../../form-control.interface.ts';
import { FormGroupItemOrientation, GroupChangeEvent } from '../../form-generic.interfaces.ts';

export interface CheckboxGroupProps
  extends MakeRequired<FormInputControlData<Array<unknown>, GroupChangeEvent>, 'name'> {
  orientation?: FormGroupItemOrientation;
}
