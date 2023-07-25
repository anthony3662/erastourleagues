import Benjamin from '../img/avatar/benjamin.png';
import Caticorn from '../img/avatar/caticorn.png';
import Meredith from '../img/avatar/meredith.png';
import Olivia from '../img/avatar/olivia.png';

// These match what's stored on the backend avatar field on the user table.
// Custom avatar upload is not an MVP feature.
export enum AVATARS {
  benjamin = 'benjamin',
  caticorn = 'caticorn',
  meredith = 'meredith',
  olivia = 'olivia',
}

export const AvatarURLS = {
  [AVATARS.benjamin]: Benjamin,
  [AVATARS.caticorn]: Caticorn,
  [AVATARS.meredith]: Meredith,
  [AVATARS.olivia]: Olivia,
};
