import { useDeepMemo } from '@beesoft/common';
import { useEffect } from 'react';
import { forceAssert } from '../../../components/common-functions.ts';
import { useHeadlessContext } from '../hooks/use-headless-context.ts';
import { HeadlessBaseProps } from './headless-base.props.ts';
import { HeadlessField } from './headless-field.component.tsx';

const HeadlessBase = <P, RP>({
  type,
  props,
  renderProps,
  signalName,
  onSignalRetrieved,
  children,
  className,
}: HeadlessBaseProps<P, RP>) => {
  const context = useHeadlessContext();

  const { id, name } = useDeepMemo<{ id?: string; name?: string }>(() => {
    const convertedProps = forceAssert<Record<string, unknown>>(props);
    return {
      id: convertedProps['id'] as string,
      name: convertedProps['name'] as string,
    };
  }, [props]);

  useEffect(() => {
    if (context && signalName && context[signalName] && onSignalRetrieved) {
      onSignalRetrieved(context[signalName]);
    }
  }, [context]);

  return (
    <>
      {id && name && type && <HeadlessField id={id} name={name} type={type} className={className} {...props} />}
      {children && children(renderProps)}
    </>
  );
};

export { HeadlessBase };
