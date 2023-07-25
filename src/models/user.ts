import { AVATARS } from '../constants/avatar';

export type User = {
  _id: string;
  username: string;
  isAdmin: boolean;
  email: string;
  avatar: AVATARS;
  createdAt: string;
  leagues: string[];
};
