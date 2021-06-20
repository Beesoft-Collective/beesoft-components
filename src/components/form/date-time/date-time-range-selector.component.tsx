import { addMonths } from 'date-fns';
import React from 'react';
import DateTimeCalendar from './date-time-calendar.component';
import { CalendarSelectionMode } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeRangeSelectorProps {
  viewDate: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  locale: Locale;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeRangeSelector({
  viewDate,
  selectedStartDate,
  selectedEndDate,
  locale,
  dispatcher,
}: DateTimeRangeSelectorProps) {
  const nextMonth = addMonths(viewDate, 1);

  const onDateSelected = (date: Date) => {
    dispatcher({
      type: DateTimeActionType.SetSelectedDateRange,
      selectedStartDate: date,
      selectedEndDate: date,
    });
  };

  return (
    <div className="flex flex-row py-1 px-2">
      <div className="mr-2">
        <DateTimeCalendar
          viewDate={viewDate}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          selectionMode={CalendarSelectionMode.Range}
          onDateSelected={onDateSelected}
          locale={locale}
          dispatcher={dispatcher}
        />
      </div>
      <div>
        <DateTimeCalendar
          viewDate={nextMonth}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          selectionMode={CalendarSelectionMode.Range}
          onDateSelected={onDateSelected}
          locale={locale}
          dispatcher={dispatcher}
        />
      </div>
    </div>
  );
}
