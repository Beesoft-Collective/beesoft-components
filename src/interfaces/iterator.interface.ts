/**
 * Defines a structure used to iterate through a list of items.
 */
export interface IIterator<T> {
  /**
   * Returns the index of the current item in the list.
   */
  currentIndex: number;
  /**
   * Gets the next item in the list of items.
   * @returns {T} The next item in the list.
   */
  next(): T | undefined;

  /**
   * Looks at the next item in the list without moving the location pointer.
   * @returns {T} The next item in the list.
   */
  peek(): T | undefined;

  /**
   * Resets the index of the list to allow it to start from the beginning.
   */
  reset(): void;

  /**
   * Used to determine if there are more items in the list.
   * @returns {boolean} True if more items exist.
   */
  hasNext(): boolean;
}
