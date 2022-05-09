import { throttle } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { bindDocumentClickListener, unbindDocumentClickListener } from '../../common-event-handlers';
import { getAllElementStyleValues, getElementByCssStylesRecursive, isEventWithinTarget } from '../../common-functions';
import { MarkupEvents } from '../../common-interfaces';
import BeeSoftTransition from '../../common/beesoft-transition/beesoft-transition.component';
import { DomHandler } from '../../dom-handler';

export interface OverlayPanelProps {
  visible: boolean;
  target?: React.MouseEvent<Element, MouseEvent> | HTMLElement | Element | null;
  shouldTargetCloseOverlay?: boolean;
  shouldMatchTargetWidth?: boolean;
  shouldScrollCloseOverlay?: boolean;
  shouldCheckZIndex?: boolean;
  unmountWhenHidden?: boolean;
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
  shouldScrollCloseOverlay = false,
  shouldCheckZIndex = false,
  unmountWhenHidden = false,
  appendTo = document.body,
  transitionDuration = 400,
  showTransitionOptions = 'cubic-bezier(0, 0, 0.2, 1)',
  hideTransitionOptions = 'linear',
  shown,
  hidden,
  markupCreated,
  children,
}: OverlayPanelProps & MarkupEvents) {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [zIndex, setZIndex] = useState(-1);
  const displayZIndex = useRef(100);
  const [visibility, setVisibility] = useState(visible);
  const panelRef = useRef<HTMLElement>();
  const scrollerPanelRef = useRef<HTMLElement>();
  const listenerRef = useRef<(event: MouseEvent) => void>();
  const scrollListenerRef = useRef<(event: Event) => void>();

  useEffect(() => {
    if (target) {
      const finalTarget = getTargetElement(target);
      const position = DomHandler.positionToTarget(finalTarget);

      if (shouldScrollCloseOverlay) {
        scrollerPanelRef.current = getElementByCssStylesRecursive(finalTarget, {
          overflow: 'scroll, auto',
          overflowX: 'scroll, auto',
          overflowY: 'scroll, auto',
        });
      }

      if (shouldCheckZIndex) {
        const parentZIndex = getAllElementStyleValues('zIndex', (styleValue) => {
          const elementZIndex = parseInt(styleValue);

          return elementZIndex >= 100;
        }).map((item) => parseInt(item));
        if (parentZIndex.length > 0) {
          displayZIndex.current = Math.max(...parentZIndex) + 1;
        }
      }

      setWidth(finalTarget.offsetWidth);
      setTop(position.top);
      setLeft(position.left);
    }

    if (visible !== undefined) {
      setVisibility(visible);
    }
  }, [target, visible, shouldMatchTargetWidth, shouldScrollCloseOverlay, shouldCheckZIndex]);

  const getTargetElement = (target: React.MouseEvent<Element, MouseEvent> | HTMLElement | Element) => {
    return ((target as React.MouseEvent<Element, MouseEvent>).target
      ? (target as React.MouseEvent<Element, MouseEvent>).target
      : target) as HTMLElement;
  };

  const onEntering = () => {
    setZIndex(displayZIndex.current);
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

    if (shouldScrollCloseOverlay) {
      scrollListenerRef.current = throttle(
        (event: Event) => panelRef.current && !isEventWithinTarget(event, panelRef.current) && setVisibility(false),
        100
      );
      if (scrollerPanelRef.current) {
        scrollerPanelRef.current.addEventListener('scroll', scrollListenerRef.current);
      }
    }
  };

  const onExit = () => {
    if (scrollerPanelRef.current && scrollListenerRef.current) {
      scrollerPanelRef.current.removeEventListener('scroll', scrollListenerRef.current);
      scrollListenerRef.current = undefined;
    }

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

  const onMarkupCreated = (element: HTMLElement) => {
    panelRef.current = element;
    markupCreated && markupCreated(element);
  };

  const createElement = () => {
    const baseStyles: React.CSSProperties = {
      top: `${top}px`,
      left: `${left}px`,
      zIndex,
    };

    if (shouldMatchTargetWidth) {
      baseStyles['width'] = `${width}px`;
    }

    return (
      <BeeSoftTransition
        start={visibility}
        timeout={transitionDuration}
        showTransitionOptions={showTransitionOptions}
        hideTransitionOptions={hideTransitionOptions}
        onEntering={onEntering}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
        unmountOnExit={unmountWhenHidden}
      >
        {({ state, defaultStyle, transitionStyles }) => (
          <div
            className="bsc-fixed bsc-bg-white dark:bsc-bg-gray-900 bsc-border bsc-border-solid dark:bsc-text-white dark:bsc-border-white bsc-shadow"
            style={{
              ...baseStyles,
              ...defaultStyle,
              ...transitionStyles[state],
            }}
            ref={(element) => element && onMarkupCreated(element as HTMLElement)}
          >
            {children}
          </div>
        )}
      </BeeSoftTransition>
    );
  };

  return ReactDOM.createPortal(createElement(), appendTo);
}
