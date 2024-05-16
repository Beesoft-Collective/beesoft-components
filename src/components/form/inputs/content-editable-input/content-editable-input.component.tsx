import cx from 'classnames';
import { debounce } from 'lodash-es';
import React, { forwardRef, Ref, useCallback, useImperativeHandle, useRef } from 'react';
import { FormInputControl } from '../../../../headless/components/form/form-control.interface.ts';

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

const ContentEditableInput = (props: ContentEditableInputProps, ref: Ref<ContentEditableInputRef>) => {
  const {
    value,
    readOnly = false,
    debounceTime = 800,
    fillContainer = true,
    leftElement,
    rightElement,
    className,
    leftElementClassName,
    rightElementClassName,
    isSingleLine = true,
    allowSingleLineScroll = false,
    inputMode,
    placeholder,
    onFocus,
    onBlur,
    onInput,
    onInnerTextChange,
    onInnerHTMLChange,
    onElementCreate,
    onLeftElementClick,
    onRightElementClick,
  } = props;

  const textStyles = useRef('bsc-flex-grow focus:bsc-outline-none');
  const placeHolderStyles = useRef('bsc-text-gray-4');
  const inputRef = useRef<HTMLElement>();

  const focusListener = useCallback(
    (event: FocusEvent) => {
      const element = event.target as HTMLElement;
      const value = element.innerHTML;

      element.className = `${textStyles.current}`;

      if (placeholder && value === placeholder) {
        element.innerHTML = '';
      }

      onFocus?.(event);
    },
    [placeholder, onFocus]
  );

  const blurListener = useCallback(
    (event: FocusEvent) => {
      const value = (event.target as HTMLElement).innerHTML;
      if (placeholder && value === '') {
        const element = event.target as HTMLElement;
        element.innerHTML = placeholder;
        element.className = `${textStyles.current} ${placeHolderStyles.current}`;
      }

      onBlur?.(event);
    },
    [placeholder, onBlur]
  );

  const onInputElementCreated = useCallback(
    (element: HTMLElement) => {
      inputRef.current?.removeEventListener('focus', focusListener);
      inputRef.current?.removeEventListener('blur', blurListener);

      if (placeholder && element && element !== document.activeElement && element.innerHTML === '') {
        element.innerHTML = placeholder;
        element.className = `${textStyles.current} ${placeHolderStyles.current}`;
      }

      element.addEventListener('focus', focusListener);
      element.addEventListener('blur', blurListener);

      inputRef.current = element;
    },
    [placeholder]
  );

  const onElementCreated = useCallback(
    (element: HTMLElement) => {
      onElementCreate?.(element);
    },
    [onElementCreate]
  );

  const onLeftElementClicked = (event: React.MouseEvent) => {
    onLeftElementClick?.(event);
  };

  const onRightElementClicked = (event: React.MouseEvent) => {
    onRightElementClick?.(event);
  };

  const onInputChanged = debounce((event: React.FormEvent) => {
    onInput?.(event);
    onInnerTextChange?.((event.target as HTMLElement).innerText);
    onInnerHTMLChange?.((event.target as HTMLElement).innerHTML);
  }, debounceTime);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const setInnerText = useCallback((innerText: string) => {
    if (inputRef.current) {
      inputRef.current.innerText = innerText;
    }
  }, []);

  const setInnerHTML = useCallback((innerHTML: string) => {
    if (inputRef.current) {
      inputRef.current.innerHTML = innerHTML;
    }
  }, []);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useImperativeHandle(ref, () => ({
    inputElement: inputRef.current,
    setInnerText,
    setInnerHTML,
    focus,
  }));

  const dynamicProps: Record<string, unknown> = {};

  if (isSingleLine) {
    dynamicProps['onKeyDown'] = onKeyDown;
  }

  const classNames = cx(
    { 'bsc-w-full ': fillContainer },
    'bsc-flex bsc-flex-row bsc-items-center bsc-shadow-sm bsc-border bsc-border-solid bsc-border-gray-3 dark:bsc-border-white dark:bsc-bg-mono-dark-1 dark:bsc-text-mono-light-1 bsc-rounded-md bsc-p-2',
    {
      'bsc-overflow-x-auto bsc-overflow-y-hidden bsc-whitespace-pre': isSingleLine && allowSingleLineScroll,
      'bsc-overflow-hidden bsc-whitespace-pre': isSingleLine && !allowSingleLineScroll,
    },
    className
  );
  const leftElementClasses = cx('bsc-flex-shrink', { 'bsc-mr-2': leftElement }, leftElementClassName);
  const rightElementClasses = cx('bsc-flex-shrink', { 'bsc-ml-2': rightElement }, rightElementClassName);

  return (
    <div className={classNames} ref={(element) => element && onElementCreated(element)}>
      {leftElement && (
        <div className={leftElementClasses} onClick={onLeftElementClicked}>
          {leftElement}
        </div>
      )}
      <div
        ref={(element) => element && onInputElementCreated(element)}
        className={textStyles.current}
        contentEditable={!readOnly}
        suppressContentEditableWarning={true}
        inputMode={inputMode}
        onInput={onInputChanged}
      >
        {value}
      </div>
      {rightElement && (
        <div className={rightElementClasses} onClick={onRightElementClicked}>
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default forwardRef(ContentEditableInput);
