import { ReplacePropertyType } from '@beesoft/common';
import { ChangeEvent } from 'react';
import { ComponentAnimationProps } from '../../../../headless/components/component-interfaces.ts';
import { FormGroupItemOrientation, SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { HeadlessRadioButtonProps } from '../../../../headless/components/form/radio-buttons/radio-button/headless-radio-button.props.tsx';

export interface RadioChangeEvent {
  name: string;
  value: unknown;
  originalEvent?: ChangeEvent<HTMLInputElement>;
}

export interface RadioButtonProps
  extends ReplacePropertyType<HeadlessRadioButtonProps, 'onChange', (value?: RadioChangeEvent) => void>,
    ComponentAnimationProps {
  labelLocation?: SelectionLabelLocation;
  orientation?: FormGroupItemOrientation;
}
