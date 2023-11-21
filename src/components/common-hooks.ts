import { useEffect, useState } from 'react';

export function useKeyDown(keyCode: string | Array<string>) {
  const [keyDown, setKeyDown] = useState(false);
  const keyCodes = typeof keyCode === 'string' ? [keyCode] : keyCode;

  const downHandler = ({ key }: KeyboardEvent) => {
    if (keyCodes.includes(key)) {
      setKeyDown(true);
    }
  };
  const upHandler = ({ key }: KeyboardEvent) => {
    if (keyCodes.includes(key)) {
      setKeyDown(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyDown;
}
