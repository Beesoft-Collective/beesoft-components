import { PropsWithChildren } from 'react';
import { BeeSoftContext } from '../hooks/use-beesoft-context.ts';
import { BeeSoftContextProps } from './beesoft.context.props.ts';

const BeeSoftProvider = ({
  overlayKeepOnScreen = true,
  useAnimations = true,
  mobileMediaQuery,
  tabletMediaQuery,
  desktopMediaQuery,
  isValidScrollableElement,
  children,
}: PropsWithChildren<BeeSoftContextProps>) => {
  const contextProps: BeeSoftContextProps = {
    overlayKeepOnScreen,
    useAnimations,
    mobileMediaQuery,
    tabletMediaQuery,
    desktopMediaQuery,
    isValidScrollableElement,
  };

  return <BeeSoftContext.Provider value={contextProps}>{children}</BeeSoftContext.Provider>;
};

export { BeeSoftProvider };
