import * as React from 'react';
import { usePublicData } from '../../services/usePublicData';
import { useTheme } from '@mui/material/styles';
import { CardWrapper, Title, Wrapper } from './ConcertsHome.styles';
import { Button, Card, CardActionArea, CardContent, CardMedia, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { Concert } from '../../models/concert';
import { useState } from 'react';
import { ConcertDialog } from './ConcertDialog';

export const ConcertsHome: React.FC = () => {
  const theme = useTheme();
  const { concerts, currentConcert } = usePublicData();

  const [openConcert, setOpenConcert] = useState<Concert | null>(null);
  const [regionFilter, setRegionFilter] = useState<Concert['region'] | 'all'>('all');

  if (!concerts) {
    return <></>;
  }

  const getFilteredConcerts = () => {
    if (regionFilter === 'all') {
      return concerts;
    }
    return concerts.filter(c => c.region === regionFilter);
  };

  return (
    <>
      <Wrapper style={{ color: theme.palette.primary.dark }}>
        <Title>
          <Typography variant={'h4'} sx={{ color: 'primary.dark' }}>
            Concerts
          </Typography>
        </Title>
        <FormControl fullWidth>
          <InputLabel id={'region-select-label'}>Region</InputLabel>
          <Select
            labelId={'region-select-label'}
            id={'region-select'}
            label={'Region'}
            value={regionFilter}
            onChange={event => setRegionFilter(event.target.value as Concert['region'] | 'all')}>
            <MenuItem value={'all'}>All</MenuItem>
            <MenuItem value={'usa'}>USA</MenuItem>
            <MenuItem value={'latam'}>Latin America</MenuItem>
            <MenuItem value={'europe'}>Europe</MenuItem>
            <MenuItem value={'asia'}>Asia</MenuItem>
            <MenuItem value={'oceania'}>Oceania</MenuItem>
          </Select>
        </FormControl>
        <Button sx={{ marginTop: 2, marginBottom: 3 }} fullWidth variant={'contained'} onClick={() => setOpenConcert(currentConcert)}>
          View Current/Next Concert
        </Button>
        <CardWrapper>
          {getFilteredConcerts().map(concert => (
            <Card key={concert.increasingId} sx={{ width: 225 }}>
              <CardActionArea onClick={() => setOpenConcert(concert)}>
                <CardMedia component={'img'} height={'200'} image={concert.image} />
                <CardContent>
                  <Typography
                    variant={'h5'}
                    sx={{ color: 'primary.dark' }}
                    gutterBottom>{`${concert.city} Night ${concert.night}`}</Typography>
                  <Typography variant={'body1'} gutterBottom sx={{ color: 'primary.main' }}>
                    {new Date(Number(concert.startTime)).toLocaleString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </CardWrapper>
      </Wrapper>
      <ConcertDialog onClose={() => setOpenConcert(null)} openConcert={openConcert} />
    </>
  );
};
