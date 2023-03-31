import React from 'react';
import { Meta, Story } from '@storybook/react';
import FormattedInput, { FormattedInputProps } from './formatted-input.component';
import { DefaultFormats } from './formatted-input.enums';

export default {
  title: 'Form/Formatted Input',
  component: FormattedInput,
} as Meta;

const Template: Story<FormattedInputProps> = (args) => <FormattedInput {...args} />;

export const SimpleFormat = Template.bind({});
SimpleFormat.args = {
  placeholder: 'This is a placeholder',
  defaultFormat: DefaultFormats.DateDayMonthYear,
};
