import { Outfit } from './outfit';

export type Trade = {
  _id: string;
  leagueId: string;
  senderUsername: string;
  recipientUsername: string;
  myPayment: Outfit[];
  recipientPayment: Outfit[];
  expiresAt: string;
};
