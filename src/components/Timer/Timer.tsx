import { useEffect, useState } from "react";
import { S_Counter } from "../Indicators/Indicators";
import { ReactComponent as Clock } from "../../assets/svg/clock.svg";

type TimerProps = {
  revealedOnce: boolean;
  isRunning: boolean;
};

export default function Timer({ revealedOnce, isRunning }: TimerProps) {
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
      {seconds} <Clock />
    </S_Counter>
  );
}
