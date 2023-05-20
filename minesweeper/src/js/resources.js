import mineLightSrc from '@src/assets/mine-light.svg';
import flagLightSrc from '@src/assets/flag-light.svg';
import mineDarkSrc from '@src/assets/mine-dark.svg';
import flagDarkSrc from '@src/assets/flag-dark.svg';
import playingSrc from '@src/assets/playing.png';
import loseSrc from '@src/assets/loss.png';
import winSrc from '@src/assets/win.png';
import mouseSrc from '@src/assets/hand.svg';
import clockSrc from '@src/assets/clock.svg';
import WebFont from 'webfontloader';
import { THEME } from './constants';

export const RESOURCES = {
  MINE: 'mine',
  FLAG: 'flag',
  PLAYING: 'playing',
  LOSS: 'loss',
  WIN: 'win',
  MOUSE: 'mouse',
  CLOCK: 'clock',
};

const resourcesLight = {
  [RESOURCES.MINE]: mineLightSrc,
  [RESOURCES.FLAG]: flagLightSrc,
  [RESOURCES.PLAYING]: playingSrc,
  [RESOURCES.LOSS]: loseSrc,
  [RESOURCES.WIN]: winSrc,
  [RESOURCES.MOUSE]: mouseSrc,
  [RESOURCES.CLOCK]: clockSrc,
};

const resourcesDark = {
  [RESOURCES.MINE]: mineDarkSrc,
  [RESOURCES.FLAG]: flagDarkSrc,
};

export const resources = {};

const loadImage = (imageSrc) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });

export const loadResources = async () => {
  const imagesLight = await Promise.all(Object.values(resourcesLight).map(loadImage));
  Object.keys(resourcesLight).forEach((key, i) => {
    resourcesLight[key] = imagesLight[i];
  });

  const imagesDark = await Promise.all(Object.values(resourcesDark).map(loadImage));
  Object.keys(resourcesDark).forEach((key, i) => {
    resourcesDark[key] = imagesDark[i];
  });

  resources[THEME.LIGHT] = {
    ...resourcesLight,
  };
  resources[THEME.DARK] = {
    ...resourcesLight,
    ...resourcesDark,
  };

  await new Promise((resolve) => {
    WebFont.load({
      google: {
        families: ['Martian Mono:100,300,400,700'],
      },
      active: resolve,
    });
  });
};
