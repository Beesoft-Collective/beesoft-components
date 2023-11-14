import { action } from '@storybook/addon-actions';
import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import RadioButton, { RadioButtonProps } from './radio-button.component';

export default {
  title: 'Form/Radio button',
  component: RadioButton,
} as Meta;

const Template: Story<RadioButtonProps> = (args) => {
  document.body.className = '';

  return (
    <div className="bsc-p-5">
      <RadioButton {...args} />
    </div>
  );
};

const DarkTemplate: Story<RadioButtonProps> = (args) => {
  document.body.className = 'bsc-dark';

  return (
    <div className="bsc-bg-mono-dark-1 bsc-p-5">
      <RadioButton {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  name: 'test',
  label: 'Test Radio Button',
  value: 'true',
  onChange: action('onChange'),
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  name: 'test',
  label: 'Test Radio Button',
  value: 'true',
  defaultChecked: true,
  readOnly: true,
};

export const DarkMode = DarkTemplate.bind({});
DarkMode.args = {
  name: 'test',
  label: ' Test Radio Button',
  value: 'true',
  onChange: action('onChange'),
};

export const DarkModeReadOnly = DarkTemplate.bind({});
DarkModeReadOnly.args = {
  name: 'test',
  label: 'Test Radio Button RadioButton',
  value: 'true',
  defaultChecked: true,
  readOnly: true,
};
