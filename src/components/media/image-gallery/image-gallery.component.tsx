import { ImageGalleryProps, ImageGalleryThumbnailLocation, ImageGalleryThumbnailType } from './image-gallery.props.ts';
import cx from 'classnames';

const ImageGallery = ({
  images,
  thumbnailType = ImageGalleryThumbnailType.Images,
  thumbnailLocation = ImageGalleryThumbnailLocation.Bottom,
}: ImageGalleryProps) => {
  console.log('images', images, 'thumbnail type', thumbnailType, 'thumbnail location', thumbnailLocation);

  const containerStyles = cx('bsc-flex', {
    'bsc-flex-col': thumbnailLocation === ImageGalleryThumbnailLocation.Bottom,
    'bsc-flex-col-reverse': thumbnailLocation === ImageGalleryThumbnailLocation.Top,
  });

  const imageStyles = cx('bsc-h-full bsc-w-full');

  const thumbnailStyles = cx('bsc-border bsc-border-primary-1');

  return (
    <div className={containerStyles}>
      <div className={imageStyles}>Main Image</div>
      <div className={thumbnailStyles}>Image Thumbnails</div>
    </div>
  );
};

export { ImageGallery };
