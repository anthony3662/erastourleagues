import React, { useEffect, useState } from 'react';
import { League } from '../../../../models/league';
import { useRequest } from '../../../../utils/useRequest';
import { ENDPOINTS, GetDraftParams, GetDraftResponse, PickOutfitParams, PickOutfitResponse } from '../../../../constants/endpoints';
import { useSocket } from '../../../../services/useSocket';
import { useAuthentication } from '../../../../services/useAuthentication';
import { Draft } from '../../../../models/draft';
import { DraftPanel, DraftGrid, DraftColumnHeader, DraftColumn, Wrapper, ActionPanel } from './Drafting.styles';
import { OutfitCell } from './OutfitCell';
import { Backdrop, CircularProgress } from '@mui/material';
import { useTimer } from './useTimer';
import { DraftTimer } from './DraftTimer';
import { SelectionPanel } from './SelectionPanel';
import { TimerCell, Cell } from './OutfitCell.styles';
import { ModalIfMobile } from '../../../../components/ModalIfMobile';
import { Breakpoints } from '../../../../theme/breakpoints';

export const Drafting: React.FC<{ league: League }> = ({ league }) => {
  const { latestDraftPickState } = useSocket();
  const { post: fetchDraft, data, isLoading } = useRequest<GetDraftResponse, GetDraftParams>();
  const { user } = useAuthentication();
  const username = user!.username;

  const [draft, setDraft] = useState<Draft | null>(null);
  const [timer, setTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timerProps = useTimer(league, draft);

  useEffect(() => {
    fetchDraft({ endpoint: ENDPOINTS.getDraft, body: { leagueId: league._id } });
  }, []);

  // initial state uses fetch
  // state kept updated using socket
  useEffect(() => {
    if (latestDraftPickState) {
      setDraft(latestDraftPickState);
    } else if (data?.draft) {
      setDraft(data.draft);
    }
  }, [latestDraftPickState, data]);

  useEffect(() => {
    if (timerProps.timerTitle === 'Your pick!') {
      setIsModalOpen(true);
    }
  }, [timerProps.timerTitle]);

  if (isLoading || !draft || !data) {
    return (
      <Backdrop sx={{ color: '#fff' }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  const { outfits } = data;

  // Extracting relevant information from the draft object
  const { picks, log } = draft;
  const pickNumbers = Object.keys(picks);
  const currentPickNumber = pickNumbers.length + 1; // Next pick number

  // Get the player usernames in the draft order
  const leagueMembers = league.playerUsernames;

  // Get the outfits that have not been picked yet
  const remainingOutfits = outfits.filter(outfit => !Object.values(picks).some(pick => pick.outfit._id === outfit._id));

  // Determine if it's the current user's turn to make a pick
  const canUserSelect = timerProps.timerTitle === 'Your pick!' && timer > 0;

  const getOutfitCells = () => {
    const columns = [];

    // Calculate the maximum number of cells allowed in a column
    const maxCellsPerColumn = 10;

    // Find the first column with fewer children than the first column
    let columnIndex = 0;
    for (let i = 1; i < leagueMembers.length; i++) {
      const currentColumnChildren = pickNumbers.filter(pickNumber => (parseInt(pickNumber, 10) - 1) % leagueMembers.length === i).length;
      const firstColumnChildren = pickNumbers.filter(pickNumber => (parseInt(pickNumber, 10) - 1) % leagueMembers.length === 0).length;
      if (currentColumnChildren < firstColumnChildren) {
        columnIndex = i;
        break;
      }
    }

    // Add OutfitCells to each column
    for (let i = 0; i < leagueMembers.length; i++) {
      const outfits = pickNumbers
        .filter(pickNumber => (parseInt(pickNumber, 10) - 1) % leagueMembers.length === i)
        .map(pickNumber => picks[pickNumber].outfit);

      const columnChildren = outfits.map((outfit, index) => <OutfitCell key={index} outfit={outfit} />);

      // Add TimerCell if columnIndex matches the current column index
      if (i === columnIndex && columnChildren.length < maxCellsPerColumn) {
        columnChildren.push(
          <DraftTimer
            onClick={() => setIsModalOpen(true)}
            appearance={'cell'}
            title={timerProps.timerTitle}
            seconds={timerProps.timerSeconds}
            key={`cell-timer-${timerProps.timerSeconds}`}
            setTimer={() => {}}
          />,
        );
      }

      // Add BlankCells to reach maxCellsPerColumn
      while (columnChildren.length < maxCellsPerColumn) {
        // key={`blank-${columnChildren.length}`
        columnChildren.push(<Cell key={`blank-${columnChildren.length}`} />);
      }

      columns.push(<DraftColumn key={i}>{columnChildren}</DraftColumn>);
    }

    return columns;
  };

  // Render the drafting interface
  return (
    <Wrapper>
      <DraftPanel>
        <h1>{`${league.name} - Draft in Progress!`}</h1>
        {/* Display the grid with selected outfits */}
        <DraftGrid>
          {/* Render the headers with player usernames */}
          {leagueMembers.map((member, index) => (
            <DraftColumnHeader key={index}>{member}</DraftColumnHeader>
          ))}

          {/* Render the outfit cells */}
          {getOutfitCells()}
        </DraftGrid>
      </DraftPanel>
      <ModalIfMobile breakpoint={Breakpoints.lg} isOpen={isModalOpen} setIsOpen={setIsModalOpen} buttonText={'Outfits'}>
        <ActionPanel>
          <DraftTimer
            appearance={'standard'}
            title={timerProps.timerTitle}
            seconds={timerProps.timerSeconds}
            key={timerProps.timerSeconds}
            setTimer={setTimer}
          />
          <SelectionPanel
            league={league}
            remainingOutfits={remainingOutfits}
            canSelect={canUserSelect}
            currentPickNumber={currentPickNumber}
            closeModal={() => setIsModalOpen(false)}
          />
        </ActionPanel>
      </ModalIfMobile>
    </Wrapper>
  );
};
