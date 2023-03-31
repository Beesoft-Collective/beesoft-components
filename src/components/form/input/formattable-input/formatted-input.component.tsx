import React, { forwardRef, memo, Ref, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import ContentEditableInput, {
  ContentEditableInputProps,
  ContentEditableInputRef,
} from '../content-editable-input/content-editable-input.component';
import { DefaultFormats } from './formatted-input.enums';
import { InputFormat } from './formatted-input.interfaces';
import { FormatParser } from './parser/format-parser';
import {
  DayMonthYearFormat,
  MonthDayYearFormat,
  YearMonthDayFormat,
  TwelveHourFormat,
  TwentyFourHourFormat,
} from './formats';

export interface FormattedInputProps extends ContentEditableInputProps {
  format?: InputFormat;
  defaultFormat: DefaultFormats;
}

const FormattedInput = (props: FormattedInputProps, ref: Ref<Omit<ContentEditableInputRef, 'inputElement'>>) => {
  const {
    value,
    format,
    defaultFormat = DefaultFormats.Custom,
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
  const formatParser = useRef<FormatParser>();

  useEffect(() => {
    if (defaultFormat !== DefaultFormats.Custom) {
      const formatSetting = getPreDefinedFormat(defaultFormat);
      if (!formatSetting) {
        throw new Error('The selected format does not exist');
      }

      formatParser.current = new FormatParser(formatSetting);
    } else {
      if (!format) {
        throw new Error('The format property is required when the default format is custom');
      }

      formatParser.current = new FormatParser(format);
    }
  }, [defaultFormat]);

  const getPreDefinedFormat = useCallback((format: DefaultFormats) => {
    switch (format) {
      case DefaultFormats.DateDayMonthYear:
        return DayMonthYearFormat;
      case DefaultFormats.DateMonthDayYear:
        return MonthDayYearFormat;
      case DefaultFormats.DateYearMonthDay:
        return YearMonthDayFormat;
      case DefaultFormats.Time12Hour:
        return TwelveHourFormat;
      case DefaultFormats.Time24Hour:
        return TwentyFourHourFormat;
    }
  }, []);

  const onFocusHandler = useCallback((event: FocusEvent) => {
    if (inputElementRef.current) {
      inputSelection.current = window.getSelection();
      inputRange.current = document.createRange();
      inputSelection.current?.removeAllRanges();
      inputRange.current?.selectNodeContents(inputElementRef.current);
      inputRange.current?.collapse(false);
      inputSelection.current?.removeAllRanges();
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
    if (!isNaN(number) && inputElementRef.current && inputRange.current) {
      currentValue.current += key;
      inputElementRef.current.innerText = currentValue.current;
      if (inputElementRef.current?.firstChild) {
        inputRange.current.setStart(inputElementRef.current.firstChild, currentValue.current.length);
        inputRange.current.setEnd(inputElementRef.current.firstChild, currentValue.current.length);
        console.log('position', inputRange.current?.endOffset);
      }
    } else if (key === 'ArrowLeft') {
      if (inputRange.current && inputElementRef.current && inputElementRef.current.firstChild) {
        inputRange.current.setStart(inputElementRef.current.firstChild, currentValue.current.length - 1);
        inputRange.current.setEnd(inputElementRef.current.firstChild, currentValue.current.length - 1);
      }
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
