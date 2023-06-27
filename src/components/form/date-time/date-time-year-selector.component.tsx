import addYears from 'date-fns/addYears';
import setYear from 'date-fns/setYear';
import subYears from 'date-fns/subYears';
import React from 'react';
import { getTranslatedYearMatrix } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateScrollerType } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeYearSelectorProps {
  viewDate: Date;
  locale: Locale;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

const DateTimeYearSelector = ({ viewDate, locale, dispatcher }: DateTimeYearSelectorProps) => {
  const yearMatrix = getTranslatedYearMatrix(viewDate, locale);

  const movePreviousDecade = () => {
    const previousDecade = subYears(viewDate, 10);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: previousDecade,
    });
  };

  const moveNextDecade = () => {
    const nextDecade = addYears(viewDate, 10);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: nextDecade,
    });
  };

  const onYearClicked = (year: string) => {
    const yearNumber = parseInt(year);
    dispatcher({
      type: DateTimeActionType.MonthSelector,
      viewDate: setYear(viewDate, yearNumber),
    });
  };

  const getCurrentDecade = () => `${yearMatrix[0][0].toString()} - ${yearMatrix[2][1].toString()}`;

  return (
    <div className="bc-dt-year-selector" style={{ minWidth: '20rem' }}>
      <DateTimeScroller
        title={getCurrentDecade()}
        scrollerType={DateScrollerType.Year}
        onMovePrevious={movePreviousDecade}
        onMoveNext={moveNextDecade}
      />
      <div className="bsc-w-full bc-dt-year-wrapper">
        <div className="bsc-grid bsc-grid-cols-4 bsc-gap-4 bc-dt-year-grid">
          {yearMatrix.map((row, rIndex) =>
            row.map((column, cIndex) => {
              return column.length > 0 ? (
                <div
                  key={rIndex.toString() + cIndex.toString()}
                  className="bsc-text-center bsc-cursor-pointer bc-dt-year-cell"
                  onClick={() => onYearClicked(column)}
                >
                  {column}
                </div>
              ) : (
                <div key={rIndex.toString() + cIndex.toString()}></div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeYearSelector;
