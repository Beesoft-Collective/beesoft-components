import { ReplacePropertyType } from '@beesoft/common';
import { ChangeEvent } from 'react';
import { SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { ComponentAnimationProps, HeadlessCheckboxProps } from '@beesoft/headless-ui';

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
