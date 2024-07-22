import cx from 'classnames';
import { FocusRingStyle, useFocusRingStyle } from '../../../../common/hooks/style/use-focus-ring-style.ts';
import { useShouldAnimate } from '../../../../common/hooks/use-animation.ts';
import { memo } from 'react';
import { FormGroupItemOrientation, SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { RadioButtonProps } from './radio-button.props.ts';
import { HeadlessGroup } from '../../../../headless/components/common/group/headless-group.component.tsx';
import { HeadlessRadioButton } from '../../../../headless/components/form/radio-buttons/radio-button/headless-radio-button.component.tsx';
import { HeadlessLabel } from '../../../../headless/components/common/label/headless-label.component.tsx';

const RadioButtonComponent = ({
  name,
  label,
  value,
  data,
  textField,
  valueField,
  readOnly = false,
  labelLocation = SelectionLabelLocation.Right,
  orientation = FormGroupItemOrientation.Horizontal,
  className,
  useAnimation,
  onChange,
}: RadioButtonProps) => {
  const useAnimationState = useShouldAnimate(useAnimation);

  const wrapperStyles = cx(
    'bc-radio-item-wrapper bsc-flex bsc-flex-col bsc-items-left *:bsc-cursor-pointer',
    {
      'bc-read-only': readOnly,
    },
    className
  );

  const labelStyles = cx('bc-radio-label bsc-cursor-pointer', {
    'bsc-ml-2': labelLocation === SelectionLabelLocation.Right,
    'bsc-mr-2': labelLocation === SelectionLabelLocation.Left,
  });

  const focusStyles = useFocusRingStyle(FocusRingStyle.FocusWithin);

  const radioButtonStyles = cx(
    'bc-radio-wrapper bsc-flex bsc-gap-1',
    {
      'bsc-flex-col': orientation === FormGroupItemOrientation.Vertical,
      '[&>*]:bsc-pr-2': orientation === FormGroupItemOrientation.Horizontal,
    },
    focusStyles
  );

  const innerCheckboxStyles = cx(
    'bc-radio-inner bsc-relative bsc-m-0 bsc-cursor-pointer bsc-appearance-none bsc-rounded bsc-border-none bsc-bg-mono-light-1 bsc-p-0 bsc-outline-none dark:bsc-bg-mono-dark-1 dark:checked:bsc-bg-mono-light-1',
    {
      '[transition:box-shadow_0.3s]': useAnimationState,
      'bsc-radio': !readOnly,
      'bc-read-only bsc-radio-read-only': readOnly,
    }
  );

  return (
    <HeadlessGroup>
      <div className={wrapperStyles}>
        {label && <HeadlessLabel label={label} className={labelStyles} />}
        <HeadlessRadioButton
          name={name}
          value={value}
          textField={textField}
          valueField={valueField}
          data={data}
          readOnly={readOnly}
          className={innerCheckboxStyles}
          labelLocation={labelLocation}
          labelStyles={radioButtonStyles}
          onChange={onChange}
        ></HeadlessRadioButton>
      </div>
    </HeadlessGroup>
  );
};

const RadioButton = memo(RadioButtonComponent);
export { RadioButton };
