import { action } from '@storybook/addon-actions';
import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import Checkbox, { CheckboxProps } from './checkbox.component';

export default {
  title: 'Form/Checkbox',
  component: Checkbox,
} as Meta;

const Template: Story<CheckboxProps> = (args) => {
  document.body.className = '';

  return (
    <div className="bsc-p-5">
      <Checkbox {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  name: 'test',
  label: 'Test Checkbox',
  value: 'true',
  onChange: action('onChange'),
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  name: 'test',
  label: 'Test Checkbox',
  value: 'true',
  defaultChecked: true,
  readOnly: true,
  onChange: action('onChange'),
};
