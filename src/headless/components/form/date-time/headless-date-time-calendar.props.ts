import { Locale } from 'date-fns';
import React from 'react';
import { DayType } from '../../../../components/form/date-time/date-time-functions.ts';
import { CalendarSelectionMode } from './date-time-types.ts';

export interface HeadlessDateTimeCalendarProps {
  viewDate: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  selectionMode?: CalendarSelectionMode;
  locale?: Locale;
  onDateSelected?: (date: Date, options?: Record<string, unknown>) => void;
  children?: (props: HeadlessDateTimeCalendarRenderProps) => React.JSX.Element;
}

export interface HeadlessDateTimeCalendarRenderProps {
  viewDate: Date;
  selectedDate?: Date;
  selectionMode?: CalendarSelectionMode;
  currentSelectedDate?: Date;
  monthMatrix?: Array<Array<DayType>>;
  weekDays?: Array<string>;
  loadedLocale?: Locale;
  onDateSelected?: (date: Date, options?: Record<string, unknown>) => void;
  onDateClicked: (date: Date) => void;
  isSelectedDate: (currentDate: Date) => void;
}
