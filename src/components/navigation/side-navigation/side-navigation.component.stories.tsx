import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { SideNavigation } from './side-navigation.component.tsx';
import { MenuItem } from './side-navigation.props.ts';

const meta: Meta<typeof SideNavigation> = {
  title: 'Navigation/Side Navigation',
  component: SideNavigation,
  args: {
    onMenuItemClick: action('onMenuItemClick'),
  },
};

export default meta;

type Story = StoryObj<typeof SideNavigation>;

const menuItems: Array<MenuItem> = [
  {
    text: 'Parent Item 1',
    startOpen: true,
    subItems: [
      {
        text: 'Item 1 Sub Item 1',
        urlPath: '/parent1/item1',
        value: 'item11',
      },
      {
        text: 'Item 1 Sub Item 2',
        urlPath: '/parent1/item2',
        value: 'item12',
      },
    ],
  },
  {
    text: 'Simple Item 2',
    urlPath: '/item2',
    value: 'simple2',
  },
  {
    text: 'Multi-Nested Item 3',
    subItems: [
      {
        text: 'Nested Simple 1',
        urlPath: '/nested/item1',
        value: 'nestedSimple1',
      },
      {
        text: 'Second Nested Item',
        subItems: [
          {
            text: 'Second Nested 1',
            urlPath: '/nested/sub/item1',
            value: 'secondNested1',
          },
          {
            text: 'Second Nested 2',
            urlPath: '/nested/sub/item2',
            value: 'secondNested2',
          },
          {
            text: 'Second Nested 3',
            urlPath: '/nested/sub/item3',
            value: 'secondNested3',
          },
        ],
      },
    ],
  },
  {
    text: 'Simple Nested Item 4',
    subItems: [
      {
        text: 'Simple Item 1',
        urlPath: '/simple/item1',
      }
    ],
  },
];

export const Default: Story = {
  args: {
    menuItems,
  },
};
