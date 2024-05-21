import { Signal } from '@preact/signals';
import { createContext, useContext } from 'react';

export const HeadlessContext = createContext<Record<string, Signal>>(undefined!);

/**
 * Allows the headless context to be retrieved in a child component.
 * @returns {Record<string, Signal<any>>} The headless context.
 */
const useHeadlessContext = () => {
  return useContext(HeadlessContext);
};

export { useHeadlessContext };
