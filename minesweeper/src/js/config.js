const createDifficulty = (width, height, mines) => ({
  width,
  height,
  mines,
});

export const difficulty = {
  easy: createDifficulty(9, 9, 10),
  medium: createDifficulty(16, 16, 40),
  expert: createDifficulty(30, 16, 99),
};

export default {
  borderWidth: 1,
  cellSize: 20,
  difficulty: difficulty.easy,
};
