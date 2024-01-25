import cx from 'classnames';
import { FC } from 'react';
import { IconProps } from './icon.props.ts';

const ChevronLeftIcon: FC<IconProps> = ({ className }) => {
  const svgStyles = cx('bsc-h-6 bsc-w-6', className);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={svgStyles}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
};

export { ChevronLeftIcon };
