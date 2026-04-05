import cx from 'classnames';
import { debounce } from 'lodash-es';
import React, { forwardRef, Ref, useCallback, useImperativeHandle, useRef } from 'react';
import { FormInputControl, useEvent } from '@beesoft/common';

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
    onKeyDown,
    onInnerTextChange,
    onInnerHTMLChange,
    onElementCreate,
    onLeftElementClick,
    onRightElementClick,
  } = props;

  const textStyles = useRef('bsc:grow bsc:focus:outline-hidden');
  const placeHolderStyles = useRef('bsc:text-gray-4');
  const inputRef = useRef<HTMLElement>(undefined);

  const focusListener = useEvent((event: FocusEvent) => {
    const element = event.target as HTMLElement;
    const value = element.innerHTML;

    element.className = `${textStyles.current}`;

    if (placeholder && value === placeholder) {
      element.innerHTML = '';
    }

    onFocus?.(event);
  });

  const blurListener = useEvent((event: FocusEvent) => {
    const value = (event.target as HTMLElement).innerHTML;
    if (placeholder && value === '') {
      const element = event.target as HTMLElement;
      element.innerHTML = placeholder;
      element.className = `${textStyles.current} ${placeHolderStyles.current}`;
    }

    onBlur?.(event);
  });

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

  const onKeyDownListener = useEvent((event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event.nativeEvent);

    if (event.key === 'Enter') {
      event.preventDefault();
    }
  });

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
    dynamicProps['onKeyDown'] = onKeyDownListener;
  }

  const classNames = cx(
    { 'bsc:w-full ': fillContainer },
    'bsc:flex bsc:flex-row bsc:items-center bsc:shadow-sm bsc:border bsc:border-solid bsc:border-gray-3 bsc:dark:border-white bsc:dark:bg-mono-dark-1 bsc:dark:text-mono-light-1 bsc:rounded-md bsc:p-2',
    {
      'bsc:overflow-x-auto bsc:overflow-y-hidden bsc:whitespace-pre': isSingleLine && allowSingleLineScroll,
      'bsc:overflow-hidden bsc:whitespace-pre': isSingleLine && !allowSingleLineScroll,
    },
    className
  );
  const leftElementClasses = cx('bsc:shrink', { 'bsc:mr-2': leftElement }, leftElementClassName);
  const rightElementClasses = cx('bsc:shrink', { 'bsc:ml-2': rightElement }, rightElementClassName);

  return (
    <div
      className={classNames}
      ref={(element) => {
        if (element) onElementCreated(element);
      }}
    >
      {leftElement && (
        <div className={leftElementClasses} onClick={onLeftElementClicked}>
          {leftElement}
        </div>
      )}
      <div
        ref={(element) => {
          if (element) onInputElementCreated(element);
        }}
        className={textStyles.current}
        contentEditable={!readOnly}
        suppressContentEditableWarning={true}
        inputMode={inputMode}
        onInput={onInputChanged}
        {...dynamicProps}
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
