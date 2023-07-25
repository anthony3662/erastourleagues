import * as React from 'react';
import { Outfit } from '../../../../../models/outfit';
import { useGameboardContext } from '../useGameboardContext';
import { Box } from '@mui/material';
import { OutfitIcon } from './MatchupRow.styles';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTheme } from '@mui/material/styles';

export const OutfitEntry: React.FC<{ outfit: Outfit; isStarter: boolean; onClick: (outfit: Outfit) => void }> = ({
  outfit,
  isStarter,
  onClick,
}) => {
  const { width } = useWindowSize();
  const theme = useTheme();
  const { getSelectedConcertObject } = useGameboardContext();
  const concert = getSelectedConcertObject();

  const outfitsDisplayed = concert!.outfits.map(o => o._id);
  const didOutfitAppear = outfitsDisplayed.includes(outfit._id);
  if (width >= 768) {
    return (
      <Box
        onClick={() => onClick(outfit)}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          border: `solid 1px ${theme.palette.primary.main}`,
          borderRadius: 1,
          padding: 1,
        }}>
        <OutfitIcon src={outfit.image} />
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 12 }}>
          <b style={{ color: didOutfitAppear ? 'limegreen' : undefined }}>{outfit.name}</b>
          <small>{outfit.category}</small>
        </div>
        <h4 style={{ marginLeft: 'auto', color: didOutfitAppear && isStarter ? 'limegreen' : 'grey' }}>
          {didOutfitAppear && isStarter ? `+${outfit.pointValue}` : outfit.pointValue}
        </h4>
      </Box>
    );
  }

  return (
    <Box
      onClick={() => onClick(outfit)}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
        height: '90px',
      }}>
      <b style={{ color: didOutfitAppear ? 'limegreen' : undefined }}>{outfit.name}</b>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
        <OutfitIcon src={outfit.image} style={{ width: 40, height: 40 }} />
        <small>{outfit.category}</small>
        <h4 style={{ marginLeft: 'auto', marginTop: 0, marginBottom: 0, color: didOutfitAppear && isStarter ? 'limegreen' : 'grey' }}>
          {didOutfitAppear && isStarter ? `+${outfit.pointValue}` : outfit.pointValue}
        </h4>
      </div>
    </Box>
  );
};
