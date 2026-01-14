import { TypeOrArray } from '@beesoft/common';
import React, { ReactNode } from 'react';
import { Easing } from "motion";

export interface MobileOverlayPanelProps {
  visible: boolean;
  target?: React.MouseEvent<Element, MouseEvent> | HTMLElement | Element | null;
  appendTo?: HTMLElement;
  unmountWhenHidden?: boolean;
  transitionDuration?: number;
  showTransitionOptions?: Easing;
  hideTransitionOptions?: Easing;
  approveText?: string;
  shown?: () => void;
  hidden?: () => void;
  isClickedWithin?: () => void;
  children: TypeOrArray<ReactNode>;
}
