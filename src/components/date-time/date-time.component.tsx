import React, { useEffect, useReducer, useState } from 'react';
import { getElementByClassNameRecursive } from '../common-functions';
import OverlayPanel from '../overlay-panel/overlay-panel.component';
import DateTimeDaySelector from './date-time-day-selector.component';
import DateTimeMonthSelector from './date-time-month-selector.component';
import reducer, { DateTimeActionType } from './date-time.reducer';

export interface DateTimeProps {
  name: string;
  value?: string | Date;
  label?: string;
  format?: string;
}

export default function DateTime({ name, value, label, format }: DateTimeProps) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [dropDownTarget, setDropDownTarget] = useState<Element>();

  const [state, dispatcher] = useReducer(reducer, {
    currentSelector: DateTimeActionType.DaySelector
  });

  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        setCurrentDateTime(new Date(value));
      } else {
        setCurrentDateTime(value);
      }
    }
  }, [value]);

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
        {`${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()}`}
      </div>
      <OverlayPanel visible={selectorOpen} target={dropDownTarget} shouldTargetCloseOverlay={false} hidden={onDateTimeHidden}>
        {state.currentSelector === DateTimeActionType.DaySelector && <DateTimeDaySelector
          value={currentDateTime}
          dispatcher={dispatcher}
          dateSelected={(date: Date) => setCurrentDateTime(date)} />}
        {state.currentSelector === DateTimeActionType.MonthSelector && <DateTimeMonthSelector />}
      </OverlayPanel>
    </div>
  );
}
