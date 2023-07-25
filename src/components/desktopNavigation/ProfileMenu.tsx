import * as React from 'react';
import { useAuthentication } from '../../services/useAuthentication';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { AvatarURLS } from '../../constants/avatar';

export const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuthentication();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!user) {
    return <></>;
  }

  return (
    <>
      <Button size={'large'} onClick={handleClick}>
        Profile
      </Button>
      <Menu id='profile-menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, padding: 1, backgroundColor: 'primary.light' }}>
          <img width={40} height={40} style={{ borderRadius: '50%' }} src={AvatarURLS[user.avatar]} />
          <Typography sx={{ color: 'primary.contrastText' }} variant={'body1'}>
            {user.username}
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            handleClose();
            logout();
          }}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
