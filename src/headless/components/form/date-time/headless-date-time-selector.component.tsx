import { deepEquals, usePropertyChanged } from '@beesoft/common';
import { Signal, useSignalEffect } from '@preact/signals-react';
import { Locale } from 'date-fns';
import { memo, useEffect, useRef, useState } from 'react';
import { HeadlessBase } from '../../../architecture/components/headless-base.component.tsx';
import { DateSelectionType, TimeConstraints, TimeFormatType } from './date-time-types.ts';
import { HeadlessDateTimeSelectorProps } from './headless-date-time-selector.props.ts';

const HeadlessDateTimeSelectorComponent = ({
  selectedDate,
  viewDate,
  selectedStartDate,
  selectedEndDate,
  locale,
  dateSelection = DateSelectionType.DateTime,
  timeFormat = TimeFormatType.TwelveHour,
  timeConstraints,
  showDateSelector = true,
  showTimeSelector = true,
  selectableDate,
  isValidDate,
  onChange,
  children,
}: HeadlessDateTimeSelectorProps) => {
  const [selectedDateState, setSelectedDateState] = useState<Date | undefined>(selectedDate);
  const [viewDateState, setViewDateState] = useState<Date>(viewDate);
  const [selectedStartDateState, setSelectedStartDateState] = useState<Date | undefined>(selectedStartDate);
  const [selectedEndDateState, setSelectedEndDateState] = useState<Date | undefined>(selectedEndDate);
  const [localeState, setLocaleState] = useState<Locale | undefined>(locale);
  const [dateSelectionState, setDateSelectionState] = useState<DateSelectionType | undefined>(dateSelection);
  const [timeFormatState, setTimeFormatState] = useState<TimeFormatType | undefined>(timeFormat);
  const [timeConstraintsState, setTimeConstraintsState] = useState<TimeConstraints | undefined>(timeConstraints);
  const [showDateSelectorState, setShowDateSelectorState] = useState<boolean>(showDateSelector);
  const [showTimeSelectorState, setShowTimeSelectorState] = useState<boolean>(showTimeSelector);

  const selectorSignal = useRef<Signal<HeadlessDateTimeSelectorProps>>();

  const selectedDateProperty = usePropertyChanged(selectedDate);
  const viewDateProperty = usePropertyChanged(viewDate);
  const selectedStartDateProperty = usePropertyChanged(selectedStartDate);
  const selectedEndDateProperty = usePropertyChanged(selectedEndDate);
  const localeProperty = usePropertyChanged(locale);
  const dateSelectionProperty = usePropertyChanged(dateSelection);
  const timeFormatProperty = usePropertyChanged(timeFormat);
  const timeConstraintsProperty = usePropertyChanged(timeConstraints);
  const showDateSelectorProperty = usePropertyChanged(showDateSelector);
  const showTimeSelectorProperty = usePropertyChanged(showTimeSelector);

  useEffect(() => {
    if (selectedDateProperty.changed) {
      setSelectedDateState(selectedDate);
    }
    if (viewDateProperty.changed) {
      setViewDateState(viewDate);
    }
    if (selectedStartDateProperty.changed) {
      setSelectedStartDateState(selectedStartDate);
    }
    if (selectedEndDateProperty.changed) {
      setSelectedEndDateState(selectedEndDate);
    }
    if (localeProperty.changed) {
      setLocaleState(locale);
    }
    if (dateSelectionProperty.changed) {
      setDateSelectionState(dateSelection);
    }
    if (timeFormatProperty.changed) {
      setTimeFormatState(timeFormat);
    }
    if (timeConstraintsProperty.changed) {
      setTimeConstraintsState(timeConstraints);
    }
    if (showDateSelectorProperty.changed) {
      setShowDateSelectorState(showDateSelector);
    }
    if (showTimeSelectorProperty.changed) {
      setShowTimeSelectorState(showTimeSelector);
    }
  }, [
    selectedDate,
    viewDate,
    selectedStartDate,
    selectedEndDate,
    locale,
    dateSelection,
    timeFormat,
    timeConstraints,
    showDateSelector,
    showTimeSelector,
  ]);

  useSignalEffect(() => {
    if (selectorSignal.current && selectorSignal.current.value) {
      if (!deepEquals(selectedDateState, selectorSignal.current.value.selectedDate)) {
        setSelectedDateState(selectorSignal.current.value.selectedDate);
      }
      if (!deepEquals(viewDateState, selectorSignal.current.value.viewDate)) {
        setViewDateState(selectorSignal.current.value.viewDate);
      }
      if (!deepEquals(selectedStartDateState, selectorSignal.current.value.selectedStartDate)) {
        setSelectedStartDateState(selectorSignal.current.value.selectedStartDate);
      }
      if (!deepEquals(selectedEndDateState, selectorSignal.current.value.selectedEndDate)) {
        setSelectedEndDateState(selectorSignal.current.value.selectedEndDate);
      }
      if (!deepEquals(localeState, selectorSignal.current.value.locale)) {
        setLocaleState(selectorSignal.current.value.locale);
      }
      if (!deepEquals(dateSelectionState, selectorSignal.current.value.dateSelection)) {
        setDateSelectionState(selectorSignal.current.value.dateSelection);
      }
      if (!deepEquals(timeFormatState, selectorSignal.current.value.timeFormat)) {
        setTimeFormatState(selectorSignal.current.value.timeFormat);
      }
      if (!deepEquals(timeConstraintsState, selectorSignal.current.value.timeConstraints)) {
        setTimeConstraintsState(selectorSignal.current.value.timeConstraints);
      }
      if (!deepEquals(showDateSelectorState, selectorSignal.current.value.showDateSelector)) {
        setShowDateSelectorState(selectorSignal.current.value.showDateSelector);
      }
      if (!deepEquals(showTimeSelectorState, selectorSignal.current.value.showTimeSelector)) {
        setShowTimeSelectorState(selectorSignal.current.value.showTimeSelector);
      }
    }
  });

  const onSignalRetrieved = (signal: Signal<HeadlessDateTimeSelectorProps>) => {
    selectorSignal.current = signal;
  };

  const props: Omit<HeadlessDateTimeSelectorProps, 'children'> = {
    selectedDate: selectedDateState,
    viewDate: viewDateState,
    selectedStartDate: selectedStartDateState,
    selectedEndDate: selectedEndDateState,
    locale: localeState,
    dateSelection: dateSelectionState,
    timeFormat: timeFormatState,
    timeConstraints: timeConstraintsState,
    showDateSelector: showDateSelectorState,
    showTimeSelector: showTimeSelectorState,
    selectableDate,
    isValidDate,
    onChange,
  };

  return (
    <HeadlessBase props={props} renderProps={props} signalName="selector" onSignalRetrieved={onSignalRetrieved}>
      {children}
    </HeadlessBase>
  );
};

const HeadlessDateTimeSelector = memo(HeadlessDateTimeSelectorComponent);
export { HeadlessDateTimeSelector };
