import { OutfitCategory } from '../constants/outfitCategory';

export type Outfit = {
  _id: string;
  name: string;
  serialId: number;
  description: string | null;
  designer: string | null;
  category: OutfitCategory;
  pointValue: number;
  image: string;
};
