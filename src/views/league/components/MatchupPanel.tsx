import * as React from 'react';
import { SurpriseSongsBox } from '../details/active/LeagueTab/SurpriseSongsBox';
import { OutfitEntry } from '../details/active/LeagueTab/OutfitEntry';
import { User } from '../../../models/user';
import { Lineup } from '../../../models/lineup';
import { useGameboardContext } from '../details/active/useGameboardContext';
import { Outfit } from '../../../models/outfit';
import { useTheme } from '@mui/material/styles';
import { Column, Wrapper } from './MatchupPanel.styles';

type PlayerConfig = {
  user: User;
  lineup: Lineup;
};
export const MatchupPanel: React.FC<{ matchup: [PlayerConfig, PlayerConfig]; onOutfitClick: (outfit: Outfit) => void }> = ({
  matchup,
  onOutfitClick,
}) => {
  const { scoreLineup } = useGameboardContext();
  const theme = useTheme();

  const [player1, player2] = matchup;
  const player1Score = scoreLineup(player1.lineup);
  const player2Score = scoreLineup(player2.lineup);

  return (
    <Wrapper>
      <Column>
        <b style={{ color: player1Score > player2Score ? 'limegreen' : theme.palette.primary.main }}>{player1.user.username}</b>
        <b style={{ fontSize: 32, color: player1Score > player2Score ? 'limegreen' : theme.palette.primary.main }}>{player1Score || '-'}</b>
        <SurpriseSongsBox lineup={player1.lineup} />
        <h5>Starters</h5>
        {player1.lineup.starters.map(outfit => (
          <OutfitEntry onClick={() => onOutfitClick(outfit)} outfit={outfit} isStarter={true} />
        ))}
        <h5>Bench</h5>
        {player1.lineup.bench.map(outfit => (
          <OutfitEntry onClick={() => onOutfitClick(outfit)} outfit={outfit} isStarter={false} />
        ))}
      </Column>
      <Column style={{ alignItems: 'flex-end' }}>
        <b style={{ color: player2Score > player1Score ? 'limegreen' : theme.palette.primary.main }}>{player2.user.username}</b>
        <b style={{ fontSize: 32, color: player2Score > player1Score ? 'limegreen' : theme.palette.primary.main }}>{player2Score || '-'}</b>
        <SurpriseSongsBox lineup={player2.lineup} />
        <h5>Starters</h5>
        {player2.lineup.starters.map(outfit => (
          <OutfitEntry onClick={() => onOutfitClick(outfit)} outfit={outfit} isStarter={true} />
        ))}
        <h5>Bench</h5>
        {player2.lineup.bench.map(outfit => (
          <OutfitEntry onClick={() => onOutfitClick(outfit)} outfit={outfit} isStarter={false} />
        ))}
      </Column>
    </Wrapper>
  );
};
