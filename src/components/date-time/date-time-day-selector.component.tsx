import React, { useEffect, useState } from 'react';
import { getMonthMatrix } from './date-time-functions';

export interface DateTimeSelectorProps {
  value: Date;
  dateSelected?: (selectedDate: Date) => void;
}

export default function DateTimeDaySelector({ value, dateSelected }: DateTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [monthMatrix, setMonthMatrix] = useState<Array<Array<Date | null>>>();

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setMonthMatrix(getMonthMatrix(value));
    }
  }, [value]);

  const onDateClicked = (date: Date) => {
    setSelectedDate(date);
    if (dateSelected) {
      dateSelected(date);
    }
  };

  return (
    <div style={{ minWidth: "20rem" }}>
      <table className="w-full">
        <thead className="font-bold">
          <th>Su</th>
          <th>Mo</th>
          <th>Tu</th>
          <th>We</th>
          <th>Th</th>
          <th>Fr</th>
          <th>Sa</th>
        </thead>
        {monthMatrix?.map(row => (
          <tr>
            {row.map(column => (
              <td
                className="text-center cursor-pointer"
                onClick={() => {
                  if (column) {
                    onDateClicked(column)
                  }
                }}
              >
                {column?.getDate().toLocaleString()}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
