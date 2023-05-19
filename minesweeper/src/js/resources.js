import mineSrc from '@src/assets/mine.svg';
import flagSrc from '@src/assets/flag.svg';
import playingSrc from '@src/assets/playing.png';
import loseSrc from '@src/assets/loss.png';
import winSrc from '@src/assets/win.png';

export const RESOURCES = {
  MINE: 'mine',
  FLAG: 'flag',
  PLAYING: 'playing',
  LOSS: 'loss',
  WIN: 'win',
};

export const resources = {
  [RESOURCES.MINE]: mineSrc,
  [RESOURCES.FLAG]: flagSrc,
  [RESOURCES.PLAYING]: playingSrc,
  [RESOURCES.LOSS]: loseSrc,
  [RESOURCES.WIN]: winSrc,
};

const loadImage = (imageSrc) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });

export const loadResources = async () => {
  const images = await Promise.all(Object.values(resources).map(loadImage));

  Object.keys(resources).forEach((key, i) => {
    resources[key] = images[i];
  });
};
