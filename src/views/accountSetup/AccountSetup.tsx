import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuthentication } from '../../services/useAuthentication';
import { Button, Dialog, DialogActions, InputAdornment, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import debounce from 'lodash/debounce';
import { AccountSetupWrapper, HeaderRow } from './AccountSetup.styles';
import { AvatarSelection } from './AvatarSelection';
import { AVATARS } from '../../constants/avatar';
import { ENDPOINTS, UsernameCheckResponse } from '../../constants/endpoints';
import { useRequest } from '../../utils/useRequest';
import { LoadingButton } from '@mui/lab';
import { TermsOfUse } from '../about/TermsOfUse';
import { PrivacyPolicy } from '../about/PrivacyPolicy';

export const AccountSetup = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [avatar, setAvatar] = useState<AVATARS>(AVATARS.caticorn);

  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const { postAccountSetup } = useAuthentication();
  const { post, isLoading } = useRequest<UsernameCheckResponse>();

  const queryUsername = async () => {
    return await post({
      endpoint: ENDPOINTS.usernameCheck,
      body: { username },
    }).catch();
  };

  const checkUsernameAvailability = debounce(async () => {
    if (username.length >= 8) {
      const validationData = await queryUsername();
      if (!validationData.isValid) {
        setUsernameError('Nickname taken');
      } else {
        setUsernameError('');
      }
    }
  }, 600);

  useEffect(() => {
    checkUsernameAvailability();
  }, [username]);

  const handlePost = () => {
    try {
      postAccountSetup({ username, avatar }).catch(console.error);
      // authentication service will take user to home if successful
    } catch (e: any) {
      if (e.message === 'USERNAME_TAKEN') {
        setUsernameError('Nickname taken');
      } else {
        setUsernameError(e.message);
        console.error(e);
      }
    }
  };

  const getHelperText = () => {
    if (usernameError) {
      return usernameError;
    }
    return username.length >= 8 ? 'Nickname available' : '8 characters required';
  };

  const submitEnabled = getHelperText() === 'Nickname available';

  return (
    <AccountSetupWrapper>
      <HeaderRow>
        <Typography variant={'h5'} sx={{ whiteSpace: 'nowrap', color: 'primary.dark' }}>
          Welcome to Swiftball
        </Typography>
        <Typography variant={'h5'} sx={{ whiteSpace: 'nowrap', color: 'primary.dark' }} style={{ whiteSpace: 'nowrap' }}>
          Are you ready for it?
        </Typography>
      </HeaderRow>
      <TextField
        fullWidth
        label='Nickname'
        value={username}
        inputProps={{ maxLength: 16 }}
        InputProps={{
          endAdornment:
            getHelperText() === 'Nickname available' ? (
              <InputAdornment position={'end'}>
                <CheckCircleIcon color={'success'} />
              </InputAdornment>
            ) : null,
        }}
        onChange={event => {
          // alphanumeric only!
          const sanitizedValue = event.target.value.replace(/[^a-zA-Z0-9]+/g, ''); // Remove non-alphanumeric characters
          setUsername(sanitizedValue);
        }}
        error={!!usernameError}
        helperText={getHelperText()}
      />
      <AvatarSelection avatar={avatar} setAvatar={setAvatar} />
      <Typography gutterBottom sx={{ alignSelf: 'flex-start' }}>
        By creating an account, you agree with our <Button onClick={() => setTermsOpen(true)}>Terms of Use</Button> and{' '}
        <Button onClick={() => setPrivacyOpen(true)}>Privacy Policy</Button>.
      </Typography>
      <LoadingButton fullWidth variant='contained' onClick={handlePost} disabled={!submitEnabled} loading={isLoading}>
        Create Account
      </LoadingButton>
      <Dialog open={termsOpen} onClose={() => setTermsOpen(false)}>
        <TermsOfUse />
        <DialogActions>
          <Button onClick={() => setTermsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={privacyOpen} onClose={() => setPrivacyOpen(false)}>
        <PrivacyPolicy />
        <DialogActions>
          <Button onClick={() => setPrivacyOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </AccountSetupWrapper>
  );
};
