import { ComponentAnimationProps } from '../../../../headless/components/component-interfaces.ts';
import { HeadlessCheckboxProps } from '../../../../headless/components/form/checkboxes/checkbox/headless-checkbox.props.ts';
import { SelectionLabelLocation } from '../../form-generic.interfaces.ts';

export interface CheckboxProps extends HeadlessCheckboxProps, ComponentAnimationProps {
  labelLocation?: SelectionLabelLocation;
}
