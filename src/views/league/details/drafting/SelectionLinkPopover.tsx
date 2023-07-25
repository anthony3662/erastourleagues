import * as React from 'react';
import { Outfit } from '../../../../models/outfit';
import { Button, Popover } from '@mui/material';
import { OutfitImage, PopoverContainer } from './OutfitCell.styles';

export const SelectionLinkPopover: React.FC<{ outfit: Outfit }> = ({ outfit }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button sx={{ textAlign: 'left' }} variant={'text'} onClick={handleClick}>
        {outfit.name}
      </Button>
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
