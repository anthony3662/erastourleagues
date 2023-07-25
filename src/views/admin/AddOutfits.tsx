import * as React from 'react';
import { Concert } from '../../models/concert';
import { Outfit } from '../../models/outfit';
import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { OutfitsList } from './AddOutfits.styles';
import { useRequest } from '../../utils/useRequest';
import { ENDPOINTS, UpdateOutfitsParams, UpdateOutfitsResponse } from '../../constants/endpoints';

export type AddOutfitsProps = {
  concert: Concert;
  outfits: Outfit[];
  isLoading: boolean;
  postOutfits: ReturnType<typeof useRequest<UpdateOutfitsResponse, UpdateOutfitsParams>>['post'];
};

export const AddOutfits: React.FC<AddOutfitsProps> = ({ concert, outfits, isLoading, postOutfits }) => {
  const isOutfitAdded = (outfit: Outfit) => {
    return Boolean(concert.outfits.some(chosenOutfit => chosenOutfit._id === outfit._id));
  };

  const handleToggleOutfit = async (outfitId: string, action: 'add' | 'remove') => {
    const existingOutfitIds = concert.outfits.map(outfitObj => outfitObj._id);

    let updatedOutfitIds;
    if (action === 'remove') {
      updatedOutfitIds = existingOutfitIds.filter(id => id !== outfitId);
    } else {
      updatedOutfitIds = Array.from(new Set([...existingOutfitIds, outfitId])); // prevents duplicates
    }

    const response = await postOutfits({
      endpoint: ENDPOINTS.updateOutfits,
      body: {
        concertId: concert.increasingId,
        outfitIds: updatedOutfitIds,
      },
    });
  };

  return (
    <div>
      <OutfitsList>
        {outfits.map(outfit => {
          const didOutfitAppear = isOutfitAdded(outfit);
          return (
            <Card sx={{ width: 300 }}>
              <CardMedia sx={{ height: 300, objectFit: 'contain' }} image={outfit.image} title={outfit.name} />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  {outfit.category}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {outfit.name}
                </Typography>
              </CardContent>
              <CardActions>
                <LoadingButton
                  color={didOutfitAppear ? 'error' : 'success'}
                  loading={isLoading}
                  variant={'contained'}
                  onClick={() => handleToggleOutfit(outfit._id, didOutfitAppear ? 'remove' : 'add')}>
                  {didOutfitAppear ? 'Remove' : 'Add'}
                </LoadingButton>
              </CardActions>
            </Card>
          );
        })}
      </OutfitsList>
    </div>
  );
};
