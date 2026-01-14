import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { bindDocumentClickListener, unbindDocumentClickListener } from '../../common-event-handlers.ts';
import { getAllElementStyleValues } from '../../common-functions.ts';
import { Button } from '../../navigation/buttons/button/button.component.tsx';
import { getTargetElement } from '../../overlay/overlay-functions.ts';
import { MobileOverlayPanelProps } from './mobile-overlay-panel.props.ts';
import { useEvent } from "@beesoft/common";
import { TargetAndTransition } from "motion";
import { motion } from "motion/react";

const MobileOverlayPanel = ({
  visible,
  target,
  appendTo = document.body,
  unmountWhenHidden = false,
  transitionDuration = 400,
  showTransitionOptions = 'easeInOut',
  hideTransitionOptions = 'linear',
  approveText = 'DONE',
  shown,
  hidden,
  isClickedWithin,
  children,
}: MobileOverlayPanelProps) => {
  const [zIndex, setZIndex] = useState(-1);
  const [underlayZIndex, setUnderlayZIndex] = useState(-1);
  const [visibility, setVisibility] = useState(visible);
  const [animationComplete, setAnimationComplete] = useState(true);

  const underlayDisplayZIndex = useRef(100);
  const displayZIndex = useRef(101);
  const finalTarget = useRef<HTMLElement>(undefined);
  const panelRef = useRef<HTMLElement>(undefined);
  const listenerRef = useRef<(event: MouseEvent) => void>(undefined);
  const hasShown = useRef(false);

  const durationInSeconds = transitionDuration / 1000;

  useEffect(() => {
    if (target) {
      finalTarget.current = getTargetElement(target);
    }

    const parentZIndex = getAllElementStyleValues('zIndex', (styleValue) => {
      if (styleValue === 'auto' || styleValue === '-1') {
        return false;
      }

      return parseInt(styleValue) > 100;
    }).map((value) => parseInt(value, 10));

    if (parentZIndex.length > 0) {
      underlayDisplayZIndex.current = Math.max(...parentZIndex) + 1;
      displayZIndex.current = Math.max(...parentZIndex) + 2;
    }

    setAnimationComplete(false);
    setVisibility(visible);
  }, [visible, target]);

  const onPanelCreated = (element: HTMLElement) => {
    panelRef.current = element;
  };

  const onEntering = () => {
    setUnderlayZIndex(underlayDisplayZIndex.current);
    setZIndex(displayZIndex.current);
    hasShown.current = true;
  };

  const onEntered = () => {
    if (!panelRef.current) return;

    shown?.();

    let otherElements: Array<HTMLElement> | undefined = undefined;
    if (finalTarget.current) {
      otherElements = [finalTarget.current];
    }

    const clickListener = (clickedWithin: boolean) => {
      if (clickedWithin) {
        isClickedWithin?.();
      } else {
        setAnimationComplete(false);
        setVisibility(false);
      }
    };

    listenerRef.current = bindDocumentClickListener(panelRef.current, clickListener, otherElements);
  };

  const onExit = () => {
    if (listenerRef.current) {
      unbindDocumentClickListener(listenerRef.current);
    }
  };

  const onExited = () => {
    setUnderlayZIndex(-1);
    setZIndex(-1);
    hidden?.();
  };

  const onAnimationStart = useEvent(() => {
    if (visibility) {
      onEntering();
    } else {
      onExit();
    }
  });

  const onAnimationEnd = useEvent(() => {
    if (visibility) {
      onEntered();
    } else {
      onExited();
    }

    setAnimationComplete(true);
  });

  const underlayVisibleState: TargetAndTransition = {
    opacity: 0.5,
  };

  const underlayHiddenState: TargetAndTransition = {
    opacity: 0,
  };

  const panelVisibleState: TargetAndTransition = {
    opacity: 1,
    pointerEvents: 'auto',
  };

  const panelHiddenState: TargetAndTransition = {
    opacity: 0,
    pointerEvents: 'none',
  };

  return hasShown.current && !visibility && unmountWhenHidden === true && animationComplete
    ? null
    : ReactDOM.createPortal(
    <div>
      <motion.div
        className="bsc:fixed bsc:left-0 bsc:top-0 bsc:h-full bsc:w-full bsc:bg-mono-dark-1"
        style={{ zIndex: underlayZIndex }}
        initial={false}
        animate={visibility ? underlayVisibleState : underlayHiddenState}
      />
      <motion.div
        ref={(element) => { if (element) onPanelCreated(element) }}
        className="dark:bsc-border-mono-light-1 bsc:fixed bsc:bottom-0 bsc:left-0 bsc:w-full bsc:bg-white bsc:dark:border-t bsc:dark:border-solid bsc:dark:bg-mono-dark-1 bsc:dark:text-mono-light-1"
        style={{ zIndex }}
        initial={false}
        animate={visibility ? panelVisibleState : panelHiddenState}
        transition={{
          duration: durationInSeconds,
          ease: visibility ? showTransitionOptions : hideTransitionOptions
        }}
        onAnimationStart={onAnimationStart}
        onAnimationComplete={onAnimationEnd}
      >
        <div className="bsc:w-full">{children}</div>
        <>
          <Button
            buttonType="primary"
            fullWidth={true}
            onClick={() => setVisibility(false)}
            className="bsc:text-xs bsc:font-bold"
          >
            {approveText}
          </Button>
        </>
      </motion.div>
    </div>,
    appendTo
  );
};

export { MobileOverlayPanel };
