import React, { useState } from 'react';
import { LocalDateTime } from '@js-joda/core';
import { DateTimeFormatter } from '@js-joda/core';
import OverlayPanel from '../overlay-panel/overlay-panel.component';

export interface DateTimeProps {
  name: string;
  value: string;
  label?: string;
  format?: string;
}

export default function DateTime({ name, value, label, format }: DateTimeProps) {
  const [currentDateTime, setCurrentDateTime] = useState(LocalDateTime.now());

  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <div
        id={name}
        contentEditable={true}
        className="w-full shadow-sm border border-solid border-gray-300 rounded-md p-2">
        {value || currentDateTime.toString()}
      </div>
    </div>
  );
}
