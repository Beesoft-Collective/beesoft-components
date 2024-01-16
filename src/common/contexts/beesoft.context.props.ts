export interface BeeSoftContextProps {
  overlayKeepOnScreen?: boolean; // default true
  useAnimations?: boolean; // default true
  mobileMediaQuery?: string;
  tabletMediaQuery?: string;
  desktopMediaQuery?: string;
  isValidScrollableElement?: (element: HTMLElement) => boolean;
}
