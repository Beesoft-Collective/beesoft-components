import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addYears from 'date-fns/addYears';
import setYear from 'date-fns/setYear';
import subYears from 'date-fns/subYears';
import React from 'react';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import { getTranslatedYearMatrix } from './date-time-functions';
import DateTimeScroller from './date-time-scroller.component';
import { DateTimeActionType, DateTimeReducerAction } from './date-time.reducer';

export interface DateTimeYearSelectorProps {
  viewDate: Date;
  locale: Locale;
  viewTemplate?: YearSelectorTemplate;
  dispatcher: React.Dispatch<DateTimeReducerAction>;
}

export interface DateTimeYearSelectorTemplateProps {
  viewDate: Date;
  locale: Locale;
  movePreviousDecade: () => void;
  moveNextDecade: () => void;
  onYearClicked: (year: string) => void;
  yearMatrix: Array<Array<string>>;
}

export type YearSelectorTemplate = TemplateFunction<DateTimeYearSelectorTemplateProps>;

export default function DateTimeYearSelector({
  viewDate,
  locale,
  viewTemplate,
  dispatcher,
}: DateTimeYearSelectorProps) {
  const yearMatrix = getTranslatedYearMatrix(viewDate, locale);

  const movePreviousDecade = () => {
    const previousDecade = subYears(viewDate, 10);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: previousDecade,
    });
  };

  const moveNextDecade = () => {
    const nextDecade = addYears(viewDate, 10);
    dispatcher({
      type: DateTimeActionType.SetViewDate,
      viewDate: nextDecade,
    });
  };

  const onYearClicked = (year: string) => {
    const yearNumber = parseInt(year);
    dispatcher({
      type: DateTimeActionType.MonthSelector,
      viewDate: setYear(viewDate, yearNumber),
    });
  };

  const getCurrentDecade = () => `${yearMatrix[0][0].toString()} - ${yearMatrix[2][1].toString()}`;

  const templateProps: DateTimeYearSelectorTemplateProps = {
    viewDate,
    locale,
    movePreviousDecade,
    moveNextDecade,
    onYearClicked,
    yearMatrix,
  };

  const defaultTemplate = (
    props: DateTimeYearSelectorTemplateProps,
    children?: React.ReactNode | React.ReactNodeArray
  ) => <div style={{ minWidth: '20rem' }}>{children}</div>;

  const template = viewTemplate || defaultTemplate;

  return (
    <TemplateOutlet props={templateProps} template={template}>
      <DateTimeScroller title={getCurrentDecade()} onMovePrevious={movePreviousDecade} onMoveNext={moveNextDecade} />
      <div className="w-full">
        <div className="grid grid-cols-4 gap-4">
          {yearMatrix.map((row, rIndex) =>
            row.map((column, cIndex) => (
              <div
                key={rIndex.toString() + cIndex.toString()}
                className="text-center cursor-pointer"
                onClick={() => onYearClicked(column)}
              >
                {column}
              </div>
            ))
          )}
        </div>
      </div>
    </TemplateOutlet>
  );
}
