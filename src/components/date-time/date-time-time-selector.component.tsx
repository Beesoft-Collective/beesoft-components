import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { generateNumberArray, getBrowserLanguage, padNumber } from '../common-functions';
import { TimeConstraints } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeTimeSelectorProps {
  viewDate: Date;
  showDateSelector: boolean;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
  timeConstraints?: TimeConstraints;
}

export default function DateTimeTimeSelector({
  viewDate,
  showDateSelector,
  dispatcher,
  timeConstraints,
}: DateTimeTimeSelectorProps) {
  const hours = useRef<string[]>(['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']);
  const minutes = useRef<string[]>(generateNumberArray(0, 59, (value) => padNumber(value, 2, '0')));
  const ampm = useRef<string[]>(['AM', 'PM']);

  const getMeridianHour = (hour: number) => (hour > 11 ? hour - 12 : hour);

  const [currentHour, setCurrentHour] = useState(getMeridianHour(viewDate.getHours()));
  const [currentMinute, setCurrentMinute] = useState(viewDate.getMinutes());
  const [currentMeridian, setCurrentMeridian] = useState(viewDate.getHours() <= 12 ? 0 : 1);
  const dateString = useRef<string>(viewDate.toLocaleDateString(getBrowserLanguage()));

  const increaseHour = () => {
    const incrementAmount = timeConstraints?.hours?.step || 1;
    const nextHour = currentHour < 11 ? currentHour + incrementAmount : 0;
    setCurrentHour(nextHour);
    setCurrentDate(nextHour, currentMinute, currentMeridian);
  };

  const decreaseHour = () => {
    const decrementAmount = timeConstraints?.hours?.step || 1;
    const nextHour = currentHour > 0 ? currentHour - decrementAmount : 11;
    setCurrentHour(nextHour);
    setCurrentDate(nextHour, currentMinute, currentMeridian);
  };

  const increaseMinute = () => {
    const incrementAmount = timeConstraints?.minutes?.step || 1;
    const nextMinute =
      currentMinute + incrementAmount < (timeConstraints?.minutes?.max || 59)
        ? currentMinute + incrementAmount
        : timeConstraints?.minutes?.min || 0;
    setCurrentMinute(nextMinute);
    setCurrentDate(currentHour, nextMinute, currentMeridian);
  };

  const decreaseMinute = () => {
    const decrementAmount = timeConstraints?.minutes?.step || 1;
    const nextMinute =
      currentMinute - decrementAmount >= (timeConstraints?.minutes?.min || 0)
        ? currentMinute - decrementAmount
        : (timeConstraints?.minutes?.max || 60) - decrementAmount;
    setCurrentMinute(nextMinute);
    setCurrentDate(currentHour, nextMinute, currentMeridian);
  };

  const changeMeridian = () => {
    const nextMeridian = currentMeridian === 0 ? 1 : 0;
    setCurrentMeridian(nextMeridian);
    setCurrentDate(currentHour, currentMinute, nextMeridian);
  };

  const setCurrentDate = (hour: number, minute: number, meridian: number) => {
    const correctHour = meridian === 1 ? hour + 12 : hour;
    viewDate.setHours(correctHour, minute);

    dispatcher({
      type: DateTimeActionType.SetSelectedDate,
      selectedDate: viewDate,
    });
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: viewDate,
    });
  };

  const onBackClicked = () => {
    dispatcher({
      type: DateTimeActionType.DaySelector,
    });
  };

  return (
    <div className="flex flex-row justify-center p-2" style={{ minWidth: '20rem' }}>
      <table className="w-full">
        <tbody>
          {showDateSelector && (
            <tr>
              <td className="text-center cursor-pointer hover:bg-gray-300" colSpan={4} onClick={onBackClicked}>
                {dateString.current}
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={4}>&nbsp;</td>
          </tr>
          <tr>
            <td className="text-center cursor-pointer">
              <FontAwesomeIcon icon={['fas', 'chevron-up']} onClick={increaseHour} />
            </td>
            <td>&nbsp;</td>
            <td className="text-center cursor-pointer">
              <FontAwesomeIcon icon={['fas', 'chevron-up']} onClick={increaseMinute} />
            </td>
            <td className="text-center cursor-pointer">
              <FontAwesomeIcon icon={['fas', 'chevron-up']} onClick={changeMeridian} />
            </td>
          </tr>
          <tr>
            <td className="text-center">{hours.current[currentHour]}</td>
            <td className="text-center">:</td>
            <td className="text-center">{minutes.current[currentMinute]}</td>
            <td className="text-center">{ampm.current[currentMeridian]}</td>
          </tr>
          <tr>
            <td className="text-center cursor-pointer">
              <FontAwesomeIcon icon={['fas', 'chevron-down']} onClick={decreaseHour} />
            </td>
            <td>&nbsp;</td>
            <td className="text-center cursor-pointer">
              <FontAwesomeIcon icon={['fas', 'chevron-down']} onClick={decreaseMinute} />
            </td>
            <td className="text-center cursor-pointer">
              <FontAwesomeIcon icon={['fas', 'chevron-down']} onClick={changeMeridian} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
