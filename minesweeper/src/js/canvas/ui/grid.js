import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { MOUSE } from '@src/js/constants';
import GameObject from '../game-object';
import Cell from './cell';
import { options } from '../utils';

const cellName = (row, col) => `cell/${row}-${col}`;

export default class Grid extends GameObject {
  constructor(...props) {
    super(...props);

    this.addCells();
    this.addEventListener('mousedown', this.handleMouseDown);
  }

  handleMouseDown = (e) => {
    gameState.isMouseDown = e.detail.button === MOUSE.LEFT;

    if (gameState.isMouseDown) {
      document.addEventListener('mouseup', this.documentMouseUp);
    }
  };

  documentMouseUp = (e) => {
    document.removeEventListener('mouseup', this.documentMouseUp);
    gameState.isMouseDown = false;
  };

  addCells = () => {
    const { borderWidth, cellSize } = config;
    const { cellKeys } = gameState;
    for (const cellKey of cellKeys) {
      const cellState = gameState.getCell(cellKey);
      const { x: row, y: col } = cellKey;
      const x = borderWidth + col * borderWidth + col * cellSize;
      const y = borderWidth + row * borderWidth + row * cellSize;
      this.add(cellName(row, col), Cell, options(x, y), cellState);
    }
  };

  reset = () => {
    const { cellKeys } = gameState;
    for (const { x: row, y: col } of cellKeys) {
      this.remove(cellName(row, col));
    }
    super.reset();
    this.addCells();
  };

  checkMousePosition(e, onContains) {
    const { offsetX, offsetY } = e.detail;
    const { borderWidth, cellSize, headerHeight } = config;
    const size = cellSize + borderWidth;
    const row = Math.floor((offsetY - headerHeight) / size);
    const col = Math.floor(offsetX / size);
    const key = cellName(row, col);
    const obj = this.objects.get(key);
    if (obj !== undefined && offsetX >= obj.offset.x && offsetY >= obj.offset.y) {
      onContains(obj, key);
    }
  }

  draw(ctx) {
    super.draw(ctx);
  }
}
