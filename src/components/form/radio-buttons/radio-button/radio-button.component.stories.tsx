import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './radio-button.component.tsx';
import { HeadlessRadioButtonProps } from '../../../../headless/components/form/radio-buttons/radio-button/headless-radio-button.props.ts';

const meta: Meta<typeof RadioButton> = {
  title: 'Form/Radio Button',
  component: RadioButton,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof RadioButton>;

const DarkTemplate = (args: HeadlessRadioButtonProps) => {
  document.body.className = 'bsc-dark';

  return (
    <div className="bsc-bg-mono-dark-1 bsc-p-4" style={{ height: '40rem' }}>
      <RadioButton {...args} />
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
