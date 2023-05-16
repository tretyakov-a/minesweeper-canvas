import '../styles/index.scss';
import initLayout from './layout';
import GameCanvas from './canvas';
import { loadResources } from './resources';
import gameState from './game-state';

document.addEventListener('DOMContentLoaded', async () => {
  initLayout();

  try {
    await loadResources();
  } catch (err) {
    return console.log(`Failed to load resource: ${err.message}`);
  }

  gameState.reset();
  gameState.addEventListener('win', () => {
    console.log('Win!');
  });
  gameState.addEventListener('lose', (e) => {
    console.log('Lose!', e.detail);
  });

  const gameCanvas = new GameCanvas(document.querySelector('#game'));
});
