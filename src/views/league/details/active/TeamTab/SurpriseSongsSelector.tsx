import * as React from 'react';
import { Panel, SurpriseHeaderRow } from './TeamTab.styles';
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Album } from '../../../../../constants/album';
import { useGameboardContext } from '../useGameboardContext';
import { Lineup } from '../../../../../models/lineup';
import { useAuthentication } from '../../../../../services/useAuthentication';
import { usePublicData } from '../../../../../services/usePublicData';

export const SurpriseSongsSelector: React.FC = () => {
  const { user } = useAuthentication();
  const { transactionsLocked, surpriseSongs } = usePublicData();
  const { getSelectedConcertObject, getSelectedConcertLineups, chooseSurpriseSong, isCurrentConcertSelected } = useGameboardContext();
  const selectedConcert = getSelectedConcertObject();
  const lineups = getSelectedConcertLineups();

  if (!selectedConcert || !lineups || !surpriseSongs) {
    return <></>; //parent takes care of loading UI
  }

  const myLineup: Lineup = lineups.find(l => l.username === user!.username)!;
  const canSwap = isCurrentConcertSelected && !transactionsLocked;
  const songOptions = surpriseSongs.map(song => song.name);

  return (
    <Panel>
      <SurpriseHeaderRow>
        <Typography variant={'h6'} sx={{ color: 'primary.dark' }}>
          Surprise Songs
        </Typography>
        <Tooltip
          enterTouchDelay={0}
          title={
            'Tip: Your album and song choices are not required to match. Hedging you bets is allowed. For example, you could pick Red for the guitar album and New Romantics for the guitar song. 5 points for each correct album pick, 5 points for each correct song pick.'
          }>
          <InfoIcon sx={{ color: 'primary.main', cursor: 'pointer' }} />
        </Tooltip>
      </SurpriseHeaderRow>
      <FormControl fullWidth>
        <InputLabel id={'guitar-album-select-label'}>Guitar Album</InputLabel>
        <Select
          className={selectedConcert.guitarSong?.album === myLineup.guitarAlbum ? 'winner' : ''}
          // @ts-ignore
          disabled={!canSwap}
          labelId={'guitar-album-select-label'}
          id={'guitar-album-select'}
          value={myLineup.guitarAlbum || ''}
          label={'Guitar Album'}
          onChange={event => chooseSurpriseSong({ guitarAlbum: event.target.value as Album })}>
          {Object.values(Album).map(v => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Autocomplete
        className={selectedConcert.guitarSong?.name === myLineup.guitarSong.name ? 'winner' : ''}
        disabled={!canSwap}
        value={myLineup.guitarSong.name || ''}
        onChange={(event, newValue) => newValue && chooseSurpriseSong({ guitarSongId: surpriseSongs?.find(s => s.name === newValue)?._id })}
        id={'guitar-song-input'}
        options={songOptions}
        fullWidth
        renderInput={params => <TextField {...params} label={'Guitar Song'} />}
      />
      <FormControl fullWidth>
        <InputLabel id={'piano-album-select-label'}>Piano Album</InputLabel>
        <Select
          className={selectedConcert.pianoSong?.album === myLineup.pianoAlbum ? 'winner' : ''}
          disabled={!canSwap}
          labelId={'piano-album-select-label'}
          id={'piano-album-select'}
          value={myLineup.pianoAlbum || ''}
          label={'Piano Album'}
          onChange={event => chooseSurpriseSong({ pianoAlbum: event.target.value as Album })}>
          {Object.values(Album).map(v => (
            <MenuItem value={v}>{v}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Autocomplete
        className={selectedConcert.pianoSong?.name === myLineup.pianoSong.name ? 'winner' : ''}
        disabled={!canSwap}
        value={myLineup.pianoSong.name || ''}
        onChange={(event, newValue) => newValue && chooseSurpriseSong({ pianoSongId: surpriseSongs?.find(s => s.name === newValue)?._id })}
        id={'piano-song-input'}
        options={songOptions}
        fullWidth
        renderInput={params => <TextField {...params} label={'Piano Song'} />}
      />
    </Panel>
  );
};
