import { Signal, useSignalEffect } from '@preact/signals';
import cx from 'classnames';
import React, { CSSProperties, ReactNode, useEffect, useRef } from 'react';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  BeeSoftDataFilter,
  BeeSoftDataRetrieval,
  BeeSoftDataSort,
  JsonDataWrapper,
} from '../../../common/data-retrieval/data-retrieval.interfaces';
import { DataSender } from '../../../common/data-retrieval/data-sender';
import { JsonData } from '../../common-interfaces';

export interface DataScrollerProps {
  /**
   * Defines functions that are used to get data and the data sender.
   */
  dataRetriever: BeeSoftDataRetrieval<JsonDataWrapper>;
  /**
   * The number of items to return for each page.
   */
  pageSize?: number;
  /**
   * The number of pages to render around the current page.
   */
  surroundingPagesCount?: number;
  /**
   * The minimum number of items required to be considered a page. If the returned items are less than this number, then
   * they are appended to the previous page.
   */
  minimumPageCount?: number;
  /**
   * Determines if data requests should stop when no data is returned.
   */
  stopGetDataOnNoResults?: boolean;
  /**
   * The name of the id field; this is used to find individual records.
   */
  idFieldName?: string;
  /**
   * Allows external data updates to be applied to the data in the scroller.
   */
  allowDataUpdates?: boolean;
  /**
   * Causes the data ids to be cached, so when one of the ids changes the entire page will be reloaded.
   */
  useDataCache?: boolean;
  /**
   * The element to display when the data is loading.
   */
  dataLoadingElement?: JSX.Element;
  /**
   * The filters that are applied to the data.
   */
  filtersSignal?: Signal<Array<BeeSoftDataFilter>>;
  /**
   * The field sorting that was applied to the data.
   */
  sortsSignal?: Signal<Array<BeeSoftDataSort>>;
  /**
   * The event that is fired when data for a page is retrieved.
   * @param {number} page - The page the data was retrieved for.
   * @param {JsonData} data - The retrieved data.
   */
  onDataLoaded?: (page: number, data: JsonData) => void;
  /**
   * Css classes to be applied to the scroller.
   */
  className?: string;
  /**
   * The function used to render the markup from the data.
   * @param {JsonData} data - The data to render.
   * @param {number} currentItemCount - The total number of items from the previous pages.
   * @param {number} page - The current page of data to render.
   * @param {boolean} isLastPage - Indicates if the current page is the last page.
   * @returns {React.ReactNode | Array<React.ReactNode>} The markup to render.
   */
  children: (
    data: JsonData,
    currentItemCount: number,
    page: number,
    isLastPage?: boolean
  ) => ReactNode | Array<ReactNode>;
}

const DataScroller = ({
  dataRetriever,
  pageSize = 50,
  surroundingPagesCount = 1,
  minimumPageCount = 15,
  stopGetDataOnNoResults = true,
  idFieldName = 'id',
  allowDataUpdates = false,
  useDataCache = false,
  dataLoadingElement,
  filtersSignal,
  sortsSignal,
  onDataLoaded,
  className,
  children,
}: DataScrollerProps) => {
  const destroySubject = useRef<Subject<void>>();
  const dataSender = useRef<DataSender<JsonDataWrapper>>();

  useEffect(() => {
    destroySubject.current = new Subject<void>();

    new Observable<JsonDataWrapper>((subscriber) => {
      dataSender.current = new DataSender<JsonDataWrapper>(subscriber);
      dataRetriever.getDataSender?.(dataSender.current);
    })
      .pipe(takeUntil(destroySubject.current))
      .subscribe((dataWrapper) => {
        console.log('dataWrapper', dataWrapper);
      });

    return () => {
      destroySubject.current?.next();
      destroySubject.current?.complete();
    };
  }, []);

  useSignalEffect(() => {
    console.log('filters', filtersSignal?.value);
  });

  useSignalEffect(() => {
    console.log('sorts', sortsSignal?.value);
  });

  const marginStyles: CSSProperties = {
    marginTop: '0px',
    marginBottom: '0px',
  };
  const scrollerStyle = cx('bsc-overflow-auto', className);
  return (
    <div className={scrollerStyle}>
      <div style={marginStyles}></div>
    </div>
  );
};

export default DataScroller;
