import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { ROUTES } from '../../routes/constants';
import { getRandomMirrorball } from '../../img/getRandomMirrorball';

export const CreateLeagueCard = () => {
  const navigate = useNavigate();
  const imageRef = useRef(getRandomMirrorball());
  return (
    <Card sx={{ width: 225 }}>
      <CardActionArea onClick={() => navigate(ROUTES.createLeague)}>
        <CardMedia component='img' height='140' image={imageRef.current} alt='mirror ball' />
        <CardContent>
          <Typography sx={{ color: 'primary.dark' }} gutterBottom variant='h5' component='div'>
            Create a League
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Create a new 4 player league! Invite your friends, schedule your draft, have fun!
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
