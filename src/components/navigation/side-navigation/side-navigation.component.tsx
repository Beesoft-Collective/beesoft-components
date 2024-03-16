import { NavLink } from 'react-router-dom';
import { SideNavigationItem } from './side-navigation-item.component.tsx';
import { SideNavigationProps } from './side-navigation.props.ts';

const SideNavigation = ({ menuItems, onMenuItemClick, className }: SideNavigationProps) => {
  return (
    <div className="bsc-bg-primary-3">
      {menuItems.map((item) => (
        <SideNavigationItem
          displayText={item.text}
          urlPath={item.urlPath}
          itemValue={item.value}
          subItems={item.subItems}
          isOpen={item.startOpen}
        />
      ))}
    </div>
  );
};

export { SideNavigation };
