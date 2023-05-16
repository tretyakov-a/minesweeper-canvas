import config from '@src/js/config';
import gameState from '@src/js/game-state';
import GameObject from '../game-object';
import Cell from './cell';
import { options } from '../utils';

export default class Grid extends GameObject {
  constructor(...props) {
    super(...props);

    this.addCells();
  }

  addCells = () => {
    const { borderWidth, cellSize } = config;
    const { cellKeys } = gameState;
    for (const cellKey of cellKeys) {
      const cellState = gameState.getCell(cellKey);
      const { x: row, y: col } = cellKey;
      const x = borderWidth + col * borderWidth + col * cellSize;
      const y = borderWidth + row * borderWidth + row * cellSize;
      this.add(`cell/${row}-${col}`, Cell, options(x, y), cellState);
    }
  };

  reset = () => {
    const { cellKeys } = gameState;
    for (const { x: row, y: col } of cellKeys) {
      this.remove(`cell/${row}-${col}`);
    }
    super.reset();
    this.addCells();
  };

  draw(ctx) {
    super.draw(ctx);
  }
}
