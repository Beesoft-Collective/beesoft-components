import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addYears from 'date-fns/addYears';
import setMonth from 'date-fns/setMonth';
import subYears from 'date-fns/subYears';
import { getBrowserLanguage } from '../common-functions';
import { getTranslatedMonthMatrix } from './date-time-functions';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeMonthSelectorProps {
  viewDate: Date;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeMonthSelector({ viewDate, dispatcher }: DateTimeMonthSelectorProps) {
  const monthMatrix = useRef(getTranslatedMonthMatrix(getBrowserLanguage()));

  const onMovePreviousYear = () => {
    const previousYear = subYears(viewDate, 1);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: previousYear,
    });
  };

  const onMoveNextYear = () => {
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
    return viewDate.toLocaleDateString(getBrowserLanguage(), {
      year: 'numeric',
    });
  };

  const onYearClicked = () => {
    dispatcher({
      type: DateTimeActionType.YearSelector,
    });
  };

  return (
    <div style={{ minWidth: '20rem' }}>
      <div className="w-full flex flex-row py-1 px-2">
        <div className="flex-shrink cursor-pointer" onClick={onMovePreviousYear}>
          <FontAwesomeIcon icon={['fas', 'angle-left']} />
        </div>
        <div className="flex-grow text-center cursor-pointer" onClick={onYearClicked}>
          {getCurrentYear()}
        </div>
        <div className="flex-shrink cursor-pointer" onClick={onMoveNextYear}>
          <FontAwesomeIcon icon={['fas', 'angle-right']} />
        </div>
      </div>
      <table className="w-full">
        <tbody>
          {monthMatrix.current.map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((column, cIndex) => (
                <td
                  key={rIndex.toString() + cIndex.toString()}
                  className="text-center cursor-pointer"
                  onClick={() => onMonthClicked(column.monthNumber)}
                >
                  {column.monthName}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
