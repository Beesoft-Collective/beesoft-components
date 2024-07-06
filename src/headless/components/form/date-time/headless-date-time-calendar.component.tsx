import { memo } from 'react';
import { CalendarSelectionMode } from './date-time-types.ts';
import { HeadlessDateTimeCalendarProps } from './headless-date-time-calendar.props.ts';

const HeadlessDateTimeCalendarComponent = ({
  viewDate,
  selectedDate,
  selectedStartDate,
  selectedEndDate,
  selectionMode = CalendarSelectionMode.Normal,
  locale,
  onDateSelected,
  selectableDate,
  isValidDate,
}: HeadlessDateTimeCalendarProps) => {};

const HeadlessDateTimeCalendar = memo(HeadlessDateTimeCalendarComponent);
export { HeadlessDateTimeCalendar };
