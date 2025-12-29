import { TypeOrArray } from '@beesoft/common';
import cx from 'classnames';
import { isBefore, isSameDay, isToday, Locale } from 'date-fns';
import { Dispatch, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import TemplateOutlet from '../../common/template-outlet/template-outlet.component';
import { DateTimeContext } from './date-time-context';
import { DayType, getMonthMatrix, getTranslatedDays } from './date-time-functions';
import { CalendarSelectionMode } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';
import { DateTimeCalendarTemplateProps } from './date-time.props.ts';
import { useAddDateTimeBaseTemplateProps } from './hooks/add-date-time-base-template-props.hook.ts';

export interface DateTimeCalendarProps {
  viewDate: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  selectionMode?: CalendarSelectionMode;
  locale: Locale;
  onDateSelected?: (date: Date, options?: Record<string, unknown>) => void;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  dispatcher: Dispatch<DateTimeReducerAction>;
}

const DateTimeCalendar = ({
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
}: DateTimeCalendarProps) => {
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);
  const [selectedStartComparison, setSelectedStartComparison] = useState<number>();
  const [selectedEndComparison, setSelectedEndComparison] = useState<number>();
  const [monthMatrix, setMonthMatrix] = useState<Array<Array<DayType>>>();
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date>();

  const loadedLocale = useRef<Locale>(null);
  const weekDaysRef = useRef<Array<string>>(null);

  const context = useContext(DateTimeContext);
  const viewTemplate = useMemo(() => context.calendarTemplate, [context.calendarTemplate]);

  /**
   * When the component first loads set up the locale either from the passed in property or load it from date-fns.
   */
  useEffect(() => {
    loadedLocale.current = locale;
    weekDaysRef.current = getTranslatedDays(loadedLocale.current);
    setIsLocaleLoaded(true);
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
      setCurrentSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
    } else {
      setCurrentSelectedDate(undefined);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedStartDate) {
      setSelectedStartComparison(
        new Date(
          selectedStartDate.getFullYear(),
          selectedStartDate.getMonth(),
          selectedStartDate.getDate(),
          0,
          0,
          0
        ).getTime()
      );
    } else {
      setSelectedStartComparison(undefined);
    }

    if (selectedEndDate) {
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
    } else {
      setSelectedEndComparison(undefined);
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
      dispatcher?.({
        type: DateTimeActionType.SetSelectedDate,
        selectedDate: date,
        viewDate: date,
      });

      onDateSelected?.(date);
    } else {
      if (!onDateSelected) throw new Error('Range selection mode requires onDateSelected to be set');
      if (!selectedStartDate || isBefore(date, selectedStartDate)) {
        onDateSelected(date);
      } else if (selectedStartDate && !selectedEndDate) {
        onDateSelected(date, { setEndDate: true });
      } else if (selectedStartDate && selectedEndDate) {
        onDateSelected(date);
      }
    }
  };

  const isSelectedDate = (currentDate: Date) => {
    return currentSelectedDate?.toLocaleDateString() === currentDate.toLocaleDateString();
  };

  const isInSelectedDateRange = (currentDate: Date) => {
    if (selectedStartComparison && selectedEndComparison) {
      const currentDateValue = currentDate.getTime();
      return currentDateValue >= selectedStartComparison && currentDateValue <= selectedEndComparison;
    }

    return false;
  };

  const templateProps = useAddDateTimeBaseTemplateProps<DateTimeCalendarTemplateProps>(
    {
      viewDate,
      selectedDate,
      selectedStartDate,
      selectedEndDate,
      selectionMode,
      locale,
      weekDays: weekDaysRef.current ?? undefined,
      monthMatrix,
      selectableDate,
      isValidDate,
      onDateClicked,
      isSelectedDate,
      isInSelectedDateRange,
    },
    viewDate,
    dispatcher
  );

  const defaultTemplate = (_props: DateTimeCalendarTemplateProps, children: TypeOrArray<ReactNode>) => (
    <div className="bc-dt-calendar bsc:w-full">{children}</div>
  );

  const template = viewTemplate || defaultTemplate;

  return (
    <TemplateOutlet props={templateProps} template={template}>
      <div className="bc-dt-day-row bsc:grid bsc:min-w-[329px] bsc:grid-cols-7 bsc:gap-3">
        {weekDaysRef.current?.map((day, index) => (
          <div key={index} className="bc-dt-day-cell bsc:text-center bsc:font-bold">
            {day}
          </div>
        ))}
        {monthMatrix?.map((row, rIndex) =>
          row.map((column, cIndex) => {
            const isSelectable =
              column.dayValue !== null && (selectableDate === undefined || selectableDate(column.dayValue));
            const dayStyles = cx(
              'bsc:text-center bsc:py-1 bsc:hover:bg-primary-2 bsc:hover:text-white bsc:dark:hover:bg-mono-light-2 bsc:dark:hover:text-mono-dark-1',
              {
                'bsc:text-gray-3': !column.isCurrent,
                'bsc:bg-primary-1 bsc:text-white bsc:dark:bg-mono-light-1 bsc:dark:text-mono-dark-1':
                  column &&
                  column.dayValue &&
                  ((currentSelectedDate && isSelectedDate(column.dayValue)) ||
                    (selectedStartComparison &&
                      !selectedEndComparison &&
                      isSameDay(selectedStartComparison, column.dayValue)) ||
                    (selectedStartComparison && selectedEndComparison && isInSelectedDateRange(column.dayValue))),
                'bsc:cursor-pointer': isSelectable,
                'bsc:text-error bsc:cursor-not-allowed': !isSelectable,
                'bsc:bg-primary-5 bsc:dark:bg-mono-light-3 bsc:dark:text-mono-dark-1':
                  column.dayValue &&
                  isToday(column.dayValue) &&
                  !(isSelectedDate(column.dayValue) || isInSelectedDateRange(column.dayValue)),
              },
              'bc-dt-date-cell'
            );

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
    </TemplateOutlet>
  );
};

export default DateTimeCalendar;
