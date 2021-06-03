import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import React, { useEffect, useRef, useState } from 'react';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import { getDefaultTime, getMonthMatrix, getTranslatedDays } from './date-time-functions';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeDaySelectorProps {
  selectedDate?: Date;
  viewDate: Date;
  locale: string;
  showTimeSelector: boolean;
  viewTemplate?: DaySelectorTemplate;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export interface DateTimeDaySelectorTemplateProps {
  selectedDate?: Date;
  viewDate: Date;
  locale: string;
  showTimeSelector: boolean;
  monthMatrix?: Array<Array<Date | null>>;
  translatedWeekDays?: Array<string>;
  movePreviousMonth: () => void;
  moveNextMonth: () => void;
  onDateClicked: (date: Date) => void;
  onMonthClicked: () => void;
  onTimeClicked: () => void;
}

export type DaySelectorTemplate = TemplateFunction<DateTimeDaySelectorTemplateProps>;

export default function DateTimeDaySelector({
  selectedDate,
  viewDate,
  locale,
  showTimeSelector,
  viewTemplate,
  dispatcher,
}: DateTimeDaySelectorProps) {
  const [monthMatrix, setMonthMatrix] = useState<Array<Array<Date | null>>>();
  const weekDaysRef = useRef(getTranslatedDays(locale));

  useEffect(() => {
    if (viewDate) {
      setMonthMatrix(getMonthMatrix(viewDate));
    }
  }, [viewDate]);

  const movePreviousMonth = () => {
    if (viewDate) {
      const previousMonth = subMonths(viewDate, 1);
      setMonthMatrix(getMonthMatrix(previousMonth));
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: previousMonth,
      });
    }
  };

  const moveNextMonth = () => {
    if (viewDate) {
      const nextMonth = addMonths(viewDate, 1);
      setMonthMatrix(getMonthMatrix(nextMonth));
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: nextMonth,
      });
    }
  };

  const onDateClicked = (date: Date) => {
    dispatcher({
      type: DateTimeActionType.SetSelectedDate,
      selectedDate: date,
    });
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: date,
    });
  };

  const onMonthClicked = () => {
    dispatcher({
      type: DateTimeActionType.MonthSelector,
    });
  };

  const onTimeClicked = () => {
    dispatcher({
      type: DateTimeActionType.TimeSelector,
    });
  };

  const getCurrentMonthYear = () => {
    if (viewDate) {
      return viewDate.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const isSelectedDate = (currentDate: Date) => {
    if (selectedDate) {
      const comparisonDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      return comparisonDate.toLocaleDateString() === currentDate.toLocaleDateString();
    }

    return false;
  };

  const templateProps: DateTimeDaySelectorTemplateProps = {
    selectedDate,
    viewDate,
    locale,
    showTimeSelector,
    monthMatrix,
    translatedWeekDays: weekDaysRef.current,
    movePreviousMonth,
    moveNextMonth,
    onDateClicked,
    onMonthClicked,
    onTimeClicked,
  };

  const defaultTemplate = (
    props: DateTimeDaySelectorTemplateProps,
    children?: React.ReactNode | React.ReactNodeArray
  ) => <div style={{ minWidth: '20rem' }}>{children}</div>;

  const template = viewTemplate || defaultTemplate;

  return (
    <TemplateOutlet props={templateProps} template={template}>
      <div className="w-full flex flex-row py-1 px-2">
        <div className="flex-shrink cursor-pointer">
          <button className="focus:outline-none" onClick={movePreviousMonth}>
            <FontAwesomeIcon icon={['fas', 'angle-left']} />
          </button>
        </div>
        <div className="flex-grow text-center cursor-pointer" onClick={onMonthClicked}>
          {getCurrentMonthYear()}
        </div>
        <div className="flex-shrink cursor-pointer">
          <button className="focus:outline-none" onClick={moveNextMonth}>
            <FontAwesomeIcon icon={['fas', 'angle-right']} />
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead className="font-bold">
          <tr>
            {weekDaysRef.current.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthMatrix?.map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((column, cIndex) => (
                <td
                  key={rIndex.toString() + cIndex.toString()}
                  className={`text-center cursor-pointer${column && isSelectedDate(column) ? ' bg-blue-100' : ''}`}
                  onClick={() => {
                    if (column) {
                      onDateClicked(column);
                    }
                  }}
                >
                  {column?.getDate().toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showTimeSelector && (
        <div className="w-full flex flex-row p-2 justify-center">
          <div className="p-2 cursor-pointer hover:bg-gray-300" onClick={onTimeClicked}>
            {selectedDate?.toLocaleTimeString(locale) || getDefaultTime(locale)}
          </div>
        </div>
      )}
    </TemplateOutlet>
  );
}
