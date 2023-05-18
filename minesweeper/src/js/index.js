import '../styles/index.scss';
import initLayout from './layout';
import GameCanvas from './canvas';
import { loadResources } from './resources';
import gameState from './game-state';
import { showModal } from './ui/modal';
import difficulty from './difficulty';

let currentDifficulty = 'easy';

document.addEventListener('DOMContentLoaded', async () => {
  initLayout();

  try {
    await loadResources();
  } catch (err) {
    return console.log(`Failed to load resource: ${err.message}`);
  }

  gameState.reset(difficulty[currentDifficulty]);
  gameState.addEventListener('win', () => {
    showModal({
      difficulty: currentDifficulty,
      result: 'win',
      time: gameState.time,
    });
  });
  gameState.addEventListener('lose', () => {
    showModal({
      difficulty: currentDifficulty,
      result: 'lose',
      time: gameState.time,
    });
  });

  const gameCanvas = new GameCanvas(document.querySelector('#game'));
});
