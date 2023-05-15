import config from '@src/js/config';
import gameState from '@src/js/game-state';
import CellState from '@src/js/cell-state';
import { MOUSE } from '@src/js/constants';
import { resources } from '@src/js/resources';
import GameObject from '../game-object';

const colors = [
  ,
  '#00418d',
  '#00ba71',
  '#f43545',
  '#5f2879',
  '#ff8901',
  '#00c2de',
  '#fad717',
  'teal',
];

export default class Cell extends GameObject {
  constructor(options, state) {
    const { cellSize } = config;
    super({ ...options, width: cellSize, height: cellSize });

    this.state = state;

    this.addEventListener('mousedown', this.handleMouseDown);
    this.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown = (e) => {
    document.addEventListener('mouseup', this.documentMouseUp);
    gameState.isMouseDown = e.button === MOUSE.LEFT;
  };

  documentMouseUp = (e) => {
    document.removeEventListener('mouseup', this.documentMouseUp);
    gameState.isMouseDown = false;
  };

  handleMouseUp = (e) => {
    if (e.button === MOUSE.LEFT) {
      return gameState.revealCell(this.state.key);
    } else if (e.button === MOUSE.RIGHT) {
      return gameState.flagCell(this.state.key);
    }
  };

  draw(ctx) {
    const {
      offset: { x, y },
    } = this;
    const { cellSize } = config;
    const img =
      this.isHovered && gameState.isMouseDown ? resources.opened : this.getDrawStateImage();
    ctx.drawImage(img, x, y, cellSize, cellSize);

    if (this.state.status !== CellState.STATUS.OPENED) return;

    const value = this.getDrawValue();
    if (value === null) return;
    if (value instanceof Image) {
      ctx.drawImage(value, x + 2, y + 2, cellSize - 4, cellSize - 4);
    } else {
      ctx.fillStyle = colors[this.state.value];
      ctx.fillText(value, x + cellSize / 2, y + cellSize / 2 + 2);
    }
  }

  getDrawStateImage = () => {
    switch (this.state.status) {
      case CellState.STATUS.CLOSED:
        return resources.closed;
      case CellState.STATUS.OPENED:
        return resources.opened;
      case CellState.STATUS.FLAGGED:
        return resources.flagged;
      default:
        return resources.closed;
    }
  };

  getDrawValue = () => {
    if (this.state.isMined) return resources.mine;
    if (this.state.isEmpty) return null;
    return this.state.value;
  };
}
