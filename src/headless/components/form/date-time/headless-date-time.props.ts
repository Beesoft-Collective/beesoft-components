import { TypeOrArray } from '@beesoft/common';
import {
  CalendarIconPosition,
  DateFormatType,
  DateSelectionType,
  TimeConstraints,
} from '../../../../components/form/date-time/date-time-types.ts';
import { FormInputControl } from '../form-control.interface.ts';

export interface HeadlessDateTimeProps extends FormInputControl<string | TypeOrArray<Date>, TypeOrArray<Date>> {
  useDefaultDateValue?: boolean;
  allowClear?: boolean;
  locale?: string;
  dateSelection?: DateSelectionType;
  dateFormat?: DateFormatType;
  timeConstraints?: TimeConstraints;
  iconPosition?: CalendarIconPosition;
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
}

export interface HeadlessDateTimeRenderProps extends HeadlessDateTimeProps {
  selectorOpen: boolean;
}
