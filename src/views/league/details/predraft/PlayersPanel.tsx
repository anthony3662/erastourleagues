import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { League } from '../../../../models/league';
import { useRequest, UseRequest } from '../../../../utils/useRequest';
import { CreateInviteResponse, DeclineInviteResponse, ENDPOINTS, LeagueInvitesResponse } from '../../../../constants/endpoints';
import { Alert, Box, Button, Skeleton, Stack } from '@mui/material';
import PendingIcon from '@mui/icons-material/Pending';
import partition from 'lodash/partition';
import { ResponsiveAlertActions } from '../../../../components/ResponsiveAlertActions';
import { Invitation } from '../../../../models/invitation';
import { useAuthentication } from '../../../../services/useAuthentication';

type PlayersPanelProps = {
  league: League;
  requestHook: UseRequest<LeagueInvitesResponse>;
  refetch: () => void;
};
export const PlayersPanel: React.FC<PlayersPanelProps> = ({ league, requestHook, refetch }) => {
  const { data, isLoading } = requestHook;
  const { post: refreshInvite, isLoading: refreshInviteLoading } = useRequest<CreateInviteResponse>();
  const { post: deleteInvite, isLoading: deleteInviteLoading } = useRequest<DeclineInviteResponse>();
  const { user } = useAuthentication();
  const isCreator = user?.username === league.creatorUsername;

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleResend = async (email: string) => {
    const response = await refreshInvite({
      endpoint: ENDPOINTS.createInvite,
      body: {
        leagueId: league._id,
        email,
      },
    });
    if (!response.success) {
      setSnackbarMessage(`Invite failed: ${response.message}`);
      setSnackbarOpen(true);
    } else {
      refetch();
    }
  };

  const handleDelete = async (inviteId: string) => {
    const response = await deleteInvite({
      endpoint: ENDPOINTS.declineInvite,
      body: {
        inviteId,
      },
    });
    if (!response.success) {
      setSnackbarMessage(`Invite failed: ${response.message}`);
      setSnackbarOpen(true);
    } else {
      refetch();
    }
  };

  if (isLoading || refreshInviteLoading || deleteInviteLoading || !data) {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Box>
    );
  }

  const items: { status: 'accepted' | 'invited' | 'empty'; content: string | null; invite?: Invitation }[] = [];

  league.playerUsernames.forEach(username => {
    items.push({ status: 'accepted', content: username });
  });

  const [unexpiredInvites, expiredInvites] = partition(data.invites, invite => {
    return Date.now() < Number(invite.expiresAt);
  });

  unexpiredInvites.forEach(invite => {
    items.push({ status: 'invited', content: invite.email, invite });
  });

  const emptySlotCount = league.playerCapacity - items.length;

  for (let i = 0; i < emptySlotCount; i++) {
    items.push({ status: 'empty', content: null });
  }

  const playerSlotsComponent = (
    <Stack spacing={2}>
      {items.map((item, index) => {
        const { status, content } = item;
        if (status === 'accepted') {
          return (
            <Alert key={`player${index}`} variant={'outlined'} severity={'success'}>
              <strong>{`Player ${index + 1} - `}</strong>
              {`${content} has joined the league`}
            </Alert>
          );
        } else if (status === 'invited') {
          return (
            <Alert
              key={`player${index}`}
              variant={'outlined'}
              severity={'warning'}
              icon={<PendingIcon />}
              action={
                isCreator ? (
                  <ResponsiveAlertActions>
                    <Button variant={'contained'} onClick={() => handleResend(item.content!)}>
                      Resend
                    </Button>
                    <span style={{ width: 8 }} />
                    <Button variant={'contained'} color={'error'} onClick={() => handleDelete(item.invite!._id)}>
                      Revoke
                    </Button>
                  </ResponsiveAlertActions>
                ) : undefined
              }>
              <strong>{`Player ${index + 1} - `}</strong>
              {`Waiting for ${content} to accept invitation`}
            </Alert>
          );
        } else {
          return (
            <Alert key={`player${index}`} variant={'outlined'} severity={'info'}>
              <strong>{`Player ${index + 1} - `}</strong>
              {'Awaiting Player'}
            </Alert>
          );
        }
      })}
    </Stack>
  );

  const getExpiredInvites = () => {
    if (!expiredInvites.length) {
      return <></>;
    }

    return (
      <>
        <h3>Expired Invites</h3>
        {expiredInvites.map((invite, index) => {
          return (
            <Alert
              key={`expired${index}`}
              severity={'error'}
              action={
                isCreator ? (
                  <ResponsiveAlertActions>
                    <Button variant={'outlined'} color={'success'} onClick={() => handleResend(invite.email)}>
                      Resend
                    </Button>
                    <span style={{ width: 8 }} />
                    <Button variant={'outlined'} color={'error'} onClick={() => handleDelete(invite._id)}>
                      Cancel
                    </Button>
                  </ResponsiveAlertActions>
                ) : undefined
              }>
              {`The invite for ${invite.email} has expired.`}
            </Alert>
          );
        })}
      </>
    );
  };

  return (
    <>
      {playerSlotsComponent}
      {getExpiredInvites()}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity='error' elevation={6} variant='filled'>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
