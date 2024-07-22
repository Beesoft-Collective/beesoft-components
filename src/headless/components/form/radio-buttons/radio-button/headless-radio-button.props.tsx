import { MakeRequired } from '@beesoft/common';
import React from 'react';
import { FormInputControlData } from '../../form-control.interface.js';
import { ComponentAnimationProps } from '../../../../components/component-interfaces.ts';
import { HeadlessRadioButtonChangeEvent } from '../headless-radio-button.interfaces.js';
import { FormGroupItemOrientation, SelectionLabelLocation } from '../../form-generic.interfaces.ts';

export interface HeadlessRadioButtonRenderProps {
  checked: boolean;
}

export interface HeadlessRadioButtonProps
  extends MakeRequired<FormInputControlData<string, HeadlessRadioButtonChangeEvent>, 'name'>,
    ComponentAnimationProps {
  labelStyles?: string;
  labelLocation?: SelectionLabelLocation;
  orientation?: FormGroupItemOrientation;
  checked?: boolean;
  children?: (props: HeadlessRadioButtonRenderProps) => React.JSX.Element;
}

export interface HeadlessRadioButtonRef {
  setChecked: (checked: boolean) => void;
}
