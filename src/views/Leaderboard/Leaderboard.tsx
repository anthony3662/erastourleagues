import * as React from 'react';
import { useEffect, useState } from 'react';
import { Wrapper } from './Leaderboard.styles';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { usePublicData } from '../../services/usePublicData';
import { Winner } from './Winner';

export const Leaderboard = () => {
  const { leaderboards, concerts } = usePublicData();
  const [selectedConcertId, setSelectedConcertId] = useState<number | undefined>();

  useEffect(() => {
    if (leaderboards) {
      const latestBoard = leaderboards[leaderboards.length - 1];
      setSelectedConcertId(latestBoard.concertId);
    }
  }, [leaderboards]);

  if (!leaderboards || !concerts || !selectedConcertId) {
    return <></>;
  }

  const selectedLeaderboard = leaderboards.find(l => l.concertId === selectedConcertId)!;

  return (
    <Wrapper>
      <FormControl fullWidth>
        <InputLabel id={'leaderboard-select-label'}>Select Leaderboard</InputLabel>
        <Select
          labelId={'leaderboard-select-label'}
          id={'leaderboard-select'}
          value={selectedConcertId + ''}
          label={'Select Leaderboard'}
          onChange={event => setSelectedConcertId(Number(event.target.value))}>
          {leaderboards.map(l => {
            const matchingConcert = concerts.find(c => c.increasingId === l.concertId)!;
            return (
              <MenuItem value={l.concertId + ''}>{`${matchingConcert.city} Night ${matchingConcert.night} ${new Date(
                Number(matchingConcert.startTime),
              ).toLocaleDateString()}`}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {selectedLeaderboard.winners.map(lineup => (
        <Winner key={lineup._id} lineup={lineup} />
      ))}
    </Wrapper>
  );
};
