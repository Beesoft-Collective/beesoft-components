import { useEffect, useState } from 'react';

export function useKeyDown(keyCode: string) {
  const [keyDown, setKeyDown] = useState(false);

  const downHandler = ({ key }) => {
    if (key === keyCode) {
      setKeyDown(true);
    }
  };
  const upHandler = ({ key }) => {
    if (key === keyCode) {
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
