import { JsonData, JsonItem, useDeepMemo } from '@beesoft/common';
import cx from 'classnames';
import { ChangeEvent, useEffect, useId, useState } from 'react';
import { Label } from '../../../common/label/label.component.tsx';
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

  const renderCheckbox = (
    itemId: string,
    itemText: string,
    itemValue: string | number,
    isFirstItem: boolean,
    isLastItem: boolean
  ) => {
    const checkboxStyles = cx(
      'has-[:checked]:bsc-bg-primary-1 has-[:checked]:bsc-text-white bsc-cursor-pointer bsc-border-solid bsc-border-gray-3 bsc-p-2',
      {
        'bsc-border-t bsc-border-l bsc-border-b bsc-rounded-l-md bsc-pl-2':
          isFirstItem && orientation === FormGroupItemOrientation.Horizontal,
        'bsc-border-t bsc-border-r bsc-border-l bsc-border-b bsc-rounded-r-md bsc-pr-2':
          isLastItem && orientation === FormGroupItemOrientation.Horizontal,
        'bsc-border-t bsc-border-b': !isFirstItem && !isLastItem && orientation === FormGroupItemOrientation.Horizontal,
        'bsc-border-l': !isFirstItem && orientation === FormGroupItemOrientation.Horizontal,
        'bsc-border-l bsc-border-r bsc-border-t bsc-rounded-t-md':
          isFirstItem && orientation === FormGroupItemOrientation.Vertical,
        'bsc-border bsc-rounded-b-md': isLastItem && orientation === FormGroupItemOrientation.Vertical,
        'bsc-border-t bsc-border-l bsc-border-r':
          !isFirstItem && !isLastItem && orientation === FormGroupItemOrientation.Vertical,
      }
    );

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

  const renderRadioButton = (
    itemId: string,
    itemText: string,
    itemValue: string | number,
    isFirstItem: boolean,
    isLastItem: boolean
  ) => {
    const radioButtonStyles = cx({
      'bsc-rounded-l-lg': isFirstItem && orientation === FormGroupItemOrientation.Horizontal,
      'bsc-rounded-t-lg': isFirstItem && orientation === FormGroupItemOrientation.Vertical,
      'bsc-rounded-r-lg': isLastItem && orientation === FormGroupItemOrientation.Horizontal,
      'bsc-rounded-b-lg': isLastItem && orientation === FormGroupItemOrientation.Vertical,
    });

    return (
      <label htmlFor={itemId} className={radioButtonStyles}>
        <input id={itemId} name={name} value={itemValue} type="radio" className="bsc-appearance-none" />
        {itemText}
      </label>
    );
  };

  const renderItems = (item: JsonItem, index: number, array: JsonData) => {
    const itemId = `checkbox_${id}_${index}`;
    const itemText = item[textField] as string;
    const itemValue = item[valueField] as string | number;
    const isFirstItem = index === 0;
    const isLastItem = index === array.length - 1;

    return isMultiSelect
      ? renderCheckbox(itemId, itemText, itemValue, isFirstItem, isLastItem)
      : renderRadioButton(itemId, itemText, itemValue, isFirstItem, isLastItem);
  };

  const containerStyles = cx('bsc-flex bsc-flex-col bsc-gap-2', className);
  const buttonWrapperStyles = cx('bsc-flex', {
    'bsc-flex-col': orientation === FormGroupItemOrientation.Vertical,
  });

  const renderData = (finalData: JsonData) => <div className={buttonWrapperStyles}>{finalData.map(renderItems)}</div>;

  return (
    <div className={containerStyles}>
      {label && <Label label={label} readOnly={readOnly} />}
      {staticData && renderData(staticData)}
    </div>
  );
};

export { GroupButton };
