import { TypeOrArray } from '@beesoft/common';
import React from 'react';
import { FormInputControl } from '../../../headless/components/form/form-control.interface.ts';
import { TemplateFunction } from '../../common/template-outlet/template-outlet.component.tsx';
import { DateTimeCalendarTemplate } from './date-time-calendar.component.tsx';
import { DateTimeScrollerTemplate } from './date-time-scroller.component.tsx';
import { CalendarIconPosition, DateFormatType, DateSelectionType, TimeConstraints } from '../../../headless/components/form/date-time/date-time-types.ts';

export interface DateTimeProps extends FormInputControl<string | TypeOrArray<Date>, TypeOrArray<Date>> {
  useDefaultDateValue?: boolean;
  useFormattedInput?: boolean;
  allowClear?: boolean;
  /**
   * When true the date selector will close when a valid date selection is made. This will only affect the "date only"
   * selector (default false).
   */
  closeSelector?: boolean;
  locale?: string;
  dateSelection?: DateSelectionType;
  dateFormat?: DateFormatType;
  timeConstraints?: TimeConstraints;
  icon?: React.JSX.Element;
  iconPosition?: CalendarIconPosition;
  inputElement?: HTMLElement;
  /**
   * If the passed function returns false then that date will not be selectable and will be marked with the error style.
   * @param {Date} currentDate - The date to test.
   * @returns {boolean} false indicates the date should not be selectable.
   */
  selectableDate?: (currentDate: Date) => boolean;
  /**
   * If the passed function returns false then the date will not be selected in the input.
   * @param {Date} selectedDate - The selected date to test.
   * @returns {boolean} false indicates the date is not valid.
   */
  isValidDate?: (selectedDate: Date) => boolean;
  calendarTemplate?: DateTimeCalendarTemplate;
  dateScrollerTemplate?: DateTimeScrollerTemplate;
  inputTemplate?: DateTimeInputTemplate;
  wrapperTemplate?: DateTimeWrapperTemplate;
}

export interface DateTimeInputTemplateProps {
  label?: string;
  readOnly: boolean;
  allowClear: boolean;
  getValue: () => string;
  onFocus: (event: FocusEvent) => void;
  onInput: (event: React.FormEvent) => void;
  iconPosition: CalendarIconPosition;
  iconElement?: React.JSX.Element;
}

export type DateTimeInputTemplate = TemplateFunction<DateTimeInputTemplateProps>;

export interface DateTimeWrapperTemplateProps {
  setDateSelector: (selector: DateSelectionType) => void;
}

export type DateTimeWrapperTemplate = TemplateFunction<DateTimeWrapperTemplateProps>;
