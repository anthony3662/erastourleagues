import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState } from 'react';
import { League } from '../../../../models/league';
import { Alert, AlertTitle, InputAdornment, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { InviteBoxWrapper } from './InviteBox.styles';
import { LoadingButton } from '@mui/lab';
import { useRequest } from '../../../../utils/useRequest';
import { CreateInviteResponse, ENDPOINTS } from '../../../../constants/endpoints';
import { useAuthentication } from '../../../../services/useAuthentication';

export const InviteBox: React.FC<{ league: League; refetch: () => void }> = ({ league, refetch }) => {
  const [email, setEmail] = useState('');
  const { user } = useAuthentication();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const { post, isLoading, data } = useRequest<CreateInviteResponse>();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePost = async () => {
    const response = await post({
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

  const isInputValid = emailRegex.test(email);

  const isCreator = user?.username === league.creatorUsername;

  const InvitePlayerInterface = (
    <InviteBoxWrapper>
      <h2>Invite Player</h2>
      <TextField
        fullWidth
        label='Invitee email'
        value={email}
        InputProps={{
          endAdornment: isInputValid ? (
            <InputAdornment position={'end'}>
              <CheckCircleIcon color={'success'} />
            </InputAdornment>
          ) : null,
        }}
        onChange={event => setEmail(event.target.value)}
      />
      <LoadingButton variant='contained' onClick={handlePost} disabled={!isInputValid} loading={isLoading}>
        Invite User
      </LoadingButton>
      {data?.success === false ? (
        <Alert severity='error'>
          <AlertTitle>Oops</AlertTitle>
          {data.message}
        </Alert>
      ) : null}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity='error' elevation={6} variant='filled'>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </InviteBoxWrapper>
  );

  const askCreatorAlert = (
    <>
      <h2>Awaiting Players</h2>
      <Alert severity={'info'}>The league creator can send and manage invites, then schedule a draft once all players have accepted.</Alert>
    </>
  );

  return isCreator ? InvitePlayerInterface : askCreatorAlert;
};
