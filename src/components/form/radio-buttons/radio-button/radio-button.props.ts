import { MakeRequired } from '@beesoft/common';
import { ChangeEvent } from 'react';
import { FormGroupItemOrientation, SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { ComponentAnimationProps } from '@beesoft/headless-ui';
import type { FormInputControlData } from '@beesoft/common';

export interface RadioChangeEvent {
  name: string;
  value: unknown;
  originalEvent?: ChangeEvent<HTMLInputElement>;
}

export interface RadioButtonProps
  extends MakeRequired<FormInputControlData<string, RadioChangeEvent>, 'name'>,
    ComponentAnimationProps {
  labelLocation?: SelectionLabelLocation;
  orientation?: FormGroupItemOrientation;
}
