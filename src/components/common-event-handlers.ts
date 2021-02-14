export function bindDocumentClickListener(
  element: HTMLElement,
  callback: (isClickedWithin: boolean) => void,
  otherElements?: Array<HTMLElement>
) {
  const clickListener = (event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    const isVisible = element.style.display !== 'hidden';

    if (
      element &&
      isVisible &&
      !(element.isSameNode(targetElement) || element.contains(targetElement)) &&
      !isClickedInOtherElements(otherElements, targetElement)
    ) {
      callback(false);
    }

    callback(true);
  };

  const isClickedInOtherElements = (elements: Array<HTMLElement> | undefined, targetElement: HTMLElement) => {
    if (!elements) {
      return false;
    }

    for (let i = 0, length = elements.length; i < length; i++) {
      if (elements[i].isSameNode(targetElement) || elements[i].contains(targetElement)) {
        return true;
      }
    }

    return false;
  };

  document.addEventListener('mousedown', clickListener);

  return clickListener;
}

export function unbindDocumentClickListener(clickListener: (event: MouseEvent) => void) {
  document.removeEventListener('mousedown', clickListener);
}
