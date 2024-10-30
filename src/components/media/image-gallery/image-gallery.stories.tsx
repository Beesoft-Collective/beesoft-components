import { Meta, StoryObj } from '@storybook/react';
import { ImageGallery } from './image-gallery.component.tsx';

const meta: Meta<typeof ImageGallery> = {
  title: 'Media/Image Gallery',
  component: ImageGallery,
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

export const Default: Story = {
  args: {
    images: ['image1', 'image2', 'image3'],
  },
};
