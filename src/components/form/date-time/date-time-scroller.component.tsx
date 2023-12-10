import { ReactNode, useContext } from 'react';
import { TypeOrArray } from '../../common-interfaces.ts';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import { ArrowLeftSLineIcon, ArrowRightSLineIcon } from '../../icons.ts';
import { DateTimeContext } from './date-time-context';
import { DateScrollerType } from './date-time-types';

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

  const defaultTemplate = (_props: DateTimeScrollerTemplateProps, children: TypeOrArray<ReactNode>) => (
    <div className="bsc-w-full bsc-flex bsc-flex-row bsc-items-center bsc-py-1 bsc-px-2 bc-dt-scroller">{children}</div>
  );

  const template = viewTemplate || defaultTemplate;

  return (
    <TemplateOutlet props={templateProps} template={template}>
      <div className="bsc-flex-shrink bsc-cursor-pointer bc-dt-scroller-left">
        <button className="bsc-p-2 focus:bsc-outline-none" onClick={onMovePrevious}>
          <ArrowLeftSLineIcon size={24} />
        </button>
      </div>
      <div className="bsc-flex-grow bsc-text-center bsc-cursor-pointer bc-dt-scroller-title" onClick={onTitleClicked}>
        {title}
      </div>
      <div className="bsc-flex-shrink bsc-cursor-pointer bc-dt-scroller-right">
        <button className="bsc-p-2 focus:bsc-outline-none" onClick={onMoveNext}>
          <ArrowRightSLineIcon size={24} />
        </button>
      </div>
    </TemplateOutlet>
  );
};

export default DateTimeScroller;
