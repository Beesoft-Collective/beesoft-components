import React, { useState, useEffect } from 'react';

interface TransitionProps {
  children: (state: string) => React.ReactNode;
  in: boolean;
  timeout: number;
  onEnter?: () => void;
  onEntering?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
}

function Transition({
  children,
  in: inProp,
  timeout,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
}: TransitionProps) {
  const [currentState, setCurrentState] = useState(inProp ? 'entering' : 'exited');

  useEffect(() => {
    if (inProp) {
      setCurrentState('entering');
      onEnter && onEnter();
      const enterTimeout = setTimeout(() => {
        setCurrentState('entered');
        onEntered && onEntered();
      }, timeout);
      return () => clearTimeout(enterTimeout);
    } else {
      setCurrentState('exiting');
      onExit && onExit();
      const exitTimeout = setTimeout(() => {
        setCurrentState('exited');
        onExited && onExited();
      }, timeout);
      return () => clearTimeout(exitTimeout);
    }
  }, [inProp, timeout, onEnter, onEntered, onExit, onExited]);

  useEffect(() => {
    if (currentState === 'entering') {
      onEntering && onEntering();
    } else if (currentState === 'exiting') {
      onExiting && onExiting();
    }
  }, [currentState, onEntering, onExiting]);

  return children(currentState);
}

export default Transition;
