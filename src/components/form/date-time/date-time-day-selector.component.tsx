import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import React, { useEffect, useRef, useState } from 'react';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import DateTimeCalendar from './date-time-calendar.component';
import { DayType, getDefaultTime, getMonthMatrix, getTranslatedDays } from './date-time-functions';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeDaySelectorProps {
  selectedDate?: Date;
  viewDate: Date;
  locale: Locale;
  showTimeSelector: boolean;
  selectableDate?: (currentDate: Date) => boolean;
  isValidDate?: (selectedDate: Date) => boolean;
  viewTemplate?: DaySelectorTemplate;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export interface DateTimeDaySelectorTemplateProps {
  selectedDate?: Date;
  viewDate: Date;
  locale: Locale;
  showTimeSelector: boolean;
  movePreviousMonth: () => void;
  moveNextMonth: () => void;
  onMonthClicked: () => void;
  onTimeClicked: () => void;
}

export type DaySelectorTemplate = TemplateFunction<DateTimeDaySelectorTemplateProps>;

export default function DateTimeDaySelector({
  selectedDate,
  viewDate,
  locale,
  showTimeSelector,
  selectableDate,
  isValidDate,
  viewTemplate,
  dispatcher,
}: DateTimeDaySelectorProps) {
  const movePreviousMonth = () => {
    if (viewDate) {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: subMonths(viewDate, 1),
      });
    }
  };

  const moveNextMonth = () => {
    if (viewDate) {
      dispatcher({
        type: DateTimeActionType.SetViewDate,
        viewDate: addMonths(viewDate, 1),
      });
    }
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
      return viewDate.toLocaleDateString(locale.code, {
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const templateProps: DateTimeDaySelectorTemplateProps = {
    selectedDate,
    viewDate,
    locale,
    showTimeSelector,
    movePreviousMonth,
    moveNextMonth,
    onMonthClicked,
    onTimeClicked,
  };

  const defaultTemplate = (
    props: DateTimeDaySelectorTemplateProps,
    children?: React.ReactNode | React.ReactNodeArray
  ) => <div className="p-2">{children}</div>;

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
      <DateTimeCalendar
        viewDate={viewDate}
        selectedDate={selectedDate}
        locale={locale}
        selectableDate={selectableDate}
        isValidDate={isValidDate}
        dispatcher={dispatcher}
      />
      {showTimeSelector && (
        <div className="w-full flex flex-row p-2 justify-center">
          <div
            className="p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-white dark:hover:text-black dark:text-white"
            onClick={onTimeClicked}
          >
            {selectedDate?.toLocaleTimeString(locale.code) || getDefaultTime(locale)}
          </div>
        </div>
      )}
    </TemplateOutlet>
  );
}
