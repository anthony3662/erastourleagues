import { Outfit } from './outfit';

export type Draft = {
  _id: string;
  league: string;
  picks: {
    [key: string]: {
      timestamp: string;
      method: 'manual' | 'auto';
      outfit: Outfit;
      _id: string;
    };
  };
  log: string[];
};
