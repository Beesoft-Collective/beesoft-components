import { useId, useMemo } from 'react';
import {
  HeadlessGroupContext,
  HeadlessGroupContextProps,
} from '../../../architecture/hooks/use-headless-group-context.ts';
import { HeadlessGroupProps } from './headless-group.props.ts';

const HeadlessGroup = ({ children }: HeadlessGroupProps) => {
  // this will be used to associate a control with something like a label...use a context to share this
  const sharedId = useId();

  const contextProps = useMemo<HeadlessGroupContextProps>(() => {
    return {
      sharedId,
    };
  }, [sharedId]);

  return <HeadlessGroupContext.Provider value={contextProps}>{children}</HeadlessGroupContext.Provider>;
};

export { HeadlessGroup };
