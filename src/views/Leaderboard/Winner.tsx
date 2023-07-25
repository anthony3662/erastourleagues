import * as React from 'react';
import { styled as mStyled } from '@mui/material/styles';
import { Box, Dialog, Typography } from '@mui/material';
import { Leaderboard, LeaderboardLineup } from '../../models/leaderboard';
import styled from 'styled-components';
import { usePublicData } from '../../services/usePublicData';
import { useState } from 'react';
import { Outfit } from '../../models/outfit';
import { OutfitDetailDialog } from '../../components/OutfitDetailDialog';

const Wrapper = mStyled(Box)`
  padding: 16px;
  border-radius: 8px;
  border: solid 2px ${({ theme }) => theme.palette.primary.dark}
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Thumbnail = styled.img`
  cursor: pointer;
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 4px;
  @media (min-width: 576px) {
    width: 50px;
    height: 50px;
  }
`;

const ImageRow = styled.div`
  display: flex;
  gap: 8px;
  @media (min-width: 576px) {
    gap: 16px;
  }
`;

export const Winner: React.FC<{ lineup: LeaderboardLineup }> = ({ lineup }) => {
  const { concerts } = usePublicData();
  const [openOutfit, setOpenOutfit] = useState<Outfit | null>(null);

  if (!concerts) {
    return <></>;
  }

  const matchingConcert = concerts.find(c => c.increasingId === lineup.concertId)!;

  return (
    <Wrapper>
      <HeaderRow>
        <Typography variant={'h5'} color={'primary.dark'}>
          {lineup.username}
        </Typography>
        <Typography variant={'h5'} color={'primary.dark'}>
          {lineup.score}
        </Typography>
      </HeaderRow>
      <Typography variant={'h6'} color={'primary.dark'}>{`League - ${lineup.league.name}`}</Typography>
      <Typography variant={'body1'} sx={{ color: 'primary.main', marginTop: 2 }}>
        Starters
      </Typography>
      <ImageRow>
        {lineup.starters.map(s => (
          <Thumbnail
            onClick={() => setOpenOutfit(s)}
            style={matchingConcert.outfits.some(o => o._id === s._id) ? { border: 'solid 2px limegreen', margin: -2 } : undefined}
            src={s.image}
            key={s._id}
          />
        ))}
      </ImageRow>
      <Typography
        color={matchingConcert.guitarSong?.album === lineup.guitarAlbum ? 'limegreen' : 'primary.main'}
        sx={{ marginTop: 2 }}>{`Guitar Album - ${lineup.guitarAlbum}`}</Typography>
      <Typography
        color={
          matchingConcert.guitarSong?.name === lineup.guitarSong.name ? 'limegreen' : 'primary.main'
        }>{`Guitar Song - ${lineup.guitarSong.name}`}</Typography>
      <Typography
        color={
          matchingConcert.pianoSong?.album === lineup.pianoAlbum ? 'limegreen' : 'primary.main'
        }>{`Piano Album - ${lineup.pianoAlbum}`}</Typography>
      <Typography
        color={
          matchingConcert.pianoSong?.name === lineup.pianoSong.name ? 'limegreen' : 'primary.main'
        }>{`Piano Song - ${lineup.pianoSong.name}`}</Typography>
      <Dialog fullWidth maxWidth={'md'} open={Boolean(openOutfit)} onClose={() => setOpenOutfit(null)}>
        {openOutfit ? <OutfitDetailDialog outfit={openOutfit} onBack={() => setOpenOutfit(null)} /> : null}
      </Dialog>
    </Wrapper>
  );
};
