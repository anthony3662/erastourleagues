export type League = {
  _id: string;
  creatorUsername: string;
  name: string;
  createdAt: string;
  playerUsernames: string[];
  playerCapacity: number;
  status: 'predraft' | 'drafting' | 'active';
  draftTime?: string;
  firstConcert?: number;
};
