import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { getBrowserLanguage } from '../../common-functions';
import { useKeyDown } from '../../common-hooks';
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
  onDateSelected?: (date: Date, options?: Record<string, any>) => void;
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
  const selectedDateRef = useRef<Date>();
  const [selectedStartComparison, setSelectedStartComparison] = useState<number>();
  const [selectedEndComparison, setSelectedEndComparison] = useState<number>();

  const isShiftDown = useKeyDown('Shift');

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

  useEffect(() => {
    if (selectedDate) {
      selectedDateRef.current = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      setSelectedStartComparison(
        new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate()).getTime()
      );
      setSelectedEndComparison(
        new Date(
          selectedEndDate.getFullYear(),
          selectedEndDate.getMonth(),
          selectedEndDate.getDate(),
          23,
          59,
          59
        ).getTime()
      );
    }
  }, [selectedStartDate, selectedEndDate]);

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
      if (!selectedStartDate || (selectedStartDate && !isShiftDown)) {
        onDateSelected(date);
      } else if (selectedStartDate && isShiftDown) {
        onDateSelected(date, { setEndDate: true });
      }
    }
  };

  const isSelectedDate = (currentDate: Date) => {
    return selectedDateRef.current?.toLocaleDateString() === currentDate.toLocaleDateString();
  };

  const isInSelectedDateRange = (currentDate: Date) => {
    if (selectedStartComparison && selectedEndComparison) {
      const currentDateValue = currentDate.getTime();
      return currentDateValue >= selectedStartComparison && currentDateValue <= selectedEndComparison;
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
                column &&
                column.dayValue &&
                ((selectedDateRef.current && isSelectedDate(column.dayValue)) ||
                  (selectedStartComparison && selectedEndComparison && isInSelectedDateRange(column.dayValue))),
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
