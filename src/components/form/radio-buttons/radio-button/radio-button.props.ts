import { FormInputControlData, MakeRequired } from '@beesoft/common';
import { FormGroupItemOrientation, SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { ComponentAnimationProps, RadioChangeEvent } from '@beesoft/headless-ui';

export interface RadioButtonProps
  extends MakeRequired<FormInputControlData<string | number, RadioChangeEvent>, 'name'>,
    ComponentAnimationProps {
  labelLocation?: SelectionLabelLocation;
  orientation?: FormGroupItemOrientation;
}
