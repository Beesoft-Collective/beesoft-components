import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import BeeSoftTransition from '../beesoft-transition/beesoft-transition.component';
import { bindDocumentClickListener, unbindDocumentClickListener } from '../common-event-handlers';
import { DomHandler } from '../dom-handler';

export interface OverlayPanelProps {
  visible: boolean;
  target?: React.MouseEvent<Element, MouseEvent> | HTMLElement | Element | null;
  shouldTargetCloseOverlay?: boolean;
  shouldMatchTargetWidth?: boolean;
  appendTo?: HTMLElement;
  transitionDuration?: number;
  showTransitionOptions?: string;
  hideTransitionOptions?: string;
  shown?: () => void;
  hidden?: () => void;
  children: React.ReactNode;
}

export default function OverlayPanel({
                                       visible,
                                       target,
                                       shouldTargetCloseOverlay = true,
                                       shouldMatchTargetWidth = false,
                                       appendTo = document.body,
                                       transitionDuration = 400,
                                       showTransitionOptions = 'cubic-bezier(0, 0, 0.2, 1)',
                                       hideTransitionOptions = 'linear',
                                       shown,
                                       hidden,
                                       children
                                     }: OverlayPanelProps) {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [zIndex, setZIndex] = useState(-1);
  const [visibility, setVisibility] = useState(visible);
  const panelRef = useRef<HTMLDivElement>(null);
  const listenerRef = useRef<(event: MouseEvent) => void>();

  useEffect(() => {
    if (target) {
      const finalTarget = getTargetElement(target);
      const position = DomHandler.positionToTarget(finalTarget);

      setWidth(finalTarget.offsetWidth);
      setTop(position.top);
      setLeft(position.left);
    }

    if (visible !== undefined) {
      setVisibility(visible);
    }
  }, [target, visible, shouldMatchTargetWidth]);

  const getTargetElement = (target: React.MouseEvent<Element, MouseEvent> | HTMLElement | Element) => {
    return ((target as React.MouseEvent<Element, MouseEvent>).target
      ? (target as React.MouseEvent<Element, MouseEvent>).target
      : target) as HTMLElement;
  };

  const onEntering = () => {
    setZIndex(100);
  };

  const onEntered = () => {
    if (!panelRef.current) return;

    if (shown) {
      shown();
    }

    let otherElements: Array<HTMLElement> | undefined = undefined;
    if (!shouldTargetCloseOverlay) {
      otherElements = [target as HTMLElement];
    }

    const clickListener = (clickedWithin: boolean) => !clickedWithin && setVisibility(false);
    listenerRef.current = bindDocumentClickListener(panelRef.current, clickListener, otherElements);
  };

  const onExit = () => {
    if (listenerRef.current) {
      unbindDocumentClickListener(listenerRef.current);
    }
  };

  const onExited = () => {
    setZIndex(-1);

    if (hidden) {
      hidden();
    }
  };

  const createElement = () => {
    let baseStyles: React.CSSProperties = {
      top: `${top}px`,
      left: `${left}px`,
      zIndex
    };

    if (shouldMatchTargetWidth) {
      baseStyles['width'] = `${width}px`;
    }

    return (
      <BeeSoftTransition start={visibility}
                         timeout={transitionDuration}
                         showTransitionOptions={showTransitionOptions}
                         hideTransitionOptions={hideTransitionOptions}
                         onEntering={onEntering}
                         onEntered={onEntered}
                         onExit={onExit}
                         onExited={onExited}>
        {({ state, defaultStyle, transitionStyles }) => (
          <div
            className="absolute bg-white shadow"
            style={{
              ...baseStyles,
              ...defaultStyle,
              ...transitionStyles[state],
            }}
            ref={panelRef}
          >
            {children}
          </div>
        )}
      </BeeSoftTransition>
    );
  };

  return ReactDOM.createPortal(createElement(), appendTo);
}
