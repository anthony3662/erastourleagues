import * as React from 'react';
import { Trade } from '../../../../../models/trade';
import { ButtonRow, Thumbnail, ThumbnailRow, Wrapper } from './OfferCard.styles';
import { Dialog, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import { Outfit } from '../../../../../models/outfit';
import { OutfitDetailDialog } from '../../../../../components/OutfitDetailDialog';
import { useAuthentication } from '../../../../../services/useAuthentication';
import { LoadingButton } from '@mui/lab';
import { useGameboardContext } from '../useGameboardContext';
import keyBy from 'lodash/keyBy';
import { usePublicData } from '../../../../../services/usePublicData';
import { useRequest } from '../../../../../utils/useRequest';
import {
  AcceptTradeParams,
  AcceptTradeResponse,
  DeleteTradesParams,
  DeleteTradesResponse,
  ENDPOINTS,
} from '../../../../../constants/endpoints';

export const OfferCard: React.FC<{ trade: Trade; refetchList: () => void }> = ({ trade, refetchList }) => {
  const { senderUsername, recipientUsername, myPayment, recipientPayment, expiresAt } = trade;
  const { currentLineups, loadExecutedTrade } = useGameboardContext();
  const { transactionsLocked } = usePublicData();
  const { user } = useAuthentication();
  const [openOutfit, setOpenOutfit] = useState<Outfit | null>(null);

  const { post: postDelete, isLoading: isDeleteLoading } = useRequest<DeleteTradesResponse, DeleteTradesParams>();
  const { post: postAccept, isLoading: isAcceptLoading } = useRequest<AcceptTradeResponse, AcceptTradeParams>();

  if (!currentLineups || !user) {
    return <></>;
  }

  const checkLineupValidity = () => {
    const keyedLineups = keyBy(currentLineups, 'username');
    const senderLineup = keyedLineups[senderUsername];
    const recipientLineup = keyedLineups[recipientUsername];

    const senderOutfits = [...senderLineup.starters.map(v => v._id), ...senderLineup.bench.map(v => v._id)];
    const recipientOutfits = [...recipientLineup.starters.map(v => v._id), ...recipientLineup.bench.map(v => v._id)];

    const isSenderLineupValid = myPayment.every(({ _id }) => senderOutfits.includes(_id));
    const isRecipientLineupValid = recipientPayment.every(({ _id }) => recipientOutfits.includes(_id));

    return isSenderLineupValid && isRecipientLineupValid;
  };

  const areLineupsValid = checkLineupValidity();
  const isTradeExecutable = checkLineupValidity() && !transactionsLocked;
  const isRequestLoading = isDeleteLoading || isAcceptLoading;

  const redButton = () => {
    if (user!.username !== senderUsername && user!.username !== recipientUsername) {
      return <></>;
    }

    return (
      <LoadingButton
        loading={isRequestLoading}
        variant={'contained'}
        color={'error'}
        onClick={async () => {
          await postDelete({
            endpoint: ENDPOINTS.deleteTrade,
            body: { tradeId: trade._id },
          });
          refetchList();
        }}>
        {user!.username === senderUsername ? 'Withdraw' : 'Reject'}
      </LoadingButton>
    );
  };

  const greenButton = () => {
    if (user!.username !== recipientUsername) {
      return <></>;
    }

    return (
      <LoadingButton
        loading={isRequestLoading}
        disabled={!isTradeExecutable}
        variant={'contained'}
        color={'success'}
        onClick={async () => {
          const response = await postAccept({
            endpoint: ENDPOINTS.acceptTrade,
            body: { tradeId: trade._id },
          });
          const { newSenderLineup, newRecipientLineup } = response;
          if (newSenderLineup && newRecipientLineup) {
            loadExecutedTrade(newSenderLineup, newRecipientLineup);
          }
          refetchList();
        }}>
        Accept
      </LoadingButton>
    );
  };

  return (
    <>
      <Wrapper>
        <Typography variant={'body1'}>{`${senderUsername} offers a trade to ${recipientUsername}!`}</Typography>
        <Typography variant={'h6'} sx={{ color: 'primary.dark' }}>{`${recipientUsername} Receives`}</Typography>
        <ThumbnailRow>
          {myPayment.map(o => (
            <Thumbnail src={o.image} onClick={() => setOpenOutfit(o)} />
          ))}
        </ThumbnailRow>
        <Divider sx={{ marginTop: 1.5 }} />
        <Typography variant={'h6'} sx={{ color: 'primary.dark' }}>{`${senderUsername} Receives`}</Typography>
        <ThumbnailRow>
          {recipientPayment.map(o => (
            <Thumbnail src={o.image} onClick={() => setOpenOutfit(o)} />
          ))}
        </ThumbnailRow>
        <Typography variant={'body2'}>{`Valid until ${new Date(Number(trade.expiresAt)).toLocaleString()}`}</Typography>
        {transactionsLocked ? <Typography variant={'body2'}>Trades cannot be executed while Taylor is performing.</Typography> : null}
        {!areLineupsValid ? (
          <Typography variant={'body2'} color={'error'}>
            This trade cannot be executed due to prior trades that have been made.
          </Typography>
        ) : null}
        <ButtonRow>
          {redButton()}
          {greenButton()}
        </ButtonRow>
      </Wrapper>
      <Dialog fullWidth maxWidth={'md'} open={Boolean(openOutfit)} onClose={() => setOpenOutfit(null)}>
        {openOutfit ? <OutfitDetailDialog outfit={openOutfit} onBack={() => setOpenOutfit(null)} /> : null}
      </Dialog>
    </>
  );
};
