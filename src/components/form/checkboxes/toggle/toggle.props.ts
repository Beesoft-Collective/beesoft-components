import { ComponentAnimationProps, CheckboxChangeEvent } from '@beesoft/headless-ui';
import type { FormInputControl, MakeRequired } from '@beesoft/common';
import { JSX } from 'react';

export interface ToggleProps
  extends MakeRequired<FormInputControl<string | number, CheckboxChangeEvent>, 'name'>,
    ComponentAnimationProps {
  checked?: boolean;
  onElement?: JSX.Element;
  offElement?: JSX.Element;
}
