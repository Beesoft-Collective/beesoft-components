import { memo, useEffect, useRef } from 'react';
import { ScrollerPageMarkerProps } from './scroller-page-marker.props.ts';

const ScrollerPageMarkerComponent = ({ intersectionObserver, page }: ScrollerPageMarkerProps) => {
  const observedMarker = useRef<Element>();

  useEffect(() => {
    return () => {
      if (observedMarker.current) {
        intersectionObserver?.unobserve(observedMarker.current);
      }
    };
  }, []);

  const onMarkerElementCreated = (element: Element) => {
    if (observedMarker.current) {
      intersectionObserver?.unobserve(observedMarker.current);
    }

    intersectionObserver?.observe(element);
    observedMarker.current = element;
  };

  return <div data-page={page} data-name="marker" ref={(element) => element && onMarkerElementCreated(element)} />;
};

const ScrollerPageMarker = memo(ScrollerPageMarkerComponent);
export { ScrollerPageMarker };
