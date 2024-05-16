import { HeadlessFieldProps } from './headless-field.props.ts';

const HeadlessField = ({ id, name, value, type, readOnly, className }: HeadlessFieldProps) => {
  return (
    <input
      id={id}
      name={name}
      value={value as string | number}
      type={type}
      readOnly={readOnly}
      disabled={readOnly}
      className={className}
    />
  );
};

export { HeadlessField };
