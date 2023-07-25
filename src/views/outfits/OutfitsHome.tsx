import * as React from 'react';

import type { Outfit } from '../../models/outfit';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { usePublicData } from '../../services/usePublicData';
import { Wrapper, Title, CardWrapper } from './OutfitsHome.styles';
import { Card, CardActionArea, CardContent, CardMedia, Dialog, Typography } from '@mui/material';
import { OutfitDetailDialog } from '../../components/OutfitDetailDialog';

export const OutfitsHome: React.FC = () => {
  const theme = useTheme();
  const { outfits } = usePublicData();
  const [openOutfit, setOpenOutfit] = useState<Outfit | null>(null);

  if (!outfits) {
    return <></>;
  }

  return (
    <>
      <Wrapper style={{ color: theme.palette.primary.dark }}>
        <Title>
          <Typography variant={'h4'} sx={{ color: 'primary.dark' }}>
            Outfits
          </Typography>
        </Title>
        <CardWrapper>
          {outfits.map(outfit => (
            <Card key={outfit._id} sx={{ width: 225 }}>
              <CardActionArea onClick={() => setOpenOutfit(outfit)}>
                <CardMedia component={'img'} height={'225'} image={outfit.image} />
                <CardContent>
                  <Typography variant={'h5'} sx={{ color: 'primary.dark' }} gutterBottom>
                    {outfit.name}
                  </Typography>
                  <Typography variant={'body1'} gutterBottom sx={{ color: 'primary.main' }}>
                    {outfit.category}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </CardWrapper>
      </Wrapper>
      <Dialog fullWidth maxWidth={'md'} open={Boolean(openOutfit)} onClose={() => setOpenOutfit(null)}>
        {openOutfit ? <OutfitDetailDialog outfit={openOutfit} onBack={() => setOpenOutfit(null)} /> : null}
      </Dialog>
    </>
  );
};
