import React, { useEffect, useState } from 'react';
import { getElementByClassNameRecursive } from '../common-functions';
import OverlayPanel from '../overlay-panel/overlay-panel.component';
import DateTimeDaySelector from './date-time-day-selector.component';

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
        <DateTimeDaySelector value={currentDateTime} dateSelected={(date: Date) => setCurrentDateTime(date)} />
      </OverlayPanel>
    </div>
  );
}
