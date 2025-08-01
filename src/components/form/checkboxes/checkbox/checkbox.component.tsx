import { Checkbox as HeadlessCheckbox, Field } from '@beesoft/headless-ui';
import cx from 'classnames';
import { forwardRef, memo, Ref } from 'react';
import { FocusRingStyle, useFocusRingStyle } from 'common/hooks/style/use-focus-ring-style.ts';
import { useShouldAnimate } from 'common/hooks/use-animation.ts';
import { Label } from '../../../common/label/label.component.tsx';
import { SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { CheckboxProps, CheckboxRef } from './checkbox.props.ts';

const CheckboxComponent = (props: CheckboxProps, ref: Ref<CheckboxRef>) => {
  const {
    name,
    label,
    value,
    readOnly = false,
    checked = false,
    partial = false,
    labelLocation = SelectionLabelLocation.Right,
    className,
    useAnimation,
    onChange,
  } = props;

  const useAnimationState = useShouldAnimate(useAnimation);

  const wrapperStyles = cx(
    'bc-checkbox-wrapper bsc:flex bsc:items-center bsc:group/wrapper bsc:*:cursor-pointer bsc:has-data-read-only:text-gray-4 bsc:dark:has-data-read-only:text-mono-light-3 bsc:has-data-read-only:pointer-events-none',
    className
  );

  const labelStyles = cx('bc-checkbox-label bsc:peer-data-read-only:text-gray-4 bsc:dark:peer-data-read-only:text-mono-light-3', {
    'bsc:ml-2': labelLocation === SelectionLabelLocation.Right,
    'bsc:mr-2': labelLocation === SelectionLabelLocation.Left,
  });

  const focusStyles = useFocusRingStyle(FocusRingStyle.FocusWithin);
  const checkboxStyles = cx(
    'bc-checkbox-outer bsc:group/checkbox bsc:peer bsc:rounded bsc:*:block bsc:*:size-[21px]',
    'bsc:inset-shadow-[0_0_0_1px] bsc:inset-shadow-gray-2 bsc:dark:inset-shadow-[0_0_0_1px] bsc:dark:inset-shadow-mono-light-2',
    'bsc:group-hover/wrapper:not-data-checked:inset-shadow-[0_0_0_2px] bsc:group-hover/wrapper:not-data-checked:inset-shadow-gray-4',
    'bsc:dark:group-hover/wrapper:not-data-checked:inset-shadow-[0_0_0_2px] bsc:[transition:box-shadow_0.3s]',
    focusStyles
  );

  const svgStyles = cx(
    'bc-checkbox-svg bsc:rounded bsc:stroke-mono-light-1 bsc:stroke-2 bsc:[stroke-linecap:round]',
    'bsc:[stroke-linejoin:round] bsc:dark:stroke-mono-dark-3 bsc:[transform:scale(0)]',
    'bsc:group-data-checked/checkbox:group-data-read-only/checkbox:bg-primary-4 bsc:group-data-checked/checkbox:group-data-read-only/checkbox:fill-primary-4 bsc:group-data-partial/checkbox:group-data-read-only/checkbox:bg-primary-4 bsc:group-data-partial/checkbox:group-data-read-only/checkbox:fill-primary-4 bsc:dark:group-data-checked/checkbox:group-data-read-only/checkbox:bg-mono-light-3 bsc:dark:group-data-checked/checkbox:group-data-read-only/checkbox:fill-mono-light-3 bsc:dark:group-data-partial/checkbox:group-data-read-only/checkbox:bg-mono-light-3 bsc:dark:group-data-partial/checkbox:group-data-read-only/checkbox:fill-mono-light-3',
    'bsc:group-data-checked/checkbox:group-not-data-read-only/checkbox:bg-primary-1 bsc:group-data-checked/checkbox:group-not-data-read-only/checkbox:fill-primary-1 bsc:group-data-partial/checkbox:bg-primary-1 bsc:group-data-partial/checkbox:fill-primary-1 bsc:dark:group-data-checked/checkbox:bg-mono-light-1 bsc:dark:group-data-checked/checkbox:fill-mono-light-1 bsc:dark:group-data-partial/checkbox:bg-mono-light-1 bsc:dark:group-data-partial/checkbox:fill-mono-light-1',
    {
      'bsc:group-data-checked/checkbox:group-not-data-read-only/checkbox:animate-bounce bsc:group-data-partial/checkbox:group-not-data-read-only/checkbox:animate-bounce bsc:group-data-checked/checkbox:group-data-read-only/checkbox:[transform:scale(1)] bsc:group-data-partial/checkbox:group-data-read-only/checkbox:[transform:scale(1)]': useAnimationState,
      'bsc:group-data-checked/checkbox:[transform:scale(1)] bsc:group-data-partial/checkbox:[transform:scale(1)]': !useAnimationState,
    }
  );

  return (
    <Field className={wrapperStyles}>
      {label && labelLocation === SelectionLabelLocation.Left && (
        <Label label={label} readOnly={readOnly} className={labelStyles} />
      )}
      <HeadlessCheckbox
        ref={ref}
        name={name}
        value={value}
        checked={checked}
        partial={partial}
        readOnly={readOnly}
        className={checkboxStyles}
        onChange={onChange}
      >
        <svg
          viewBox="0 0 21 21"
          className={svgStyles}
        >
          <polyline
            className="bsc:[visibility:hidden] bsc:group-data-checked/checkbox:visible"
            points="5 10.75 8.5 14.25 16 6"
          />
          <polyline
            className="bsc:[visibility:hidden] bsc:group-data-partial/checkbox:visible"
            points="6 10.5 16 10.5"
          />
        </svg>
      </HeadlessCheckbox>
      {label && labelLocation === SelectionLabelLocation.Right && (
        <Label label={label} readOnly={readOnly} className={labelStyles} />
      )}
    </Field>
  );
};

const Checkbox = memo(forwardRef(CheckboxComponent));
export { Checkbox };
