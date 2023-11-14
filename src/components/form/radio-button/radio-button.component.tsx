import { CheckboxChangeEvent, Required } from '../../common-interfaces';
import React, { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { FormInputControl } from '../form-control.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface RadioButtonProps
  extends Required<FormInputControl<string, CheckboxChangeEvent>, 'name' | 'label' | 'value'> {
  defaultChecked?: boolean;
}

const RadioButton = ({
  name,
  label,
  value,
  defaultChecked = false,
  readOnly = false,
  onChange,
  className,
}: RadioButtonProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      name: event.target.name,
      value: event.target.value,
      checked: event.target.checked ?? false,
    });

    setChecked(event.target.checked ?? false);
  }, []);

  const renderRadioButton = useCallback(
    (isChecked: boolean) => {
      const circleStyles = cx({
        'bsc-text-primary-1 dark:bsc-text-mono-light-1': !readOnly,
        'bsc-text-gray-3 dark:bsc-text-mono-light-3': readOnly,
      });

      return isChecked ? (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon className={circleStyles} icon={['far', 'circle']} size="lg" />
          <FontAwesomeIcon className={circleStyles} icon={['fas', 'circle']} size="xs" />
        </span>
      ) : (
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon className={circleStyles} icon={['far', 'circle']} size="lg" />
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
          type="radio"
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
          <div className="bsc-flex-shrink bsc-pr-2">{renderRadioButton(checked)}</div>
          <div className={labelStyles}>{label}</div>
        </div>
      </label>
    </>
  );
};

export default memo(RadioButton);
