import { Key } from 'react';
import { JsonData, JsonDataItem } from '../../components/common-interfaces';
import { FormFieldType } from '../../components/form/form-control.interface';
import { DataSender } from './data-sender';

/**
 * A simple data wrapper that allows for passing custom options to be returned by the calling component.
 */
export interface JsonDataWrapper {
  data?: JsonData;
  /**
   * Used as a pass through to a data requesting component, so the calling component can know who the request came from.
   */
  customProperties?: JsonDataItem;
}

/**
 * Defines interfaces for retrieving data from a backend.
 */
export interface BeeSoftDataRetrieval<T> {
  /**
   * Called when an initial page of data is needed or when the current page has reached the end.
   * @param {DataSender<T>} sender - The data sender used to send data back to the calling component.
   * @param {BeeSoftDataRequestOptions} options - The options defined by the calling component.
   */
  getData: (sender: DataSender<T>, options?: BeeSoftDataRequestOptions) => void;
  /**
   * Used to get the created data sender to allow for sending data without a new page being requested.
   * @param {DataSender<T>} sender - The created data sender.
   */
  getDataSender?: (sender: DataSender<T>) => void;
}

/**
 * Defines interfaces for updating data in a backend.
 */
export interface BeeSoftDataUpdate<T> {
  /**
   * Called when a component needs to save new data to the backend.
   * @param {DataSender<T>} sender - The response to send back to the calling component, this usually will load the saved data into the component.
   * @param {JsonDataItem | JsonData} data - The data to save.
   * @param {BeeSoftDataRequestOptions} options - The options defined by the calling component.
   */
  saveData?: (sender: DataSender<T>, data: JsonDataItem | JsonData, options?: BeeSoftDataRequestOptions) => void;
  /**
   * Called when a component has been told to delete a piece of data.
   * @param {React.Key} id - The id of the data to delete.
   */
  deleteData?: (id: Key) => void;
}

/**
 * The different type of comparisons that can be performed on the data.
 */
export type BeeSoftFilterComparison =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'CONTAINS'
  | 'GREATER_THAN'
  | 'GREATER_THAN_EQUAL_TO'
  | 'LESS_THAN'
  | 'LESS_THAN_EQUAL_TO'
  | 'IN'
  | 'NOT_IN'
  | 'BETWEEN';

/**
 * The filter to apply to the data.
 */
export interface BeeSoftDataFilter {
  fieldKey: Key;
  value: unknown | Array<unknown>;
  comparison: BeeSoftFilterComparison;
}

/**
 * The field to sort on.
 */
export interface BeeSoftDataSort {
  fieldKey: Key;
  direction: 'ASC' | 'DESC';
  order: number;
}

/**
 * The different options that can be sent as part of a data request.
 */
export interface BeeSoftDataRequestOptions {
  /**
   * The current page of data to retrieve.
   */
  page?: number;
  /**
   * The number of items to retrieve per page.
   */
  pageSize?: number;
  /**
   * Passes the set field id as part of the data retrieval request.
   */
  fieldId?: Key;
  /**
   * Passes the set field name as part of the data retrieval request.
   */
  fieldName?: string;
  /**
   * The type of field making the request.
   */
  fieldType?: FormFieldType;
  /**
   * If the type is custom, this will indicate the custom user field that is making the request.
   */
  customFieldType?: string;
  /**
   * The field filters to apply to the request.
   */
  filters?: Array<BeeSoftDataFilter>;
  /**
   * The field sorts to apply to the request.
   */
  sorts?: Array<BeeSoftDataSort>;
  /**
   * If any custom properties are passed in, they will be included in the callback request.
   */
  customProperties?: JsonDataItem;
}
