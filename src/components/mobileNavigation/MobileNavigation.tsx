import * as React from 'react';
import Logo from '../../img/logo.png';
import { useNavigate } from 'react-router-dom';
import { SwipeableDrawer, List, ListItemButton, ListItemText, IconButton, ListItemIcon, Box, Typography } from '@mui/material';
import { useAuthentication } from '../../services/useAuthentication';
import { ROUTES } from '../../routes/constants';
import { Bar } from './MobileNavigation.styles';
import MenuIcon from '@mui/icons-material/Menu';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import { AvatarURLS } from '../../constants/avatar';
import { StatsMenu } from './StatsMenu';
import { AboutMenu } from './AboutMenu';

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthentication();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleMenuClick = (route: string) => {
    navigate(route);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Bar>
        <IconButton sx={{ height: 'fit-content', fontSize: '35px' }} onClick={handleDrawerToggle} size={'large'}>
          <MenuIcon color={'primary'} fontSize={'inherit'} />
        </IconButton>
        <img src={Logo} alt={'logo'} width={260} style={{ cursor: 'pointer', padding: 20 }} onClick={() => navigate(ROUTES.home)} />
      </Bar>
      <SwipeableDrawer anchor={'left'} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onOpen={() => setIsDrawerOpen(true)}>
        <IconButton sx={{ width: 'fit-content', fontSize: '35px' }} onClick={handleDrawerToggle} size={'large'}>
          <MenuIcon color={'primary'} fontSize={'inherit'} />
        </IconButton>
        <List sx={{ width: 250, color: 'primary.dark' }}>
          <ListItemButton onClick={() => handleMenuClick(ROUTES.home)}>
            <ListItemIcon>
              <SportsVolleyballIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary={user ? 'Leagues' : 'Login'} />
          </ListItemButton>
          <StatsMenu handleMenuClick={handleMenuClick} />
          <ListItemButton onClick={() => handleMenuClick(ROUTES.leaderboard)}>
            <ListItemIcon>
              <ScoreboardIcon color={'primary'} />
            </ListItemIcon>
            <ListItemText primary='Leaderboard' />
          </ListItemButton>
          <AboutMenu handleMenuClick={handleMenuClick} />
          {user?.isAdmin && (
            <ListItemButton onClick={() => handleMenuClick(ROUTES.admin.root)}>
              <ListItemIcon>
                <AdminPanelSettingsIcon color={'primary'} />
              </ListItemIcon>
              <ListItemText primary='Admin' />
            </ListItemButton>
          )}
          {user ? (
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <LogoutIcon color={'primary'} />
              </ListItemIcon>
              <ListItemText primary={'Logout'} />
            </ListItemButton>
          ) : null}
        </List>
        {user ? (
          <Box
            sx={{
              display: 'flex',
              marginTop: 'auto',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: 250,
              padding: 1,
              backgroundColor: 'primary.light',
            }}>
            <img alt={'avatar'} width={40} height={40} style={{ borderRadius: '50%' }} src={AvatarURLS[user.avatar]} />
            <Typography sx={{ color: 'primary.contrastText' }} variant={'body1'}>
              {user.username}
            </Typography>
          </Box>
        ) : null}
      </SwipeableDrawer>
    </>
  );
};
