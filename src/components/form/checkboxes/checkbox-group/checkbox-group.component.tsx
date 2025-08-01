import { JsonData, JsonItem, useDeepMemo } from '@beesoft/common';
import { CheckboxGroup as HeadlessCheckboxGroup, CheckboxGroupChangeEvent } from "@beesoft/headless-ui";
import cx from 'classnames';
import { memo, useEffect, useState } from 'react';
import { Label } from '../../../common/label/label.component.tsx';
import { FormGroupItemOrientation } from '../../form-generic.interfaces.ts';
import { Checkbox } from '../checkbox/checkbox.component.tsx';
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

  const handleOnChange = (event?: CheckboxGroupChangeEvent) => {
    if (event) {
      const { value } = event;

      setSelectedValues(value ?? []);
      onChange?.({
        name,
        value,
      });
    }
  };

  const renderCheckbox = (item: JsonItem, index: number) => (
    <Checkbox
      key={`${name}_checkbox_${index}`}
      label={item[textField] as string}
      value={item[valueField] as string}
      className="bsc:mr-3"
    />
  );

  const containerStyles = cx('bsc:flex bsc:flex-col bsc:gap-1', className);
  const checkboxStyles = cx('bsc:flex bsc:gap-1', {
    'bsc:flex-col': orientation === FormGroupItemOrientation.Vertical,
  });

  const renderItems = (
    finalData: JsonData
  ) => (
    <HeadlessCheckboxGroup
      name={name}
      value={selectedValues}
      readOnly={readOnly}
      onChange={handleOnChange}
      className={checkboxStyles}
    >
      {finalData.map(renderCheckbox)}
    </HeadlessCheckboxGroup>
  );

  return (
    <div className={containerStyles}>
      {label && <Label label={label} readOnly={readOnly} />}
      {staticData && renderItems(staticData)}
    </div>
  );
};

const CheckboxGroup = memo(CheckboxGroupComponent);
export { CheckboxGroup };
