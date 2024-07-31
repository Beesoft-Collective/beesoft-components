import { deepEquals } from '@beesoft/common';
import { Signal, useSignalEffect } from '@preact/signals-react';
import { isBefore, Locale } from 'date-fns';
import { memo, useEffect, useRef, useState } from 'react';
import { getBrowserLanguage } from '../../../../components/common-functions.ts';
import {
  DayType,
  getMonthMatrix,
  getTranslatedDays,
  loadLocale,
} from '../../../../components/form/date-time/date-time-functions.ts';
import { HeadlessBase } from '../../../architecture/components/headless-base.component.tsx';
import { CalendarSelectionMode } from './date-time-types.ts';
import {
  HeadlessDateTimeCalendarProps,
  HeadlessDateTimeCalendarRenderProps,
} from './headless-date-time-calendar.props.ts';

const HeadlessDateTimeCalendarComponent = (props: HeadlessDateTimeCalendarProps) => {
  const {
    viewDate,
    selectedDate,
    selectedStartDate,
    selectedEndDate,
    selectionMode = CalendarSelectionMode.Normal,
    locale,
    onDateSelected,
    children,
  } = props;

  const [viewDateState, setViewDateState] = useState(viewDate);
  const [selectedDateState, setSelectedDateState] = useState(selectedDate);
  const [selectedStartDateState, setSelectedStartDateState] = useState(selectedStartDate);
  const [selectedEndDateState, setSelectedEndDateState] = useState(selectedEndDate);
  const [selectionModeState, setSelectionModeState] = useState(selectionMode);
  const [localeState, setLocaleState] = useState(locale);

  const calendarSignal = useRef<Signal<HeadlessDateTimeCalendarProps>>();

  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);
  const [selectedStartComparison, setSelectedStartComparison] = useState<number>();
  const [selectedEndComparison, setSelectedEndComparison] = useState<number>();
  const [monthMatrix, setMonthMatrix] = useState<Array<Array<DayType>>>();
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date>();

  const loadedLocale = useRef<Locale>();
  const weekDaysRef = useRef<Array<string>>();

  const loadLocaleObject = async () => {
    return locale || (await loadLocale(getBrowserLanguage()));
  };

  /**
   * When the component first loads set up the locale either from the passed in property or load it from date-fns.
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
          59,
          999
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

  useSignalEffect(() => {
    if (calendarSignal.current && calendarSignal.current.value) {
      if (!deepEquals(viewDate, viewDateState)) {
        setViewDateState(calendarSignal.current.value.viewDate);
      }
      if (!deepEquals(selectedDate, selectedDateState)) {
        setSelectedDateState(calendarSignal.current.value.selectedDate);
      }
      if (!deepEquals(selectedStartDate, selectedStartDateState)) {
        setSelectedStartDateState(calendarSignal.current.value.selectedStartDate);
      }
      if (!deepEquals(selectedEndDate, selectedEndDateState)) {
        setSelectedEndDateState(calendarSignal.current.value.selectedEndDate);
      }
      if (!deepEquals(selectionMode, selectionModeState)) {
        setSelectionModeState(calendarSignal.current.value.selectionMode || CalendarSelectionMode.Normal);
      }
      if (!deepEquals(locale, localeState)) {
        setLocaleState(calendarSignal.current.value.locale);
      }
    }
  });

  const onDateClicked = (date: Date) => {
    if (selectionMode === CalendarSelectionMode.Normal) {
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
    if (selectionMode === CalendarSelectionMode.Normal) {
      return currentSelectedDate?.toLocaleDateString() === currentDate.toLocaleDateString();
    } else {
      if (selectedStartComparison && selectedEndComparison) {
        const currentDateValue = currentDate.getTime();
        return currentDateValue >= selectedStartComparison && currentDateValue <= selectedEndComparison;
      }

      return false;
    }
  };

  const onSignalRetrieved = (signal: Signal<HeadlessDateTimeCalendarProps>) => {
    calendarSignal.current = signal;
  };

  const renderProps: HeadlessDateTimeCalendarRenderProps = {
    viewDate,
    selectedDate,
    selectionMode,
    currentSelectedDate,
    monthMatrix,
    weekDays: weekDaysRef.current,
    loadedLocale: loadedLocale.current,
    onDateSelected,
    onDateClicked,
    isSelectedDate,
  };

  return (
    <HeadlessBase props={props} renderProps={renderProps} signalName="calendar" onSignalRetrieved={onSignalRetrieved}>
      {children}
    </HeadlessBase>
  );
};

const HeadlessDateTimeCalendar = memo(HeadlessDateTimeCalendarComponent);
export { HeadlessDateTimeCalendar };
