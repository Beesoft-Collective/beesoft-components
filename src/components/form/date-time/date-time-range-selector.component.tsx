import { addMonths } from 'date-fns';
import subMonths from 'date-fns/subMonths';
import React from 'react';
import DateTimeCalendar from './date-time-calendar.component';
import DateTimeScroller from './date-time-scroller.component';
import { CalendarSelectionMode, DateScrollerType } from './date-time-types';
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

  const onDateSelected = (date: Date, options?: Record<string, any>) => {
    if (!options || !options.setEndDate) {
      dispatcher({
        type: DateTimeActionType.SetSelectedDateRange,
        selectedStartDate: date,
        selectedEndDate: date,
      });
    } else {
      dispatcher({
        type: DateTimeActionType.SetSelectedDateRange,
        selectedEndDate: date,
      });
    }
  };

  const getSelectorTitle = () =>
    `${viewDate.toLocaleDateString(locale.code, { month: 'long' })} - ${nextMonth.toLocaleDateString(locale.code, {
      month: 'long',
    })}`;

  const movePreviousMonth = () => {
    if (viewDate) {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: subMonths(viewDate, 1),
      });
    }
  };

  const moveNextMonth = () => {
    if (viewDate) {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: addMonths(viewDate, 1),
      });
    }
  };

  return (
    <div className="flex flex-col bc-dt-range-selector">
      <div className="flex-shrink bc-dt-range-scroller-wrapper">
        <DateTimeScroller
          title={getSelectorTitle()}
          scrollerType={DateScrollerType.Range}
          onMovePrevious={movePreviousMonth}
          onMoveNext={moveNextMonth}
        />
      </div>
      <div className="flex-grow">
        <div className="flex flex-row py-1 px-2 bc-dt-range-wrapper">
          <div className="border-r border-solid border-gray-400 pr-4 bc-dt-range-calendar-1">
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
          <div className="pl-4 bc-dt-range-calendar-2">
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
      </div>
    </div>
  );
}
