import cx from 'classnames';
import { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import { ButtonProps, ButtonRef } from './button.props.ts';

const ButtonComponent = (props: ButtonProps, ref: Ref<ButtonRef>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    buttonType,
    type = 'button',
    disabled = false,
    form,
    fullWidth = false,
    onClick,
    className,
    children,
  } = props;

  const click = () => {
    buttonRef.current?.click();
  };

  useImperativeHandle(ref, () => ({
    click,
  }));

  const buttonStyles = cx(
    'bsc-p-2 bsc-rounded',
    {
      'bsc-w-full': fullWidth,
      'bsc-bg-gray-3 bsc-text-gray-2': disabled,
      'bsc-bg-primary-1 bsc-text-white hover:bsc-bg-primary-2': buttonType === 'primary',
      'bsc-bg-info bsc-text-white': buttonType === 'info',
      'bsc-bg-success bsc-text-white': buttonType === 'success',
      'bsc-bg-warning bsc-text-white': buttonType === 'warning',
      'bsc-bg-error bsc-text-white': buttonType === 'error',
    },
    className
  );

  return (
    <button ref={buttonRef} type={type} onClick={onClick} disabled={disabled} form={form} className={buttonStyles}>
      {children}
    </button>
  );
};

const Button = forwardRef(ButtonComponent);

export { Button };
