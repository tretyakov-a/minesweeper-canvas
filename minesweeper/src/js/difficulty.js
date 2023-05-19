import { DIFFICULTY } from './constants';

const createDifficulty = (width, height, mines) => ({
  width,
  height,
  mines,
});

const difficulty = {
  [DIFFICULTY.EASY]: createDifficulty(10, 10, 10),
  [DIFFICULTY.MEDIUM]: createDifficulty(15, 15, 40),
  [DIFFICULTY.EXPERT]: createDifficulty(25, 25, 99),
};

export default difficulty;
