import mineSrc from '@src/assets/mine.svg';
import closedSrc from '@src/assets/closed.svg';
import openedSrc from '@src/assets/opened.svg';
import flaggedSrc from '@src/assets/flagged.svg';
import flagSrc from '@src/assets/flag.svg';
import playingSrc from '@src/assets/playing.png';
import loseSrc from '@src/assets/lose.png';
import winSrc from '@src/assets/win.png';

export const resources = {
  mine: mineSrc,
  closed: closedSrc,
  opened: openedSrc,
  flagged: flaggedSrc,
  flag: flagSrc,
  playing: playingSrc,
  lose: loseSrc,
  win: winSrc,
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
