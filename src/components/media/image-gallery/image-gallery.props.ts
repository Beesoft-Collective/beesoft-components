export enum ImageGalleryThumbnailType {
  Images,
  Indicator,
  PreviewIndicator,
}

export interface ImageGalleryProps {
  images: Array<string>;
  thumbnailType?: ImageGalleryThumbnailType;
}
