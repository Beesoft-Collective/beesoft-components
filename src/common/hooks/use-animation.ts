import { useEffect, useState } from 'react';
import { useBeeSoftContext } from './use-beesoft-context.ts';

const useShouldAnimate = (animationProperty?: boolean) => {
  const [animationState, setAnimationState] = useState(true);

  const beeSoftContext = useBeeSoftContext();

  useEffect(() => {
    if (beeSoftContext && beeSoftContext.useAnimations !== undefined) {
      setAnimationState(beeSoftContext.useAnimations);
    } else if (animationProperty !== undefined) {
      setAnimationState(animationProperty);
    }
  }, [beeSoftContext, animationProperty]);

  return animationState;
};

export { useShouldAnimate };
