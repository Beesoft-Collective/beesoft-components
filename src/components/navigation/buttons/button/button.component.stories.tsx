import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './button.component.tsx';
import { ButtonProps } from './button.props.ts';

const meta: Meta<typeof Button> = {
  title: 'Navigation/Button',
  component: Button,
  args: {
    onClick: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

const Template = (args: Omit<ButtonProps, 'children'>) => <Button {...args}>Test Text</Button>;

export const Default: Story = {
  args: {
    className: 'bsc-bg-gray-2 bsc-text-white',
  },
  render: (args) => <Template {...args} />,
};

export const Primary: Story = {
  args: {
    buttonType: 'primary',
  },
  render: (args) => <Template {...args} />,
};

export const Info: Story = {
  args: {
    buttonType: 'info',
  },
  render: (args) => <Template {...args} />,
};

export const Success: Story = {
  args: {
    buttonType: 'success',
  },
  render: (args) => <Template {...args} />,
};

export const Warning: Story = {
  args: {
    buttonType: 'warning',
  },
  render: (args) => <Template {...args} />,
};

export const Error: Story = {
  args: {
    buttonType: 'error',
  },
  render: (args) => <Template {...args} />,
};
