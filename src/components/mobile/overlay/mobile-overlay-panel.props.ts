import { TypeOrArray } from '@beesoft/common';
import React, { ReactNode } from 'react';

export interface MobileOverlayPanelProps {
  visible: boolean;
  target?: React.MouseEvent<Element, MouseEvent> | HTMLElement | Element | null;
  appendTo?: HTMLElement;
  unmountWhenHidden?: boolean;
  transitionDuration?: number;
  showTransitionOptions?: string;
  hideTransitionOptions?: string;
  approveText?: string;
  shown?: () => void;
  hidden?: () => void;
  isClickedWithin?: () => void;
  children: TypeOrArray<ReactNode>;
}
