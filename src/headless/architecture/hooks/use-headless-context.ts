import { Signal } from '@preact/signals-react';
import { createContext, useContext } from 'react';

export const HeadlessContext = createContext<Record<string, Signal<any>>>(undefined!);

/**
 * Allows the headless context to be retrieved in a child component.
 * @returns {Signal<unknown> | undefined} The headless context.
 */
const useHeadlessContext = <T>(key?: string): Signal<T> | undefined => {
  const contextData = useContext<Record<string, Signal<T>>>(HeadlessContext);
  return key ? contextData[key] : undefined;
};

export { useHeadlessContext };
