import * as React from 'react';
import { Lineup } from '../../../../../models/lineup';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTheme } from '@mui/material/styles';
import { useGameboardContext } from '../useGameboardContext';
import { Box, Typography } from '@mui/material';
import { SurpriseSongPointValues } from '../../../../../constants/surpriseSongPointValues';
import { usePublicData } from '../../../../../services/usePublicData';
import { SurpriseSongPopover } from './SurpriseSongPopover';
import { Album } from '../../../../../constants/album';
import { PopoverWrapper } from './SurpriseSongsBox.styles';

export const SurpriseSongsBox: React.FC<{ lineup: Lineup }> = ({ lineup }) => {
  const { width } = useWindowSize();
  const theme = useTheme();
  const { checkSurpriseSongMatches } = useGameboardContext();
  const { concerts: allConcerts } = usePublicData();

  const { isGuitarAlbumMatch, isGuitarSongMatch, isPianoAlbumMatch, isPianoSongMatch } = checkSurpriseSongMatches(lineup);

  const getStyles = () => {
    const styles = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: 1,
      height: 250,
      overflowY: 'scroll',
    };

    if (width < 768) {
      return styles;
    } else {
      return {
        ...styles,
        border: `solid 1px ${theme.palette.primary.main}`,
        borderRadius: 1,
        padding: 1,
        height: 200,
      };
    }
  };

  const findAlbumAppearances = (album: Album) => {
    const appearances = allConcerts?.filter(c => c.guitarSong?.album === album || c.pianoSong?.album === album) || [];
    if (appearances.length) {
      return (
        <PopoverWrapper>
          <Typography variant={'body1'} gutterBottom>{`Taylor has played songs from ${album} ${appearances.length} times:`}</Typography>
          {appearances.map(c => (
            <Typography variant={'body2'}>{`${c.city} Night ${c.night} ${new Date(Number(c.startTime)).toLocaleDateString()}`}</Typography>
          ))}
        </PopoverWrapper>
      );
    } else {
      return (
        <PopoverWrapper>
          <Typography variant={'body1'}>{`Taylor has not played any songs from ${album} this tour`}</Typography>
        </PopoverWrapper>
      );
    }
  };

  const findSongAppearances = (song: string) => {
    const appearances = allConcerts?.filter(c => c.guitarSong?.name === song || c.pianoSong?.name === song) || [];
    if (appearances.length) {
      return (
        <PopoverWrapper>
          <Typography variant={'body1'} gutterBottom>{`Taylor has played ${song} ${appearances.length} times:`}</Typography>
          {appearances.map(c => (
            <Typography variant={'body2'}>{`${c.city} Night ${c.night} ${new Date(Number(c.startTime)).toLocaleDateString()}`}</Typography>
          ))}
        </PopoverWrapper>
      );
    } else {
      return (
        <PopoverWrapper>
          <Typography variant={'body1'}>{`Taylor has not played ${song} this tour.`}</Typography>
        </PopoverWrapper>
      );
    }
  };

  return (
    <Box sx={getStyles()}>
      <h5 style={{ marginTop: 0 }}>Surprise Songs</h5>
      <SurpriseSongPopover popOverContent={findAlbumAppearances(lineup.guitarAlbum)}>
        <b>{`Guitar Album: ${lineup.guitarAlbum}`}</b>
        <b style={{ color: isGuitarAlbumMatch ? 'limegreen' : 'grey' }}>{`${isGuitarAlbumMatch ? '+' : ''}${
          SurpriseSongPointValues.album
        }`}</b>
      </SurpriseSongPopover>
      <SurpriseSongPopover popOverContent={findSongAppearances(lineup.guitarSong.name)}>
        <b>{`Guitar Song: ${lineup.guitarSong.name}`}</b>
        <b style={{ color: isGuitarSongMatch ? 'limegreen' : 'grey' }}>{`${isGuitarSongMatch ? '+' : ''}${
          SurpriseSongPointValues.song
        }`}</b>
      </SurpriseSongPopover>
      <SurpriseSongPopover popOverContent={findAlbumAppearances(lineup.pianoAlbum)}>
        <b>{`Piano Album: ${lineup.pianoAlbum}`}</b>
        <b style={{ color: isPianoAlbumMatch ? 'limegreen' : 'grey' }}>{`${isPianoAlbumMatch ? '+' : ''}${
          SurpriseSongPointValues.album
        }`}</b>
      </SurpriseSongPopover>
      <SurpriseSongPopover popOverContent={findSongAppearances(lineup.pianoSong.name)}>
        <b>{`Piano Song: ${lineup.pianoSong.name}`}</b>
        <b style={{ color: isPianoSongMatch ? 'limegreen' : 'grey' }}>{`${isPianoSongMatch ? '+' : ''}${SurpriseSongPointValues.song}`}</b>
      </SurpriseSongPopover>
    </Box>
  );
};
