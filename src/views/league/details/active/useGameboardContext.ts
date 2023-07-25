import * as React from 'react';
import { useEffect, useState } from 'react';
import { createContext } from '../../../../utils/createContext';
import { useRequest } from '../../../../utils/useRequest';
import {
  ENDPOINTS,
  GameboardParams,
  GameboardResponse,
  LineupsParams,
  LineupsResponse,
  SetSurpriseSongsParams,
  SetSurpriseSongsResponse,
  SwapOutfitsParams,
  SwapOutfitsResponse,
} from '../../../../constants/endpoints';
import { League } from '../../../../models/league';
import { Concert } from '../../../../models/concert';
import { Lineup } from '../../../../models/lineup';
import { SurpriseSongPointValues } from '../../../../constants/surpriseSongPointValues';
import { usePublicData } from '../../../../services/usePublicData';
import { Album } from '../../../../constants/album';
import findIndex from 'lodash/findIndex';
import { useAuthentication } from '../../../../services/useAuthentication';
import { PlayerConfig } from './LeagueTab/MatchupRow';

type GameboardContext = {
  league?: League;
  initializeBoard: (league: League) => Promise<void>;
  getSelectedConcertObject: () => Concert | null | undefined;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  selectedConcert: number | undefined;
  setSelectedConcert: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentConcert: Concert | null | undefined;
  currentLineups: Lineup[] | null | undefined;
  isCurrentConcertSelected: boolean;
  allLeagueConcerts?: Concert[];
  isLoading: boolean;
  isLineupsLoading: boolean;
  getSelectedConcertLineups: () => Lineup[] | null | undefined;
  getSelectedConcertMatchups: () => number[] | undefined;
  checkSurpriseSongMatches: (lineup: Lineup) => {
    isGuitarAlbumMatch: boolean;
    isGuitarSongMatch: boolean;
    isPianoAlbumMatch: boolean;
    isPianoSongMatch: boolean;
  };
  chooseSurpriseSong: (choices: { guitarAlbum?: Album; guitarSongId?: string; pianoAlbum?: Album; pianoSongId?: string }) => Promise<void>;
  swapOutfit: (params: { newStarterId: string; newBenchId: string }) => Promise<void>;
  getMatchups: () => null | [[PlayerConfig, PlayerConfig], [PlayerConfig, PlayerConfig]];
  getMyMatchup: () => null | [PlayerConfig, PlayerConfig];
  isLineupTransactionLoading: boolean;
  loadExecutedTrade: (senderLineup: Lineup, recipientLineup: Lineup) => void;
  scoreLineup: (lineup: Lineup) => number;
  users?: GameboardResponse['users'];
  records?: GameboardResponse['records'];
};

/**
 * Context wrapped around the <ActiveLeague /> component.
 * Manages which show is selected, and provides concert info and lineups for that show
 * as well as utils to perform calculations with the selected show.
 */

