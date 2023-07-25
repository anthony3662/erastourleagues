import { Lineup } from './lineup';
import { League } from './league';
import { Outfit } from './outfit';
import { Album } from '../constants/album';
import { SurpriseSong } from './surpriseSong';

export type LeaderboardLineup = {
  _id: string;
  username: string;
  league: League;
  concertId: number;
  starters: Outfit[];
  bench: Outfit[];
  guitarAlbum: Album;
  guitarSong: SurpriseSong;
  pianoAlbum: Album;
  pianoSong: SurpriseSong;
  score: number;
  outcome: 'win' | 'loss' | 'tie' | null;
};

export type Leaderboard = {
  concertId: number;
  winners: LeaderboardLineup[];
};
