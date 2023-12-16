import { ReactNode } from 'react';
import { TypeOrArray } from '../../common-interfaces.ts';

export interface MediaQueryProps {
  mobileQuery?: string;
  tabletQuery?: string;
  desktopQuery?: string;
  mobileMarkup?: TypeOrArray<ReactNode>;
  aboveMobileMarkup?: TypeOrArray<ReactNode>;
  tabletMarkup?: TypeOrArray<ReactNode>;
  aboveTabletMarkup?: TypeOrArray<ReactNode>;
  desktopMarkup?: TypeOrArray<ReactNode>;
}
