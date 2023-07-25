import Mirrorball1 from './mirrorball.jpeg';
import Mirrorball2 from './mirrorball2.jpeg';
import Mirrorball3 from './mirrorball3.jpeg';

const images = [Mirrorball1, Mirrorball2, Mirrorball3];
export const getRandomMirrorball = () => {
  const index = Math.floor(Math.random() * 3);
  return images[index];
};
