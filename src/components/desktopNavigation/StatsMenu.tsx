import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';
import { ROUTES } from '../../routes/constants';

export const StatsMenu: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button size={'large'} onClick={handleClick}>
        Stats
      </Button>
      <Menu id={'stats-menu'} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.concerts);
            handleClose();
          }}>
          Concerts
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.outfits);
            handleClose();
          }}>
          Outfits
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.surpriseSongs);
            handleClose();
          }}>
          Surprise Songs
        </MenuItem>
      </Menu>
    </>
  );
};
