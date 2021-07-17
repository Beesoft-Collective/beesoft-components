import { BehaviorSubject } from 'rxjs';

export default class ResizeObserverService {
  private readonly hasResizeObserver: boolean;
  private observer: ResizeObserver | MutationObserver;
  private entrySubject = new BehaviorSubject<ClientRect | DOMRect>({
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  private config: MutationObserverInit = {
    attributeFilter: ['style'],
    attributes: true,
    subtree: true,
  };

  constructor(private target: Element | SVGElement) {
    this.hasResizeObserver = !!ResizeObserver;
    this.observer = this.hasResizeObserver
      ? new ResizeObserver(this.resizeObserverCallback)
      : new MutationObserver(this.mutationObserverCallback);
    console.log('entry subject', this.entrySubject);
  }

  public observe() {
    if (this.hasResizeObserver) {
      this.observer.observe(this.target);
    } else {
      this.observer.observe(this.target, this.config);
    }
  }

  public unobserve(target: Element | SVGElement) {
    if (this.hasResizeObserver) {
      (this.observer as ResizeObserver).unobserve(target);
    } else {
      this.observer.disconnect();
    }
  }

  public disconnect() {
    this.observer.disconnect();
  }

  public getEntries() {
    return this.entrySubject.asObservable();
  }

  private resizeObserverCallback(entries: Array<ResizeObserverEntry>) {
    this.entrySubject.next(entries[entries.length - 1].contentRect);
  }

  private mutationObserverCallback(entries: Array<MutationRecord>) {
    const possibleEntries = entries.filter((entry) => this.target.contains(entry.target));
    const mutationEntry = possibleEntries[possibleEntries.length - 1].target as HTMLElement;
    this.entrySubject.next({
      top: mutationEntry.offsetTop,
      left: mutationEntry.offsetLeft,
      width: mutationEntry.offsetWidth,
      height: mutationEntry.offsetHeight,
      bottom: 0,
      right: 0,
    });
  }
}
