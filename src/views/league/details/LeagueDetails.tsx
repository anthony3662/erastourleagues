import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRequest } from '../../../utils/useRequest';
import { ENDPOINTS, LeagueDetailsResponse } from '../../../constants/endpoints';
import { Backdrop, CircularProgress } from '@mui/material';
import { Predraft } from './predraft/Predraft';
import { Drafting } from './drafting/Drafting';
import { ActiveLeague } from './active/ActiveLeague';
import { useSocket } from '../../../services/useSocket';
import { GameboardProvider } from './active/useGameboardContext';

export const LeagueDetails = () => {
  const { id } = useParams();
  const { post, isLoading, data } = useRequest<LeagueDetailsResponse>();
  const { openConnection, socket } = useSocket();
  const { latestDraftPickState, wasDraftFinalizedReceived } = useSocket();

  const fetchDetails = async () => {
    await post({
      endpoint: ENDPOINTS.leagueDetails,
      body: { id },
    });
  };

  // connects to the draft management websocket if drafting or predraft
  // active leagues use http polling to manage live updates.
  const shouldSocketConnect = data?.league.status === 'drafting' || data?.league.status === 'predraft';
  const shouldSocketDisconnect = data?.league.status === 'active';
  useEffect(() => {
    if (shouldSocketConnect) {
      openConnection(id!);
    }
  }, [shouldSocketConnect]);

  useEffect(() => {
    if (shouldSocketDisconnect) {
      socket?.disconnect();
    }
  }, [shouldSocketDisconnect]);

  useEffect(() => {
    fetchDetails();
    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (wasDraftFinalizedReceived && data?.league.status === 'drafting') {
      timeout = setTimeout(fetchDetails, 5000);
    }
    return () => timeout && clearTimeout(timeout);
  }, [wasDraftFinalizedReceived, data?.league.status]);

  const [hasLeagueRefetched, setHasLeagueRefetched] = useState(false);
  useEffect(() => {
    // reloads the page once the first draft socket message comes in
    if (latestDraftPickState && !hasLeagueRefetched) {
      // this will only call once in the life of the page.
      // otherwise, quick succession socket messages can cause multiple refetches before the page unmounts.
      fetchDetails();
      setHasLeagueRefetched(true);
    }
  }, [latestDraftPickState, hasLeagueRefetched]);

  const LoadingState = (
    <Backdrop sx={{ color: '#fff' }} open={isLoading}>
      <CircularProgress color='inherit' />
    </Backdrop>
  );

  if (isLoading || !data) {
    return LoadingState;
  }

  const { status } = data.league;

  if (status === 'predraft') {
    return <Predraft refetchLeague={fetchDetails} league={data.league} />;
  } else if (status === 'drafting') {
    return <Drafting league={data.league} />;
  } else {
    return (
      <GameboardProvider>
        <ActiveLeague league={data.league} />
      </GameboardProvider>
    );
  }
};
