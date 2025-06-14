import { ComponentAnimationProps, CheckboxChangeEvent } from '@beesoft/headless-ui';
import type { FormInputControl } from '@beesoft/common';

export interface ToggleProps
  extends FormInputControl<string | number, CheckboxChangeEvent>,
    ComponentAnimationProps {
  checked?: boolean;
}
