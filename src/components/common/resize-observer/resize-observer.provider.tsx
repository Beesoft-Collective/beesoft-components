import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export interface ResizeObserverProviderProps {
  observationTarget?: Element | SVGElement;
  children: React.ReactNode;
}

const ResizeObserverContext = createContext<ClientRect | DOMRect>(undefined!);

export function useResizeObserver() {
  return useContext(ResizeObserverContext);
}

export default function ResizeObserverProvider({ observationTarget, children }: ResizeObserverProviderProps) {
  const [observerEntries, setObserverEntries] = useState<ClientRect | DOMRect>({
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const hasResizeObserver = useRef(!!ResizeObserver);
  const resizeObserverRef = useRef<ResizeObserver>();
  const mutationObserverRef = useRef<MutationObserver>();
  const previousTarget = useRef<Element | SVGElement>();

  const config: MutationObserverInit = {
    attributeFilter: ['style'],
    attributes: true,
    subtree: true,
  };

  useEffect(() => {
    console.log('children', children);
    if (hasResizeObserver.current) {
      resizeObserverRef.current = new ResizeObserver(resizeObserverCallback);
    } else {
      mutationObserverRef.current = new MutationObserver(mutationObserverCallback);
    }

    return () => disconnect();
  }, []);

  useEffect(() => {
    if (observationTarget) {
      if (previousTarget.current) {
        unobserve(previousTarget.current);
      }

      previousTarget.current = observationTarget;
      observe();
    }
  }, [observationTarget]);

  const observe = () => {
    if (observationTarget) {
      if (hasResizeObserver.current) {
        resizeObserverRef.current?.observe(observationTarget);
      } else {
        mutationObserverRef.current?.observe(observationTarget, config);
      }
    }
  };

  const unobserve = (target: Element | SVGElement) => {
    if (hasResizeObserver.current) {
      resizeObserverRef.current?.unobserve(target);
    } else {
      mutationObserverRef.current?.disconnect();
    }
  };

  const disconnect = () => {
    if (hasResizeObserver.current) {
      resizeObserverRef.current?.disconnect();
    } else {
      mutationObserverRef.current?.disconnect();
    }
  };

  const resizeObserverCallback = (entries: Array<ResizeObserverEntry>) => {
    setObserverEntries(entries[entries.length - 1].contentRect);
  };

  const mutationObserverCallback = (entries: Array<MutationRecord>) => {
    const possibleEntries = entries.filter((entry) => observationTarget?.contains(entry.target));
    const mutationEntry = possibleEntries[possibleEntries.length - 1].target as HTMLElement;
    setObserverEntries({
      top: mutationEntry.offsetTop,
      left: mutationEntry.offsetLeft,
      width: mutationEntry.offsetWidth,
      height: mutationEntry.offsetHeight,
      bottom: 0,
      right: 0,
    });
  };

  return <ResizeObserverContext.Provider value={observerEntries}>{children}</ResizeObserverContext.Provider>;
}
