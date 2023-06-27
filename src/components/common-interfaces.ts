/**
 * Allows a component to have its markup overridden.
 */
export interface MarkupEvents {
  markupCreated?: (element: Element) => void;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface IToString {
  toString(): string;
}

export interface IDisposable {
  dispose: () => void;
}

export type Required<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};
