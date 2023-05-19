import config from '@src/js/config';
import gameState from '@src/js/game-state';
import { MOUSE } from '@src/js/constants';
import Cell from './cell';
import { gameObjectOptions } from '../core/utils';
import CachedGameObject from '../core/cached-game-object';

const cellName = (row, col) => `cell/${row}-${col}`;

export default class Grid extends CachedGameObject {
  constructor(...props) {
    super(...props);

    this.addCells();
    this.addEventListener('mousedown', this.handleMouseDown);
    this.setCursor('pointer');
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
    const { getCellSize } = config;
    const cellSize = getCellSize(gameState.difficultyKey);
    const { cellKeys } = gameState;
    for (const cellKey of cellKeys) {
      const cellState = gameState.getCell(cellKey);
      const { x: row, y: col } = cellKey;
      const x = col * cellSize;
      const y = row * cellSize;
      this.add(cellName(row, col), Cell, gameObjectOptions(x, y, cellSize, cellSize), cellState);
    }
  };

  update() {
    return true;
  }

  reset() {
    if (!gameState.isDifficultyChanged) {
      super.reset();
    }
  }

  checkMousePosition(e, onContains) {
    const { offsetX, offsetY } = e.detail;
    const { getCellSize, headerHeight } = config;
    const cellSize = getCellSize(gameState.difficultyKey);
    const row = Math.floor((offsetY - headerHeight) / cellSize);
    const col = Math.floor(offsetX / cellSize);
    const key = cellName(row, col);
    const obj = this.objects.get(key);
    if (obj !== undefined && offsetX >= obj.offset.x && offsetY >= obj.offset.y) {
      onContains(obj, key);
      return true;
    }
    return false;
  }

  draw(ctx) {
    this.drawCached(ctx);
  }
}
