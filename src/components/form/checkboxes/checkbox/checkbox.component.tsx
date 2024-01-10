import cx from 'classnames';
import { ChangeEvent, useState } from 'react';
import { CheckboxChangeEvent } from '../checkboxes.interfaces.ts';
import { CheckboxLabelLocation, CheckboxProps } from './checkbox.props.ts';

const Checkbox = ({
  name,
  label,
  value,
  readOnly = false,
  checked = false,
  partial = false,
  labelLocation = CheckboxLabelLocation.Right,
  className,
  onChange,
}: CheckboxProps) => {
  const [checkedState, setCheckedState] = useState(checked);

  const handleChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const checkedValue = event.target.checked;
    setCheckedState(checkedValue);

    const changeEvent: CheckboxChangeEvent = {
      originalEvent: event,
      value,
      checked: !partial ? checkedValue : false,
      partial,
    };

    onChange?.(changeEvent);
  };

  const wrapperStyles = cx(
    'bsc-flex bsc-items-center',
    {
      'bsc-pointer-events-none bsc-text-gray-2': readOnly,
    },
    className
  );

  const labelStyles = 'bsc-ml-1 bsc-cursor-pointer bsc-text-black dark:bsc-text-mono-light-1';

  return (
    <div className={wrapperStyles}>
      {labelLocation === CheckboxLabelLocation.Left && (
        <label htmlFor={name} className={labelStyles}>
          label
        </label>
      )}
      <label className="bsc-relative *:bsc-block *:bsc-size-[21px]">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checkedState}
          onChange={handleChangeEvent}
          className="bsc-relative bsc-m-0 bsc-cursor-pointer bsc-appearance-none bsc-rounded bsc-border-none bsc-bg-mono-light-1 bsc-p-0 bsc-shadow-inner bsc-outline-none bsc-transition-shadow checked:bsc-animate-bounce checked:bsc-bg-primary-1 dark:checked:bsc-bg-mono-dark-1"
        />
        <svg
          viewBox="0 0 21 21"
          className="bsc-absolute bsc-left-0 bsc-top-0 bsc-stroke-mono-light-1 bsc-stroke-2 [stroke-linecap:round] [stroke-linejoin:round] [transform:scale(0)] dark:bsc-stroke-mono-dark-1"
        >
          <polyline points="5 10.75 8.5 14.25 16 6" />
        </svg>
      </label>
      {labelLocation === CheckboxLabelLocation.Right && (
        <label htmlFor={name} className={labelStyles}>
          {label}
        </label>
      )}
    </div>
  );
};

export { Checkbox };
