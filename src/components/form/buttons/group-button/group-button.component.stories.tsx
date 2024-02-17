import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../navigation/buttons/button/button.component.tsx';
import { ButtonType } from '../../../navigation/buttons/button/button.props.ts';
import { FormGroupItemOrientation } from '../../form-generic.interfaces.ts';
import { GroupButton } from './group-button.component.tsx';
import { GroupButtonProps } from './group-button.props.ts';

const meta: Meta<typeof GroupButton> = {
  title: 'Form/Group Button',
  component: GroupButton,
  args: {
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof GroupButton>;

const DarkTemplate = (args: GroupButtonProps) => {
  document.body.className = 'bsc-dark';

  return (
    <div className="bsc-bg-mono-dark-1 bsc-p-4" style={{ height: '40rem' }}>
      <GroupButton {...args} />
    </div>
  );
};

const data = [
  { id: 1, caption: 'Test Item' },
  { id: 2, caption: 'Longer Test Item' },
  { id: 3, caption: 'Test Item 3' },
  { id: 4, caption: 'Test Item 4' },
];

export const SingleSelect: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    data,
  },
};

export const SingleSelectSetValue: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    value: 2,
    data,
  },
};

export const MultiSelect: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    data,
    isMultiSelect: true,
  },
};

export const MultiSelectSetValue: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    value: [1, 3],
    data,
    isMultiSelect: true,
  },
};

export const MultiSelectReadOnly: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    value: [1, 3],
    data,
    isMultiSelect: true,
    readOnly: true,
  },
};

export const SingleSelectVertical: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    data,
    orientation: FormGroupItemOrientation.Vertical,
  },
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
  },
};

export const MultiSelectTemplate: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button Template',
    valueField: 'id',
    textField: 'caption',
    data,
    isMultiSelect: true,
    itemTemplate: (props) => {
      let type: ButtonType = 'primary';
      if (props.isSelected) {
        type = 'warning';
      }

      return (
        <div key={props.itemId} className="bsc-p-4">
          <Button buttonType={type} onClick={() => props.onItemChanged(props.itemValue)}>
            {props.itemText}
          </Button>
        </div>
      );
    },
  },
};

export const MultiSelectValueTemplate: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button Template',
    value: [1, 4],
    valueField: 'id',
    textField: 'caption',
    data,
    isMultiSelect: true,
    itemTemplate: (props) => {
      let type: ButtonType = 'primary';
      if (props.isSelected) {
        type = 'warning';
      }

      return (
        <div key={props.itemId} className="bsc-p-4">
          <Button buttonType={type} onClick={() => props.onItemChanged(props.itemValue)}>
            {props.itemText}
          </Button>
        </div>
      );
    },
  },
};

export const SingleSelectTemplate: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button Template',
    valueField: 'id',
    textField: 'caption',
    data,
    itemTemplate: (props) => {
      let type: ButtonType = 'primary';
      if (props.isSelected) {
        type = 'warning';
      }

      return (
        <div key={props.itemId} className="bsc-p-4">
          <Button buttonType={type} onClick={() => props.onItemChanged(props.itemValue)}>
            {props.itemText}
          </Button>
        </div>
      );
    },
  },
};

export const SingleSelectVerticalTemplate: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button Template',
    valueField: 'id',
    textField: 'caption',
    orientation: FormGroupItemOrientation.Vertical,
    data,
    itemTemplate: (props) => {
      let type: ButtonType = 'primary';
      if (props.isSelected) {
        type = 'warning';
      }

      return (
        <div key={props.itemId} className="bsc-p-4">
          <Button buttonType={type} onClick={() => props.onItemChanged(props.itemValue)}>
            {props.itemText}
          </Button>
        </div>
      );
    },
  },
};

export const DarkMultiSelect: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    data,
    isMultiSelect: true,
  },
  render: (args) => <DarkTemplate {...args} />,
};

export const DarkMultiSelectSetValue: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    value: [1, 3],
    data,
    isMultiSelect: true,
  },
  render: (args) => <DarkTemplate {...args} />,
};

export const DarkMultiSelectReadOnly: Story = {
  args: {
    name: 'test',
    label: 'Test Group Button',
    valueField: 'id',
    textField: 'caption',
    value: [1, 3],
    data,
    isMultiSelect: true,
    readOnly: true,
  },
  render: (args) => <DarkTemplate {...args} />,
};
