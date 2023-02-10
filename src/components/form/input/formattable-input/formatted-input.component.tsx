import React, { FormEvent, forwardRef, memo, Ref, useCallback, useImperativeHandle, useRef } from 'react';
import ContentEditableInput, {
  ContentEditableInputProps,
  ContentEditableInputRef,
} from '../content-editable-input/content-editable-input.component';

export interface FormattedInputProps extends ContentEditableInputProps {
  format: unknown;
}

const FormattedInput = (props: FormattedInputProps, ref: Ref<Omit<ContentEditableInputRef, 'inputElement'>>) => {
  const {
    value,
    format,
    readOnly = false,
    debounceTime = 800,
    fillContainer = true,
    leftElement,
    rightElement,
    className,
    leftElementClassName,
    rightElementClassName,
    isSingleLine = false,
    allowSingleLineScroll = false,
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

  const currentValue = useRef('');
  const inputRef = useRef<ContentEditableInputRef>();
  const inputElementRef = useRef<HTMLElement>();
  const inputSelection = useRef<Selection | null>();
  const inputRange = useRef<Range>();

  const onFocusHandler = useCallback((event: FocusEvent) => {
    if (inputElementRef.current) {
      inputSelection.current = window.getSelection();
      inputRange.current = document.createRange();
      inputSelection.current?.removeAllRanges();
      inputRange.current?.selectNodeContents(inputElementRef.current);
      inputRange.current?.collapse(false);
      inputSelection.current?.addRange(inputRange.current);
      inputElementRef.current?.focus();
    }

    onFocus?.(event);
  }, []);

  const onKeyDownHandler = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const { key } = event;
    const number = parseInt(key);
    if (!isNaN(number) && inputElementRef.current) {
      currentValue.current += key;
      console.log('current value', currentValue.current);
      inputElementRef.current.innerText = currentValue.current;

      // inputRange.current?.deleteContents();
      // const textNode = document.createTextNode(currentValue.current);
      // inputRange.current?.insertNode(textNode);
      // inputRange.current?.setStart(textNode, currentValue.current.length);
      // inputRange.current?.setEnd(textNode, currentValue.current.length);
    }
  }, []);

  const onInputRefCreated = useCallback((ref: ContentEditableInputRef) => {
    if (inputRef.current?.inputElement) {
      inputRef.current.inputElement.removeEventListener('keydown', onKeyDownHandler);
    }

    inputRef.current = ref;
    inputRef.current?.inputElement?.addEventListener('keydown', onKeyDownHandler);
    inputElementRef.current = inputRef.current?.inputElement;
  }, []);

  const setInnerText = useCallback((innerText: string) => {
    inputRef.current?.setInnerText(innerText);
  }, []);

  const setInnerHTML = useCallback((innerHTML: string) => {
    inputRef.current?.setInnerHTML(innerHTML);
  }, []);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useImperativeHandle(ref, () => ({
    setInnerText,
    setInnerHTML,
    focus,
  }));

  return (
    <ContentEditableInput
      ref={(refElement) => refElement && onInputRefCreated(refElement)}
      value={value}
      readOnly={readOnly}
      debounceTime={debounceTime}
      fillContainer={fillContainer}
      leftElement={leftElement}
      rightElement={rightElement}
      className={className}
      leftElementClassName={leftElementClassName}
      rightElementClassName={rightElementClassName}
      isSingleLine={isSingleLine}
      allowSingleLineScroll={allowSingleLineScroll}
      placeholder={placeholder}
      onFocus={onFocusHandler}
      onBlur={onBlur}
      onInput={onInput}
      onInnerTextChange={onInnerTextChange}
      onInnerHTMLChange={onInnerHTMLChange}
      onElementCreate={onElementCreate}
      onLeftElementClick={onLeftElementClick}
      onRightElementClick={onRightElementClick}
    />
  );
};

export default memo(forwardRef(FormattedInput));
