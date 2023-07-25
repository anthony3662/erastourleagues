import * as React from 'react';
import groupBy from 'lodash/groupBy';
import { usePublicData } from '../../services/usePublicData';
import { Wrapper } from './SurpriseSongsHome.styles';
import { useState } from 'react';
import { Album } from '../../constants/album';
import {
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { SurpriseSong } from '../../models/surpriseSong';

export const SurpriseSongsHome: React.FC = () => {
  const { surpriseSongs, concerts } = usePublicData();
  const [album, setAlbum] = useState<Album>(Album.debut);

  if (!surpriseSongs || !concerts) {
    return <></>;
  }
  const handleSetAlbum = (event: SelectChangeEvent) => {
    setAlbum(event.target.value as Album);
  };

  const getFilteredSongs = () => {
    return surpriseSongs.filter(song => song.album === album);
  };

  const getSongComponent = (song: SurpriseSong) => {
    const matchingConcerts = concerts.filter(concert => concert.guitarSong?.name === song.name || concert.pianoSong?.name === song.name);
    const songTaken = matchingConcerts.length;
    return (
      <>
        <ListItem>
          <ListItemText sx={{ color: songTaken ? 'maroon' : 'primary.main', textDecoration: songTaken ? 'line-through' : undefined }}>
            {song.name}
          </ListItemText>
        </ListItem>
        {matchingConcerts.map(c => (
          <ListItem sx={{ pl: 4 }}>{`${c.city} ${new Date(Number(c.startTime)).toLocaleDateString()} Night ${c.night}`}</ListItem>
        ))}
        <Divider variant={'middle'} />
      </>
    );
  };

  return (
    <Wrapper>
      <Typography variant={'h4'} sx={{ color: 'primary.dark', marginBottom: 3 }}>
        Surprise Songs
      </Typography>
      <FormControl fullWidth>
        <InputLabel id={'album-select-label'}>Select Album</InputLabel>
        <Select labelId={'album-select-label'} id={'album-select'} value={album} label={'Select Album'} onChange={handleSetAlbum}>
          {Object.values(Album).map(value => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <List sx={{ width: '100%', marginTop: 3 }}>{getFilteredSongs().map(song => getSongComponent(song))}</List>
    </Wrapper>
  );
};
