import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addMonths, subMonths } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { getMonthMatrix } from './date-time-functions';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeSelectorProps {
  value: Date;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
  dateSelected?: (selectedDate: Date) => void;
}

export default function DateTimeDaySelector({ value, dispatcher, dateSelected }: DateTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [monthMatrix, setMonthMatrix] = useState<Array<Array<Date | null>>>();
  const [currentViewDate, setCurrentViewDate] = useState<Date>();

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentViewDate(value);
      setMonthMatrix(getMonthMatrix(value));
    }
  }, [value]);

  const onMovePreviousMonth = () => {
    if (currentViewDate) {
      const previousMonth = subMonths(currentViewDate, 1);
      setMonthMatrix(getMonthMatrix(previousMonth));
      setCurrentViewDate(previousMonth);
    }
  };

  const onMoveNextMonth = () => {
    if (currentViewDate) {
      const nextMonth = addMonths(currentViewDate, 1);
      setMonthMatrix(getMonthMatrix(nextMonth));
      setCurrentViewDate(nextMonth);
    }
  };

  const onDateClicked = (date: Date) => {
    setSelectedDate(date);
    if (dateSelected) {
      dateSelected(date);
    }
  };

  const onMonthClicked = () => {
    dispatcher({
      type: DateTimeActionType.MonthSelector
    });
  };

  const getCurrentMonthYear = () => {
    if (currentViewDate) {
      return new Intl.DateTimeFormat('en-AU', {
        month: 'long',
        year: 'numeric'
      }).format(currentViewDate);
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
    <div style={{ minWidth: "20rem" }}>
      <div className="w-full flex flex-row py-1 px-2">
        <div className="flex-shrink cursor-pointer" onClick={onMovePreviousMonth}>
          <FontAwesomeIcon icon={['fas', 'angle-left']} />
        </div>
        <div className="flex-grow text-center cursor-pointer" onClick={onMonthClicked}>{getCurrentMonthYear()}</div>
        <div className="flex-shrink cursor-pointer" onClick={onMoveNextMonth}>
          <FontAwesomeIcon icon={['fas', 'angle-right']} />
        </div>
      </div>
      <table className="w-full">
        <thead className="font-bold">
          <th>Su</th>
          <th>Mo</th>
          <th>Tu</th>
          <th>We</th>
          <th>Th</th>
          <th>Fr</th>
          <th>Sa</th>
        </thead>
        {monthMatrix?.map(row => (
          <tr>
            {row.map(column => (
              <td
                className={`text-center cursor-pointer${column && isSelectedDate(column) ? " bg-blue-100" : ""}`}
                onClick={() => {
                  if (column) {
                    onDateClicked(column)
                  }
                }}
              >
                {column?.getDate().toLocaleString()}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
