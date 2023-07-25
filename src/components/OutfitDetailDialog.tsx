import * as React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Outfit } from '../models/outfit';
import { AccordionDetails, Button, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { usePublicData } from '../services/usePublicData';
import { OutfitImage } from './OutfitDetailDialog.styles';
import { Accordion, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Note this does not include the Dialog wrapper.
 * This allows more customization of how its displayed.
 */
export const OutfitDetailDialog: React.FC<{ outfit: Outfit; onBack: () => void }> = ({ outfit, onBack }) => {
  const { concerts: allConcerts } = usePublicData();

  const getAppearances = () => {
    if (!allConcerts) {
      return <></>;
    }
    const matchingConcerts = allConcerts.filter(concert => concert.outfits.some(o => o._id === outfit._id));
    return matchingConcerts.map(concert => (
      <Typography gutterBottom>{`${concert.city} Night ${concert.night} ${new Date(
        Number(concert.startTime),
      ).toLocaleDateString()}`}</Typography>
    ));
  };

  return (
    <>
      <DialogTitle sx={{ color: 'primary.main', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <IconButton aria-label='back' color='primary' onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <b>{outfit.name}</b>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <OutfitImage src={outfit.image} />
        <Typography sx={{ color: 'primary.main' }} variant={'h5'}>{`Album - ${outfit.category}`}</Typography>
        <Typography sx={{ color: 'primary.main' }} variant={'h6'}>{`Point Value - ${outfit.pointValue}`}</Typography>
        <Typography variant={'body1'} sx={{ textAlign: 'justify' }}>
          {outfit.description}
        </Typography>
        <Accordion>
          <AccordionSummary
            sx={{ color: 'primary.contrastText', backgroundColor: 'primary.main', borderRadius: 1 }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls='outfit-appearances-content'
            id='outfit-appearances-header'>
            <Typography>Appearances</Typography>
          </AccordionSummary>
          <AccordionDetails>{getAppearances()}</AccordionDetails>
        </Accordion>
        <div style={{ height: 24 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onBack}>Back</Button>
      </DialogActions>
    </>
  );
};
