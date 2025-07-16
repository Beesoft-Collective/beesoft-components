import { Field, RadioChangeEvent, RadioGroup, RadioItem } from '@beesoft/headless-ui';
import { FormGroupItemOrientation, SelectionLabelLocation } from "../../form-generic.interfaces.ts";
import { RadioButtonProps } from "./radio-button.props.ts";
import { memo, useId, useState } from "react";
import { JsonItem, useDeepMemo, useEvent } from "@beesoft/common";
import cx from "classnames";
import { Label } from "../../../common/label/label.component.tsx";

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
  const [selectedValue, setSelectedValue] = useState(value);
  const staticData = useDeepMemo(() => data, [data]);

  const baseId = useId();

  const handleChangeEvent = useEvent(
    (event?: RadioChangeEvent) => {
      const radioValue = event?.value as string | number | undefined
      setSelectedValue(radioValue);

      onChange?.(event);
    });

  const containerStyles = cx('bc-radio-container bsc:flex bsc:flex-col bsc:gap-1', className);
  const radioButtonStyles = cx('bc-radio-wrapper bsc:flex bsc:gap-1', {
    'bsc:flex-col': orientation === FormGroupItemOrientation.Vertical,
    'bsc:*:pr-2': orientation === FormGroupItemOrientation.Horizontal,
  });
  const wrapperStyles = cx('bc-radio-item-wrapper bsc:flex bsc:items-center bsc:*:cursor-pointer', {
    'bc-read-only': readOnly,
  });

  const renderItem = (item: JsonItem, index: number) => {
    const text = item[textField] as string;
    const value = item[valueField];

    return (
      <Field key={`radio_${baseId}_item${index}`} className={wrapperStyles}>
        {labelLocation === SelectionLabelLocation.Left && <Label label={text} readOnly={readOnly} />}
        <RadioItem value={value}></RadioItem>
        {labelLocation === SelectionLabelLocation.Right && <Label label={text} readOnly={readOnly} />}
      </Field>
    );
  };

  return (
    <div className={containerStyles}>
      {label && <Label label={label} readOnly={readOnly} />}
      <RadioGroup
        name={name}
        value={selectedValue}
        comparator={valueField}
        onChange={handleChangeEvent}
        className={radioButtonStyles}
      >
        {staticData && staticData.map(renderItem)}
      </RadioGroup>
    </div>
  );
};

const RadioButton = memo(RadioButtonComponent);
export { RadioButton };
