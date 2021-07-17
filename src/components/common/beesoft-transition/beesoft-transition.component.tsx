import React, { ReactNode, ReactNodeArray } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

export interface BeeSoftChildrenTransitionProps {
  state: TransitionStatus;
  defaultStyle: React.CSSProperties;
  transitionStyles: Record<string, React.CSSProperties>;
}

export interface BeeSoftTransitionProps {
  start: boolean;
  timeout?: number;
  defaultStyle?: React.CSSProperties;
  transitionStyles?: Record<string, React.CSSProperties>;
  showTransitionOptions?: string;
  hideTransitionOptions?: string;
  onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
  onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
  onExit?: (node: HTMLElement) => void;
  onExited?: (node: HTMLElement) => void;
  children: (childProps: BeeSoftChildrenTransitionProps) => ReactNode | ReactNodeArray;
}

export default function BeeSoftTransition({
  start,
  timeout = 400,
  defaultStyle,
  transitionStyles,
  showTransitionOptions = 'cubic-bezier(0, 0, 0.2, 1)',
  hideTransitionOptions = 'linear',
  onEntering,
  onEntered,
  onExit,
  onExited,
  children,
}: BeeSoftTransitionProps) {
  const initialStyle = defaultStyle || {
    transition: `opacity ${timeout}ms ${showTransitionOptions}`,
    opacity: 0,
  };

  const transitions = transitionStyles || {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: {
      transition: `opacity ${timeout}ms ${hideTransitionOptions}`,
      opacity: 0,
    },
    exited: {
      transition: `opacity ${timeout}ms ${hideTransitionOptions}`,
      opacity: 0,
    },
    unmounted: {},
  };

  return (
    <Transition
      in={start}
      timeout={timeout}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExited={onExited}
    >
      {(state) => children({ state, defaultStyle: initialStyle, transitionStyles: transitions })}
    </Transition>
  );
}
