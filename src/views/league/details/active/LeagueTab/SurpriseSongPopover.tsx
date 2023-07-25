import * as React from 'react';
import { ContentRow } from './SurpriseSongsBox.styles';
import { Popover } from '@mui/material';

export const SurpriseSongPopover: React.FC<{ children: React.ReactNode; popOverContent: React.ReactNode }> = ({
  children,
  popOverContent,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // @ts-ignore
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ContentRow onClick={handleClick}>{children}</ContentRow>
      <Popover
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        {popOverContent}
      </Popover>
    </>
  );
};
