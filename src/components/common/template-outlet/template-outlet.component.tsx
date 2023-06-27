import React from 'react';

export type TemplateFunction<TF> = (props: TF, children?: React.ReactNode | React.ReactNodeArray) => JSX.Element;

export interface TemplateOutletProps<TP> {
  props: TP;
  template: TemplateFunction<TP>;
  children?: React.ReactNode | React.ReactNodeArray;
}

const TemplateOutlet = <T,>({ template, props, children }: TemplateOutletProps<T>) => {
  return template(props, children);
};

export default TemplateOutlet;
