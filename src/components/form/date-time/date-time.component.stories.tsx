import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { CalendarIconPosition, DateFormatType, DateSelectionType } from './date-time-types';
import DateTime, { DateTimeProps } from './date-time.component';

export default {
  title: 'Date Time',
  component: DateTime,
} as Meta;

const Template: Story<DateTimeProps> = (args) => {
  document.body.className = '';

  return <DateTime {...args} />;
};

const SetValueTemplate: Story<DateTimeProps> = (args) => {
  document.body.className = '';

  const [value, setValue] = useState<string>();

  return (
    <>
      <button type="button" onClick={() => setValue('09/03/2021')}>
        Set Value
      </button>
      <br />
      <DateTime {...args} value={value} />
    </>
  );
};

const ScrollTemplate: Story<DateTimeProps> = (args) => {
  return (
    <div style={{ paddingTop: '50rem', paddingBottom: '20rem' }}>
      <DateTime {...args} />
    </div>
  );
};

const DarkTemplate: Story<DateTimeProps> = (args) => {
  document.body.className = 'dark';

  return (
    <div className="bg-gray-900 p-4" style={{ height: '30rem' }}>
      <DateTime {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Date',
};

export const SetDateValue = Template.bind({});
SetDateValue.args = {
  label: 'Date',
  value: '30/03/2021, 4:15:00 PM',
};

export const CurrentDateTime = Template.bind({});
CurrentDateTime.args = {
  label: 'Date',
  useDefaultDateValue: true,
  onChange: action('onChange'),
};

export const IconOnLeft = Template.bind({});
IconOnLeft.args = {
  label: 'Left Icon',
  useDefaultDateValue: true,
  iconPosition: CalendarIconPosition.Left,
};

export const DarkMode = DarkTemplate.bind({});
DarkMode.args = {
  label: 'Date',
  useDefaultDateValue: true,
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

export const DateRange = Template.bind({});
DateRange.args = {
  label: 'Date Range',
  dateSelection: DateSelectionType.DateRange,
};

export const DateRangeSetValue = Template.bind({});
DateRangeSetValue.args = {
  label: 'Date Range',
  dateSelection: DateSelectionType.DateRange,
  value: '30/03/2021 - 14/04/2021',
  onChange: (date: Date | Array<Date>) => console.log('date range', date),
};

export const DateRangeDefaultValue = Template.bind({});
DateRangeDefaultValue.args = {
  label: 'Date Range',
  dateSelection: DateSelectionType.DateRange,
  useDefaultDateValue: true,
};

export const DateRangeOnChange = Template.bind({});
DateRangeOnChange.args = {
  label: 'Date Range',
  dateSelection: DateSelectionType.DateRange,
  useDefaultDateValue: true,
  onChange: (date: Date | Array<Date>) => console.log('date range', date),
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

export const ScrollDateTime = ScrollTemplate.bind({});
ScrollDateTime.args = {
  label: 'Date',
  useDefaultDateValue: true,
};

export const DelaySetValue = SetValueTemplate.bind({});
DelaySetValue.args = {
  label: 'Date',
};

export const SelectableDate = Template.bind({});
SelectableDate.args = {
  label: 'Date',
  selectableDate: (date: Date) => date.getDay() !== 0,
};

export const IsValidSelectedDate = Template.bind({});
IsValidSelectedDate.args = {
  label: 'Date',
  isValidDate: (date: Date) => date.getDay() !== 0,
  onChange: action('onChange'),
};

export const ShortDate = Template.bind({});
ShortDate.args = {
  label: 'Date',
  dateFormat: DateFormatType.Short,
  useDefaultDateValue: true,
};

export const MediumDate = Template.bind({});
MediumDate.args = {
  label: 'Date',
  dateFormat: DateFormatType.Medium,
  useDefaultDateValue: true,
};

export const LongDate = Template.bind({});
LongDate.args = {
  label: 'Date',
  dateFormat: DateFormatType.Long,
  useDefaultDateValue: true,
};

export const ReadOnlyDate = Template.bind({});
ReadOnlyDate.args = {
  label: 'Read Only Date',
  value: '31/10/1977, 8:30:00 AM',
  readOnly: true,
};
