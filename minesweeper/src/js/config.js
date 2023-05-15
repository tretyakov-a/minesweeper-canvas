const createDifficulty = (width, height, mines) => ({
  width,
  height,
  mines,
});

export const difficulty = {
  easy: createDifficulty(10, 10, 10),
  medium: createDifficulty(15, 15, 40),
  expert: createDifficulty(25, 25, 99),
};

export default {
  borderWidth: 1,
  cellSize: 20,
  headerHeight: 40,
  difficulty: difficulty.easy,
};
