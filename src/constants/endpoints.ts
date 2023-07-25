import { League } from '../models/league';
import { Invitation } from '../models/invitation';
import { Draft } from '../models/draft';
import { Outfit } from '../models/outfit';
import { Concert } from '../models/concert';
import { Lineup } from '../models/lineup';
import { User } from '../models/user';
import { SurpriseSong } from '../models/surpriseSong';
import { Album } from './album';
import { Trade } from '../models/trade';
import { Leaderboard } from '../models/leaderboard';
export const AUTHENTICATED_BASE = process.env.REACT_APP_ENV === 'prod' ? 'https://api.erastourleagues.com' : 'http://localhost:3001';
export const PUBLIC_BASE = process.env.REACT_APP_ENV === 'prod' ? 'https://pub.swiftball.mom' : '';
export const ENDPOINTS = {
  acceptInvite: `${AUTHENTICATED_BASE}/invite/accept`,
  acceptTrade: `${AUTHENTICATED_BASE}/gameboard/accept-trade`,
  accountSetup: `${AUTHENTICATED_BASE}/identity/account-setup`,
  allPublic: `${PUBLIC_BASE}/public/everything`,
  closeConcert: `${AUTHENTICATED_BASE}/admin/close-concert`,
  concerts: `${PUBLIC_BASE}/public/concerts`,
  createInvite: `${AUTHENTICATED_BASE}/invite/create-invite`,
  createLeague: `${AUTHENTICATED_BASE}/league/create-league`,
  declineInvite: `${AUTHENTICATED_BASE}/invite/decline`,
  deleteTrade: `${AUTHENTICATED_BASE}/gameboard/delete-trade`,
  gameboard: `${AUTHENTICATED_BASE}/gameboard/gameboard`,
  getDraft: `${AUTHENTICATED_BASE}/league/draft`,
  googleSignIn: `${AUTHENTICATED_BASE}/identity/google-signin`,
  leagueDetails: `${AUTHENTICATED_BASE}/league/league-details`,
  leagueInvites: `${AUTHENTICATED_BASE}/invite/league-invites`,
  leagues: `${AUTHENTICATED_BASE}/league/leagues`,
  lineups: `${AUTHENTICATED_BASE}/gameboard/lineups`,
  logout: `${AUTHENTICATED_BASE}/identity/logout`,
  myInvites: `${AUTHENTICATED_BASE}/invite/my-invites`,
  offerTrade: `${AUTHENTICATED_BASE}/gameboard/offer-trade`,
  outfits: `${PUBLIC_BASE}/public/outfits`,
  pickOutfit: `${AUTHENTICATED_BASE}/league/pick-outfit`,
  saveSurpriseSongs: `${AUTHENTICATED_BASE}/admin/save-surprise-songs`,
  scheduleDraft: `${AUTHENTICATED_BASE}/league/schedule-draft`,
  setSurpriseSongs: `${AUTHENTICATED_BASE}/gameboard/set-surprise-songs`,
  surpriseSongs: `${PUBLIC_BASE}/public/surprise-songs`,
  swapOutfits: `${AUTHENTICATED_BASE}/gameboard/swap-outfits`,
  trades: `${AUTHENTICATED_BASE}/gameboard/get-trades`,
  updateOutfits: `${AUTHENTICATED_BASE}/admin/update-outfits`,
  usernameCheck: `${AUTHENTICATED_BASE}/identity/username-check`,
  validateSession: `${AUTHENTICATED_BASE}/identity/validate-session`,
};

export type Endpoint = keyof typeof ENDPOINTS;

export type UsernameCheckResponse = {
  isValid: boolean;
  message: string;
};

export type LeaguesResponse = {
  leagues: League[];
};

export type CreateLeagueResponse = {
  success: boolean;
  league: League;
};

export type LeagueDetailsResponse = {
  league: League;
};

export type CreateInviteResponse = {
  success: boolean;
  message: string;
  invite?: Invitation;
};

export type MyInvitesResponse = {
  invites: {
    _id: string;
    createdAt: string;
    email: string;
    expiresAt: string;
    league: League;
  }[];
};

export type AcceptInviteResponse = {
  success: boolean;
  message?: string;
};

export type DeclineInviteResponse = {
  success: boolean;
  message?: string;
};

export type LeagueInvitesResponse = {
  invites: Invitation[];
};

export type ScheduleDraftResponse = {
  success: boolean;
};

export type GetDraftParams = {
  leagueId: string;
};

export type GetDraftResponse = {
  draft: Draft;
  outfits: Outfit[];
};

export type PickOutfitParams = {
  leagueId: string;
  pickNumber: number;
  serialId: number;
};

export type PickOutfitResponse = {
  success: boolean;
};

export type GameboardParams = {
  leagueId: string;
  usernames: string[];
  firstConcert: number;
};

export type GameboardResponse = {
  currentConcert: Concert | null;
  lineups: Lineup[] | null;
  allLeagueConcerts: Concert[];
  matchups: number[];
  users: { [key: string]: User };
  records: { [key: string]: { win: number; loss: number; tie: number; seasonPoints: number; username: string } };
};

export type LineupsParams = {
  leagueId: string;
  usernames: string[];
  concertId: number;
};

export type LineupsResponse = {
  lineups: Lineup[] | null;
  matchups: number[];
};

export type ConcertsResponse = {
  concerts: Concert[];
  currentConcert: Concert | null;
};

export type OutfitsResponse = {
  outfits: Outfit[];
};

export type SurpriseSongsResponse = {
  surpriseSongs: SurpriseSong[];
};

export type AllPublicResponse = {
  concerts: Concert[];
  currentConcert: Concert | null;
  outfits: Outfit[];
  surpriseSongs: SurpriseSong[];
  leaderboards: Leaderboard[];
};

export type SaveSurpriseSongsParams = {
  concertId: number;
  guitarSongId: string | null;
  pianoSongId: string | null;
};

export type SaveSurpriseSongsResponse = {
  updatedConcert: Concert;
};

export type UpdateOutfitsParams = {
  concertId: number;
  outfitIds: string[];
};

export type UpdateOutfitsResponse = {
  updatedConcert: Concert;
};

export type CloseConcertParams = {
  concertId: number;
};

export type CloseConcertResponse = {
  success: boolean;
};

export type SetSurpriseSongsParams = {
  leagueId: string;
  guitarAlbum?: Album;
  guitarSongId?: string;
  pianoAlbum?: Album;
  pianoSongId?: string;
};

export type SetSurpriseSongsResponse = {
  updatedLineup: Lineup;
};

export type SwapOutfitsParams = {
  leagueId: string;
  newStarterId: string;
  newBenchId: string;
};

export type SwapOutfitsResponse = {
  updatedLineup: Lineup;
};

export type OfferTradeParams = {
  leagueId: string;
  myPayment: string[];
  recipientPayment: string[];
  recipientUsername: string;
};

export type OfferTradeResponse = {
  newTrade: Trade;
};

export type GetTradesParams = {
  leagueId: string;
};

export type GetTradesResponse = {
  trades: Trade[];
};

export type DeleteTradesParams = {
  tradeId: string;
};

export type DeleteTradesResponse = {
  success: boolean;
};

export type AcceptTradeParams = {
  tradeId: string;
};

export type AcceptTradeResponse = {
  newSenderLineup: Lineup;
  newRecipientLineup: Lineup;
};
