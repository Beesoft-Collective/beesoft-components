import React, { useReducer, useState } from 'react';
import { getBrowserLanguage, getElementByClassNameRecursive } from '../common-functions';
import OverlayPanel from '../overlay-panel/overlay-panel.component';
import DateTimeDaySelector from './date-time-day-selector.component';
import DateTimeMonthSelector from './date-time-month-selector.component';
import reducer, { DateTimeActionType, DateTimeState } from './date-time.reducer';

export interface DateTimeProps {
  name: string;
  value?: string | Date;
  label?: string;
  format?: string;
}

export default function DateTime({name, value, label, format}: DateTimeProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [dropDownTarget, setDropDownTarget] = useState<Element>();

  const getDateValue = () => {
    return value ? typeof value === 'string' ? new Date(value) : value : undefined;
  };

  const initialState: DateTimeState = {
    currentSelector: DateTimeActionType.DaySelector,
    currentViewDate: getDateValue() || new Date(),
    selectedDate: getDateValue()
  };

  const [state, dispatcher] = useReducer(reducer, initialState);

  const onFocus = (event: React.FocusEvent) => {
    const parentElement = getElementByClassNameRecursive(event.target as HTMLElement, 'parent-element');
    setDropDownTarget(parentElement);
    setSelectorOpen(true);
  }

  const onDateTimeHidden = () => {
    setSelectorOpen(false);
  };

  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <div
        id={name}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onFocus={onFocus}
        className="w-full shadow-sm border border-solid border-gray-300 rounded-md p-2 focus:outline-none parent-element">
        {`${state.selectedDate?.toLocaleDateString(getBrowserLanguage())} ${state.selectedDate?.toLocaleTimeString(getBrowserLanguage())}`}
      </div>
      <OverlayPanel visible={selectorOpen} target={dropDownTarget} shouldTargetCloseOverlay={false}
                    hidden={onDateTimeHidden}>
        {state.currentSelector === DateTimeActionType.DaySelector &&
        <DateTimeDaySelector selectedDate={state.selectedDate} viewDate={state.currentViewDate}
                             dispatcher={dispatcher} />}
        {state.currentSelector === DateTimeActionType.MonthSelector &&
        <DateTimeMonthSelector viewDate={state.currentViewDate} dispatcher={dispatcher} />}
      </OverlayPanel>
    </div>
  );
}
