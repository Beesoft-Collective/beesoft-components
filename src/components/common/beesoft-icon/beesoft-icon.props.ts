import { FC } from 'react';
import { IconProps } from './icons/icon.props.ts';

export interface BeeSoftIconList {
  calendar: FC<IconProps>;
  chevronDown: FC<IconProps>;
  chevronLeft: FC<IconProps>;
  chevronRight: FC<IconProps>;
  chevronUp: FC<IconProps>;
  close: FC<IconProps>;
  minus: FC<IconProps>;
  plus: FC<IconProps>;
}

export enum IconSize {
  Regular = 24,
  Small = 20,
}

export interface BeeSoftIconProps {
  icon: keyof BeeSoftIconList;
  size?: IconSize;
  onClick?: () => void;
  className?: string;
}
