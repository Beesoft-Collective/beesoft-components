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
