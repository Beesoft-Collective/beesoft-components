import { addMonths } from 'date-fns';
import React, { useState } from 'react';
import DateTimeCalendar from './date-time-calendar.component';
import { DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeRangeProps {
  viewDate: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  locale: Locale;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeRange({
  viewDate,
  selectedStartDate,
  selectedEndDate,
  locale,
  dispatcher,
}: DateTimeRangeProps) {
  const [secondViewDate, setSecondViewDate] = useState(addMonths(viewDate, 1));

  return (
    <div className="flex flex-row py-1 px-2">
      <div className="mr-2">
        <DateTimeCalendar viewDate={viewDate} locale={locale} dispatcher={dispatcher} />
      </div>
      <div>
        <DateTimeCalendar viewDate={secondViewDate} locale={locale} dispatcher={dispatcher} />
      </div>
    </div>
  );
}
