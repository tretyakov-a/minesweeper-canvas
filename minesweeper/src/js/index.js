import '../styles/index.scss';
import initLayout from './layout';
import GameCanvas from './canvas';
import { loadResources } from './resources';
import gameState from './game-state';
import { showResults } from './ui/results';
import difficulty from './difficulty';
import { RESULT } from './constants';

let currentDifficulty = 'easy';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadResources();
  } catch (err) {
    return console.log(`Failed to load resource: ${err.message}`);
  }

  initLayout();

  gameState.reset(difficulty[currentDifficulty]);
  gameState.addEventListener(RESULT.WIN, () => {
    showResults({
      difficulty: currentDifficulty,
      result: RESULT.WIN,
      time: gameState.time,
    });
  });
  gameState.addEventListener(RESULT.LOSS, () => {
    showResults({
      difficulty: currentDifficulty,
      result: RESULT.LOSS,
      time: gameState.time,
    });
  });

  const gameCanvas = new GameCanvas(document.querySelector('#game'));
});
