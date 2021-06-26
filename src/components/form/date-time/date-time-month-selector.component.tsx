import { addYears, setMonth, subYears } from 'date-fns';
import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import { getTranslatedMonthMatrix } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeMonthSelectorProps {
  viewDate: Date;
  locale: Locale;
  viewTemplate?: MonthSelectorTemplate;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export interface DateTimeMonthSelectorTemplateProps {
  viewDate: Date;
  locale: Locale;
  movePreviousYear: () => void;
  moveNextYear: () => void;
  onMonthClicked: (monthNumber: number) => void;
  onYearClicked: () => void;
}

export type MonthSelectorTemplate = TemplateFunction<DateTimeMonthSelectorTemplateProps>;

export default function DateTimeMonthSelector({
  viewDate,
  locale,
  viewTemplate,
  dispatcher,
}: DateTimeMonthSelectorProps) {
  const monthMatrix = useRef(getTranslatedMonthMatrix(locale));

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
    return viewDate.toLocaleDateString(locale.code, {
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
    locale,
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
      <DateTimeScroller
        title={getCurrentYear()}
        onTitleClicked={onYearClicked}
        onMovePrevious={movePreviousYear}
        onMoveNext={moveNextYear}
      />
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
