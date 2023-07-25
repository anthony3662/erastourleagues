import { Outfit } from './outfit';
import { SurpriseSong } from './surpriseSong';

export type Concert = {
  _id: string;
  increasingId: number;
  startTime: string;
  endTime: string;
  region: 'usa' | 'latam' | 'europe' | 'asia' | 'oceania';
  city: string;
  venue: string;
  night: number;
  outfits: Outfit[];
  guitarSong: SurpriseSong | null;
  pianoSong: SurpriseSong | null;
  image: string;
};
