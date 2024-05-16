import { useDeepMemo, usePropertyChanged, useStateRefInitial } from '@beesoft/common';
import React, { ChangeEvent, forwardRef, Ref, useEffect, useId, useImperativeHandle } from 'react';
import { forceAssert } from '../../../../../components/common-functions.ts';
import { HeadlessBase } from '../../../../architecture/components/headless-base.component.tsx';
import { useHeadlessGroupContext } from '../../../../architecture/hooks/use-headless-group-context.ts';
import { HeadlessCheckboxCheckState, HeadlessCheckboxProps, HeadlessCheckboxRef } from './headless-checkbox.props.ts';

const HeadlessCheckboxComponent = (props: HeadlessCheckboxProps, ref: Ref<HeadlessCheckboxRef>) => {
  const { name, value, checked = false, partial = false, onChange, children, labelStyles, className } = props;

  const groupContext = useHeadlessGroupContext();
  const internalId = useId();

  const [checkedState, setCheckedState, checkedStateRef] = useStateRefInitial<HeadlessCheckboxCheckState>({
    checked: false,
    partial: false,
  });

  const checkedProperty = usePropertyChanged(checked);
  const partialProperty = usePropertyChanged(partial);

  const finalProps = useDeepMemo<HeadlessCheckboxProps>(() => {
    return {
      id: groupContext?.sharedId || props.id || internalId,
      ...props,
    };
  }, [props, groupContext?.sharedId]);

  useEffect(() => {
    if (checkedState.initial) {
      setCheckedState({
        checked: partial ? true : checked,
        partial,
      });
    } else {
      const newChecked = !checkedProperty.changed ? checkedState.value.checked : checked;
      const newPartial = !partialProperty.changed ? checkedState.value.partial : partial;

      setCheckedState({
        checked: newPartial ? true : newChecked,
        partial: newPartial,
      });
    }
  }, [checked, partial]);

  const handleChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    const checkedValue = checkedStateRef.current?.value.partial === true ? true : event.target.checked;
    setCheckedState({
      checked: checkedValue,
      partial: false,
    });

    onChange?.({
      originalEvent: event,
      name: name || event.target.name,
      value,
      checked: checkedValue,
    });
  };

  const setPartiallyChecked = (partiallyChecked: boolean) => {
    const state: HeadlessCheckboxCheckState = {
      checked: partiallyChecked ? true : checkedStateRef.current?.value.checked || false,
      partial: partiallyChecked,
    };

    setCheckedState(state);
  };

  const setChecked = (checked: boolean) => {
    setCheckedState({
      checked,
      partial: false,
    });
  };

  useImperativeHandle(ref, () => ({
    setPartiallyChecked,
    setChecked,
  }));

  return (
    <label
      className={labelStyles}
      onChange={(event) => handleChangeEvent(forceAssert<ChangeEvent<HTMLInputElement>>(event))}
    >
      <HeadlessBase
        id={internalId}
        name={name}
        type="checkbox"
        props={finalProps}
        renderProps={checkedState.value}
        className={className}
      >
        {children}
      </HeadlessBase>
    </label>
  );
};

const HeadlessCheckbox = forwardRef(HeadlessCheckboxComponent);
export { HeadlessCheckbox };
