import { TypeOrArray, useStateRef } from '@beesoft/common';
import cx from 'classnames';
import { addMonths, endOfMonth, Locale, startOfMonth } from 'date-fns';
import { debounce } from 'lodash-es';
import React, { ReactNode, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getBrowserLanguage } from '../../common-functions';
import { BeeSoftIcon } from '../../common/beesoft-icon/beesoft-icon.component.tsx';
import { IconSize } from '../../common/beesoft-icon/beesoft-icon.props.ts';
import { Label } from '../../common/label/label.component.tsx';
import TemplateOutlet from '../../common/template-outlet/template-outlet.component';
import { MediaQuery } from '../../mobile/media-query/media-query.component.tsx';
import { MobileOverlayPanel } from '../../mobile/overlay/mobile-overlay-panel.component.tsx';
import OverlayPanel from '../../overlay/overlay-panel/overlay-panel.component';
import ContentEditableInput from '../inputs/content-editable-input/content-editable-input.component';
import FormattedInput from '../inputs/formatted-input/formatted-input.component';
import { DateTimeContext, DateTimeContextProps } from './date-time-context';
import DateTimeDaySelector from './date-time-day-selector.component';
import { isDateBetween, loadLocale, parseDate, parseDateRange } from './date-time-functions';
import DateTimeMonthSelector from './date-time-month-selector.component';
import DateTimeRangeSelector from './date-time-range-selector.component';
import DateTimeTimeSelector from './date-time-time-selector.component';
import {
  CalendarIconPosition,
  DateFormatType,
  DateSelectionType,
  DateSelectorType,
  TimeFormatType,
} from './date-time-types';
import DateTimeYearSelector from './date-time-year-selector.component';
import {
  DateTimeInputTemplateProps,
  DateTimeProps,
  DateTimeWrapperTemplate,
  DateTimeWrapperTemplateProps,
} from './date-time.props.ts';
import reducer, { DateTimeActionType, DateTimeState } from './date-time.reducer';
import useGetDateTimeFormat from './hooks/get-date-time-format.hook';

