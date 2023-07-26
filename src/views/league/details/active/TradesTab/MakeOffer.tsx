import * as React from 'react';
import type { Outfit } from '../../../../../models/outfit';
import { useGameboardContext } from '../useGameboardContext';
import { Button, Checkbox, Dialog, FormControlLabel, FormGroup, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuthentication } from '../../../../../services/useAuthentication';
import { Column, Card, Thumbnail, OfferPanel, NavRow } from './MakeOffer.styles';
import { useState } from 'react';
import { OutfitDetailDialog } from '../../../../../components/OutfitDetailDialog';
import { useWindowSize } from '@uidotdev/usehooks';
import { LoadingButton } from '@mui/lab';
import { useRequest } from '../../../../../utils/useRequest';
import { ENDPOINTS, OfferTradeParams, OfferTradeResponse } from '../../../../../constants/endpoints';

export const MakeOffer: React.FC<{ recipient: string; onBack: () => void; refetchList: () => void }> = ({
  recipient,
  onBack,
  refetchList,
}) => {
  const { width } = useWindowSize();
  // this value should not change if the dropdown is changed, only changes upon transaction.
  // Trades tab should function the same no matter the date selected.
  const { currentLineups } = useGameboardContext();
  const { user } = useAuthentication();

  const [openOutfit, setOpenOutfit] = useState<Outfit | null>(null);

  // these need to be ordered against myLineup at post time
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
  const [outfitsDesired, setOutfitsDesired] = useState<string[]>([]);

  const { post: postOffer, isLoading } = useRequest<OfferTradeResponse, OfferTradeParams>();

  if (!currentLineups || !user) {
    return (
      <Typography>
        Thanks for joining Eras Tour Leagues! Your draft completed in the middle of a show, this feature will become available once the show
        completes.
      </Typography>
    );
  }

  const myLineup = currentLineups.find(l => l.username === user.username)!;
  const recipientLineup = currentLineups.find(l => l.username === recipient)!;

  const isSubmitEnabled = selectedOfferings.length && selectedOfferings.length === outfitsDesired.length;

  const handleSubmit = async () => {
    // this orders things against the existing lineups, ensuring players don't unintentionally bench a starter after  trade executes.
    const allMyOutfits = [...myLineup.starters, ...myLineup.bench];
    const myPayment = allMyOutfits.filter(o => selectedOfferings.includes(o._id)).map(o => o._id);

    const allRecipientOutfits = [...recipientLineup.starters, ...recipientLineup.bench];
    const recipientPayment = allRecipientOutfits.filter(o => outfitsDesired.includes(o._id)).map(o => o._id);

    const response = await postOffer({
      endpoint: ENDPOINTS.offerTrade,
      body: {
        leagueId: myLineup.league,
        recipientUsername: recipient,
        myPayment,
        recipientPayment,
      },
    });
    refetchList();
    onBack();
  };
  const outfitCard = (outfit: Outfit, column: 'mine' | 'recipient') => {
    const arrayToCheck = column === 'mine' ? selectedOfferings : outfitsDesired;
    const isSelected = arrayToCheck.includes(outfit._id);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      if (checked) {
        // can trade 5 items max
        if (column === 'mine' && selectedOfferings.length < 5) {
          setSelectedOfferings(v => [...v, outfit._id]);
        } else if (column === 'recipient' && outfitsDesired.length < 5) {
          setOutfitsDesired(v => [...v, outfit._id]);
        }
      } else {
        if (column === 'mine') {
          setSelectedOfferings(v => v.filter(o => o !== outfit._id));
        } else {
          setOutfitsDesired(v => v.filter(o => o !== outfit._id));
        }
      }
    };
    return (
      <Card elevation={2}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Thumbnail onClick={() => setOpenOutfit(outfit)} src={outfit.image} />
          {width >= 576 ? (
            <Typography onClick={() => setOpenOutfit(outfit)} sx={{ cursor: 'pointer' }} variant={'body2'}>
              {outfit.name}
            </Typography>
          ) : null}
        </div>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={isSelected} onChange={handleChange} />}
            label={outfit.pointValue}
            labelPlacement={'start'}
          />
        </FormGroup>
      </Card>
    );
  };
  return (
    <>
      <NavRow>
        <IconButton onClick={onBack}>
          <ArrowBackIcon sx={{ color: 'primary.main' }} />
        </IconButton>
        <Button onClick={onBack}>Back</Button>
      </NavRow>
      <Typography gutterBottom variant={'h5'} sx={{ color: 'primary.main' }}>
        Offering Trade to {recipient}
      </Typography>
      <Typography gutterBottom variant={'body2'}>
        Trade up to 5 outfits. You must send the same number of outfits as you're receiving. Trade offers remain valid for 7 days.
      </Typography>
      <OfferPanel>
        <Column>
          <Typography variant={'body1'} sx={{ color: 'primary.dark' }}>
            {`${user.username}'s Starters`}
          </Typography>
          {myLineup?.starters.map(outfit => outfitCard(outfit, 'mine'))}
          <Typography variant={'body1'} sx={{ color: 'primary.dark' }}>
            {`${user.username}'s Bench`}
          </Typography>
          {myLineup?.bench.map(outfit => outfitCard(outfit, 'mine'))}
        </Column>
        <Column>
          <Typography variant={'body1'} sx={{ color: 'primary.dark' }}>
            {`${recipient}'s Starters`}
          </Typography>
          {recipientLineup?.starters.map(outfit => outfitCard(outfit, 'recipient'))}
          <Typography variant={'body1'} sx={{ color: 'primary.dark' }}>
            {`${recipient}'s Bench`}
          </Typography>
          {recipientLineup?.bench.map(outfit => outfitCard(outfit, 'recipient'))}
        </Column>
      </OfferPanel>
      <LoadingButton
        onClick={handleSubmit}
        variant={'contained'}
        loading={isLoading}
        sx={{ marginTop: 2, marginBottom: 2 }}
        fullWidth
        disabled={!isSubmitEnabled}>
        Make Offer
      </LoadingButton>
      <Dialog fullWidth maxWidth={'md'} open={Boolean(openOutfit)} onClose={() => setOpenOutfit(null)}>
        {openOutfit ? <OutfitDetailDialog outfit={openOutfit} onBack={() => setOpenOutfit(null)} /> : null}
      </Dialog>
    </>
  );
};
