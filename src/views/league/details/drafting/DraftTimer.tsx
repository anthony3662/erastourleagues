import React, { useEffect, useState } from 'react';
import { Wrapper } from './Timer.styles';
import { OutfitHeader, OutfitTitle, TimerCell } from './OutfitCell.styles';

export const DraftTimer: React.FC<{
  onClick?: () => void;
  appearance: 'standard' | 'cell';
  title?: string;
  seconds: number;
  setTimer: (time: number) => void;
}> = ({ onClick, appearance, title, seconds, setTimer }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds > 0 ? Math.floor(seconds) : 0);

  useEffect(() => {
    if (remainingSeconds > 0) {
      const timer = setInterval(() => {
        setRemainingSeconds(prevSeconds => {
          setTimer(prevSeconds - 1);
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingSeconds]);

  if (appearance === 'standard') {
    return (
      <Wrapper>
        <h2>{title}</h2>
        <h3>{remainingSeconds} seconds</h3>
      </Wrapper>
    );
  }

  return (
    <TimerCell onClick={() => onClick?.()}>
      <OutfitHeader>{title}</OutfitHeader>
      <OutfitTitle>{remainingSeconds} sec</OutfitTitle>
    </TimerCell>
  );
};
