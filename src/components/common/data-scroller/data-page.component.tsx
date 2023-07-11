import React, { ReactNode, useCallback, useEffect, useRef } from 'react';

export interface DataPageProps {
  page: number;
  intersectionObserver?: IntersectionObserver;
  resizeObserver?: ResizeObserver;
  children: ReactNode | Array<ReactNode>;
}

const DataPage = ({ page, intersectionObserver, resizeObserver, children }: DataPageProps) => {
  const observedContainerElement = useRef<Element>();
  const observedPageElement = useRef<Element>();

  useEffect(() => {
    return () => {
      if (observedContainerElement.current && resizeObserver) {
        resizeObserver.unobserve(observedContainerElement.current);
      }

      if (observedPageElement.current && intersectionObserver) {
        intersectionObserver.unobserve(observedPageElement.current);
      }
    };
  }, []);

  const onContainerElementCreated = useCallback((element: Element) => {
    if (observedContainerElement.current && !element.isSameNode(observedContainerElement.current)) {
      resizeObserver?.unobserve(observedContainerElement.current);
    }

    resizeObserver?.observe(element);
    observedContainerElement.current = element;
  }, []);

  const onPageElementCreated = useCallback((element: Element) => {
    if (observedPageElement.current && !element.isSameNode(observedPageElement.current)) {
      intersectionObserver?.unobserve(observedPageElement.current);
    }

    intersectionObserver?.observe(element);
    observedPageElement.current = element;
  }, []);

  return (
    <div ref={(element) => element && onContainerElementCreated(element)} data-page={page}>
      {children}
      <div ref={(element) => element && onPageElementCreated(element)} data-page={page} />
    </div>
  );
};

export default DataPage;
