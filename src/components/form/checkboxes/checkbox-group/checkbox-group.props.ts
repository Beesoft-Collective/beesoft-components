import { FormInputControlData, MakeRequired } from '@beesoft/common';
import { FormGroupItemOrientation, GroupChangeEvent } from '../../form-generic.interfaces.ts';

export interface CheckboxGroupProps
  extends MakeRequired<FormInputControlData<Array<unknown>, GroupChangeEvent>, 'name'> {
  orientation?: FormGroupItemOrientation;
}
