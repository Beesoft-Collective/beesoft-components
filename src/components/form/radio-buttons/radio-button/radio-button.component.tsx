import { JsonData, JsonItem, useDeepMemo } from '@beesoft/common';
import { ChangeEvent, useId, useState } from 'react';
import { Label } from '../../../common/label/label.component.tsx';
import { FormGroupItemOrientation, SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { RadioButtonProps } from './radio-button.props.ts';
import { RadioItem } from './radio-item.component.tsx';

const RadioButton = ({
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

  const handleChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const radioValue = event.target.value;
    setSelectedValue(radioValue);

    onChange?.({
      name,
      value: radioValue,
      originalEvent: event,
    });
  };

  const renderRadioButton = (item: JsonItem, index: number) => {
    const radioId = `${baseId}_radio_${index}`;
    const itemValue = dot.pick(valueField, item);

    return (
      <RadioItem
        id={radioId}
        name={name}
        label={dot.pick(textField, item)}
        value={itemValue}
        checked={itemValue == value}
        labelLocation={labelLocation}
        readOnly={readOnly}
        useAnimation={useAnimation}
        onChange={handleChangeEvent}
      />
    );
  };

  const renderItems = (finalData: JsonData) => <div>{finalData.map(renderRadioButton)}</div>

  return (
    <div>
      {label && <Label label={label} readOnly={readOnly} />}
      {staticData && renderItems(staticData)}
    </div>
  )
};

export { RadioButton };
