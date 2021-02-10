import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import BeeSoftTransition from '../beesoft-transition/beesoft-transition.component';
import { DomHandler } from '../dom-handler';

interface OverlayBaseStyles {

}

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
                         hideTransitionOptions={hideTransitionOptions}>
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
