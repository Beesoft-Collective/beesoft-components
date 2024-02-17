import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { FormGroupItemOrientation } from '../../form-generic.interfaces.ts';
import { CheckboxGroup } from './checkbox-group.component.tsx';
import { CheckboxGroupProps } from './checkbox-group.props.ts';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Form/Checkbox Group',
  component: CheckboxGroup,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

const DarkTemplate = (args: CheckboxGroupProps) => {
  document.body.className = 'bsc-dark';

  return (
    <div className="bsc-bg-mono-dark-1 bsc-p-4" style={{ height: '40rem' }}>
      <CheckboxGroup {...args} />
    </div>
  );
};

const data = [
  { id: 1, caption: 'Test Item 1' },
  { id: 2, caption: 'Test Item 2' },
  { id: 3, caption: 'Test Item 3' },
  { id: 4, caption: 'Test Item 4' },
];

export const Default: Story = {
  args: {
    name: 'test',
    label: 'Test Items',
    valueField: 'id',
    textField: 'caption',
    data,
  },
};

export const Horizontal: Story = {
  args: {
    name: 'test',
    label: 'Test Items',
    orientation: FormGroupItemOrientation.Horizontal,
    valueField: 'id',
    textField: 'caption',
    data,
  },
};

export const SetValue: Story = {
  args: {
    name: 'test',
    label: 'Test Items',
    valueField: 'id',
    textField: 'caption',
    data,
    value: [1, 3],
  },
};

export const ReadOnly: Story = {
  args: {
    name: 'test',
    label: 'Test Items',
    valueField: 'id',
    textField: 'caption',
    data,
    value: [1, 3],
    readOnly: true,
  },
};

export const Dark: Story = {
  args: {
    name: 'test',
    label: 'Test Items',
    valueField: 'id',
    textField: 'caption',
    data,
  },
  render: (args) => <DarkTemplate {...args} />,
};
