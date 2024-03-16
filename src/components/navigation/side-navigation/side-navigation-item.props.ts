import { MenuItem } from './side-navigation.props.ts';

export interface SideNavigationItemProps {
  displayText: string
  urlPath?: string;
  itemValue?: string | number;
  subItems?: Array<MenuItem>;
  isOpen?: boolean;
  onClick?: (clickedValue: string | number) => void;
}
