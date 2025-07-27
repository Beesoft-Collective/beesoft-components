import { JsonData, JsonItem, TypeOrArray, useDeepMemo } from '@beesoft/common';
import cx from 'classnames';
import dot from 'dot-object';
import { memo, ReactNode, useCallback, useEffect, useId, useState } from 'react';
import { FocusRingStyle, useFocusRingStyle } from 'common/hooks/style/use-focus-ring-style.ts';
import { Label } from '../../../common/label/label.component.tsx';
import TemplateOutlet from '../../../common/template-outlet/template-outlet.component.tsx';
import { FormGroupItemOrientation, GroupChangeEvent } from '../../form-generic.interfaces.ts';
import { GroupButtonItemTemplateProps, GroupButtonProps } from './group-button.props.ts';
import {
  Checkbox,
  CheckboxGroup,
  Field,
  RadioGroup,
  RadioItem
} from "@beesoft/headless-ui";

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

  const onGroupChange = (event?: GroupChangeEvent) => {
    if (Array.isArray(event?.value)) {
      setSelectedValues(event?.value as Array<string> ?? []);
    } else {
      setSelectedValue(event?.value as string);
    }

    onChange?.(event);
  };

  const focusStyles = useFocusRingStyle(FocusRingStyle.FocusWithin);

  const defaultTemplate = useCallback(
    (_props: GroupButtonItemTemplateProps, children: TypeOrArray<ReactNode>) => <>{children}</>,
    []
  );

  const template = itemTemplate || defaultTemplate;

  const renderItem = (item: JsonItem, index: number, array: JsonData) => {
    const itemId = `element_${id}_${index}`;
    const itemText = dot.pick(textField, item) as string;
    const itemValue = String(dot.pick(valueField, item));
    const isFirstItem = index === 0;
    const isLastItem = index === array.length - 1;

    const itemStyles = cx(
      'bc-group-button-item bsc:cursor-pointer bsc:border-solid bsc:p-2 bsc:font-medium',
      {
        'bsc:has-data-checked:bg-primary-1 bsc:dark:has-data-checked:bg-mono-light-1 bsc:has-data-checked:text-white bsc:dark:has-data-checked:text-mono-dark-1 bsc:dark:text-mono-light-1 bsc:text-gray-2 bsc:border-gray-3 bsc:dark:border-mono-light-2':
          !readOnly,
        'bc-read-only bsc:has-data-checked:bg-primary-4 bsc:dark:has-data-checked:bg-mono-light-3 bsc:has-data-checked:text-gray-5 bsc:dark:has-data-checked:text-mono-dark-3 bsc:dark:text-mono-light-3 bsc:text-gray-3 bsc:border-gray-4 bsc:dark:border-mono-light-3 bsc:pointer-events-none':
          readOnly,
        'bsc:border-t bsc:border-l bsc:border-b bsc:rounded-l-md bsc:pl-2':
          isFirstItem && orientation === FormGroupItemOrientation.Horizontal,
        'bsc:border-t bsc:border-r bsc:border-l bsc:border-b bsc:rounded-r-md bsc:pr-2':
          isLastItem && orientation === FormGroupItemOrientation.Horizontal,
        'bsc:border-t bsc:border-b': !isFirstItem && !isLastItem && orientation === FormGroupItemOrientation.Horizontal,
        'bsc:border-l': !isFirstItem && orientation === FormGroupItemOrientation.Horizontal,
        'bsc:border-l bsc:border-r bsc:border-t bsc:rounded-t-md':
          isFirstItem && orientation === FormGroupItemOrientation.Vertical,
        'bsc:border bsc:rounded-b-md': isLastItem && orientation === FormGroupItemOrientation.Vertical,
        'bsc:border-t bsc:border-l bsc:border-r':
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
      <TemplateOutlet key={itemId} props={itemTemplateProps} template={template}>
        <Field className={itemStyles}>
          <Checkbox value={itemValue} className="bsc:block bsc:w-full bsc:cursor-pointer">
            {itemText}
          </Checkbox>
        </Field>
      </TemplateOutlet>
    ) : (
      <TemplateOutlet key={itemId} props={itemTemplateProps} template={template}>
        <Field className={itemStyles}>
          <RadioItem value={itemValue} className="bsc:block bsc:w-full bsc:cursor-pointer">
            {itemText}
          </RadioItem>
        </Field>
      </TemplateOutlet>
    );
  };

  const containerStyles = cx('bsc:flex bsc:flex-col bsc:gap-2', className);
  const buttonWrapperStyles = cx('bsc:flex', {
    'bsc:flex-col bsc:w-max': orientation === FormGroupItemOrientation.Vertical,
  });

  const renderData = (finalData: JsonData) => {
    if (isMultiSelect) {
      return (
        <CheckboxGroup
          name={name}
          value={selectedValues}
          readOnly={readOnly}
          onChange={onGroupChange}
          className={buttonWrapperStyles}
        >
          {finalData.map(renderItem)}
        </CheckboxGroup>
      );
    } else {
      return (
        <RadioGroup
          name={name}
          value={selectedValue}
          readOnly={readOnly}
          onChange={onGroupChange}
          className={buttonWrapperStyles}
        >
          {finalData.map(renderItem)}
        </RadioGroup>
      );
    }
  }

  return (
    <Field className={containerStyles}>
      {label && <Label label={label} readOnly={readOnly} />}
      {staticData && renderData(staticData)}
    </Field>
  );
};

const GroupButton = memo(GroupButtonComponent);
export { GroupButton };
