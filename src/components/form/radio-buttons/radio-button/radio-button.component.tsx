import { JsonData, JsonItem, useDeepMemo } from '@beesoft/common';
import cx from 'classnames';
import dot from 'dot-object';
import { ChangeEvent, memo, useCallback, useId, useState } from 'react';
import { Label } from '../../../common/label/label.component.tsx';
import { FormGroupItemOrientation, SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { RadioButtonProps } from './radio-button.props.ts';
import { RadioItem } from './radio-item.component.tsx';

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

  const handleChangeEvent = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const radioValue = event.target.value;
    setSelectedValue(radioValue);

    onChange?.({
      name,
      value: radioValue,
      originalEvent: event,
    });
  }, [name]);

  const renderRadioButton = (item: JsonItem, index: number) => {
    const radioId = `${baseId}_radio_${index}`;
    const itemValue = dot.pick(valueField, item);

    return (
      <RadioItem
        key={radioId}
        id={radioId}
        name={name}
        label={dot.pick(textField, item)}
        value={itemValue}
        checked={itemValue == selectedValue}
        labelLocation={labelLocation}
        readOnly={readOnly}
        useAnimation={useAnimation}
        onChange={handleChangeEvent}
      />
    );
  };

  const containerStyles = cx('bc-radio-container bsc-flex bsc-flex-col bsc-gap-1', className);
  const radioButtonStyles = cx('bc-radio-wrapper bsc-flex bsc-gap-1', {
    'bsc-flex-col': orientation === FormGroupItemOrientation.Vertical,
    '[&>*]:bsc-pr-2': orientation === FormGroupItemOrientation.Horizontal,
  });

  const renderItems = (finalData: JsonData) => (
    <div className={radioButtonStyles}>{finalData.map(renderRadioButton)}</div>
  );

  return (
    <div className={containerStyles}>
      {label && <Label label={label} readOnly={readOnly} />}
      {staticData && renderItems(staticData)}
    </div>
  );
};

const RadioButton = memo(RadioButtonComponent);
export { RadioButton };
