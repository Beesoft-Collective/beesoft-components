import { JsonData, JsonItem, TypeOrArray, useDeepMemo } from '@beesoft/common';
import cx from 'classnames';
import dot from 'dot-object';
import { ChangeEvent, ReactNode, useCallback, useEffect, useId, useState } from 'react';
import { Label } from '../../../common/label/label.component.tsx';
import TemplateOutlet from '../../../common/template-outlet/template-outlet.component.tsx';
import { FormGroupItemOrientation } from '../../form-generic.interfaces.ts';
import { GroupButtonItemTemplateProps, GroupButtonProps } from './group-button.props.ts';

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
  itemTemplate,
}: GroupButtonProps) => {
  const [selectedValue, setSelectedValue] = useState<unknown>();
  const [selectedValues, setSelectedValues] = useState<Array<unknown>>([]);
  const staticData = useDeepMemo(() => data, [data]);

  const id = useId();

  useEffect(() => {
    if (isMultiSelect) {
      setSelectedValues((value ?? []) as Array<unknown>);
    } else {
      setSelectedValue(value);
    }
  }, [value]);

  const isChecked = (value: unknown) =>
    isMultiSelect ? selectedValues.findIndex((item) => item == value) > -1 : selectedValue == value;

  const onSingleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSelectedValue(value);
    onChange?.({
      name,
      value,
    });
  };

  const onMultiChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    let updatedValues: Array<unknown>;
    if (checked) {
      updatedValues = [...selectedValues, value];
    } else {
      updatedValues = selectedValues.filter((item) => item != value);
    }

    setSelectedValues(updatedValues);
    onChange?.({
      name,
      value: updatedValues,
    });
  };

  const renderCheckbox = (itemId: string, itemText: string, itemValue: string | number, itemStyles: string) => (
    <label key={itemId} htmlFor={itemId} className={itemStyles}>
      <input
        id={itemId}
        name={name}
        value={itemValue}
        type="checkbox"
        onChange={onMultiChange}
        checked={isChecked(itemValue)}
        className="bsc-appearance-none"
      />
      {itemText}
    </label>
  );

  const renderRadioButton = (itemId: string, itemText: string, itemValue: string | number, itemStyles: string) => (
    <label key={itemId} htmlFor={itemId} className={itemStyles}>
      <input
        id={itemId}
        name={name}
        value={itemValue}
        type="radio"
        onChange={onSingleChange}
        checked={isChecked(itemValue)}
        className="bsc-appearance-none"
      />
      {itemText}
    </label>
  );

  const defaultTemplate = useCallback((_props: GroupButtonItemTemplateProps, children: TypeOrArray<ReactNode>) => <>{children}</>, []);

  const template = itemTemplate || defaultTemplate;

  const renderItems = (item: JsonItem, index: number, array: JsonData) => {
    const itemId = `element_${id}_${index}`;
    const itemText = dot.pick(textField, item) as string;
    const itemValue = dot.pick(valueField, item) as string | number;
    const isFirstItem = index === 0;
    const isLastItem = index === array.length - 1;

    const itemStyles = cx(
      'bsc-cursor-pointer bsc-border-solid bsc-p-2 focus-within:bsc-ring focus-within:bsc-ring-offset-2 dark:bsc-ring-mono-light-1 dark:bsc-ring-offset-mono-dark-1 bsc-font-medium',
      {
        'has-[:checked]:bsc-bg-primary-1 has-[:checked]:dark:bsc-bg-mono-light-1 has-[:checked]:bsc-text-white has-[:checked]:dark:bsc-text-mono-dark-1 dark:bsc-text-mono-light-1 bsc-text-gray-2 bsc-border-gray-3 dark:bsc-border-mono-light-2':
          !readOnly,
        'has-[:checked]:bsc-bg-primary-4 has-[:checked]:dark:bsc-bg-mono-light-3 has-[:checked]:bsc-text-gray-5 has-[:checked]:dark:bsc-text-mono-dark-3 dark:bsc-text-mono-light-3 bsc-text-gray-3 bsc-border-gray-4 dark:bsc-border-mono-light-3 bsc-pointer-events-none':
          readOnly,
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

    const itemTemplateProps: GroupButtonItemTemplateProps = {
      itemId,
      itemText,
      itemValue,
      itemData: item,
      isFirstItem,
      isLastItem,
    };

    return isMultiSelect ? (
      <TemplateOutlet props={itemTemplateProps} template={template}>
        {renderCheckbox(itemId, itemText, itemValue, itemStyles)}
      </TemplateOutlet>
    ) : (
      <TemplateOutlet props={itemTemplateProps} template={template}>
        {renderRadioButton(itemId, itemText, itemValue, itemStyles)}
      </TemplateOutlet>
    );
  };

  const containerStyles = cx('bsc-flex bsc-flex-col bsc-gap-2', className);
  const buttonWrapperStyles = cx('bsc-flex', {
    'bsc-flex-col [width:max-content]': orientation === FormGroupItemOrientation.Vertical,
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
