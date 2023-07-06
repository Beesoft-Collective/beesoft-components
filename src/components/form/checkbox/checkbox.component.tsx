import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React, { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import { CheckboxChangeEvent, Required } from '../../common-interfaces';
import { FormInputControl } from '../form-control.interface';

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
      const squareStyles = cx({
        'bsc-text-primary-1 dark:bsc-text-mono-light-1': !readOnly,
        'bsc-text-gray-3 dark:bsc-text-mono-light-3': readOnly,
      });

      return isChecked ? (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon className={squareStyles} size="lg" icon={['fas', 'square']} />
          <FontAwesomeIcon
            className="bsc-text-sm bsc-text-white dark:bsc-text-mono-dark-1"
            size="xs"
            icon={['fas', 'check']}
          />
        </span>
      ) : (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon className={squareStyles} size="lg" icon={['far', 'square']} />
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

  const labelStyles = useMemo(() => {
    return cx('bsc-flex-grow', {
      'dark:bsc-text-mono-light-1': !readOnly,
      'dark:bsc-text-mono-light-3': readOnly,
    });
  }, [readOnly]);

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
          <div className={labelStyles}>{label}</div>
        </div>
      </label>
    </>
  );
};

export default memo(Checkbox);
