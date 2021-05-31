import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import React, { useEffect, useRef, useState } from 'react';
import { getDefaultTime, getMonthMatrix, getTranslatedDays } from './date-time-functions';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeDaySelectorProps {
  selectedDate?: Date;
  viewDate: Date;
  locale: string;
  showTimeSelector: boolean;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeDaySelector({
  selectedDate,
  viewDate,
  locale,
  showTimeSelector,
  dispatcher,
}: DateTimeDaySelectorProps) {
  const [monthMatrix, setMonthMatrix] = useState<Array<Array<Date | null>>>();
  const weekDaysRef = useRef(getTranslatedDays(locale));

  useEffect(() => {
    if (viewDate) {
      setMonthMatrix(getMonthMatrix(viewDate));
    }
  }, [viewDate]);

  const onMovePreviousMonth = () => {
    if (viewDate) {
      const previousMonth = subMonths(viewDate, 1);
      setMonthMatrix(getMonthMatrix(previousMonth));
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: previousMonth,
      });
    }
  };

  const onMoveNextMonth = () => {
    if (viewDate) {
      const nextMonth = addMonths(viewDate, 1);
      setMonthMatrix(getMonthMatrix(nextMonth));
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: nextMonth,
      });
    }
  };

  const onDateClicked = (date: Date) => {
    dispatcher({
      type: DateTimeActionType.SetSelectedDate,
      selectedDate: date,
    });
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: date,
    });
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
      return viewDate.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const isSelectedDate = (currentDate: Date) => {
    if (selectedDate) {
      const comparisonDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      return comparisonDate.toLocaleDateString() === currentDate.toLocaleDateString();
    }

    return false;
  };

  return (
    <div style={{ minWidth: '20rem' }}>
      <div className="w-full flex flex-row py-1 px-2">
        <div className="flex-shrink cursor-pointer">
          <button className="focus:outline-none" onClick={onMovePreviousMonth}>
            <FontAwesomeIcon icon={['fas', 'angle-left']} />
          </button>
        </div>
        <div className="flex-grow text-center cursor-pointer" onClick={onMonthClicked}>
          {getCurrentMonthYear()}
        </div>
        <div className="flex-shrink cursor-pointer">
          <button className="focus:outline-none" onClick={onMoveNextMonth}>
            <FontAwesomeIcon icon={['fas', 'angle-right']} />
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead className="font-bold">
          <tr>
            {weekDaysRef.current.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthMatrix?.map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((column, cIndex) => (
                <td
                  key={rIndex.toString() + cIndex.toString()}
                  className={`text-center cursor-pointer${column && isSelectedDate(column) ? ' bg-blue-100' : ''}`}
                  onClick={() => {
                    if (column) {
                      onDateClicked(column);
                    }
                  }}
                >
                  {column?.getDate().toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showTimeSelector && (
        <div className="w-full flex flex-row p-2 justify-center">
          <div className="p-2 cursor-pointer hover:bg-gray-300" onClick={onTimeClicked}>
            {selectedDate?.toLocaleTimeString(locale) || getDefaultTime(locale)}
          </div>
        </div>
      )}
    </div>
  );
}
