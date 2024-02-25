import { useEffect, useState } from 'react';
import { useBeeSoftContext } from './use-beesoft-context.ts';

const useShouldAnimate = (animationProperty?: boolean) => {
  const [animationState, setAnimationState] = useState(true);

  const beeSoftContext = useBeeSoftContext();

  useEffect(() => {
    if (animationProperty !== undefined) {
      setAnimationState(animationProperty);
    } else if (beeSoftContext && beeSoftContext.useAnimations !== undefined) {
      setAnimationState(beeSoftContext.useAnimations);
    }
  }, [beeSoftContext, animationProperty]);

  return animationState;
};

export { useShouldAnimate };
