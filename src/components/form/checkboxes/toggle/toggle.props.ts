import { ComponentAnimationProps } from '../../../../headless/components/component-interfaces.ts';
import { FormInputControl } from '../../../../headless/components/form/form-control.interface.ts';
import { HeadlessCheckboxChangeEvent } from '../../../../headless/components/form/checkboxes/headless-checkboxes.interfaces.ts';

export interface ToggleProps extends FormInputControl<string | number, HeadlessCheckboxChangeEvent>, ComponentAnimationProps {
  checked?: boolean;
}
