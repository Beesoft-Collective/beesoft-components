/**
 * Allows a component to have its markup overridden.
 */
export interface MarkupEvents {
  markupCreated?: (element: Element) => void;
}
