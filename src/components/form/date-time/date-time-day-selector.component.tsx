import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import React from 'react';
import DateTimeCalendar from './date-time-calendar.component';
import { getDefaultTime } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateScrollerType } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeDaySelectorProps {
  selectedDate?: Date;
  viewDate: Date;
  locale: Locale;
  showTimeSelector: boolean;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeDaySelector({
  selectedDate,
  viewDate,
  locale,
  showTimeSelector,
  selectableDate,
  isValidDate,
  dispatcher,
}: DateTimeDaySelectorProps) {
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

  const onMonthClicked = () => {
    dispatcher({
      type: DateTimeActionType.MonthSelector,
    });
  };

  const onTimeClicked = () => {
    dispatcher({
      type: DateTimeActionType.TimeSelector,
    });
  };

  const getCurrentMonthYear = () => {
    if (viewDate) {
      return viewDate.toLocaleDateString(locale.code, {
        month: 'long',
        year: 'numeric',
      });
    }

    return '';
  };

  return (
    <div className="p-2 bc-dt-day-selector">
      <DateTimeScroller
        title={getCurrentMonthYear()}
        scrollerType={DateScrollerType.Day}
        onTitleClicked={onMonthClicked}
        onMovePrevious={movePreviousMonth}
        onMoveNext={moveNextMonth}
      />
      <DateTimeCalendar
        viewDate={viewDate}
        selectedDate={selectedDate}
        locale={locale}
        selectableDate={selectableDate}
        isValidDate={isValidDate}
        dispatcher={dispatcher}
      />
      {showTimeSelector && (
        <div className="w-full flex flex-row p-2 justify-center bc-dt-time-value-wrapper">
          <div
            className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-white dark:hover:text-black dark:text-white bc-dt-time-value"
            onClick={onTimeClicked}
          >
            {selectedDate?.toLocaleTimeString(locale.code) || getDefaultTime(locale)}
          </div>
        </div>
      )}
    </div>
  );
}
