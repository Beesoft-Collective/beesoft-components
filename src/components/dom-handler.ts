export enum AlignmentPosition {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight
}

export class DomHandler {
  public static positionToTarget(target: HTMLElement, position: AlignmentPosition = AlignmentPosition.BottomLeft) {
    const targetRectangle = target.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case AlignmentPosition.BottomLeft:
        top = targetRectangle.top + targetRectangle.height;
        left = targetRectangle.left;
        break;
      case AlignmentPosition.TopLeft:
        top = targetRectangle.top;
        left = targetRectangle.left;
        break;
      case AlignmentPosition.BottomRight:
        top = targetRectangle.top + targetRectangle.height;
        left = targetRectangle.left + targetRectangle.width;
        break;
      case AlignmentPosition.TopRight:
        top = targetRectangle.top;
        left = targetRectangle.left + targetRectangle.width;
    }

    return {
      top,
      left,
    };
  }
}