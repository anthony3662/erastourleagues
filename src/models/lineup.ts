import { Outfit } from './outfit';
import { Album } from '../constants/album';
import { SurpriseSong } from './surpriseSong';

export type Lineup = {
  _id: string;
  username: string;
  league: string;
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
