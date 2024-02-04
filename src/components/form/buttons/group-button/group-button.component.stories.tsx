import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { FormGroupItemOrientation } from '../../form-generic.interfaces.ts';
import { GroupButton } from './group-button.component.tsx';

const meta: Meta<typeof GroupButton> = {
  title: 'Form/Group Button',
  component: GroupButton,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof GroupButton>;

const data = [
  { id: 1, caption: 'Test Item' },
  { id: 2, caption: 'Longer Test Item' },
  { id: 3, caption: 'Test Item 3' },
  { id: 4, caption: 'Test Item 4' },
];

export const MultiSelect: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    data,
    isMultiSelect: true,
  }
};

export const MultiSelectVertical: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    data,
    orientation: FormGroupItemOrientation.Vertical,
    isMultiSelect: true,
  }
};
