export function getElementByClassNameRecursive(element: Element, className: string): Element {
  if (typeof element.className === 'string' && element.className.includes(className)) {
    return element;
  }

  return element.parentElement ? getElementByClassNameRecursive(element.parentElement, className) : element;
}

export function getBrowserLanguage() {
  return window.navigator.languages ? window.navigator.languages[0] : window.navigator.language;
}

export function padNumber(value: number, padCount: number, padCharacter: string) {
  const missingLength = padCount - value.toString().length;
  let padString = '';
  for (let i = 0; i < missingLength; i++) {
    padString += padCharacter;
  }

  return padString + value.toString();
}

export function generateNumberArray<T>(
  startingNumber: number,
  endingNumber: number,
  convertFunction?: (value: number) => T
) {
  const numberArray: Array<T> = [];
  for (let current = startingNumber; current <= endingNumber; current++) {
    numberArray.push(convertFunction ? convertFunction(current) : ((current as unknown) as T));
  }

  return numberArray;
}

export function isEventWithinTarget(event: Event, target: HTMLElement) {
  const testElement = event.target as HTMLElement;
  return testElement ? isElementWithinTarget(testElement, target) : false;
}

export function isElementWithinTarget(element: HTMLElement, target: HTMLElement) {
  return element.isSameNode(target) || element.contains(target);
}

export function elementHasAllStyles(element: HTMLElement, styles: Record<string, string | number>) {
  const styleEntries = Object.entries(styles);
  const elementStyles = getComputedStyle(element);
  for (let i = 0, length = styleEntries.length; i < length; i++) {
    const [style, value] = styleEntries[i];

    if (typeof value === 'string' && value.indexOf(',') > -1) {
      const values = value.split(',').map((item) => item.trim());
      if (!values.includes(elementStyles[style])) {
        return false;
      }
    } else {
      if (elementStyles[style] !== value) {
        return false;
      }
    }
  }

  return true;
}

export function elementHasAnyStyle(element: HTMLElement, styles: Record<string, string | number>) {
  const styleEntries = Object.entries(styles);
  const elementStyles = getComputedStyle(element);
  for (let i = 0, length = styleEntries.length; i < length; i++) {
    const [style, value] = styleEntries[i];

    if (typeof value === 'string' && value.indexOf(',') > -1) {
      const values = value.split(',').map((item) => item.trim());
      if (values.includes(elementStyles[style])) {
        return true;
      }
    } else {
      if (elementStyles[style] === value) {
        return true;
      }
    }
  }

  return false;
}

export function getElementByCssStylesRecursive(
  element: HTMLElement,
  styles: Record<string, string | number>,
  matchAllStyles = false
) {
  if (matchAllStyles && elementHasAllStyles(element, styles)) {
    return element;
  } else if (!matchAllStyles && elementHasAnyStyle(element, styles)) {
    return element;
  }

  return element.parentElement ? getElementByCssStylesRecursive(element.parentElement, styles) : element;
}
