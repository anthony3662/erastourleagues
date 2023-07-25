import * as React from 'react';
import { MatchupRow, MatchupRowProps } from './MatchupRow';
import { MatchupList } from './LeagueTab.styles';
import { Backdrop, CircularProgress, Divider, Typography } from '@mui/material';

import { useGameboardContext } from '../useGameboardContext';
import { Standings } from './Standings';

export const LeagueTab: React.FC = () => {
  const { league, isLineupsLoading, getSelectedConcertLineups, getSelectedConcertMatchups, users, getMatchups } = useGameboardContext();

  const lineups = getSelectedConcertLineups();
  const matchups = getSelectedConcertMatchups();

  if (isLineupsLoading || !lineups || !matchups || !users) {
    // if no lineups or matchups, most likely fetch failed in context provider
    return (
      <Backdrop sx={{ color: '#fff' }} open={isLineupsLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  const [matchupOne, matchupTwo] = getMatchups()!;

  return (
    <MatchupList>
      <Typography variant={'h5'} sx={{ color: 'primary.dark' }}>
        {league?.name}
      </Typography>
      <MatchupRow matchup={matchupOne} />
      <Divider variant='fullWidth' />
      <MatchupRow matchup={matchupTwo} />
      <Standings />
    </MatchupList>
  );
};
