export function getElementByClassNameRecursive(element: Element, className: string): Element {
  if (typeof element.className === 'string' && element.className.includes(className)) {
    return element;
  }

  return element.parentElement ? getElementByClassNameRecursive(element.parentElement, className) : element;
}
