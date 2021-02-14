import { ChronoField, LocalDateTime } from '@js-joda/core';
import React, { useEffect, useState } from 'react';

export interface DateTimeSelectorProps {
  value: string;
}

export default function DateTimeDaySelector({ value }: DateTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<LocalDateTime>();

  useEffect(() => {
    if (value) {
      const jodaDate = LocalDateTime.parse(value);
      setSelectedDate(jodaDate);
    }
  }, [value]);

  return (
    <div style={{ minWidth: "20rem" }}>
      <div className="w-full flex flex-row font-bold">
        <div className="flex-auto text-center">Su</div>
        <div className="flex-auto text-center">Mo</div>
        <div className="flex-auto text-center">Tu</div>
        <div className="flex-auto text-center">We</div>
        <div className="flex-auto text-center">Th</div>
        <div className="flex-auto text-center">Fr</div>
        <div className="flex-auto text-center">Sa</div>
      </div>
    </div>
  );
}
