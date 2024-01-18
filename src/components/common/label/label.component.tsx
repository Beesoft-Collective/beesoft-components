import cx from 'classnames';
import { LabelProps } from './label.props.ts';

const Label = ({ label, htmlFor, readOnly = false, className }: LabelProps) => {
  const labelStyles = cx(className, {
    'bsc-text-black dark:bsc-text-mono-light-1': !readOnly,
    'bsc-text-gray-4 dark:bsc-text-mono-light-3': readOnly,
  });

  return (
    <label htmlFor={htmlFor} className={labelStyles}>
      {label}
    </label>
  );
};

export { Label };
