import cx from 'classnames';
import { memo } from 'react';
import { FocusRingStyle, useFocusRingStyle } from 'common/hooks/style/use-focus-ring-style.ts';
import { useShouldAnimate } from 'common/hooks/use-animation.ts';
import { Label } from '../../../common/label/label.component.tsx';
import { ToggleProps } from './toggle.props.ts';
import { Field, Toggle as HeadlessToggle } from '@beesoft/headless-ui';

const ToggleComponent = ({
  name,
  label,
  value,
  checked = false,
  onElement,
  offElement,
  readOnly = false,
  useAnimation,
  className,
  onChange,
}: ToggleProps) => {
  const useAnimationState = useShouldAnimate(useAnimation);

  const wrapperStyles = cx('bc-toggle-wrapper bsc:flex bsc:flex-col', className);

  const focusRingStyles = useFocusRingStyle(FocusRingStyle.FocusWithin);
  const switchContainerStyles = cx(
    'bc-toggle-container bsc:group bsc:flex bsc:mt-0.5 bsc:relative bsc:w-[60px] bsc:h-[26px] bsc:rounded-full bsc:[transition:background-color_1s]',
    {
      'bsc:cursor-pointer bsc:bg-gray-3 bsc:dark:bg-mono-dark-3 bsc:has-checked:bg-primary-1 bsc:dark:has-checked:bg-mono-light-2':
        !readOnly,
      'bc-read-only bsc:pointer-events-none bsc:bg-gray-4 bsc:dark:bg-mono-dark-2 bsc:has-checked:bg-primary-4 bsc:dark:has-checked:bg-mono-light-3':
        readOnly,
    },
    focusRingStyles
  );

  const switchStyles = cx(
    'bc-toggle-switch bsc:absolute bsc:rounded-full bsc:dark:border bsc:dark:border-solid bsc:dark:border-mono-dark-1 bsc:group-data-toggled:translate-x-[35px] bsc:w-[18px] bsc:h-[18px] bsc:top-[4px] bsc:left-[4px] bsc:z-10',
    {
      'bsc:bg-white bsc:cursor-pointer': !readOnly,
      'bc-read-only bsc:bg-gray-5 bsc:pointer-events-none': readOnly,
      'bsc:[transition:0.3s]': !readOnly && useAnimationState,
    }
  );

  const onElementStyles =
    'bsc:absolute bsc:left-[4px] bsc:opacity-0 bsc:transition-opacity bsc:duration-800 bsc:group-data-toggled:opacity-100 bsc:top-[50%] bsc:[transform:translateY(-50%)]';

  const offElementStyles =
    'bsc:absolute bsc:right-[4px] bsc:opacity-0 bsc:transition-opacity bsc:duration-800 bsc:group-not-data-toggled:opacity-100 bsc:top-[50%] bsc:[transform:translateY(-50%)]';

  return (
    <Field className={wrapperStyles}>
      {label && <Label label={label} readOnly={readOnly} />}
      <HeadlessToggle name={name} value={value} toggled={checked} onChange={onChange} className={switchContainerStyles}>
        {onElement && <div className={onElementStyles}>{onElement}</div>}
        <div className={switchStyles} />
        {offElement && <div className={offElementStyles}>{offElement}</div>}
      </HeadlessToggle>
    </Field>
  );
};

const Toggle = memo(ToggleComponent);
export { Toggle };
