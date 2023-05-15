const createDifficulty = (width, height, mines) => ({
  width,
  height,
  mines,
});

const difficulty = {
  easy: createDifficulty(10, 10, 10),
  medium: createDifficulty(15, 15, 40),
  expert: createDifficulty(25, 25, 99),
};

export default difficulty;
