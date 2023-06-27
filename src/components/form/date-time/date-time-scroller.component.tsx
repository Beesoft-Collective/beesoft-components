import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import { DateScrollerType } from './date-time-types';
import { DateTimeContext } from './date-time-context';

export interface DateTimeScrollerProps {
  title: string;
  scrollerType: DateScrollerType;
  onTitleClicked?: () => void;
  onMovePrevious: () => void;
  onMoveNext: () => void;
}

export interface DateTimeScrollerTemplateProps {
  title: string;
  scrollerType: DateScrollerType;
  onTitleClicked?: () => void;
  onMovePrevious: () => void;
  onMoveNext: () => void;
}

export type DateTimeScrollerTemplate = TemplateFunction<DateTimeScrollerTemplateProps>;

const DateTimeScroller = ({
  title,
  scrollerType,
  onTitleClicked,
  onMovePrevious,
  onMoveNext,
}: DateTimeScrollerProps) => {
  const context = useContext(DateTimeContext);
  const viewTemplate = context.dateScrollerTemplate;

  const templateProps: DateTimeScrollerTemplateProps = {
    title,
    scrollerType,
    onTitleClicked,
    onMovePrevious,
    onMoveNext,
  };

  const defaultTemplate = (props: DateTimeScrollerTemplateProps, children: React.ReactNode | React.ReactNodeArray) => (
    <div className="bsc-w-full bsc-flex bsc-flex-row bsc-py-1 bsc-px-2 bc-dt-scroller">{children}</div>
  );

  const template = viewTemplate || defaultTemplate;

  return (
    <TemplateOutlet props={templateProps} template={template}>
      <div className="bsc-flex-shrink bsc-cursor-pointer bc-dt-scroller-left">
        <button className="focus:bsc-outline-none" onClick={onMovePrevious}>
          <FontAwesomeIcon icon={['fas', 'angle-left']} />
        </button>
      </div>
      <div className="bsc-flex-grow bsc-text-center bsc-cursor-pointer bc-dt-scroller-title" onClick={onTitleClicked}>
        {title}
      </div>
      <div className="bsc-flex-shrink bsc-cursor-pointer bc-dt-scroller-right">
        <button className="focus:bsc-outline-none" onClick={onMoveNext}>
          <FontAwesomeIcon icon={['fas', 'angle-right']} />
        </button>
      </div>
    </TemplateOutlet>
  );
};

export default DateTimeScroller;
