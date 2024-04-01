import { JsonData } from '@beesoft/common';
import cx from 'classnames';
import { ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import { ItemScrollerPage } from './item-scroller-page.component.tsx';
import { ItemScrollerProps } from './item-scroller.props.ts';

const ItemScroller = ({
  scrollingElement,
  data,
  pageSize = 50,
  minimumPageCount = 15,
  enclosingPageCount = 1,
  className,
  onRequestPageData,
  children,
}: ItemScrollerProps) => {
  const [renderPages, setRenderPages] = useState<Array<number>>();

  const currentPage = useRef(1);
  const totalPages = useRef(0);
  const loadedData = useRef<JsonData>([]);
  const calculatedRenderPages = useRef<Record<string, JsonData>>({});
  const pageHeights = useRef<Record<number, number>>({});

  const intersectionObserver = useRef<IntersectionObserver>();
  const resizeObserver = useRef<ResizeObserver>();

  const uniqueId = useId();

  useEffect(() => {
    resizeObserver.current = new ResizeObserver(resizeCallback);

    return () => {
      resizeObserver.current?.disconnect();
      intersectionObserver.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (data) {
      loadedData.current = data;
      totalPages.current = calculateTotalPageCount();
      calculateRenderPageData();
      calculateRenderPages();
    } else {
      // if the component is loaded without data then request it
      onRequestPageData(1);
    }
  }, [data]);

  useEffect(() => {
    if (scrollingElement) {
      intersectionObserver.current = new IntersectionObserver(intersectionCallback, {
        root: scrollingElement,
      });
    }

    return () => {
      intersectionObserver.current?.disconnect();
    };
  }, [scrollingElement]);

  const intersectionCallback = (entries: Array<IntersectionObserverEntry>) => {
    console.log('intersection entries', entries);
  };

  const resizeCallback = useCallback((entries: Array<ResizeObserverEntry>) => {
    for (let i = 0, length = entries.length; i < length; i++) {
      const resizePage = parseInt(entries[i].target.getAttribute('data-page') || '1');
      const pageHeight = entries[i].contentRect.height;

      if (pageHeight > 0) {
        pageHeights.current[resizePage] = pageHeight;
      }
    }
  }, []);

  const calculateRenderPageIndices = (page: number) => {
    const dataLength = loadedData.current.length;
    const beginIndex = (page - 1) * pageSize;
    const endIndex =
      page === totalPages.current && page * pageSize < dataLength
        ? page * pageSize + (dataLength % pageSize)
        : page * pageSize;

    return [beginIndex, endIndex];
  };

  const calculateRenderPageData = () => {
    for (let i = 0, length = totalPages.current; i < length; i++) {
      const renderPage = i + 1;
      const [startIndex, endIndex] = calculateRenderPageIndices(renderPage);
      calculatedRenderPages.current[renderPage] = loadedData.current.slice(startIndex, endIndex);
    }
  };

  const calculateRenderPages = () => {
    const startPage = currentPage.current - enclosingPageCount >= 1 ? currentPage.current - enclosingPageCount : 1;
    const endPage =
      currentPage.current + enclosingPageCount <= totalPages.current
        ? currentPage.current + enclosingPageCount
        : totalPages.current;

    const pages: Array<number> = [];
    for (let current = startPage, end = endPage; current <= end; current++) {
      pages.push(current);
    }

    if (startPage === 1 && endPage === 1 && pages.length === 0) {
      pages.push(1);
    } else if (startPage > 1 && pages.length < enclosingPageCount * 2 + 1) {
      pages.splice(0, 0, startPage - 1);
    }

    setRenderPages(pages);
  };

  const calculateTotalPageCount = () => {
    const fullPages = Math.trunc(loadedData.current.length / pageSize) || 1;
    return loadedData.current.length > pageSize && loadedData.current.length % pageSize >= minimumPageCount
      ? fullPages + 1
      : fullPages;
  };

  const renderPagesMarkup = (pages: Array<number>) => {
    const finalMarkup: Array<ReactNode> = [];
    for (let page = 1, length = totalPages.current; page <= length; page++) {
      const isRenderPage = pages.includes(page);
      const height = isRenderPage ? pageHeights.current[page] : undefined;

      finalMarkup.push(
        <ItemScrollerPage
          key={`scroller_${uniqueId}_page_${page}`}
          intersectionObserver={intersectionObserver.current}
          resizeObserver={resizeObserver.current}
          page={page}
          height={height}
        >
          {isRenderPage && children(calculatedRenderPages.current[page], page)}
        </ItemScrollerPage>
      );
    }

    return finalMarkup;
  };

  const scrollerStyle = cx('bsc-overflow-y-auto', className);

  return <div className={scrollerStyle}>{renderPages && renderPagesMarkup(renderPages)}</div>;
};

export { ItemScroller };
