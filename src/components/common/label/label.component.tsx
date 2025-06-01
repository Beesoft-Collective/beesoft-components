import cx from 'classnames';
import { LabelProps } from './label.props.ts';
import { HeadlessLabel } from '@beesoft/headless-ui';

const Label = ({ label, htmlFor, readOnly = false, className }: LabelProps) => {
  const labelStyles = cx(
    'bc-label',
    {
      'bsc:text-black bsc:dark:text-mono-light-1': !readOnly,
      'bc-read-only bsc:text-gray-4 bsc:dark:text-mono-light-3 bsc:pointer-events-none': readOnly,
    },
    className
  );

  return <HeadlessLabel label={label} htmlFor={htmlFor} className={labelStyles} />;
};

export { Label };
