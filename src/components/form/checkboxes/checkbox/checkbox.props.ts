import { SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { ComponentAnimationProps, type CheckboxProps as HeadlessCheckboxProps } from '@beesoft/headless-ui';

export interface CheckboxProps extends HeadlessCheckboxProps, ComponentAnimationProps {
  labelLocation?: SelectionLabelLocation;
}

export interface CheckboxRef {
  setPartiallyChecked: (partiallyChecked: boolean) => void;
  setChecked: (checked: boolean) => void;
}
