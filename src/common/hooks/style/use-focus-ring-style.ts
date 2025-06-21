import cx from 'classnames';
import { useMemo } from 'react';

export enum FocusRingStyle {
  Focus,
  FocusWithin,
}

const useFocusRingStyle = (focusStyle = FocusRingStyle.FocusWithin) => {
  return useMemo(() => {
    return cx('bsc:dark:ring-mono-light-2 bsc:dark:ring-offset-mono-dark-1', {
      'bsc:focus-within:ring-3 bsc:focus-within:ring-primary-2 bsc:focus-within:ring-offset-2 focus-within:bsc-ring-opacity-50':
        focusStyle === FocusRingStyle.FocusWithin,
      'bsc:focus:ring-3 bsc:focus:ring-primary-2 bsc:focus:ring-offset-2 focus:bsc-ring-opacity-50':
        focusStyle === FocusRingStyle.Focus,
    });
  }, [focusStyle]);
};

export { useFocusRingStyle };
