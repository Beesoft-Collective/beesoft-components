import { action } from '@storybook/addon-actions';
import React from 'react';
import { Story, Meta } from '@storybook/react';
import DateTime, { DateTimeProps } from './date-time.component';

export default {
  title: 'Date Time',
  component: DateTime
} as Meta;

const Template: Story<DateTimeProps> = args => <DateTime {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'date',
  label: 'Date',
  value: '30/01/2021 10:15:00 AM'
};

export const CurrentDateTime = Template.bind({});
CurrentDateTime.args = {
  name: 'date',
  label: 'Date',
  onChange: action('onChange')
};
