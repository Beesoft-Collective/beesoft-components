import { JsonData } from '@beesoft/common';
import { ReactNode } from 'react';

export interface ItemScrollerProps {
  /**
   * The scrollable HTML element that is used to contain the data pages.
   */
  scrollingElement?: Element | null;
  /**
   * The data to load into the scroller; it is recommended to memoize the data for this property, so the component
   * doesn't continuously render.
   */
  data?: JsonData;
  /**
   * The number of items contained on a single page.
   */
  pageSize?: number;
  /**
   * The minimum number of items that will be considered a "page". If the remaining items are less than this number they
   * will be added onto the previous page.
   */
  minimumPageCount?: number;
  /**
   * The number of pages to render above and below (when available) the current page.
   */
  enclosingPageCount?: number;
  className?: string;
  /**
   * Fired when the next page of data is needed; this will allow the consumer to load more data.
   * @param {number} page - The next page being requested.
   */
  onRequestPageData: (page: number) => void;
  /**
   * The child render function.
   * @param {JsonData} items - The data items the consumer will need to render.
   * @param {number} page - The page the data items are from.
   * @returns {Array<React.ReactNode>} The markup to render.
   */
  children: (items: JsonData, page: number) => Array<ReactNode>;
}
