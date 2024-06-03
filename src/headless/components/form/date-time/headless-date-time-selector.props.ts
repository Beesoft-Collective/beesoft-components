import { TypeOrArray } from '@beesoft/common';
import { Locale } from 'date-fns';
import { Dispatch } from 'react';
import {
  DateSelectionType,
  TimeConstraints,
  TimeFormatType,
} from '../../../../components/form/date-time/date-time-types.ts';
import { DateTimeReducerAction } from './headless-date-time.reducer.ts';

export interface HeadlessDateTimeSelectorProps {
  selectedDate?: Date;
  viewDate: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  locale: Locale;
  dateSelection?: DateSelectionType;
  timeFormat?: TimeFormatType;
  timeConstraints?: TimeConstraints;
  showDateSelector: boolean;
  showTimeSelector: boolean;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  onChange?: (value?: TypeOrArray<Date>) => void;
  dispatcher: Dispatch<DateTimeReducerAction>;
}
