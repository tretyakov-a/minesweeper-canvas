import '../styles/index.scss';
import initLayout from './layout';
import GameCanvas from './canvas';
import { resources } from './resources';
import gameState from './game-state';
import { showResults, initResults } from './game-env/results';
import { DIFFICULTY } from './constants';
import { initMenu, hideMenu } from './game-env/menu';
import { initSettings, applySettings } from './game-env/settings';
import { addStats, generateStatsContent } from './game-env/statistics';
import { getRandomStat } from './helpers';

let gameCanvas = null;

const createGameCanvas = () => {
  if (gameCanvas !== null) gameCanvas.destroy();
  const container = document.querySelector('#game');
  container.innerHTML = '';
  gameCanvas = new GameCanvas(container);
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await resources.load();
  } catch (err) {
    return console.log(`Failed to load resource: ${err.message}`);
  }

  initLayout();

  gameState.reset(DIFFICULTY.EASY);

  gameState.addEventListener('gameOver', () => {
    const date = Date.now();
    const gameResult = gameState.getGameResult();
    showResults(gameResult);
    if (!gameState.isCustom) addStats({ ...gameResult, date });
  });

  createGameCanvas();

  initResults();

  initMenu({
    onOpen: () => {
      generateStatsContent();
    },
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
