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
  onChange?: (value?: Date | Array<Date>) => void;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

const DateTimeRangeSelector = ({
  viewDate,
  selectedStartDate,
  selectedEndDate,
  locale,
  onChange,
  dispatcher,
}: DateTimeRangeSelectorProps) => {
  const nextMonth = addMonths(viewDate, 1);

  const onDateSelected = (date: Date, options?: Record<string, any>) => {
    if (!options || !options.setEndDate) {
      dispatcher({
        type: DateTimeActionType.SetSelectedStartDate,
        selectedStartDate: date,
      });
    } else {
      dispatcher({
        type: DateTimeActionType.SetSelectedEndDate,
        selectedEndDate: date,
      });
      selectedStartDate && onChange?.([selectedStartDate, date]);
    }
  };

  const onMonthsClicked = () => {
    dispatcher({
      type: DateTimeActionType.MonthSelector,
    });
  };

  const getSelectorTitle = () =>
    `${viewDate.toLocaleDateString(locale.code, { month: 'long' })} ${viewDate.toLocaleDateString(locale.code, {
      year: 'numeric',
    })} - ${nextMonth.toLocaleDateString(locale.code, {
      month: 'long',
    })} ${nextMonth.toLocaleDateString(locale.code, { year: 'numeric' })}`;

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
    <div className="bsc-flex bsc-flex-col bc-dt-range-selector">
      <div className="bsc-flex-shrink bc-dt-range-scroller-wrapper">
        <DateTimeScroller
          title={getSelectorTitle()}
          scrollerType={DateScrollerType.Range}
          onTitleClicked={onMonthsClicked}
          onMovePrevious={movePreviousMonth}
          onMoveNext={moveNextMonth}
        />
      </div>
      <div className="bsc-flex-grow">
        <div className="bsc-flex bsc-flex-row bsc-py-1 bsc-px-2 bc-dt-range-wrapper">
          <div className="bsc-border-r bsc-border-solid bsc-border-gray-3 bsc-pr-4 bc-dt-range-calendar-1">
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
          <div className="bsc-pl-4 bc-dt-range-calendar-2">
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
};

export default DateTimeRangeSelector;
