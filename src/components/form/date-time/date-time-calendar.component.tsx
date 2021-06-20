import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { getBrowserLanguage } from '../../common-functions';
import { DayType, getMonthMatrix, getTranslatedDays, loadLocale } from './date-time-functions';
import { CalendarSelectionMode } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeCalendarProps {
  viewDate: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  selectionMode?: CalendarSelectionMode;
  locale?: Locale;
  onDateSelected?: (date: Date) => void;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  dispatcher?: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeCalendar({
  viewDate,
  selectedDate,
  selectedStartDate,
  selectedEndDate,
  selectionMode = CalendarSelectionMode.Normal,
  locale,
  onDateSelected,
  selectableDate,
  isValidDate,
  dispatcher,
}: DateTimeCalendarProps) {
  const [monthMatrix, setMonthMatrix] = useState<Array<Array<DayType>>>();
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);
  const loadedLocale = useRef<Locale>();
  const weekDaysRef = useRef<Array<string>>();

  const loadLocaleObject = async () => {
    return locale || (await loadLocale(getBrowserLanguage()));
  };

  /**
   * When the component first loads setup the locale either from the passed in property or load it from date-fns.
   */
  useEffect(() => {
    loadLocaleObject()
      .then((localeObject) => {
        loadedLocale.current = localeObject;
        weekDaysRef.current = getTranslatedDays(loadedLocale.current);
        setIsLocaleLoaded(true);
      })
      .catch((error) => console.error(error));
  }, []);

  /**
   * Each time the view date changes re-calculate the month matrix.
   */
  useEffect(() => {
    if (viewDate && loadedLocale.current) {
      setMonthMatrix(getMonthMatrix(viewDate, loadedLocale.current, selectionMode === CalendarSelectionMode.Normal));
    }
  }, [viewDate, isLocaleLoaded]);

  /**
   * If the locale changes then re-calculate the month matrix's language.
   */
  useEffect(() => {
    if (loadedLocale.current && locale) {
      loadedLocale.current = locale;
      setMonthMatrix(getMonthMatrix(viewDate, loadedLocale.current, selectionMode === CalendarSelectionMode.Normal));
    }
  }, [locale]);

  const onDateClicked = (date: Date) => {
    if (selectionMode === CalendarSelectionMode.Normal) {
      if (dispatcher) {
        dispatcher({
          type: DateTimeActionType.SetSelectedDate,
          selectedDate: date,
        });
        dispatcher({
          type: DateTimeActionType.SetViewDate,
          viewDate: date,
        });
      }

      if (onDateSelected) {
        onDateSelected(date);
      }
    } else {
      if (!onDateSelected) throw new Error('Range selection mode requires onDateSelected to be set');
      onDateSelected(date);
    }
  };

  const isSelectedDate = (currentDate: Date) => {
    if (selectedDate) {
      const comparisonDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      return comparisonDate.toLocaleDateString() === currentDate.toLocaleDateString();
    }

    return false;
  };

  const isInSelectedDateRange = (currentDate: Date) => {
    if (selectedStartDate && selectedEndDate) {
      const startComparisonDate = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate());
      const endComparisonDate = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth(), selectedEndDate.getDate(), 23, 59, 59);
    }

    return false;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-3">
        {weekDaysRef.current?.map((day, index) => (
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
                {column.dayValue?.getDate().toLocaleString(loadedLocale.current?.code)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
