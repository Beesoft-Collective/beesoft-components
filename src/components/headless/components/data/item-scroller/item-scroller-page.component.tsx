import { CSSProperties, memo, useEffect, useRef } from 'react';
import { ItemScrollerPageProps } from './item-scroller-page.props.ts';

const ItemScrollerPageComponent = ({
  intersectionObserver,
  resizeObserver,
  page,
  height,
  children,
}: ItemScrollerPageProps) => {
  const observedPage = useRef<Element>();

  useEffect(() => {
    return () => {
      if (observedPage.current) {
        intersectionObserver?.unobserve(observedPage.current);
        resizeObserver?.unobserve(observedPage.current);
      }
    };
  }, []);

  useEffect(() => {
    if (observedPage.current) {
      intersectionObserver?.observe(observedPage.current);
    }

    return () => {
      if (observedPage.current && intersectionObserver) {
        intersectionObserver.unobserve(observedPage.current);
      }
    };
  }, [intersectionObserver]);

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

const ItemScrollerPage = memo(ItemScrollerPageComponent);
export { ItemScrollerPage };
