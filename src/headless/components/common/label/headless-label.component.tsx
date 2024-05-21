import { useMemo } from 'react';
import { useHeadlessGroupContext } from '../../../architecture/hooks/use-headless-group-context.ts';
import { HeadlessLabelProps } from './headless-label.props.ts';

const HeadlessLabel = ({ label, htmlFor, className }: HeadlessLabelProps) => {
  const groupContext = useHeadlessGroupContext();
  const labelId = useMemo(() => groupContext?.sharedId || htmlFor, [groupContext?.sharedId, htmlFor]);

  return (
    <label htmlFor={labelId} className={className}>
      {label}
    </label>
  );
};

export { HeadlessLabel };
