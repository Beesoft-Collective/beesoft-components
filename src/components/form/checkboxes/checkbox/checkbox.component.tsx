import { Checkbox as HeadlessCheckbox, Field } from '@beesoft/headless-ui';
import cx from 'classnames';
import { forwardRef, memo, Ref } from 'react';
import { FocusRingStyle, useFocusRingStyle } from '../../../../common/hooks/style/use-focus-ring-style.ts';
import { useShouldAnimate } from '../../../../common/hooks/use-animation.ts';
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
    'bc-checkbox-wrapper bsc:flex bsc:items-center',
    {
      'bc-read-only bsc:pointer-events-none bsc:text-gray-2 bsc:dark:text-mono-light-3': readOnly,
      'bc-checked': checked,
    },
    className
  );

  const labelStyles = cx('bc-checkbox-label bsc:cursor-pointer', {
    'bsc:ml-2': labelLocation === SelectionLabelLocation.Right,
    'bsc:mr-2': labelLocation === SelectionLabelLocation.Left,
  });

  const focusStyles = useFocusRingStyle(FocusRingStyle.FocusWithin);
  const checkboxStyles = cx(
    'bc-checkbox-outer bsc:group bsc:relative bsc:cursor-pointer bsc:rounded bsc:*:block bsc:*:size-[21px]',
    {
      'bsc-checkbox-animate': !readOnly && useAnimationState,
      'bc-read-only bsc-checkbox-no-animate': readOnly || (!readOnly && !useAnimationState),
    },
    focusStyles
  );

  // const innerCheckboxStyles = cx(
  //   'bc-checkbox-inner bsc:relative bsc:m-0 bsc:cursor-pointer bsc:appearance-none bsc:rounded bsc:border-none bsc:bg-mono-light-1 bsc:p-0 bsc:outline-hidden bsc:dark:bg-mono-dark-1 bsc:dark:checked:bg-mono-light-1',
  //   {
  //     'bsc:[transition:box-shadow_0.3s]': useAnimationState,
  //     'bsc-checkbox': !readOnly,
  //     'bc-read-only bsc-checkbox-read-only': readOnly,
  //   }
  // );

  const svgStyles = cx(
    'bc-checkbox-svg bsc:cursor-pointer bsc:absolute bsc:left-0 bsc:top-0 bsc:stroke-mono-light-1 bsc:stroke-2 bsc:[stroke-linecap:round] bsc:[stroke-linejoin:round] bsc:[transform:scale(0)_translateZ(0)] bsc:dark:stroke-mono-dark-3',
    {
      'bsc:fill-primary-1 bsc:dark:fill-mono-light-1': !readOnly,
      'bc-read-only bsc:fill-primary-4 bsc:dark:fill-mono-light-3': readOnly,
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
        className="bsc:group bsc:relative bsc:cursor-pointer bsc:rounded bsc:*:size-[21px]"
        onChange={onChange}
      >
        <svg viewBox="0 0 21 21" className={svgStyles}>
          <polyline
            className="bsc:[visibility:hidden] bsc:group-data-checked:visible"
            points="5 10.75 8.5 14.25 16 6"
          />
          <polyline
            className="bsc:[visibility:hidden] bsc:group-data-partial:visible"
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
