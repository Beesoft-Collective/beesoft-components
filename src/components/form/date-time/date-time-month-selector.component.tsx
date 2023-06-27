import { addYears, setMonth, subYears } from 'date-fns';
import React, { useRef } from 'react';
import { getTranslatedMonthMatrix } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateScrollerType, DateSelectionType } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeMonthSelectorProps {
  viewDate: Date;
  locale: Locale;
  dateSelection?: DateSelectionType;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

const DateTimeMonthSelector = ({
  viewDate,
  locale,
  dateSelection = DateSelectionType.DateTime,
  dispatcher,
}: DateTimeMonthSelectorProps) => {
  const monthMatrix = useRef(getTranslatedMonthMatrix(locale));

  const movePreviousYear = () => {
    const previousYear = subYears(viewDate, 1);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: previousYear,
    });
  };

  const moveNextYear = () => {
    const nextYear = addYears(viewDate, 1);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: nextYear,
    });
  };

  const onMonthClicked = (monthNumber: number) => {
    dispatcher({
      type:
        dateSelection !== DateSelectionType.DateRange
          ? DateTimeActionType.DaySelector
          : DateTimeActionType.DateRangeSelector,
      viewDate: setMonth(viewDate, monthNumber),
    });
  };

  const getCurrentYear = () => {
    return viewDate.toLocaleDateString(locale.code, {
      year: 'numeric',
    });
  };

  const onYearClicked = () => {
    dispatcher({
      type: DateTimeActionType.YearSelector,
    });
  };

  return (
    <div className="bsc-p-2 bc-dt-month-selector" style={{ minWidth: '20rem' }}>
      <DateTimeScroller
        title={getCurrentYear()}
        scrollerType={DateScrollerType.Month}
        onTitleClicked={onYearClicked}
        onMovePrevious={movePreviousYear}
        onMoveNext={moveNextYear}
      />
      <div className="bsc-w-full bsc-grid bsc-grid-cols-4 bsc-gap-4 bc-dt-month-grid">
        {monthMatrix.current.map((row, rIndex) =>
          row.map((column, cIndex) => (
            <div
              key={rIndex.toString() + cIndex.toString()}
              className="bsc-text-center bsc-cursor-pointer bc-dt-month-cell"
              onClick={() => onMonthClicked(column.monthNumber)}
            >
              {column.monthName}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DateTimeMonthSelector;
