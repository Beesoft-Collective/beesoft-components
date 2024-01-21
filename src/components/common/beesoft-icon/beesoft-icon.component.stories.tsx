import { Meta, StoryObj } from '@storybook/react';
import { BeeSoftIcon } from './beesoft-icon.component.tsx';

const meta: Meta<typeof BeeSoftIcon> = {
  title: 'Common/BeeSoftIcon',
  component: BeeSoftIcon,
};

export default meta;

type Story = StoryObj<typeof BeeSoftIcon>;

export const Icon: Story = {
  args: {
    icon: 'calendar',
  },
};

export const IconColor: Story = {
  args: {
    icon: 'calendar',
    className: 'bsc-text-primary-1 bsc-bg-primary-5',
  },
};
