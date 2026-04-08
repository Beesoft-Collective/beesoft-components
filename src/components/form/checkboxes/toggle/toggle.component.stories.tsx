import { action } from 'storybook/actions';
import { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle.component.tsx';
import { ToggleProps } from './toggle.props.ts';
import { BeeSoftIcon } from '../../../common/beesoft-icon/beesoft-icon.component.tsx';
import { IconSize } from '../../../common/beesoft-icon/beesoft-icon.props.ts';

const meta: Meta<typeof Toggle> = {
  title: 'Form/Toggle',
  component: Toggle,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

const DarkTemplate = (args: ToggleProps) => {
  document.body.className = 'dark';

  return (
    <div className="bsc:bg-mono-dark-1 bsc:p-4" style={{ height: '40rem' }}>
      <Toggle {...args} />
    </div>
  );
};

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    name: 'testSwitch',
    label: 'Test Switch',
    value: 'test',
  },
};

export const SetChecked: Story = {
  args: {
    name: 'testSwitch',
    label: 'Test Switch',
    value: 'test',
    checked: true,
  },
};

export const OnOffElement: Story = {
  args: {
    name: 'testSwitch',
    label: 'Test Switch',
    value: 'test',
    onElement: <BeeSoftIcon icon="moon" size={IconSize.Small} className="bsc:text-white" />,
    offElement: <BeeSoftIcon icon="sun" size={IconSize.Small} className="bsc:text-white" />,
  },
};

export const ReadOnly: Story = {
  args: {
    name: 'testSwitch',
    label: 'Test Switch',
    value: 'test',
    checked: true,
    readOnly: true,
  },
};

export const Dark: Story = {
  args: {
    name: 'testSwitch',
    label: 'Test Switch',
    value: 'test',
  },
  render: (args) => <DarkTemplate {...args} />,
};

export const DarkReadOnly: Story = {
  args: {
    name: 'testSwitch',
    label: 'Test Switch',
    value: 'test',
    checked: true,
    readOnly: true,
  },
  render: (args) => <DarkTemplate {...args} />,
};
