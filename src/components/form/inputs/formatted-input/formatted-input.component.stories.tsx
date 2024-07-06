import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { DateTimeFormatCreator } from '../../date-time/date-time-format-creator';
import { DateSelectionType } from '../../../../headless/components/form/date-time/date-time-types.ts';
import FormattedInput from './formatted-input.component';

const meta: Meta<typeof FormattedInput> = {
  title: 'Form/Formatted Input',
  component: FormattedInput,
};

export default meta;

type Story = StoryObj<typeof FormattedInput>;

const formatCreator = new DateTimeFormatCreator(DateSelectionType.DateOnly, 'en-AU');

export const SimpleFormat: Story = {
  args: {
    format: formatCreator.createInputFormat(),
  },
};

export const PassedValue: Story = {
  args: {
    value: '3/2/2023',
    format: formatCreator.createInputFormat(),
    onChange: action('onChange'),
  },
};
