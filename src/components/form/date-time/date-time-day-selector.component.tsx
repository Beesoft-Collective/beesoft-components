import { TypeOrArray } from '@beesoft/common';
import { addMonths, Locale, subMonths } from 'date-fns';
import { Dispatch } from 'react';
import { HeadlessDateTimeCalendar } from '../../../headless/components/form/date-time/headless-date-time-calendar.component.tsx';
import DateTimeCalendar from './date-time-calendar.component';
import { getDefaultTime } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateScrollerType, DateSelectorType } from '../../../headless/components/form/date-time/date-time-types.ts';
import {
  HeadlessDateTimeActionType,
  HeadlessDateTimeReducerAction,
} from '../../../headless/components/form/date-time/headless-date-time.reducer.ts';

export interface DateTimeDaySelectorProps {
  selectedDate?: Date;
  viewDate: Date;
  locale: Locale;
  showTimeSelector: boolean;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  onChange?: (value?: TypeOrArray<Date>) => void;
  dispatcher: Dispatch<HeadlessDateTimeReducerAction>;
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
        type: HeadlessDateTimeActionType.SetViewDate,
        viewDate: subMonths(viewDate, 1),
      });
    }
  };

  const moveNextMonth = () => {
    if (viewDate) {
      dispatcher({
        type: HeadlessDateTimeActionType.SetViewDate,
        viewDate: addMonths(viewDate, 1),
      });
    }
  };

  const onMonthClicked = () => {
    dispatcher({
      type: HeadlessDateTimeActionType.SetDateSelector,
      dateSelector: DateSelectorType.MonthSelector,
    });
  };

  const onTimeClicked = () => {
    dispatcher({
      type: HeadlessDateTimeActionType.SetDateSelector,
      dateSelector: DateSelectorType.TimeSelector,
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
    <div className="bc-dt-day-selector bsc-p-2">
      <DateTimeScroller
        title={getCurrentMonthYear()}
        scrollerType={DateScrollerType.Day}
        onTitleClicked={onMonthClicked}
        onMovePrevious={movePreviousMonth}
        onMoveNext={moveNextMonth}
      />
      <HeadlessDateTimeCalendar
        viewDate={viewDate}
        selectedDate={selectedDate}
        locale={locale}
        onDateSelected={onChange}
      >
        {(props) => (
          <DateTimeCalendar
            viewDate={props.viewDate}
            selectedDate={props.selectedDate}
            locale={props.loadedLocale}
            selectableDate={selectableDate}
            isValidDate={isValidDate}
            onDateSelected={props.onDateSelected}
            dispatcher={dispatcher}
          />
        )}
      </HeadlessDateTimeCalendar>
      {showTimeSelector && (
        <div className="bc-dt-time-value-wrapper bsc-flex bsc-w-full bsc-flex-row bsc-justify-center bsc-p-2">
          <div
            className="bc-dt-time-value bsc-cursor-pointer bsc-p-2 hover:bsc-bg-gray-4 dark:bsc-bg-mono-dark-1 dark:bsc-text-mono-light-1 dark:hover:bsc-bg-mono-light-2 dark:hover:bsc-text-mono-dark-2"
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
