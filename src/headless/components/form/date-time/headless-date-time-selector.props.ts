import { TypeOrArray } from '@beesoft/common';
import { Locale } from 'date-fns';
import React from 'react';
import { DateSelectionType, TimeConstraints, TimeFormatType } from './date-time-types.ts';

export interface HeadlessDateTimeSelectorProps {
  selectedDate?: Date;
  viewDate: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  locale?: Locale;
  dateSelection?: DateSelectionType;
  timeFormat?: TimeFormatType;
  timeConstraints?: TimeConstraints;
  showDateSelector: boolean;
  showTimeSelector: boolean;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  onChange?: (value?: TypeOrArray<Date>) => void;
  children?: (props: Omit<HeadlessDateTimeSelectorProps, 'children'>) => React.JSX.Element;
}
