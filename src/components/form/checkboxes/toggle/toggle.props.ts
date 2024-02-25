import { ComponentAnimationProps } from '../../../component-interfaces.ts';
import { FormInputControl } from '../../form-control.interface.ts';
import { CheckboxChangeEvent } from '../checkboxes.interfaces.ts';

export interface ToggleProps extends FormInputControl<string | number, CheckboxChangeEvent>, ComponentAnimationProps {
  checked?: boolean;
}
