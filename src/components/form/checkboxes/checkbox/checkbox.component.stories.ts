import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox.component.tsx';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
  },
};
