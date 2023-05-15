import '../styles/index.scss';
import initLayout from './layout';
import GameCanvas from './canvas';
import config from '@src/js/config';
import { loadResources } from './resources';
import gameState from './game-state';

let endGameMessage = null;

document.addEventListener('DOMContentLoaded', async () => {
  initLayout();
  endGameMessage = document.querySelector('.end-game-message');

  try {
    await loadResources();
  } catch (err) {
    return console.log(`Failed to load resource: ${err.message}`);
  }

  gameState.reset();
  gameState.addEventListener('win', () => {
    endGameMessage.textContent = 'Win!';
  });
  gameState.addEventListener('lose', (e) => {
    endGameMessage.textContent = `Lose!`;
  });

  const gameCanvas = new GameCanvas(document.querySelector('#game'));

  document.querySelector('#game button').addEventListener('click', () => {
    gameState.reset();
  });
});
