import { Draft } from '../../../../models/draft';
import { League } from '../../../../models/league';
import { useAuthentication } from '../../../../services/useAuthentication';

export const useTimer: (league: League, draft: Draft | null) => { timerSeconds: number; timerTitle: string } = (league, draft) => {
  const { user } = useAuthentication();
  if (!draft) {
    // parent should have loading state here
    return {
      timerTitle: '-',
      timerSeconds: 0,
    };
  }

  const turnAllowance = 30; // TODO production is 30

  const pickNumbers = Object.keys(draft.picks);

  if (!pickNumbers.length) {
    const firstLogMessage = draft.log[0]?.split('|')?.[1];
    if (draft.log.length === 1 && firstLogMessage === 'Draft starts in 5 minutes') {
      const firstLogTime = Number(draft.log[0].split('|')[0]);
      return {
        timerTitle: 'Draft starts in a few minutes',
        timerSeconds: 300 - (Date.now() - firstLogTime) / 1000,
      };
    }
  }
  const currentPickNumber = pickNumbers.length + 1; // Next pick number
  const leagueMembers = league.playerUsernames;
  const playerToPick = leagueMembers[(currentPickNumber - 1) % leagueMembers.length];
  const isCurrentUserTurn = leagueMembers[(currentPickNumber - 1) % leagueMembers.length] === user!.username;

  if (currentPickNumber === 1) {
    const secondLogMessage = draft.log[1]?.split('|')?.[1];
    if (secondLogMessage === 'Draft starting') {
      const secondLogTime = Number(draft.log[1].split('|')[0]);
      return {
        timerTitle: isCurrentUserTurn ? 'Your pick!' : `${playerToPick}'s turn`,
        timerSeconds: turnAllowance - (Date.now() - secondLogTime) / 1000,
      };
    }
  }

  if (currentPickNumber === 41) {
    return {
      timerTitle: 'Draft complete!',
      timerSeconds: 0,
    };
  }

  const lastPickNumber = pickNumbers[pickNumbers.length - 1];
  const latestTimestamp = Number(draft.picks[lastPickNumber].timestamp);
  return {
    timerTitle: isCurrentUserTurn ? 'Your pick!' : `${playerToPick}'s turn`,
    timerSeconds: turnAllowance - (Date.now() - latestTimestamp) / 1000,
  };
};
