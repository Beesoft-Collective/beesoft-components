import cx from 'classnames';
import { FC } from 'react';
import { IconProps } from './icon.props.ts';

const ChevronUpIcon: FC<IconProps> = ({ className }) => {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  );
};

export { ChevronUpIcon };
