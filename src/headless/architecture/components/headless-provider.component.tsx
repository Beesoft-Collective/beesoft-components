import { PropsWithChildren } from 'react';
import { HeadlessProviderProps } from './headless-provider.props.ts';
import { HeadlessContext } from '../hooks/use-headless-context.ts';

/**
 * This component contains the code to pass context information to child headless components. For our framework the data
 * being passed are Signal objects that will be passed the actual data that is needed by the child component.
 * @param {Record<string, Signal<unknown>>} props - A JavaScript object of the named Signal objects; this should be memo'd in the parent component.
 * @param {React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | Iterable<React.ReactNode> | React.ReactPortal | boolean | undefined | null} children - The JSX to wrap the context around.
 * @returns {JSX.Element}
 * @constructor
 */
const HeadlessProvider = ({ props, children }: PropsWithChildren<HeadlessProviderProps>) => {
  return <HeadlessContext.Provider value={props}>{children}</HeadlessContext.Provider>;
};

export { HeadlessProvider };
