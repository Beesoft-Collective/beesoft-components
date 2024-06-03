import { addYears, Locale, setMonth, subYears } from 'date-fns';
import { Dispatch, useRef } from 'react';
import { getTranslatedMonthMatrix } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateScrollerType, DateSelectionType, DateSelectorType } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from '../../../headless/components/form/date-time/headless-date-time.reducer.ts';

export interface DateTimeMonthSelectorProps {
  viewDate: Date;
  locale: Locale;
  dateSelection?: DateSelectionType;
  dispatcher: Dispatch<DateTimeReducerAction>;
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
      type: DateTimeActionType.SetDateSelector,
      dateSelector:
        dateSelection !== DateSelectionType.DateRange
          ? DateSelectorType.DaySelector
          : DateSelectorType.DateRangeSelector,
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
      type: DateTimeActionType.SetDateSelector,
      dateSelector: DateSelectorType.YearSelector,
    });
  };

  return (
    <div className="bc-dt-month-selector bsc-p-2" style={{ minWidth: '20rem' }}>
      <DateTimeScroller
        title={getCurrentYear()}
        scrollerType={DateScrollerType.Month}
        onTitleClicked={onYearClicked}
        onMovePrevious={movePreviousYear}
        onMoveNext={moveNextYear}
      />
      <div className="bc-dt-month-grid bsc-grid bsc-w-full bsc-grid-cols-4 bsc-gap-4">
        {monthMatrix.current.map((row, rIndex) =>
          row.map((column, cIndex) => (
            <div
              key={rIndex.toString() + cIndex.toString()}
              className="bc-dt-month-cell bsc-cursor-pointer bsc-text-center"
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
