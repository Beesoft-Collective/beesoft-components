import { TypeOrArray } from '@beesoft/common';
import { CSSProperties, ReactNode } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

export interface BeeSoftChildrenTransitionProps {
  state: TransitionStatus;
  defaultStyles: CSSProperties;
  transitionStyles: Record<string, CSSProperties>;
}

export interface BeeSoftTransitionProps {
  start: boolean;
  timeout?: number;
  defaultStyles?: CSSProperties;
  transitionStyles?: Record<string, CSSProperties>;
  showTransitionOptions?: string;
  hideTransitionOptions?: string;
  unmountOnExit?: boolean;
  onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
  onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
  onExit?: (node: HTMLElement) => void;
  onExited?: (node: HTMLElement) => void;
  children: (childProps: BeeSoftChildrenTransitionProps) => TypeOrArray<ReactNode>;
}

const BeeSoftTransition = ({
  start,
  timeout = 400,
  defaultStyles,
  transitionStyles,
  showTransitionOptions = 'cubic-bezier(0, 0, 0.2, 1)',
  hideTransitionOptions = 'linear',
  unmountOnExit = false,
  onEntering,
  onEntered,
  onExit,
  onExited,
  children,
}: BeeSoftTransitionProps) => {
  const initialStyle = defaultStyles || {
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
      unmountOnExit={unmountOnExit}
    >
      {(state) => children({ state, defaultStyles: initialStyle, transitionStyles: transitions })}
    </Transition>
  );
};

export default BeeSoftTransition;
