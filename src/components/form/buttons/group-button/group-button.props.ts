import { MakeRequired, TypeOrArray } from '@beesoft/common';
import { FormInputControlData } from '../../form-control.interface.ts';
import { FormGroupItemOrientation, GroupChangeEvent } from '../../form-generic.interfaces.ts';

export interface GroupButtonProps
  extends MakeRequired<FormInputControlData<TypeOrArray<unknown>, GroupChangeEvent>, 'name'> {
  orientation?: FormGroupItemOrientation;
  isMultiSelect?: boolean;
}
