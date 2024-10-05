import { HeadlessFieldProps } from './headless-field.props.ts';

const HeadlessField = ({ id, name, value, type, checked, readOnly, className }: HeadlessFieldProps) => {
  return (
    <input
      id={id}
      name={name}
      value={value as string | number}
      type={type}
      checked={checked}
      // this is needed to resolve errors when a component is used in a form library like hook form
      onChange={() => {}}
      readOnly={readOnly}
      disabled={readOnly}
      className={className}
    />
  );
};

export { HeadlessField };
