import { addMonths, subMonths } from 'date-fns';
import { Dispatch } from 'react';
import { TypeOrArray } from '../../common-interfaces.ts';
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
  onChange?: (value?: TypeOrArray<Date>) => void;
  dispatcher: Dispatch<DateTimeReducerAction>;
}

const DateTimeDaySelector = ({
  selectedDate,
  viewDate,
  locale,
  showTimeSelector,
  selectableDate,
  isValidDate,
  onChange,
  dispatcher,
}: DateTimeDaySelectorProps) => {
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
    <div className="bsc-p-2 bc-dt-day-selector">
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
        onDateSelected={onChange}
        dispatcher={dispatcher}
      />
      {showTimeSelector && (
        <div className="bsc-w-full bsc-flex bsc-flex-row bsc-p-2 bsc-justify-center bc-dt-time-value-wrapper">
          <div
            className="bsc-p-2 bsc-cursor-pointer hover:bsc-bg-gray-4 dark:hover:bsc-bg-mono-light-2 dark:hover:bsc-text-mono-dark-2 dark:bsc-bg-mono-dark-1 dark:bsc-text-mono-light-1 bc-dt-time-value"
            onClick={onTimeClicked}
          >
            {selectedDate?.toLocaleTimeString(locale.code) || getDefaultTime(locale)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeDaySelector;
