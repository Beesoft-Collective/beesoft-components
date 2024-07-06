import { Locale } from 'date-fns';
import { CalendarSelectionMode } from './date-time-types.ts';

export interface HeadlessDateTimeCalendarProps {
  viewDate: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  selectionMode?: CalendarSelectionMode;
  locale?: Locale;
  onDateSelected?: (date: Date, options?: Record<string, unknown>) => void;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
}
