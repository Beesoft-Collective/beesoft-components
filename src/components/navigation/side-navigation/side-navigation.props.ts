export interface MenuItem {
  text: string;
  urlPath?: string;
  value?: string | number;
  subItems?: Array<MenuItem>;
  /**
   * Determines if a parent menu item should be opened by default. A parent menu item is an item with assigned sub
   * items.
   */
  startOpen?: boolean;
}

export interface SideNavigationProps {
  menuItems: Array<MenuItem>;
  onMenuItemClick?: (clickedValue: string | number) => void;
  className?: string;
}
