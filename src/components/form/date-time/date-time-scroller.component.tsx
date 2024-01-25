import { ReactNode, useContext } from 'react';
import { TypeOrArray } from '../../common-interfaces.ts';
import { BeeSoftIcon } from '../../common/beesoft-icon/beesoft-icon.component.tsx';
import { IconSize } from '../../common/beesoft-icon/beesoft-icon.props.ts';
import TemplateOutlet, { TemplateFunction } from '../../common/template-outlet/template-outlet.component';
import { Button } from '../../navigation/buttons/button/button.component.tsx';
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
    <div className="bc-dt-scroller bsc-flex bsc-w-full bsc-flex-row bsc-items-center bsc-px-2 bsc-py-1">{children}</div>
  );

  const template = viewTemplate || defaultTemplate;

  return (
    <TemplateOutlet props={templateProps} template={template}>
      <div className="bc-dt-scroller-left bsc-flex-shrink bsc-cursor-pointer">
        <Button className="bsc-bg-transparent focus:bsc-outline-none" onClick={onMovePrevious}>
          <BeeSoftIcon icon="chevronLeft" size={IconSize.Regular} />
        </Button>
      </div>
      <div className="bc-dt-scroller-title bsc-flex-grow bsc-cursor-pointer bsc-text-center" onClick={onTitleClicked}>
        {title}
      </div>
      <div className="bc-dt-scroller-right bsc-flex-shrink bsc-cursor-pointer">
        <Button className="bsc-bg-transparent focus:bsc-outline-none" onClick={onMoveNext}>
          <BeeSoftIcon icon="chevronRight" size={IconSize.Regular} />
        </Button>
      </div>
    </TemplateOutlet>
  );
};

export default DateTimeScroller;
