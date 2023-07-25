import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { ROUTES } from '../../routes/constants';

export const AboutMenu: React.FC = () => {
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
        About
      </Button>
      <Menu id='profile-menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.howToPlay);
            handleClose();
          }}>
          How to Play
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.about);
            handleClose();
          }}>
          About Us
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.supportUs);
            handleClose();
          }}>
          Support Us
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.termsOfUse);
            handleClose();
          }}>
          Terms of Use
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.privacyPolicy);
            handleClose();
          }}>
          Privacy Policy
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(ROUTES.litigation);
            handleClose();
          }}>
          Statement on Litigation
        </MenuItem>
        <MenuItem>
          <a href={'/'}>
            <img src={'https://swiftball-static.s3.us-east-2.amazonaws.com/static/venmo.png'} width={100} />
          </a>
        </MenuItem>
      </Menu>
    </>
  );
};
