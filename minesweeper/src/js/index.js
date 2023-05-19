import '../styles/index.scss';
import initLayout from './layout';
import GameCanvas from './canvas';
import { loadResources } from './resources';
import gameState from './game-state';
import { showResults } from './ui/results';
import { DIFFICULTY } from './constants';
import { initResults } from './ui/results';
import { initMenu, hideMenu } from './ui/menu';
import { initSettings, applySettings } from './ui/settings';

let gameCanvas = null;

const createGameCanvas = () => {
  if (gameCanvas !== null) gameCanvas.destroy();
  const container = document.querySelector('#game');
  container.innerHTML = '';
  gameCanvas = new GameCanvas(container);
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadResources();
  } catch (err) {
    return console.log(`Failed to load resource: ${err.message}`);
  }

  initLayout();

  gameState.reset(DIFFICULTY.EASY);
  gameState.addEventListener('gameOver', (e) => {
    const { result } = e.detail;
    showResults({
      difficulty: gameState.difficultyKey,
      result: result,
      time: gameState.time,
    });
  });

  createGameCanvas();

  initResults();

  initMenu({
    onClose: () => {
      applySettings();
    },
  });

  initSettings({
    onSubmit: () => {
      hideMenu();
    },
    onDifficultyChange: () => {
      createGameCanvas();
    },
  });
});
