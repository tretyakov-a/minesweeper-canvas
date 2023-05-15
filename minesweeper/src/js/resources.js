import mineSrc from '@src/assets/mine.svg';
import closedSrc from '@src/assets/closed.svg';
import openedSrc from '@src/assets/opened.svg';
import flaggedSrc from '@src/assets/flagged.svg';

export const resources = {
  mine: mineSrc,
  closed: closedSrc,
  opened: openedSrc,
  flagged: flaggedSrc,
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
