import { useDeepMemo, JsonData, JsonItem } from '@beesoft/common';
import React, { ChangeEvent, forwardRef, memo, useState, useCallback, useId } from 'react';
import cx from 'classnames';
import dot from 'dot-object';
import { useShouldAnimate } from '../../../../../common/hooks/use-animation.ts';
import { HeadlessRadioButtonProps } from './headless-radio-button.props.tsx';
import { HeadlessRadioItem } from './headless-radio-item.component.tsx';
import { HeadlessLabel } from '../../../common/label/headless-label.component.tsx';
import { SelectionLabelLocation } from '../../form-generic.interfaces.ts';

const HeadlessRadioButtonComponent = (props: HeadlessRadioButtonProps) => {
  const {
    name,
    label,
    value,
    data,
    textField,
    valueField,
    readOnly = true,
    labelStyles,
    useAnimation,
    labelLocation = SelectionLabelLocation.Left,
    className,
    onChange,
  } = props;
  const [selectedValue, setSelectedValue] = useState(value);
  const staticData = useDeepMemo(() => data, [data]);

  const useAnimationState = useShouldAnimate(useAnimation);

  const baseId = useId();

  const handleChangeEvent = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const radioValue = event.target.value;
      setSelectedValue(radioValue);

      onChange?.({
        name,
        value: radioValue,
        originalEvent: event,
      });
    },
    [name]
  );

  const renderRadioButton = (item: JsonItem, index: number) => {
    const radioId = `${baseId}_radio_${index}`;
    const itemValue = dot.pick(valueField, item);

    return (
      <HeadlessRadioItem
        key={radioId}
        id={radioId}
        name={name}
        label={dot.pick(textField, item)}
        value={itemValue}
        labelLocation={labelLocation}
        labelStyles={labelStyles}
        checked={itemValue == selectedValue}
        onChange={handleChangeEvent}
      />
    );
  };

  const containerStyles = cx('bc-radio-container bsc-flex bsc-flex-col bsc-gap-1', className);
  const radioStyles = cx('bc-radio-item-outer bsc-relative ', {
    'bsc-pl-1': labelLocation === SelectionLabelLocation.Left,
    'bsc-pr-1': labelLocation === SelectionLabelLocation.Right,
    'bsc-radio-item-animate': !readOnly && useAnimationState,
    'bsc-radio-item': !readOnly,
    'bc-read-only bsc-radio-item-read-only': readOnly,
  });

  const renderItems = (finalData: JsonData) => <div className={radioStyles}>{finalData.map(renderRadioButton)}</div>;

  return (
    <div className={containerStyles}>
      {label && <HeadlessLabel label={label} />}
      {staticData && renderItems(staticData)}
    </div>
  );
};

const HeadlessRadioButton = memo(forwardRef(HeadlessRadioButtonComponent));
export { HeadlessRadioButton };
