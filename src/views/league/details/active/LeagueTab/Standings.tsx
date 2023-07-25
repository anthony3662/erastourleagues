import * as React from 'react';
import { useGameboardContext } from '../useGameboardContext';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

export const Standings = () => {
  const { records } = useGameboardContext();

  if (!records) {
    return <></>;
  }

  const getEntries = () => {
    return Object.values(records).sort((a, b) => {
      const { win: winA, tie: tieA, seasonPoints: ptsA } = a;
      const { win: winB, tie: tieB, seasonPoints: ptsB } = b;

      const weightA = 2 * winA + tieA;
      const weightB = 2 * winB + tieB;

      if (weightB - weightA !== 0) {
        return weightB - weightA;
      }

      return ptsB - ptsA;
    });
  };

  return (
    <>
      <Typography variant={'h5'} color={'primary.dark'}>
        Standings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Win</TableCell>
              <TableCell>Loss</TableCell>
              <TableCell>Tie</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getEntries().map(entry => (
              <TableRow key={entry.username}>
                <TableCell>{entry.username}</TableCell>
                <TableCell>{entry.win}</TableCell>
                <TableCell>{entry.loss}</TableCell>
                <TableCell>{entry.tie}</TableCell>
                <TableCell>{entry.seasonPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
