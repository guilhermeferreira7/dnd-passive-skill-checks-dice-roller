import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ROLL_ANIMATION_DURATION = 1000;

export type RollResult = {
  name: string;
  dice: number;
  mod: number;
  total: number;
};

type UseDiceAnimationOptions = {
  rollResults: RollResult[];
  setDisplayResults: Dispatch<SetStateAction<RollResult[]>>;
};

export function useDiceAnimation({
  rollResults,
  setDisplayResults,
}: UseDiceAnimationOptions) {
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRolling) {
      interval = setInterval(() => {
        setDisplayResults((prev) =>
          prev.map((res) => ({
            ...res,
            dice: Math.floor(Math.random() * 20) + 1,
            total: 0,
          })),
        );
      }, 80);

      setTimeout(() => {
        setIsRolling(false);
        setDisplayResults(rollResults);
      }, ROLL_ANIMATION_DURATION);
    }

    return () => clearInterval(interval);
  }, [isRolling, rollResults]);

  return {
    isRolling,
    setIsRolling,
  };
}
