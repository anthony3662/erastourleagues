import * as React from 'react';
import { useState } from 'react';
import { useNavigate, generatePath } from 'react-router-dom';
import { Wrapper } from './CreateLeague.styles';
import { InputAdornment, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CreateLeagueResponse, ENDPOINTS } from '../../../constants/endpoints';
import { useRequest } from '../../../utils/useRequest';
import { LoadingButton } from '@mui/lab';
import { ROUTES } from '../../../routes/constants';
import { ProgressBar } from '../components/ProgressBar';

export const CreateLeague = () => {
  const [leagueName, setLeagueName] = useState('');
  const { post, isLoading } = useRequest<CreateLeagueResponse>();
  const navigate = useNavigate();

  const handlePost = async () => {
    const response = await post({
      endpoint: ENDPOINTS.createLeague,
      body: { leagueName: leagueName.trim() },
    }).catch();
    const newLeagueId = response.league['_id'];
    if (newLeagueId) {
      navigate(generatePath(ROUTES.league.detail, { id: newLeagueId }));
    }
  };

  const isInputValid = leagueName.trim().length >= 8;

  return (
    <Wrapper>
      <h1>Create League</h1>
      <ProgressBar activeStep={0} />
      <TextField
        fullWidth
        label='League Name'
        value={leagueName}
        InputProps={{
          endAdornment: isInputValid ? (
            <InputAdornment position={'end'}>
              <CheckCircleIcon color={'success'} />
            </InputAdornment>
          ) : null,
        }}
        onChange={event => {
          const sanitizedValue = event.target.value.replace(/[^a-zA-Z0-9 ]+/g, '').trimStart(); // Remove non-alphanumeric characters
          setLeagueName(sanitizedValue);
        }}
        helperText={isInputValid ? '' : '8 characters required'}
      />
      <LoadingButton variant='contained' onClick={handlePost} disabled={!isInputValid} loading={isLoading}>
        Create League
      </LoadingButton>
    </Wrapper>
  );
};
