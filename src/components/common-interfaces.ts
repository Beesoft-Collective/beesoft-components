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

/**
 * Changes optional properties in an interface to required.
 */
export type Required<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export interface CheckboxChangeEvent {
  name: string;
  value: string;
  checked: boolean;
}
