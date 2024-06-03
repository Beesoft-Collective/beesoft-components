import { ReplacePropertyType } from '@beesoft/common';
import { ChangeEvent } from 'react';
import { ComponentAnimationProps } from '../../../../headless/components/component-interfaces.ts';
import { HeadlessCheckboxProps } from '../../../../headless/components/form/checkboxes/checkbox/headless-checkbox.props.ts';
import { SelectionLabelLocation } from '../../form-generic.interfaces.ts';

export interface CheckboxChangeEvent {
  name?: string;
  value: unknown;
  checked: boolean;
  originalEvent?: ChangeEvent<HTMLInputElement>;
}

export interface CheckboxProps
  extends ReplacePropertyType<HeadlessCheckboxProps, 'onChange', (value?: CheckboxChangeEvent) => void>,
    ComponentAnimationProps {
  labelLocation?: SelectionLabelLocation;
}

export interface CheckboxRef {
  setPartiallyChecked: (partiallyChecked: boolean) => void;
  setChecked: (checked: boolean) => void;
}
