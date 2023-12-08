import React, { ReactNode } from 'react';
import { TypeOrArray } from '../../common-interfaces.ts';

export interface MobileOverlayPanelProps {
  visible: boolean;
  target?: React.MouseEvent<Element, MouseEvent> | HTMLElement | Element | null;
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
