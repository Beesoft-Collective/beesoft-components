import { debounce, useDeepMemo, useStateRef } from '@beesoft/common';
import { Signal, useSignal } from '@preact/signals-react';
import { Locale } from 'date-fns';
import { memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getBrowserLanguage } from '../../../../components/common-functions.ts';
import { Partial } from '../../../../components/form/checkboxes/checkbox/checkbox.component.stories.tsx';
import { loadLocale, parseDate, parseDateRange } from '../../../../components/form/date-time/date-time-functions.ts';
import useGetDateTimeFormat from '../../../../components/form/date-time/hooks/get-date-time-format.hook.ts';
import { HeadlessBase } from '../../../architecture/components/headless-base.component.tsx';
import { HeadlessProvider } from '../../../architecture/components/headless-provider.component.tsx';
import { DateFormatType, DateSelectionType, DateSelectorType, TimeFormatType } from './date-time-types.ts';
import { HeadlessDateTimeSelectorProps } from './headless-date-time-selector.props.ts';
import { HeadlessDateTimeProps, HeadlessDateTimeRenderProps } from './headless-date-time.props.ts';
import reducer, { HeadlessDateTimeActionType, HeadlessDateTimeState } from './headless-date-time.reducer.ts';

const HeadlessDateTimeComponent = ({
  value,
  readOnly = false,
  useDefaultDateValue = false,
  allowClear = false,
  locale,
  dateSelection = DateSelectionType.DateTime,
  dateFormat,
  timeConstraints,
  onChange,
  children,
}: HeadlessDateTimeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [localeCode, setLocaleCode] = useState<string>();
  const [loadedLocale, setLoadedLocale, loadedLocaleRef] = useStateRef<Locale>();

  const language = useRef<string>(locale || getBrowserLanguage());
  // const loadedLocale = useRef<Locale>();

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
    onChange,
  };

  const getDateSelector = useCallback(() => {
    return dateSelection === DateSelectionType.TimeOnly
      ? DateSelectorType.TimeSelector
      : dateSelection === DateSelectionType.DateTime || dateSelection === DateSelectionType.DateOnly
        ? DateSelectorType.DaySelector
        : DateSelectorType.DateRangeSelector;
  }, [dateSelection]);

  const initialState: HeadlessDateTimeState = {
    currentSelector: getDateSelector(),
    currentViewDate: new Date(),
    timeFormat: TimeFormatType.TwelveHour,
    dateInitialized: false,
  };

  const [state, dispatcher] = useReducer(reducer, initialState);

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
        type: HeadlessDateTimeActionType.InitializeDates,
        initialDate: dateValue,
      });
    } else {
      dispatcher({
        type: HeadlessDateTimeActionType.ClearDates,
      });
    }
  }, [value, loadedLocaleRef.current]);

  useEffect(() => {
    if (use24HourTime) {
      dispatcher({
        type: HeadlessDateTimeActionType.SetTimeFormat,
        timeFormat: use24HourTime ? TimeFormatType.TwentyFourHour : TimeFormatType.TwelveHour,
      });
    }
  }, [use24HourTime]);

  useEffect(() => {
    dispatcher({
      type: HeadlessDateTimeActionType.SetDateSelector,
      dateSelector: getDateSelector(),
    });
  }, [dateSelection]);

  const loadLocaleObject = (localeToLoad: string) => {
    loadLocale(localeToLoad)
      .then((locale) => {
        setLocaleCode(locale.code);
        setLoadedLocale(locale);
        const defaultDate = getDateValue();

        if (value || useDefaultDateValue) {
          dispatcher({
            type: HeadlessDateTimeActionType.InitializeDates,
            initialDate: !Array.isArray(defaultDate) ? defaultDate : defaultDate[0],
          });
        } else {
          dispatcher({
            type: HeadlessDateTimeActionType.SetViewDate,
            viewDate: !Array.isArray(defaultDate) ? defaultDate : defaultDate[0],
          });
        }
      })
      .catch((error) => console.error(error));
  };

  const getDateValue = useCallback(() => {
    const defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    return value
      ? typeof value === 'string'
        ? dateSelection !== DateSelectionType.DateRange
          ? parseDate(value, loadedLocaleRef.current)
          : parseDateRange(value, loadedLocaleRef.current)
        : value
      : defaultDate;
  }, [value, dateSelection]);

  const onFocus = useCallback(() => {
    setSelectorOpen(true);
  }, []);

  const onBlur = useCallback(
    debounce(() => setSelectorOpen(false), 250),
    []
  );

  const onCalendarClick = useCallback(
    debounce(() => onBlur.cancel(), 5),
    [onBlur]
  );

  const onClearClick = useCallback(() => {
    dispatcher({
      type: HeadlessDateTimeActionType.ClearDates,
    });
    setSelectorOpen(false);

    onChange?.();
  }, [onChange]);

  const onDateTimeHidden = useCallback(() => {
    setSelectorOpen(false);
    dispatcher({
      type: HeadlessDateTimeActionType.SetDateSelector,
      dateSelector: getDateSelector(),
    });
  }, []);

  const getDateTimeStyle = useCallback(() => {
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
  }, [dateFormat]);

  const getValue = useCallback((): string => {
    const dateStyle = getDateTimeStyle();

    switch (dateSelection) {
      case DateSelectionType.DateTime:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleString(loadedLocaleRef.current?.code, {
                dateStyle,
                timeStyle: dateStyle,
              })
            : state.selectedDate.toLocaleString(loadedLocaleRef.current?.code)
          : '';
      case DateSelectionType.DateOnly:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleDateString(loadedLocaleRef.current?.code, {
                dateStyle,
              })
            : state.selectedDate.toLocaleDateString(loadedLocaleRef.current?.code)
          : '';
      case DateSelectionType.TimeOnly:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleTimeString(loadedLocaleRef.current?.code, {
                timeStyle: dateStyle,
                hour12: state.timeFormat === TimeFormatType.TwelveHour,
                hourCycle: state.timeFormat === TimeFormatType.TwentyFourHour ? 'h23' : undefined,
              })
            : state.selectedDate.toLocaleTimeString(loadedLocaleRef.current?.code, {
                hour12: state.timeFormat === TimeFormatType.TwelveHour,
                hourCycle: state.timeFormat === TimeFormatType.TwentyFourHour ? 'h23' : undefined,
              })
          : '';
      case DateSelectionType.DateRange:
        return state.selectedStartDate && state.selectedEndDate
          ? dateStyle
            ? `${state.selectedStartDate.toLocaleDateString(loadedLocaleRef.current?.code, {
                dateStyle,
              })} - ${state.selectedEndDate.toLocaleDateString(loadedLocaleRef.current?.code, { dateStyle })}`
            : `${state.selectedStartDate.toLocaleDateString(
                loadedLocaleRef.current?.code
              )} - ${state.selectedEndDate.toLocaleDateString(loadedLocaleRef.current?.code)}`
          : '';
      default:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleString(loadedLocaleRef.current?.code, {
                dateStyle,
                timeStyle: dateStyle,
              })
            : state.selectedDate.toLocaleString(loadedLocaleRef.current?.code)
          : '';
    }
  }, [getDateTimeStyle, dateSelection, state.selectedDate, state.selectedStartDate, state.selectedEndDate]);

  const canShowDateSelectors = useMemo(
    () =>
      dateSelection === DateSelectionType.DateTime ||
      dateSelection === DateSelectionType.DateOnly ||
      dateSelection === DateSelectionType.DateRange,
    [dateSelection]
  );

  const canShowTimeSelector = useMemo(
    () => dateSelection === DateSelectionType.DateTime || dateSelection === DateSelectionType.TimeOnly,
    [dateSelection]
  );

  const renderProps = useDeepMemo<HeadlessDateTimeRenderProps>(() => {
    return {
      ...finalProps,
      selectorOpen,
      canShowDateSelectors,
      canShowTimeSelector,
      inputFormat,
      onFocus,
      onBlur,
      onCalendarClick,
      onClearClick,
      onDateTimeHidden,
      getValue,
    };
  }, [
    finalProps,
    selectorOpen,
    canShowDateSelectors,
    canShowTimeSelector,
    inputFormat,
    onCalendarClick,
    onClearClick,
    getValue,
  ]);

  const selectorDataSignal = useSignal<Partial<HeadlessDateTimeSelectorProps>>({});

  const headlessContext: Record<string, Signal<unknown>> = useMemo(() => {
    return {
      selector: selectorDataSignal,
    };
  }, []);

  useEffect(() => {
    selectorDataSignal.value = {
      selectedDate: state.selectedDate,
      viewDate: state.currentViewDate,
      selectedStartDate: state.selectedStartDate,
      selectedEndDate: state.selectedEndDate,
      locale: loadedLocale,
      dateSelection,
      timeFormat: state.timeFormat,
      timeConstraints,
      showDateSelector: canShowDateSelectors,
      showTimeSelector: canShowTimeSelector,
      onChange,
    };
  }, [
    state.selectedDate,
    state.currentViewDate,
    state.selectedStartDate,
    state.selectedEndDate,
    loadedLocale,
    dateSelection,
    state.timeFormat,
    timeConstraints,
    canShowDateSelectors,
    canShowTimeSelector,
  ]);

  return (
    <HeadlessProvider props={headlessContext}>
      <HeadlessBase props={finalProps} renderProps={renderProps}>
        {children}
      </HeadlessBase>
    </HeadlessProvider>
  );
};

const HeadlessDateTime = memo(HeadlessDateTimeComponent);
export { HeadlessDateTime };
