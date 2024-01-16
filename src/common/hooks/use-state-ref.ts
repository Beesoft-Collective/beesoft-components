import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react';

type UseStateRef = {
  <T>(initialState: T): readonly [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>];
  <T = undefined>(): readonly [T | undefined, Dispatch<SetStateAction<T | undefined>>, MutableRefObject<T | undefined>];
};

/**
 * A hook that uses both a state and ref variable and keeps both in sync. This is useful when state variables are
 * causing closure issues in certain functions.
 * @param {T} initialState - The initial value to set the state and ref to.
 * @returns {readonly [T | undefined, <T>(value: ((<T>(prevState: (T | undefined)) => (T | undefined)) | T | undefined)) => void, React.MutableRefObject<T | undefined>]}
 */
const useStateRef: UseStateRef = <T>(initialState?: T) => {
  const [state, setState] = useState(initialState);
  const ref = useRef(initialState);

  if (ref.current !== state) ref.current = state;

  return [state, setState, ref] as const;
};

export { useStateRef };
