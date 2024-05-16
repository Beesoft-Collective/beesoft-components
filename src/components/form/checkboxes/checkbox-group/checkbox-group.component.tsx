import { JsonData, JsonItem, useDeepMemo } from '@beesoft/common';
import cx from 'classnames';
import { memo, useEffect, useState } from 'react';
import { Label } from '../../../common/label/label.component.tsx';
import { FormGroupItemOrientation } from '../../form-generic.interfaces.ts';
import { Checkbox } from '../checkbox/checkbox.component.tsx';
import { HeadlessCheckboxChangeEvent } from '../../../../headless/components/form/checkboxes/headless-checkboxes.interfaces.ts';
import { CheckboxGroupProps } from './checkbox-group.props.ts';

const CheckboxGroupComponent = ({
  name,
  label,
  value,
  data,
  textField,
  valueField,
  readOnly = false,
  orientation = FormGroupItemOrientation.Vertical,
  className,
  onChange,
}: CheckboxGroupProps) => {
  const [selectedValues, setSelectedValues] = useState<Array<unknown>>([]);
  const staticData = useDeepMemo(() => data, [data]);

  useEffect(() => {
    setSelectedValues(value ?? []);
  }, [value]);

  const handleOnChange = (event: HeadlessCheckboxChangeEvent) => {
    const { value, checked } = event;

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

  const renderCheckbox = (item: JsonItem, index: number) => (
    <Checkbox
      key={`${name}_checkbox_${index}`}
      name={name}
      label={item[textField] as string}
      value={item[valueField] as string}
      checked={selectedValues.some((value) => value === item[valueField])}
      readOnly={readOnly}
      onChange={(value) => value && handleOnChange(value)}
      className="bsc-mr-3"
    />
  );

  const containerStyles = cx('bsc-flex bsc-flex-col bsc-gap-1', className);
  const checkboxStyles = cx('bsc-flex bsc-gap-1', {
    'bsc-flex-col': orientation === FormGroupItemOrientation.Vertical,
  });

  const renderItems = (finalData: JsonData) => <div className={checkboxStyles}>{finalData.map(renderCheckbox)}</div>;

  return (
    <div className={containerStyles}>
      {label && <Label label={label} readOnly={readOnly} />}
      {staticData && renderItems(staticData)}
    </div>
  );
};

const CheckboxGroup = memo(CheckboxGroupComponent);
export { CheckboxGroup };
