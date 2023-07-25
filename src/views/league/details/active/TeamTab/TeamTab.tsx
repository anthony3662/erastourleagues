import * as React from 'react';
import { useGameboardContext } from '../useGameboardContext';
import { Backdrop, CircularProgress, Dialog, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useAuthentication } from '../../../../../services/useAuthentication';
import { OutfitIcon, OutfitRow, OutfitTitleBox, Panel, SurpriseHeaderRow, Wrapper } from './TeamTab.styles';
import type { Lineup } from '../../../../../models/lineup';
import { useWindowSize } from '@uidotdev/usehooks';
import { usePublicData } from '../../../../../services/usePublicData';
import { Concert } from '../../../../../models/concert';
import { useState } from 'react';
import { Outfit } from '../../../../../models/outfit';
import { OutfitDetailDialog } from '../../../../../components/OutfitDetailDialog';
import { SurpriseSongsSelector } from './SurpriseSongsSelector';

export const TeamTab: React.FC = () => {
  const { width } = useWindowSize();
  const { getSelectedConcertLineups, getSelectedConcertObject, isCurrentConcertSelected, isLineupTransactionLoading, swapOutfit } =
    useGameboardContext();
  const { transactionsLocked, surpriseSongs, outfits } = usePublicData();
  const { user } = useAuthentication();
  const [openOutfit, setOpenOutfit] = useState<Outfit | null>(null);

  const lineups = getSelectedConcertLineups();
  const selectedConcert: Concert = getSelectedConcertObject()!;
  const outfitsDisplayed = selectedConcert.outfits.map(o => o._id);

  if (!lineups || !surpriseSongs || !outfits || isLineupTransactionLoading) {
    return (
      <Backdrop sx={{ color: '#fff' }} open={true}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  const myLineup: Lineup = lineups.find(l => l.username === user!.username)!;
  const canSwap = isCurrentConcertSelected && !transactionsLocked;

  return (
    <>
      <Wrapper>
        <Typography variant={'h5'} sx={{ color: 'primary.dark' }}>
          {`${user?.username}'s Team`}
        </Typography>
        <SurpriseSongsSelector />
        <Panel>
          <Typography variant={'h6'} sx={{ color: 'primary.dark' }}>
            Starters
          </Typography>
          {myLineup.starters.map(outfit => {
            const didOutfitAppear = outfitsDisplayed.includes(outfit._id);

            const SwapOutfitSelect = (
              <>
                <InputLabel id={`swap-menu-${outfit._id}-label`}>Swap Out</InputLabel>
                <Select
                  labelId={`swap-menu-${outfit._id}-label`}
                  id={`swap-menu-${outfit._id}`}
                  value={''}
                  label={'Swap out'}
                  onChange={event => {
                    const params = {
                      newStarterId: event.target.value,
                      newBenchId: outfit._id,
                    };
                    swapOutfit(params);
                  }}>
                  {myLineup.bench.map(o => (
                    <MenuItem value={o._id}>{o.name}</MenuItem>
                  ))}
                </Select>
              </>
            );
            return (
              <>
                <OutfitRow>
                  <OutfitTitleBox onClick={() => setOpenOutfit(outfit)}>
                    <OutfitIcon src={outfit.image} />
                    <Typography variant={'body1'} sx={{ color: 'primary.dark' }}>
                      {outfit.name}
                    </Typography>
                  </OutfitTitleBox>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                    <b style={{ color: didOutfitAppear ? 'limegreen' : 'grey' }}>
                      {didOutfitAppear ? '+' + outfit.pointValue : outfit.pointValue}
                    </b>
                    {width >= 576 && canSwap ? <FormControl sx={{ minWidth: 200 }}>{SwapOutfitSelect}</FormControl> : null}
                  </div>
                </OutfitRow>
                {width < 576 && canSwap ? <FormControl fullWidth>{SwapOutfitSelect}</FormControl> : null}
                <Divider variant={'middle'} />
              </>
            );
          })}
        </Panel>
        <Panel>
          <Typography variant={'h6'} sx={{ color: 'primary.dark' }}>
            Bench
          </Typography>
          {myLineup.bench.map(outfit => {
            const didOutfitAppear = outfitsDisplayed.includes(outfit._id);

            const SwapOutfitSelect = (
              <>
                <InputLabel id={`swap-menu-${outfit._id}-label`}>Swap Out</InputLabel>
                <Select
                  labelId={`swap-menu-${outfit._id}-label`}
                  id={`swap-menu-${outfit._id}`}
                  value={''}
                  label={'Swap out'}
                  onChange={event => {
                    const params = {
                      newBenchId: event.target.value,
                      newStarterId: outfit._id,
                    };
                    swapOutfit(params);
                  }}>
                  {myLineup.starters.map(o => (
                    <MenuItem value={o._id}>{o.name}</MenuItem>
                  ))}
                </Select>
              </>
            );
            return (
              <>
                <OutfitRow>
                  <OutfitTitleBox onClick={() => setOpenOutfit(outfit)}>
                    <OutfitIcon src={outfit.image} />
                    <Typography variant={'body1'} sx={{ color: 'primary.dark' }}>
                      {outfit.name}
                    </Typography>
                  </OutfitTitleBox>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                    <b style={{ color: didOutfitAppear ? 'limegreen' : 'grey' }}>
                      {didOutfitAppear ? '+' + outfit.pointValue : outfit.pointValue}
                    </b>
                    {width >= 576 && canSwap ? <FormControl sx={{ minWidth: 200 }}>{SwapOutfitSelect}</FormControl> : null}
                  </div>
                </OutfitRow>
                {width < 576 && canSwap ? <FormControl fullWidth>{SwapOutfitSelect}</FormControl> : null}
                <Divider variant={'middle'} />
              </>
            );
          })}
        </Panel>
      </Wrapper>
      <Dialog fullWidth maxWidth={'md'} open={Boolean(openOutfit)} onClose={() => setOpenOutfit(null)}>
        {openOutfit ? <OutfitDetailDialog outfit={openOutfit} onBack={() => setOpenOutfit(null)} /> : null}
      </Dialog>
    </>
  );
};
