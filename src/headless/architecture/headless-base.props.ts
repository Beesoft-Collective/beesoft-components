import { Signal } from '@preact/signals';
import React from 'react';

export interface HeadlessBaseProps<T> {
  props: T;
  signalName?: string;
  onSignalRetrieved?: (signal: Signal) => void;
  children?: (props: T) => React.JSX.Element;
}
