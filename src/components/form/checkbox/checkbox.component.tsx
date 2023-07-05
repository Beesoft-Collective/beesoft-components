import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React, { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import { Required } from '../../common-interfaces';
import { FormInputControl } from '../form-control.interface';

export interface CheckboxChangeEvent {
  name: string;
  value: string;
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

  const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      name: event.target.name,
      value: event.target.value,
      checked: event.target.checked ?? false,
    });

    setChecked(event.target.checked ?? false);
  }, []);

  const renderCheckBox = useCallback(
    (isChecked: boolean) => {
      const checkedBox = cx({
        'bsc-text-primary-1': !readOnly,
        'bsc-text-gray-3': readOnly,
      });
      const uncheckedBox = cx({
        'bsc-text-primary-1': !readOnly,
        'bsc-text-gray-3': readOnly,
      });

      return isChecked ? (
        <span className="fa-layers fa-fw focus:bsc-ring focus:bsc-ring-primary-5 focus:bsc-ring-offset-2">
          <FontAwesomeIcon className={checkedBox} size="lg" icon={['fas', 'square']} />
          <FontAwesomeIcon className="bsc-text-sm bsc-text-white" size="xs" icon={['fas', 'check']} />
        </span>
      ) : (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon className={uncheckedBox} size="lg" icon={['far', 'square']} />
        </span>
      );
    },
    [readOnly]
  );

  const finalStyles = useMemo(() => {
    return cx(
      {
        'descendant:bsc-cursor-pointer': !readOnly,
        'bsc-text-gray-3 bsc-pointer-events-none descendant:bsc-pointer-events-none': readOnly,
      },
      className
    );
  }, [className, readOnly]);

  return (
    <>
      <div className="bsc-hidden">
        <input
          type="checkbox"
          id={name}
          name={name}
          value={value}
          checked={checked}
          readOnly={readOnly}
          onChange={handleOnChange}
        />
      </div>
      <label className={finalStyles} htmlFor={name}>
        <div className="bsc-flex">
          <div className="bsc-flex-shrink bsc-pr-2">{renderCheckBox(checked)}</div>
          <div className="bsc-flex-grow">{label}</div>
        </div>
      </label>
    </>
  );
};

export default memo(Checkbox);
