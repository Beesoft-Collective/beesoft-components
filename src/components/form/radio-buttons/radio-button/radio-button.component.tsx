import { Field, RadioGroup, RadioItem } from '@beesoft/headless-ui';
import { FormGroupItemOrientation, SelectionLabelLocation } from "../../form-generic.interfaces.ts";
import { RadioButtonProps } from "./radio-button.props.ts";
import { memo, useId } from "react";
import { JsonItem, useDeepMemo } from "@beesoft/common";
import cx from "classnames";
import { Label } from "../../../common/label/label.component.tsx";
import { useShouldAnimate } from "common/hooks/use-animation.ts";
import { FocusRingStyle, useFocusRingStyle } from "common/hooks/style/use-focus-ring-style.ts";

const RadioButtonComponent = ({
  name,
  label,
  value,
  data,
  textField,
  valueField,
  readOnly = false,
  labelLocation = SelectionLabelLocation.Right,
  orientation = FormGroupItemOrientation.Vertical,
  className,
  useAnimation,
  onChange,
}: RadioButtonProps) => {
  const staticData = useDeepMemo(() => data, [data]);

  const baseId = useId();
  const useAnimationState = useShouldAnimate(useAnimation);
  const focusRingStyles = useFocusRingStyle(FocusRingStyle.FocusWithin);

  const containerStyles = cx('bc-radio-container bsc:flex bsc:flex-col bsc:gap-1', className);
  const radioButtonStyles = cx('bc-radio-wrapper bsc:flex bsc:gap-1', {
    'bsc:flex-col': orientation === FormGroupItemOrientation.Vertical,
    'bsc:*:pr-2': orientation === FormGroupItemOrientation.Horizontal,
  });

  const wrapperStyles = cx('bc-radio-item-wrapper bsc:flex bsc:items-center bsc:*:cursor-pointer', {
    'bc-read-only': readOnly,
  });
  const radioItemStyles = cx('bc-radio-item bsc:group bsc:relative bsc:*:size-[21px] bsc:rounded-full', {
    'bsc:ml-2': labelLocation === SelectionLabelLocation.Left,
    'bsc:mr-2': labelLocation === SelectionLabelLocation.Right,
    'bc-read-only': readOnly,
  }, focusRingStyles);
  const svgStyles = cx(
    'bc-radio-item-svg bsc:stroke-2 bsc:fill-none bsc:rounded-full bsc:stroke-gray-1 bsc:dark:stroke-mono-light-2 bsc:group-data-read-only:stroke-gray-4 bsc:dark:group-data-read-only:stroke-mono-light-3'
  );
  const circle1Styles = cx('bsc:group-data-checked:fill-primary-1 bsc:dark:group-data-checked:fill-mono-light-2 bsc:group-data-checked:group-data-read-only:fill-primary-4 bsc:dark:group-data-checked:group-data-read-only:fill-mono-light-3', {
    'bsc:group-data-checked:animate-bounce': !readOnly && useAnimationState,
  });
  const circle2Styles = cx(
    'bsc:invisible bsc:group-data-checked:visible bsc:group-data-checked:fill-white bsc:dark:group-data-checked:fill-mono-dark-1', {
      'bsc:group-data-checked:animate-bounce': !readOnly && useAnimationState,
    }
  );

  const renderItem = (item: JsonItem, index: number) => {
    const text = item[textField] as string;
    const value = item[valueField];

    return (
      <Field key={`radio_${baseId}_item${index}`} className={wrapperStyles}>
        {labelLocation === SelectionLabelLocation.Left && <Label label={text} readOnly={readOnly} />}
        <RadioItem value={value} className={radioItemStyles}>
          <svg viewBox="0 0 30 30" preserveAspectRatio="xMidYMid meet" className={svgStyles}>
            <circle cx={15} cy={15} r={15} className={circle1Styles} />
            <circle cx="50%" cy="50%" r={7} className={circle2Styles} />
          </svg>
        </RadioItem>
        {labelLocation === SelectionLabelLocation.Right && <Label label={text} readOnly={readOnly} />}
      </Field>
    );
  };

  return (
    <div className={containerStyles}>
      {label && <Label label={label} readOnly={readOnly} />}
      <RadioGroup
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        className={radioButtonStyles}
      >
        {staticData && staticData.map(renderItem)}
      </RadioGroup>
    </div>
  );
};

const RadioButton = memo(RadioButtonComponent);
export { RadioButton };
