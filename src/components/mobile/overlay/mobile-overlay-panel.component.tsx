import { CSSProperties, useEffect, useRef, useState } from 'react';
import { bindDocumentClickListener, unbindDocumentClickListener } from '../../common-event-handlers.ts';
import { getAllElementStyleValues } from '../../common-functions.ts';
import BeeSoftTransition from '../../common/beesoft-transition/beesoft-transition.component.tsx';
import { Button } from '../../navigation/buttons/button/button.component.tsx';
import { getTargetElement } from '../../overlay/overlay-functions.ts';
import { MobileOverlayPanelProps } from './mobile-overlay-panel.props.ts';

const MobileOverlayPanel = ({
  visible,
  target,
  unmountWhenHidden = false,
  transitionDuration = 400,
  showTransitionOptions = 'cubic-bezier(0, 0, 0.2, 1)',
  hideTransitionOptions = 'linear',
  shown,
  hidden,
  isClickedWithin,
  children,
}: MobileOverlayPanelProps) => {
  const [zIndex, setZIndex] = useState(-1);
  const [underlayZIndex, setUnderlayZIndex] = useState(-1);
  const [visibility, setVisibility] = useState(visible);

  const underlayDisplayZIndex = useRef(100);
  const displayZIndex = useRef(101);
  const finalTarget = useRef<HTMLElement>();
  const panelRef = useRef<HTMLElement>();
  const listenerRef = useRef<(event: MouseEvent) => void>();

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

    setVisibility(visible);
  }, [visible, target]);

  const onEntering = () => {
    setUnderlayZIndex(underlayDisplayZIndex.current);
    setZIndex(displayZIndex.current);
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

  const maskOverrideStyles: Record<string, CSSProperties> = {
    entering: { opacity: 0.5 },
    entered: { opacity: 0.5 },
  };

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
        <>
          <div
            className="bsc-fixed bsc-left-0 bsc-top-0 bsc-h-full bsc-w-full bsc-bg-mono-dark-1"
            style={{
              zIndex: underlayZIndex,
              ...transitionStyles[state],
              ...maskOverrideStyles[state],
            }}
          />
          <div
            className="bsc-fixed bsc-left-0 bsc-bottom-0 bsc-bg-white bsc-w-full"
            style={{ zIndex, ...defaultStyle, ...transitionStyles[state] }}
          >
            <div className="bsc-w-full">{children}</div>
            <>
              <Button buttonType="primary" fullWidth={true} className="bsc-text-xs bsc-font-bold">
                DONE
              </Button>
            </>
          </div>
        </>
      )}
    </BeeSoftTransition>
  );
};

export { MobileOverlayPanel };
