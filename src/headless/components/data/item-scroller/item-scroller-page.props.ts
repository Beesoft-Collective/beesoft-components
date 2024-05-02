import { TypeOrArray } from '@beesoft/common';
import { ReactNode } from 'react';

export interface ItemScrollerPageProps {
  intersectionObserver?: IntersectionObserver;
  resizeObserver?: ResizeObserver;
  page: number;
  height?: number;
  children: TypeOrArray<ReactNode>;
}
