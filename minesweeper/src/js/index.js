import '../styles/index.scss';
import initLayout from './layout';
import Cell from './cell';
import GameCanvas from './game-canvas';
import config from './config';

const createCells = () => {
  const cells = [];
  const {
    difficulty: { width, height },
    borderWidth,
    cellSize,
  } = config;
  for (let i = 0; i < width; i += 1) {
    for (let j = 0; j < height; j += 1) {
      const x = borderWidth + j * borderWidth + j * cellSize;
      const y = borderWidth + i * borderWidth + i * cellSize;
      cells.push(new Cell(x, y));
    }
  }
  return cells;
};

document.addEventListener('DOMContentLoaded', () => {
  initLayout();

  const cells = createCells();
  const gameCanvas = new GameCanvas(document.querySelector('#game'), cells);
});
