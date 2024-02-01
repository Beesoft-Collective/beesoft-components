import cx from 'classnames';
import { useMemo, useRef } from 'react';
import { BeeSoftIconProps, IconSize } from './beesoft-icon.props.ts';
import { BeeSoftIconService } from './beesoft-icon.service.tsx';
import { CalendarIcon } from './icons/calendar-icon.tsx';

const BeeSoftIcon = ({ icon, size = IconSize.Regular, onClick, className }: BeeSoftIconProps) => {
  const iconService = useRef(BeeSoftIconService.getInstance());
  const Icon = useMemo(() => iconService.current.getIcon(icon) || CalendarIcon, [icon]);

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
