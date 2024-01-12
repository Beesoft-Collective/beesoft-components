import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox.component.tsx';
import { CheckboxProps } from './checkbox.props.ts';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

const DarkTemplate = (args: CheckboxProps) => {
  document.body.className = 'bsc-dark';

  return (
    <div className="bsc-bg-mono-dark-1 bsc-p-4" style={{ height: '40rem' }}>
      <Checkbox {...args} />
    </div>
  );
};

export const Default: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
  },
};

export const ReadOnly: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
    checked: true,
    readOnly: true,
  },
};

export const Dark: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
  },
  render: (args) => <DarkTemplate {...args} />,
};

export const DarkReadOnly: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
    checked: true,
    readOnly: true,
  },
  render: (args) => <DarkTemplate {...args} />,
};
