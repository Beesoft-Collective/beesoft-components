import { Meta, Story } from '@storybook/react';
import React from 'react';
import ContentEditableInput, { ContentEditableInputProps } from './content-editable-input.component';

export default {
  title: 'Form/Content Editable Input',
  component: ContentEditableInput,
} as Meta;

const ValueTitleTemplate: Story<ContentEditableInputProps> = (args) => (
  <div className="bsc-w-24">
    <ContentEditableInput {...args} />
  </div>
);

export const CheckValueTitle = ValueTitleTemplate.bind({});
CheckValueTitle.args = {
  value: 'A really long value that should cause it to be shown as a tooltip',
  isSingleLine: true,
};
