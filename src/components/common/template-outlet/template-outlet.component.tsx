import { TypeOrArray } from '@beesoft/common';
import React, { ReactNode } from 'react';

export type TemplateFunction<TF> = (props: TF, children?: TypeOrArray<ReactNode>) => React.JSX.Element;

export interface TemplateOutletProps<TP> {
  props: TP;
  template: TemplateFunction<TP>;
  children?: TypeOrArray<ReactNode>;
}

const TemplateOutlet = <T,>({ template, props, children }: TemplateOutletProps<T>) => {
  return template(props, children);
};

export default TemplateOutlet;
