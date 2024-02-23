import { useStateInitial } from '@beesoft/common';
import cx from 'classnames';
import { ChangeEvent, useEffect, useId } from 'react';
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
  // TODO: Tomorrow instead of useStateInitial use the property history hook to determine if the property
  //  has changed
  const [checkedState, setCheckedState] = useStateInitial(false);

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

  const switchContainerStyles = cx(
    'bsc-flex bsc-mt-0.5 bsc-relative bsc-cursor-pointer bsc-bg-gray-3 dark:bsc-bg-mono-dark-3 bsc-w-[70px] bsc-h-[30px] bsc-rounded-full has-[:checked]:bsc-bg-primary-1 has-[:checked]:dark:bsc-bg-mono-light-3 focus-within:bsc-ring focus-within:bsc-ring-offset-2 dark:bsc-ring-mono-light-2 dark:bsc-ring-offset-mono-dark-1 [transition:background-color_1s]',
    {
      'bsc-toggle-switch': useAnimationState && !checkedState.initial,
    }
  );

  const switchStyles = cx(
    'bsc-absolute bsc-bg-white bsc-rounded-full dark:bsc-border dark:bsc-border-solid dark:bsc-border-mono-dark-1 bsc-cursor-pointer bsc-w-[22px] bsc-h-[22px] bsc-top-[4px] bsc-left-[4px] [transition:0.5s]'
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
          checked={checkedState.value}
          onChange={handleChangeEvent}
          className="bsc-appearance-none"
        />
        <div id="switch" className={switchStyles} />
      </label>
    </div>
  );
};

export { Toggle };
