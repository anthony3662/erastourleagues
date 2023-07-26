import * as React from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';
import { ROUTES } from '../../routes/constants';
import { useNavigate } from 'react-router-dom';

const Image = styled.img`
  width: 100%;
  max-width: 450px;
  aspect-ratio: 1/1;
  object-fit: cover;
  padding: 16px;
`;
export const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 32 }}>
      <Typography gutterBottom variant={'h4'} sx={{ color: 'primary.dark' }}>
        About the Developer
      </Typography>
      <Typography gutterBottom>
        Hi, I'm Anthony! I've been a Swiftie for 9 years and I'm thrilled to bring you erastourleagues.com, a fan project dedicated to
        Taylor Swift and her amazing music.
      </Typography>
      <Typography gutterBottom>
        As a devoted fan, I've had the incredible opportunity to attend every tour since the 1989 tour. My favorite songs include Cruel
        Summer, Blank Space, and Hits Different. I'm always singing Taylor's songs, I can sing Cruel Summer without sounding like a dying
        cat!
      </Typography>
      {/*<Typography gutterBottom>I have two unicorn tattoos - </Typography>*/}
      {/*<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>*/}
      {/*</div>*/}
      <Typography gutterBottom>
        Apart from my passion for Taylor Swift and her music, I'm an experienced software engineer. After being laid off, I decided to
        channel my skills and spare time into building ErasTourLeagues for fellow Swifties to enjoy. If you're hiring, please email
        erastourleagues@gmail.com from a work email domain.
      </Typography>
      <Typography gutterBottom>
        Supporting Erastourleagues helps us offer better prizes! Visit{' '}
        <Button onClick={() => navigate(ROUTES.supportUs)}>Support Us</Button> to donate money, merch, or concert tickets.
      </Typography>
      <Typography>IG/Twitter - caticorn2015</Typography>
      <Typography>Github - anthony3662</Typography>
    </div>
  );
};
