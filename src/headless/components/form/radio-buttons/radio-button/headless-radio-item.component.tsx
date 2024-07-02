import { ChangeEvent, memo, useCallback } from 'react';
import { forceAssert } from '../../../../../components/common-functions.ts';
import { HeadlessBase } from '../../../../architecture/components/headless-base.component.tsx';
import { HeadlessRadioItemProps } from './headless-radio-item-props.tsx';
import { HeadlessLabel } from '../../../common/label/headless-label.component.tsx';
import { SelectionLabelLocation } from '../../form-generic.interfaces.ts';

const HeadlessRadioItemComponent = (props: HeadlessRadioItemProps) => {
  const { id, name, labelStyles, value, label, labelLocation = SelectionLabelLocation.Right, onChange } = props;

  const finalProps: HeadlessRadioItemProps = {
    ...props,
    value,
  };

  const handleChangeEvent = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    },
    [onChange]
  );

  return (
    <label
      className={labelStyles}
      onChange={(event) => handleChangeEvent(forceAssert<ChangeEvent<HTMLInputElement>>(event))}
    >
      <HeadlessBase id={id} name={name} type="radio" props={finalProps} renderProps={value}></HeadlessBase>
      {label && labelLocation === SelectionLabelLocation.Right && (
        <HeadlessLabel label={label} className={labelStyles} />
      )}
    </label>
  );
};

const HeadlessRadioItem = memo(HeadlessRadioItemComponent);
export { HeadlessRadioItem };
