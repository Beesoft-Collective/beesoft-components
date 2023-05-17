import React, { forwardRef, memo, Ref, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import ContentEditableInput, {
  ContentEditableInputProps,
  ContentEditableInputRef,
} from '../content-editable-input/content-editable-input.component';
import { FormattedInputDefaultFormats } from './formats/input-format.enums';
import { InputFormat } from './formats/input-format.interfaces';
import { FormatParser } from './parser/format-parser';
import {
  DayMonthYearFormat,
  MonthDayYearFormat,
  YearMonthDayFormat,
  DayMonthYearRangeFormat,
  MonthDayYearRangeFormat,
  YearMonthDayRangeFormat,
  TwelveHourFormat,
  TwentyFourHourFormat,
} from './formats';

export interface FormattedInputProps extends Omit<ContentEditableInputProps, 'placeholder'> {
  format?: InputFormat;
  defaultFormat: FormattedInputDefaultFormats;
}

export interface FormattedInputRef {
  focus: () => void;
}

const FormattedInput = (props: FormattedInputProps, ref: Ref<FormattedInputRef>) => {
  const {
    value = '',
    format,
    defaultFormat = FormattedInputDefaultFormats.Custom,
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
    onChange,
    onFocus,
    onBlur,
    onElementCreate,
    onLeftElementClick,
    onRightElementClick,
  } = props;

  const inputRef = useRef<ContentEditableInputRef>();
  const inputElementRef = useRef<HTMLElement>();
  const formatParser = useRef<FormatParser>();

  useEffect(() => {
    if (formatParser.current) {
      formatParser.current.inputValuePassed(value);
    }
  }, [value]);

  useEffect(() => {
    if (defaultFormat !== FormattedInputDefaultFormats.Custom) {
      const formatSetting = getPreDefinedFormat(defaultFormat);
      if (!formatSetting) {
        throw new Error('The selected format does not exist');
      }

      formatParser.current = new FormatParser(formatSetting, value);
    } else {
      if (!format) {
        throw new Error('The format property is required when the default format is custom');
      }

      formatParser.current = new FormatParser(format, value);
    }

    if (inputElementRef.current) {
      formatParser.current?.inputElementCreated(inputElementRef.current);
    }

    formatParser.current?.registerFormatCompleteEvent(onFormatComplete);
  }, [defaultFormat, format]);

  const onFormatComplete = useCallback(
    (value: string) => {
      onChange?.(value);
    },
    [onChange]
  );

  const getPreDefinedFormat = useCallback((format: FormattedInputDefaultFormats) => {
    switch (format) {
      case FormattedInputDefaultFormats.DateDayMonthYear:
        return DayMonthYearFormat;
      case FormattedInputDefaultFormats.DateMonthDayYear:
        return MonthDayYearFormat;
      case FormattedInputDefaultFormats.DateYearMonthDay:
        return YearMonthDayFormat;
      case FormattedInputDefaultFormats.DateRangeDayMonthYear:
        return DayMonthYearRangeFormat;
      case FormattedInputDefaultFormats.DateRangeMonthDayYear:
        return MonthDayYearRangeFormat;
      case FormattedInputDefaultFormats.DateRangeYearMonthDay:
        return YearMonthDayRangeFormat;
      case FormattedInputDefaultFormats.Time12Hour:
        return TwelveHourFormat;
      case FormattedInputDefaultFormats.Time24Hour:
        return TwentyFourHourFormat;
    }
  }, []);

  const onFocusHandler = useCallback(
    (event: FocusEvent) => {
      formatParser.current?.inputFocused();
      onFocus?.(event);
    },
    [onFocus]
  );

  const onMouseUp = useCallback((event: MouseEvent) => {
    // formatParser.current?.mouseClicked(event);
  }, []);

  const onKeyDownHandler = useCallback((event: KeyboardEvent) => {
    formatParser.current?.keyDownHandler(event);
  }, []);

  const onInputRefCreated = useCallback((ref: ContentEditableInputRef) => {
    inputRef.current?.inputElement?.removeEventListener('keydown', onKeyDownHandler);
    inputRef.current?.inputElement?.removeEventListener('mouseup', onMouseUp);

    inputRef.current = ref;
    inputRef.current?.inputElement?.addEventListener('keydown', onKeyDownHandler);
    inputRef.current?.inputElement?.addEventListener('mouseup', onMouseUp);
    inputElementRef.current = inputRef.current?.inputElement;
  }, []);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useImperativeHandle(ref, () => ({
    focus,
  }));

  return (
    <ContentEditableInput
      ref={(refElement) => refElement && onInputRefCreated(refElement)}
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
      onFocus={onFocusHandler}
      onBlur={onBlur}
      onElementCreate={onElementCreate}
      onLeftElementClick={onLeftElementClick}
      onRightElementClick={onRightElementClick}
    />
  );
};

export default memo(forwardRef(FormattedInput));
