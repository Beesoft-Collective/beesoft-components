import cx from 'classnames';
import { LabelProps } from './label.props.ts';

const Label = ({ label, htmlFor, readOnly = false, className }: LabelProps) => {
  const labelStyles = cx(
    'bc-label',
    {
      'bsc-text-black dark:bsc-text-mono-light-1': !readOnly,
      'bsc-text-gray-4 dark:bsc-text-mono-light-3 bsc-pointer-events-none': readOnly,
    },
    className
  );

  return (
    <label htmlFor={htmlFor} className={labelStyles}>
      {label}
    </label>
  );
};

export { Label };
