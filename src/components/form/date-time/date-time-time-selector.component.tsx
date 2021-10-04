import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { generateNumberArray, padNumber } from '../../common-functions';
import { TimeConstraints } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeTimeSelectorProps {
  viewDate: Date;
  showDateSelector: boolean;
  locale: Locale;
  timeConstraints?: TimeConstraints;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export default function DateTimeTimeSelector({
  viewDate,
  showDateSelector,
  locale,
  timeConstraints,
  dispatcher,
}: DateTimeTimeSelectorProps) {
  const hours = useRef<string[]>(['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']);
  const minutes = useRef<string[]>(generateNumberArray(0, 59, (value) => padNumber(value, 2, '0')));
  const ampm = useRef<string[]>(['AM', 'PM']);

  const getMeridianHour = (hour: number) => (hour > 11 ? hour - 12 : hour);

  const [currentHour, setCurrentHour] = useState(getMeridianHour(viewDate.getHours()));
  const [currentMinute, setCurrentMinute] = useState(viewDate.getMinutes());
  const [currentMeridian, setCurrentMeridian] = useState(viewDate.getHours() <= 12 ? 0 : 1);
  const dateString = useRef<string>(viewDate.toLocaleDateString(locale.code));

  const increaseHour = () => {
    const incrementAmount = timeConstraints?.hours?.step || 1;
    const nextHour = currentHour < 11 ? currentHour + incrementAmount : 0;
    setCurrentHour(nextHour);
    setCurrentTime(nextHour, currentMinute, currentMeridian);
  };

  const decreaseHour = () => {
    const decrementAmount = timeConstraints?.hours?.step || 1;
    const nextHour = currentHour > 0 ? currentHour - decrementAmount : 11;
    setCurrentHour(nextHour);
    setCurrentTime(nextHour, currentMinute, currentMeridian);
  };

  const increaseMinute = () => {
    const incrementAmount = timeConstraints?.minutes?.step || 1;
    const nextMinute =
      currentMinute + incrementAmount < (timeConstraints?.minutes?.max || 59)
        ? currentMinute + incrementAmount
        : timeConstraints?.minutes?.min || 0;
    setCurrentMinute(nextMinute);
    setCurrentTime(currentHour, nextMinute, currentMeridian);
  };

  const decreaseMinute = () => {
    const decrementAmount = timeConstraints?.minutes?.step || 1;
    const nextMinute =
      currentMinute - decrementAmount >= (timeConstraints?.minutes?.min || 0)
        ? currentMinute - decrementAmount
        : (timeConstraints?.minutes?.max || 60) - decrementAmount;
    setCurrentMinute(nextMinute);
    setCurrentTime(currentHour, nextMinute, currentMeridian);
  };

  const changeMeridian = () => {
    const nextMeridian = currentMeridian === 0 ? 1 : 0;
    setCurrentMeridian(nextMeridian);
    setCurrentTime(currentHour, currentMinute, nextMeridian);
  };

  const setCurrentTime = (hour: number, minute: number, meridian: number) => {
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

  const onDateClicked = () => {
    dispatcher({
      type: DateTimeActionType.DaySelector,
    });
  };

  return (
    <div className="bsc-flex bsc-flex-row bsc-justify-center bsc-p-2 bc-dt-time-selector" style={{ minWidth: '15rem' }}>
      <div className="bsc-w-full bsc-grid bsc-grid-cols-4 bsc-gap-4 bc-dt-time-grid">
        {showDateSelector && (
          <div
            className="bsc-text-center bsc-cursor-pointer hover:bsc-bg-gray-300 dark:bsc-text-white dark:hover:bsc-bg-white dark:hover:bsc-text-black bsc-col-span-4 bc-dt-time-date-value"
            onClick={onDateClicked}
          >
            {dateString.current}
          </div>
        )}
        <div className="bsc-text-center bsc-cursor-pointer bc-dt-time-hour-increase">
          <button className="focus:bsc-outline-none" onClick={increaseHour}>
            <FontAwesomeIcon icon={['fas', 'chevron-up']} />
          </button>
        </div>
        <div>&nbsp;</div>
        <div className="bsc-text-center bsc-cursor-pointer bc-dt-time-minute-increase">
          <button className="focus:bsc-outline-none" onClick={increaseMinute}>
            <FontAwesomeIcon icon={['fas', 'chevron-up']} />
          </button>
        </div>
        <div className="bsc-text-center bsc-cursor-pointer bc-dt-time-meridian-increase">
          <button className="focus:bsc-outline-none" onClick={changeMeridian}>
            <FontAwesomeIcon icon={['fas', 'chevron-up']} />
          </button>
        </div>
        <div className="bsc-text-center bc-dt-time-hour-value">{hours.current[currentHour]}</div>
        <div className="bsc-text-center bc-dt-time-separator">:</div>
        <div className="bsc-text-center bc-dt-time-minute-value">{minutes.current[currentMinute]}</div>
        <div className="bsc-text-center bc-dt-time-meridian-value">{ampm.current[currentMeridian]}</div>
        <div className="bsc-text-center bsc-cursor-pointer bc-dt-time-hour-decrease">
          <button className="focus:bsc-outline-none" onClick={decreaseHour}>
            <FontAwesomeIcon icon={['fas', 'chevron-down']} />
          </button>
        </div>
        <div>&nbsp;</div>
        <div className="bsc-text-center bsc-cursor-pointer bc-dt-time-minute-decrease">
          <button className="focus:bsc-outline-none" onClick={decreaseMinute}>
            <FontAwesomeIcon icon={['fas', 'chevron-down']} />
          </button>
        </div>
        <div className="bsc-text-center bsc-cursor-pointer bc-dt-time-meridian-decrease">
          <button className="focus:bsc-outline-none" onClick={changeMeridian}>
            <FontAwesomeIcon icon={['fas', 'chevron-down']} />
          </button>
        </div>
      </div>
    </div>
  );
}
