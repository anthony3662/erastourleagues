import * as React from 'react';
import { useGameboardContext } from '../useGameboardContext';
import { MatchupPanel } from '../../../components/MatchupPanel';
import { Backdrop, CircularProgress, Dialog, Typography } from '@mui/material';
import { useState } from 'react';
import { Outfit } from '../../../../../models/outfit';
import { OutfitDetailDialog } from '../../../../../components/OutfitDetailDialog';

export const MatchupTab: React.FC = () => {
  const { getMyMatchup, isLineupsLoading } = useGameboardContext();
  const [openOutfit, setOpenOutfit] = useState<Outfit | null>(null);

  const myMatchup = getMyMatchup();

  if (isLineupsLoading || !myMatchup) {
    return (
      <Backdrop sx={{ color: '#fff' }} open={isLineupsLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  return (
    <>
      <Typography
        gutterBottom
        variant={'h5'}
        sx={{ color: 'primary.dark' }}>{`${myMatchup[0].user.username} vs ${myMatchup[1].user.username}`}</Typography>
      <MatchupPanel matchup={myMatchup} onOutfitClick={outfit => setOpenOutfit(outfit)} />
      <Dialog fullWidth maxWidth={'md'} onClose={() => setOpenOutfit(null)} open={Boolean(openOutfit)}>
        {openOutfit ? <OutfitDetailDialog outfit={openOutfit} onBack={() => setOpenOutfit(null)} /> : null}
      </Dialog>
    </>
  );
};
