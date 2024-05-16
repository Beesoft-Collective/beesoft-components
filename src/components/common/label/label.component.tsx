import cx from 'classnames';
import { HeadlessLabel } from '../../../headless/components/common/label/headless-label.component.tsx';
import { LabelProps } from './label.props.ts';

const Label = ({ label, htmlFor, readOnly = false, className }: LabelProps) => {
  const labelStyles = cx(
    'bc-label',
    {
      'bsc-text-black dark:bsc-text-mono-light-1': !readOnly,
      'bc-read-only bsc-text-gray-4 dark:bsc-text-mono-light-3 bsc-pointer-events-none': readOnly,
    },
    className
  );

  return <HeadlessLabel label={label} htmlFor={htmlFor} className={labelStyles} />;
};

export { Label };
