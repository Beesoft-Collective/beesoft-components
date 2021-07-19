import { addYears, setMonth, subYears } from 'date-fns';
import React, { useRef } from 'react';
import { getTranslatedMonthMatrix } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateScrollerType } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeMonthSelectorProps {
  viewDate: Date;
  locale: Locale;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeMonthSelector({ viewDate, locale, dispatcher }: DateTimeMonthSelectorProps) {
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
      type: DateTimeActionType.DaySelector,
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
    <div className="p-2 bc-dt-month-selector" style={{ minWidth: '20rem' }}>
      <DateTimeScroller
        title={getCurrentYear()}
        scrollerType={DateScrollerType.Month}
        onTitleClicked={onYearClicked}
        onMovePrevious={movePreviousYear}
        onMoveNext={moveNextYear}
      />
      <div className="w-full grid grid-cols-4 gap-4 bc-dt-month-grid">
        {monthMatrix.current.map((row, rIndex) =>
          row.map((column, cIndex) => (
            <div
              key={rIndex.toString() + cIndex.toString()}
              className="text-center cursor-pointer bc-dt-month-cell"
              onClick={() => onMonthClicked(column.monthNumber)}
            >
              {column.monthName}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
