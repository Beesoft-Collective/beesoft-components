import { addYears, Locale, setYear, subYears } from 'date-fns';
import { Dispatch } from 'react';
import { getTranslatedYearMatrix } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateScrollerType, DateSelectorType } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from '../../../headless/components/form/date-time/headless-date-time.reducer.ts';

export interface DateTimeYearSelectorProps {
  viewDate: Date;
  locale: Locale;
  dispatcher: Dispatch<DateTimeReducerAction>;
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
      type: DateTimeActionType.SetDateSelector,
      dateSelector: DateSelectorType.MonthSelector,
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
      <div className="bc-dt-year-wrapper bsc-w-full">
        <div className="bc-dt-year-grid bsc-grid bsc-grid-cols-4 bsc-gap-4">
          {yearMatrix.map((row, rIndex) =>
            row.map((column, cIndex) => {
              return column.length > 0 ? (
                <div
                  key={rIndex.toString() + cIndex.toString()}
                  className="bc-dt-year-cell bsc-cursor-pointer bsc-text-center"
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
