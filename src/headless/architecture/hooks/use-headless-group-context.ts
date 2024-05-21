import { createContext, useContext } from 'react';

export interface HeadlessGroupContextProps {
  sharedId: string;
}

export const HeadlessGroupContext = createContext<HeadlessGroupContextProps>(undefined!);

const useHeadlessGroupContext = () => {
  return useContext(HeadlessGroupContext);
};

export { useHeadlessGroupContext };
