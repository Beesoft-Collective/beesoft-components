import { Meta, StoryObj } from '@storybook/react';
import ContentEditableInput, { ContentEditableInputProps } from './content-editable-input.component';

const meta: Meta<typeof ContentEditableInput> = {
  title: 'Form/Content Editable Input',
  component: ContentEditableInput,
};

export default meta;

type Story = StoryObj<typeof ContentEditableInput>;

const ValueTitleTemplate = (args: ContentEditableInputProps) => (
  <div className="bsc-w-24">
    <ContentEditableInput {...args} />
  </div>
);

export const Placeholder: Story = {
  args: {
    placeholder: 'This is a placeholder',
    isSingleLine: true,
  },
};

export const CheckValueTitle: Story = {
  args: {
    value: 'A really long value that should cause it to be shown as a tooltip',
    isSingleLine: true,
  },
  render: (args) => <ValueTitleTemplate {...args} />,
};
