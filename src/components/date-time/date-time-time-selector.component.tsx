import React from 'react';
import { getBrowserLanguage } from '../common-functions';
import { DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeTimeSelectorProps {
  viewDate: Date;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeTimeSelector({ viewDate, dispatcher }: DateTimeTimeSelectorProps) {
  return (
    <div className="flex flex-row justify-evenly" style={{ minWidth: "20rem" }}>
      <div>{viewDate.getHours()}</div>
      <div>{viewDate.getMinutes()}</div>
      <div>AM</div>
    </div>
  );
}
