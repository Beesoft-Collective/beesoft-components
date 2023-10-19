import React from 'react';

export type FormFieldType = 'CHECKBOX' | 'DATE_TIME' | 'DATE_RANGE' | 'TEXT_FIELD' | 'TEXT_AREA' | 'CUSTOM';

export interface FormInputControl<V = unknown, C = undefined> {
  name?: string;
  label?: string;
  value?: V;
  readOnly?: boolean;
  placeholder?: string;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onInput?: (event: React.FormEvent) => void;
  onChange?: (value?: C extends undefined ? V : C) => void;
  className?: string;
}
