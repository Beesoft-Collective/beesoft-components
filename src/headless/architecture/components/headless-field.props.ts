import { MakeRequired } from '@beesoft/common';
import { HTMLInputTypeAttribute } from 'react';
import { FormInputControl } from '../../components/form/form-control.interface.ts';

export interface HeadlessFieldProps extends MakeRequired<FormInputControl, 'id' | 'name'> {
  type: HTMLInputTypeAttribute;
}
