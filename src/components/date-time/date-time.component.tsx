import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { getBrowserLanguage, getElementByClassNameRecursive } from '../common-functions';
import ContentEditableInput from '../content-editable-input/content-editable-input.component';
import OverlayPanel from '../overlay-panel/overlay-panel.component';
import DateTimeDaySelector from './date-time-day-selector.component';
import { getDefaultTime } from './date-time-functions';
import DateTimeMonthSelector from './date-time-month-selector.component';
import DateTimeTimeSelector from './date-time-time-selector.component';
import { TimeConstraints } from './date-time-types';
import DateTimeYearSelector from './date-time-year-selector.component';
import reducer, { DateTimeActionType, DateTimeState } from './date-time.reducer';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';

export interface DateTimeProps {
  value?: string | Date;
  label?: string;
  locale?: string;
  format?: string;
  timeConstraints?: TimeConstraints;
  onChange?: (value: Date) => void;
}

export default function DateTime({ value, label, locale, format, timeConstraints, onChange }: DateTimeProps) {
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

  const loadLocale = (localeToLoad: string) => {
    import(`date-fns/locale/${localeToLoad}`).then((locale) => {
      loadedLocale.current = locale.default;
      const defaultDate = getDateValue();

      dispatcher({
        type: DateTimeActionType.InitializeDates,
        initialDate: defaultDate,
      });
    });
  };

  const parseDate = (dateValue: string) => {
    const isoDate = parseISO(dateValue);
    if (isNaN(isoDate.valueOf())) {
      // TODO Add an option for short, medium or long date format and create a proper format string (below) for each
      return parse(dateValue, 'Ppp', new Date(), { locale: loadedLocale.current });
    }

    return isoDate;
  };

  const getDateValue = () => {
    const defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    return value ? (typeof value === 'string' ? parseDate(value) : value) : defaultDate;
  };

  const initialState: DateTimeState = {
    currentSelector: DateTimeActionType.DaySelector,
    currentViewDate: new Date(),
    selectedDate: new Date(),
    originalSetDate: new Date(),
    selectedDateChanged: false,
  };

  const [state, dispatcher] = useReducer(reducer, initialState);

  const onFocus = (event: React.FocusEvent) => {
    setDropDownElement(event);
    setSelectorOpen(true);
  };

  const onInput = (event: React.FormEvent) => {
    // const inputDate = parseLocaleDate((event.target as HTMLElement).innerText, language.current);
    const inputDate = parse((event.target as HTMLElement).innerText, 'Ppp', new Date(), {
      locale: loadedLocale.current,
    });
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: inputDate,
    });
    dispatcher({
      type: DateTimeActionType.SetSelectedDate,
      selectedDate: inputDate,
    });
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
      type: DateTimeActionType.DaySelector,
    });

    if (onChange && state.selectedDateChanged) {
      onChange(state.selectedDate);
      dispatcher({
        type: DateTimeActionType.ResetSelectedDateChanged,
        selectedDate: state.selectedDate,
      });
    }
  };

  const onTimeClicked = () => {
    dispatcher({
      type: DateTimeActionType.TimeSelector,
    });
  };

  const getValue = () => `${state.selectedDate.toLocaleString(language.current)}`;

  return (
    <div>
      {label && <label>{label}</label>}
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
          {state.currentSelector === DateTimeActionType.DaySelector && (
            <DateTimeDaySelector
              selectedDate={state.selectedDate}
              viewDate={state.currentViewDate}
              dispatcher={dispatcher}
            />
          )}
          {state.currentSelector === DateTimeActionType.MonthSelector && (
            <DateTimeMonthSelector viewDate={state.currentViewDate} dispatcher={dispatcher} />
          )}
          {state.currentSelector === DateTimeActionType.YearSelector && (
            <DateTimeYearSelector viewDate={state.currentViewDate} dispatcher={dispatcher} />
          )}
          {state.currentSelector === DateTimeActionType.TimeSelector && (
            <DateTimeTimeSelector
              viewDate={state.currentViewDate}
              dispatcher={dispatcher}
              timeConstraints={timeConstraints}
            />
          )}
          {state.currentSelector === DateTimeActionType.DaySelector && (
            <div className="w-full flex flex-row p-2 justify-center">
              <div className="p-2 cursor-pointer hover:bg-gray-300" onClick={onTimeClicked}>
                {state.selectedDate?.toLocaleTimeString(language.current) || getDefaultTime(language.current)}
              </div>
            </div>
          )}
        </>
      </OverlayPanel>
    </div>
  );
}
