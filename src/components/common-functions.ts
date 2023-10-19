import { IToString } from './common-interfaces';

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
    numberArray.push(convertFunction ? convertFunction(current) : forceAssert<T>(current));
  }

  return numberArray;
}

export function isEventOutsideTarget(event: Event, target: HTMLElement) {
  const eventElement = event.target as HTMLElement;

  if (eventElement) {
    return !target.isSameNode(eventElement) && !target.contains(eventElement);
  }

  return false;
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

export function getAllElementStyleValuesRecursive(
  element: HTMLElement,
  style: string,
  action: (styleValue: string) => boolean,
  currentValues: Array<string> = []
): Array<string> {
  const elementStyles = getComputedStyle(element);
  if (elementStyles[style] && action(elementStyles[style])) {
    currentValues.push(elementStyles[style]);
  }

  return element.parentElement
    ? getAllElementStyleValuesRecursive(element.parentElement, style, action, currentValues)
    : currentValues;
}

/**
 * Searches the entire DOM to find all elements containing a particular style.
 *
 * WARNING: This uses the query selector "body *", when used on a page with a lot of markup this can perform poorly.
 * @param {string} style - The CSS style property to search for.
 * @param {(styleValue: string) => boolean} action - A function passed by the caller to determine if the style should be in the results.
 * @returns {Array<string>} Returns all acceptable values
 */
export function getAllElementStyleValues(style: string, action: (styleValue: string) => boolean): Array<string> {
  const allElements = Array.from(document.querySelectorAll('body *'));
  const foundStyles: Array<string> = [];

  for (let i = allElements.length; i-- !== 0; ) {
    const elementStyles = getComputedStyle(allElements[i]);
    if (elementStyles[style] && action(elementStyles[style])) {
      foundStyles.push(elementStyles[style]);
    }
  }

  return foundStyles;
}

export function isObject(object: unknown): object is Record<string, unknown> {
  return typeof object === 'object' && object !== null;
}

export function isPrimitive(item: unknown): item is string | number | Date | boolean | bigint {
  return (
    typeof item !== 'undefined' &&
    (typeof item === 'string' ||
      typeof item === 'number' ||
      typeof item === 'boolean' ||
      typeof item === 'bigint' ||
      item instanceof Date)
  );
}

export function containsToString(object: unknown): object is IToString {
  return (isObject(object) || isPrimitive(object)) && object.hasOwnProperty('toString');
}

/**
 * Performs an assertion from one type to any other type.
 * @param value - The initial type to convert.
 * @returns {T} - The type to convert to.
 */
export function forceAssert<T>(value: unknown): T {
  return value as T;
}

export function applyBeeSoftTheme(theme: Record<string, unknown>) {
  const root = document.documentElement;
  Object.keys(theme).forEach((cssVar) => {
    root.style.setProperty(cssVar, theme[cssVar] as string);
  });
}

export function createBeeSoftTheme(
  primary1: string,
  primary2: string,
  primary3: string,
  primary4: string,
  primary5: string,
  gray1: string,
  gray2: string,
  gray3: string,
  gray4: string,
  gray5: string,
  monoDark1: string,
  monoDark2: string,
  monoDark3: string,
  monoLight1: string,
  monoLight2: string,
  monoLight3: string,
  info = '#2e7ff8',
  success = '#53ae0c',
  warning = '#ff6914',
  error = '#f01616'
) {
  return {
    '--theme-bsc-primary-1': primary1,
    '--theme-bsc-primary-2': primary2,
    '--theme-bsc-primary-3': primary3,
    '--theme-bsc-primary-4': primary4,
    '--theme-bsc-primary-5': primary5,
    '--theme-bsc-gray-1': gray1,
    '--theme-bsc-gray-2': gray2,
    '--theme-bsc-gray-3': gray3,
    '--theme-bsc-gray-4': gray4,
    '--theme-bsc-gray-5': gray5,
    '--theme-bsc-mono-dark-1': monoDark1,
    '--theme-bsc-mono-dark-2': monoDark2,
    '--theme-bsc-mono-dark-3': monoDark3,
    '--theme-bsc-mono-light-1': monoLight1,
    '--theme-bsc-mono-light-2': monoLight2,
    '--theme-bsc-mono-light-3': monoLight3,
    '--theme-bsc-info': info,
    '--theme-bsc-success': success,
    '--theme-bsc-warning': warning,
    '--theme-bsc-error': error,
  };
}
