import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React, { useState } from 'react';
import { CalendarIconPosition, DateFormatType, DateSelectionType } from './date-time-types';
import DateTime, { DateTimeInputTemplateProps, DateTimeProps } from './date-time.component';

export default {
  title: 'Form/Date Time',
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

const BodyScrollTemplate: Story<DateTimeProps> = (args) => {
  document.body.className = '';

  return (
    <div className="bsc-w-full" style={{ height: '60rem' }}>
      <DateTime {...args} />
    </div>
  );
};

const ScrollTemplate: Story<DateTimeProps> = (args) => {
  document.body.className = '';

  return (
    <div className="bsc-w-full bsc-flex bsc-flex-col">
      <div className="bsc-w-full bsc-pb-8 bsc-flex-shrink">Test Header</div>
      <div className="bsc-w-full bsc-flex-grow bsc-flex bsc-flex-row">
        <div className="bsc-border-r bsc-border-solid bsc-border-gray-500">
          <div className="bsc-overflow-scroll" style={{ height: '25rem' }}>
            <div style={{ height: '50rem', paddingTop: '10rem' }}>
              <DateTime {...args} />
            </div>
          </div>
        </div>
        <div className="bsc-flex-grow">Non Scrollable Content</div>
      </div>
    </div>
  );
};

const DarkTemplate: Story<DateTimeProps> = (args) => {
  document.body.className = 'bsc-dark';

  return (
    <div className="bsc-bg-gray-900 bsc-p-4" style={{ height: '30rem' }}>
      <DateTime {...args} />
    </div>
  );
};

const OverrideInputTemplate: Story<DateTimeProps> = (args) => {
  document.body.className = '';

  const [inputRef, setInputRef] = useState<HTMLInputElement>();

  /* eslint-disable react/prop-types */
  const inputTemplate = (props: DateTimeInputTemplateProps) => (
    <>
      {props.label && <label>{props.label}</label>}
      <div>
        <input
          ref={(element) => element && setInputRef(element)}
          className="bsc-border bsc-border-solid bsc-border-black"
          onFocus={props.onFocus}
          value={props.getValue()}
        />
      </div>
    </>
  );
  /* eslint-enable react/prop-types */

  return <DateTime {...args} inputTemplate={inputTemplate} inputElement={inputRef as HTMLElement} />;
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

export const NoIcon = Template.bind({});
NoIcon.args = {
  label: 'No Icon',
  iconPosition: CalendarIconPosition.None,
};

export const ChangeIcon = Template.bind({});
ChangeIcon.args = {
  label: 'Different Icon',
  icon: <FontAwesomeIcon icon={['far', 'calendar-times']} />,
};

export const InputTemplate = OverrideInputTemplate.bind({});
InputTemplate.args = {
  label: 'Custom Input Template',
  onChange: action('onChange'),
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

export const CssClassNameChange = Template.bind({});
CssClassNameChange.args = {
  label: 'Css Class Change',
  useDefaultDateValue: true,
  className: 'bsc-border-none bsc-text-sm bsc-border-transparent',
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

export const BodyScrollDateTime = BodyScrollTemplate.bind({});
BodyScrollDateTime.args = {
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

export const ModifiedColors = Template.bind({});
ModifiedColors.args = {
  label: 'Modified Colors',
  colors: {
    inputBorderColor: 'bsc-border-none',
    inputBgColor: 'bsc-bg-blue-200',
    todayDateColor: 'bsc-bg-red-500',
  },
};