const [useGameboardContext, GameboardProvider, gameboardContext] = createContext<GameboardContext>(() => {
  const { user } = useAuthentication();
  const [league, setLeague] = useState<League | undefined>();
  const { post: fetchBoard, isLoading, data: gameboardData } = useRequest<GameboardResponse, GameboardParams>();
  const { post: getLineups, isLoading: isLineupsLoading, data: lineupsData } = useRequest<LineupsResponse, LineupsParams>();
  const { post: postSurpriseSongs, isLoading: setSongsLoading } = useRequest<SetSurpriseSongsResponse, SetSurpriseSongsParams>();
  const { post: postOutfitSwap, isLoading: outfitSwapLoading } = useRequest<SwapOutfitsResponse, SwapOutfitsParams>();

  const { currentConcert } = usePublicData();
  // we'll keep this field updated as user completes lineup transactions
  // value is used directly on the trades tab, as this tab functions the same regardless of the date in the dropdown.
  const [currentLineups, setCurrentLineups] = useState<Lineup[] | null | undefined>();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedConcert, setSelectedConcert] = useState<number | undefined>();

  useEffect(() => {
    if (gameboardData && league) {
      setCurrentLineups(gameboardData.lineups);

      const currentConcert = gameboardData.currentConcert?.increasingId;
      const lastConcert = gameboardData?.allLeagueConcerts[gameboardData?.allLeagueConcerts.length - 1].increasingId;

      if (league.firstConcert! > (gameboardData.currentConcert?.increasingId || 1000)) {
        // draft completed in the middle of an event
        setSelectedConcert(league.firstConcert);
      }
      const initialSelection = currentConcert || lastConcert;
      setSelectedConcert(initialSelection);
    }
  }, [gameboardData]);

  useEffect(() => {
    if (league && selectedConcert && selectedConcert !== gameboardData?.currentConcert?.increasingId) {
      getLineups({
        endpoint: ENDPOINTS.lineups,
        body: {
          concertId: selectedConcert,
          usernames: league.playerUsernames,
          leagueId: league._id,
        },
      });
    }
  }, [selectedConcert]);

  const initializeBoard = async (league: League) => {
    setLeague(league);
    const response = await fetchBoard({
      endpoint: ENDPOINTS.gameboard,
      body: {
        leagueId: league._id,
        usernames: league.playerUsernames,
        firstConcert: league.firstConcert!,
      },
    });
  };

  const getSelectedConcertObject: () => Concert | null | undefined = () => {
    if (!gameboardData) {
      return undefined;
    }

    const isCurrentConcertSelected = selectedConcert === gameboardData.currentConcert?.increasingId;
    return isCurrentConcertSelected
      ? currentConcert
      : gameboardData.allLeagueConcerts.find(concert => concert.increasingId === selectedConcert);
  };

  const isCurrentConcertSelected = selectedConcert === currentConcert?.increasingId;

  const getSelectedConcertLineups = () => {
    if (isCurrentConcertSelected) {
      return currentLineups;
    } else {
      return lineupsData?.lineups;
    }
  };

  const getSelectedConcertMatchups = () => {
    if (isCurrentConcertSelected) {
      return gameboardData?.matchups;
    } else {
      return lineupsData?.matchups;
    }
  };

  //shouldn't require live updating based on how we handle data, only currentConcert needs to be updated
  const allLeagueConcerts = gameboardData?.allLeagueConcerts;

  const checkSurpriseSongMatches = (lineup: Lineup) => {
    const concertToScore = getSelectedConcertObject();

    const isGuitarAlbumMatch = concertToScore?.guitarSong?.album === lineup.guitarAlbum;
    const isGuitarSongMatch = concertToScore?.guitarSong?.name === lineup.guitarSong.name;
    const isPianoAlbumMatch = concertToScore?.pianoSong?.album === lineup.pianoAlbum;
    const isPianoSongMatch = concertToScore?.pianoSong?.name === lineup.pianoSong.name;

    return { isGuitarAlbumMatch, isGuitarSongMatch, isPianoAlbumMatch, isPianoSongMatch };
  };

  const scoreLineup = (lineup: Lineup) => {
    const concertToScore = getSelectedConcertObject();
    if (!concertToScore) {
      return 0;
    }

    let songPoints = 0;
    const { isGuitarAlbumMatch, isGuitarSongMatch, isPianoAlbumMatch, isPianoSongMatch } = checkSurpriseSongMatches(lineup);

    if (isGuitarAlbumMatch) {
      songPoints += SurpriseSongPointValues.album;
    }
    if (isGuitarSongMatch) {
      songPoints += SurpriseSongPointValues.song;
    }
    if (isPianoAlbumMatch) {
      songPoints += SurpriseSongPointValues.album;
    }
    if (isPianoSongMatch) {
      songPoints += SurpriseSongPointValues.song;
    }

    const outfitsDisplayed = concertToScore.outfits;
    const outfitsSelected = lineup.starters.map(o => o._id);
    const winningOutfits = outfitsDisplayed.filter(outfit => outfitsSelected.includes(outfit._id));
    const outfitPoints = winningOutfits.reduce((a, v) => a + v.pointValue, 0);
    return songPoints + outfitPoints;
  };

  const updateLineup = (lineup: Lineup) => {
    if (!currentLineups || !user) {
      return;
    }
    const lineups = [...currentLineups];
    const { username } = user;
    const indexToSwap = findIndex(lineups, { username });
    lineups[indexToSwap] = lineup;
    setCurrentLineups(lineups);
  };

  const loadExecutedTrade = (senderLineup: Lineup, recipientLineup: Lineup) => {
    if (!currentLineups) {
      return;
    }
    const lineups = [...currentLineups];
    const senderIndexToSwap = findIndex(lineups, { username: senderLineup.username });
    lineups[senderIndexToSwap] = senderLineup;
    const recipientIndexToSwap = findIndex(lineups, { username: recipientLineup.username });
    lineups[recipientIndexToSwap] = recipientLineup;
    setCurrentLineups(lineups);
  };

  const chooseSurpriseSong = async (choices: { guitarAlbum?: Album; guitarSongId?: string; pianoAlbum?: Album; pianoSongId?: string }) => {
    if (!league) {
      return;
    }
    const response = await postSurpriseSongs({
      endpoint: ENDPOINTS.setSurpriseSongs,
      body: { leagueId: league._id, ...choices },
    });
    if (response.updatedLineup) {
      updateLineup(response.updatedLineup);
    }
  };

  const swapOutfit = async (params: { newStarterId: string; newBenchId: string }) => {
    if (!league) {
      return;
    }
    const response = await postOutfitSwap({
      endpoint: ENDPOINTS.swapOutfits,
      body: { leagueId: league._id, ...params },
    });
    if (response.updatedLineup) {
      updateLineup(response.updatedLineup);
    }
  };

  const getMatchups = () => {
    const lineups = getSelectedConcertLineups();
    const matchups = getSelectedConcertMatchups();

    if (!lineups || !matchups || !gameboardData?.users) {
      return null;
    }

    const { users } = gameboardData;

    const lineupOne = lineups[matchups[0]];
    const lineupTwo = lineups[matchups[1]];
    const userOne = users[lineupOne.username];
    const userTwo = users[lineupTwo.username];

    const lineupThree = lineups[matchups[2]];
    const lineupFour = lineups[matchups[3]];
    const userThree = users[lineupThree.username];
    const userFour = users[lineupFour.username];

    const matchupRowPropsOne: [PlayerConfig, PlayerConfig] = [
      { user: userOne, lineup: lineupOne },
      { user: userTwo, lineup: lineupTwo },
    ];
    const matchupRowPropsTwo: [PlayerConfig, PlayerConfig] = [
      { user: userThree, lineup: lineupThree },
      { user: userFour, lineup: lineupFour },
    ];

    return [matchupRowPropsOne, matchupRowPropsTwo] as [[PlayerConfig, PlayerConfig], [PlayerConfig, PlayerConfig]];
  };

  const getMyMatchup: () => null | [PlayerConfig, PlayerConfig] = () => {
    const matchups = getMatchups();
    if (!matchups || !user) {
      return null;
    }

    const [matchupOne, matchupTwo] = matchups;

    let correctMatchup;
    if (matchupOne[0].user.username === user.username || matchupOne[1].user.username === user.username) {
      correctMatchup = matchupOne;
    } else {
      correctMatchup = matchupTwo;
    }

    if (correctMatchup[0].user.username === user.username) {
      return correctMatchup;
    } else {
      return [correctMatchup[1], correctMatchup[0]];
    }
  };

  return {
    league,
    initializeBoard,
    getSelectedConcertObject,
    activeTab,
    setActiveTab,
    selectedConcert,
    setSelectedConcert,
    currentConcert,
    currentLineups,
    allLeagueConcerts,
    isLoading,
    isLineupsLoading,
    isCurrentConcertSelected,
    getSelectedConcertLineups,
    getSelectedConcertMatchups,
    checkSurpriseSongMatches,
    chooseSurpriseSong,
    swapOutfit,
    getMatchups,
    getMyMatchup,
    isLineupTransactionLoading: setSongsLoading || outfitSwapLoading,
    loadExecutedTrade,
    scoreLineup,
    users: gameboardData?.users,
    records: gameboardData?.records,
  };
});

export { useGameboardContext, GameboardProvider, gameboardContext };
export type { GameboardContext };
