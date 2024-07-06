import { Signal } from '@preact/signals';

export interface HeadlessProviderProps {
  props: Record<string, Signal<unknown>>;
}
