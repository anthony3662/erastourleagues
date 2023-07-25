import * as React from 'react';
import { useEffect } from 'react';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';
import { useRequest } from '../../utils/useRequest';
import { useQueryParams } from '../../utils/useQueryParams';
import { AcceptInviteResponse, DeclineInviteResponse, ENDPOINTS, MyInvitesResponse } from '../../constants/endpoints';
import { Alert, Stack } from '@mui/material';
import { ROUTES } from '../../routes/constants';
import { LoadingButton } from '@mui/lab';
import { ResponsiveAlertActions } from '../../components/ResponsiveAlertActions';

export const MyInvites = () => {
  const { post: fetchInvites, data, isLoading: isFetchLoading } = useRequest<MyInvitesResponse>();
  const { post: acceptInvite, isLoading: acceptLoading } = useRequest<AcceptInviteResponse>();
  const { post: declineInvite, isLoading: declineLoading } = useRequest<DeclineInviteResponse>();
  const { queryParams } = useQueryParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { invitationToken } = queryParams;

  const clearInviteToken = () => {
    const param = searchParams.get('invitationToken');
    if (param) {
      searchParams.delete('invitationToken');
    }
    setSearchParams(searchParams);
  };

  const fetch = () => {
    if (invitationToken) {
      fetchInvites({ endpoint: ENDPOINTS.myInvites, body: { invitationToken } });
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleAccept = async (inviteId: string, leagueId: string) => {
    const result = await acceptInvite({
      endpoint: ENDPOINTS.acceptInvite,
      body: {
        invitationToken,
        inviteId,
      },
    });
    if (result.success) {
      if (data?.invites.length === 1) {
        clearInviteToken();
      }
      navigate(generatePath(ROUTES.league.detail, { id: leagueId }));
    } else {
      fetch();
    }
  };

  const handleDecline = async (inviteId: string) => {
    const result = await declineInvite({
      endpoint: ENDPOINTS.declineInvite,
      body: {
        inviteId,
      },
    });
    if (result.success && data?.invites.length === 1) {
      clearInviteToken();
    }
    fetch();
  };

  if (!invitationToken) {
    return <></>;
  }

  if (isFetchLoading || !data) {
    return (
      <div style={{ marginBottom: 32 }}>
        <Alert>Loading invites...</Alert>
      </div>
    );
  }

  if (data.invites.length === 0) {
    return (
      <div style={{ marginBottom: 32 }}>
        <Alert severity={'error'}>{'The invite token is invalid. Ask the league creator to invite you again.'}</Alert>
      </div>
    );
  }

  return (
    <Stack spacing={2} sx={{ marginBottom: 2 }}>
      {data.invites.map((invite, index) => {
        const isExpired = Date.now() >= Number(invite.expiresAt);
        if (isExpired) {
          return (
            <Alert severity={'error'} key={`invite-${index}`}>
              {`Your invite to ${invite.league.name} has expired. Ask the league creator to invite you again.`}
            </Alert>
          );
        } else {
          return (
            <Alert
              key={`invite-${index}`}
              action={
                <ResponsiveAlertActions>
                  <LoadingButton
                    color={'success'}
                    loading={acceptLoading}
                    variant={'outlined'}
                    onClick={() => {
                      const isExpired = Date.now() >= Number(invite.expiresAt);
                      if (isExpired) {
                        fetch();
                      } else {
                        handleAccept(invite['_id'], invite.league['_id']);
                      }
                    }}>
                    Accept
                  </LoadingButton>
                  <span style={{ width: 8 }} />
                  <LoadingButton
                    color={'error'}
                    loading={declineLoading}
                    variant={'outlined'}
                    onClick={() => {
                      const isExpired = Date.now() >= Number(invite.expiresAt);
                      if (isExpired) {
                        fetch();
                      } else {
                        handleDecline(invite['_id']);
                      }
                    }}>
                    Decline
                  </LoadingButton>
                </ResponsiveAlertActions>
              }>
              {`You're invited to ${invite.league.name}!`}
            </Alert>
          );
        }
      })}
    </Stack>
  );
};
