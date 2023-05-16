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

    this.highlighted = {
      targetKey: null,
      cellKeys: [],
    };

    this.addCells();
    this.addEventListener('mousedown', this.handleMouseDown);
    gameState.addEventListener('lose', this.handleLose);
  }

  handleLose = (e) => {
    const { mineKey, wrongFlagsKeys } = e.detail;
    for (const { x, y } of [mineKey, ...wrongFlagsKeys]) {
      this.get(cellName(x, y)).erroneouslyHighlighted = true;
    }
  };

  handleMouseDown = (e) => {
    document.addEventListener('mouseup', this.documentMouseUp);
    this.addEventListener('mousemove', this.highlightCells);

    gameState.isMouseDown = e.detail.button === MOUSE.LEFT;
    this.highlightCells(e);
  };

  documentMouseUp = (e) => {
    document.removeEventListener('mouseup', this.documentMouseUp);
    this.removeEventListener('mousemove', this.highlightCells);
    gameState.isMouseDown = false;
    this.unhighlightCells();
  };

  unhighlightCells = () => {
    for (const { x, y } of this.highlighted.cellKeys) {
      this.get(cellName(x, y)).isHighlighted = false;
    }
    this.highlighted = {
      targetKey: null,
      cellKeys: [],
    };
  };

  highlightCells = (e) => {
    this.checkMousePosition(e, ({ state: { key, isOpened } }) => {
      if (!isOpened || this.highlighted.targetKey === key) return;
      this.unhighlightCells();
      this.highlighted.targetKey = key;
      this.highlighted.cellKeys = gameState.getHighlightedCells(key);
      for (const { x, y } of this.highlighted.cellKeys) {
        this.get(cellName(x, y)).isHighlighted = true;
      }
    });
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
