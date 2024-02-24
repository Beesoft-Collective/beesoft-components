import cx from 'classnames';
import { ChangeEvent, useEffect, useId, useState } from 'react';
import { FocusRingStyle, useFocusRingStyle } from '../../../../common/hooks/style/use-focus-ring-style.ts';
import { useShouldAnimate } from '../../../../common/hooks/use-animation.ts';
import { Label } from '../../../common/label/label.component.tsx';
import { ToggleProps } from './toggle.props.ts';

const Toggle = ({
  name,
  label,
  value,
  checked = false,
  readOnly = false,
  useAnimation,
  className,
  onChange,
}: ToggleProps) => {
  const [checkedState, setCheckedState] = useState(false);

  const id = useId();
  const useAnimationState = useShouldAnimate(useAnimation);

  useEffect(() => {
    setCheckedState(checked);
  }, [checked]);

  const handleChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    setCheckedState(checked);
    onChange?.({
      originalEvent: event,
      name: name || event.target.name,
      value: value || event.target.value,
      checked,
    });
  };

  const wrapperStyles = cx('bc-toggle-wrapper bsc-flex bsc-flex-col', className);

  const focusRingStyles = useFocusRingStyle(FocusRingStyle.FocusWithin);
  const switchContainerStyles = cx(
    'bc-toggle-container bsc-toggle-switch bsc-flex bsc-mt-0.5 bsc-relative bsc-w-[70px] bsc-h-[30px] bsc-rounded-full [transition:background-color_1s]',
    {
      'bsc-cursor-pointer bsc-bg-gray-3 dark:bsc-bg-mono-dark-3 has-[:checked]:bsc-bg-primary-1 has-[:checked]:dark:bsc-bg-mono-light-2':
        !readOnly,
      'bsc-pointer-events-none bsc-bg-gray-4 dark:bsc-bg-mono-dark-2 has-[:checked]:bsc-bg-primary-4 has-[:checked]:dark:bsc-bg-mono-light-3':
        readOnly,
    },
    focusRingStyles
  );

  const switchStyles = cx(
    'bc-toggle-switch bsc-absolute bsc-rounded-full dark:bsc-border dark:bsc-border-solid dark:bsc-border-mono-dark-1 bsc-w-[22px] bsc-h-[22px] bsc-top-[4px] bsc-left-[4px]',
    {
      'bsc-bg-white bsc-cursor-pointer': !readOnly,
      'bsc-bg-gray-5 bsc-pointer-events-none': readOnly,
      '[transition:0.3s]': !readOnly && useAnimationState,
    }
  );

  return (
    <div className={wrapperStyles}>
      {label && <Label label={label} htmlFor={id} readOnly={readOnly} />}
      <label className={switchContainerStyles}>
        <input
          id={id}
          name={name}
          value={value}
          type="checkbox"
          checked={checkedState}
          onChange={handleChangeEvent}
          className="bsc-appearance-none"
        />
        <div id="switch" className={switchStyles} />
      </label>
    </div>
  );
};

export { Toggle };
