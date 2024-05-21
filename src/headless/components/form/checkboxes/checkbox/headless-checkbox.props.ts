import React from 'react';
import { FormInputControl } from '../../form-control.interface.ts';
import { HeadlessCheckboxChangeEvent } from '../headless-checkboxes.interfaces.ts';

export interface HeadlessCheckboxCheckState {
  checked: boolean;
  partial: boolean;
}

export interface HeadlessCheckboxRenderProps {
  checked: boolean;
  partial: boolean;
}

export interface HeadlessCheckboxProps extends FormInputControl<unknown, HeadlessCheckboxChangeEvent> {
  checked?: boolean;
  partial?: boolean;
  labelStyles?: string;
  children?: (props: HeadlessCheckboxRenderProps) => React.JSX.Element;
}

export interface HeadlessCheckboxRef {
  setPartiallyChecked: (partiallyChecked: boolean) => void;
  setChecked: (checked: boolean) => void;
}
