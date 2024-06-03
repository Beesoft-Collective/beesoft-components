import { useStateRef, debounce, TypeOrArray } from '@beesoft/common';
import { Locale } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getBrowserLanguage } from '../../../../components/common-functions.ts';
import { loadLocale, parseDate, parseDateRange } from '../../../../components/form/date-time/date-time-functions.ts';
import {
  CalendarIconPosition,
  DateFormatType,
  DateSelectionType,
  DateSelectorType,
  TimeFormatType,
} from '../../../../components/form/date-time/date-time-types.ts';
import useGetDateTimeFormat from '../../../../components/form/date-time/hooks/get-date-time-format.hook.ts';
import { HeadlessBase } from '../../../architecture/components/headless-base.component.tsx';
import { HeadlessDateTimeProps } from './headless-date-time.props.ts';
import reducer, { DateTimeActionType, DateTimeState } from './headless-date-time.reducer.ts';

const HeadlessDateTimeComponent = ({
  value,
  readOnly = false,
  useDefaultDateValue = false,
  allowClear = false,
  locale,
  dateSelection = DateSelectionType.DateTime,
  dateFormat,
  timeConstraints,
  iconPosition = CalendarIconPosition.Right,
  selectableDate,
  isValidDate,
  onChange,
}: HeadlessDateTimeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [localeCode, setLocaleCode] = useState<string>();
  const [dateSelectionState, setDateSelectionState, dateSelectionRef] = useStateRef(dateSelection);

  const language = useRef<string>(locale || getBrowserLanguage());
  const loadedLocale = useRef<Locale>();

  const [inputFormat, use24HourTime] = useGetDateTimeFormat(dateSelection, localeCode);

  const finalProps: HeadlessDateTimeProps = {
    value,
    readOnly,
    useDefaultDateValue,
    allowClear,
    locale,
    dateSelection,
    dateFormat,
    timeConstraints,
    iconPosition,
    selectableDate,
    isValidDate,
    onChange,
  };

  useEffect(() => {
    if (language.current) {
      loadLocaleObject(language.current);
    }
  }, [language]);

  useEffect(() => {
    if (locale) {
      loadLocaleObject(locale);
    }
  }, [locale]);

  useEffect(() => {
    if (value) {
      const dateValue = getDateValue();

      dispatcher({
        type: DateTimeActionType.InitializeDates,
        initialDate: dateValue,
      });
    } else {
      dispatcher({
        type: DateTimeActionType.ClearDates,
      });
    }
  }, [value, loadedLocale.current]);

  useEffect(() => {
    if (use24HourTime) {
      dispatcher({
        type: DateTimeActionType.SetTimeFormat,
        timeFormat: use24HourTime ? TimeFormatType.TwentyFourHour : TimeFormatType.TwelveHour,
      });
    }
  }, [use24HourTime]);

  useEffect(() => {
    dispatcher({
      type: DateTimeActionType.SetDateSelector,
      dateSelector: getDateSelector(),
    });
  }, [dateSelectionState]);

  const getDateSelector = useCallback(() => {
    return dateSelectionRef.current === DateSelectionType.TimeOnly
      ? DateSelectorType.TimeSelector
      : dateSelectionRef.current === DateSelectionType.DateTime ||
          dateSelectionRef.current === DateSelectionType.DateOnly
        ? DateSelectorType.DaySelector
        : DateSelectorType.DateRangeSelector;
  }, []);

  const loadLocaleObject = (localeToLoad: string) => {
    loadLocale(localeToLoad)
      .then((locale) => {
        setLocaleCode(locale.code);
        loadedLocale.current = locale;
        const defaultDate = getDateValue();

        if (value || useDefaultDateValue) {
          dispatcher({
            type: DateTimeActionType.InitializeDates,
            initialDate: !Array.isArray(defaultDate) ? defaultDate : defaultDate[0],
          });
        } else {
          dispatcher({
            type: DateTimeActionType.SetViewDate,
            viewDate: !Array.isArray(defaultDate) ? defaultDate : defaultDate[0],
          });
        }
      })
      .catch((error) => console.error(error));
  };

  const getDateValue = () => {
    const defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    return value
      ? typeof value === 'string'
        ? dateSelectionRef.current !== DateSelectionType.DateRange
          ? parseDate(value, loadedLocale.current)
          : parseDateRange(value, loadedLocale.current)
        : value
      : defaultDate;
  };

  const initialState: DateTimeState = {
    currentSelector: getDateSelector(),
    currentViewDate: new Date(),
    timeFormat: TimeFormatType.TwelveHour,
    dateInitialized: false,
  };

  const [state, dispatcher] = useReducer(reducer, initialState);

  const onFocus = useCallback(() => {
    setSelectorOpen(true);
  }, []);

  const onBlur = useMemo(() => debounce(() => setSelectorOpen(false), 250), []);

  const onCalendarClick = useCallback(() => debounce(() => onBlur.cancel(), 5), [onBlur]);

  const onDateSelectorChange = (value?: TypeOrArray<Date>) => {
    if (dateSelectionRef.current === DateSelectionType.DateOnly) {
      setSelectorOpen(false);
    }

    onChange?.(value);
  };

  const onClearClick = () => {
    dispatcher({
      type: DateTimeActionType.ClearDates,
    });
    setSelectorOpen(false);

    onChange?.();
  };

  const onDateTimeHidden = () => {
    setSelectorOpen(false);
    dispatcher({
      type: DateTimeActionType.SetDateSelector,
      dateSelector: getDateSelector(),
    });
  };

  const getDateTimeStyle = () => {
    switch (dateFormat) {
      case DateFormatType.Short:
        return 'short';
      case DateFormatType.Medium:
        return 'medium';
      case DateFormatType.Long:
        return 'long';
      default:
        return undefined;
    }
  };

  const getValue = (): string => {
    const dateStyle = getDateTimeStyle();

    switch (dateSelectionRef.current) {
      case DateSelectionType.DateTime:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleString(loadedLocale.current?.code, {
                dateStyle,
                timeStyle: dateStyle,
              })
            : state.selectedDate.toLocaleString(loadedLocale.current?.code)
          : '';
      case DateSelectionType.DateOnly:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleDateString(loadedLocale.current?.code, {
                dateStyle,
              })
            : state.selectedDate.toLocaleDateString(loadedLocale.current?.code)
          : '';
      case DateSelectionType.TimeOnly:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleTimeString(loadedLocale.current?.code, {
                timeStyle: dateStyle,
                hour12: state.timeFormat === TimeFormatType.TwelveHour,
                hourCycle: state.timeFormat === TimeFormatType.TwentyFourHour ? 'h23' : undefined,
              })
            : state.selectedDate.toLocaleTimeString(loadedLocale.current?.code, {
                hour12: state.timeFormat === TimeFormatType.TwelveHour,
                hourCycle: state.timeFormat === TimeFormatType.TwentyFourHour ? 'h23' : undefined,
              })
          : '';
      case DateSelectionType.DateRange:
        return state.selectedStartDate && state.selectedEndDate
          ? dateStyle
            ? `${state.selectedStartDate.toLocaleDateString(loadedLocale.current?.code, {
                dateStyle,
              })} - ${state.selectedEndDate.toLocaleDateString(loadedLocale.current?.code, { dateStyle })}`
            : `${state.selectedStartDate.toLocaleDateString(
                loadedLocale.current?.code
              )} - ${state.selectedEndDate.toLocaleDateString(loadedLocale.current?.code)}`
          : '';
      default:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleString(loadedLocale.current?.code, {
                dateStyle,
                timeStyle: dateStyle,
              })
            : state.selectedDate.toLocaleString(loadedLocale.current?.code)
          : '';
    }
  };

  const canShowDateSelectors = useMemo(
    () =>
      dateSelectionState === DateSelectionType.DateTime ||
      dateSelectionState === DateSelectionType.DateOnly ||
      dateSelectionState === DateSelectionType.DateRange,
    []
  );

  const canShowTimeSelector = useMemo(
    () => dateSelectionState === DateSelectionType.DateTime || dateSelectionState === DateSelectionType.TimeOnly,
    []
  );

  return (
    <HeadlessBase props={finalProps} renderProps={}></HeadlessBase>
  );
};

const HeadlessDateTime = memo(HeadlessDateTimeComponent);
export { HeadlessDateTime };
