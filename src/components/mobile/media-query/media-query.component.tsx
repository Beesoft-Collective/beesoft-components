import { useMediaQuery } from '@react-hook/media-query';
import { MediaQueryProps } from './media-query.props.ts';

const MediaQuery = ({
  mobileQuery = 'screen and (max-width: 640px)',
  tabletQuery = 'screen and (min-width: 641px and max-width: 768px)',
  desktopQuery = 'screen and (min-width: 1024px)',
  mobileMarkup,
  aboveMobileMarkup,
  tabletMarkup,
  desktopMarkup,
}: MediaQueryProps) => {
  const isMobile = useMediaQuery(mobileQuery);
  const isTablet = useMediaQuery(tabletQuery);
  const isDesktop = useMediaQuery(desktopQuery);

  const renderCorrectMarkup = () => {
    if (isMobile && mobileMarkup) {
      return mobileMarkup;
    } else if (!isMobile && aboveMobileMarkup) {
      return aboveMobileMarkup;
    } else if (isTablet && tabletMarkup) {
      return tabletMarkup;
    } else if (isDesktop && desktopMarkup) {
      return desktopMarkup;
    } else {
      console.error('Invalid media settings');
      return null;
    }
  };

  return renderCorrectMarkup();
};

export { MediaQuery };
