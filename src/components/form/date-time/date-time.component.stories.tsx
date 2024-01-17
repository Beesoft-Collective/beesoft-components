import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BeeSoftProvider } from '../../../common/contexts/beesoft.context.tsx';
import { forceAssert } from '../../common-functions.ts';
import { Button } from '../../navigation/buttons/button/button.component.tsx';
import { CalendarIconPosition, DateFormatType, DateSelectionType } from './date-time-types.ts';
import { DateTime } from './date-time.component.tsx';
import { DateTimeInputTemplateProps, DateTimeProps } from './date-time.props.ts';

const meta: Meta<typeof DateTime> = {
  title: 'Form/Date Time',
  component: DateTime,
};

export default meta;

type Story = StoryObj<typeof DateTime>;

const Template = (args: DateTimeProps) => {
  document.body.className = '';

  return (
    <div className="bsc-p-4">
      <DateTime {...args} />
    </div>
  );
};

const MultipleInputTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  const [value, setValue] = useState<string>();

  return (
    <div className="bsc-flex bsc-flex-col bsc-p-4">
      <div className="bsc-flex-shrink">
        <Button onClick={() => setValue('15/05/2023')}>Set Value</Button>
      </div>
      <div className="bsc-flex-grow">
        <div className="bsc-flex">
          <div className="bsc-flex-grow">
            <DateTime {...args} value={value} />
          </div>
          <div className="bsc-flex-grow">
            <DateTime
              label="Date 2"
              dateSelection={DateSelectionType.DateOnly}
              useFormattedInput={true}
              onChange={action('onChange')}
            />
          </div>
          <div className="bsc-flex-grow">
            <DateTime
              label="Date 3"
              dateSelection={DateSelectionType.DateOnly}
              useFormattedInput={true}
              onChange={action('onChange')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SetValueTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  const [value, setValue] = useState<string>();

  return (
    <div className="bsc-p-4">
      <Button type="button" onClick={() => setValue('09/03/2021')}>
        Set Value
      </Button>
      <br />
      <DateTime {...args} value={value} />
    </div>
  );
};

const SetValueUndefinedTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  const [value, setValue] = useState<string | undefined>('10/10/2023');

  return (
    <div className="bsc-p-4">
      <Button type="button" onClick={() => setValue(undefined)}>
        Set Value
      </Button>
      <br />
      <DateTime {...args} value={value} />
    </div>
  );
};

const BodyScrollTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  return (
    <div className="bsc-w-full bsc-p-4" style={{ height: '60rem' }}>
      <DateTime {...args} />
    </div>
  );
};

const IssueScrollTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  return (
    <div className="bsc-flex bsc-w-full bsc-flex-col bsc-p-4">
      <div className="bsc-w-full bsc-flex-shrink bsc-pb-8">Test Header</div>
      <div className="bsc-flex bsc-w-full bsc-flex-grow bsc-flex-row">
        <div className="bsc-border-gray-500 bsc-border-r bsc-border-solid">
          <div className="bsc-overflow-scroll" style={{ height: '25rem', width: '10rem' }}>
            <div
              className="bsc-overflow-x-auto"
              data-skip-element={true}
              style={{ height: '50rem', paddingTop: '10rem' }}
            >
              <DateTime {...args} />
            </div>
          </div>
        </div>
        <div className="bsc-flex-grow">Non Scrollable Content</div>
      </div>
    </div>
  );
};

const ScrollTemplateContext = (args: DateTimeProps) => {
  document.body.className = '';

  return (
    <BeeSoftProvider
      isValidScrollableElement={(element) => {
        const skipElement = element.dataset.skipElement;
        return skipElement === undefined || !skipElement;
      }}
    >
      <IssueScrollTemplate {...args} />
    </BeeSoftProvider>
  );
};

const DarkTemplate = (args: DateTimeProps) => {
  document.body.className = 'bsc-dark';

  return (
    <div className="bsc-bg-mono-dark-1 bsc-p-4" style={{ height: '40rem' }}>
      <DateTime {...args} />
    </div>
  );
};

