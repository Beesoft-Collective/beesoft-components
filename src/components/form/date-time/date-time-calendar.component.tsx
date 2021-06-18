import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { DayType, getMonthMatrix, getTranslatedDays } from './date-time-functions';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeCalendarProps {
  viewDate: Date;
  selectedDate?: Date;
  locale: Locale;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeCalendar({
  viewDate,
  selectedDate,
  locale,
  selectableDate,
  isValidDate,
  dispatcher,
}: DateTimeCalendarProps) {
  const [monthMatrix, setMonthMatrix] = useState<Array<Array<DayType>>>();
  const weekDaysRef = useRef(getTranslatedDays(locale));

  useEffect(() => {
    if (viewDate) {
      setMonthMatrix(getMonthMatrix(viewDate, locale));
    }
  }, [viewDate, locale]);

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

  const isSelectedDate = (currentDate: Date) => {
    if (selectedDate) {
      const comparisonDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      return comparisonDate.toLocaleDateString() === currentDate.toLocaleDateString();
    }

    return false;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-3">
        {weekDaysRef.current.map((day, index) => (
          <div key={index} className="text-center font-bold">
            {day}
          </div>
        ))}
        {monthMatrix?.map((row, rIndex) =>
          row.map((column, cIndex) => {
            const isSelectable =
              column.dayValue !== null && (selectableDate === undefined || selectableDate(column.dayValue));
            const dayStyles = cx('text-center py-1', {
              'text-gray-400': !column.isCurrent,
              'bg-blue-100 dark:bg-white dark:text-black rounded-full':
                column && column.dayValue && isSelectedDate(column.dayValue),
              'cursor-pointer': isSelectable,
              'text-red-300 cursor-not-allowed': !isSelectable,
            });

            return (
              <div
                key={rIndex.toString() + cIndex.toString()}
                className={dayStyles}
                onClick={() =>
                  column &&
                  column.dayValue &&
                  isSelectable &&
                  (isValidDate === undefined || isValidDate(column.dayValue)) &&
                  onDateClicked(column.dayValue)
                }
              >
                {column.dayValue?.getDate().toLocaleString(locale.code)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
