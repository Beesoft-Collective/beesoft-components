import cx from 'classnames';
import { useMemo, useRef } from 'react';
import { BeeSoftIconList, BeeSoftIconProps, IconSize } from './beesoft-icon.props.ts';
import { CalendarIcon } from './icons/calendar-icon.tsx';
import { ChevronDownIcon } from './icons/chevron-down-icon.tsx';
import { ChevronLeftIcon } from './icons/chevron-left-icon.tsx';
import { ChevronRightIcon } from './icons/chevron-right-icon.tsx';
import { ChevronUpIcon } from './icons/chevron-up-icon.tsx';
import { CloseIcon } from './icons/close-icon.tsx';
import { MinusIcon } from './icons/minus-icon.tsx';
import { PlusIcon } from './icons/plus-icon.tsx';

const BeeSoftIcon = ({ icon, size = IconSize.Regular, onClick, className }: BeeSoftIconProps) => {
  const iconList = useRef<BeeSoftIconList>({
    calendar: CalendarIcon,
    chevronDown: ChevronDownIcon,
    chevronLeft: ChevronLeftIcon,
    chevronRight: ChevronRightIcon,
    chevronUp: ChevronUpIcon,
    close: CloseIcon,
    minus: MinusIcon,
    plus: PlusIcon,
  });
  const Icon = useMemo(() => iconList.current[icon] || CalendarIcon, [icon]);

  const iconStyles = cx(
    {
      'bsc-h-[24px] bsc-w-[24px]': size === IconSize.Regular,
      'bsc-h-[20px] bsc-w-[20px]': size === IconSize.Small,
    },
    className
  );

  return (
    <div onClick={onClick}>
      <Icon className={iconStyles} />
    </div>
  );
};

export { BeeSoftIcon };
