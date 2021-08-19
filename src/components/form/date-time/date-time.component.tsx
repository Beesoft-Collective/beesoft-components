import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { getBrowserLanguage, getElementByClassNameRecursive } from '../../common-functions';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import OverlayPanel from '../../overlay/overlay-panel/overlay-panel.component';
import ContentEditableInput from '../content-editable-input/content-editable-input.component';
import { DateTimeCalendarTemplate } from './date-time-calendar.component';
import { DateTimeContext, DateTimeContextProps } from './date-time-context';
import DateTimeDaySelector from './date-time-day-selector.component';
import { loadLocale } from './date-time-functions';
import DateTimeMonthSelector from './date-time-month-selector.component';
import DateTimeRangeSelector from './date-time-range-selector.component';
import { DateTimeScrollerTemplate } from './date-time-scroller.component';
import DateTimeTimeSelector from './date-time-time-selector.component';
import { CalendarIconPosition, DateFormatType, DateSelectionType, TimeConstraints } from './date-time-types';
import DateTimeYearSelector from './date-time-year-selector.component';
import reducer, { DateTimeActionType, DateTimeState } from './date-time.reducer';

export interface DateTimeProps {
  value?: string | Date | Array<Date>;
  readOnly?: boolean;
  label?: string;
  useDefaultDateValue?: boolean;
  locale?: string;
  dateSelection?: DateSelectionType;
  dateFormat?: DateFormatType;
  timeConstraints?: TimeConstraints;
  icon?: JSX.Element;
  iconPosition?: CalendarIconPosition;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  onChange?: (value: Date | Array<Date>) => void;
  calendarTemplate?: DateTimeCalendarTemplate;
  dateScrollerTemplate?: DateTimeScrollerTemplate;
  inputTemplate?: DateTimeInputTemplate;
}

export interface DateTimeInputTemplateProps {
  label?: string;
  readOnly: boolean;
  getValue: () => string;
  onFocus: (event: React.FocusEvent) => void;
  onInput: (event: React.FormEvent) => void;
  iconPosition: CalendarIconPosition;
  iconElement: JSX.Element;
  iconElementClassName?: string;
  onElementClick?: (event: React.MouseEvent) => void;
}

export type DateTimeInputTemplate = TemplateFunction<DateTimeInputTemplateProps>;

