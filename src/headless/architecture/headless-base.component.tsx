import { useEffect } from 'react';
import { HeadlessBaseProps } from './headless-base.props.ts';
import { useHeadlessContext } from './use-headless-context.ts';

/**
 * This is a basic wrapper around the different core pieces of a headless component.
 * @param {T} props - The properties that need to be sent through the child render function to render the visual part of the component.
 * @param {string | undefined} signalName - The name (if needed) of the signal required by this component to retrieve data updates.
 * @param {((signal: Signal) => void) | undefined} onSignalRetrieved - When the `signalName` is defined this will be called when the Signal object is received.
 * @param {(<T>(props: T) => React.JSX.Element) | undefined} children - The child render function called to render the visual part of the component.
 * @returns {undefined | React.JSX.Element}
 * @constructor
 */
const HeadlessBase = <T,>({ props, signalName, onSignalRetrieved, children }: HeadlessBaseProps<T>) => {
  const context = useHeadlessContext();

  useEffect(() => {
    if (context && signalName && context[signalName] && onSignalRetrieved) {
      onSignalRetrieved(context[signalName]);
    }
  }, [context]);

  return children && children(props);
};

export { HeadlessBase };
