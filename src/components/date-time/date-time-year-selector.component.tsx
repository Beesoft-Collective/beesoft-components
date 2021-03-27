import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addYears, setYear, subYears } from 'date-fns';
import React from 'react';
import { getBrowserLanguage } from '../common-functions';
import { getTranslatedYearMatrix } from './date-time-functions';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeYearSelectorProps {
  viewDate: Date;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeYearSelector({viewDate, dispatcher}: DateTimeYearSelectorProps) {
  const yearMatrix = getTranslatedYearMatrix(viewDate, getBrowserLanguage());

  const onMovePreviousDecade = () => {
    const previousDecade = subYears(viewDate, 10);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: previousDecade
    });
  };

  const onMoveNextDecade = () => {
    const nextDecade = addYears(viewDate, 10);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: nextDecade
    });
  };

  const onYearClicked = (year: string) => {
    const yearNumber = parseInt(year);
    dispatcher({
      type: DateTimeActionType.MonthSelector,
      viewDate: setYear(viewDate, yearNumber)
    });
  };

  const getCurrentDecade = () => `${yearMatrix[0][0].toString()} - ${yearMatrix[2][1].toString()}`;

  return (
    <div style={{minWidth: '20rem'}}>
      <div className="w-full flex flex-row py-1 px-2">
        <div className="flex-shrink cursor-pointer" onClick={onMovePreviousDecade}>
          <FontAwesomeIcon icon={['fas', 'angle-left']}/>
        </div>
        <div className="flex-grow text-center cursor-pointer">{getCurrentDecade()}</div>
        <div className="flex-shrink cursor-pointer" onClick={onMoveNextDecade}>
          <FontAwesomeIcon icon={['fas', 'angle-right']}/>
        </div>
      </div>
      <table className="w-full">
        <tbody>
        {yearMatrix.map((row, rIndex) => (
          <tr key={rIndex}>
            {row.map((column, cIndex) => (
              <td key={rIndex.toString() + cIndex.toString()}
                  className="text-center cursor-pointer"
                  onClick={() => onYearClicked(column)}>{column}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
