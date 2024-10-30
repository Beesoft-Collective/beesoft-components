export enum ImageGalleryThumbnailType {
  /**
   * Just display the thumbnail images.
   */
  Images,
  /**
   * Only an indicator is shown, like a small dot.
   */
  Indicator,
  /**
   * Like the indicator, but hovering will show an image preview.
   */
  PreviewIndicator,
}

export enum ImageGalleryThumbnailLocation {
  Bottom,
  Left,
  Right,
  Top,
}

export interface ImageGalleryProps {
  images: Array<string>;
  thumbnailType?: ImageGalleryThumbnailType;
  thumbnailLocation?: ImageGalleryThumbnailLocation;
}
