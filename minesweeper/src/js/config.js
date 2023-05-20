import { DIFFICULTY } from './constants';

const config = {
  getCellSize: (difficulty) => (difficulty === DIFFICULTY.EXPERT ? 20 : 24),
  flagSize: 12,
  mineSize: 14,
  headerHeight: 40,
  counterWidth: 50,
  resetBtnSize: 30,
};

export default config;
