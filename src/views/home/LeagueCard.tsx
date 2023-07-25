import * as React from 'react';
import { League } from '../../models/league';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { generatePath, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/constants';
import { getRandomMirrorball } from '../../img/getRandomMirrorball';
import { useRef } from 'react';

export const LeagueCard: React.FC<{ league: League }> = ({ league }) => {
  const navigate = useNavigate();
  const imageRef = useRef(getRandomMirrorball());

  const getStatusMessage = (league: League) => {
    if (league.status === 'predraft') {
      return league.playerCapacity === league.playerUsernames.length ? 'Ready for draft' : 'Awaiting players';
    } else if (league.status === 'drafting') {
      return 'Now drafting!';
    } else {
      return 'Active League';
    }
  };

  return (
    <Card sx={{ width: 225 }}>
      <CardActionArea onClick={() => navigate(generatePath(ROUTES.league.detail, { id: league._id }))}>
        <CardMedia component='img' height='140' image={imageRef.current} alt='mirror ball' />
        <CardContent>
          <Typography sx={{ color: 'primary.dark' }} gutterBottom variant='h5' component='div'>
            {league.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {getStatusMessage(league)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
