/**
 * Wraps the `setTimeout` function and sets a 1 millisecond timeout; this is done since some items are not always
 * finished by the next render cycle (mostly in HTML Canvas).
 * @param callback - The function to call when the timeout is completed.
 * @returns A NodeJs.Timeout that can be used to stop the timeout from executing with `clearTimeout`.
 */
const delayCallback = (callback: () => void) => {
  return setTimeout(callback, 1);
};

export { delayCallback };
