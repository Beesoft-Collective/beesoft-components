import cx from 'classnames';
import React, { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import debounce from 'lodash/debounce';

export interface ContentEditableInputProps {
  value?: string;
  readOnly?: boolean;
  debounceTime?: number;
  fillContainer?: boolean;
  leftElement?: JSX.Element;
  rightElement?: JSX.Element;
  className?: string;
  leftElementClassName?: string;
  rightElementClassName?: string;
  isSingleLine?: boolean;
  allowSingleLineScroll?: boolean;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onInput?: (event: React.FormEvent) => void;
  onElementCreate?: (element: HTMLElement) => void;
  onLeftElementClick?: (event: React.MouseEvent) => void;
  onRightElementClick?: (event: React.MouseEvent) => void;
}

export interface ContentEditableInputRef {
  focus: () => void;
}

function ContentEditableInput(props: ContentEditableInputProps, ref: Ref<ContentEditableInputRef>) {
  const {
    value,
    readOnly = false,
    debounceTime = 500,
    fillContainer = true,
    leftElement,
    rightElement,
    className,
    leftElementClassName,
    rightElementClassName,
    isSingleLine = false,
    allowSingleLineScroll = false,
    onFocus,
    onBlur,
    onInput,
    onElementCreate,
    onLeftElementClick,
    onRightElementClick,
  } = props;

  const inputRef = useRef<HTMLDivElement>(null);

  const onLeftElementClicked = (event: React.MouseEvent) => {
    if (onLeftElementClick) {
      onLeftElementClick(event);
    }
  };

  const onRightElementClicked = (event: React.MouseEvent) => {
    if (onRightElementClick) {
      onRightElementClick(event);
    }
  };

  const onFocused = (event: React.FocusEvent) => {
    if (onFocus) {
      onFocus(event);
    }
  };

  const onInputChanged = debounce((event: React.FormEvent) => {
    if (onInput) {
      onInput(event);
    }
  }, debounceTime);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const onElementCreated = (element: HTMLElement) => {
    if (element) {
      if (onElementCreate) {
        onElementCreate(element);
      }

      if (element.offsetWidth < element.scrollWidth && value) {
        element.setAttribute('title', value);
      }
    }
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  useImperativeHandle(ref, () => ({
    focus,
  }));

  const dynamicProps = {};

  if (isSingleLine) {
    dynamicProps['onKeyDown'] = onKeyDown;
  }

  const classNames = cx(
    { 'bsc-w-full ': fillContainer },
    'bsc-flex bsc-flex-row bsc-shadow-sm bsc-border bsc-border-solid bsc-border-gray-300 dark:bsc-border-white dark:bsc-bg-gray-900 dark:bsc-text-white bsc-rounded-md bsc-p-2',
    {
      'bsc-overflow-x-auto bsc-overflow-y-hidden bsc-whitespace-pre': isSingleLine && allowSingleLineScroll,
      'bsc-overflow-hidden bsc-whitespace-pre': isSingleLine && !allowSingleLineScroll,
    },
    className
  );
  const leftElementClasses = cx('bsc-flex-shrink', { 'bsc-mr-2': leftElement }, leftElementClassName);
  const rightElementClasses = cx('bsc-flex-shrink', { 'bsc-ml-2': rightElement }, rightElementClassName);

  return (
    <div className={classNames} ref={(element) => onElementCreated(element as HTMLElement)}>
      <div className={leftElementClasses} onClick={onLeftElementClicked}>
        {leftElement}
      </div>
      <div
        ref={inputRef}
        className="bsc-flex-grow focus:bsc-outline-none"
        contentEditable={!readOnly}
        suppressContentEditableWarning={true}
        onFocus={onFocused}
        onBlur={onBlur}
        onInput={onInputChanged}
      >
        {value}
      </div>
      <div className={rightElementClasses} onClick={onRightElementClicked}>
        {rightElement}
      </div>
    </div>
  );
}

export default forwardRef(ContentEditableInput);
