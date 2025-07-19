import { ComponentAnimationProps, CheckboxChangeEvent } from '@beesoft/headless-ui';
import type { FormInputControl, MakeRequired } from '@beesoft/common';

export interface ToggleProps
  extends MakeRequired<FormInputControl<string | number, CheckboxChangeEvent>, 'name'>,
    ComponentAnimationProps {
  checked?: boolean;
}
