import * as React from 'react';
import { useGameboardContext } from '../useGameboardContext';
import { useAuthentication } from '../../../../../services/useAuthentication';
import { Avatar, Backdrop, Chip, CircularProgress, Typography } from '@mui/material';
import { AvatarURLS } from '../../../../../constants/avatar';
import { AvatarsRow, Panel } from './TradesList.styles';
import { Trade } from '../../../../../models/trade';
import { OfferCard } from './OfferCard';

type TradesListProps = {
  setOfferingTo: (username: string) => void;
  trades?: Trade[];
  refetch: () => void;
};
export const TradesList: React.FC<TradesListProps> = ({ setOfferingTo, trades, refetch }) => {
  const { users } = useGameboardContext();
  const { user } = useAuthentication();

  if (!users || !user || !trades) {
    return (
      <Backdrop sx={{ color: '#fff' }} open={true}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  const leagueMates = { ...users };
  delete leagueMates[user.username];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Panel>
        <Typography gutterBottom variant={'h5'} sx={{ color: 'primary.dark' }}>
          Propose trade with
        </Typography>
        <AvatarsRow>
          {Object.values(leagueMates).map(u => (
            <Chip
              onClick={() => setOfferingTo(u.username)}
              variant={'outlined'}
              label={u.username}
              avatar={<Avatar src={AvatarURLS[u.avatar]} />}
            />
          ))}
        </AvatarsRow>
      </Panel>
      {trades.map(trade => (
        <OfferCard refetchList={refetch} trade={trade} />
      ))}
    </div>
  );
};
