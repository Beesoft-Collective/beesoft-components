import { TypeOrArray } from '@beesoft/common';
import { Dispatch, ReactNode, useContext } from 'react';
import { BeeSoftIcon } from '../../common/beesoft-icon/beesoft-icon.component.tsx';
import { IconSize } from '../../common/beesoft-icon/beesoft-icon.props.ts';
import TemplateOutlet from '../../common/template-outlet/template-outlet.component';
import { Button } from '../../navigation/buttons/button/button.component.tsx';
import { DateTimeContext } from './date-time-context';
import { DateScrollerType } from './date-time-types';
import { useAddDateTimeBaseTemplateProps } from './hooks/add-date-time-base-template-props.hook.ts';
import { DateTimeReducerAction } from './date-time.reducer.ts';
import { DateTimeScrollerTemplateProps } from './date-time.props.ts';

export interface DateTimeScrollerProps {
  title: string;
  scrollerType: DateScrollerType;
  onTitleClicked?: () => void;
  onMovePrevious: () => void;
  onMoveNext: () => void;
  viewDate: Date;
  dispatcher: Dispatch<DateTimeReducerAction>;
}

const DateTimeScroller = ({
  title,
  scrollerType,
  onTitleClicked,
  onMovePrevious,
  onMoveNext,
  viewDate,
  dispatcher,
}: DateTimeScrollerProps) => {
  const context = useContext(DateTimeContext);
  const viewTemplate = context.dateScrollerTemplate;

  const templateProps = useAddDateTimeBaseTemplateProps<DateTimeScrollerTemplateProps>(
    {
      title,
      scrollerType,
      onTitleClicked,
      onMovePrevious,
      onMoveNext,
    },
    viewDate,
    dispatcher
  );

  const defaultTemplate = (_props: DateTimeScrollerTemplateProps, children: TypeOrArray<ReactNode>) => (
    <div className="bc-dt-scroller bsc:flex bsc:w-full bsc:flex-row bsc:items-center bsc:px-2 bsc:py-1">{children}</div>
  );

  const template = viewTemplate || defaultTemplate;

  return (
    <TemplateOutlet props={templateProps} template={template}>
      <div className="bc-dt-scroller-left bsc:shrink bsc:cursor-pointer">
        <Button className="bsc:bg-transparent bsc:focus:outline-hidden" onClick={onMovePrevious}>
          <BeeSoftIcon icon="chevronLeft" size={IconSize.Regular} />
        </Button>
      </div>
      <div className="bc-dt-scroller-title bsc:grow bsc:cursor-pointer bsc:text-center" onClick={onTitleClicked}>
        {title}
      </div>
      <div className="bc-dt-scroller-right bsc:shrink bsc:cursor-pointer">
        <Button className="bsc:bg-transparent bsc:focus:outline-hidden" onClick={onMoveNext}>
          <BeeSoftIcon icon="chevronRight" size={IconSize.Regular} />
        </Button>
      </div>
    </TemplateOutlet>
  );
};

export default DateTimeScroller;
