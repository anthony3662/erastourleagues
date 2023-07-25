import * as React from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import { Breakpoints } from '../../../theme/breakpoints';
import { Step, StepLabel, Stepper } from '@mui/material';

export const ProgressBar: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const { width } = useWindowSize();
  return (
    <Stepper activeStep={activeStep} orientation={width < Breakpoints.sm ? 'vertical' : 'horizontal'}>
      <Step key={'create'}>
        <StepLabel>Create League</StepLabel>
      </Step>
      <Step key={'invite'}>
        <StepLabel>Invite Friends</StepLabel>
      </Step>
      <Step key={'draft'}>
        <StepLabel>Draft Roster</StepLabel>
      </Step>
    </Stepper>
  );
};
