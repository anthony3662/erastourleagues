import * as React from 'react';
import { useEffect, useState } from 'react';
import { League } from '../../../../models/league';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
} from '@mui/material';
import { MatchupTab } from './MatchupTab/MatchupTab';
import { TeamTab } from './TeamTab/TeamTab';
import { LeagueTab } from './LeagueTab/LeagueTab';
import { Wrapper } from './ActiveLeague.styles';
import { useGameboardContext } from './useGameboardContext';
import { TradesTab } from './TradesTab/TradesTab';
import { useWindowSize } from '@uidotdev/usehooks';

export const ActiveLeague: React.FC<{ league: League }> = ({ league }) => {
  const { width } = useWindowSize();
  const { isLoading, allLeagueConcerts, currentConcert, initializeBoard, activeTab, setActiveTab, selectedConcert, setSelectedConcert } =
    useGameboardContext();

  useEffect(() => {
    initializeBoard(league);
  }, []);

  if (isLoading || !selectedConcert) {
    return (
      <Backdrop sx={{ color: '#fff' }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  const handleTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSetConcert = (event: SelectChangeEvent) => {
    setSelectedConcert(Number(event.target.value));
  };

  const isCurrentConcertSelected = selectedConcert === currentConcert?.increasingId;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel id={'concert-select-label'}>Select Concert</InputLabel>
          <Select
            labelId={'concert-select-label'}
            id={'concert-select'}
            value={selectedConcert + ''}
            label={'Select Concert'}
            onChange={handleSetConcert}>
            {allLeagueConcerts!.map(concert => (
              <MenuItem value={concert.increasingId + ''}>{`${concert.city} ${new Date(
                Number(concert.startTime),
              ).toLocaleDateString()} Night ${concert.night}`}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {!isCurrentConcertSelected && currentConcert && league.firstConcert! <= currentConcert.increasingId ? (
          <Button fullWidth variant={'contained'} onClick={() => setSelectedConcert(currentConcert.increasingId)}>
            Go to Current/Next Concert
          </Button>
        ) : null}
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant={width < 576 ? 'fullWidth' : undefined} value={activeTab} onChange={handleTab} aria-label='basic tabs example'>
          <Tab label={'Matchup'} />
          <Tab label={'Team'} />
          <Tab label={'League'} />
          <Tab label={'Trades'} />
        </Tabs>
      </Box>
      <Wrapper>
        {activeTab === 0 ? <MatchupTab /> : null}
        {activeTab === 1 ? <TeamTab /> : null}
        {activeTab === 2 ? <LeagueTab /> : null}
        {activeTab === 3 ? <TradesTab /> : null}
      </Wrapper>
    </Box>
  );
};
