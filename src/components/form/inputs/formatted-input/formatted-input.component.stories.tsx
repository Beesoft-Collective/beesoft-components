import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { DateTimeFormatCreator } from '../../date-time/date-time-format-creator';
import { DateSelectionType } from '../../date-time/date-time-types';
import FormattedInput, { FormattedInputProps } from './formatted-input.component';

export default {
  title: 'Form/Formatted Input',
  component: FormattedInput,
} as Meta;

const formatCreator = new DateTimeFormatCreator(DateSelectionType.DateOnly, 'en-AU');

const Template: Story<FormattedInputProps> = (args) => <FormattedInput {...args} />;

export const SimpleFormat = Template.bind({});
SimpleFormat.args = {
  format: formatCreator.createInputFormat(),
};

export const PassedValue = Template.bind({});
PassedValue.args = {
  value: '3/2/2023',
  format: formatCreator.createInputFormat(),
  onChange: action('onChange'),
};
