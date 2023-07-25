import * as React from 'react';
import { Outfit } from '../../../../models/outfit';
import { DraftOutfitCell, OutfitHeader, OutfitImage, OutfitTitle, PopoverContainer } from './OutfitCell.styles';
import { Popover } from '@mui/material';

export const OutfitCell: React.FC<{ outfit: Outfit }> = ({ outfit }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {/*
// @ts-ignore */}
      <DraftOutfitCell category={outfit.category} onClick={handleClick}>
        <OutfitHeader>
          <div>{outfit.category}</div>
          <div>{outfit.pointValue}</div>
        </OutfitHeader>
        <OutfitTitle>{outfit.name}</OutfitTitle>
      </DraftOutfitCell>
      <Popover
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <PopoverContainer>
          <OutfitImage src={outfit.image} alt={outfit.name} />
        </PopoverContainer>
      </Popover>
    </>
  );
};