const OverrideInputTemplate = (args: DateTimeProps) => {
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
          onFocus={(event) => props.onFocus(forceAssert<FocusEvent>(event))}
          value={props.getValue()}
        />
      </div>
    </>
  );
  /* eslint-enable react/prop-types */

  return (
    <div className="bsc-p-4">
      <DateTime {...args} inputTemplate={inputTemplate} inputElement={inputRef as HTMLElement} />
    </div>
  );
};

const OffScreenRightTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  return (
    <div className="bsc-flex bsc-w-full bsc-pr-2">
      <div className="bsc-flex-grow">&nbsp;</div>
      <div className="bsc-flex-shrink" style={{ minWidth: '150px' }}>
        <DateTime {...args} />
      </div>
    </div>
  );
};

const OffScreenRightBottomTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  return (
    <div className="bsc-flex bsc-h-screen bsc-w-full bsc-pb-2 bsc-pr-2">
      <div className="bsc-h-full bsc-w-full bsc-flex-col">
        <div className="bsc-h-3/4">&nbsp;</div>
        <div className="bsc-flex-shrink">
          <div className="bsc-flex bsc-w-full">
            <div className="bsc-flex-grow">&nbsp;</div>
            <div className="bsc-flex-shrink" style={{ minWidth: '150px' }}>
              <DateTime {...args} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    label: 'Date',
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const FormattedDateInput: Story = {
  args: {
    label: 'Date',
    dateSelection: DateSelectionType.DateOnly,
    useFormattedInput: true,
    allowClear: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const MultipleFormattedDateInputs: Story = {
  args: {
    label: 'Date',
    dateSelection: DateSelectionType.DateOnly,
    useFormattedInput: true,
    onChange: action('onChange'),
  },
  render: (args) => <MultipleInputTemplate {...args} />,
};

export const FormattedDateTimeInput: Story = {
  args: {
    label: 'Date',
    dateSelection: DateSelectionType.DateTime,
    useFormattedInput: true,
    allowClear: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const FormattedDateTime24HourInput: Story = {
  args: {
    label: 'Date Finland',
    dateSelection: DateSelectionType.DateTime,
    locale: 'fi-FI',
    useFormattedInput: true,
    allowClear: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const FormattedDateRangeInput: Story = {
  args: {
    label: 'Date',
    dateSelection: DateSelectionType.DateRange,
    useFormattedInput: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const FormattedTimeInput: Story = {
  args: {
    label: 'Time',
    dateSelection: DateSelectionType.TimeOnly,
    useFormattedInput: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const Formatted24TimeInput: Story = {
  args: {
    label: 'Time',
    dateSelection: DateSelectionType.TimeOnly,
    locale: 'de-DE',
    useFormattedInput: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const CloseOnSelection: Story = {
  args: {
    label: 'Date',
    closeSelector: true,
    dateSelection: DateSelectionType.DateOnly,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const CloseOnSelectionInvalidDate: Story = {
  args: {
    label: 'Date (Australia Day 2024 Invalid)',
    closeSelector: true,
    dateSelection: DateSelectionType.DateOnly,
    isValidDate: (date) => !(date.getFullYear() === 2024 && date.getMonth() === 0 && date.getDate() === 26),
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const CloseOnSelectionNotDateOnly: Story = {
  args: {
    label: 'Date',
    closeSelector: true,
    dateSelection: DateSelectionType.DateTime,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const AllowClear: Story = {
  args: {
    label: 'Date',
    allowClear: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const SetDateValue: Story = {
  args: {
    label: 'Date',
    value: '30/03/2021, 4:15:00 PM',
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const CurrentDateTime: Story = {
  args: {
    label: 'Date',
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const IconOnLeft: Story = {
  args: {
    label: 'Left Icon',
    useDefaultDateValue: true,
    iconPosition: CalendarIconPosition.Left,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const NoIcon: Story = {
  args: {
    label: 'No Icon',
    iconPosition: CalendarIconPosition.None,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const InputTemplate: Story = {
  args: {
    label: 'Custom Input Template',
    onChange: action('onChange'),
  },
  render: (args) => <OverrideInputTemplate {...args} />,
};

export const DarkMode: Story = {
  args: {
    label: 'Date',
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <DarkTemplate {...args} />,
};

export const IsoDateTime: Story = {
  args: {
    label: 'Date',
    value: '2021-04-20T14:20:00+08:00',
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const DateOnly: Story = {
  args: {
    label: 'Date Only',
    dateSelection: DateSelectionType.DateOnly,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const TimeOnly: Story = {
  args: {
    label: 'Time Only',
    dateSelection: DateSelectionType.TimeOnly,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const TimeOnly24Hour: Story = {
  args: {
    label: 'Time Only',
    dateSelection: DateSelectionType.TimeOnly,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const DateRange: Story = {
  args: {
    label: 'Date Range',
    dateSelection: DateSelectionType.DateRange,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const DateRangeSetValue: Story = {
  args: {
    label: 'Date Range',
    dateSelection: DateSelectionType.DateRange,
    value: '30/03/2021 - 14/04/2021',
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const DateRangeDefaultValue: Story = {
  args: {
    label: 'Date Range',
    dateSelection: DateSelectionType.DateRange,
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const DateRangeOnChange: Story = {
  args: {
    label: 'Date Range',
    dateSelection: DateSelectionType.DateRange,
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const CssClassNameChange: Story = {
  args: {
    label: 'Css Class Change',
    useDefaultDateValue: true,
    className: '!bsc-border-none !bsc-text-sm !bsc-border-transparent',
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const MinuteConstraint: Story = {
  args: {
    label: 'Date',
    timeConstraints: {
      minutes: {
        min: 0,
        max: 59,
        step: 10,
      },
    },
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const InvalidScrollDateTime: Story = {
  args: {
    label: 'Date',
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <IssueScrollTemplate {...args} />,
};

export const FixedScrollDataTime: Story = {
  args: {
    label: 'Date',
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <ScrollTemplateContext {...args} />,
};

export const BodyScrollDateTime: Story = {
  args: {
    label: 'Date',
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <BodyScrollTemplate {...args} />,
};

export const DelaySetValue: Story = {
  args: {
    label: 'Date',
    onChange: action('onChange'),
  },
  render: (args) => <SetValueTemplate {...args} />,
};

export const SetValueUndefined: Story = {
  args: {
    label: 'Date to Undefined',
    onChange: action('onChange'),
  },
  render: (args) => <SetValueUndefinedTemplate {...args} />,
};

export const SelectableDate: Story = {
  args: {
    label: 'Date',
    selectableDate: (date: Date) => date.getDay() !== 0,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const IsValidSelectedDate: Story = {
  args: {
    label: 'Date',
    isValidDate: (date: Date) => date.getDay() !== 0,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const IsValidInputDate: Story = {
  args: {
    label: 'Date (Sunday is invalid)',
    dateSelection: DateSelectionType.DateOnly,
    useFormattedInput: true,
    isValidDate: (date: Date) => date.getDay() !== 0,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const ShortDate: Story = {
  args: {
    label: 'Date',
    dateFormat: DateFormatType.Short,
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const MediumDate: Story = {
  args: {
    label: 'Date',
    dateFormat: DateFormatType.Medium,
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const LongDate: Story = {
  args: {
    label: 'Date',
    dateFormat: DateFormatType.Long,
    useDefaultDateValue: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const ReadOnlyDate: Story = {
  args: {
    label: 'Read Only Date',
    value: '31/10/1977, 8:30:00 AM',
    readOnly: true,
    onChange: action('onChange'),
  },
  render: (args) => <Template {...args} />,
};

export const OffScreenRight: Story = {
  args: {
    label: 'Off Screen Right',
    onChange: action('onChange'),
  },
  render: (args) => <OffScreenRightTemplate {...args} />,
};

export const OffScreenRightBottom: Story = {
  args: {
    label: 'Off Screen Right Bottom',
    onChange: action('onChange'),
  },
  render: (args) => <OffScreenRightBottomTemplate {...args} />,
};
