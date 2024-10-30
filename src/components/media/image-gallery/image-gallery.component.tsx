import { ImageGalleryProps, ImageGalleryThumbnailLocation, ImageGalleryThumbnailType } from './image-gallery.props.ts';

const ImageGallery = ({
  images,
  thumbnailType = ImageGalleryThumbnailType.Images,
  thumbnailLocation = ImageGalleryThumbnailLocation.Bottom,
}: ImageGalleryProps) => {
  console.log('images', images, 'thumbnail type', thumbnailType, 'thumbnail location', thumbnailLocation);
  return <div>Image Gallery</div>;
};

export { ImageGallery };
