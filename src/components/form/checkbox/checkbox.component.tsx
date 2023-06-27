import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useState } from 'react';
import { Required } from '../../common-interfaces';
import { FormInputControl } from '../form-control.interface';

export interface CheckboxChangeEvent {
  name: string;
  value: unknown;
  checked: boolean;
}

export interface CheckboxProps
  extends Required<FormInputControl<string, CheckboxChangeEvent>, 'name' | 'label' | 'value'> {
  defaultChecked?: boolean;
}

const Checkbox = ({
  name,
  label,
  value,
  defaultChecked = false,
  readOnly = false,
  onChange,
  className,
}: CheckboxProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      name: name ?? event.target.name,
      value: event.target.value,
      checked: event.target.checked ?? false,
    });

    setChecked(event.target.checked ?? false);
  };

  return (
    <div>
      <div className="bsc-hidden">
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          readOnly={readOnly}
          onChange={handleOnChange}
        />
      </div>
      <label htmlFor={name} className={className}>
        {checked ? <FontAwesomeIcon icon={['far', 'square-check']} /> : <FontAwesomeIcon icon={['far', 'square']} />}
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
