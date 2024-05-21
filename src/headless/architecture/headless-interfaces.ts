import React from 'react';

export type WithHeadlessChildRenderProp<T> = T & {
  children: (props: T) => React.JSX.Element;
};