const DateTime = ({
  value,
  readOnly = false,
  label,
  useDefaultDateValue = false,
  useFormattedInput = false,
  allowClear = false,
  closeSelector = false,
  locale,
  className,
  dateSelection = DateSelectionType.DateTime,
  dateFormat,
  timeConstraints,
  icon,
  iconPosition = CalendarIconPosition.Right,
  inputElement,
  selectableDate,
  isValidDate,
  onChange,
  calendarTemplate,
  dateScrollerTemplate,
  inputTemplate,
  wrapperTemplate,
}: DateTimeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [localeCode, setLocaleCode] = useState<string>();
  const [dropDownTarget, setDropDownTarget] = useState<Element>();

  const [dateSelectionState, setDateSelectionState, dateSelectionRef] = useStateRef(dateSelection);

  const isFormattedInput = useRef<boolean>();
  const inputElementChanged = useRef(false);
  const language = useRef<string>(locale || getBrowserLanguage());
  const loadedLocale = useRef<Locale>();
  const inputElementRef = useRef<HTMLElement>();
  const dropDownTargetRef = useRef<HTMLElement>();

  const [inputFormat, use24HourTime] = useGetDateTimeFormat(dateSelection, localeCode);

  const contextProps = useRef<DateTimeContextProps>({
    calendarTemplate,
    dateScrollerTemplate,
  });

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
    if (inputElement) {
      inputElementRef.current = inputElement;
    }
  }, [inputElement]);

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

  const onFocus = () => {
    setDropDownElement();
    setSelectorOpen(true);
  };

  const onBlur = useMemo(
    () =>
      debounce(() => {
        setSelectorOpen(false);
      }, 250),
    []
  );

  const onCalendarClick = useMemo(
    () =>
      debounce(() => {
        onBlur.cancel();
      }, 5),
    [onBlur]
  );

  const onInput = (event: React.FormEvent) => {
    const dateString = (event.target as HTMLElement).innerText;
    onDateStringChange(dateString);
  };

  const isValidFormatString = (value?: string) => {
    if (value) {
      const dateValue =
        dateSelectionRef.current !== DateSelectionType.DateRange
          ? parseDate(value, loadedLocale.current)
          : parseDateRange(value, loadedLocale.current);
      if (dateValue) {
        if (isValidDate) {
          return !Array.isArray(dateValue) ? isValidDate(dateValue) : dateValue.every((date) => isValidDate(date));
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const onFormatStringChange = (formattedText?: string) => {
    onDateStringChange(formattedText || '');
  };

  const onDateStringChange = (dateString: string) => {
    const inputDate =
      dateSelectionRef.current !== DateSelectionType.DateRange
        ? parseDate(dateString, loadedLocale.current)
        : parseDateRange(dateString, loadedLocale.current);

    if (inputDate) {
      if (!Array.isArray(inputDate)) {
        dispatcher({
          type: DateTimeActionType.SetSelectedDate,
          selectedDate: inputDate,
          viewDate: inputDate,
        });
      } else {
        if (
          !isDateBetween(
            inputDate[0],
            startOfMonth(state.currentViewDate),
            endOfMonth(addMonths(state.currentViewDate, 1))
          )
        ) {
          dispatcher({
            type: DateTimeActionType.SetViewDate,
            viewDate: inputDate[0],
          });
        }

        dispatcher({
          type: DateTimeActionType.SetSelectedDateRange,
          selectedStartDate: inputDate[0],
          selectedEndDate: inputDate[1],
        });
      }

      onChange?.(inputDate);
    } else if (dateString === '') {
      dispatcher({
        type: DateTimeActionType.ClearDates,
      });

      onChange?.();
    }
  };

  const onDateSelectorChange = (value?: TypeOrArray<Date>) => {
    if (dateSelectionRef.current === DateSelectionType.DateOnly && closeSelector === true) {
      setSelectorOpen(false);
    }

    onChange?.(value);
  };

  const onCalendarIconClick = () => {
    setDropDownElement();
    setSelectorOpen(!selectorOpen);
  };

  const onClearClick = () => {
    dispatcher({
      type: DateTimeActionType.ClearDates,
    });
    setSelectorOpen(false);

    onChange?.();
  };

  const onInputElementCreated = (element: HTMLElement, formattedInput: boolean) => {
    if (!inputElementRef.current || isFormattedInput.current !== formattedInput) {
      inputElementRef.current = element;
      isFormattedInput.current = formattedInput;
      inputElementChanged.current = true;
    }
  };

  const setDropDownElement = () => {
    if ((!dropDownTargetRef.current || inputElementChanged.current) && inputElementRef.current) {
      dropDownTargetRef.current = inputElementRef.current;
      setDropDownTarget(inputElementRef.current);
      inputElementChanged.current = false;
    }
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

  const canShowDateSelectors =
    dateSelectionState === DateSelectionType.DateTime ||
    dateSelectionState === DateSelectionType.DateOnly ||
    dateSelectionState === DateSelectionType.DateRange;

  const canShowTimeSelector =
    dateSelectionState === DateSelectionType.DateTime || dateSelectionState === DateSelectionType.TimeOnly;

  const inputProps =
    iconPosition === CalendarIconPosition.None
      ? {}
      : iconPosition === CalendarIconPosition.Right
        ? {
            rightElement: (
              <div className="bsc-flex bsc-text-black dark:bsc-text-mono-light-1">
                {allowClear && !readOnly && (
                  <div>
                    <BeeSoftIcon
                      icon="close"
                      size={IconSize.Small}
                      className="bsc-cursor-pointer bsc-text-sm"
                      onClick={onClearClick}
                    />
                  </div>
                )}
                <div className="bsc-ml-2" onClick={!readOnly ? onCalendarIconClick : undefined}>
                  {icon || (
                    <BeeSoftIcon
                      icon="calendar"
                      size={IconSize.Small}
                      className={!readOnly ? 'bsc-cursor-pointer' : undefined}
                    />
                  )}
                </div>
              </div>
            ),
            rightElementClassName: 'bsc-justify-center',
          }
        : {
            leftElement: (
              <div className="bsc-flex bsc-text-black dark:bsc-text-mono-light-1">
                <div className="bsc-mr-2" onClick={!readOnly ? onCalendarIconClick : undefined}>
                  {icon || (
                    <BeeSoftIcon
                      icon="calendar"
                      size={IconSize.Small}
                      className={!readOnly ? 'bsc-cursor-pointer' : undefined}
                    />
                  )}
                </div>
                {allowClear && !readOnly && (
                  <div>
                    <BeeSoftIcon
                      icon="close"
                      size={IconSize.Small}
                      className="bsc-cursor-pointer bsc-text-sm"
                      onClick={onClearClick}
                    />
                  </div>
                )}
              </div>
            ),
            leftElementClassName: 'bsc-justify-center',
          };

  const wrapperTemplateProps: DateTimeWrapperTemplateProps = {
    setDateSelector: (selector) => setDateSelectionState(selector),
  };

  const defaultWrapperTemplate: DateTimeWrapperTemplate = (_props, children) => {
    return <>{children}</>;
  };

  const finalWrapperTemplate = wrapperTemplate || defaultWrapperTemplate;

  const renderSelector = () => (
    <TemplateOutlet props={wrapperTemplateProps} template={finalWrapperTemplate}>
      <>
        {state.currentSelector === DateSelectorType.DaySelector &&
          canShowDateSelectors &&
          state.dateInitialized &&
          loadedLocale.current && (
            <DateTimeDaySelector
              selectedDate={state.selectedDate}
              viewDate={state.currentViewDate}
              locale={loadedLocale.current}
              showTimeSelector={dateSelectionRef.current === DateSelectionType.DateTime}
              selectableDate={selectableDate}
              isValidDate={isValidDate}
              dispatcher={dispatcher}
              onChange={onDateSelectorChange}
            />
          )}
        {state.currentSelector === DateSelectorType.MonthSelector &&
          canShowDateSelectors &&
          state.dateInitialized &&
          loadedLocale.current && (
            <DateTimeMonthSelector
              viewDate={state.currentViewDate}
              locale={loadedLocale.current}
              dateSelection={dateSelectionRef.current}
              dispatcher={dispatcher}
            />
          )}
        {state.currentSelector === DateSelectorType.YearSelector &&
          canShowDateSelectors &&
          state.dateInitialized &&
          loadedLocale.current && (
            <DateTimeYearSelector
              viewDate={state.currentViewDate}
              locale={loadedLocale.current}
              dispatcher={dispatcher}
            />
          )}
        {state.currentSelector === DateSelectorType.TimeSelector &&
          canShowTimeSelector &&
          state.dateInitialized &&
          loadedLocale.current && (
            <DateTimeTimeSelector
              viewDate={state.currentViewDate}
              showDateSelector={dateSelectionRef.current === DateSelectionType.DateTime}
              locale={loadedLocale.current}
              timeFormat={state.timeFormat}
              timeConstraints={timeConstraints}
              onChange={onChange}
              dispatcher={dispatcher}
            />
          )}
        {state.currentSelector === DateSelectorType.DateRangeSelector &&
          canShowDateSelectors &&
          state.dateInitialized &&
          loadedLocale.current && (
            <DateTimeRangeSelector
              viewDate={state.currentViewDate}
              selectedStartDate={state.selectedStartDate}
              selectedEndDate={state.selectedEndDate}
              locale={loadedLocale.current}
              onChange={onChange}
              dispatcher={dispatcher}
            />
          )}
      </>
    </TemplateOutlet>
  );

  const inputTemplateProps: DateTimeInputTemplateProps = {
    label,
    readOnly,
    allowClear,
    getValue,
    onFocus,
    onInput,
    iconPosition,
    iconElement: inputProps.rightElement || inputProps.leftElement,
  };

  const defaultInputTemplate = (_props: DateTimeInputTemplateProps, children: ReactNode | Array<ReactNode>) => (
    <>{children}</>
  );

  const finalInputTemplate = inputTemplate || defaultInputTemplate;

  const inputStyles = cx(
    'bsc-text-left',
    {
      'bc-read-only bsc-bg-gray-4 dark:bsc-bg-mono-dark-3': readOnly,
      'bsc-bg-white dark:bsc-bg-mono-dark-1': !readOnly,
    },
    `bc-dt-input`,
    className
  );

  return (
    <DateTimeContext.Provider value={contextProps.current}>
      <div className="bc-date-time">
        {label && <Label label={label} readOnly={readOnly} className="bc-dt-label" />}
        <MediaQuery
          mobileMarkup={
            <>
              <TemplateOutlet props={inputTemplateProps} template={finalInputTemplate}>
                <ContentEditableInput
                  value={getValue()}
                  readOnly={readOnly}
                  inputMode="none"
                  className={inputStyles}
                  onFocus={onFocus}
                  onElementCreate={(element) => onInputElementCreated(element, false)}
                  {...inputProps}
                />
              </TemplateOutlet>
              <MobileOverlayPanel
                visible={selectorOpen}
                target={dropDownTarget}
                hidden={onDateTimeHidden}
                unmountWhenHidden={true}
              >
                {renderSelector()}
              </MobileOverlayPanel>
            </>
          }
          aboveMobileMarkup={
            <>
              <TemplateOutlet props={inputTemplateProps} template={finalInputTemplate}>
                {useFormattedInput === false ? (
                  <ContentEditableInput
                    value={getValue()}
                    readOnly={readOnly}
                    className={inputStyles}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onInput={onInput}
                    onElementCreate={(element) => onInputElementCreated(element, false)}
                    {...inputProps}
                  />
                ) : (
                  <FormattedInput
                    value={getValue()}
                    readOnly={readOnly}
                    className={inputStyles}
                    format={inputFormat}
                    isInputValid={isValidFormatString}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={onFormatStringChange}
                    onElementCreate={(element) => onInputElementCreated(element, true)}
                    {...inputProps}
                  />
                )}
              </TemplateOutlet>
              <OverlayPanel
                visible={selectorOpen}
                target={dropDownTarget}
                shouldTargetCloseOverlay={false}
                shouldScrollCloseOverlay={true}
                shouldCheckZIndex={true}
                shouldRemainOnScreen={true}
                hidden={onDateTimeHidden}
                isClickedWithin={onCalendarClick}
                unmountWhenHidden={true}
              >
                {renderSelector()}
              </OverlayPanel>
            </>
          }
        />
      </div>
    </DateTimeContext.Provider>
  );
};

export { DateTime };
