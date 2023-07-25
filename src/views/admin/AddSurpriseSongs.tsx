import * as React from 'react';
import { useState } from 'react';
import { Concert } from '../../models/concert';
import { SurpriseSong } from '../../models/surpriseSong';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SurpriseSongsPanel } from './AddSurpriseSongs.styles';
import { LoadingButton } from '@mui/lab';
import { ENDPOINTS, SaveSurpriseSongsParams, SaveSurpriseSongsResponse } from '../../constants/endpoints';
import { useRequest } from '../../utils/useRequest';
import { Album } from '../../constants/album';

export type AddSurpriseSongsProps = {
  concert: Concert;
  surpriseSongs: SurpriseSong[];
  saveSurpriseSongs: ReturnType<typeof useRequest<SaveSurpriseSongsResponse, SaveSurpriseSongsParams>>['post'];
  isLoading: boolean;
};

export const AddSurpriseSongs: React.FC<AddSurpriseSongsProps> = ({ concert, surpriseSongs, saveSurpriseSongs, isLoading }) => {
  const [guitarAlbum, setGuitarAlbum] = useState(concert.guitarSong?.album ?? 'none');
  const [guitarSongId, setGuitarSongId] = useState(concert.guitarSong?._id ?? 'none');
  const [pianoAlbum, setPianoAlbum] = useState(concert.pianoSong?.album ?? 'none');
  const [pianoSongId, setPianoSongId] = useState(concert.pianoSong?._id ?? 'none');

  const handleSaveSongs = async (guitarSongId: string, pianoSongId: string) => {
    const response = await saveSurpriseSongs({
      endpoint: ENDPOINTS.saveSurpriseSongs,
      body: {
        concertId: concert.increasingId,
        guitarSongId: guitarSongId === 'none' ? null : guitarSongId,
        pianoSongId: pianoSongId === 'none' ? null : pianoSongId,
      },
    });
  };

  const handleGuitarAlbumChange = (event: SelectChangeEvent) => {
    const guitarAlbum = event.target.value;
    setGuitarAlbum(guitarAlbum);
    setGuitarSongId(surpriseSongs.filter(song => song.album === guitarAlbum)[0]?._id || 'none');
  };

  const handleGuitarSongChange = (event: SelectChangeEvent) => {
    setGuitarSongId(event.target.value);
  };

  const handlePianoAlbumChange = (event: SelectChangeEvent) => {
    const pianoAlbum = event.target.value;
    setPianoAlbum(pianoAlbum);
    setPianoSongId(surpriseSongs.filter(song => song.album === pianoAlbum)[0]?._id || 'none');
  };

  const handlePianoSongChange = (event: SelectChangeEvent) => {
    setPianoSongId(event.target.value);
  };

  const getFilteredGuitarSongs = () => {
    if (guitarAlbum === 'none') {
      return [];
    }

    return surpriseSongs.filter(song => song.album === guitarAlbum);
  };

  const getFilteredPianoSongs = () => {
    if (pianoAlbum === 'none') {
      return [];
    }

    return surpriseSongs.filter(song => song.album === pianoAlbum);
  };

  const handleSubmit = () => {
    handleSaveSongs(guitarSongId, pianoSongId);
  };

  return (
    <SurpriseSongsPanel>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <FormControl sx={{ display: 'flex', flexGrow: 1 }}>
          <InputLabel id='guitar-album-label'>Guitar Surprise Album</InputLabel>
          <Select
            labelId={'guitar-album-label'}
            id={'guitar-album-select'}
            value={guitarAlbum}
            label={'Guitar Surprise Album'}
            onChange={handleGuitarAlbumChange}>
            <MenuItem value={'none'}>Waiting for song</MenuItem>
            <MenuItem value={Album.debut}>Debut</MenuItem>
            <MenuItem value={Album.fearless}>Fearless</MenuItem>
            <MenuItem value={Album.speakNow}>Speak Now</MenuItem>
            <MenuItem value={Album.red}>Red</MenuItem>
            <MenuItem value={Album.eightyNine}>1989</MenuItem>
            <MenuItem value={Album.reputation}>reputation</MenuItem>
            <MenuItem value={Album.lover}>Lover</MenuItem>
            <MenuItem value={Album.folklore}>folklore</MenuItem>
            <MenuItem value={Album.evermore}>evermore</MenuItem>
            <MenuItem value={Album.midnights}>Midnights</MenuItem>
            <MenuItem value={Album.other}>Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ display: 'flex', flexGrow: 1 }}>
          <InputLabel id={'guitar-song-label'}>Guitar Surprise Song</InputLabel>
          <Select
            labelId={'guitar-song-label'}
            id={'guitar-song-select'}
            value={guitarSongId}
            label={'Guitar Surprise Song'}
            onChange={handleGuitarSongChange}>
            {guitarAlbum === 'none' ? null : getFilteredGuitarSongs().map(song => <MenuItem value={song._id}>{song.name}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <FormControl sx={{ display: 'flex', flexGrow: 1 }}>
          <InputLabel id='piano-album-label'>Piano Surprise Album</InputLabel>
          <Select
            labelId={'piano-album-label'}
            id={'piano-album-select'}
            value={pianoAlbum}
            label={'Piano Surprise Album'}
            onChange={handlePianoAlbumChange}>
            <MenuItem value={'none'}>Waiting for song</MenuItem>
            <MenuItem value={'Debut'}>Debut</MenuItem>
            <MenuItem value={'Fearless'}>Fearless</MenuItem>
            <MenuItem value={'Speak Now'}>Speak Now</MenuItem>
            <MenuItem value={'Red'}>Red</MenuItem>
            <MenuItem value={'1989'}>1989</MenuItem>
            <MenuItem value={'reputation'}>Reputation</MenuItem>
            <MenuItem value={'Lover'}>Lover</MenuItem>
            <MenuItem value={'folklore'}>folklore</MenuItem>
            <MenuItem value={'evermore'}>evermore</MenuItem>
            <MenuItem value={'Midnights'}>Midnights</MenuItem>
            <MenuItem value={'Other'}>Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ display: 'flex', flexGrow: 1 }}>
          <InputLabel id={'piano-song-label'}>Piano Surprise Song</InputLabel>
          <Select
            labelId={'piano-song-label'}
            id={'piano-song-select'}
            value={pianoSongId}
            label={'Piano Surprise Song'}
            onChange={handlePianoSongChange}>
            {pianoAlbum === 'none' ? null : getFilteredPianoSongs().map(song => <MenuItem value={song._id}>{song.name}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <LoadingButton loading={isLoading} variant={'contained'} onClick={handleSubmit}>
        Save Songs
      </LoadingButton>
    </SurpriseSongsPanel>
  );
};
