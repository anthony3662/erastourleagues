import * as React from 'react';
import { League } from '../../../../models/league';
import { InviteBox } from './InviteBox';
import { PredraftWrapper } from './Predraft.styles';
import { ProgressBar } from '../../components/ProgressBar';
import { useRequest } from '../../../../utils/useRequest';
import { ENDPOINTS, LeagueInvitesResponse } from '../../../../constants/endpoints';
import { useEffect } from 'react';
import { PlayersPanel } from './PlayersPanel';
import { ScheduleDraft } from './ScheduleDraft';

export const Predraft: React.FC<{ league: League; refetchLeague: () => void }> = ({ league, refetchLeague }) => {
  const requestHook = useRequest<LeagueInvitesResponse>();
  const { post, isLoading, data } = requestHook;

  const fetch = () => {
    post({
      endpoint: ENDPOINTS.leagueInvites,
      body: { leagueId: league['_id'] },
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  const invitesNeeded = () => {
    if (!data?.invites) {
      return false;
    }
    const unexpiredInvites = data.invites.filter(invite => Date.now() < Number(invite.expiresAt));
    return league.playerUsernames.length + unexpiredInvites.length < league.playerCapacity;
  };

  const readyToDraft = league.playerUsernames.length === league.playerCapacity;

  return (
    <PredraftWrapper>
      <h1>{`${league.name} - Predraft`}</h1>
      <ProgressBar activeStep={1} />
      <PlayersPanel league={league} requestHook={requestHook} refetch={fetch} />
      {invitesNeeded() ? <InviteBox league={league} refetch={fetch} /> : null}
      {readyToDraft ? <ScheduleDraft league={league} refetch={refetchLeague} /> : null}
    </PredraftWrapper>
  );
};
