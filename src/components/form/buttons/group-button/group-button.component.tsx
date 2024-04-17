import { JsonData, JsonItem, TypeOrArray, useDeepMemo } from '@beesoft/common';
import cx from 'classnames';
import dot from 'dot-object';
import { ChangeEvent, memo, ReactNode, useCallback, useEffect, useId, useState } from 'react';
import { FocusRingStyle, useFocusRingStyle } from '../../../../common/hooks/style/use-focus-ring-style.ts';
import { Label } from '../../../common/label/label.component.tsx';
import TemplateOutlet from '../../../common/template-outlet/template-outlet.component.tsx';
import { FormGroupItemOrientation } from '../../form-generic.interfaces.ts';
import { GroupButtonItemTemplateProps, GroupButtonProps } from './group-button.props.ts';

const GroupButtonComponent = ({
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
  const [selectedValue, setSelectedValue] = useState<string>();
  const [selectedValues, setSelectedValues] = useState<Array<string>>([]);
  const staticData = useDeepMemo(() => data, [data]);

  const id = useId();

  useEffect(() => {
    if (isMultiSelect) {
      const values = Array.isArray(value) ? value.map((item) => item.toString()) : value ? [String(value)] : undefined;
      setSelectedValues(values ?? []);
    } else {
      if (value) {
        setSelectedValue(value.toString());
      }
    }
  }, [value]);

  const isChecked = (value: string) =>
    isMultiSelect ? selectedValues.findIndex((item) => item === value) > -1 : selectedValue === value;

  const onSelectionChange = (value: string | number) => {
    const convertedValue = value.toString();
    if (isMultiSelect) {
      const checked = isChecked(convertedValue);
      let updatedValues: Array<string>;
      if (!checked) {
        updatedValues = [...selectedValues, convertedValue];
      } else {
        updatedValues = selectedValues.filter((item) => item != convertedValue);
      }

      setSelectedValues(updatedValues);
      onChange?.({
        name,
        value: updatedValues,
      });
    } else {
      if (convertedValue !== selectedValue) {
        setSelectedValue(convertedValue);
        onChange?.({
          name,
          value: convertedValue,
        });
      }
    }
  };

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

    let updatedValues: Array<string>;
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

  const renderCheckbox = (itemId: string, itemText: string, itemValue: string, itemStyles: string) => (
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

  const renderRadioButton = (itemId: string, itemText: string, itemValue: string, itemStyles: string) => (
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

  const focusStyles = useFocusRingStyle(FocusRingStyle.FocusWithin);

  const defaultTemplate = useCallback(
    (_props: GroupButtonItemTemplateProps, children: TypeOrArray<ReactNode>) => <>{children}</>,
    []
  );

  const template = itemTemplate || defaultTemplate;

  const renderItems = (item: JsonItem, index: number, array: JsonData) => {
    const itemId = `element_${id}_${index}`;
    const itemText = dot.pick(textField, item) as string;
    const itemValue = String(dot.pick(valueField, item));
    const isFirstItem = index === 0;
    const isLastItem = index === array.length - 1;

    const itemStyles = cx(
      'bc-group-button-item bsc-cursor-pointer bsc-border-solid bsc-p-2 bsc-font-medium',
      {
        'has-[:checked]:bsc-bg-primary-1 has-[:checked]:dark:bsc-bg-mono-light-1 has-[:checked]:bsc-text-white has-[:checked]:dark:bsc-text-mono-dark-1 dark:bsc-text-mono-light-1 bsc-text-gray-2 bsc-border-gray-3 dark:bsc-border-mono-light-2':
          !readOnly,
        'bc-read-only has-[:checked]:bsc-bg-primary-4 has-[:checked]:dark:bsc-bg-mono-light-3 has-[:checked]:bsc-text-gray-5 has-[:checked]:dark:bsc-text-mono-dark-3 dark:bsc-text-mono-light-3 bsc-text-gray-3 bsc-border-gray-4 dark:bsc-border-mono-light-3 bsc-pointer-events-none':
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
      },
      focusStyles
    );

    const itemTemplateProps: GroupButtonItemTemplateProps = {
      itemId,
      selectedValue: isMultiSelect ? selectedValues : selectedValue,
      itemText,
      itemValue,
      itemData: item,
      itemStyles,
      isSelected: isChecked(itemValue),
      isFirstItem,
      isLastItem,
      onItemChanged: onSelectionChange,
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

const GroupButton = memo(GroupButtonComponent);
export { GroupButton };
