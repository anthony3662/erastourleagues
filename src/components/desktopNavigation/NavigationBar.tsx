import * as React from 'react';
import Logo from '../../img/logo.png';
import { useNavigate } from 'react-router-dom';
import { ButtonRow, Wrapper } from './NavigationBar.styles';
import { Button } from '@mui/material';
import { useAuthentication } from '../../services/useAuthentication';
import { ROUTES } from '../../routes/constants';
import { ProfileMenu } from './ProfileMenu';
import { StatsMenu } from './StatsMenu';
import { AboutMenu } from './AboutMenu';

export const NavigationBar = () => {
  const navigate = useNavigate();
  const { user } = useAuthentication();

  return (
    <Wrapper>
      <img src={Logo} width={260} style={{ cursor: 'pointer', padding: 20 }} onClick={() => navigate(ROUTES.home)} />
      <ButtonRow>
        <Button size={'large'} onClick={() => navigate(ROUTES.home)}>
          {user ? 'Leagues' : 'Login'}
        </Button>
        <StatsMenu />
        <Button size={'large'} onClick={() => navigate(ROUTES.leaderboard)}>
          Leaderboard
        </Button>
        <AboutMenu />
        {user?.isAdmin ? <Button onClick={() => navigate(ROUTES.admin.root)}>Admin</Button> : null}
        <ProfileMenu />
      </ButtonRow>
    </Wrapper>
  );
};
