import * as React from 'react';
import { Typography } from '@mui/material';

export const SupportUs = () => {
  return (
    <div style={{ padding: 32 }}>
      <Typography variant={'h4'} gutterBottom color={'primary.dark'}>
        Support Us
      </Typography>
      <a href={'/'}>
        <img
          style={{ marginTop: 32, marginBottom: 32 }}
          src={'https://swiftball-static.s3.us-east-2.amazonaws.com/static/venmo.png'}
          width={250}
        />
      </a>
      <Typography variant={'body1'} gutterBottom>
        You can support us by donating money, merch, or concert tickets. To donate merch or tickets, please email{' '}
        <a href='mailto:erastourleagues@gmail.com'>erastourleagues@gmail.com</a>.
      </Typography>
      <Typography variant={'body1'}>
        All tickets and merch we obtain will be given away to our players! You can also offer to sell us tickets at face value. This is a
        great way to ensure your spare tickets go to fellow Swifties who are passionate about the Eras tour. Erastourleagues is a fan
        project funded solely by donations. We are very grateful for your support, which helps us maintain the site and offer better prizes
        to our players.
      </Typography>
    </div>
  );
};
