import { JsonData, JsonItem, useDeepMemo } from '@beesoft/common';
import cx from 'classnames';
import { ChangeEvent, useEffect, useId, useState } from 'react';
import { FormGroupItemOrientation } from '../../form-generic.interfaces.ts';
import { GroupButtonProps } from './group-button.props.ts';

const GroupButton = ({
  name,
  label,
  value,
  data,
  textField,
  valueField,
  readOnly = false,
  orientation = FormGroupItemOrientation.Horizontal,
  isMultiSelect = false,
  className,
  onChange,
}: GroupButtonProps) => {
  const [selectedValues, setSelectedValues] = useState<Array<unknown>>([]);
  const staticData = useDeepMemo(() => data, [data]);

  const id = useId();

  useEffect(() => {
    if (isMultiSelect) {
      setSelectedValues((value ?? []) as Array<unknown>);
    }
  }, [value]);

  const onMultiChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    let updatedValues: Array<unknown>;
    if (checked) {
      updatedValues = [...selectedValues, value];
    } else {
      updatedValues = selectedValues.filter((item) => item !== value);
    }

    setSelectedValues(updatedValues);
    onChange?.({
      name,
      value: updatedValues,
    });
  };

  const renderCheckbox = (item: JsonItem, index: number) => {
    const itemId = `checkbox_${id}_${index}`;
    const itemText = item[textField] as string;
    const itemValue = item[valueField] as string | number;

    const checkboxStyles = cx({
      'bsc-rounded-l-lg': index === 0 && orientation === FormGroupItemOrientation.Horizontal,
    });

    return (
      <label htmlFor={itemId} className={checkboxStyles}>
        <input
          id={itemId}
          name={name}
          value={itemValue}
          type="checkbox"
          onChange={onMultiChange}
          className="bsc-appearance-none"
        />
        {itemText}
      </label>
    );
  };

  const renderItems = (finalData: JsonData) => {};
};
