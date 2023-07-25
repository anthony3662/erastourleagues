import * as React from 'react';
import { Concert } from '../../models/concert';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from '@mui/material';
import { ConcertDialogImage } from './ConcertsHome.styles';
import { useWindowSize } from '@uidotdev/usehooks';
import { usePublicData } from '../../services/usePublicData';

type ConcertDialogProps = {
  onClose: () => void;
  openConcert: Concert | null;
};
export const ConcertDialog: React.FC<ConcertDialogProps> = ({ onClose, openConcert }) => {
  const { width } = useWindowSize();
  const { currentConcert } = usePublicData();

  // this ensures we'll get live polled updates
  const concert = openConcert?._id === currentConcert?._id ? currentConcert : openConcert;

  if (!concert) {
    return <></>;
  }

  return (
    <Dialog fullWidth maxWidth={'md'} open={Boolean(concert)} onClose={onClose}>
      <DialogTitle sx={{ color: 'primary.main' }}>
        {`${concert?.city} Night ${concert?.night} ${new Date(Number(concert?.startTime)).toLocaleString()}`}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant={'h6'} gutterBottom>{`Venue - ${concert?.venue}, ${concert?.region.toUpperCase()}`}</Typography>
        {concert?.guitarSong ? (
          <Typography variant={'body1'}>{`Guitar Surprise Song - ${concert.guitarSong.name}, ${concert.guitarSong.album}`}</Typography>
        ) : null}
        {concert?.pianoSong ? (
          <Typography variant={'body1'}>{`Piano Surprise Song - ${concert.pianoSong.name}, ${concert.pianoSong.album}`}</Typography>
        ) : null}
        <ConcertDialogImage src={concert?.image} />
        {concert?.outfits.length ? (
          <>
            <Typography sx={{ alignSelf: 'center', marginTop: 2, color: 'primary.dark' }} variant={'h6'} gutterBottom>
              Outfits
            </Typography>
            <ImageList
              sx={{ alignSelf: 'center', width: width >= 600 ? 500 : '100%', overflowY: 'unset' }}
              cols={width >= 600 ? 3 : 2}
              rowHeight={width >= 600 ? 164 : (width - 116) / 2}>
              {concert.outfits.map(outfit => (
                <ImageListItem key={outfit._id}>
                  <img style={{ height: '100%' }} src={`${outfit.image}`} srcSet={`${outfit.image} 2x`} alt={outfit.name} />
                  <ImageListItemBar title={outfit.name} subtitle={outfit.category} />
                </ImageListItem>
              ))}
            </ImageList>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
