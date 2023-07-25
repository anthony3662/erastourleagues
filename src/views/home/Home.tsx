import * as React from 'react';
import { useAuthentication } from '../../services/useAuthentication';
import { CardWrapper, Title, Wrapper } from './Home.styles';
import { LeagueList } from './LeagueList';
import { CreateLeagueCard } from './CreateLeagueCard';
import { MyInvites } from './MyInvites';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { generatePath, useNavigate } from 'react-router-dom';
import { useQueryParams } from '../../utils/useQueryParams';
import { useEffect } from 'react';
import { ROUTES } from '../../routes/constants';

export const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { queryParams } = useQueryParams();
  const { leagueId } = queryParams;

  useEffect(() => {
    if (leagueId) {
      navigate(generatePath(ROUTES.league.detail, { id: leagueId }));
    }
  }, []);

  return (
    <Wrapper style={{ borderColor: theme.palette.primary.main }}>
      <Title>
        <Typography variant={'h4'} sx={{ color: 'primary.dark' }}>
          My Leagues
        </Typography>
      </Title>
      <MyInvites />
      <CardWrapper>
        <LeagueList />
        <CreateLeagueCard />
      </CardWrapper>
    </Wrapper>
  );
};
