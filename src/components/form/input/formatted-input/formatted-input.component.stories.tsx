// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Meta, Story } from '@storybook/react';
import FormattedInput, { FormattedInputProps } from './formatted-input.component';
import { DefaultFormats } from './formats/input-format.enums';

export default {
  title: 'Form/Formatted Input',
  component: FormattedInput,
} as Meta;

const Template: Story<FormattedInputProps> = (args) => <FormattedInput {...args} />;

export const SimpleFormat = Template.bind({});
SimpleFormat.args = {
  defaultFormat: DefaultFormats.DateDayMonthYear,
};

export const PassedValue = Template.bind({});
PassedValue.args = {
  value: '3/2/2023',
  defaultFormat: DefaultFormats.DateDayMonthYear,
};
