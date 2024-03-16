import { ButtonHTMLAttributes } from 'react';

export type ButtonType = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
export type ButtonStyle = 'flat' | 'curved' | 'round';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  buttonType?: ButtonType;
  buttonStyle?: ButtonStyle;
  fullWidth?: boolean;
  onClick?: () => void;
}

export interface ButtonRef {
  click: () => void;
}
