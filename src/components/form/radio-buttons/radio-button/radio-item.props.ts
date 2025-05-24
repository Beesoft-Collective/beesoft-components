import { ChangeEvent } from 'react';
import { SelectionLabelLocation } from '../../form-generic.interfaces.ts';
import { ComponentAnimationProps } from '@beesoft/headless-ui';

export interface RadioItemProps extends ComponentAnimationProps {
  id: string;
  name: string;
  label: string;
  value: string;
  checked?: boolean;
  labelLocation?: SelectionLabelLocation;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
