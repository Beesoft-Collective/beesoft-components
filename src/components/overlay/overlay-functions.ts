import React from 'react';

export function getTargetElement(target: React.MouseEvent<Element, MouseEvent> | HTMLElement | Element) {
  return (
    (target as React.MouseEvent<Element, MouseEvent>).target
      ? (target as React.MouseEvent<Element, MouseEvent>).target
      : target
  ) as HTMLElement;
}
