import { DIFFICULTY, RESULT } from './constants';

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function renderNumber(n, len = 3) {
  const s = n.toString();

  return s.length < len ? '0'.repeat(len - s.length) + s : s;
}

function isClickOutside(e, classNames) {
  const composed = e.composedPath();

  return classNames.every(
    (className) => !composed.find((el) => el.classList && el.classList.contains(className))
  );
}

function renderTime(timeMs) {
  const ms = renderNumber(timeMs % 1000, 3);
  const sec = renderNumber(Math.floor(timeMs / 1000), 1);
  return `${sec}.${ms}`;
}

const getRandomStat = () => ({
  difficulty: [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.EXPERT][randomNumber(0, 2)],
  result: RESULT.WIN,
  date: Date.now() - randomNumber(1000, 2000),
  time: randomNumber(7000, 20000),
  clicks: {
    left: randomNumber(20, 30),
    right: randomNumber(10, 20),
    chords: randomNumber(10, 15),
    wasted: randomNumber(10, 15),
  },
});

export const loadSound = (soundSrc) =>
  new Promise((resolve, reject) => {
    const sound = new Audio(soundSrc);
    sound.oncanplaythrough = () => resolve(sound);
    sound.onerror = (err) => reject(err);
  });

export const loadImage = (imageSrc) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });

export { randomNumber, renderNumber, isClickOutside, renderTime, getRandomStat };
