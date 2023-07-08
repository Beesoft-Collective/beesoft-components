import { Subscriber } from 'rxjs';

/**
 * Used to send data back to a requesting component. This class protects the user from the inner workings of the
 * library's data sending feature.
 */
export class DataSender<T> {
  constructor(private subscriber: Subscriber<T>) {}

  /**
   * Sends data to the requesting component.
   * @param {T} value - The data requested.
   */
  public sendData(value?: T) {
    this.subscriber.next(value);
  }

  /**
   * Closes the data sender. This will stop any new data from being sent.
   */
  public closeDataStream() {
    this.subscriber.complete();
  }
}
