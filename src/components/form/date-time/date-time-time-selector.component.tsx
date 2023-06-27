import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { generateNumberArray } from '../../common-functions';
import { TimeConstraints, TimeFormatType } from './date-time-types';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeTimeSelectorProps {
  viewDate: Date;
  showDateSelector: boolean;
  locale: Locale;
  timeFormat?: TimeFormatType;
  timeConstraints?: TimeConstraints;
  onChange?: (value?: Date | Array<Date>) => void;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

const DateTimeTimeSelector = ({
  viewDate,
  showDateSelector,
  locale,
  timeFormat = TimeFormatType.TwelveHour,
  timeConstraints,
  onChange,
  dispatcher,
}: DateTimeTimeSelectorProps) => {
  const maximumHour = useRef(timeFormat === TimeFormatType.TwelveHour ? 11 : 23);
  const hours = useRef<string[]>(
    timeFormat === TimeFormatType.TwelveHour
      ? ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
      : [
          '00',
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
        ]
  );
  const minutes = useRef<string[]>(generateNumberArray(0, 59, (value) => value.toString().padStart(2, '0')));
  const ampm = useRef<string[]>(['AM', 'PM']);
  const savedViewDate = useRef(cloneDeep(viewDate));

  const getMeridianHour = (hour: number) => (hour > 11 ? hour - 12 : hour);

  const [currentHour, setCurrentHour] = useState(getMeridianHour(viewDate.getHours()));
  const [currentMinute, setCurrentMinute] = useState(viewDate.getMinutes());
  const [currentMeridian, setCurrentMeridian] = useState(viewDate.getHours() <= 12 ? 0 : 1);
  const dateString = useRef<string>(viewDate.toLocaleDateString(locale.code));

  useEffect(() => {
    const newHour = viewDate.getHours();
    const newMinute = viewDate.getMinutes();

    if (newHour !== currentHour) {
      setCurrentHour(timeFormat === TimeFormatType.TwelveHour ? getMeridianHour(newHour) : newHour);
    }

    if (newMinute !== currentMinute) {
      setCurrentMinute(newMinute);
    }

    if (timeFormat === TimeFormatType.TwelveHour) {
      const newMeridian = newHour <= 11 ? 0 : 1;
      if (newMeridian !== currentMeridian) {
        setCurrentMeridian(newMeridian);
      }
    }
  }, [viewDate]);

  const increaseHour = () => {
    const incrementAmount = timeConstraints?.hours?.step || 1;
    const nextHour = currentHour < maximumHour.current ? currentHour + incrementAmount : 0;
    setCurrentHour(nextHour);
    setCurrentTime(nextHour, currentMinute, currentMeridian);
  };

  const decreaseHour = () => {
    const decrementAmount = timeConstraints?.hours?.step || 1;
    const nextHour = currentHour > 0 ? currentHour - decrementAmount : maximumHour.current;
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
    const correctHour = timeFormat === TimeFormatType.TwelveHour ? (meridian === 1 ? hour + 12 : hour) : hour;
    savedViewDate.current.setHours(correctHour, minute);

    dispatcher({
      type: DateTimeActionType.SetSelectedDate,
      selectedDate: savedViewDate.current,
      viewDate: savedViewDate.current,
    });
    onChange?.(savedViewDate.current);
  };

  const onDateClicked = () => {
    dispatcher({
      type: DateTimeActionType.DaySelector,
    });
  };

  const gridWrapperStyle = cx('bsc-w-full bsc-grid bsc-grid-rows-3 bsc-gap-4 bc-dt-time-grid', {
    'bsc-grid-cols-4': timeFormat === TimeFormatType.TwelveHour,
    'bsc-grid-cols-3': timeFormat === TimeFormatType.TwentyFourHour,
  });

  const dateSelectorStyle = cx(
    'bsc-text-center bsc-cursor-pointer hover:bsc-bg-gray-300 dark:bsc-text-white dark:hover:bsc-bg-white dark:hover:bsc-text-black bc-dt-time-date-value',
    {
      'bsc-col-span-4': timeFormat === TimeFormatType.TwelveHour,
      'bsc-col-span-3': timeFormat === TimeFormatType.TwentyFourHour,
    }
  );

  return (
    <div
      className="bsc-flex bsc-flex-row bsc-justify-center bsc-p-2 bc-dt-time-selector"
      style={{ minWidth: timeFormat === TimeFormatType.TwelveHour ? '15rem' : '11rem' }}
    >
      <div className={gridWrapperStyle}>
        {showDateSelector && (
          <div className={dateSelectorStyle} onClick={onDateClicked}>
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
        {timeFormat === TimeFormatType.TwelveHour && (
          <div className="bsc-text-center bsc-cursor-pointer bc-dt-time-meridian-increase">
            <button className="focus:bsc-outline-none" onClick={changeMeridian}>
              <FontAwesomeIcon icon={['fas', 'chevron-up']} />
            </button>
          </div>
        )}
        <div className="bsc-text-center bc-dt-time-hour-value">{hours.current[currentHour]}</div>
        <div className="bsc-text-center bc-dt-time-separator">:</div>
        <div className="bsc-text-center bc-dt-time-minute-value">{minutes.current[currentMinute]}</div>
        {timeFormat === TimeFormatType.TwelveHour && (
          <div className="bsc-text-center bc-dt-time-meridian-value">{ampm.current[currentMeridian]}</div>
        )}
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
        {timeFormat === TimeFormatType.TwelveHour && (
          <div className="bsc-text-center bsc-cursor-pointer bc-dt-time-meridian-decrease">
            <button className="focus:bsc-outline-none" onClick={changeMeridian}>
              <FontAwesomeIcon icon={['fas', 'chevron-down']} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeTimeSelector;
