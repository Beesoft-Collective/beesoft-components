import { useStateRef } from '@beesoft/common';
import cx from 'classnames';
import { CSSProperties, useMemo } from 'react';
import { BeeSoftIcon } from '../../common/beesoft-icon/beesoft-icon.component.tsx';
import BeeSoftTransition from '../../common/beesoft-transition/beesoft-transition.component.tsx';
import { SideNavigationItemProps } from './side-navigation-item.props.ts';

const SideNavigationItem = ({
  displayText,
  urlPath,
  itemValue,
  subItems,
  isOpen,
  onClick,
}: SideNavigationItemProps) => {
  const [currentlyOpen, setCurrentlyOpen, currentlyOpenRef] = useStateRef(isOpen ?? false);

  const isParentMenu = useMemo(() => subItems !== undefined && subItems.length > 0, []);

  const renderSubItems = () => {
    return subItems?.map((item) => (
      <div className="bsc-ml-4">
        <SideNavigationItem
          displayText={item.text}
          urlPath={item.urlPath}
          itemValue={item.value}
          subItems={item.subItems}
          isOpen={item.startOpen}
        />
      </div>
    ));
  };

  const handleItemClick = () => {
    if (!isParentMenu) {
      itemValue && onClick?.(itemValue);
    } else {
      setCurrentlyOpen(!currentlyOpenRef.current);
    }
  };

  const menuWrapperStyles = cx('bsc-flex bsc-flex-col', {
    'bsc-h-full': currentlyOpen && isParentMenu,
    'bsc-max-h-[24px]': !currentlyOpen && isParentMenu,
  });

  const subMenuStyles = cx('bsc-flex-grow bsc-overflow-y-scroll bsc-h-full [transition:transform_.3s_ease]', {
    '[transform:translate(0,0%)]': currentlyOpen,
    '[transform:translate(0,-100%)]': !currentlyOpen,
  });

  return (
    <div className={menuWrapperStyles}>
      <div className="bsc-flex bsc-w-full bsc-flex-shrink bsc-cursor-pointer" onClick={handleItemClick}>
        {isParentMenu && (
          <div className="bsc-flex-shrink">
            {currentlyOpen && <BeeSoftIcon icon="minus" />}
            {!currentlyOpen && <BeeSoftIcon icon="plus" />}
          </div>
        )}
        <div className="bsc-flex-grow">{displayText}</div>
      </div>
      <div className="bsc-relative bsc-max-h-[5000px] bsc-overflow-hidden">
        {isParentMenu && <div className={subMenuStyles}>{renderSubItems()}</div>}
      </div>
    </div>
  );
};

export { SideNavigationItem };
