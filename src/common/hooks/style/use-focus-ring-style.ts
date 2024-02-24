import cx from 'classnames';
import { useMemo } from 'react';

export enum FocusRingStyle {
  Focus,
  FocusWithin,
}

const useFocusRingStyle = (focusStyle = FocusRingStyle.FocusWithin) => {
  return useMemo(() => {
    return cx('dark:bsc-ring-mono-light-2 dark:bsc-ring-offset-mono-dark-1', {
      'focus-within:bsc-ring focus-within:bsc-ring-offset-2': focusStyle === FocusRingStyle.FocusWithin,
      'focus:bsc-ring focus:bsc-ring-offset-2': focusStyle === FocusRingStyle.Focus,
    });
  }, [focusStyle]);
};

export { useFocusRingStyle };
