import '../styles/index.scss';
import initLayout from './layout';
import GameCanvas from './game-canvas';
import config from './config';
import { loadResources } from './resources';
import GameState from './game-state';

let endGameMessage = null;

document.addEventListener('DOMContentLoaded', async () => {
  initLayout();
  endGameMessage = document.querySelector('.end-game-message');

  try {
    await loadResources();

    const gameState = new GameState(config.difficulty);
    gameState.reset();
    gameState.addEventListener('win', () => {
      endGameMessage.textContent = 'Win!';
    });
    gameState.addEventListener('lose', (e) => {
      endGameMessage.textContent = `Lose!`;
    });
    const gameCanvas = new GameCanvas(document.querySelector('#game'), gameState);

    document.querySelector('#game button').addEventListener('click', () => {
      gameState.reset();
    });
  } catch (err) {
    console.log(`Failed to load resource: ${err.message}`);
  }
});
