import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { getBrowserLanguage, getElementByClassNameRecursive } from '../../common-functions';
import ContentEditableInput from '../content-editable-input/content-editable-input.component';
import OverlayPanel from '../../overlay/overlay-panel/overlay-panel.component';
import DateTimeDaySelector, { DaySelectorTemplate } from './date-time-day-selector.component';
import DateTimeMonthSelector, { MonthSelectorTemplate } from './date-time-month-selector.component';
import DateTimeTimeSelector, { TimeSelectorTemplate } from './date-time-time-selector.component';
import { DateSelectionType, TimeConstraints } from './date-time-types';
import DateTimeYearSelector, { YearSelectorTemplate } from './date-time-year-selector.component';
import reducer, { DateTimeActionType, DateTimeState } from './date-time.reducer';

export interface DateTimeProps {
  value?: string | Date;
  label?: string;
  useDefaultDateValue?: boolean;
  locale?: string;
  dateSelection?: DateSelectionType;
  timeConstraints?: TimeConstraints;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  onChange?: (value: Date) => void;
  daySelectorTemplate?: DaySelectorTemplate;
  monthSelectorTemplate?: MonthSelectorTemplate;
  yearSelectorTemplate?: YearSelectorTemplate;
  timeSelectorTemplate?: TimeSelectorTemplate;
}

