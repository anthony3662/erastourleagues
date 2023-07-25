import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Outfit } from '../../models/outfit';
import { Concert } from '../../models/concert';
import { SurpriseSong } from '../../models/surpriseSong';
import { Box } from '@mui/material';
import { AddSurpriseSongs, AddSurpriseSongsProps } from './AddSurpriseSongs';
import { useRequest } from '../../utils/useRequest';
import {
  CloseConcertParams,
  CloseConcertResponse,
  ENDPOINTS,
  SaveSurpriseSongsParams,
  SaveSurpriseSongsResponse,
  UpdateOutfitsParams,
  UpdateOutfitsResponse,
} from '../../constants/endpoints';
import { AddOutfits, AddOutfitsProps } from './AddOutfits';
import { ROUTES } from '../../routes/constants';
import { LoadingButton } from '@mui/lab';

export const AddConcertResults: React.FC = () => {
  const navigate = useNavigate();
  const props: { outfits: Outfit[]; concert: Concert; surpriseSongs: SurpriseSong[] } = useLocation().state;
  const { concert: initialConcert, outfits, surpriseSongs } = props;

  const [concert, setConcert] = useState<Concert>(initialConcert);

  const {
    post: saveSurpriseSongs,
    isLoading: isSaveSongsLoading,
    data: concertAfterSavingSongs,
  } = useRequest<SaveSurpriseSongsResponse, SaveSurpriseSongsParams>();

  const {
    post: postOutfits,
    isLoading: isPostOutfitsLoading,
    data: concertAfterSavingOutfits,
  } = useRequest<UpdateOutfitsResponse, UpdateOutfitsParams>();

  const {
    post: closeConcert,
    isLoading: isCloseConcertLoading,
    data: closeConcertData,
  } = useRequest<CloseConcertResponse, CloseConcertParams>();

  useEffect(() => {
    if (concertAfterSavingSongs) {
      setConcert(concertAfterSavingSongs.updatedConcert);
    }
  }, [concertAfterSavingSongs]);

  useEffect(() => {
    if (concertAfterSavingOutfits) {
      setConcert(concertAfterSavingOutfits.updatedConcert);
    }
  }, [concertAfterSavingOutfits]);

  useEffect(() => {
    if (closeConcertData?.success) {
      window.location.reload();
    }
  }, [closeConcertData]);

  const addSurpriseSongsProps: AddSurpriseSongsProps = {
    concert,
    surpriseSongs,
    saveSurpriseSongs,
    isLoading: isSaveSongsLoading,
  };

  const addOutfitsProps: AddOutfitsProps = {
    concert,
    outfits,
    isLoading: isPostOutfitsLoading,
    postOutfits,
  };

  const handleCloseConcert = async () => {
    closeConcert({
      endpoint: ENDPOINTS.closeConcert,
      body: {
        concertId: concert.increasingId,
      },
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <h2>Add Concert Outcomes</h2>
      <h4>{`${new Date(Number(initialConcert.startTime)).toDateString()} ${new Date(
        Number(initialConcert.startTime),
      ).toLocaleTimeString()} ${initialConcert.city} Night ${initialConcert.night}`}</h4>
      <AddSurpriseSongs {...addSurpriseSongsProps} />
      <AddOutfits {...addOutfitsProps} />
      {concert.outfits.length > 10 ? (
        <LoadingButton sx={{ marginTop: 2 }} loading={isCloseConcertLoading} variant={'contained'} fullWidth onClick={handleCloseConcert}>
          Close Concert
        </LoadingButton>
      ) : null}
    </Box>
  );
};
