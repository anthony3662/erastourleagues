import * as React from 'react';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  Backdrop,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ROUTES } from '../../routes/constants';
import { Concert } from '../../models/concert';
import { usePublicData } from '../../services/usePublicData';

export const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const { concerts, currentConcert, outfits, surpriseSongs, initialize, isLoading } = usePublicData();

  if (isLoading || !concerts) {
    return (
      <Backdrop sx={{ color: '#fff' }} open={true}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  const getFilteredConcerts = () => {
    if (filter === 'all') {
      return concerts;
    }

    return concerts.filter(concert => concert.region === filter);
  };

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (!newFilter) {
      setFilter('all');
    } else {
      setFilter(newFilter);
    }
  };

  const navigateToConcert = (concert: Concert) => {
    navigate(generatePath(ROUTES.admin.concert, { id: concert.increasingId }), { state: { outfits, concert, surpriseSongs } });
  };

  return (
    <div>
      {currentConcert ? (
        <div style={{ padding: 16 }}>
          <Button fullWidth variant='contained' onClick={() => navigateToConcert(currentConcert)}>
            Current/Next Concert
          </Button>
        </div>
      ) : null}
      <ToggleButtonGroup value={filter} exclusive onChange={handleFilterChange}>
        <ToggleButton value={'all'}>All</ToggleButton>
        <ToggleButton value={'usa'}>USA</ToggleButton>
        <ToggleButton value={'latam'}>LATAM</ToggleButton>
        <ToggleButton value={'europe'}>EUR</ToggleButton>
        <ToggleButton value={'asia'}>Asia</ToggleButton>
        <ToggleButton value={'oceania'}>Oceania</ToggleButton>
      </ToggleButtonGroup>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Night</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredConcerts().map(concert => (
              <TableRow key={concert.startTime} sx={{ cursor: 'pointer' }} onClick={() => navigateToConcert(concert)}>
                <TableCell>{new Date(Number(concert.startTime)).toDateString()}</TableCell>
                <TableCell>{concert.city}</TableCell>
                <TableCell>{concert.night}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
