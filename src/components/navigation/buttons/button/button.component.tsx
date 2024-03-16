import cx from 'classnames';
import { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import { FocusRingStyle, useFocusRingStyle } from '../../../../common/hooks/style/use-focus-ring-style.ts';
import { ButtonProps, ButtonRef } from './button.props.ts';

const ButtonComponent = (props: ButtonProps, ref: Ref<ButtonRef>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    buttonType,
    buttonStyle = 'flat',
    type = 'button',
    disabled = false,
    form,
    fullWidth = false,
    onClick,
    className,
    children,
  } = props;

  const handleOnClick = () => {
    onClick?.();
  };

  const click = () => {
    buttonRef.current?.click();
  };

  useImperativeHandle(ref, () => ({
    click,
  }));

  const focusRingStyles = useFocusRingStyle(FocusRingStyle.Focus);
  const buttonStyles = cx(
    'bc-button max-sm:bsc-p-4 md:bsc-p-2 dark:bsc-bg-mono-light-1 dark:hover:bsc-bg-mono-light-2 dark:bsc-text-mono-dark-1',
    focusRingStyles,
    {
      'bsc-w-full': fullWidth,
      'bc-disabled bsc-bg-gray-3 bsc-text-gray-2 bsc-pointer-events-none': disabled,
      'bsc-bg-primary-1 bsc-text-white hover:bsc-bg-primary-2 focus:bsc-ring-primary-1': buttonType === 'primary',
      'bsc-bg-primary-2 bsc-text-white hover:bsc-bg-primary-3 focus:bsc-ring-primary-2': buttonType === 'secondary',
      'bsc-bg-info bsc-text-white focus:bsc-ring-info': buttonType === 'info',
      'bsc-bg-success bsc-text-white focus:bsc-ring-success': buttonType === 'success',
      'bsc-bg-warning bsc-text-white focus:bsc-ring-warning': buttonType === 'warning',
      'bsc-bg-error bsc-text-white focus:bsc-ring-error': buttonType === 'error',
      'bsc-rounded-md': buttonStyle === 'curved',
      'bsc-rounded-full !bsc-px-4': buttonStyle === 'round',
    },
    className
  );

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleOnClick}
      disabled={disabled}
      form={form}
      className={buttonStyles}
    >
      {children}
    </button>
  );
};

const Button = forwardRef(ButtonComponent);

export { Button };
