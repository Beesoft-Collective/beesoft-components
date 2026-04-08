import { FormInputControl } from '@beesoft/common';
import React from 'react';

export interface ContentEditableInputProps extends FormInputControl<string> {
  debounceTime?: number;
  fillContainer?: boolean;
  leftElement?: React.JSX.Element;
  rightElement?: React.JSX.Element;
  leftElementClassName?: string;
  rightElementClassName?: string;
  isSingleLine?: boolean;
  allowSingleLineScroll?: boolean;
  inputMode?: 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | undefined;
  onKeyDown?: (event: KeyboardEvent) => void;
  onInnerTextChange?: (value: string) => void;
  onInnerHTMLChange?: (value: string) => void;
  onElementCreate?: (element: HTMLElement) => void;
  onLeftElementClick?: (event: React.MouseEvent) => void;
  onRightElementClick?: (event: React.MouseEvent) => void;
}

export interface ContentEditableInputRef {
  inputElement?: HTMLElement;
  setInnerText: (innerText: string) => void;
  setInnerHTML: (innerHTML: string) => void;
  focus: () => void;
}
