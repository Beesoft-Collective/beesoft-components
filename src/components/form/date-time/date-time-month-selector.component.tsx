import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addYears from 'date-fns/addYears';
import setMonth from 'date-fns/setMonth';
import subYears from 'date-fns/subYears';
import { getBrowserLanguage } from '../../common-functions';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import { getTranslatedMonthMatrix } from './date-time-functions';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeMonthSelectorProps {
  viewDate: Date;
  viewTemplate?: MonthSelectorTemplate;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export interface DateTimeMonthSelectorTemplateProps {
  viewDate: Date;
  movePreviousYear: () => void;
  moveNextYear: () => void;
  onMonthClicked: (monthNumber: number) => void;
  onYearClicked: () => void;
}

export type MonthSelectorTemplate = TemplateFunction<DateTimeMonthSelectorTemplateProps>;

export default function DateTimeMonthSelector({ viewDate, viewTemplate, dispatcher }: DateTimeMonthSelectorProps) {
  const monthMatrix = useRef(getTranslatedMonthMatrix(getBrowserLanguage()));

  const movePreviousYear = () => {
    const previousYear = subYears(viewDate, 1);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: previousYear,
    });
  };

  const moveNextYear = () => {
    const nextYear = addYears(viewDate, 1);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: nextYear,
    });
  };

  const onMonthClicked = (monthNumber: number) => {
    dispatcher({
      type: DateTimeActionType.DaySelector,
      viewDate: setMonth(viewDate, monthNumber),
    });
  };

  const getCurrentYear = () => {
    return viewDate.toLocaleDateString(getBrowserLanguage(), {
      year: 'numeric',
    });
  };

  const onYearClicked = () => {
    dispatcher({
      type: DateTimeActionType.YearSelector,
    });
  };

  const templateProps: DateTimeMonthSelectorTemplateProps = {
    viewDate,
    movePreviousYear,
    moveNextYear,
    onMonthClicked,
    onYearClicked,
  };

  const defaultTemplate = (
    props: DateTimeMonthSelectorTemplateProps,
    children?: React.ReactNode | React.ReactNodeArray
  ) => (
    <div className="p-2" style={{ minWidth: '20rem' }}>
      {children}
    </div>
  );

  const template = viewTemplate || defaultTemplate;

  return (
    <TemplateOutlet props={templateProps} template={template}>
      <div className="w-full flex flex-row py-1 px-2">
        <div className="flex-shrink cursor-pointer" onClick={movePreviousYear}>
          <FontAwesomeIcon icon={['fas', 'angle-left']} />
        </div>
        <div className="flex-grow text-center cursor-pointer" onClick={onYearClicked}>
          {getCurrentYear()}
        </div>
        <div className="flex-shrink cursor-pointer" onClick={moveNextYear}>
          <FontAwesomeIcon icon={['fas', 'angle-right']} />
        </div>
      </div>
      <div className="w-full grid grid-cols-4 gap-4">
        {monthMatrix.current.map((row, rIndex) =>
          row.map((column, cIndex) => (
            <div
              key={rIndex.toString() + cIndex.toString()}
              className="text-center cursor-pointer"
              onClick={() => onMonthClicked(column.monthNumber)}
            >
              {column.monthName}
            </div>
          ))
        )}
      </div>
    </TemplateOutlet>
  );
}
