import React, { useState } from 'react';
import { LocalDateTime } from '@js-joda/core';
import { DateTimeFormatter } from '@js-joda/core';
import { getElementByClassNameRecursive } from '../common-functions';
import OverlayPanel from '../overlay-panel/overlay-panel.component';
import DateTimeDaySelector from './date-time-day-selector.component';

export interface DateTimeProps {
  name: string;
  value: string;
  label?: string;
  format?: string;
}

export default function DateTime({ name, value, label, format }: DateTimeProps) {
  const [currentDateTime, setCurrentDateTime] = useState(LocalDateTime.now());
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [dropDownTarget, setDropDownTarget] = useState<Element>();

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
        onFocus={onFocus}
        className="w-full shadow-sm border border-solid border-gray-300 rounded-md p-2 focus:outline-none parent-element">
        {value || currentDateTime.toString()}
      </div>
      <OverlayPanel visible={selectorOpen} target={dropDownTarget} shouldTargetCloseOverlay={false} hidden={onDateTimeHidden}>
        <DateTimeDaySelector value={value} />
      </OverlayPanel>
    </div>
  );
}
