import * as React from 'react';
import { useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { League } from '../../../../models/league';
import { useAuthentication } from '../../../../services/useAuthentication';
import { Alert, AlertTitle, Button } from '@mui/material';
import { ScheduleDraftWrapper } from './ScheduleDraft.styles';
import { useRequest } from '../../../../utils/useRequest';
import { ENDPOINTS, ScheduleDraftResponse } from '../../../../constants/endpoints';
import { LoadingButton } from '@mui/lab';

export const ScheduleDraft: React.FC<{ league: League; refetch: () => void }> = ({ league, refetch }) => {
  const { user } = useAuthentication();
  const isCreator = user?.username === league.creatorUsername;

  const roundedMinutes = Math.ceil(moment().add(15, 'minutes').minute() / 5) * 5;
  const initialDateTime = moment().add(15, 'minutes').startOf('hour').add(roundedMinutes, 'minutes');
  const [selectedDateTime, setSelectedDateTime] = useState(initialDateTime);

  const [dateError, setDateError] = useState('');

  const [showRescheduleInput, setShowRescheduleInput] = useState(false);

  const { post, isLoading } = useRequest<ScheduleDraftResponse>();
  const handleSchedule = async () => {
    const unixMills = selectedDateTime.unix() * 1000;
    if (unixMills <= Date.now() + 15 * 60 * 1000) {
      setDateError('Please choose a time >15 minutes away.');
    } else {
      setDateError('');
    }
    await post({
      endpoint: ENDPOINTS.scheduleDraft,
      body: {
        time: unixMills,
        leagueId: league._id,
      },
    });
    refetch();
  };

  const askCreatorAlert = (
    <>
      <h2>Awaiting Draft</h2>
      <Alert severity={'info'}>Please ask the league creator to schedule the draft.</Alert>
    </>
  );

  const ScheduleDraftInterface = (
    <ScheduleDraftWrapper>
      <h2>{showRescheduleInput ? 'Reschedule Draft' : 'Schedule Draft'}</h2>
      <DateTimePicker
        label='Choose draft date and time'
        value={selectedDateTime}
        onChange={newDateTime => {
          newDateTime && setSelectedDateTime(newDateTime);
        }}
        disablePast
        minutesStep={5}
        minDateTime={initialDateTime}
        slotProps={{
          textField: {
            helperText: dateError,
          },
        }}
      />
      <LoadingButton loading={isLoading} variant={'contained'} onClick={handleSchedule}>
        Schedule Draft
      </LoadingButton>
    </ScheduleDraftWrapper>
  );

  if (league.draftTime) {
    return (
      <>
        <Alert severity={'success'} action={isCreator ? <Button onClick={() => setShowRescheduleInput(v => !v)}>Reschedule</Button> : null}>
          {`Your draft is scheduled at ${moment(Number(league.draftTime)).format(
            'LLL',
          )}. This page will automatically refresh when it's time.`}
        </Alert>
        {showRescheduleInput ? ScheduleDraftInterface : null}
      </>
    );
  } else {
    return isCreator ? ScheduleDraftInterface : askCreatorAlert;
  }
};
