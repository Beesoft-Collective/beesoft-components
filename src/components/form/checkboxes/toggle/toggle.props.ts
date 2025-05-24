import { ComponentAnimationProps, FormInputControl, HeadlessCheckboxChangeEvent } from '@beesoft/headless-ui';

export interface ToggleProps
  extends FormInputControl<string | number, HeadlessCheckboxChangeEvent>,
    ComponentAnimationProps {
  checked?: boolean;
}
