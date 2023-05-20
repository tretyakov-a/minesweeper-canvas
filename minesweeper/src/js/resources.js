import mineSrc from '@src/assets/mine.svg';
import flagSrc from '@src/assets/flag.svg';
import playingSrc from '@src/assets/playing.png';
import loseSrc from '@src/assets/loss.png';
import winSrc from '@src/assets/win.png';
import mouseSrc from '@src/assets/hand.svg';
import clockSrc from '@src/assets/clock.svg';
import WebFont from 'webfontloader';

export const RESOURCES = {
  MINE: 'mine',
  FLAG: 'flag',
  PLAYING: 'playing',
  LOSS: 'loss',
  WIN: 'win',
  MOUSE: 'mouse',
  CLOCK: 'clock',
};

export const resources = {
  [RESOURCES.MINE]: mineSrc,
  [RESOURCES.FLAG]: flagSrc,
  [RESOURCES.PLAYING]: playingSrc,
  [RESOURCES.LOSS]: loseSrc,
  [RESOURCES.WIN]: winSrc,
  [RESOURCES.MOUSE]: mouseSrc,
  [RESOURCES.CLOCK]: clockSrc,
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

  await new Promise((resolve) => {
    WebFont.load({
      google: {
        families: ['Martian Mono:100,300,400,700'],
      },
      active: resolve,
    });
  });
};
