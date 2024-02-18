import cx from 'classnames';
import { ChangeEvent, useEffect, useId, useState } from 'react';
import { Label } from '../../../common/label/label.component.tsx';
import { ToggleProps } from './toggle.props.ts';

const Toggle = ({ name, label, value, checked = false, readOnly = false, className, onChange }: ToggleProps) => {
  const [checkedState, setCheckedState] = useState<boolean>();

  const id = useId();

  useEffect(() => {
    setCheckedState(checked);
  }, [checked]);

  const handleChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    setCheckedState(checked);
    onChange?.({
      originalEvent: event,
      name: name || event.target.name,
      value: value || event.target.value,
      checked,
    });
  };

  const wrapperStyles = cx('bc-toggle-wrapper bsc-flex bsc-flex-col', className);

  const switchContainerStyles = cx('bsc-flex bsc-relative bsc-bg-gray-3 bsc-w-[70px] bsc-h-[30px] bsc-rounded-full');

  const switchStyles = cx(
    'bsc-absolute bsc-bg-white bsc-rounded-full bsc-w-[22px] bsc-h-[22px] bsc-top-[4px] bsc-left-[4px]'
  );

  return (
    <div className={wrapperStyles}>
      {label && <Label label={label} htmlFor={id} readOnly={readOnly} />}
      <label className={switchContainerStyles}>
        <div className={switchStyles} />
        <input
          id={id}
          name={name}
          value={value}
          type="checkbox"
          checked={checkedState}
          onChange={handleChangeEvent}
          className="bsc-appearance-none"
        />
      </label>
    </div>
  );
};

export { Toggle };
