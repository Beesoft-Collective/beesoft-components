import cx from 'classnames';
import React, { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ContentEditableInput, {
  ContentEditableInputProps,
  ContentEditableInputRef,
} from '../content-editable-input/content-editable-input.component';
import { InputFormat } from './input-format.interfaces';
import { FormatParser } from './parser/format-parser';

export interface FormattedInputProps extends Omit<ContentEditableInputProps, 'placeholder'> {
  format?: InputFormat;
  isInputValid?: (value?: string) => boolean;
}

export interface FormattedInputRef {
  focus: () => void;
}

const FormattedInput = (props: FormattedInputProps, ref: Ref<FormattedInputRef>) => {
  const {
    value = '',
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
    isInputValid,
    onChange,
    onFocus,
    onBlur,
    onElementCreate,
    onLeftElementClick,
    onRightElementClick,
  } = props;

  const [isValidInput, setIsValidInput] = useState(true);

  const inputRef = useRef<ContentEditableInputRef>();
  const inputElementRef = useRef<HTMLElement>();
  const formatParser = useRef<FormatParser>();

  useEffect(() => {
    return () => {
      formatParser.current?.dispose();
    };
  }, []);

  useEffect(() => {
    formatParser.current?.inputValuePassed(value);
  }, [value]);

  useEffect(() => {
    formatParser.current?.dispose();

    if (format) {
      formatParser.current = new FormatParser(format, value);

      if (inputElementRef.current) {
        formatParser.current?.inputElementCreated(inputElementRef.current);
      }

      formatParser.current?.registerFormatChangeEvent(onFormatChange);
    }
  }, [format]);

  const onFormatChange = useCallback(
    (value?: string) => {
      if (isInputValid) {
        if (isInputValid(value)) {
          setIsValidInput(true);
          onChange?.(value);
        } else {
          setIsValidInput(false);
        }
      } else {
        onChange?.(value);
      }
    },
    [onChange]
  );

  const onFocusHandler = useCallback(
    (event: FocusEvent) => {
      formatParser.current?.inputFocused();
      onFocus?.(event);
    },
    [onFocus]
  );

  const onBlurHandler = useCallback(
    (event: FocusEvent) => {
      formatParser.current?.inputBlurred();
      onBlur?.(event);
    },
    [onBlur]
  );

  const onMouseUpHandler = useCallback(() => {
    formatParser.current?.mouseUpHandler();
  }, []);

  const onKeyDownHandler = useCallback((event: KeyboardEvent) => {
    formatParser.current?.keyDownHandler(event);
  }, []);

  const onInputRefCreated = useCallback((ref: ContentEditableInputRef) => {
    inputRef.current?.inputElement?.removeEventListener('keydown', onKeyDownHandler);
    inputRef.current?.inputElement?.removeEventListener('mouseup', onMouseUpHandler);

    inputRef.current = ref;
    inputRef.current?.inputElement?.addEventListener('keydown', onKeyDownHandler);
    inputRef.current?.inputElement?.addEventListener('mouseup', onMouseUpHandler);
    inputElementRef.current = inputRef.current?.inputElement;
  }, []);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useImperativeHandle(ref, () => ({
    focus,
  }));

  const finalClassName = cx(className, {
    '!bsc-border-error': !isValidInput,
  });

  return (
    <ContentEditableInput
      ref={(refElement) => refElement && onInputRefCreated(refElement)}
      readOnly={readOnly}
      debounceTime={debounceTime}
      fillContainer={fillContainer}
      leftElement={leftElement}
      rightElement={rightElement}
      className={finalClassName}
      leftElementClassName={leftElementClassName}
      rightElementClassName={rightElementClassName}
      isSingleLine={isSingleLine}
      allowSingleLineScroll={allowSingleLineScroll}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      onElementCreate={onElementCreate}
      onLeftElementClick={onLeftElementClick}
      onRightElementClick={onRightElementClick}
    />
  );
};

export default forwardRef(FormattedInput);
