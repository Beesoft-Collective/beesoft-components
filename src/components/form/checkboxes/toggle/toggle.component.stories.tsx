import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle.component.tsx';

const meta: Meta<typeof Toggle> = {
  title: 'Form/Toggle',
  component: Toggle,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    name: 'testSwitch',
    label: 'Test Switch',
    value: 'test',
  },
};
