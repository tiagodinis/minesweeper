import { useGameSession } from "../../stores/gameSessionStore";
import { InteractionState } from "../../utils/gameConstants";
import { useEffect, useState } from "react";
import { S_Counter } from "../Indicators/Indicators";
import { ReactComponent as ClockSVG } from "../../assets/svg/clock.svg";

export default function Timer() {
  const { interactionState, revealedOnce } = useGameSession();
  const isRunning =
    interactionState !== InteractionState.Victory &&
    interactionState !== InteractionState.GameOver;
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && revealedOnce)
      interval = setInterval(
        () => setSeconds((prev: number) => prev + 1),
        1000
      );
    else if (isRunning) setSeconds(0);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [revealedOnce, isRunning, setSeconds]);

  return (
    <S_Counter wrapAvatar>
      {seconds} <ClockSVG />
    </S_Counter>
  );
}
