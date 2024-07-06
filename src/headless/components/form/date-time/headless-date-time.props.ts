import { DebouncedFunction, TypeOrArray } from '@beesoft/common';
import React from 'react';
import { InputFormat } from '../../../../components/form/inputs/formatted-input/input-format.interfaces.ts';
import { FormInputControl } from '../form-control.interface.ts';
import { DateFormatType, DateSelectionType, TimeConstraints } from './date-time-types.ts';

export interface HeadlessDateTimeProps extends FormInputControl<string | TypeOrArray<Date>, TypeOrArray<Date>> {
  useDefaultDateValue?: boolean;
  allowClear?: boolean;
  locale?: string;
  dateSelection?: DateSelectionType;
  dateFormat?: DateFormatType;
  timeConstraints?: TimeConstraints;
  children?: (props: HeadlessDateTimeRenderProps) => React.JSX.Element;
}

export interface HeadlessDateTimeRenderProps extends HeadlessDateTimeProps {
  selectorOpen: boolean;
  canShowDateSelectors: boolean;
  canShowTimeSelector: boolean;
  inputFormat?: InputFormat;
  onFocus: () => void;
  onBlur: DebouncedFunction<() => void>;
  onCalendarClick: DebouncedFunction<() => void>;
  onClearClick: () => void;
  onDateTimeHidden: () => void;
  getValue: () => string;
}
