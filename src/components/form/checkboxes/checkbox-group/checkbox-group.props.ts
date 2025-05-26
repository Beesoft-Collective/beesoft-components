import { MakeRequired } from '@beesoft/common';
import { FormGroupItemOrientation, GroupChangeEvent } from '../../form-generic.interfaces.ts';
import { FormInputControlData } from '@beesoft/headless-ui';

export interface CheckboxGroupProps
  extends MakeRequired<FormInputControlData<Array<unknown>, GroupChangeEvent>, 'name'> {
  orientation?: FormGroupItemOrientation;
}
