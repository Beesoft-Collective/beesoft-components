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
  onFocus?: (event: React.FocusEvent) => void;
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
    onFocus,
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

  const onElementCreated = (element: HTMLElement) => {
    if (element && onElementCreate) {
      onElementCreate(element);
    }
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  useImperativeHandle(ref, () => ({
    focus,
  }));

  const classNames = cx(
    { 'w-full ': fillContainer },
    'flex flex-row shadow-sm border border-solid border-gray-300 dark:border-white dark:bg-gray-900 dark:text-white rounded-md p-2',
    className
  );
  const leftElementClasses = cx('flex-shrink', { 'mr-2': leftElement }, leftElementClassName);
  const rightElementClasses = cx('flex-shrink', { 'ml-2': rightElement }, rightElementClassName);

  return (
    <div className={classNames} ref={(element) => onElementCreated(element as HTMLElement)}>
      <div className={leftElementClasses} onClick={onLeftElementClicked}>
        {leftElement}
      </div>
      <div
        ref={inputRef}
        className="flex-grow focus:outline-none"
        contentEditable={!readOnly}
        suppressContentEditableWarning={true}
        onFocus={onFocused}
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
