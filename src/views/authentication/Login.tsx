import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useAuthentication } from '../../services/useAuthentication';
import { Alert, Box, Button, Typography } from '@mui/material';
import { styled as mStyled } from '@mui/material/styles';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/constants';
import { useQueryParams } from '../../utils/useQueryParams';

// Custom styled button
const LoginBox = mStyled(Box)`
  padding: 24px;
  border-radius: 12px;
  border: solid 2px ${({ theme }) => theme.palette.primary.dark}
`;

const LoginImage = styled.img`
  width: 100%;
  border-radius: 12px;
  margin-top: 24px;
`;

export const Login = () => {
  const { login, validateSession } = useAuthentication();
  const navigate = useNavigate();
  const { queryParams } = useQueryParams();
  const { invitationToken } = queryParams;
  const handleCallbackResponse = (response: any) => {
    const jwt: string = response.credential;
    login(jwt);
  };

  const init = async () => {
    const isCookieValid = await validateSession();
    if (isCookieValid) {
      return; // authentication service will nav to correct page
    }

    /* global google */ // @ts-ignore
    google.accounts.id.initialize({
      client_id: '465736712882-eoqteedshsrd37cj2mhkeahurnj0j8af.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    });
    /* global google */ // @ts-ignore
    google.accounts.id.renderButton(document.getElementById('signInDiv'), { theme: 'outline', size: 'large' });
  };

  useEffect(() => {
    init();
  }, []);

  const getRandomImage = () => {
    const images = [
      'https://swiftball-static.s3.us-east-2.amazonaws.com/static/loginBanner0.webp',
      'https://swiftball-static.s3.us-east-2.amazonaws.com/static/loginBanner1.png',
      'https://swiftball-static.s3.us-east-2.amazonaws.com/static/loginBanner2.webp',
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const imageRef = useRef(getRandomImage());

  return (
    <div style={{ padding: 32 }}>
      <Typography variant='h4' color={'primary.dark'} gutterBottom>
        Welcome to Eras Tour Leagues!
      </Typography>
      {invitationToken ? (
        <Alert severity={'success'}>
          You've been invited to a league! You'll be able to accept this invitation on the home page after logging in or signing up!
        </Alert>
      ) : null}
      <Typography variant={'h6'} color={'primary.dark'} gutterBottom>
        Taylor Swift Eras Tour Fantasy Leagues
      </Typography>
      <Typography style={{ textAlign: 'justify' }} variant={'body1'} color={'primary.dark'} gutterBottom>
        Prizes are suspended and social media promotion will be limited because we are facing litigation. I simply don't have the mental
        bandwidth to do any of that right now. Additionally, donations are suspended to prevent doxxing. We believe the case has no merit
        and have decided to continue operating the platform. Frivolous litigation is damaging to the fan community as a whole and we condemn
        the actions that were taken against us. We give fans the most advanced features currently available, including leagues, drafts,
        matchups, win-loss records, leaderboards, real time updates, live scoring, and much more. I will fight against any efforts made to
        keep you from using this platform.
        <br />
        <br />
        Read our full statement here:{' '}
        <Button sx={{ color: 'blue' }} onClick={() => navigate(ROUTES.litigation)}>
          Statement on Litigation
        </Button>
      </Typography>
      <LoginBox>
        <Typography variant='body1' color={'primary.dark'} gutterBottom>
          {'Please sign in to continue. More login methods coming in the future!'}
        </Typography>
        <div id={'signInDiv'} />
      </LoginBox>
      <LoginImage src={imageRef.current} alt={'easter-eggs'} />
    </div>
  );
};
