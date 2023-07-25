import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../../utils/useRequest';
import { useEffect } from 'react';
import { ENDPOINTS, LeaguesResponse } from '../../constants/endpoints';
import { Card, CardContent, Skeleton } from '@mui/material';
import { SkeletonBox } from './LeagueList.styles';
import { League } from '../../models/league';
import { LeagueCard } from './LeagueCard';

export const LeagueList = () => {
  const { get, data, isLoading } = useRequest<LeaguesResponse>();

  useEffect(() => {
    get(ENDPOINTS.leagues);
  }, []);

  if (isLoading || !data) {
    return (
      <Card sx={{ width: 225 }}>
        <CardContent>
          <SkeletonBox>
            <Skeleton variant={'text'} width={200} />
            <Skeleton variant={'rectangular'} width={200} height={60} />
            <Skeleton variant={'rectangular'} width={200} height={60} />
          </SkeletonBox>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {data.leagues.map((league: League, index: number) => (
        <LeagueCard league={league} key={`league-card-${index}`} />
      ))}
    </>
  );
};