export default function DateTime({
  value,
  label,
  useDefaultDateValue = false,
  locale,
  dateSelection = DateSelectionType.DateTime,
  timeConstraints,
  selectableDate,
  isValidDate,
  onChange,
  daySelectorTemplate,
  monthSelectorTemplate,
  yearSelectorTemplate,
  timeSelectorTemplate,
}: DateTimeProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [dropDownTarget, setDropDownTarget] = useState<Element>();
  const language = useRef<string>(locale || getBrowserLanguage());
  const loadedLocale = useRef<Locale>();

  useEffect(() => {
    if (language.current) {
      loadLocale(language.current);
    }
  }, [language]);

  useEffect(() => {
    if (locale) {
      loadLocale(locale);
    }
  }, [locale]);

  useEffect(() => {
    if (value) {
      dispatcher({
        type: DateTimeActionType.InitializeDates,
        initialDate: getDateValue(),
      });
    }
  }, [value]);

  const loadLocale = (localeToLoad: string) => {
    import(`date-fns/locale/${localeToLoad}`)
      .then((locale) => {
        loadedLocale.current = locale.default;
        const defaultDate = getDateValue();

        if (value || useDefaultDateValue) {
          dispatcher({
            type: DateTimeActionType.InitializeDates,
            initialDate: defaultDate,
          });
        } else {
          dispatcher({
            type: DateTimeActionType.SetViewDate,
            viewDate: defaultDate,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  const parseDate = (dateValue: string) => {
    const isoDate = parseISO(dateValue);
    if (isNaN(isoDate.valueOf())) {
      // TODO Add an option for short, medium or long date format and create a proper format string (below) for each
      // this is an attempt to parse a number of date formats
      let localDate = parse(dateValue, 'Ppp', new Date(), { locale: loadedLocale.current });
      if (!isNaN(localDate.valueOf())) return localDate;

      localDate = parse(dateValue, 'P', new Date(), { locale: loadedLocale.current });
      if (!isNaN(localDate.valueOf())) return localDate;

      localDate = parse(dateValue, 'pp', new Date(), { locale: loadedLocale.current });
      if (!isNaN(localDate.valueOf())) return localDate;

      localDate = parse(dateValue, 'p', new Date(), { locale: loadedLocale.current });
      if (!isNaN(localDate.valueOf())) return localDate;

      return undefined;
    }

    return isoDate;
  };

  const getDateValue = () => {
    const defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    return value ? (typeof value === 'string' ? parseDate(value) : value) : defaultDate;
  };

  const initialState: DateTimeState = {
    currentSelector:
      dateSelection === DateSelectionType.TimeOnly ? DateTimeActionType.TimeSelector : DateTimeActionType.DaySelector,
    currentViewDate: new Date(),
    selectedDateChanged: false,
    dateInitialized: false,
  };

  const [state, dispatcher] = useReducer(reducer, initialState);

  const onFocus = (event: React.FocusEvent) => {
    setDropDownElement(event);
    setSelectorOpen(true);
  };

  const onInput = (event: React.FormEvent) => {
    const inputDate = parseDate((event.target as HTMLElement).innerText);
    if (inputDate) {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: inputDate,
      });
      dispatcher({
        type: DateTimeActionType.SetSelectedDate,
        selectedDate: inputDate,
      });
    }
  };

  const onCalendarClick = (event: React.MouseEvent) => {
    setDropDownElement(event);
    setSelectorOpen(!selectorOpen);
  };

  const setDropDownElement = (event: React.FocusEvent | React.MouseEvent) => {
    if (!dropDownTarget) {
      const parentElement = getElementByClassNameRecursive(event.target as HTMLElement, 'parent-element');
      setDropDownTarget(parentElement);
    }
  };

  const onDateTimeHidden = () => {
    setSelectorOpen(false);
    dispatcher({
      type:
        dateSelection === DateSelectionType.TimeOnly ? DateTimeActionType.TimeSelector : DateTimeActionType.DaySelector,
    });

    if (onChange && state.selectedDate && state.selectedDateChanged) {
      onChange(state.selectedDate);
      dispatcher({
        type: DateTimeActionType.ResetSelectedDateChanged,
        selectedDate: state.selectedDate,
      });
    }
  };

  const getValue = () => {
    switch (dateSelection) {
      case DateSelectionType.DateTime:
        return state.selectedDate ? state.selectedDate.toLocaleString(language.current) : '';
      case DateSelectionType.DateOnly:
        return state.selectedDate ? state.selectedDate.toLocaleDateString(language.current) : '';
      case DateSelectionType.TimeOnly:
        return state.selectedDate ? state.selectedDate.toLocaleTimeString(language.current) : '';
      default:
        return state.selectedDate ? state.selectedDate.toLocaleString(language.current) : '';
    }
  };

  const canShowDateSelectors =
    dateSelection === DateSelectionType.DateTime || dateSelection === DateSelectionType.DateOnly;

  const canShowTimeSelector =
    dateSelection === DateSelectionType.DateTime || dateSelection === DateSelectionType.TimeOnly;

  return (
    <div>
      {label && <label className="dark:text-white">{label}</label>}
      <ContentEditableInput
        value={getValue()}
        className="parent-element text-left"
        rightElement={<FontAwesomeIcon icon={['far', 'calendar-alt']} />}
        rightElementClassName="cursor-pointer"
        onRightElementClick={onCalendarClick}
        onFocus={onFocus}
        onInput={onInput}
      />
      <OverlayPanel
        visible={selectorOpen}
        target={dropDownTarget}
        shouldTargetCloseOverlay={false}
        hidden={onDateTimeHidden}
      >
        <>
          {state.currentSelector === DateTimeActionType.DaySelector &&
            canShowDateSelectors &&
            state.dateInitialized &&
            loadedLocale.current && (
              <DateTimeDaySelector
                selectedDate={state.selectedDate}
                viewDate={state.currentViewDate}
                locale={loadedLocale.current}
                showTimeSelector={dateSelection === DateSelectionType.DateTime}
                selectableDate={selectableDate}
                isValidDate={isValidDate}
                dispatcher={dispatcher}
                viewTemplate={daySelectorTemplate}
              />
            )}
          {state.currentSelector === DateTimeActionType.MonthSelector &&
            canShowDateSelectors &&
            state.dateInitialized &&
            loadedLocale.current && (
              <DateTimeMonthSelector
                viewDate={state.currentViewDate}
                locale={loadedLocale.current}
                viewTemplate={monthSelectorTemplate}
                dispatcher={dispatcher}
              />
            )}
          {state.currentSelector === DateTimeActionType.YearSelector &&
            canShowDateSelectors &&
            state.dateInitialized &&
            loadedLocale.current && (
              <DateTimeYearSelector
                viewDate={state.currentViewDate}
                locale={loadedLocale.current}
                viewTemplate={yearSelectorTemplate}
                dispatcher={dispatcher}
              />
            )}
          {state.currentSelector === DateTimeActionType.TimeSelector &&
            canShowTimeSelector &&
            state.dateInitialized &&
            loadedLocale.current && (
              <DateTimeTimeSelector
                viewDate={state.currentViewDate}
                showDateSelector={dateSelection === DateSelectionType.DateTime}
                locale={loadedLocale.current}
                viewTemplate={timeSelectorTemplate}
                timeConstraints={timeConstraints}
                dispatcher={dispatcher}
              />
            )}
        </>
      </OverlayPanel>
    </div>
  );
}
