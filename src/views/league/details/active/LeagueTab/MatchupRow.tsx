import * as React from 'react';
import { User } from '../../../../../models/user';
import { Lineup } from '../../../../../models/lineup';
import { Container, PlayerAvatar, PlayerBox, PlayerDetails } from './MatchupRow.styles';
import { AvatarURLS } from '../../../../../constants/avatar';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTheme } from '@mui/material/styles';
import { useGameboardContext } from '../useGameboardContext';
import { Outfit } from '../../../../../models/outfit';
import { OutfitDetailDialog } from '../../../../../components/OutfitDetailDialog';
import { MatchupPanel } from '../../../components/MatchupPanel';

export type PlayerConfig = {
  user: User;
  lineup: Lineup;
};

export type MatchupRowProps = { matchup: [PlayerConfig, PlayerConfig] };
export const MatchupRow: React.FC<MatchupRowProps> = ({ matchup }) => {
  const { width } = useWindowSize();
  const theme = useTheme();
  const { scoreLineup, records } = useGameboardContext();
  const [player1, player2] = matchup;

  const [modalOpen, setModalOpen] = useState(false);
  const [outfitDetailOpen, setOutfitDetailOpen] = useState<Outfit | null>(null);

  useEffect(() => {
    if (!modalOpen) {
      setOutfitDetailOpen(null);
    }
  }, [modalOpen]);

  const player1Score = scoreLineup(player1.lineup);
  const player2Score = scoreLineup(player2.lineup);
  // need to come back and add W-L support
  const getPlayerBoxOne = () => {
    const playerRecord = records?.[player1.user.username];
    const { win, loss, tie } = playerRecord || {};
    return (
      <PlayerBox style={{ border: `solid 1px ${theme.palette.primary.main}` }}>
        <PlayerDetails>
          <PlayerAvatar
            src={AvatarURLS[player1.user.avatar]}
            isWinning={(function () {
              if (player1Score === player2Score) {
                return undefined;
              } else {
                return player1Score > player2Score;
              }
            })()}
          />
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: width < 576 ? '100%' : undefined }}>
            <b style={{ color: theme.palette.primary.main }}>{player1.user.username}</b>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <small>{`${win}-${loss}-${tie}`}</small>
              <b style={{ color: player1Score > player2Score ? 'limegreen' : theme.palette.primary.main }}>{player1Score || '-'}</b>
            </div>
          </div>
        </PlayerDetails>
      </PlayerBox>
    );
  };

  const getPlayerBoxTwo = () => {
    const playerRecord = records?.[player2.user.username];
    const { win, loss, tie } = playerRecord || {};
    return (
      <PlayerBox style={{ border: `solid 1px ${theme.palette.primary.main}` }}>
        <PlayerDetails style={{ flexWrap: 'wrap-reverse' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'right',
              flexGrow: 1,
              alignItems: 'flex-end',
              width: width < 576 ? '100%' : undefined,
            }}>
            <b style={{ color: theme.palette.primary.main }}>{player2.user.username}</b>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <b style={{ color: player2Score > player1Score ? 'limegreen' : theme.palette.primary.main }}>{player2Score || '-'}</b>
              <small>{`${win}-${loss}-${tie}`}</small>
            </div>
          </div>
          <PlayerAvatar
            src={AvatarURLS[player2.user.avatar]}
            isWinning={(function () {
              if (player1Score === player2Score) {
                return undefined;
              } else {
                return player2Score > player1Score;
              }
            })()}
            style={{ marginLeft: 'auto' }}
          />
        </PlayerDetails>
      </PlayerBox>
    );
  };

  const handleOpenOutfitDetail = (outfit: Outfit) => {
    setOutfitDetailOpen(outfit);
  };

  const mainDialogChildren = (
    <>
      <DialogTitle sx={width < 576 ? { paddingLeft: 1, paddingRight: 1, color: 'primary.main' } : { color: 'primary.main' }}>
        <b>Lineups</b>
      </DialogTitle>
      <DialogContent sx={width < 576 ? { padding: 1 } : {}}>
        <MatchupPanel matchup={matchup} onOutfitClick={handleOpenOutfitDetail} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Close</Button>
      </DialogActions>
    </>
  );

  return (
    <>
      <Container onClick={() => setModalOpen(true)}>
        {getPlayerBoxOne()}
        {getPlayerBoxTwo()}
      </Container>
      <Dialog fullWidth maxWidth='md' open={modalOpen} onClose={() => setModalOpen(false)}>
        {outfitDetailOpen ? <OutfitDetailDialog outfit={outfitDetailOpen} onBack={() => setOutfitDetailOpen(null)} /> : mainDialogChildren}
      </Dialog>
    </>
  );
};
