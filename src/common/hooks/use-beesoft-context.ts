import { createContext, useContext } from 'react';
import { BeeSoftContextProps } from '../contexts/beesoft.context.props.ts';

export const BeeSoftContext = createContext<BeeSoftContextProps>(undefined!);

const useBeeSoftContext = () => {
  // the components in the library will only use the context when the user sets it up
  return useContext(BeeSoftContext);
};

export { useBeeSoftContext };
