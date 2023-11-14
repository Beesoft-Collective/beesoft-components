import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { DateTimeInputTemplateProps } from '../../../../types';
import { DateSelectionType } from './date-time-types.ts';
import DateTime, { DateTimeProps } from './date-time.component.tsx';

const meta: Meta<typeof DateTime> = {
  title: 'Form/Date Time',
  component: DateTime,
};

export default meta;

type Story = StoryObj<typeof DateTime>;

const Template = (args: DateTimeProps) => {
  document.body.className = '';

  return <DateTime {...args} />;
};

const MultipleInputTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  const [value, setValue] = useState<string>();

  return (
    <div className="bsc-flex bsc-flex-col">
      <div className="bsc-flex-shrink">
        <button onClick={() => setValue('15/05/2023')}>Set Value</button>
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
    <>
      <button type="button" onClick={() => setValue('09/03/2021')}>
        Set Value
      </button>
      <br />
      <DateTime {...args} value={value} />
    </>
  );
};

const SetValueUndefinedTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  const [value, setValue] = useState<string | undefined>('10/10/2023');

  return (
    <>
      <button type="button" onClick={() => setValue(undefined)}>
        Set Value
      </button>
      <br />
      <DateTime {...args} value={value} />
    </>
  );
};

const BodyScrollTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  return (
    <div className="bsc-w-full" style={{ height: '60rem' }}>
      <DateTime {...args} />
    </div>
  );
};

const ScrollTemplate = (args: DateTimeProps) => {
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

const DarkTemplate = (args: DateTimeProps) => {
  document.body.className = 'bsc-dark';

  return (
    <div className="bsc-bg-gray-900 bsc-p-4" style={{ height: '30rem' }}>
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
          onFocus={(event) => props.onFocus(event as unknown as FocusEvent)}
          value={props.getValue()}
        />
      </div>
    </>
  );
  /* eslint-enable react/prop-types */

  return <DateTime {...args} inputTemplate={inputTemplate} inputElement={inputRef as HTMLElement} />;
};

const OffScreenRightTemplate = (args: DateTimeProps) => {
  document.body.className = '';

  return (
    <div className="bsc-w-full bsc-flex bsc-pr-2">
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
    <div className="bsc-w-full bsc-h-screen bsc-flex bsc-pr-2 bsc-pb-2">
      <div className="bsc-w-full bsc-h-full bsc-flex-col">
        <div className="bsc-h-3/4">&nbsp;</div>
        <div className="bsc-flex-shrink">
          <div className="bsc-w-full bsc-flex">
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
