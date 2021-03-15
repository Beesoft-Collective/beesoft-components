import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { generateNumberArray, padNumber } from '../common-functions';
import { DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeTimeSelectorProps {
  viewDate: Date;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeTimeSelector({viewDate, dispatcher}: DateTimeTimeSelectorProps) {
  const hours = useRef<string[]>(generateNumberArray(1, 12, (value) => padNumber(value, 2, '0')));
  const minutes = useRef<string[]>(generateNumberArray(0, 59, (value) => padNumber(value, 2, '0')));
  const ampm = useRef<string[]>(['AM', 'PM']);

  const getHourArrayIndex = (hour: number) => {
    const meridianHour = hour < 12 ? hour : hour - 12;

    if (meridianHour > 0) {
      return meridianHour - 1;
    } else {
      return 11;
    }
  };

  const [currentHour, setCurrentHour] = useState(getHourArrayIndex(viewDate.getHours()));
  const [currentMinute, setCurrentMinute] = useState(viewDate.getMinutes());
  const [currentMeridian, setCurrentMeridian] = useState(viewDate.getHours() <= 12 ? 0 : 1);

  return (
    <div className="flex flex-row justify-center" style={{minWidth: '20rem'}}>
      <table className="w-full">
        <tbody>
        <tr>
          <td className="text-center">
            <FontAwesomeIcon icon={['fas', 'chevron-up']}
                             onClick={() => currentHour < 11 ? setCurrentHour(currentHour + 1) : setCurrentHour(0)}/>
          </td>
          <td>&nbsp;</td>
          <td className="text-center">
            <FontAwesomeIcon icon={['fas', 'chevron-up']}
                             onClick={() => currentMinute < 59 ? setCurrentMinute(currentMinute + 1) : setCurrentMinute(0)}/>
          </td>
          <td className="text-center">
            <FontAwesomeIcon icon={['fas', 'chevron-up']}
                             onClick={() => currentMeridian === 0 ? setCurrentMeridian(1) : setCurrentMeridian(0)}/>
          </td>
        </tr>
        <tr>
          <td className="text-center">{hours.current[currentHour]}</td>
          <td className="text-center">:</td>
          <td className="text-center">{minutes.current[currentMinute]}</td>
          <td className="text-center">{ampm.current[currentMeridian]}</td>
        </tr>
        <tr>
          <td className="text-center">
            <FontAwesomeIcon icon={['fas', 'chevron-down']}
                             onClick={() => currentHour > 0 ? setCurrentHour(currentHour - 1) : setCurrentHour(11)}/>
          </td>
          <td>&nbsp;</td>
          <td className="text-center">
            <FontAwesomeIcon icon={['fas', 'chevron-down']}
                             onClick={() => currentMinute > 0 ? setCurrentMinute(currentMinute - 1) : setCurrentMinute(59)}/>
          </td>
          <td className="text-center">
            <FontAwesomeIcon icon={['fas', 'chevron-down']}
                             onClick={() => currentMeridian === 0 ? setCurrentMeridian(1) : setCurrentMeridian(0)}/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  );
}
