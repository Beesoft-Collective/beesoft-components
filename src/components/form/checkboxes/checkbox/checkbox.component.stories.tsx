import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { BeeSoftProvider } from '../../../../common/contexts/beesoft.context.tsx';
import { Button } from '../../../navigation/buttons/button/button.component.tsx';
import { Checkbox } from './checkbox.component.tsx';
import { CheckboxChangeEvent, CheckboxProps, CheckboxRef } from './checkbox.props.ts';

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

const PartialCheckedTemplate = (args: CheckboxProps) => {
  document.body.className = '';

  const checkboxRef = useRef<CheckboxRef>(null);

  const onCheckedRefClicked = () => {
    checkboxRef.current?.setChecked(true);
  };

  const onPartialRefClicked = () => {
    checkboxRef.current?.setPartiallyChecked(true);
  };

  return (
    <div className="bsc-w-full">
      <div className="bsc-mb-2 bsc-flex bsc-w-full">
        <div className="bsc-flex-1">
          <Button buttonType="primary" onClick={onCheckedRefClicked}>
            Set Checked with Ref
          </Button>
        </div>
        <div className="bsc-flex-1">
          <Button buttonType="secondary" onClick={onPartialRefClicked}>
            Set Partial with Ref
          </Button>
        </div>
      </div>
      <div className="bsc-p-2">
        <Checkbox ref={checkboxRef} {...args} />
      </div>
    </div>
  );
};

const StateTemplate = (args: CheckboxProps) => {
  const [checkedState, setCheckedState] = useState<{ checked: boolean }>();

  const handleOnChange = (event?: CheckboxChangeEvent) => {
    setCheckedState(event);
    args.onChange?.(event);
  };

  return (
    <div className="bsc-p-4">
      <Checkbox {...args} checked={checkedState?.checked} onChange={handleOnChange} />
    </div>
  );
};

const PartialSetStateTemplate = (args: CheckboxProps) => {
  const [partialState, setPartialState] = useState<{ checked: boolean; partial: boolean }>({
    checked: false,
    partial: false,
  });

  const setCheckboxState = () => {
    setPartialState({
      checked: true,
      partial: true,
    });
  };

  const resetState = () => {
    setPartialState({
      checked: false,
      partial: false,
    });
  };

  return (
    <div className="bsc-w-full bsc-p-4">
      <div className="bsc-flex bsc-w-full bsc-pb-2">
        <div className="bsc-pr-2">
          <Button onClick={setCheckboxState} buttonType="primary">
            Set State
          </Button>
        </div>
        <div>
          <Button onClick={resetState} buttonType="secondary">
            Reset State
          </Button>
        </div>
      </div>
      <div>
        <Checkbox {...args} checked={partialState.checked} partial={partialState.partial} />
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

export const SetChecked: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
    checked: true,
  },
};

export const SetPartial: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
    partial: true,
  },
};

export const CheckedState: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
  },
  render: (args) => <StateTemplate {...args} />,
};

export const PartialState: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
  },
  render: (args) => <PartialSetStateTemplate {...args} />,
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

export const ContextAnimationsUseAnimation: Story = {
  args: {
    name: 'test',
    label: 'Test Checkbox',
    value: 'test',
    useAnimation: false,
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
  render: (args) => <PartialCheckedTemplate {...args} />,
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
