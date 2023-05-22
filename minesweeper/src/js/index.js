import '../styles/index.scss';
import initLayout from './layout';
import GameCanvas from './canvas';
import { resources } from './resources';
import gameState from './game-state';
import { showResults, initResults } from './game-env/results';
import { DIFFICULTY, RESOURCES, RESULT } from './constants';
import { initMenu, hideMenu } from './game-env/menu';
import { settings } from './game-env/settings';
import { addStats, generateStatsContent } from './game-env/statistics';
import config from './config';

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

    const gameOverSound =
      gameResult.result === RESULT.WIN ? RESOURCES.SOUND.WIN : RESOURCES.SOUND.LOSS;

    setTimeout(() => {
      resources.playSound(gameOverSound);
      showResults(gameResult);
      if (!gameState.isCustom) addStats({ ...gameResult, date });
    }, config.gameOverModalDelay);
  });

  initResults();

  initMenu({
    onOpen: () => {
      generateStatsContent();
    },
  });

  settings.addEventListener('difficultyChange', (e) => {
    if (gameState.handleDifficultyChange(e.detail)) {
      createGameCanvas();
    }
    hideMenu();
  });
  settings.init();

  createGameCanvas();
});