export default function DateTime({
  value,
  readOnly = false,
  label,
  useDefaultDateValue = false,
  locale,
  dateSelection = DateSelectionType.DateTime,
  dateFormat,
  timeConstraints,
  icon,
  iconPosition = CalendarIconPosition.Right,
  selectableDate,
  isValidDate,
  onChange,
  calendarTemplate,
  dateScrollerTemplate,
  inputTemplate,
}: DateTimeProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [dropDownTarget, setDropDownTarget] = useState<Element>();
  const language = useRef<string>(locale || getBrowserLanguage());
  const loadedLocale = useRef<Locale>();

  const contextProps: DateTimeContextProps = {
    calendarTemplate,
    dateScrollerTemplate,
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
    }
  }, [value, loadedLocale.current]);

  const loadLocaleObject = (localeToLoad: string) => {
    loadLocale(localeToLoad)
      .then((locale) => {
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

  const parseDate = (dateValue: string) => {
    const isoDate = parseISO(dateValue);
    if (isNaN(isoDate.valueOf())) {
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

  const parseDateRange = (dateRangeValue: string) => {
    const datesToParse = dateRangeValue.split('-');
    if (datesToParse.length !== 2) return undefined;

    const dateValue1 = parseDate(datesToParse[0].trim());
    if (!dateValue1) return undefined;

    const dateValue2 = parseDate(datesToParse[1].trim());
    if (!dateValue2) return undefined;

    return [dateValue1, dateValue2];
  };

  const getDateValue = () => {
    const defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    return value
      ? typeof value === 'string'
        ? dateSelection !== DateSelectionType.DateRange
          ? parseDate(value)
          : parseDateRange(value)
        : value
      : defaultDate;
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

    if (onChange && dateSelection !== DateSelectionType.DateRange && state.selectedDate && state.selectedDateChanged) {
      onChange(state.selectedDate);
      dispatcher({
        type: DateTimeActionType.ResetSelectedDateChanged,
        selectedDate: state.selectedDate,
      });
    } else if (onChange && state.selectedStartDate && state.selectedEndDate && state.selectedDateChanged) {
      onChange([state.selectedStartDate, state.selectedEndDate]);
      dispatcher({
        type: DateTimeActionType.ResetSelectedDateRangeChanged,
        selectedStartDate: state.selectedStartDate,
        selectedEndDate: state.selectedEndDate,
      });
    }
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

    switch (dateSelection) {
      case DateSelectionType.DateTime:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleString(loadedLocale.current?.code, {
                dateStyle: dateStyle,
                timeStyle: dateStyle,
              })
            : state.selectedDate.toLocaleString(loadedLocale.current?.code)
          : '';
      case DateSelectionType.DateOnly:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleDateString(loadedLocale.current?.code, {
                dateStyle: dateStyle,
                timeStyle: dateStyle,
              })
            : state.selectedDate.toLocaleString(loadedLocale.current?.code)
          : '';
      case DateSelectionType.TimeOnly:
        return state.selectedDate
          ? dateStyle
            ? state.selectedDate.toLocaleTimeString(loadedLocale.current?.code, {
                dateStyle: dateStyle,
                timeStyle: dateStyle,
              })
            : state.selectedDate.toLocaleString(loadedLocale.current?.code)
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
                dateStyle: dateStyle,
                timeStyle: dateStyle,
              })
            : state.selectedDate.toLocaleString(loadedLocale.current?.code)
          : '';
    }
  };

  const canShowDateSelectors =
    dateSelection === DateSelectionType.DateTime || dateSelection === DateSelectionType.DateOnly;

  const canShowTimeSelector =
    dateSelection === DateSelectionType.DateTime || dateSelection === DateSelectionType.TimeOnly;

  const inputProps =
    iconPosition === CalendarIconPosition.Right
      ? {
          rightElement: icon || <FontAwesomeIcon icon={['far', 'calendar-alt']} />,
          rightElementClassName: !readOnly ? 'cursor-pointer' : undefined,
          onRightElementClick: !readOnly ? onCalendarClick : undefined,
        }
      : {
          leftElement: icon || <FontAwesomeIcon icon={['far', 'calendar-alt']} />,
          leftElementClassName: !readOnly ? 'cursor-pointer' : undefined,
          onLeftElementClick: !readOnly ? onCalendarClick : undefined,
        };

  const inputTemplateProps: DateTimeInputTemplateProps = {
    label,
    readOnly,
    getValue,
    onFocus,
    onInput,
    iconPosition,
    iconElement: inputProps.rightElement || inputProps.leftElement,
    iconElementClassName: inputProps.rightElementClassName || inputProps.leftElementClassName,
    onElementClick: inputProps.onRightElementClick || inputProps.onLeftElementClick,
  };

  const defaultTemplate = (props: DateTimeInputTemplateProps, children: React.ReactNode | React.ReactNodeArray) => (
    <>{children}</>
  );

  const template = inputTemplate || defaultTemplate;

  return (
    <DateTimeContext.Provider value={contextProps}>
      <div className="bc-date-time">
        <TemplateOutlet props={inputTemplateProps} template={template}>
          {label && <label className="dark:text-white bc-dt-label">{label}</label>}
          <ContentEditableInput
            value={getValue()}
            readOnly={readOnly}
            className={`parent-element text-left${readOnly ? ' bg-gray-200' : ' bg-white'} dark:bg-black bc-dt-input`}
            onFocus={onFocus}
            onInput={onInput}
            {...inputProps}
          />
        </TemplateOutlet>
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
                />
              )}
            {state.currentSelector === DateTimeActionType.MonthSelector &&
              canShowDateSelectors &&
              state.dateInitialized &&
              loadedLocale.current && (
                <DateTimeMonthSelector
                  viewDate={state.currentViewDate}
                  locale={loadedLocale.current}
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
                  timeConstraints={timeConstraints}
                  dispatcher={dispatcher}
                />
              )}
            {dateSelection === DateSelectionType.DateRange && state.dateInitialized && loadedLocale.current && (
              <DateTimeRangeSelector
                viewDate={state.currentViewDate}
                selectedStartDate={state.selectedStartDate}
                selectedEndDate={state.selectedEndDate}
                locale={loadedLocale.current}
                dispatcher={dispatcher}
              />
            )}
          </>
        </OverlayPanel>
      </div>
    </DateTimeContext.Provider>
  );
}
