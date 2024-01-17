import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { BeeSoftProvider } from '../../../../common/contexts/beesoft.context.tsx';
import { Button } from '../../../navigation/buttons/button/button.component.tsx';
import { Checkbox } from './checkbox.component.tsx';
import { CheckboxProps, CheckboxRef } from './checkbox.props.ts';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

const Template = (args: CheckboxProps) => <Checkbox {...args} />;

const ContextAnimationTemplate = (args: CheckboxProps) => (
  <BeeSoftProvider useAnimations={true}>
    <Template {...args} />
  </BeeSoftProvider>
);

const ContextNoAnimationTemplate = (args: CheckboxProps) => (
  <BeeSoftProvider useAnimations={false}>
    <Template {...args} />
  </BeeSoftProvider>
);

const PartialTemplate = (args: CheckboxProps) => {
  document.body.className = '';

  const [partial, setPartial] = useState(args.partial || false);
  const checkboxRef = useRef<CheckboxRef>(null);

  const onPartialClicked = () => {
    setPartial(!partial);
  };

  const onPartialRefClicked = () => {
    checkboxRef.current?.setPartiallyChecked(true);
  };

  return (
    <div className="bsc-w-full">
      <div className="bsc-mb-2 bsc-flex bsc-w-full">
        <div className="bsc-flex-1">
          <Button buttonType="primary" onClick={onPartialClicked}>
            Set Partial
          </Button>
        </div>
        <div className="bsc-flex-1">
          <Button buttonType="secondary" onClick={onPartialRefClicked}>
            Set Partial with Ref
          </Button>
        </div>
      </div>
      <div className="bsc-p-2">
        <Checkbox ref={checkboxRef} {...args} partial={partial} />
      </div>
    </div>
  );
};

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

export const NoLabel: Story = {
  args: {
    name: 'test',
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

export const ContextAnimations: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
  },
  render: (args) => <ContextAnimationTemplate {...args} />,
};

export const ContextNoAnimations: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
  },
  render: (args) => <ContextNoAnimationTemplate {...args} />,
};

export const Partial: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
    partial: true,
  },
  render: (args) => <PartialTemplate {...args} />,
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
