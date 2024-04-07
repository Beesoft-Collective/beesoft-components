import { CSSProperties, useEffect, useRef } from 'react';
import { ItemScrollerPageProps } from './item-scroller-page.props.ts';

const ItemScrollerPage = ({ intersectionObserver, resizeObserver, page, height, children }: ItemScrollerPageProps) => {
  const observedPage = useRef<Element>();

  useEffect(() => {
    return () => {
      if (observedPage.current) {
        intersectionObserver?.unobserve(observedPage.current);
        resizeObserver?.unobserve(observedPage.current);
      }
    };
  }, []);

  const onPageElementCreated = (element: Element) => {
    if (observedPage.current) {
      intersectionObserver?.unobserve(observedPage.current);
      resizeObserver?.unobserve(observedPage.current);
    }

    intersectionObserver?.observe(element);
    resizeObserver?.observe(element);

    observedPage.current = element;
  };

  const pageStyles: CSSProperties = height ? { height: `${height}px` } : {};

  return (
    <div
      data-page={page}
      data-name="page"
      style={pageStyles}
      ref={(element) => element && onPageElementCreated(element)}
    >
      {children}
    </div>
  );
};

export { ItemScrollerPage };
