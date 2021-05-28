import { action } from '@storybook/addon-actions';
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { DateSelectionType } from './date-time-types';
import DateTime, { DateTimeProps } from './date-time.component';

export default {
  title: 'Date Time',
  component: DateTime,
} as Meta;

const Template: Story<DateTimeProps> = (args) => <DateTime {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Date',
  value: '30/03/2021, 4:15:00 PM',
};

export const CurrentDateTime = Template.bind({});
CurrentDateTime.args = {
  label: 'Date',
  onChange: action('onChange'),
};

export const IsoDateTime = Template.bind({});
IsoDateTime.args = {
  label: 'Date',
  value: '2021-04-20T14:20:00+08:00',
};

export const DateOnly = Template.bind({});
DateOnly.args = {
  label: 'Date Only',
  dateSelection: DateSelectionType.DateOnly,
};

export const TimeOnly = Template.bind({});
TimeOnly.args = {
  label: 'Time Only',
  dateSelection: DateSelectionType.TimeOnly,
};

export const MinuteConstraint = Template.bind({});
MinuteConstraint.args = {
  label: 'Date',
  timeConstraints: {
    minutes: {
      min: 0,
      max: 59,
      step: 10,
    },
  },
};
